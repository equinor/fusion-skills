import { existsSync, readFileSync } from "node:fs";

/**
 * Reads .changeset/release.md content, returning null when missing.
 */
export function readReleaseMarkdown(path: string): string | null {
  if (!existsSync(path)) return null;
  const content = readFileSync(path, "utf8").trim();
  return content || null;
}

/**
 * Extracts released skill names from .changeset/release.md sections.
 */
export function extractReleaseSkillNames(releaseMarkdown: string): string[] {
  return Array.from(
    new Set(
      releaseMarkdown
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^[a-z0-9][a-z0-9-]*@\d+\.\d+\.\d+$/.test(line))
        .map((line) => line.split("@")[0]),
    ),
  );
}
