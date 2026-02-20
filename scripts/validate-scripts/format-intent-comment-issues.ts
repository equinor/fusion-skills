import { relative } from "node:path";
import type { IntentCommentIssue } from "./types";

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
    // This regex matches the expected text format for this step.
    const relativePath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    return `${relativePath}:${issue.line}:${issue.code}:${issue.statement}`;
  });
}
