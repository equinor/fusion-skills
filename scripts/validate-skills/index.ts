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
 * Finds local skills that declare `metadata.skills` without orchestrator role.
 *
 * Maintainer note: the external skills CLI currently excludes these from `--list`
 * output, so we treat them as known/explicit companion-skill metadata usage.
 *
 * @param repoRoot - Absolute repository root path.
 * @param localSkills - Repository-relative skill directory paths.
 * @returns Skill directories expected to be excluded by external CLI listing.
 */
function findCompanionSkillMetadataEntries(repoRoot: string, localSkills: string[]): string[] {
  const excluded: string[] = [];

  // Process entries in order so behavior stays predictable.
  for (const skillDir of localSkills) {
    const skillPath = join(repoRoot, skillDir, "SKILL.md");
    const markdown = readFileSync(skillPath, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));

    // Treat metadata.skills as companion metadata unless role is explicit orchestrator.
    const hasMetadataSkills = Boolean(frontmatter["metadata.skills"]);
    const isOrchestrator = frontmatter["metadata.role"] === "orchestrator";

    if (hasMetadataSkills && !isOrchestrator) {
      excluded.push(skillDir);
    }
  }

  return excluded;
}

/**
 * CLI entrypoint for validating local skill count vs skills CLI output.
 */
function main(): void {
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
  console.log(`CLI reported skills: ${cliCount}`);

  // Fail fast here so the remaining logic can assume valid input.
  if (cliCount !== localSkills.length) {
    const companionMetadataSkills = findCompanionSkillMetadataEntries(repoRoot, localSkills);
    const adjustedCliCount = cliCount + companionMetadataSkills.length;

    // Allow known mismatch where external CLI excludes companion metadata.skills usage.
    if (adjustedCliCount === localSkills.length) {
      console.log(
        `Adjusted count matched local skills by tolerating ${companionMetadataSkills.length} companion metadata.skills entr${companionMetadataSkills.length === 1 ? "y" : "ies"}.`,
      );

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

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
