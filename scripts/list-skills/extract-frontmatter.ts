/**
 * Extracts YAML frontmatter from markdown content.
 *
 * @param markdown - Markdown text that may include a frontmatter block.
 * @returns Frontmatter content without delimiters, or empty string when missing.
 */
export function extractFrontmatter(markdown: string): string {
  // This regex matches the expected text format for this step.
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  return match?.[1] ?? "";
}
