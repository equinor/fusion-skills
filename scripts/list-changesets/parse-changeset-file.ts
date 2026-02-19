export interface ChangesetEntry {
  skill: string;
  bump: "major" | "minor" | "patch";
}

/**
 * Parses changeset frontmatter entries.
 */
export function parseChangesetEntries(markdown: string): ChangesetEntry[] {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontmatter) return [];

  const entries: ChangesetEntry[] = [];
  for (const rawLine of frontmatter[1].split("\n")) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    if (!line) continue;

    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    if (!parsed) continue;

    entries.push({ skill: parsed[1], bump: parsed[2] as ChangesetEntry["bump"] });
  }

  return entries;
}

/**
 * Extracts one-line summary text from changeset body.
 */
export function extractChangesetSummary(markdown: string): string {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
  if (!body) return "(no description)";

  return (
    body
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? "(no description)"
  );
}
