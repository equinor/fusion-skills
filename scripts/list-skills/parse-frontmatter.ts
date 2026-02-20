/**
 * Extracts YAML frontmatter from markdown content.
 *
 * @param markdown - Markdown text that may include a frontmatter block.
 * @returns Frontmatter content without delimiters, or empty string when missing.
 */
export function extractFrontmatter(markdown: string): string {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  return match?.[1] ?? "";
}

/**
 * Parses a subset of YAML frontmatter into flat key/value entries.
 *
 * Maintainer note: this parser intentionally handles the subset used in SKILL.md
 * and avoids bringing in YAML dependencies for CI/runtime simplicity.
 *
 * @param frontmatter - Frontmatter content without `---` delimiters.
 * @returns Flat record of parsed frontmatter keys and values.
 */
export function parseFrontmatter(frontmatter: string): Record<string, string> {
  const lines = frontmatter.split("\n");
  const output: Record<string, string> = {};
  let currentMapKey = "";
  let currentListKey = "";

  // Process entries in order so behavior stays predictable.
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+#.*$/, "");
    // Fail fast here so the remaining logic can assume valid input.
    if (!line.trim()) continue;

    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (topLevel && !rawLine.startsWith(" ")) {
      currentMapKey = "";
      currentListKey = "";
      const key = topLevel[1];
      const value = topLevel[2].trim();

      // Fail fast here so the remaining logic can assume valid input.
      if (!value) {
        currentMapKey = key;
        continue;
      }

      output[key] = value.replace(/^"|"$/g, "");
      continue;
    }

    const nested = line.match(/^\s+([a-zA-Z0-9_-]+):\s*(.*)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (nested && currentMapKey) {
      const nestedKey = `${currentMapKey}.${nested[1]}`;
      const nestedValue = nested[2].trim().replace(/^"|"$/g, "");
      output[nestedKey] = nestedValue;
      currentListKey = nestedValue ? "" : nestedKey;
      continue;
    }

    const listItem = line.match(/^\s+-\s*(.+)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (listItem && (currentListKey || currentMapKey)) {
      const listKey = currentListKey || currentMapKey;
      const itemValue = listItem[1].trim().replace(/^"|"$/g, "");
      // Fail fast here so the remaining logic can assume valid input.
      if (output[listKey]) {
        output[listKey] = `${output[listKey]},${itemValue}`;
      } else {
        output[listKey] = itemValue;
      }
    }
  }

  return output;
}
