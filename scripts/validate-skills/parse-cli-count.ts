/**
 * Removes ANSI color/control escape sequences.
 */
export function sanitizeAnsi(input: string): string {
  let output = "";
  let index = 0;

  while (index < input.length) {
    const code = input.charCodeAt(index);
    const isAnsiPrefix = code === 0x1b || code === 0x9b;

    if (!isAnsiPrefix) {
      output += input[index];
      index += 1;
      continue;
    }

    index += 1;
    if (input[index] === "[") {
      index += 1;
    }

    while (index < input.length && !/[A-Za-z]/.test(input[index])) {
      index += 1;
    }

    if (index < input.length) {
      index += 1;
    }
  }

  return output;
}

/**
 * Parses skill count from skills CLI output.
 */
export function parseCliSkillCount(output: string): number {
  const match = output.match(/Found[^0-9]*([0-9]+)/i);
  if (!match) {
    throw new Error("Could not parse skill count from CLI output.");
  }
  return Number(match[1]);
}
