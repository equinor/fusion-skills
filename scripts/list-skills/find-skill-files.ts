import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively discovers all SKILL.md files under a root directory.
 *
 * @param rootDir - Directory to scan recursively.
 * @param results - Accumulator used during recursive traversal.
 * @returns Collected absolute SKILL.md file paths.
 */
export function findSkillFiles(rootDir: string, results: string[] = []): string[] {
  // Fail fast here so the remaining logic can assume valid input.
  if (!existsSync(rootDir)) return results;

  // Process entries in order so behavior stays predictable.
  for (const entry of readdirSync(rootDir)) {
    const fullPath = join(rootDir, entry);
    const stats = statSync(fullPath);

    // Fail fast here so the remaining logic can assume valid input.
    if (stats.isDirectory()) {
      findSkillFiles(fullPath, results);
      continue;
    }

    // Fail fast here so the remaining logic can assume valid input.
    if (entry === "SKILL.md") {
      results.push(fullPath);
    }
  }

  return results;
}
