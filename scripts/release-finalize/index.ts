import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { extractReleaseSkillNames, readReleaseMarkdown } from "./read-release-md";
import { readSkillVersionAtRef } from "./read-skill-version-at-ref";
import type { BumpType } from "./semver";
import { detectBump, isHigherBump } from "./semver";
import { updatePackageVersion } from "./update-package-json";
import { updateRootChangelog } from "./update-root-changelog";

/**
 * CLI entrypoint for finalizing a release on main.
 */
function main(): void {
  const repoRoot = process.cwd();
  const releasePath = join(repoRoot, ".changeset", "release.md");
  const changelogPath = join(repoRoot, "CHANGELOG.md");
  const packageJsonPath = join(repoRoot, "package.json");
  const releaseNotesPath = join(repoRoot, ".release-notes.md");

  const releaseMarkdown = readReleaseMarkdown(releasePath);
  if (!releaseMarkdown) {
    console.log("No .changeset/release.md found. Nothing to finalize.");
    return;
  }

  const releaseSkills = extractReleaseSkillNames(releaseMarkdown);
  const beforeRef = process.env.BEFORE_SHA?.trim();
  let packageBump: BumpType = "patch";

  if (beforeRef) {
    for (const skillName of releaseSkills) {
      const fromVersion = readSkillVersionAtRef(beforeRef, skillName);
      const toVersion = readSkillVersionAtRef("HEAD", skillName);
      if (!fromVersion || !toVersion) continue;

      const detected = detectBump(fromVersion, toVersion);
      if (isHigherBump(detected, packageBump)) {
        packageBump = detected;
      }
    }
  }

  const newPackageVersion = updatePackageVersion(packageJsonPath, packageBump);
  console.log(`Bumped package.json version to ${newPackageVersion} (${packageBump})`);

  // Maintainer note: root changelog acts as release source of truth for tags/releases.
  updateRootChangelog(changelogPath, newPackageVersion, releaseMarkdown);
  writeFileSync(releaseNotesPath, `${releaseMarkdown}\n`, "utf8");
  rmSync(releasePath);

  console.log("Updated CHANGELOG.md, wrote .release-notes.md, and removed .changeset/release.md");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
