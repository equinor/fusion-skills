/**
 * Extracts YAML frontmatter from markdown content.
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
 */
export function parseFrontmatter(frontmatter: string): Record<string, string> {
  const lines = frontmatter.split("\n");
  const output: Record<string, string> = {};
  let currentMapKey = "";

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+#.*$/, "");
    if (!line.trim()) continue;

    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topLevel && !rawLine.startsWith(" ")) {
      currentMapKey = "";
      const key = topLevel[1];
      const value = topLevel[2].trim();

      if (!value) {
        currentMapKey = key;
        continue;
      }

      output[key] = value.replace(/^"|"$/g, "");
      continue;
    }

    const nested = line.match(/^\s+([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nested && currentMapKey) {
      output[`${currentMapKey}.${nested[1]}`] = nested[2].trim().replace(/^"|"$/g, "");
    }
  }

  return output;
}
