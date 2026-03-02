import { execFileSync } from "node:child_process";
import process from "node:process";

/**
 * Executes git with explicit argv and returns trimmed stdout when successful.
 *
 * @param args - Git argv list, excluding the `git` executable.
 * @returns Trimmed stdout, or null when command execution fails.
 */
export function tryRunGitArgs(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}
