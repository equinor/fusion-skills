import { readFileSync } from "node:fs";
import { relative } from "node:path";
import ts from "typescript";
import { listScriptSourceFiles } from "./list-script-source-files";
import type { IntentCommentIssue } from "./types";

const INTENT_TARGET_REGEX =
  // This regex matches the expected text format for this step.
  /\bif\s*\(|\bfor\s*\(|\.map\(|\.filter\(|\.reduce\(|\.forEach\(|ts\.forEachChild\(/;

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
 * Returns whether a comment line explicitly explains a regex.
 *
 * @param line - Trimmed source line.
 * @returns `true` when the line looks like a regex explanation comment.
 */
function isRegexExplanationCommentLine(line: string): boolean {
  // This regex checks whether a comment line mentions regex intent explicitly.
  return /^\/\//.test(line) && /regex/i.test(line);
}

/**
 * Finds the nearest previous non-empty line index.
 *
 * @param lines - Full source lines.
 * @param startIndex - Index to start scanning upward from.
 * @returns Index of the nearest non-empty line, or `-1` when none exists.
 */
function findPreviousNonEmptyLineIndex(lines: string[], startIndex: number): number {
  // Scan upward to find the first line with actual content.
  const reversedSlice = lines.slice(0, startIndex + 1).reverse();
  const offset = reversedSlice.findIndex((line) => line.trim() !== "");
  return offset < 0 ? -1 : startIndex - offset;
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
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
  const lines = sourceText.split("\n");
  const issues: IntentCommentIssue[] = [];
  const seen = new Set<string>();

  const addIssue = (issue: IntentCommentIssue): void => {
    const key = `${issue.code}:${issue.line}:${issue.statement}`;
    // Skip duplicates so each violation is reported once.
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    issues.push(issue);
  };

  // Iterate every source line and enforce that control-flow/iterator lines have intent comments.
  for (const [index, line] of lines.entries()) {
    // Fail fast here so the remaining logic can assume valid input.
    if (!INTENT_TARGET_REGEX.test(line)) {
      continue;
    }

    // Find the nearest non-empty line above the target statement.
    const previousIndex = findPreviousNonEmptyLineIndex(lines, index - 1);

    const previousLine = previousIndex >= 0 ? lines[previousIndex].trim() : "";
    // Require intent comments immediately above (ignoring blank lines) each targeted statement.
    if (!isIntentCommentLine(previousLine)) {
      addIssue({
        filePath,
        line: index + 1,
        code: "missing-intent-comment",
        statement: line.trim(),
      });
    }
  }

  const visit = (node: ts.Node): void => {
    // Detect while/do-while loops and report them as disallowed patterns.
    if (ts.isWhileStatement(node) || ts.isDoStatement(node)) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      addIssue({
        filePath,
        line: line + 1,
        code: "disallowed-while-loop",
        statement: lines[line]?.trim() ?? "while loop",
      });
    }

    // Detect let declarations and report them as disallowed mutation style.
    if (ts.isVariableDeclarationList(node) && (node.flags & ts.NodeFlags.Let) !== 0) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      addIssue({
        filePath,
        line: line + 1,
        code: "disallowed-let-declaration",
        statement: lines[line]?.trim() ?? "let declaration",
      });
    }

    // Detect regex literals and require a nearby explanation comment.
    if (node.kind === ts.SyntaxKind.RegularExpressionLiteral) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      const previousIndex = findPreviousNonEmptyLineIndex(lines, line - 1);
      const previousLine = previousIndex >= 0 ? lines[previousIndex].trim() : "";

      // Report regex literals that are not introduced by a regex-specific comment.
      if (!isRegexExplanationCommentLine(previousLine)) {
        addIssue({
          filePath,
          line: line + 1,
          code: "missing-regex-explanation",
          statement: lines[line]?.trim() ?? "regex literal",
        });
      }
    }

    // Traverse child nodes so nested loops and regex literals are also validated.
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

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
    // This regex matches the expected text format for this step.
    const relativePath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    return `${relativePath}:${issue.line}:${issue.code}:${issue.statement}`;
  });
}
