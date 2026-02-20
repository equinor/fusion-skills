import { execSync } from "node:child_process";
import process from "node:process";

/**
 * Executes a git command and returns trimmed stdout when successful.
 *
 * @param command - Full git command string to execute.
 * @returns Trimmed stdout, or null when command execution fails.
 */
function tryRunGit(command: string): string | null {
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

/**
 * Parses an `owner/repo` slug from common GitHub remote URL formats.
 *
 * @param remoteUrl - Git remote URL string.
 * @returns Parsed repository slug or null when the URL is not a GitHub remote.
 */
function parseGitHubRepoSlug(remoteUrl: string): string | null {
  // This regex matches the expected text format for this step.
  const sshMatch = remoteUrl.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/i);
  // Fail fast here so the remaining logic can assume valid input.
  if (sshMatch) {
    return sshMatch[1];
  }

  // This regex matches the expected text format for this step.
  const httpsMatch = remoteUrl.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/i);
  // Fail fast here so the remaining logic can assume valid input.
  if (httpsMatch) {
    return httpsMatch[1];
  }

  return null;
}

/**
 * Resolves owner/repo from git origin URL.
 *
 * @returns GitHub repository slug from `origin`, or null when unavailable.
 */
export function getRepoSlug(): string | null {
  const remote = tryRunGit("git config --get remote.origin.url");
  // Fail fast here so the remaining logic can assume valid input.
  if (!remote) {
    return null;
  }

  return parseGitHubRepoSlug(remote);
}
