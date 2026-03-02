import { runGitArgs } from "./git-helpers";

/**
 * Runs a git argv command and returns null on failure.
 *
 * @param args - Git argv list, excluding the `git` executable.
 * @returns Trimmed output text, or `null` when the command fails.
 */
export function tryRunGitArgs(args: string[]): string | null {
  try {
    return runGitArgs(args);
  } catch {
    return null;
  }
}
