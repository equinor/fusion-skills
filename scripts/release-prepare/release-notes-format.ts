import type { BumpType } from "./semver";

const BUMP_ORDER: BumpType[] = ["major", "minor", "patch"];

export interface NoteEntry {
  body: string;
  prNumber: string | null;
  commitSha: string | null;
  authorLogin: string | null;
}

export interface GroupedNotes {
  major: NoteEntry[];
  minor: NoteEntry[];
  patch: NoteEntry[];
}

/**
 * Removes accidental semver headings from note body content.
 */
export function normalizeNoteBody(note: string): string {
  return note
    .trim()
    .replace(/^###\s*(major|minor|patch)\s*\n+/i, "")
    .trim();
}

function formatProvenance(entry: NoteEntry, repoSlug: string | null): string {
  const parts: string[] = [];

  if (entry.prNumber) {
    if (repoSlug) {
      parts.push(`[#${entry.prNumber}](https://github.com/${repoSlug}/pull/${entry.prNumber})`);
    } else {
      parts.push(`#${entry.prNumber}`);
    }
  }

  if (entry.commitSha) {
    const shortSha = entry.commitSha.slice(0, 7);
    if (repoSlug) {
      parts.push(`[\`${shortSha}\`](https://github.com/${repoSlug}/commit/${entry.commitSha})`);
    } else {
      parts.push(`\`${shortSha}\``);
    }
  }

  if (entry.authorLogin) {
    parts.push(`Thanks [@${entry.authorLogin}](https://github.com/${entry.authorLogin})!`);
  }

  return parts.join(" ");
}

function renderNoteEntry(entry: NoteEntry, repoSlug: string | null): string[] {
  const lines = entry.body.split("\n");
  const firstLine = lines[0] ?? "";
  const rest = lines.slice(1);
  const provenance = formatProvenance(entry, repoSlug);
  const bulletPrefix = provenance ? `${provenance} - ` : "";
  const output = [`- ${bulletPrefix}${firstLine}`];

  if (rest.length > 0) {
    output.push("");
    for (const line of rest) {
      output.push(line ? `  ${line}` : "");
    }
  }

  return output;
}

/**
 * Renders grouped note entries with configurable heading depth.
 */
export function renderGroupedNotes(
  notesByType: GroupedNotes,
  repoSlug: string | null,
  bumpHeadingLevel: 3 | 4,
): string[] {
  const output: string[] = [];

  for (const bumpType of BUMP_ORDER) {
    const notes = notesByType[bumpType]
      .map((entry) => ({
        ...entry,
        body: normalizeNoteBody(entry.body),
      }))
      .filter((entry) => entry.body.length > 0);

    if (notes.length === 0) {
      continue;
    }

    output.push(`${"#".repeat(bumpHeadingLevel)} ${bumpType}`, "");
    for (let index = 0; index < notes.length; index++) {
      output.push(...renderNoteEntry(notes[index], repoSlug));
      if (index < notes.length - 1) {
        output.push("");
      }
    }
    output.push("");
  }

  return output;
}
