import type { BumpType } from "./semver";

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
