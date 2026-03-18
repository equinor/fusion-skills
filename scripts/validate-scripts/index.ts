import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import process from "node:process";
import { collectIntentCommentIssues } from "./collect-intent-comment-issues";
import { collectIntentCommentIssuesForFiles } from "./collect-intent-comment-issues-for-files";
import { collectTSDocCoverageIssues } from "./collect-tsdoc-coverage-issues";
import { collectTSDocCoverageIssuesForFiles } from "./collect-tsdoc-coverage-issues-for-files";
import { computeDiffLineMap, isLineInDiff } from "./compute-diff-lines";
import { formatCoverageIssues } from "./format-coverage-issues";
import { FIX_HINTS, formatIntentCommentIssues } from "./format-intent-comment-issues";
import type { IntentCommentIssue } from "./types";

/**
 * Parsed CLI options for the validate-scripts command.
 */
interface ValidateScriptsOptions {
  onlyDiff: boolean;
  baseRef: string;
  jsonOutput: string | null;
}

/**
 * Diff-only file resolution result.
 */
interface DiffScriptSourceFilesResult {
  files: string[];
  resolvedBaseRef: string;
}

/**
 * Parses CLI arguments for validate-scripts.
 *
 * @param argv - Raw CLI arguments after the script name.
 * @returns Parsed command options.
 */
