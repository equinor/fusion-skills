import type { BumpType } from "./semver";

export interface ParsedChangeset {
  skills: Record<string, BumpType>;
  body: string;
}

/**
 * Parses a changeset markdown file into skill bump entries + body.
 */
export function parseChangeset(content: string): ParsedChangeset {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Invalid changeset format: missing frontmatter delimiters (---)");

  const skills: Record<string, BumpType> = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    if (!line) continue;

    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    if (!parsed) throw new Error(`Invalid changeset entry line: ${rawLine}`);

    skills[parsed[1]] = parsed[2] as BumpType;
  }

  const body = match[2].trim();
  if (Object.keys(skills).length === 0) {
    throw new Error("Changeset must include at least one skill bump entry.");
  }
  if (!body) {
    throw new Error("Changeset body must describe the change.");
  }

  return { skills, body };
}
