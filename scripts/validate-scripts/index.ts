import { execSync } from "node:child_process";
import { join } from "node:path";
import process from "node:process";
import {
  collectIntentCommentIssues,
  collectIntentCommentIssuesForFiles,
  formatIntentCommentIssues,
} from "./check-intent-comments";
import {
  collectTSDocCoverageIssues,
  collectTSDocCoverageIssuesForFiles,
  formatCoverageIssues,
} from "./check-tsdoc-coverage";

/**
 * Parsed CLI options for the validate-scripts command.
 */
interface ValidateScriptsOptions {
  onlyDiff: boolean;
  baseRef: string;
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
  };

  // Walk arguments in order so flag/value pairs can be consumed deterministically.
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

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
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

/**
 * Resolves changed script source files by git diff against a base ref.
 *
 * @param repoRoot - Absolute repository root path.
 * @param baseRef - Git base ref to compare against.
 * @returns Sorted absolute paths for changed script source files.
 */
function listDiffScriptSourceFiles(repoRoot: string, baseRef: string): string[] {
  const output = execSync(`git diff --name-only --diff-filter=ACMR ${baseRef}...HEAD`, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

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
  return absolutePaths.sort();
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
  const diffFiles = options.onlyDiff ? listDiffScriptSourceFiles(repoRoot, options.baseRef) : [];
  const tsdocIssues = options.onlyDiff
    ? collectTSDocCoverageIssuesForFiles(diffFiles)
    : collectTSDocCoverageIssues(scriptsRoot);
  const intentIssues = options.onlyDiff
    ? collectIntentCommentIssuesForFiles(diffFiles)
    : collectIntentCommentIssues(scriptsRoot);
  // Keep disallowed-pattern violations separate from general intent-comment findings.
  const disallowedIssues = intentIssues.filter((issue) => issue.code === "disallowed-while-loop");
  // Keep intent-check findings focused on comment and regex-explanation coverage.
  const nonDisallowedIntentIssues = intentIssues.filter(
    (issue) => issue.code !== "disallowed-while-loop",
  );

  // In diff mode, print scope details so CI output explains what was checked.
  if (options.onlyDiff) {
    console.log(`Running diff-only script quality checks against ${options.baseRef}`);
    // Explicitly note empty diffs so a pass is clearly intentional.
    if (diffFiles.length === 0) {
      console.log("No changed script source files found in diff.");
    }
  }

  // Exit early on success to keep failure output reserved for actionable issues.
  if (
    tsdocIssues.length === 0 &&
    nonDisallowedIntentIssues.length === 0 &&
    disallowedIssues.length === 0
  ) {
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
  if (nonDisallowedIntentIssues.length > 0) {
    console.error("ERROR: Intent-comment check failed for scripts/**.");
    // Emit one line per issue so missing control-flow intent comments are actionable.
    for (const line of formatIntentCommentIssues(nonDisallowedIntentIssues, repoRoot)) {
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

  throw new Error(
    `Script quality checks failed (tsdoc=${tsdocIssues.length}, intent=${nonDisallowedIntentIssues.length}, disallowed=${disallowedIssues.length}).`,
  );
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
