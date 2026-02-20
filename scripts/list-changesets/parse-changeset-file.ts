/**
 * Represents one skill bump declaration parsed from a changeset frontmatter block.
 */
export interface ChangesetEntry {
  skill: string;
  bump: "major" | "minor" | "patch";
}

/**
 * Parses changeset frontmatter entries.
 *
 * @param markdown - Full changeset markdown content.
 * @returns Parsed skill bump entries from the frontmatter block.
 */
export function parseChangesetEntries(markdown: string): ChangesetEntry[] {
  // This regex matches the expected text format for this step.
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!frontmatter) return [];

  const entries: ChangesetEntry[] = [];
  // Process entries in order so behavior stays predictable.
  for (const rawLine of frontmatter[1].split("\n")) {
    // This regex matches the expected text format for this step.
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    // Fail fast here so the remaining logic can assume valid input.
    if (!line) continue;

    // This regex matches the expected text format for this step.
    const parsed = line.match(/^"?([a-z0-9][a-z0-9-]*)"?\s*:\s*(major|minor|patch)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (!parsed) continue;

    entries.push({ skill: parsed[1], bump: parsed[2] as ChangesetEntry["bump"] });
  }

  return entries;
}

/**
 * Extracts one-line summary text from changeset body.
 *
 * @param markdown - Full changeset markdown content.
 * @returns First non-empty body line or a fallback placeholder.
 */
export function extractChangesetSummary(markdown: string): string {
  // This regex matches the expected text format for this step.
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
  // Fail fast here so the remaining logic can assume valid input.
  if (!body) return "(no description)";

  return (
    body
      .split("\n")
      // Convert each value into the shape expected by downstream code.
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? "(no description)"
  );
}
