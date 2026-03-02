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
