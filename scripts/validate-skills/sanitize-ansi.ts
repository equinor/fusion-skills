/**
 * Removes ANSI color/control escape sequences.
 *
 * @param input - Raw CLI output text.
 * @returns Output text with ANSI escapes removed.
 */
export function sanitizeAnsi(input: string): string {
  const isAnsiPrefixCode = (code: number): boolean => code === 0x1b || code === 0x9b;

  const findAnsiCommandTerminatorIndex = (text: string, startIndex: number): number => {
    const state = { offset: 0 };

    // Move forward until we hit the terminating ANSI command letter.
    for (const character of text.slice(startIndex)) {
      const index = startIndex + state.offset;
      const code = character.charCodeAt(0);
      // This range check detects the terminating ANSI command byte (`A`-`Z` or `a`-`z`).
      if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
        return index;
      }

      state.offset += character.length;
    }

    return text.length;
  };

  const output: string[] = [];
  const state = { currentIndex: 0, nextUnconsumedIndex: 0 };

  // Iterate once across input to avoid recursion depth and repeated string concatenation.
  for (const character of input) {
    const index = state.currentIndex;
    state.currentIndex += character.length;

    // Skip bytes that are already consumed by a previously detected ANSI sequence.
    if (index < state.nextUnconsumedIndex) {
      continue;
    }

    const code = character.charCodeAt(0);
    // Keep regular characters unchanged.
    if (!isAnsiPrefixCode(code)) {
      output.push(character);
      state.nextUnconsumedIndex = index + 1;
      continue;
    }

    const sequenceStart = input[index + 1] === "[" ? index + 2 : index + 1;
    const terminatorIndex = findAnsiCommandTerminatorIndex(input, sequenceStart);
    // Stop if the sequence is truncated at end-of-input.
    if (terminatorIndex >= input.length) {
      break;
    }

    // Resume after the ANSI terminator.
    state.nextUnconsumedIndex = terminatorIndex + 1;
  }

  return output.join("");
}
