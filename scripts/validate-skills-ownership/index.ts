/// <reference types="node" />

import { readFileSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import process from "node:process";
import { extractFrontmatter } from "../list-skills/extract-frontmatter";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";

/**
 * Validates that a skill has required ownership metadata.
 *
 * @param skillPath - The absolute path to the skill directory.
 * @param skillName - The name of the skill for reporting purposes.
 * @returns An object indicating if the skill is valid and any errors found.
 */
export function validateSkillOwnership(
  skillPath: string,
  skillName: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const skillMdPath = join(skillPath, "SKILL.md");
  const content = readFileSync(skillMdPath, "utf-8");
  const frontmatter = extractFrontmatter(content);

  // Fail fast if the SKILL.md file does not contain a valid metadata block.
  if (!frontmatter) {
    errors.push(`${skillName}: Could not parse frontmatter`);
    return { valid: false, errors };
  }

  const metadata = parseFrontmatter(frontmatter);

  // Verify that metadata.owner is present and follows the @user or @org/team format.
  if (!metadata["metadata.owner"]) {
    errors.push(`${skillName}: Missing required metadata.owner`);
    // Validate owner format if identity is provided.
  } else if (!isValidGitHubIdentity(metadata["metadata.owner"])) {
    errors.push(
      `${skillName}: Invalid owner format: "${metadata["metadata.owner"]}". Expected @user or @org/team format.`,
    );
  }

  // Verify that metadata.status is one of the allowed lifecycle states.
  if (!metadata["metadata.status"]) {
    errors.push(`${skillName}: Missing required metadata.status`);
  } else {
    const validStatuses = ["active", "experimental", "deprecated", "archived"];
    // Check if metadata.status belongs to the allowed set of statuses.
    if (!validStatuses.includes(metadata["metadata.status"])) {
      errors.push(
        `${skillName}: Invalid status "${metadata["metadata.status"]}". Must be one of: ${validStatuses.join(", ")}`,
      );
    }
  }

  // Skills in .deprecated/ with deprecated or archived status must declare deprecated_at.
  const isDeprecatedPath =
    skillPath.includes(`${sep}.deprecated${sep}`) || skillPath.includes("/.deprecated/");
  const isDeprecatedStatus =
    metadata["metadata.status"] === "deprecated" || metadata["metadata.status"] === "archived";
  // Only enforce deprecated_at when the skill lives in .deprecated/ AND has a matching status.
  if (isDeprecatedPath && isDeprecatedStatus) {
    const deprecatedAt = metadata["metadata.deprecated_at"]?.trim();
    // Require the field to be present.
    if (!deprecatedAt) {
      errors.push(
        `${skillName}: Missing required metadata.deprecated_at for deprecated skill in .deprecated/. Use YYYY-MM-DD format.`,
      );
    // Validate the format and parse-ability of the deprecated_at value.
    } else if (
      // Regex: match exactly a YYYY-MM-DD date string (four digits, dash, two digits, dash, two digits).
      !/^\d{4}-\d{2}-\d{2}$/.test(deprecatedAt) ||
      Number.isNaN(Date.parse(deprecatedAt))
    ) {
      errors.push(
        `${skillName}: Invalid metadata.deprecated_at "${deprecatedAt}". Must be a valid YYYY-MM-DD date.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates GitHub identity format (@user or @org/team).
 *
 * @param identity - The GitHub identity string to validate.
 * @returns True if the identity is in a valid format, false otherwise.
 */
function isValidGitHubIdentity(identity: string): boolean {
  // regex explanation:
  // - ^@                                    => must start with "@"
  // - ([a-z\d](?:[a-z\d-]{0,38}[a-z\d])?) => user/org: 1–39 chars, alnum with internal hyphens
  // - (?:/([a-z\d](?:[a-z\d-]*[a-z\d])?))? => optional "/team" with same character rules
  // - $                                     => no extra characters allowed
  const identityPattern =
    // regex explanation: Enforces @user or @org/team with exactly one optional team segment.
    /^@([a-z\d](?:[a-z\d-]{0,38}[a-z\d])?)(?:\/([a-z\d](?:[a-z\d-]*[a-z\d])?))?$/i;
  return identityPattern.test(identity);
}

/**
 * Main validation entrypoint.
 * Scans for skills, validates ownership, and reports any failures.
 */
function main(): void {
  const repoRoot = process.cwd();
  const skillsRoot = join(repoRoot, "skills");

  console.log("Validating skill ownership metadata...");

  const rawSkillFiles = findSkillFiles(skillsRoot);
  // Convert each discovered SKILL.md path into its parent skill directory.
  const mappedPaths = rawSkillFiles.map((skillFile) => {
    // Use dirname for cross-platform path handling on POSIX and Windows separators.
    return dirname(skillFile);
  });

  const skillDirs = mappedPaths.sort();

  const allErrors: string[] = [];

  // Iterate through all discovered skill directories and perform ownership validation.
  const validCount = skillDirs.reduce((count, skillDir) => {
    const skillName = basename(skillDir);

    const result = validateSkillOwnership(skillDir, skillName);

    // Collect all validation errors across all skills to report them at once.
    if (!result.valid) {
      allErrors.push(...result.errors);
      return count;
    }
    return count + 1;
  }, 0);

  console.log(`\nOwnership validation: ${validCount}/${skillDirs.length} skills passed.`);

  // Exit with failure and print all accumulated errors if any validation failed.
  if (allErrors.length > 0) {
    // Output all ownership and status errors found across all reviewed skills.
    for (const error of allErrors) {
      console.error(`✗ ${error}`);
    }
    throw new Error("Ownership metadata validation failed.");
  }

  console.log("✓ All skills have valid ownership metadata.");
}

// Keep CLI execution scoped to direct invocation to avoid side effects in imports.
if (import.meta.main) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
    process.exit(1);
  }
}
