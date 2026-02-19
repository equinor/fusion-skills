import { execSync } from "node:child_process";
import { relative } from "node:path";

export interface ChangesetProvenance {
  prNumber: string | null;
  commitSha: string | null;
  authorLogin: string | null;
}

function extractGitHubLoginFromEmail(email: string): string | null {
  const match = email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i);
  return match?.[1] ?? null;
}

function parseGitHubRepoSlug(remoteUrl: string): string | null {
  const sshMatch = remoteUrl.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/i);
  if (sshMatch) {
    return sshMatch[1];
  }

  const httpsMatch = remoteUrl.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/i);
  if (httpsMatch) {
    return httpsMatch[1];
  }

  return null;
}

function shellEscape(value: string): string {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function tryRunGit(command: string): string | null {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Resolves owner/repo from git origin URL.
 */
export function getRepoSlug(): string | null {
  const remote = tryRunGit("git config --get remote.origin.url");
  if (!remote) {
    return null;
  }
  return parseGitHubRepoSlug(remote);
}

/**
 * Resolves commit/PR provenance for a changeset file from git history.
 */
export function getChangesetProvenance(
  repoRoot: string,
  changesetFile: string,
): ChangesetProvenance {
  const filePath = relative(repoRoot, changesetFile);
  const output = tryRunGit(
    `git log --diff-filter=A --format=%H%x09%s%x09%ae -n 1 -- ${shellEscape(filePath)}`,
  );

  if (!output) {
    return { prNumber: null, commitSha: null, authorLogin: null };
  }

  const [rawSha, rawSubject = "", rawEmail = ""] = output.split("\t");
  const subject = rawSubject;
  const prMatch = subject.match(/\(#(\d+)\)|#(\d+)/);
  const authorLogin = extractGitHubLoginFromEmail(rawEmail);

  return {
    prNumber: prMatch?.[1] ?? prMatch?.[2] ?? null,
    commitSha: rawSha || null,
    authorLogin,
  };
}
