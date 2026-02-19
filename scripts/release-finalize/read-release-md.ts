import { existsSync, readFileSync } from "node:fs";
import type { BumpType } from "./semver";

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
        .filter((line) => /^(?:#{2,6}\s+)?[a-z0-9][a-z0-9-]*@\d+\.\d+\.\d+$/.test(line))
        .map((line) => line.replace(/^#{2,6}\s+/, ""))
        .map((line) => line.split("@")[0]),
    ),
  );
}

/**
 * Extracts highest release bump from release.md frontmatter.
 */
export function extractReleaseBump(releaseMarkdown: string): BumpType | null {
  const match = releaseMarkdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return null;
  }

  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    const parsed = line.match(/^bump:\s*(major|minor|patch)$/);
    if (parsed) {
      return parsed[1] as BumpType;
    }
  }

  return null;
}
