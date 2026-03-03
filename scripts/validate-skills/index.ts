/// <reference types="node" />

import process from "node:process";
import { discoverLocalSkills } from "./discover-local-skills";
import { extractCliSkillIds } from "./extract-cli-skill-ids";
import { findCompanionSkillMetadataEntries } from "./find-companion-skill-metadata-entries";
import { parseCliSkillCount } from "./parse-cli-count";
import { runSkillsCliList } from "./run-skills-cli-list";
import { sanitizeAnsi } from "./sanitize-ansi";

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
