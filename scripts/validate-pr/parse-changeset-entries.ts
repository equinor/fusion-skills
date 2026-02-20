/**
 * Supported bump values allowed in changeset frontmatter entries.
 */
export type ChangesetBumpType = "major" | "minor" | "patch";

/**
 * Parses changeset frontmatter into skill->bump entries.
 *
 * @param content - Raw changeset markdown content.
 * @returns Parsed skill bump entries from frontmatter.
 */
export function parseChangesetEntries(content: string): Map<string, ChangesetBumpType> {
  const entries = new Map<string, ChangesetBumpType>();
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n?/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!frontmatter) return entries;

  // Process entries in order so behavior stays predictable.
  for (const rawLine of frontmatter[1].split("\n")) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    // Fail fast here so the remaining logic can assume valid input.
    if (!line) continue;

    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (!parsed) continue;

    entries.set(parsed[1], parsed[2] as ChangesetBumpType);
  }

  return entries;
}
