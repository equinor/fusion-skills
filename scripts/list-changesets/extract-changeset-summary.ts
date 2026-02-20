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
