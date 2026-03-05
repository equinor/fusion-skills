/// <reference types="node" />

import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";

/**
 * Parses YAML frontmatter (content between --- delimiters) from SKILL.md.
 */
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

/**
 * Validates that a skill has required ownership metadata.
 *
 * @param skillPath - Path to skill directory
 * @param skillName - Name of the skill (for reporting)
 * @returns { valid: boolean, errors: string[] }
 */
function validateSkillOwnership(
  skillPath: string,
  skillName: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const skillMdPath = join(skillPath, "SKILL.md");
  const content = readFileSync(skillMdPath, "utf-8");
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    errors.push(`${skillName}: Could not parse frontmatter`);
    return { valid: false, errors };
  }

  const metadata = parseFrontmatter(frontmatter);

  // Check for required metadata.owner
  if (!metadata["metadata.owner"]) {
    errors.push(`${skillName}: Missing required metadata.owner`);
  } else if (!isValidGitHubIdentity(metadata["metadata.owner"])) {
    errors.push(
      `${skillName}: Invalid owner format: "${metadata["metadata.owner"]}". Expected @user or @org/team format.`,
    );
  }

  // Check for required metadata.status
  if (!metadata["metadata.status"]) {
    errors.push(`${skillName}: Missing required metadata.status`);
  } else {
    const validStatuses = ["active", "experimental", "deprecated", "archived"];
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
 */
function isValidGitHubIdentity(identity: string): boolean {
  // Should start with @ and contain only valid characters
  return /^@[\w\-./]+$/.test(identity);
}

/**
 * Main validation function.
 */
function main(): void {
  const repoRoot = process.cwd();
  const skillsRoot = join(repoRoot, "skills");

  console.log("Validating skill ownership metadata...");

  const skillDirs = findSkillFiles(skillsRoot)
    .map((skillFile) => skillFile.replace(/\/SKILL\.md$/, ""))
    .sort();

  let hasErrors = false;
  let validCount = 0;

  for (const skillDir of skillDirs) {
    const parts = skillDir.split("/");
    const skillName = parts[parts.length - 1];

    const result = validateSkillOwnership(skillDir, skillName);

    if (!result.valid) {
      hasErrors = true;
      for (const error of result.errors) {
        console.error(`✗ ${error}`);
      }
    } else {
      validCount++;
    }
  }

  console.log(`\nOwnership validation: ${validCount}/${skillDirs.length} skills passed.`);

  if (hasErrors) {
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
