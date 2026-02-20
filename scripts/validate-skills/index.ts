/// <reference types="node" />

import process from "node:process";
import { discoverLocalSkills } from "./discover-local-skills";
import { parseCliSkillCount, sanitizeAnsi } from "./parse-cli-count";
import { runSkillsCliList } from "./run-skills-cli-list";

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
    throw new Error(
      `Mismatch detected. Local SKILL.md directories=${localSkills.length}, CLI reported=${cliCount}`,
    );
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
