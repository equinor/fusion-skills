import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists changeset markdown files excluding the documentation readme.
 *
 * @param repoRoot - Absolute repository root path.
 * @returns Sorted absolute paths to changeset markdown files.
 */
export function listChangesetFiles(repoRoot: string): string[] {
  const changesetDir = join(repoRoot, ".changeset");
  if (!existsSync(changesetDir)) return [];

  return readdirSync(changesetDir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .map((file) => join(changesetDir, file))
    .sort();
}
