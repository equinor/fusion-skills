import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively discovers all SKILL.md files under a root directory.
 */
export function findSkillFiles(rootDir: string, results: string[] = []): string[] {
  if (!existsSync(rootDir)) return results;

  for (const entry of readdirSync(rootDir)) {
    const fullPath = join(rootDir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      findSkillFiles(fullPath, results);
      continue;
    }

    if (entry === "SKILL.md") {
      results.push(fullPath);
    }
  }

  return results;
}
