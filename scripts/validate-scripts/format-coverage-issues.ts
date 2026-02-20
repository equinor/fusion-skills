import { relative } from "node:path";
import type { TSDocCoverageIssue } from "./types";

/**
 * Formats TSDoc coverage issues for terminal output.
 *
 * @param issues - Coverage issues to render.
 * @param repoRoot - Absolute repository root for relative path display.
 * @returns Human-readable output lines.
 */
export function formatCoverageIssues(issues: TSDocCoverageIssue[], repoRoot: string): string[] {
  return issues.map((issue) => {
    const relativePath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    return `${relativePath}:${issue.line}:${issue.functionName}:${issue.missing.join(",")}`;
  });
}
