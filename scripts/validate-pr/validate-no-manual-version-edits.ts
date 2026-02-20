import { getVersionAtRef } from "./get-version-at-ref";

/**
 * Compares two semantic versions.
 *
 * @param left - First semantic version.
 * @param right - Second semantic version.
 * @returns `1` when left is higher, `-1` when lower, otherwise `0`.
 */
function compareSemver(left: string, right: string): number {
  const leftParts = left.split(".").map((part) => Number(part));
  const rightParts = right.split(".").map((part) => Number(part));

  for (let i = 0; i < 3; i += 1) {
    if (leftParts[i] > rightParts[i]) return 1;
    if (leftParts[i] < rightParts[i]) return -1;
  }

  return 0;
}

/**
 * Validates that non-release PRs do not manually edit metadata.version for existing skills.
 *
 * Maintainer note: skill metadata.version is updated by release automation only.
 *
 * @param changedSkillDirs - Changed skill directories detected in the PR.
 * @param baseRemoteRef - Base remote git ref used for comparison.
 * @returns Nothing.
 */
export function validateNoManualVersionEdits(
  changedSkillDirs: Set<string>,
  baseRemoteRef: string,
): void {
  let errors = 0;

  for (const skillDir of changedSkillDirs) {
    const headVersion = getVersionAtRef("HEAD", skillDir);
    const baseVersion = getVersionAtRef(baseRemoteRef, skillDir);

    if (!headVersion && baseVersion) {
      console.log(`- ${skillDir} removed in PR (skipping version bump check).`);
      continue;
    }

    if (!headVersion) {
      console.log(`- ${skillDir} has no SKILL.md in HEAD (skipping).`);
      continue;
    }

    if (!baseVersion) {
      console.log(`- ${skillDir} added with metadata.version=${headVersion}`);
      continue;
    }

    const versionComparison = compareSemver(headVersion, baseVersion);

    if (versionComparison !== 0) {
      console.error(
        `ERROR: ${skillDir} changed metadata.version (${baseVersion} -> ${headVersion}). Do not manually edit metadata.version in non-release PRs.`,
      );
      errors += 1;
    } else {
      console.log(`- ${skillDir} metadata.version unchanged (${headVersion})`);
    }
  }

  if (errors > 0) {
    throw new Error("Manual skill metadata.version edits are not allowed in non-release PRs.");
  }
}
