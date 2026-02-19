import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { getChangesetProvenance, getRepoSlug } from "./changeset-provenance";
import { discoverSkillFiles } from "./discover-skill-files";
import { listChangesetFiles } from "./list-changeset-files";
import { parseChangeset } from "./parse-changeset";
import {
  type GroupedNotes,
  normalizeNoteBody,
  type NoteEntry,
  renderGroupedNotes,
} from "./release-notes-format";
import type { BumpType } from "./semver";
import { bumpSemver, isHigherBump } from "./semver";
import { extractMetadataVersion, updateMetadataVersion } from "./skill-version";
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
  const releasePath = join(repoRoot, ".changeset", "release.md");
  const repoSlug = getRepoSlug();
  const changesetFiles = listChangesetFiles(repoRoot);

  if (changesetFiles.length === 0) {
    console.log("No changeset files found. Nothing to prepare.");
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

      const notes =
        aggregateNotes.get(skillName) ?? {
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
    const notes =
      aggregateNotes.get(skillName) ?? {
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

    releaseSections.push([`### ${skillName}@${newVersion}`, "", ...renderGroupedNotes(formattedNotes, repoSlug, 4)].join("\n"));
    console.log(`Prepared ${skillName}: ${currentVersion} -> ${newVersion} (${bumpType})`);
  }

  const frontmatterLines = [
    "---",
    `bump: ${highestReleaseBump}`,
    "---",
    "",
    "",
  ];

  writeFileSync(releasePath, `${frontmatterLines.join("\n")}${releaseSections.join("\n\n")}\n`, "utf8");
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
