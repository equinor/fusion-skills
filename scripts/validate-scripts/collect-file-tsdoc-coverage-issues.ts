import ts from "typescript";
import type { TSDocCoverageIssue } from "./types";

/**
 * Reads the nearest leading JSDoc block attached to a function declaration.
 *
 * @param sourceFile - Parsed TypeScript source file.
 * @param sourceText - Raw source text.
 * @param node - Function declaration to inspect.
 * @returns JSDoc block text including delimiters, or `null` when missing.
 */
export function getLeadingJSDocBlock(
  sourceFile: ts.SourceFile,
  sourceText: string,
  node: ts.FunctionDeclaration,
): string | null {
  const commentRanges = ts.getLeadingCommentRanges(sourceText, node.getFullStart()) ?? [];
  // A function without leading comments cannot have a JSDoc block.
  if (commentRanges.length === 0) {
    return null;
  }

  const nearest = commentRanges[commentRanges.length - 1];
  const commentText = sourceText.slice(nearest.pos, nearest.end);
  // Enforce JSDoc-style block comments only, not regular line/block comments.
  if (!commentText.startsWith("/**")) {
    return null;
  }

  const between = sourceText.slice(nearest.end, node.getStart(sourceFile));
  // Reject detached comments; doc blocks must be directly attached to the function.
  if (between.trim().length > 0) {
    return null;
  }

  return commentText;
}

/**
 * Extracts documented parameter names from a JSDoc block.
 *
 * @param docBlock - JSDoc block text.
 * @returns Parameter names declared through `@param` tags.
 */
export function getDocumentedParamNames(docBlock: string): Set<string> {
  const names = new Set<string>();
  const regex = /@param\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  // Process entries in order so behavior stays predictable.
  for (const match of docBlock.matchAll(regex)) {
    const name = (match[1] ?? "").trim();
    // Guard against malformed tags so only valid parameter names are tracked.
    if (name.length > 0) {
      names.add(name);
    }
  }
  return names;
}

/**
 * Returns whether a JSDoc block includes a returns tag.
 *
 * @param docBlock - JSDoc block text.
 * @returns `true` when `@returns` or `@return` appears in the block.
 */
export function hasReturnsTag(docBlock: string): boolean {
  return /@returns?\b/.test(docBlock);
}

/**
 * Returns whether a function body contains a return with an expression.
 *
 * @param node - Function declaration to inspect.
 * @returns `true` when an expression-bearing return statement exists.
 */
export function hasValueReturn(node: ts.FunctionDeclaration): boolean {
  const body = node.body;
  // Declarations without a body cannot return runtime values.
  if (!body) {
    return false;
  }

  let found = false;
  const scan = (current: ts.Node): void => {
    // Stop traversing once a value-return has already been found.
    if (found) {
      return;
    }
    // Count only returns with an expression to avoid requiring @returns on bare returns.
    if (ts.isReturnStatement(current) && current.expression) {
      found = true;
      return;
    }
    // Visit child nodes so nested structures are checked as well.
    ts.forEachChild(current, scan);
  };

  scan(body);
  return found;
}

/**
 * Collects TSDoc coverage issues for function declarations in one source file.
 *
 * @param sourceText - TypeScript source text.
 * @param filePath - Absolute source file path.
 * @returns TSDoc coverage issues found in the source.
 */
export function collectFileTSDocCoverageIssues(
  sourceText: string,
  filePath: string,
): TSDocCoverageIssue[] {
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
  const issues: TSDocCoverageIssue[] = [];

  const visit = (node: ts.Node): void => {
    // Restrict checks to function declarations; other node types are traversed recursively.
    if (!ts.isFunctionDeclaration(node)) {
      // Visit child nodes so nested structures are checked as well.
      ts.forEachChild(node, visit);
      return;
    }

    const missing: string[] = [];
    const docBlock = getLeadingJSDocBlock(sourceFile, sourceText, node);
    const hasDoc = Boolean(docBlock);

    // Every function declaration must carry a JSDoc block.
    if (!hasDoc) {
      missing.push("doc");
    }

    const taggedParamNames = hasDoc && docBlock ? getDocumentedParamNames(docBlock) : new Set();

    // Process entries in order so behavior stays predictable.
    for (const parameter of node.parameters) {
      // Skip non-identifier patterns until explicit policy for destructured params is needed.
      if (!ts.isIdentifier(parameter.name)) {
        continue;
      }

      const paramName = parameter.name.text;
      // Require explicit @param coverage for every named function parameter.
      if (hasDoc && !taggedParamNames.has(paramName)) {
        missing.push(`param:${paramName}`);
      }
    }

    // Require @returns only when the function actually returns a value.
    if (hasDoc && docBlock && hasValueReturn(node) && !hasReturnsTag(docBlock)) {
      missing.push("returns");
    }

    // Emit a single issue entry per function with all missing documentation items.
    if (missing.length > 0) {
      const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      issues.push({
        filePath,
        line: position.line + 1,
        functionName: node.name?.text ?? "<anonymous>",
        missing,
      });
    }

    // Visit child nodes so nested structures are checked as well.
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return issues;
}
