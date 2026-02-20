import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Finds all TypeScript source files under `scripts/`, excluding tests.
 *
 * @param scriptsRoot - Absolute path to the repository scripts directory.
 * @returns Sorted absolute file paths.
 */
export function listScriptSourceFiles(scriptsRoot: string): string[] {
  const files: string[] = [];

  /**
   * Recursively traverses directories and collects TypeScript script files.
   *
   * @param dir - Absolute directory path to traverse.
   * @returns Nothing.
   */
  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        if (entry === "__tests__") {
          continue;
        }
        walk(fullPath);
        continue;
      }

      if (!fullPath.endsWith(".ts")) {
        continue;
      }

      files.push(fullPath);
    }
  }

  walk(scriptsRoot);
  return files.sort();
}
