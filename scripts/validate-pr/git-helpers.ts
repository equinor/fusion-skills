import { execFileSync } from "node:child_process";
import process from "node:process";

/**
 * Runs git with explicit argv and returns trimmed stdout.
 *
 * @param args - Git argv list, excluding the `git` executable.
 * @returns Trimmed standard output text.
 */
export function runGitArgs(args: string[]): string {
  return execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}
