/**
 * Extracts YAML frontmatter from markdown content.
 *
 * @param markdown - Markdown text that may include a frontmatter block.
 * @returns Frontmatter content without delimiters, or empty string when missing.
 */
export function extractFrontmatter(markdown: string): string {
  // This regex matches a YAML frontmatter block delimited by --- with optional \r\n line endings.
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return match?.[1] ?? "";
}