function parseArgs(argv: string[]): ValidateScriptsOptions {
  const options: ValidateScriptsOptions = {
    onlyDiff: false,
    baseRef: process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main",
    jsonOutput: null,
  };
  const state = { skipNext: false };

  // Walk arguments in order so flag/value pairs can be consumed deterministically.
  for (const [index, arg] of argv.entries()) {
    // Skip the value token immediately following --base-ref.
    if (state.skipNext) {
      state.skipNext = false;
      continue;
    }

    // Enable diff-only mode so CI can validate only files touched by the PR.
    if (arg === "--only-diff") {
      options.onlyDiff = true;
      continue;
    }

    // Allow callers to override base ref for git diff resolution.
    if (arg === "--base-ref") {
      const value = argv[index + 1]?.trim();
      // Fail fast when a flag expects a value but none is provided.
      if (!value) {
        throw new Error("Missing value for --base-ref");
      }
      options.baseRef = value;
      state.skipNext = true;
      continue;
    }

    // Write structured diagnostics to a JSON file for CI review comment integration.
    if (arg === "--json-output") {
      const value = argv[index + 1]?.trim();
      // Fail fast when a flag expects a value but none is provided.
      if (!value) {
        throw new Error("Missing value for --json-output");
      }
      options.jsonOutput = value;
      state.skipNext = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

/**
 * Reads changed file paths from git diff, with fallback when base ref is unavailable.
 *
 * @param repoRoot - Absolute repository root path.
 * @param baseRef - Preferred git base ref to compare against.
 * @returns Raw newline-delimited git diff output.
 */
function readDiffOutput(
  repoRoot: string,
  baseRef: string,
): { output: string; resolvedBaseRef: string } {
  const readDiff = (diffBase: string): string =>
    execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", `${diffBase}...HEAD`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

  try {
    return { output: readDiff(baseRef), resolvedBaseRef: baseRef };
  } catch {
    // Some CI checkouts do not fetch origin/<base>; compare against parent commit instead.
    try {
      return { output: readDiff("HEAD^"), resolvedBaseRef: "HEAD^" };
    } catch {
      // In depth-1 checkouts without base refs, fail loudly so CI does not skip validation.
      throw new Error(
        `Unable to resolve git diff base from ${baseRef} or HEAD^. Ensure checkout fetch depth includes base history.`,
      );
    }
  }
}

/**
 * Resolves changed script source files by git diff against a base ref.
 *
 * @param repoRoot - Absolute repository root path.
 * @param baseRef - Git base ref to compare against.
 * @returns Sorted absolute paths for changed script source files.
 */
function listDiffScriptSourceFiles(repoRoot: string, baseRef: string): DiffScriptSourceFilesResult {
  const { output, resolvedBaseRef } = readDiffOutput(repoRoot, baseRef);

  // Split command output into one path candidate per line.
  const diffLines = output.split("\n");
  // Normalize each line for robust downstream filtering.
  const trimmedLines = diffLines.map((line) => line.trim());
  // Drop blank lines emitted by trailing newlines in command output.
  const nonEmptyLines = trimmedLines.filter(Boolean);
  // Keep only TypeScript files under scripts/ where this validator applies.
  const scriptSourcePaths = nonEmptyLines.filter(
    (path) => path.startsWith("scripts/") && path.endsWith(".ts"),
  );
  // Exclude tests so diff mode mirrors full-scan scope.
  const nonTestScriptPaths = scriptSourcePaths.filter((path) => !path.includes("/__tests__/"));
  // Convert repository-relative paths to absolute paths for file IO.
  const absolutePaths = nonTestScriptPaths.map((path) => join(repoRoot, path));
  // Sort for deterministic check output in local and CI runs.
  return { files: absolutePaths.sort(), resolvedBaseRef };
}

/**
 * Filters issues to only those reported on changed diff lines.
 *
 * @param issues - Candidate issues to include in JSON diagnostics.
 * @param repoRoot - Absolute repository root for relative path display.
 * @param diffLineMap - Map of file paths to changed line ranges.
 * @returns Issues that map to changed lines in the current diff.
 */
function filterIssuesToDiffLines(
  issues: IntentCommentIssue[],
  repoRoot: string,
  diffLineMap: Record<string, Array<{ start: number; end: number }>>,
): IntentCommentIssue[] {
  // Iterate each issue so PR review comments only target changed diff hunks.
  return issues.filter((issue) => {
    // This regex normalizes Windows path separators to POSIX for diff-map key lookup.
    const relPath = relative(repoRoot, issue.filePath).replace(/\\/g, "/");
    const ranges = diffLineMap[relPath];
    return ranges ? isLineInDiff(issue.line, ranges) : false;
  });
}

/**
 * Writes structured diagnostics to a JSON file for CI review comment integration.
 *
 * @param outputPath - File path to write, or `null` to skip.
 * @param issues - Intent-comment issues to serialize.
 * @param repoRoot - Absolute repository root for relative path display.
 * @param diffLineMap - Map of file paths to changed line ranges (used to filter for diff-only context).
 */
function writeDiagnosticsJson(
  outputPath: string | null,
  issues: IntentCommentIssue[],
  repoRoot: string,
  diffLineMap?: Record<string, Array<{ start: number; end: number }>>,
): void {
  // Skip when no output path was requested (local development runs).
  if (!outputPath) {
    return;
  }

  // Filter issues to only those on lines that exist in the diff (when in diff-only mode).
  const filteredIssues = diffLineMap
    ? filterIssuesToDiffLines(issues, repoRoot, diffLineMap)
    : issues;

  // Transform each issue into a JSON-serializable diagnostic object.
  const diagnostics = filteredIssues.map((issue) => ({
    // This regex normalizes path separators for cross-platform JSON output.
    path: relative(repoRoot, issue.filePath).replace(/\\/g, "/"),
    line: issue.line,
    code: issue.code,
    message: `${issue.code}: ${issue.statement}\nFix: ${FIX_HINTS[issue.code]}`,
  }));
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(diagnostics, null, 2), "utf8");
}

/**
 * CLI entrypoint for validating script quality checks.
 *
 * @returns Nothing.
 */
function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  const scriptsRoot = join(repoRoot, "scripts");
  const diffResult = options.onlyDiff
    ? listDiffScriptSourceFiles(repoRoot, options.baseRef)
    : { files: [], resolvedBaseRef: options.baseRef };
  const diffLineMap = options.onlyDiff
    ? computeDiffLineMap(repoRoot, diffResult.resolvedBaseRef)
    : undefined;
  const diffFiles = diffResult.files;
  const tsdocIssues = options.onlyDiff
    ? collectTSDocCoverageIssuesForFiles(diffFiles)
    : collectTSDocCoverageIssues(scriptsRoot);
  const intentIssues = options.onlyDiff
    ? collectIntentCommentIssuesForFiles(diffFiles)
    : collectIntentCommentIssues(scriptsRoot);
  // Keep disallowed-pattern violations separate from general intent-comment findings.
  const disallowedIssueCodes = new Set([
    "disallowed-while-loop",
    "disallowed-let-declaration",
    "disallowed-multiple-exported-functions",
  ]);
  // Keep only issues that represent explicitly banned syntax patterns.
  const disallowedIssues = intentIssues.filter((issue) => disallowedIssueCodes.has(issue.code));
  // Separate regex-explanation issues from general intent-comment issues for distinct headings.
  const regexExplanationIssues = intentIssues.filter(
    (issue) => issue.code === "missing-regex-explanation",
  );
  // Keep intent-check findings focused on control-flow comment coverage only.
  const intentCommentIssues = intentIssues.filter(
    (issue) => issue.code === "missing-intent-comment",
  );

  // In diff mode, print scope details so CI output explains what was checked.
  if (options.onlyDiff) {
    console.log(`Running diff-only script quality checks against ${diffResult.resolvedBaseRef}`);
    // Explicitly note empty diffs so a pass is clearly intentional.
    if (diffFiles.length === 0) {
      console.log("No changed script source files found in diff.");
    }
  }

  // Exit early on success to keep failure output reserved for actionable issues.
  if (
    tsdocIssues.length === 0 &&
    intentCommentIssues.length === 0 &&
    regexExplanationIssues.length === 0 &&
    disallowedIssues.length === 0
  ) {
    // Write empty diagnostics so CI can post a clean review and resolve stale comments.
    writeDiagnosticsJson(options.jsonOutput, [], repoRoot, diffLineMap);
    console.log("TSDoc, intent-comment, and disallowed-pattern checks passed for scripts/**.");
    return;
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (tsdocIssues.length > 0) {
    console.error("ERROR: TSDoc coverage check failed for scripts/**.");
    // Emit one line per issue so CI annotations are easy to scan and copy.
    for (const line of formatCoverageIssues(tsdocIssues, repoRoot)) {
      console.error(`- ${line}`);
    }
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (intentCommentIssues.length > 0) {
    console.error("ERROR: Intent-comment check failed for scripts/**.");
    // Emit one line per issue so missing control-flow intent comments are actionable.
    for (const line of formatIntentCommentIssues(intentCommentIssues, repoRoot)) {
      console.error(`- ${line}`);
    }
  }

  // Report regex-explanation issues under a distinct heading.
  if (regexExplanationIssues.length > 0) {
    console.error("ERROR: Regex-explanation check failed for scripts/**.");
    // Emit one line per issue so missing regex explanation comments are actionable.
    for (const line of formatIntentCommentIssues(regexExplanationIssues, repoRoot)) {
      console.error(`- ${line}`);
    }
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (disallowedIssues.length > 0) {
    console.error("ERROR: Disallowed-pattern check failed for scripts/**.");
    // Emit one line per issue so banned syntax usage is easy to locate.
    for (const line of formatIntentCommentIssues(disallowedIssues, repoRoot)) {
      console.error(`- ${line}`);
    }
  }

  // Write all diagnostics to JSON so CI can post inline PR review comments.
  const allIntentIssues = [...intentCommentIssues, ...regexExplanationIssues, ...disallowedIssues];
  writeDiagnosticsJson(options.jsonOutput, allIntentIssues, repoRoot, diffLineMap);

  throw new Error(
    `Script quality checks failed (tsdoc=${tsdocIssues.length}, intent=${intentCommentIssues.length}, regex=${regexExplanationIssues.length}, disallowed=${disallowedIssues.length}).`,
  );
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
