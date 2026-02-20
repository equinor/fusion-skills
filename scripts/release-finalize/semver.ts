/**
 * Supported semantic-version bump levels used by release finalization scripts.
 */
export type BumpType = "major" | "minor" | "patch";

/**
 * Parses semantic version.
 *
 * @param version - Version string in `x.y.z` format.
 * @returns Parsed major, minor, and patch numbers.
 */
export function parseSemver(version: string): { major: number; minor: number; patch: number } {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!match) throw new Error(`Invalid semantic version: ${version}`);

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/**
 * Bumps semantic version by bump type.
 *
 * @param version - Current semantic version.
 * @param bump - Bump level to apply.
 * @returns Next semantic version after applying the bump.
 */
export function bumpSemver(version: string, bump: BumpType): string {
  const v = parseSemver(version);
  // Fail fast here so the remaining logic can assume valid input.
  if (bump === "major") return `${v.major + 1}.0.0`;
  // Fail fast here so the remaining logic can assume valid input.
  if (bump === "minor") return `${v.major}.${v.minor + 1}.0`;
  return `${v.major}.${v.minor}.${v.patch + 1}`;
}

/**
 * Detects semantic bump type from two versions.
 *
 * @param fromVersion - Previous semantic version.
 * @param toVersion - New semantic version.
 * @returns Detected bump level between the versions.
 */
export function detectBump(fromVersion: string, toVersion: string): BumpType {
  const from = parseSemver(fromVersion);
  const to = parseSemver(toVersion);

  // Fail fast here so the remaining logic can assume valid input.
  if (to.major > from.major) return "major";
  // Fail fast here so the remaining logic can assume valid input.
  if (to.minor > from.minor) return "minor";
  return "patch";
}

/**
 * Returns whether next bump outranks current bump.
 *
 * @param next - Candidate bump to compare.
 * @param current - Existing bump to compare against.
 * @returns True when `next` is a higher-priority bump than `current`.
 */
export function isHigherBump(next: BumpType, current: BumpType): boolean {
  const rank: Record<BumpType, number> = { patch: 0, minor: 1, major: 2 };
  return rank[next] > rank[current];
}
