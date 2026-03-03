import { sanitizeAnsi } from "./sanitize-ansi";

/**
 * Extracts skill ids listed by the external skills CLI.
 *
 * @param cliOutput - Raw skills CLI output text.
 * @returns Skill ids discovered in CLI list output.
 */
export function extractCliSkillIds(cliOutput: string): Set<string> {
  const skillIds = new Set<string>();
  const cleanOutput = sanitizeAnsi(cliOutput);

  // Process output lines in order to preserve deterministic parsing.
  for (const line of cleanOutput.split("\n")) {
    // This regex matches the expected text format for this step.
    const match = line.match(/\b((?:fusion|custom)-[a-z0-9-]+)\s*$/);
    // Collect parsed skill ids for presence checks against local skill folders.
    if (match) {
      skillIds.add(match[1]);
    }
  }

  return skillIds;
}
