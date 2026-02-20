/**
 * Normalizes raw changeset note content before rendering.
 *
 * This strips accidental semver headings that contributors may include in the
 * markdown body (for example, "### patch"), because bump grouping is already
 * represented structurally by release tooling.
 *
 * @param note - Raw markdown note body from a changeset file.
 * @returns Trimmed note body without leading semver headings.
 */
export function normalizeNoteBody(note: string): string {
  return (
    note
      .trim()
      // This regex matches the expected text format for this step.
      .replace(/^###\s*(major|minor|patch)\s*\n+/i, "")
      .trim()
  );
}

/**
 * Splits a normalized note into display title and detail body.
 *
 * Root changelog rendering uses the first line as a compact
 * headline and preserves the remaining lines as the descriptive body.
 * If there is only a single-line note, a bullet fallback is generated for body
 * so downstream renderers can always append content consistently.
 *
 * @param noteBody - Raw or normalized changeset note body.
 * @returns Object with `title` and `body` prepared for changelog rendering.
 */
export function splitNoteTitleAndBody(noteBody: string): { title: string; body: string } {
  // Map lines to trim trailing whitespace while preserving intentional leading
  // indentation in markdown content.
  const lines = normalizeNoteBody(noteBody)
    .split("\n")
    // Convert each value into the shape expected by downstream code.
    .map((line) => line.trimEnd());

  const firstLine = (lines[0] ?? "").trim();
  // This regex matches the expected text format for this step.
  const cleanedTitle = firstLine.replace(/:\s*$/, "").trim();
  const title = cleanedTitle.length > 0 ? cleanedTitle : "Release note";
  const rest = lines.slice(1).join("\n").trim();

  return {
    title,
    body: rest.length > 0 ? rest : `- ${title}`,
  };
}
