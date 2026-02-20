import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { updatePackageVersion } from "../release-finalize/update-package-json";
import { updateRootChangelog } from "../release-finalize/update-root-changelog";
import { getChangesetProvenance, getRepoSlug } from "./changeset-provenance";
import { discoverSkillFiles } from "./discover-skill-files";
import { listChangesetFiles } from "./list-changeset-files";
import { parseChangeset } from "./parse-changeset";
import { type GroupedNotes, type NoteEntry, normalizeNoteBody } from "./release-notes-format";
import { type RootReleaseEntry, renderRootReleaseNotes } from "./root-release-notes-format";
import type { BumpType } from "./semver";
import { bumpSemver, isHigherBump } from "./semver";
import { extractMetadataVersion, updateMetadataVersion } from "./skill-version";
import { updateReadmeSkillsTable } from "./update-readme-skills-table";
import { upsertSkillChangelog } from "./upsert-skill-changelog";

function normalizeEntry(entry: NoteEntry): NoteEntry | null {
  // Empty/heading-only bodies are dropped so rendered changelogs never emit
  // blank bullets for a bump category.
  const body = normalizeNoteBody(entry.body);
  // Return null to signal this entry should be filtered out by callers.
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

  // Exit early when there are no changesets; README table refresh still runs.
  if (changesetFiles.length === 0) {
    const skillCount = updateReadmeSkillsTable(repoRoot);
    console.log(`Updated README skills table with ${skillCount} skill(s).`);
    console.log("No changeset files found. Nothing else to prepare.");
    return;
  }

  const skillByName = discoverSkillFiles(repoRoot);
  const aggregateBumps = new Map<string, BumpType>();
  const aggregateNotes = new Map<string, GroupedNotes>();
  // Root changelog is rendered per changeset entry, not per-skill.
  // We capture changeset-level provenance and touched skills here, then resolve
  // final skill versions after all bump calculations are complete.
  const pendingRootEntries: Array<{
    bumpType: BumpType;
    body: string;
    prNumber: string | null;
    prTitle: string | null;
    commitSha: string | null;
    skillNames: string[];
  }> = [];

  // Iterate changesets to build both skill-scoped and root-scoped aggregates.
  for (const changesetFile of changesetFiles) {
    // Parse each changeset exactly once, then fan out into:
    // 1) per-skill bump + notes (for skill changelogs), and
    // 2) per-changeset release entries (for root changelog).
    const parsed = parseChangeset(readFileSync(changesetFile, "utf8"));
    const provenance = getChangesetProvenance(repoRoot, changesetFile);
    let changesetHighestBump: BumpType = "patch";
    const changesetSkills = Object.keys(parsed.skills).sort();

    // Iterate skill bump declarations inside a single changeset.
    for (const [skillName, bumpType] of Object.entries(parsed.skills)) {
      // Fail fast if a changeset references a skill not present in this checkout.
      if (!skillByName.has(skillName)) {
        throw new Error(`Changeset references unknown skill: ${skillName}`);
      }

      // Track strongest bump for this changeset to classify root changelog section.
      if (isHigherBump(bumpType, changesetHighestBump)) {
        // Root changelog groups each changeset under its strongest bump impact.
        changesetHighestBump = bumpType;
      }

      const current = aggregateBumps.get(skillName);
      // A skill touched by multiple changesets should only bump once at the
      // highest required level.
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

    pendingRootEntries.push({
      bumpType: changesetHighestBump,
      body: parsed.body,
      prNumber: provenance.prNumber,
      prTitle: provenance.prTitle,
      commitSha: provenance.commitSha,
      skillNames: changesetSkills,
    });
  }

  let highestReleaseBump: BumpType = "patch";
  const nextVersionBySkill = new Map<string, string>();

  // Iterate affected skills in stable order for deterministic output.
  for (const skillName of Array.from(aggregateBumps.keys()).sort()) {
    // Stable sort keeps release output deterministic across environments.
    const skillFile = skillByName.get(skillName);
    // Guard against stale discovery maps before touching filesystem.
    if (!skillFile) {
      throw new Error(`Missing skill path for: ${skillName}`);
    }
    const skillDir = dirname(skillFile);
    const bumpType = aggregateBumps.get(skillName);
    // Every iterated skill must have a resolved bump from aggregation.
    if (!bumpType) {
      throw new Error(`Missing bump type for: ${skillName}`);
    }
    // Track strongest bump to determine root package version increment.
    if (isHigherBump(bumpType, highestReleaseBump)) {
      highestReleaseBump = bumpType;
    }
    const notes = aggregateNotes.get(skillName) ?? {
      major: [],
      minor: [],
      patch: [],
    };

    // Read current skill metadata.version, compute the next version for this
    // release, and cache it for both SKILL.md updates and root changelog package lines.
    const currentContent = readFileSync(skillFile, "utf8");
    const currentVersion = extractMetadataVersion(currentContent);
    const newVersion = bumpSemver(currentVersion, bumpType);
    nextVersionBySkill.set(skillName, newVersion);

    // Update SKILL.md before changelog so failures fail fast on version parsing.
    writeFileSync(skillFile, updateMetadataVersion(currentContent, newVersion), "utf8");

    const formattedNotes: GroupedNotes = {
      // Keep changelog rendering free of empty entries after normalization.
      // Map raw entries through normalization and filter dropped values.
      major: notes.major.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
      // Map raw entries through normalization and filter dropped values.
      minor: notes.minor.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
      // Map raw entries through normalization and filter dropped values.
      patch: notes.patch.map(normalizeEntry).filter((note): note is NoteEntry => note !== null),
    };

    upsertSkillChangelog(skillDir, newVersion, formattedNotes, repoSlug);
    console.log(`Prepared ${skillName}: ${currentVersion} -> ${newVersion} (${bumpType})`);
  }

  // Map per-changeset aggregates into root changelog entry payloads.
  const rootReleaseNotes: RootReleaseEntry[] = pendingRootEntries.map((entry) => ({
    bumpType: entry.bumpType,
    body: entry.body,
    prNumber: entry.prNumber,
    prTitle: entry.prTitle,
    commitSha: entry.commitSha,
    // Packages must reflect post-bump versions, not versions at
    // parse time, so this mapping is intentionally deferred until after skill
    // versions are computed and persisted.
    // Map touched skill names to their final post-bump skill@version strings.
    packages: entry.skillNames.map((skillName) => {
      const nextVersion = nextVersionBySkill.get(skillName);
      // Abort if any referenced skill failed to compute a final version.
      if (!nextVersion) {
        throw new Error(`Missing computed version for root changelog package: ${skillName}`);
      }
      return `${skillName}@${nextVersion}`;
    }),
  }));
  const groupedRootReleaseNotes = {
    // Group once here so renderer stays presentation-only.
    // Filter entries by bump type to produce renderer-ready grouped buckets.
    major: rootReleaseNotes.filter((entry) => entry.bumpType === "major"),
    // Filter entries by bump type to produce renderer-ready grouped buckets.
    minor: rootReleaseNotes.filter((entry) => entry.bumpType === "minor"),
    // Filter entries by bump type to produce renderer-ready grouped buckets.
    patch: rootReleaseNotes.filter((entry) => entry.bumpType === "patch"),
  };
  // Trim final join to avoid trailing whitespace in CHANGELOG section payload.
  const releaseContent = renderRootReleaseNotes(groupedRootReleaseNotes, repoSlug)
    .join("\n")
    .trim();
  const newPackageVersion = updatePackageVersion(packageJsonPath, highestReleaseBump);
  console.log(`Bumped package.json version to ${newPackageVersion} (${highestReleaseBump})`);
  updateRootChangelog(changelogPath, newPackageVersion, releaseContent);
  console.log(`Updated ${changelogPath} with ## v${newPackageVersion}`);
  const skillCount = updateReadmeSkillsTable(repoRoot);
  console.log(`Updated README skills table with ${skillCount} skill(s).`);

  // Iterate original changeset files and remove them after successful processing.
  for (const changesetFile of changesetFiles) {
    // Changesets are removed only after all release artifacts are written.
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
