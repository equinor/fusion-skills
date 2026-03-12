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
  const state = { currentMapKey: "", currentListKey: "" };

  /**
   * Removes YAML inline comments while preserving # characters inside quoted strings.
   *
   * @param line - Raw frontmatter line.
   * @returns Line with YAML inline comment removed when applicable.
   */
  function stripInlineComment(line: string): string {
    const quoteState = { inSingleQuote: false, inDoubleQuote: false, escaped: false };
    const characters = Array.from(line);

    /**
     * Determines whether a single-character token should count as whitespace.
     *
     * @param value - Single-character token.
     * @returns True when the token is whitespace.
     */
    function isWhitespace(value: string): boolean {
      return value.trim().length === 0;
    }

    // Walk the line left-to-right so we can stop at the first valid inline comment marker.
    for (const [index, char] of characters.entries()) {
      const previous = index > 0 ? characters[index - 1] : "";

      // Track escapes only inside double-quoted strings so escaped quotes do not toggle quote state.
      if (char === "\\" && quoteState.inDoubleQuote && !quoteState.escaped) {
        quoteState.escaped = true;
        continue;
      }

      // Toggle quote tracking so # inside quoted text is preserved as literal content.
      if (char === "'" && !quoteState.inDoubleQuote) {
        quoteState.inSingleQuote = !quoteState.inSingleQuote;
      }

      // Toggle double-quote tracking so escaped quotes do not prematurely end quoted text.
      if (char === '"' && !quoteState.inSingleQuote && !quoteState.escaped) {
        quoteState.inDoubleQuote = !quoteState.inDoubleQuote;
      }

      // Treat # as an inline comment marker only when it appears outside quotes after whitespace.
      if (
        char === "#" &&
        !quoteState.inSingleQuote &&
        !quoteState.inDoubleQuote &&
        (!previous || isWhitespace(previous))
      ) {
        return line.slice(0, index).trimEnd();
      }

      quoteState.escaped = false;
    }

    return line;
  }

  // Process entries in order so behavior stays predictable.
  for (const rawLine of lines) {
    const line = stripInlineComment(rawLine);
    // Fail fast here so the remaining logic can assume valid input.
    if (!line.trim()) continue;

    // This regex matches the expected text format for this step.
    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (topLevel && !rawLine.startsWith(" ")) {
      state.currentMapKey = "";
      state.currentListKey = "";
      const key = topLevel[1];
      const value = topLevel[2].trim();

      // Fail fast here so the remaining logic can assume valid input.
      if (!value) {
        state.currentMapKey = key;
        continue;
      }

      // This regex matches the expected text format for this step.
      output[key] = value.replace(/^["']|["']$/g, "");
      continue;
    }

    // This regex matches the expected text format for this step.
    const nested = line.match(/^\s+([a-zA-Z0-9_-]+):\s*(.*)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (nested && state.currentMapKey) {
      const nestedKey = `${state.currentMapKey}.${nested[1]}`;
      // This regex matches the expected text format for this step.
      const nestedValue = nested[2].trim().replace(/^["']|["']$/g, "");
      output[nestedKey] = nestedValue;
      state.currentListKey = nestedValue ? "" : nestedKey;
      continue;
    }

    // This regex matches the expected text format for this step.
    const listItem = line.match(/^\s+-\s*(.+)$/);
    // Fail fast here so the remaining logic can assume valid input.
    if (listItem && (state.currentListKey || state.currentMapKey)) {
      const listKey = state.currentListKey || state.currentMapKey;
      // This regex matches the expected text format for this step.
      const itemValue = listItem[1].trim().replace(/^["']|["']$/g, "");
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
