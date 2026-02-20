/**
 * Removes ANSI color/control escape sequences.
 *
 * @param input - Raw CLI output text.
 * @returns Output text with ANSI escapes removed.
 */
export function sanitizeAnsi(input: string): string {
  const isAnsiPrefixCode = (code: number): boolean => code === 0x1b || code === 0x9b;

  const findAnsiCommandTerminatorIndex = (text: string, startIndex: number): number => {
    // Move forward until we hit the terminating ANSI command letter.
    for (let index = startIndex; index < text.length; index += 1) {
      // This regex detects the terminating ANSI command byte (`A`-`Z` or `a`-`z`).
      if (/[A-Za-z]/.test(text[index])) {
        return index;
      }
    }

    return text.length;
  };

  let output = "";

  // Copy plain text and skip ANSI sequences one token at a time.
  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);

    // Keep regular characters unchanged.
    if (!isAnsiPrefixCode(code)) {
      output += input[index];
      continue;
    }

    let sequenceStart = index + 1;
    // `ESC [` is a common ANSI form; skip the `[` before scanning parameters.
    if (input[sequenceStart] === "[") {
      sequenceStart += 1;
    }

    const terminatorIndex = findAnsiCommandTerminatorIndex(input, sequenceStart);
    // Stop if the sequence is truncated at end-of-input.
    if (terminatorIndex >= input.length) {
      break;
    }

    // Jump to the terminator; loop increment moves to the next visible character.
    index = terminatorIndex;
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
  // This regex matches the expected text format for this step.
  const match = output.match(/Found[^0-9]*([0-9]+)/i);
  // Fail with actionable error when CLI output format is unexpected.
  if (!match) {
    throw new Error("Could not parse skill count from CLI output.");
  }
  return Number(match[1]);
}
