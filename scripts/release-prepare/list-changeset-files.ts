import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists processable changeset files from .changeset.
 *
 * @param repoRoot - Absolute repository root path.
 * @returns Sorted absolute paths to eligible changeset markdown files.
 */
export function listChangesetFiles(repoRoot: string): string[] {
  const changesetDir = join(repoRoot, ".changeset");
  // Fail fast here so the remaining logic can assume valid input.
  if (!existsSync(changesetDir)) return [];

  return (
    readdirSync(changesetDir)
      // Keep only items that meet the rules for this step.
      .filter(
        (file) =>
          file.endsWith(".md") &&
          file.toLowerCase() !== "readme.md" &&
          file.toLowerCase() !== "release.md",
      )
      // Convert each value into the shape expected by downstream code.
      .map((file) => join(changesetDir, file))
      .sort()
  );
}
