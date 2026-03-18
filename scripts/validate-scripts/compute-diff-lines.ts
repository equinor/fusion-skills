import { execFileSync } from "node:child_process";

/**
 * Represents a single line or range of lines in a file.
 */
export interface LineRange {
  start: number;
  end: number;
}

/**
 * Map of file paths to the line ranges that changed in a diff.
 */
export interface DiffLineMap {
  [filePath: string]: LineRange[];
}

/**
 * Parses unified diff output to extract changed line ranges per file.
 *
 * @param diffOutput - Output from `git diff -U0 --no-prefix`.
 * @returns Map of file paths to arrays of line ranges that changed.
 */
function parseDiffHunks(diffOutput: string): DiffLineMap {
  const lineMap: DiffLineMap = {};

  // Split on "diff --git" markers to isolate per-file blocks.
  // This regex matches git diff file-header boundaries across multiline unified diff output.
  const fileBlocks = diffOutput.split(/^diff --git/m).slice(1);

  // Iterate each file block so we can collect changed line ranges per file path.
  for (const block of fileBlocks) {
    const lines = block.split("\n");
    const firstLine = (lines[0] || "").trim();
    // This regex splits the header line on one-or-more whitespace separators.
    const headerParts = firstLine.split(/\s+/);
    // Skip malformed diff headers that do not include both old and new file tokens.
    if (headerParts.length < 2) continue;

    const rawNewPath = headerParts[1];
    // Skip deleted-file entries where the new-file side is not present.
    if (!rawNewPath || rawNewPath === "/dev/null") continue;

    const filePath = rawNewPath.startsWith("b/") ? rawNewPath.slice(2) : rawNewPath;
    const ranges: LineRange[] = [];

    // Find hunk headers (@@ -old,count +new,count @@) to extract line ranges in the new file.
    for (const line of lines) {
      // This regex captures new-file hunk start/count fields from unified diff hunk headers.
      // This regex hunk header format is: @@ -oldStart,oldCount +newStart,newCount @@
      const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
      // Skip non-hunk lines so only changed range metadata is parsed.
      if (!hunkMatch) continue;

      const newStart = parseInt(hunkMatch[1], 10);
      // When count is omitted, it defaults to 1 (single line).
      const newCount = hunkMatch[2] ? parseInt(hunkMatch[2], 10) : 1;

      // Only record non-empty hunks (count > 0 means lines were changed/added).
      if (newCount > 0) {
        ranges.push({ start: newStart, end: newStart + newCount - 1 });
      }
    }

    // Store ranges for this file if any hunks were found.
    if (ranges.length > 0) {
      lineMap[filePath] = ranges;
    }
  }

  return lineMap;
}

/**
 * Computes the set of changed line ranges in a PR diff.
 *
 * @param repoRoot - Absolute repository root path.
 * @param baseRef - Git base ref to compare against.
 * @returns Map of file paths to arrays of changed line ranges.
 */
export function computeDiffLineMap(repoRoot: string, baseRef: string): DiffLineMap {
  try {
    // Use -U0 to omit context lines and only show added/modified lines.
    const diffOutput = execFileSync("git", ["diff", "-U0", "--no-prefix", `${baseRef}...HEAD`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return parseDiffHunks(diffOutput);
  } catch {
    // If diff fails, return empty map (assume all diagnostics are valid).
    return {};
  }
}

