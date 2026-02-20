import { execSync } from "node:child_process";
import { join } from "node:path";
import process from "node:process";
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

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--only-diff") {
      options.onlyDiff = true;
      continue;
    }

    if (arg === "--base-ref") {
      const value = argv[index + 1]?.trim();
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

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((path) => path.startsWith("scripts/") && path.endsWith(".ts"))
    .filter((path) => !path.includes("/__tests__/"))
    .map((path) => join(repoRoot, path))
    .sort();
}

/**
 * CLI entrypoint for validating function-level TSDoc coverage in scripts.
 *
 * @returns Nothing.
 */
function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  const scriptsRoot = join(repoRoot, "scripts");
  const diffFiles = options.onlyDiff ? listDiffScriptSourceFiles(repoRoot, options.baseRef) : [];
  const issues = options.onlyDiff
    ? collectTSDocCoverageIssuesForFiles(diffFiles)
    : collectTSDocCoverageIssues(scriptsRoot);

  if (options.onlyDiff) {
    console.log(`Running diff-only TSDoc coverage check against ${options.baseRef}`);
    if (diffFiles.length === 0) {
      console.log("No changed script source files found in diff.");
    }
  }

  if (issues.length === 0) {
    console.log("TSDoc coverage check passed for scripts/**.");
    return;
  }

  console.error("ERROR: TSDoc coverage check failed for scripts/**.");
  for (const line of formatCoverageIssues(issues, repoRoot)) {
    console.error(`- ${line}`);
  }
  throw new Error(`Missing TSDoc coverage in ${issues.length} function declaration(s).`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
