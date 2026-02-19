import { execSync } from "node:child_process";
import process from "node:process";

/**
 * Runs a git command and returns trimmed stdout.
 */
export function runGit(command: string): string {
  return execSync(command, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

/**
 * Runs a git command and returns null on failure.
 */
export function tryRunGit(command: string): string | null {
  try {
    return runGit(command);
  } catch {
    return null;
  }
}

/**
 * Checks if a file exists at a git ref/path.
 */
export function gitPathExists(ref: string, path: string): boolean {
  return tryRunGit(`git cat-file -e ${ref}:${path}`) !== null;
}
