import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists processable changeset files from .changeset.
 */
export function listChangesetFiles(repoRoot: string): string[] {
  const changesetDir = join(repoRoot, ".changeset");
  if (!existsSync(changesetDir)) return [];

  return readdirSync(changesetDir)
    .filter(
      (file) =>
        file.endsWith(".md") &&
        file.toLowerCase() !== "readme.md" &&
        file.toLowerCase() !== "release.md",
    )
    .map((file) => join(changesetDir, file))
    .sort();
}
