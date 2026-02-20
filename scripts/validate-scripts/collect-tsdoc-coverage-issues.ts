import { collectTSDocCoverageIssuesForFiles } from "./collect-tsdoc-coverage-issues-for-files";
import { listScriptSourceFiles } from "./list-script-source-files";
import type { TSDocCoverageIssue } from "./types";

/**
 * Collects TSDoc coverage issues across script source files.
 *
 * @param scriptsRoot - Absolute path to the repository scripts directory.
 * @returns All discovered TSDoc coverage issues.
 */
export function collectTSDocCoverageIssues(scriptsRoot: string): TSDocCoverageIssue[] {
  const files = listScriptSourceFiles(scriptsRoot);
  return collectTSDocCoverageIssuesForFiles(files);
}
