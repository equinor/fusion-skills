import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { findSkillFiles } from "../list-skills/find-skill-files";

/**
 * Line-count thresholds for SKILL.md size validation.
 */
export const WARN_THRESHOLD = 300;
export const ERROR_THRESHOLD = 500;

/**
 * Describes one SKILL.md line-count finding.
 */
export interface SkillSizeFinding {
  skillPath: string;
  lineCount: number;
  level: "warning" | "error";
}

/**
 * Counts logical lines in file content.
 *
 * - Supports Unix (`\n`) and Windows (`\r\n`) line endings.
 * - Ignores a trailing empty segment caused by a final newline at EOF.
 *
 * @param content - Raw UTF-8 file content.
 * @returns Logical line count used for threshold checks.
 */
function getNormalizedLineCount(content: string): number {
  // Return early so empty files are counted as zero logical lines.
  if (content.length === 0) {
    return 0;
  }

  // This regex splits content on either LF or CRLF line endings.
  const lines = content.split(/\r?\n/);

  // Drop one trailing empty segment when the file ends with a newline.
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.length;
}

/**
 * Checks SKILL.md files for excessive line counts.
 *
 * @param repoRoot - Absolute repository root path.
 * @param filePaths - Optional list of absolute SKILL.md paths to check. When omitted, discovers all SKILL.md files.
 * @returns Findings sorted by severity (errors first) then path.
 */
export function checkSkillSizes(repoRoot: string, filePaths?: string[]): SkillSizeFinding[] {
  const skillFiles = filePaths ?? findSkillFiles(join(repoRoot, "skills"));
  const findings: SkillSizeFinding[] = [];

  // Check each SKILL.md file against size thresholds.
  for (const filePath of skillFiles) {
    const content = readFileSync(filePath, "utf8");
    const lineCount = getNormalizedLineCount(content);
    const skillPath = relative(repoRoot, filePath);

    // Report errors for files exceeding the hard limit.
    if (lineCount >= ERROR_THRESHOLD) {
      findings.push({ skillPath, lineCount, level: "error" });
      // Report warnings for files approaching the hard limit.
    } else if (lineCount >= WARN_THRESHOLD) {
      findings.push({ skillPath, lineCount, level: "warning" });
    }
  }

  // Sort errors before warnings, then alphabetically within each level.
  return findings.sort((a, b) => {
    // Prioritize errors over warnings in output ordering.
    if (a.level !== b.level) {
      return a.level === "error" ? -1 : 1;
    }
    return a.skillPath.localeCompare(b.skillPath);
  });
}
