export type BumpType = "major" | "minor" | "patch";

/**
 * Parses semantic version text.
 */
export function parseSemver(version: string): { major: number; minor: number; patch: number } {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/**
 * Bumps semantic version by the specified bump type.
 */
export function bumpSemver(version: string, bump: BumpType): string {
  const parsed = parseSemver(version);
  if (bump === "major") return `${parsed.major + 1}.0.0`;
  if (bump === "minor") return `${parsed.major}.${parsed.minor + 1}.0`;
  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

/**
 * Compares bump type priority.
 */
export function isHigherBump(next: BumpType, current?: BumpType): boolean {
  const rank: Record<BumpType, number> = { patch: 0, minor: 1, major: 2 };
  if (!current) return true;
  return rank[next] > rank[current];
}
