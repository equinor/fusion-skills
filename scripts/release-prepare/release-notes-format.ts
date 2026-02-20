import { normalizeNoteBody as normalizeNoteBodyShared } from "./note-body";
import type { BumpType } from "./semver";

const BUMP_ORDER: BumpType[] = ["major", "minor", "patch"];

/**
 * Provenance-enriched note payload for skill changelog rendering.
 */
export interface NoteEntry {
  /** Human-authored changeset body markdown. */
  body: string;
  /** Pull request number associated with the changeset commit, if discoverable. */
  prNumber: string | null;
  /** Full commit SHA that introduced the changeset file, if discoverable. */
  commitSha: string | null;
  /** GitHub login inferred from noreply commit email, if available. */
  authorLogin: string | null;
}

/**
 * Skill note entries grouped by semantic bump type.
 */
export interface GroupedNotes {
  major: NoteEntry[];
  minor: NoteEntry[];
  patch: NoteEntry[];
}

/**
 * Builds provenance text for one rendered note entry.
 *
 * @param entry - Note entry with optional PR, commit, and author metadata.
 * @param repoSlug - Optional `owner/repo` used for GitHub links.
 * @returns Provenance suffix string, or empty string when no metadata exists.
 */
function formatProvenance(entry: NoteEntry, repoSlug: string | null): string {
  const parts: string[] = [];

  // Append pull request provenance when available.
  if (entry.prNumber) {
    // Prefer canonical GitHub link when repository slug is known.
    if (repoSlug) {
      parts.push(`[#${entry.prNumber}](https://github.com/${repoSlug}/pull/${entry.prNumber})`);
    } else {
      parts.push(`#${entry.prNumber}`);
    }
  }

  // Append commit provenance when available.
  if (entry.commitSha) {
    const shortSha = entry.commitSha.slice(0, 7);
    // Prefer canonical GitHub link when repository slug is known.
    if (repoSlug) {
      parts.push(`[\`${shortSha}\`](https://github.com/${repoSlug}/commit/${entry.commitSha})`);
    } else {
      parts.push(`\`${shortSha}\``);
    }
  }

  // Append author acknowledgement when login could be inferred.
  if (entry.authorLogin) {
    parts.push(`Thanks [@${entry.authorLogin}](https://github.com/${entry.authorLogin})!`);
  }

  return parts.join(" ");
}

/**
 * Renders a single note entry as markdown bullet lines.
 *
 * @param entry - Note entry to render.
 * @param repoSlug - Optional `owner/repo` used for provenance links.
 * @returns Markdown lines for the rendered note block.
 */
function renderNoteEntry(entry: NoteEntry, repoSlug: string | null): string[] {
  const lines = entry.body.split("\n");
  const firstLine = lines[0] ?? "";
  const rest = lines.slice(1);
  const provenance = formatProvenance(entry, repoSlug);
  const bulletPrefix = provenance ? `${provenance} - ` : "";
  const output = [`- ${bulletPrefix}${firstLine}`];

  // Render multiline note details beneath the bullet headline when present.
  if (rest.length > 0) {
    output.push("");
    // Re-emit remaining lines with bullet indentation preserved.
    for (const line of rest) {
      output.push(line ? `  ${line}` : "");
    }
  }

  return output;
}

/**
 * Renders skill changelog note groups with configurable heading depth.
 *
 * This renderer intentionally preserves existing skill
 * changelog style, while root changelog rendering is handled separately in
 * `root-release-notes-format.ts`.
 *
 * @param notesByType - Note entries grouped by bump category.
 * @param repoSlug - Optional `owner/repo` for link construction.
 * @param bumpHeadingLevel - Heading level for bump sections (`###` or `####`).
 * @returns Markdown lines ready to join with newlines.
 */
export function renderGroupedNotes(
  notesByType: GroupedNotes,
  repoSlug: string | null,
  bumpHeadingLevel: 3 | 4,
): string[] {
  const output: string[] = [];

  // Iterate bump buckets in semantic priority order.
  for (const bumpType of BUMP_ORDER) {
    // Map note bodies through normalization to remove accidental headings.
    // Filter out entries that become empty after normalization.
    const notes = notesByType[bumpType]
      // Convert each value into the shape expected by downstream code.
      .map((entry) => ({
        ...entry,
        body: normalizeNoteBodyShared(entry.body),
      }))
      // Keep only items that meet the rules for this step.
      .filter((entry) => entry.body.length > 0);

    // Skip headings for bump buckets without any renderable notes.
    if (notes.length === 0) {
      continue;
    }

    output.push(`${"#".repeat(bumpHeadingLevel)} ${bumpType}`, "");
    // Iterate notes inside the bump bucket and render each markdown block.
    for (const [index, note] of notes.entries()) {
      output.push(...renderNoteEntry(note, repoSlug));
      // Insert spacing only between notes, not after the last one.
      if (index < notes.length - 1) {
        output.push("");
      }
    }
    output.push("");
  }

  return output;
}
