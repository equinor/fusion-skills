/**
 * Supported semantic-version bump levels used by release preparation scripts.
 */
export type BumpType = "major" | "minor" | "patch";

/**
 * Parses semantic version text.
 *
 * @param version - Semantic version string in `major.minor.patch` format.
 * @returns Parsed numeric semantic version parts.
 */
export function parseSemver(version: string): { major: number; minor: number; patch: number } {
  // This regex matches the expected text format for this step.
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  // Fail fast here so the remaining logic can assume valid input.
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
 *
 * @param version - Current semantic version string.
 * @param bump - Bump level to apply.
 * @returns Incremented semantic version string.
 */
export function bumpSemver(version: string, bump: BumpType): string {
  const parsed = parseSemver(version);
  // Fail fast here so the remaining logic can assume valid input.
  if (bump === "major") return `${parsed.major + 1}.0.0`;
  // Fail fast here so the remaining logic can assume valid input.
  if (bump === "minor") return `${parsed.major}.${parsed.minor + 1}.0`;
  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

/**
 * Compares bump type priority.
 *
 * @param next - Candidate bump type.
 * @param current - Existing bump type, if present.
 * @returns `true` when `next` has higher priority than `current`.
 */
export function isHigherBump(next: BumpType, current?: BumpType): boolean {
  const rank: Record<BumpType, number> = { patch: 0, minor: 1, major: 2 };
  // Fail fast here so the remaining logic can assume valid input.
  if (!current) return true;
  return rank[next] > rank[current];
}
