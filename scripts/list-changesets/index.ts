/// <reference types="node" />
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import process from "node:process";
import { listChangesetFiles } from "./list-changeset-files";
import { extractChangesetSummary, parseChangesetEntries } from "./parse-changeset-file";

/**
 * CLI entrypoint for listing all changesets and their bump entries.
 *
 * @returns Nothing. Writes formatted changeset information to stdout.
 */
function main(): void {
  const repoRoot = process.cwd();
  const files = listChangesetFiles(repoRoot);

  if (files.length === 0) {
    console.log("No changesets found.");
    return;
  }

  console.log(`Found ${files.length} changeset file(s):\n`);

  // Maintainer note: each block is stable and easy to grep in CI logs.
  for (const fullPath of files) {
    const markdown = readFileSync(fullPath, "utf8");
    const entries = parseChangesetEntries(markdown);
    const summary = extractChangesetSummary(markdown);

    console.log("─".repeat(72));
    console.log(relative(repoRoot, fullPath));
    console.log("─".repeat(72));

    if (entries.length === 0) {
      console.log("entries: (none)");
    } else {
      for (const entry of entries) {
        console.log(`- ${entry.skill}: ${entry.bump}`);
      }
    }

    console.log(`summary: ${summary}`);
    console.log("");
  }
}

main();
