import { execSync } from "node:child_process";
import process from "node:process";

/**
 * Executes a git command and returns trimmed stdout when successful.
 *
 * @param command - Full git command string to execute.
 * @returns Trimmed stdout, or null when command execution fails.
 */
export function tryRunGit(command: string): string | null {
  try {
    return execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}
