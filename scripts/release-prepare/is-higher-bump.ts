import type { BumpType } from "./parse-changeset";

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
