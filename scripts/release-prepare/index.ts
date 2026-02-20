import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { updatePackageVersion } from "../release-finalize/update-package-json";
import { updateRootChangelog } from "../release-finalize/update-root-changelog";
import { getChangesetProvenance, getRepoSlug } from "./changeset-provenance";
import { discoverSkillFiles } from "./discover-skill-files";
import { listChangesetFiles } from "./list-changeset-files";
import { parseChangeset } from "./parse-changeset";
import {
  type GroupedNotes,
  type NoteEntry,
  normalizeNoteBody,
  renderGroupedNotes,
} from "./release-notes-format";
import type { BumpType } from "./semver";
import { bumpSemver, isHigherBump } from "./semver";
import { extractMetadataVersion, updateMetadataVersion } from "./skill-version";
import { updateReadmeSkillsTable } from "./update-readme-skills-table";
import { upsertSkillChangelog } from "./upsert-skill-changelog";

function normalizeEntry(entry: NoteEntry): NoteEntry | null {
  const body = normalizeNoteBody(entry.body);
  if (!body) {
    return null;
  }

  return {
    body,
    prNumber: entry.prNumber,
    commitSha: entry.commitSha,
    authorLogin: entry.authorLogin,
  };
}

/**
 * CLI entrypoint for applying changesets into release artifacts.
 */
function main(): void {
  const repoRoot = process.cwd();
  const packageJsonPath = join(repoRoot, "package.json");
  const changelogPath = join(repoRoot, "CHANGELOG.md");
  const repoSlug = getRepoSlug();
  const changesetFiles = listChangesetFiles(repoRoot);

  if (changesetFiles.length === 0) {
    const skillCount = updateReadmeSkillsTable(repoRoot);
    console.log(`Updated README skills table with ${skillCount} skill(s).`);
    console.log("No changeset files found. Nothing else to prepare.");
    return;
  }

  const skillByName = discoverSkillFiles(repoRoot);
  const aggregateBumps = new Map<string, BumpType>();
  const aggregateNotes = new Map<string, GroupedNotes>();

  for (const changesetFile of changesetFiles) {
    const parsed = parseChangeset(readFileSync(changesetFile, "utf8"));
    const provenance = getChangesetProvenance(repoRoot, changesetFile);

    for (const [skillName, bumpType] of Object.entries(parsed.skills)) {
      if (!skillByName.has(skillName)) {
        throw new Error(`Changeset references unknown skill: ${skillName}`);
      }

      const current = aggregateBumps.get(skillName);
      if (isHigherBump(bumpType, current)) {
        aggregateBumps.set(skillName, bumpType);
      }

      const notes = aggregateNotes.get(skillName) ?? {
        major: [],
        minor: [],
        patch: [],
      };
      notes[bumpType].push({
        body: parsed.body,
        prNumber: provenance.prNumber,
        commitSha: provenance.commitSha,
        authorLogin: provenance.authorLogin,
      });
      aggregateNotes.set(skillName, notes);
    }
  }

  const releaseSections: string[] = [];
  let highestReleaseBump: BumpType = "patch";

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
    if (isHigherBump(bumpType, highestReleaseBump)) {
      highestReleaseBump = bumpType;
    }
    const notes = aggregateNotes.get(skillName) ?? {
      major: [],
      minor: [],
      patch: [],
    };

    const currentContent = readFileSync(skillFile, "utf8");
    const currentVersion = extractMetadataVersion(currentContent);
    const newVersion = bumpSemver(currentVersion, bumpType);

    // Maintainer note: update SKILL.md before changelog so failures fail fast on version parsing.
    writeFileSync(skillFile, updateMetadataVersion(currentContent, newVersion), "utf8");

    const formattedNotes: GroupedNotes = {
      major: notes.major.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
      minor: notes.minor.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
      patch: notes.patch.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
    };

    upsertSkillChangelog(skillDir, newVersion, formattedNotes, repoSlug);

    releaseSections.push(
      [
        `### ${skillName}@${newVersion}`,
        "",
        ...renderGroupedNotes(formattedNotes, repoSlug, 4),
      ].join("\n"),
    );
    console.log(`Prepared ${skillName}: ${currentVersion} -> ${newVersion} (${bumpType})`);
  }

  const releaseContent = releaseSections.join("\n\n").trim();
  const newPackageVersion = updatePackageVersion(packageJsonPath, highestReleaseBump);
  console.log(`Bumped package.json version to ${newPackageVersion} (${highestReleaseBump})`);
  updateRootChangelog(changelogPath, newPackageVersion, releaseContent);
  console.log(`Updated ${changelogPath} with ## v${newPackageVersion}`);
  const skillCount = updateReadmeSkillsTable(repoRoot);
  console.log(`Updated README skills table with ${skillCount} skill(s).`);

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
