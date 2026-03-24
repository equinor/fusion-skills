/// <reference types="node" />

/**
 * CLI entrypoint for validating governance references in skills.
 *
 * Scans all SKILL.md files under `skills/` for references to repo-local
 * governance paths and verifies they resolve to existing files.
 */

import { basename, dirname, join } from "node:path";
import process from "node:process";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { validateGovernanceRefs } from "./validate-governance-refs";

/**
 * Main validation entrypoint.
 *
 * Scans all skills under `skills/` for governance references and validates
 * that each reference resolves to an existing file or directory.
 */
function main(): void {
  const repoRoot = process.cwd();
  const skillsRoot = join(repoRoot, "skills");

  console.log("Validating governance references in skills...");

  const rawSkillFiles = findSkillFiles(skillsRoot);
  // Convert skill file paths to directories and sort for predictable output.
  const skillDirs = rawSkillFiles.map((f) => dirname(f)).sort();

  const allErrors: string[] = [];

  // Validate each skill and count passing results with reduce.
  const validCount = skillDirs.reduce((count, skillDir) => {
    const skillName = basename(skillDir);
    const result = validateGovernanceRefs(skillDir, skillName, repoRoot);

    // Collect errors from failing skills.
    if (!result.valid) {
      allErrors.push(...result.errors);
      return count;
    }
    return count + 1;
  }, 0);

  console.log(`\nGovernance validation: ${validCount}/${skillDirs.length} skills passed.`);

  // Exit with failure when any governance reference is broken.
  if (allErrors.length > 0) {
    // Print each error so CI output remains auditable.
    for (const error of allErrors) {
      console.error(`✗ ${error}`);
    }
    throw new Error("Governance reference validation failed.");
  }

  console.log("✓ All governance references are valid.");
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
