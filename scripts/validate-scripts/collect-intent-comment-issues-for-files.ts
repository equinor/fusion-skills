import { readFileSync } from "node:fs";
import { collectFileIntentCommentIssues } from "./check-intent-comments";
import type { IntentCommentIssue } from "./types";

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
