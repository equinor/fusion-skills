import ts from "typescript";
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

  // Gather top-level function names so we can resolve which exports point to functions.
  const topLevelFunctionNames = new Set(
    sourceFile.statements
      // Keep only function declarations from top-level statements.
      .filter((statement): statement is ts.FunctionDeclaration =>
        ts.isFunctionDeclaration(statement),
      )
      // Convert function declarations into optional function names.
      .map((statement) => statement.name?.text)
      // Keep only concrete function names.
      .filter((name): name is string => Boolean(name)),
  );
  const exportedFunctionNames = new Set<string>();

  // Resolve exported functions from declarations, export clauses, and default exports.
  for (const statement of sourceFile.statements) {
    // Collect names from direct `export function ...` declarations.
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      (ts.getCombinedModifierFlags(statement) & ts.ModifierFlags.Export) !== 0
    ) {
      exportedFunctionNames.add(statement.name.text);
      continue;
    }

    // Resolve named export lists like `export { foo, bar }`.
    if (ts.isExportDeclaration(statement) && statement.exportClause) {
      // Ignore re-exports (`export { foo } from "..."`) because they are not local bindings.
      if (statement.moduleSpecifier) {
        continue;
      }
      // Inspect named exports and keep only those mapping to local function declarations.
      if (ts.isNamedExports(statement.exportClause)) {
        // Process entries in order so behavior stays predictable.
        for (const element of statement.exportClause.elements) {
          const localName = element.propertyName?.text ?? element.name.text;
          // Include only symbols that point to local function declarations.
          if (topLevelFunctionNames.has(localName)) {
            exportedFunctionNames.add(element.name.text);
          }
        }
      }
      continue;
    }

    // Resolve default export assignments that point to local function names.
    if (ts.isExportAssignment(statement) && ts.isIdentifier(statement.expression)) {
      // Include `export default fnName` when `fnName` is a local function declaration.
      if (topLevelFunctionNames.has(statement.expression.text)) {
        exportedFunctionNames.add(statement.expression.text);
      }
    }
  }

  // Report files exporting multiple function symbols to enforce one-function-per-file style.
  if (exportedFunctionNames.size > 1) {
    const triggerStatement = sourceFile.statements.find((statement) =>
      ts.isExportDeclaration(statement),
    );
    const triggerNode = triggerStatement ?? sourceFile;
    const { line } = sourceFile.getLineAndCharacterOfPosition(triggerNode.getStart(sourceFile));
    addIssue({
      filePath,
      line: line + 1,
      code: "disallowed-multiple-exported-functions",
      statement: `exported-functions:${exportedFunctionNames.size}`,
    });
  }

  return issues;
}
