import { getVersionAtRef } from "./get-version-at-ref";

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
 * Validates metadata.version bumps for changed skills compared to base ref.
 */
export function validateVersionBumps(changedSkillDirs: Set<string>, baseRemoteRef: string): void {
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

    if (versionComparison === 0) {
      console.error(
        `ERROR: ${skillDir} changed, but metadata.version was not updated (still ${headVersion}).`,
      );
      errors += 1;
    } else if (versionComparison < 0) {
      console.error(
        `ERROR: ${skillDir} changed, but metadata.version moved backwards (${baseVersion} -> ${headVersion}).`,
      );
      errors += 1;
    } else {
      console.log(`- ${skillDir} version bump detected: ${baseVersion} -> ${headVersion}`);
    }
  }

  if (errors > 0) {
    throw new Error("Skill metadata.version bump validation failed.");
  }
}
