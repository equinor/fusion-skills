import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { checkSkillSizes, ERROR_THRESHOLD, WARN_THRESHOLD } from "./check-skill-sizes";

/**
 * Parsed CLI options for the skill-sizes command.
 */
interface SkillSizesOptions {
  onlyDiff: boolean;
  baseRef: string;
}

/**
 * Parses CLI arguments for skill-sizes.
 *
 * @param argv - Raw CLI arguments after the script name.
 * @returns Parsed command options.
 */
function parseArgs(argv: string[]): SkillSizesOptions {
  const options: SkillSizesOptions = {
    onlyDiff: false,
    baseRef: process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main",
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

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

/**
 * Resolves changed SKILL.md files by git diff against a base ref.
 *
 * @param repoRoot - Absolute repository root path.
 * @param baseRef - Git base ref to compare against.
 * @returns Absolute paths for changed SKILL.md files.
 */
function listDiffSkillFiles(repoRoot: string, baseRef: string): string[] {
  const readDiff = (diffBase: string): string =>
    execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", `${diffBase}...HEAD`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

  const output = (() => {
    try {
      return readDiff(baseRef);
    } catch {
      // Fall back to parent commit in shallow checkouts.
      try {
        return readDiff("HEAD^");
      } catch {
        throw new Error(
          `Unable to resolve git diff base from ${baseRef} or HEAD^. Ensure checkout fetch depth includes base history.`,
        );
      }
    }
  })();

  return (
    output
      .split("\n")
      // Normalize each line for robust downstream filtering.
      .map((line) => line.trim())
      // Drop blank lines emitted by trailing newlines in command output.
      .filter(Boolean)
      // Keep only SKILL.md files under skills/.
      .filter((path) => path.startsWith("skills/") && path.endsWith("/SKILL.md"))
      // Convert repository-relative paths to absolute paths for file IO.
      .map((path) => join(repoRoot, path))
      // Keep only files that still exist on disk (handles renames/deletes).
      .filter((absPath) => existsSync(absPath))
  );
}

/**
 * CLI entrypoint for validating SKILL.md file sizes.
 */
function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();

  const diffFiles = options.onlyDiff ? listDiffSkillFiles(repoRoot, options.baseRef) : undefined;

  // In diff mode, print scope details so CI output explains what was checked.
  if (options.onlyDiff) {
    console.log(`Running diff-only SKILL.md size check against ${options.baseRef}`);
    // Explicitly note empty diffs so a pass is clearly intentional.
    if (diffFiles && diffFiles.length === 0) {
      console.log("No changed SKILL.md files found in diff.");
      console.log("All changed SKILL.md files are within size limits.");
      return;
    }
  }

  const findings = checkSkillSizes(repoRoot, diffFiles);

  // Report each finding with severity-appropriate prefix.
  for (const finding of findings) {
    const prefix = finding.level === "error" ? "ERROR" : "WARNING";
    const threshold = finding.level === "error" ? ERROR_THRESHOLD : WARN_THRESHOLD;
    const label = finding.level === "error" ? "max" : "recommended max";
    console.error(
      `${prefix}: ${finding.skillPath} has ${finding.lineCount} lines (${label} ${threshold}).`,
    );
  }

  // Separate errors from warnings for summary and exit code decision.
  const errors = findings.filter((f) => f.level === "error");
  // Count warnings separately for the summary line.
  const warnings = findings.filter((f) => f.level === "warning");

  // Summarize findings for quick CI scan.
  if (findings.length === 0) {
    console.log("All changed SKILL.md files are within size limits.");
    return;
  }

  console.log(`\nSKILL.md size check: ${errors.length} error(s), ${warnings.length} warning(s).`);

  // Only fail on errors — warnings are advisory.
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Keep CLI execution scoped to direct invocation to avoid side effects in imports.
if (import.meta.main) {
  main();
}
