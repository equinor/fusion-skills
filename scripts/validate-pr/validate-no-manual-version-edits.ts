import { getVersionAtRef } from "./get-version-at-ref";

/**
 * Compares two semantic versions.
 *
 * @param left - First semantic version.
 * @param right - Second semantic version.
 * @returns `1` when left is higher, `-1` when lower, otherwise `0`.
 */
function compareSemver(left: string, right: string): number {
  // Convert each value into the shape expected by downstream code.
  const leftParts = left.split(".").map((part) => Number(part));
  // Convert each value into the shape expected by downstream code.
  const rightParts = right.split(".").map((part) => Number(part));

  // Process entries in order so behavior stays predictable.
  for (const index of [0, 1, 2]) {
    // Fail fast here so the remaining logic can assume valid input.
    if (leftParts[index] > rightParts[index]) return 1;
    // Fail fast here so the remaining logic can assume valid input.
    if (leftParts[index] < rightParts[index]) return -1;
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
  // Process entries in order so behavior stays predictable.
  const errors = Array.from(changedSkillDirs).reduce((count, skillDir) => {
    const headVersion = getVersionAtRef("HEAD", skillDir);
    const baseVersion = getVersionAtRef(baseRemoteRef, skillDir);

    // Fail fast here so the remaining logic can assume valid input.
    if (!headVersion && baseVersion) {
      console.log(`- ${skillDir} removed in PR (skipping version bump check).`);
      return count;
    }

    // Fail fast here so the remaining logic can assume valid input.
    if (!headVersion) {
      console.log(`- ${skillDir} has no SKILL.md in HEAD (skipping).`);
      return count;
    }

    // Fail fast here so the remaining logic can assume valid input.
    if (!baseVersion) {
      console.log(`- ${skillDir} added with metadata.version=${headVersion}`);
      return count;
    }

    const versionComparison = compareSemver(headVersion, baseVersion);

    // Fail fast here so the remaining logic can assume valid input.
    if (versionComparison !== 0) {
      console.error(
        `ERROR: ${skillDir} changed metadata.version (${baseVersion} -> ${headVersion}). Do not manually edit metadata.version in non-release PRs.`,
      );
      return count + 1;
    }

    console.log(`- ${skillDir} metadata.version unchanged (${headVersion})`);
    return count;
  }, 0);

  // Fail fast here so the remaining logic can assume valid input.
  if (errors > 0) {
    throw new Error("Manual skill metadata.version edits are not allowed in non-release PRs.");
  }
}
