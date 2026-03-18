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
  const fileBlocks = diffOutput.split(/^diff --git/m).slice(1);

  for (const block of fileBlocks) {
    const lines = block.split("\n");
    const firstLine = (lines[0] || "").trim();
    const headerParts = firstLine.split(/\s+/);
    if (headerParts.length < 2) continue;

    const rawNewPath = headerParts[1];
    if (!rawNewPath || rawNewPath === "/dev/null") continue;

    const filePath = rawNewPath.startsWith("b/") ? rawNewPath.slice(2) : rawNewPath;
    const ranges: LineRange[] = [];

    // Find hunk headers (@@ -old,count +new,count @@) to extract line ranges in the new file.
    for (const line of lines) {
      // Hunk header format: @@ -oldStart,oldCount +newStart,newCount @@
      const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
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

/**
 * Checks whether a line falls within any of the changed ranges for a file.
 *
 * @param line - Line number to check (1-indexed).
 * @param ranges - Array of changed line ranges for the file.
 * @returns True if the line is within a changed range.
 */
export function isLineInDiff(line: number, ranges: LineRange[]): boolean {
  return ranges.some((range) => line >= range.start && line <= range.end);
}
