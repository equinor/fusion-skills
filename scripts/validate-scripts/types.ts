/**
 * Describes one TSDoc coverage issue found in a function declaration.
 */
export interface TSDocCoverageIssue {
  filePath: string;
  line: number;
  functionName: string;
  missing: string[];
}
