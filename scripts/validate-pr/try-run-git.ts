import { runGit } from "./git-helpers";

/**
 * Runs a git command and returns null on failure.
 *
 * @param command - Full git command to execute.
 * @returns Trimmed output text, or `null` when the command fails.
 */
export function tryRunGit(command: string): string | null {
  try {
    return runGit(command);
  } catch {
    return null;
  }
}
