import { execSync } from "node:child_process";
import process from "node:process";

/**
 * Runs a git command and returns trimmed stdout.
 *
 * @param command - Full git command to execute.
 * @returns Trimmed standard output text.
 */
export function runGit(command: string): string {
  return execSync(command, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}
