/**
 * Removes ANSI color/control escape sequences.
 *
 * @param input - Raw CLI output text.
 * @returns Output text with ANSI escapes removed.
 */
export function sanitizeAnsi(input: string): string {
  let output = "";
  let index = 0;

  // Walk input byte-by-byte to remove ANSI control sequences deterministically.
  while (index < input.length) {
    const code = input.charCodeAt(index);
    const isAnsiPrefix = code === 0x1b || code === 0x9b;

    // Keep plain characters untouched when current byte is not an ANSI prefix.
    if (!isAnsiPrefix) {
      output += input[index];
      index += 1;
      continue;
    }

    index += 1;
    // Skip explicit CSI bracket when escape sequence uses ESC [ form.
    if (input[index] === "[") {
      index += 1;
    }

    // Advance through parameter bytes until reaching final ANSI command letter.
    while (index < input.length && !/[A-Za-z]/.test(input[index])) {
      index += 1;
    }

    // Consume the final command letter when sequence termination was found.
    if (index < input.length) {
      index += 1;
    }
  }

  return output;
}

/**
 * Parses skill count from skills CLI output.
 *
 * @param output - CLI output text.
 * @returns Parsed numeric skill count.
 */
export function parseCliSkillCount(output: string): number {
  const match = output.match(/Found[^0-9]*([0-9]+)/i);
  // Fail with actionable error when CLI output format is unexpected.
  if (!match) {
    throw new Error("Could not parse skill count from CLI output.");
  }
  return Number(match[1]);
}
