import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { discoverSkillFiles } from "./discover-skill-files";
import { listChangesetFiles } from "./list-changeset-files";
import { parseChangeset } from "./parse-changeset";
import type { BumpType } from "./semver";
import { bumpSemver, isHigherBump } from "./semver";
import { extractMetadataVersion, updateMetadataVersion } from "./skill-version";
import { upsertSkillChangelog } from "./upsert-skill-changelog";

/**
 * CLI entrypoint for applying changesets into release artifacts.
 */
function main(): void {
  const repoRoot = process.cwd();
  const releasePath = join(repoRoot, ".changeset", "release.md");
  const changesetFiles = listChangesetFiles(repoRoot);

  if (changesetFiles.length === 0) {
    console.log("No changeset files found. Nothing to prepare.");
    return;
  }

  const skillByName = discoverSkillFiles(repoRoot);
  const aggregateBumps = new Map<string, BumpType>();
  const aggregateNotes = new Map<string, string[]>();

  for (const changesetFile of changesetFiles) {
    const parsed = parseChangeset(readFileSync(changesetFile, "utf8"));

    for (const [skillName, bumpType] of Object.entries(parsed.skills)) {
      if (!skillByName.has(skillName)) {
        throw new Error(`Changeset references unknown skill: ${skillName}`);
      }

      const current = aggregateBumps.get(skillName);
      if (isHigherBump(bumpType, current)) {
        aggregateBumps.set(skillName, bumpType);
      }

      const notes = aggregateNotes.get(skillName) ?? [];
      notes.push(parsed.body);
      aggregateNotes.set(skillName, notes);
    }
  }

  const releaseSections: string[] = [];

  for (const skillName of Array.from(aggregateBumps.keys()).sort()) {
    const skillFile = skillByName.get(skillName);
    if (!skillFile) {
      throw new Error(`Missing skill path for: ${skillName}`);
    }
    const skillDir = dirname(skillFile);
    const bumpType = aggregateBumps.get(skillName);
    if (!bumpType) {
      throw new Error(`Missing bump type for: ${skillName}`);
    }
    const notes = aggregateNotes.get(skillName) ?? [];

    const currentContent = readFileSync(skillFile, "utf8");
    const currentVersion = extractMetadataVersion(currentContent);
    const newVersion = bumpSemver(currentVersion, bumpType);

    // Maintainer note: update SKILL.md before changelog so failures fail fast on version parsing.
    writeFileSync(skillFile, updateMetadataVersion(currentContent, newVersion), "utf8");

    const formattedNotes = notes.map((note) => note.trim()).filter((note) => note.length > 0);

    upsertSkillChangelog(skillDir, newVersion, formattedNotes);

    releaseSections.push([`${skillName}@${newVersion}`, "", ...formattedNotes].join("\n"));
    console.log(`Prepared ${skillName}: ${currentVersion} -> ${newVersion} (${bumpType})`);
  }

  writeFileSync(releasePath, `${releaseSections.join("\n\n")}\n`, "utf8");
  console.log(`Wrote ${releasePath}`);

  for (const changesetFile of changesetFiles) {
    rmSync(changesetFile);
    console.log(`Removed ${changesetFile}`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
