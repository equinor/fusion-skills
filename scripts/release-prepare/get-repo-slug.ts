import { tryRunGit } from "./try-run-git";

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
