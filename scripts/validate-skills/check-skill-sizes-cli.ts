import process from "node:process";
import { checkSkillSizes } from "./check-skill-sizes";

/**
 * CLI entrypoint for validating SKILL.md file sizes.
 */
function main(): void {
  const repoRoot = process.cwd();
  const findings = checkSkillSizes(repoRoot);

  // Report each finding with severity-appropriate prefix.
  for (const finding of findings) {
    const prefix = finding.level === "error" ? "ERROR" : "WARNING";
    console.error(
      `${prefix}: ${finding.skillPath} has ${finding.lineCount} lines (${finding.level === "error" ? "max 500" : "recommended max 300"}).`,
    );
  }

  // Separate errors from warnings for summary and exit code decision.
  const errors = findings.filter((f) => f.level === "error");
  // Count warnings separately for the summary line.
  const warnings = findings.filter((f) => f.level === "warning");

  // Summarize findings for quick CI scan.
  if (findings.length === 0) {
    console.log("All SKILL.md files are within size limits.");
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
