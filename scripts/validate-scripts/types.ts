/**
 * Describes one TSDoc coverage issue found in a function declaration.
 */
export interface TSDocCoverageIssue {
  filePath: string;
  line: number;
  functionName: string;
  missing: string[];
}

/**
 * Describes one missing intent-comment issue for control-flow/iterator checks.
 */
export interface IntentCommentIssue {
  filePath: string;
  line: number;
  statement: string;
}
