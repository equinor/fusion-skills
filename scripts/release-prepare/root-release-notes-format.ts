import { normalizeNoteBody, splitNoteTitleAndBody } from "./note-body";
import type { BumpType } from "./semver";

const BUMP_ORDER: BumpType[] = ["major", "minor", "patch"];

/**
 * Root changelog entry payload representing one processed changeset.
 */
export interface RootReleaseEntry {
  /** Highest bump level across all skills touched by the changeset. */
  bumpType: BumpType;
  /** Raw changeset body markdown. */
  body: string;
  /** Pull request number associated with the introducing commit, if discoverable. */
  prNumber: string | null;
  /** Pull request title associated with the introducing commit, if discoverable. */
  prTitle?: string | null;
  /** Full commit SHA associated with the changeset provenance, if discoverable. */
  commitSha: string | null;
  /** Final `skill@version` list for all skills updated by this changeset. */
  packages: string[];
}

/**
 * Root release entries grouped by semantic bump type.
 */
export interface GroupedRootReleaseNotes {
  major: RootReleaseEntry[];
  minor: RootReleaseEntry[];
  patch: RootReleaseEntry[];
}

/**
 * Converts a bump type into its root changelog heading label.
 *
 * @param bumpType - Semantic bump category.
 * @returns Title-cased heading label.
 */
function toHeadingLabel(bumpType: BumpType): string {
  // Render title-cased heading for major bump sections.
  if (bumpType === "major") return "Major";
  // Render title-cased heading for minor bump sections.
  if (bumpType === "minor") return "Minor";
  return "Patch";
}

/**
 * Formats an entry title with optional PR link metadata.
 *
 * @param title - Display title text.
 * @param prNumber - Optional pull request number.
 * @param repoSlug - Optional `owner/repo` used to build PR links.
 * @returns Linked title markdown when possible, otherwise plain text.
 */
function formatTitleLink(title: string, prNumber: string | null, repoSlug: string | null): string {
  const titleWithPr = prNumber ? `${title} #${prNumber}` : title;
  // Link title to PR when both PR number and repository slug are available.
  if (prNumber && repoSlug) {
    return `[${titleWithPr}](https://github.com/${repoSlug}/pull/${prNumber})`;
  }
  return titleWithPr;
}

/**
 * Formats a commit SHA as linked or plain short text.
 *
 * @param commitSha - Full commit SHA, if available.
 * @param repoSlug - Optional `owner/repo` used to build commit links.
 * @returns Linked short SHA, short SHA text, or `n/a` when missing.
 */
function formatCommitLink(commitSha: string | null, repoSlug: string | null): string {
  // Fall back to plain placeholder when commit provenance is unavailable.
  if (!commitSha) {
    return "n/a";
  }

  const shortSha = commitSha.slice(0, 7);
  // Link short SHA to commit when repository slug is available.
  if (repoSlug) {
    return `[${shortSha}](https://github.com/${repoSlug}/commit/${commitSha})`;
  }

  return shortSha;
}

/**
 * Renders the emphasized header block for one root release entry.
 *
 * @param entry - Root changelog entry payload.
 * @param repoSlug - Optional `owner/repo` used for links.
 * @returns Markdown line containing the formatted emphasized header block.
 */
function renderRootEntryHeader(entry: RootReleaseEntry, repoSlug: string | null): string {
  const { title: fallbackTitle } = splitNoteTitleAndBody(entry.body);
  const title = entry.prTitle?.trim() || fallbackTitle;
  // Package list reflects all skills affected by one changeset entry.
  // Map package identifiers into display lines for the emphasized header block.
  const packageLines = entry.packages.map((pkg) => `📦 ${pkg}`);
  const lines = [
    `🎯 ${formatTitleLink(title, entry.prNumber, repoSlug)}`,
    `🗂️ ${formatCommitLink(entry.commitSha, repoSlug)}`,
    ...packageLines,
  ];

  // Map lines into HTML line-break-separated markdown while keeping the last
  // line without a trailing <br/>.
  const block = lines
    // Convert each value into the shape expected by downstream code.
    .map((line, index) => (index < lines.length - 1 ? `${line}<br/>` : line))
    .join("\n");
  return `__${block}__`;
}

/**
 * Renders the body lines for one root release entry.
 *
 * @param entry - Root changelog entry payload.
 * @returns Markdown body lines for the entry.
 */
function renderRootEntryBody(entry: RootReleaseEntry): string[] {
  const { title: fallbackTitle, body } = splitNoteTitleAndBody(entry.body);
  const prTitle = entry.prTitle?.trim();

  // When the rendered headline comes from PR title (not changeset first line),
  // preserve the full normalized changeset body so no authored content is lost.
  if (prTitle && prTitle !== fallbackTitle) {
    return normalizeNoteBody(entry.body).split("\n");
  }

  return body.split("\n");
}

/**
 * Renders root changelog release notes in grouped Major/Minor/Patch layout.
 *
 * Separators are inserted only between entries in a section.
 * This avoids trailing `---` after the last or only entry and matches the
 * repository's preferred visual rhythm.
 *
 * @param notesByType - Root release entries grouped by bump category.
 * @param repoSlug - Optional `owner/repo` used to build PR/commit links.
 * @returns Markdown lines ready to join with newlines.
 */
export function renderRootReleaseNotes(
  notesByType: GroupedRootReleaseNotes,
  repoSlug: string | null,
): string[] {
  const output: string[] = [];

  // Iterate bump buckets in semantic priority order.
  for (const bumpType of BUMP_ORDER) {
    const entries = notesByType[bumpType];
    // Omit headings for empty bump buckets.
    if (entries.length === 0) {
      // Empty bump sections are intentionally omitted from root changelog output.
      continue;
    }

    output.push(`### ${toHeadingLabel(bumpType)}`, "");

    // Iterate entries within the bump bucket and render each block.
    for (const [index, entry] of entries.entries()) {
      output.push(renderRootEntryHeader(entry, repoSlug), "", ...renderRootEntryBody(entry));

      // Insert separator only between entries (never trailing after last/only).
      if (index < entries.length - 1) {
        // Separator appears only between entries (never trailing after last/only).
        output.push("", "---", "");
      }
    }

    output.push("");
  }

  return output;
}
