import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { listScriptSourceFiles } from "./list-script-source-files";
import type { IntentCommentIssue } from "./types";

const INTENT_TARGET_REGEX =
  /\bif\s*\(|\bfor\s*\(|\bwhile\s*\(|\.map\(|\.filter\(|\.reduce\(|\.forEach\(|ts\.forEachChild\(/;

/**
 * Returns whether a line is considered an intent comment line.
 *
 * @param line - Trimmed source line.
 * @returns `true` when the line is a comment marker accepted by this checker.
 */
function isIntentCommentLine(line: string): boolean {
  return line.startsWith("//") || line.startsWith("/*") || line.startsWith("*");
}

/**
 * Collects missing intent-comment issues in one source file.
 *
 * @param sourceText - TypeScript source text.
 * @param filePath - Absolute source file path.
 * @returns Missing intent-comment issues found in this file.
 */
export function collectFileIntentCommentIssues(
  sourceText: string,
  filePath: string,
): IntentCommentIssue[] {
  const lines = sourceText.split("\n");
  const issues: IntentCommentIssue[] = [];

  // Iterate every source line and enforce that control-flow/iterator lines have intent comments.
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    // Fail fast here so the remaining logic can assume valid input.
    if (!INTENT_TARGET_REGEX.test(line)) {
      continue;
    }

    // Find the nearest non-empty line above the target statement.
    let previousIndex = index - 1;
    // Process entries in order so behavior stays predictable.
    while (previousIndex >= 0 && lines[previousIndex].trim() === "") {
      previousIndex -= 1;
    }

    const previousLine = previousIndex >= 0 ? lines[previousIndex].trim() : "";
    // Require intent comments immediately above (ignoring blank lines) each targeted statement.
    if (!isIntentCommentLine(previousLine)) {
      issues.push({
        filePath,
        line: index + 1,
        statement: line.trim(),
      });
    }
  }

  return issues;
}

/**
 * Collects missing intent-comment issues for a provided set of files.
 *
 * @param filePaths - Absolute TypeScript source file paths to validate.
 * @returns Missing intent-comment issues in the provided files.
 */
export function collectIntentCommentIssuesForFiles(filePaths: string[]): IntentCommentIssue[] {
  const issues: IntentCommentIssue[] = [];

  // Aggregate file-level issues into one CI-friendly result set.
  for (const filePath of filePaths) {
    const sourceText = readFileSync(filePath, "utf8");
    issues.push(...collectFileIntentCommentIssues(sourceText, filePath));
  }

  return issues;
}

/**
 * Collects missing intent-comment issues across all script source files.
 *
 * @param scriptsRoot - Absolute path to repository scripts directory.
 * @returns Missing intent-comment issues found across scripts.
 */
export function collectIntentCommentIssues(scriptsRoot: string): IntentCommentIssue[] {
  const files = listScriptSourceFiles(scriptsRoot);
  return collectIntentCommentIssuesForFiles(files);
}

/**
 * Formats intent-comment issues for terminal diagnostics.
 *
 * @param issues - Intent-comment issues to render.
 * @param repoRoot - Absolute repository root for relative path display.
 * @returns Human-readable diagnostic lines.
 */
export function formatIntentCommentIssues(
  issues: IntentCommentIssue[],
  repoRoot: string,
): string[] {
  // Convert each value into the shape expected by downstream code.
  return issues.map((issue) => {
    const relativePath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    return `${relativePath}:${issue.line}:missing-intent-comment:${issue.statement}`;
  });
}
