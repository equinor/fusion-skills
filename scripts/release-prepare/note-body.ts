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
