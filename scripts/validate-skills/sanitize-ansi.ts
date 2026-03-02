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
      const code = text.charCodeAt(index);
      // This range check detects the terminating ANSI command byte (`A`-`Z` or `a`-`z`).
      if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
        return index;
      }
    }

    return text.length;
  };

  const output: string[] = [];
  let index = 0;

  // Iterate once across input to avoid recursion depth and repeated string concatenation.
  while (index < input.length) {
    const code = input.charCodeAt(index);
    // Keep regular characters unchanged.
    if (!isAnsiPrefixCode(code)) {
      output.push(input[index] ?? "");
      index += 1;
      continue;
    }

    const sequenceStart = input[index + 1] === "[" ? index + 2 : index + 1;
    const terminatorIndex = findAnsiCommandTerminatorIndex(input, sequenceStart);
    // Stop if the sequence is truncated at end-of-input.
    if (terminatorIndex >= input.length) {
      break;
    }

    // Resume after the ANSI terminator.
    index = terminatorIndex + 1;
  }

  return output.join("");
}
