import { execSync } from "node:child_process";
import { relative } from "node:path";

/**
 * Git provenance metadata resolved for a newly added changeset file.
 */
export interface ChangesetProvenance {
  prNumber: string | null;
  prTitle: string | null;
  commitSha: string | null;
  authorLogin: string | null;
}

/**
 * Extracts a clean PR title from a commit subject line.
 *
 * @param subject - Commit subject line from git log.
 * @param prNumber - PR number inferred from subject, when available.
 * @returns Clean PR title or null when no reliable title can be derived.
 */
function extractPrTitleFromSubject(subject: string, prNumber: string | null): string | null {
  const trimmed = subject.trim();
  // Fail fast here so the remaining logic can assume valid input.
  if (!trimmed) {
    return null;
  }

  // This regex detects default merge-commit subjects so we don't treat them as authored PR titles.
  if (/^Merge pull request #\d+/i.test(trimmed)) {
    return null;
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (!prNumber) {
    return null;
  }

  // This regex matches the expected text format for this step.
  const withoutPrSuffix = trimmed.replace(/\s*\(#\d+\)\s*$/u, "").trim();
  return withoutPrSuffix || null;
}

/**
 * Infers a GitHub login from a noreply commit email address.
 *
 * @param email - Commit author email.
 * @returns GitHub login when email uses GitHub noreply format; otherwise null.
 */
function extractGitHubLoginFromEmail(email: string): string | null {
  // This regex matches the expected text format for this step.
  const match = email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i);
  return match?.[1] ?? null;
}

/**
 * Escapes a value for safe use as a single shell argument.
 *
 * @param value - Raw argument value.
 * @returns Shell-escaped argument wrapped in single quotes.
 */
function shellEscape(value: string): string {
  // This regex matches the expected text format for this step.
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

/**
 * Executes a git command and returns trimmed stdout when successful.
 *
 * @param command - Full git command string to execute.
 * @returns Trimmed stdout, or null when command execution fails.
 */
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
 * Resolves commit/PR provenance for a changeset file from git history.
 *
 * @param repoRoot - Absolute repository root path.
 * @param changesetFile - Absolute path to a changeset file.
 * @returns Provenance metadata for the file introduction commit.
 */
export function getChangesetProvenance(
  repoRoot: string,
  changesetFile: string,
): ChangesetProvenance {
  const filePath = relative(repoRoot, changesetFile);
  const output = tryRunGit(
    `git log --diff-filter=A --format=%H%x09%s%x09%ae -n 1 -- ${shellEscape(filePath)}`,
  );

  // Fail fast here so the remaining logic can assume valid input.
  if (!output) {
    return { prNumber: null, prTitle: null, commitSha: null, authorLogin: null };
  }

  const [rawSha, rawSubject = "", rawEmail = ""] = output.split("\t");
  const subject = rawSubject;
  // This regex matches the expected text format for this step.
  const prMatch = subject.match(/\(#(\d+)\)|#(\d+)/);
  const prNumber = prMatch?.[1] ?? prMatch?.[2] ?? null;
  const authorLogin = extractGitHubLoginFromEmail(rawEmail);
  const prTitle = extractPrTitleFromSubject(subject, prNumber);

  return {
    prNumber,
    prTitle,
    commitSha: rawSha || null,
    authorLogin,
  };
}
