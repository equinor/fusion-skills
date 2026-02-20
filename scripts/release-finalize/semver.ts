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
  // This regex matches the expected text format for this step.
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!match) throw new Error(`Invalid semantic version: ${version}`);

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}
