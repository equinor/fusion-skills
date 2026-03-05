/// <reference types="node" />

import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";

/**
 * Parses YAML frontmatter (content between --- delimiters) from SKILL.md.
 *
 * @param content - The raw content of the SKILL.md file.
 * @returns The YAML frontmatter string, or null if not found.
 */
function extractFrontmatter(content: string): string | null {
  // regex explanation: This regex matches the YAML frontmatter block at the start of a file.
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

/**
 * Validates that a skill has required ownership metadata.
 *
 * @param skillPath - The absolute path to the skill directory.
 * @param skillName - The name of the skill for reporting purposes.
 * @returns An object indicating if the skill is valid and any errors found.
 */
function validateSkillOwnership(
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
  // regex explanation: This regex validates the GitHub identity format (@user or @org/team).
  const identityPattern = /^@[\w\-./]+$/;
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

  // regex explanation: This regex strips the /SKILL.md suffix from file paths to get the skill directory.
  const extensionSuffix = /\/SKILL\.md$/;
  const rawSkillFiles = findSkillFiles(skillsRoot);
  // Remove trailing /SKILL.md to get the base skill folder path.
  const mappedPaths = rawSkillFiles.map((skillFile) => {
    // Strip file name to get directory.
    return skillFile.replace(extensionSuffix, "");
  });

  const skillDirs = mappedPaths.sort();

  const allErrors: string[] = [];

  // Iterate through all discovered skill directories and perform ownership validation.
  const validCount = skillDirs.reduce((count, skillDir) => {
    const parts = skillDir.split("/");
    const skillName = parts[parts.length - 1];

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
