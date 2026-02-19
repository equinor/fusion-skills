export type ChangesetBumpType = "major" | "minor" | "patch";

/**
 * Parses changeset frontmatter into skill->bump entries.
 */
export function parseChangesetEntries(content: string): Map<string, ChangesetBumpType> {
  const entries = new Map<string, ChangesetBumpType>();
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontmatter) return entries;

  for (const rawLine of frontmatter[1].split("\n")) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    if (!line) continue;

    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    if (!parsed) continue;

    entries.set(parsed[1], parsed[2] as ChangesetBumpType);
  }

  return entries;
}
