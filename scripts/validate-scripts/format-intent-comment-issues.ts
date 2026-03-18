import { relative } from "node:path";
import type { IntentCommentIssue } from "./types";

/**
 * Maps each issue code to an actionable fix hint appended to diagnostics.
 */
export const FIX_HINTS: Record<IntentCommentIssue["code"], string> = {
  "missing-intent-comment":
    "Add a // comment on the line above explaining why this control-flow or iterator exists.",
  "missing-regex-explanation":
    'Add a // comment containing the word "regex" on the line above to explain what the pattern matches.',
  "disallowed-while-loop":
    "Replace this while/do-while loop with a functional alternative (map, filter, reduce, for...of).",
  "disallowed-let-declaration":
    "Replace this let declaration with const. Use functional transforms instead of mutation.",
  "disallowed-multiple-exported-functions":
    "Split this file so each module exports at most one function.",
};

/**
 * Formats intent-comment issues for terminal diagnostics.
 *
 * @param issues - Intent-comment issues to render.
 * @param repoRoot - Absolute repository root for relative path display.
 * @returns Human-readable diagnostic lines with actionable fix hints.
 */
export function formatIntentCommentIssues(
  issues: IntentCommentIssue[],
  repoRoot: string,
): string[] {
  // Convert each value into the shape expected by downstream code.
  return issues.map((issue) => {
    // This regex normalizes path separators for cross-platform output formatting.
    const relativePath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    const hint = FIX_HINTS[issue.code];
    return `${relativePath}:${issue.line}:${issue.code}:${issue.statement}\n  Fix: ${hint}`;
  });
}
