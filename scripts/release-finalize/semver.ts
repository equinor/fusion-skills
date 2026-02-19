export type BumpType = "major" | "minor" | "patch";

/**
 * Parses semantic version.
 */
export function parseSemver(version: string): { major: number; minor: number; patch: number } {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Invalid semantic version: ${version}`);

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/**
 * Bumps semantic version by bump type.
 */
export function bumpSemver(version: string, bump: BumpType): string {
  const v = parseSemver(version);
  if (bump === "major") return `${v.major + 1}.0.0`;
  if (bump === "minor") return `${v.major}.${v.minor + 1}.0`;
  return `${v.major}.${v.minor}.${v.patch + 1}`;
}

/**
 * Detects semantic bump type from two versions.
 */
export function detectBump(fromVersion: string, toVersion: string): BumpType {
  const from = parseSemver(fromVersion);
  const to = parseSemver(toVersion);

  if (to.major > from.major) return "major";
  if (to.minor > from.minor) return "minor";
  return "patch";
}

/**
 * Returns whether next bump outranks current bump.
 */
export function isHigherBump(next: BumpType, current: BumpType): boolean {
  const rank: Record<BumpType, number> = { patch: 0, minor: 1, major: 2 };
  return rank[next] > rank[current];
}
