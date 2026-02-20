import type { BumpType } from "./semver";

/**
 * Parsed representation of a changeset file frontmatter and descriptive body.
 */
export interface ParsedChangeset {
  skills: Record<string, BumpType>;
  body: string;
}

/**
 * Parses a changeset markdown file into skill bump entries + body.
 *
 * @param content - Raw changeset markdown content.
 * @returns Parsed skill bump map and normalized description body.
 */
export function parseChangeset(content: string): ParsedChangeset {
  // This regex matches the expected text format for this step.
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  // Reject files without a frontmatter block so parsing rules stay unambiguous.
  if (!match) throw new Error("Invalid changeset format: missing frontmatter delimiters (---)");

  const skills: Record<string, BumpType> = {};
  // Read each frontmatter line to build the skill bump map.
  for (const rawLine of match[1].split("\n")) {
    // This regex matches the expected text format for this step.
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    // Skip empty lines after trimming comments and whitespace.
    if (!line) continue;

    // This regex matches the expected text format for this step.
    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    // Stop immediately when an entry does not match the expected "skill: bump" format.
    if (!parsed) throw new Error(`Invalid changeset entry line: ${rawLine}`);

    skills[parsed[1]] = parsed[2] as BumpType;
  }

  const body = match[2].trim();
  // Require at least one bump target so the changeset can drive versioning.
  if (Object.keys(skills).length === 0) {
    throw new Error("Changeset must include at least one skill bump entry.");
  }
  // Require a descriptive body so generated release notes are meaningful.
  if (!body) {
    throw new Error("Changeset body must describe the change.");
  }

  return { skills, body };
}
