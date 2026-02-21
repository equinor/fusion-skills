import type { BumpType } from "./semver";
import { parseSemver } from "./semver";

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
