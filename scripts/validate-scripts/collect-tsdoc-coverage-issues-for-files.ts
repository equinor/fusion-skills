import { readFileSync } from "node:fs";
import { collectFileTSDocCoverageIssues } from "./collect-file-tsdoc-coverage-issues";
import type { TSDocCoverageIssue } from "./types";

/**
 * Collects TSDoc coverage issues for a specific list of source files.
 *
 * @param filePaths - Absolute TypeScript source file paths to validate.
 * @returns All discovered TSDoc coverage issues in the provided files.
 */
export function collectTSDocCoverageIssuesForFiles(filePaths: string[]): TSDocCoverageIssue[] {
  const issues: TSDocCoverageIssue[] = [];

  // Process entries in order so behavior stays predictable.
  for (const filePath of filePaths) {
    const sourceText = readFileSync(filePath, "utf8");
    issues.push(...collectFileTSDocCoverageIssues(sourceText, filePath));
  }

  return issues;
}
