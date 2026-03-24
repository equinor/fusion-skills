/// <reference types="node" />

/**
 * Validates governance references for a single skill directory.
 *
 * Resolves each governance reference relative to the repository root and
 * checks whether the target file or directory exists.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { extractGovernanceRefs } from "./extract-governance-refs";

/** Validation result for a single skill. */
export interface GovernanceValidationResult {
  skillName: string;
  valid: boolean;
  errors: string[];
}

/**
 * Validates governance references for a single skill directory.
 *
 * Resolves each governance reference relative to the repository root and
 * checks whether the target file or directory exists. Skips documentation
 * patterns that use globs or template placeholders.
 *
 * @param skillDir - Absolute path to the skill directory containing SKILL.md.
 * @param skillName - Name of the skill for reporting purposes.
 * @param repoRoot - Absolute path to the repository root.
 * @returns Validation result indicating any broken governance references.
 */
export function validateGovernanceRefs(
  skillDir: string,
  skillName: string,
  repoRoot: string,
): GovernanceValidationResult {
  const errors: string[] = [];
  const skillMdPath = join(skillDir, "SKILL.md");
  const content = readFileSync(skillMdPath, "utf-8");

  const refs = extractGovernanceRefs(content);

  // Validate each extracted governance reference resolves to an existing path.
  for (const ref of refs) {
    // Skip documentation patterns that use globs or template placeholders.
    // regex: match glob characters (* or ?) or angle-bracket placeholders (<...>)
    if (/[*?]|<[^>]+>/.test(ref)) continue;

    // Strip any URL fragment or query parameters before resolving.
    // regex: match URL fragment (#...) or query string (?...) at the end
    const cleanRef = ref.replace(/[#?].*$/, "");

    // Resolve explicitly relative paths (./ or ../) from the skill directory;
    // resolve everything else from the repo root, since governance paths like
    // .github/ are repo-root-relative even though they start with a dot.
    const isExplicitlyRelative = cleanRef.startsWith("./") || cleanRef.startsWith("../");
    const resolved = isExplicitlyRelative
      ? resolve(skillDir, cleanRef)
      : resolve(repoRoot, cleanRef);

    // Report any governance reference that does not resolve to an existing path.
    if (!existsSync(resolved)) {
      errors.push(`${skillName}: broken governance reference "${ref}" (resolved to ${resolved})`);
    }
  }

  // Also validate governance references inside skill-local agent files.
  const agentErrors = validateAgentGovernanceRefs(skillDir, skillName, repoRoot);

  return {
    skillName,
    valid: errors.length === 0 && agentErrors.length === 0,
    errors: [...errors, ...agentErrors],
  };
}

/**
 * Validates governance references found in skill-local agent/advisor .md files.
 *
 * @param skillDir - Absolute path to the skill directory.
 * @param skillName - Name of the skill for reporting purposes.
 * @param repoRoot - Absolute path to the repository root.
 * @returns Array of error strings for broken governance references.
 */
function validateAgentGovernanceRefs(
  skillDir: string,
  skillName: string,
  repoRoot: string,
): string[] {
  const errors: string[] = [];
  const agentsDir = join(skillDir, "agents");

  // Skip skills that do not have an agents directory.
  if (!existsSync(agentsDir)) return errors;

  // Scan all Markdown agent files for governance references.
  const agentFiles: string[] = readdirSync(agentsDir)
    // Keep only Markdown files from the agents directory.
    .filter((f: string) => f.endsWith(".md"))
    // Resolve to absolute paths for consistent file reading.
    .map((f: string) => join(agentsDir, f));

  // Check each agent file for broken governance references.
  for (const agentFile of agentFiles) {
    const content = readFileSync(agentFile, "utf-8");
    const refs = extractGovernanceRefs(content);
    const agentName = basename(agentFile);

    // Validate each governance reference in this agent file.
    for (const ref of refs) {
      // Skip documentation patterns that use globs or template placeholders.
      // regex: match glob characters (* or ?) or angle-bracket placeholders (<...>)
      if (/[*?]|<[^>]+>/.test(ref)) continue;

      // regex: match URL fragment (#...) or query string (?...) at the end
      const cleanRef = ref.replace(/[#?].*$/, "");
      const isExplicitlyRelative = cleanRef.startsWith("./") || cleanRef.startsWith("../");
      const resolved = isExplicitlyRelative
        ? resolve(dirname(agentFile), cleanRef)
        : resolve(repoRoot, cleanRef);

      // Report any governance reference that does not resolve to an existing path.
      if (!existsSync(resolved)) {
        errors.push(
          `${skillName}/agents/${agentName}: broken governance reference "${ref}" (resolved to ${resolved})`,
        );
      }
    }
  }

  return errors;
}
