import type { BumpType } from "./semver";
import { parseSemver } from "./semver";

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
