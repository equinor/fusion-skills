import { collectIntentCommentIssuesForFiles } from "./collect-intent-comment-issues-for-files";
import { listScriptSourceFiles } from "./list-script-source-files";
import type { IntentCommentIssue } from "./types";

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
