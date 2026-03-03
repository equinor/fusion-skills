/// <reference types="node" />

import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { extractFrontmatter } from "../list-skills/extract-frontmatter";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";
import { discoverLocalSkills } from "./discover-local-skills";
import { parseCliSkillCount } from "./parse-cli-count";
import { runSkillsCliList } from "./run-skills-cli-list";
import { sanitizeAnsi } from "./sanitize-ansi";

/**
 * Gets skill id from a repository-relative skill directory path.
 *
 * @param skillDir - Repository-relative skill directory path.
 * @returns Skill id inferred from path segments.
 */
export function getSkillIdFromDir(skillDir: string): string {
  const normalizedSkillDir = skillDir.replaceAll("\\", "/");
  const parts = normalizedSkillDir.split("/");
  // Hidden skill folders store skill id in segment #3.
  if (parts[1]?.startsWith(".")) {
    return parts[2] ?? "";
  }

  return parts[1] ?? "";
}

/**
 * Extracts skill ids listed by the external skills CLI.
 *
 * @param cliOutput - Raw skills CLI output text.
 * @returns Skill ids discovered in CLI list output.
 */
export function extractCliSkillIds(cliOutput: string): Set<string> {
  const skillIds = new Set<string>();
  const cleanOutput = sanitizeAnsi(cliOutput);

  // Process output lines in order to preserve deterministic parsing.
  for (const line of cleanOutput.split("\n")) {
    // This regex matches the expected text format for this step.
    const match = line.match(/\b((?:fusion|custom)-[a-z0-9-]+)\s*$/);
    // Collect parsed skill ids for presence checks against local skill folders.
    if (match) {
      skillIds.add(match[1]);
    }
  }

  return skillIds;
}

/**
 * Finds missing local skills that declare `metadata.skills`.
 *
 * Maintainer note: the external skills CLI currently excludes these from `--list`
 * output, so we treat them as known/explicit companion-skill metadata usage.
 *
 * @param repoRoot - Absolute repository root path.
 * @param localSkills - Repository-relative skill directory paths.
 * @param cliSkillIds - Skill ids discovered in CLI output.
 * @returns Skill directories expected to be excluded by external CLI listing.
 */
export function findCompanionSkillMetadataEntries(
  repoRoot: string,
  localSkills: string[],
  cliSkillIds: Set<string>,
): string[] {
  const excluded: string[] = [];

  // Process entries in order so behavior stays predictable.
  for (const skillDir of localSkills) {
    const skillId = getSkillIdFromDir(skillDir);
    // Skip skills that are already listed by external CLI.
    if (cliSkillIds.has(skillId)) {
      continue;
    }

    const skillPath = join(repoRoot, skillDir, "SKILL.md");
    const markdown = readFileSync(skillPath, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));

    // Treat metadata.skills as companion metadata regardless of role hint.
    const hasMetadataSkills = Boolean(frontmatter["metadata.skills"]);

    // Collect only skills that use metadata.skills as companion metadata.
    if (hasMetadataSkills) {
      excluded.push(skillDir);
    }
  }

  return excluded;
}

/**
 * CLI entrypoint for validating local skill count vs skills CLI output.
 */
export function main(): void {
  const repoRoot = process.cwd();

  console.log("Discovering local skill directories from SKILL.md files...");
  const localSkills = discoverLocalSkills(repoRoot);

  console.log(`Local skills (${localSkills.length}):`);
  // Fail fast here so the remaining logic can assume valid input.
  if (localSkills.length === 0) {
    console.log("- none");
  } else {
    // Process entries in order so behavior stays predictable.
    for (const skill of localSkills) {
      console.log(`- ${skill}`);
    }
  }

  console.log("\nRunning skills CLI validation...");
  // Maintainer note: keep this command in sync with docs and workflow checks.
  const cliOutput = runSkillsCliList(repoRoot);
  console.log(cliOutput);

  const cliCount = parseCliSkillCount(sanitizeAnsi(cliOutput));
  const cliSkillIds = extractCliSkillIds(cliOutput);
  console.log(`CLI reported skills: ${cliCount}`);

  // Fail fast here so the remaining logic can assume valid input.
  if (cliCount !== localSkills.length) {
    const companionMetadataSkills = findCompanionSkillMetadataEntries(
      repoRoot,
      localSkills,
      cliSkillIds,
    );
    const adjustedCliCount = cliCount + companionMetadataSkills.length;

    // Allow known mismatch where external CLI excludes companion metadata.skills usage.
    if (adjustedCliCount === localSkills.length) {
      console.log(
        `Adjusted count matched local skills by tolerating ${companionMetadataSkills.length} companion metadata.skills entr${companionMetadataSkills.length === 1 ? "y" : "ies"}.`,
      );

      // Print each tolerated exclusion so CI output remains auditable.
      for (const skill of companionMetadataSkills) {
        console.log(`- tolerated CLI exclusion: ${skill}`);
      }
    } else {
      throw new Error(
        `Mismatch detected. Local SKILL.md directories=${localSkills.length}, CLI reported=${cliCount}, tolerated exclusions=${companionMetadataSkills.length}`,
      );
    }
  }

  console.log("Skill count check passed.");
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
    process.exit(1);
  }
}
