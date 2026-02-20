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
    for (const [offset, char] of text.slice(startIndex).split("").entries()) {
      // This regex detects the terminating ANSI command byte (`A`-`Z` or `a`-`z`).
      if (/[A-Za-z]/.test(char)) {
        return startIndex + offset;
      }
    }

    return text.length;
  };

  const consume = (index: number, output: string): string => {
    // Stop recursion once all input bytes have been consumed.
    if (index >= input.length) {
      return output;
    }

    const code = input.charCodeAt(index);
    // Keep regular characters unchanged.
    if (!isAnsiPrefixCode(code)) {
      return consume(index + 1, `${output}${input[index]}`);
    }

    const sequenceStart = input[index + 1] === "[" ? index + 2 : index + 1;
    const terminatorIndex = findAnsiCommandTerminatorIndex(input, sequenceStart);
    // Stop if the sequence is truncated at end-of-input.
    if (terminatorIndex >= input.length) {
      return output;
    }

    // Resume after the ANSI terminator.
    return consume(terminatorIndex + 1, output);
  };

  return consume(0, "");
}
