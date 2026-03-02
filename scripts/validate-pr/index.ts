import process from "node:process";
import { collectChangedSkillContext } from "./collect-context";
import { runGitArgs } from "./git-helpers";
import { tryRunGitArgs } from "./try-run-git";
import { validateChangesetCoverage } from "./validate-changeset-coverage";
import { validateNoManualVersionEdits } from "./validate-no-manual-version-edits";

/**
 * CLI entrypoint for PR validation:
 * - changeset coverage for changed skills
 * - no manual metadata.version edits in non-release PRs
 *
 * @returns Nothing.
 */
function main(): void {
  const baseRef = process.env.GITHUB_BASE_REF?.trim();
  // Fail fast here so the remaining logic can assume valid input.
  if (!baseRef) {
    console.log("No GITHUB_BASE_REF detected. Skipping PR version/changeset checks.");
    return;
  }

  const baseRemoteRef = `origin/${baseRef}`;
  console.log(`Comparing PR changes against ${baseRemoteRef}`);

  tryRunGitArgs(["fetch", "--no-tags", "origin", baseRef]);

  const changedFiles = runGitArgs([
    "diff",
    "--name-only",
    "--diff-filter=ACMRD",
    `${baseRemoteRef}...HEAD`,
  ])
    .split("\n")
    // Convert each value into the shape expected by downstream code.
    .map((line) => line.trim())
    // Keep only items that meet the rules for this step.
    .filter(Boolean);

  // Fail fast here so the remaining logic can assume valid input.
  if (changedFiles.length === 0) {
    console.log("No changed files found in PR diff.");
    return;
  }

  const {
    changedSkillDirs,
    changedSkillIds,
    changedChangesetFiles,
    packageJsonTouched,
    rootChangelogTouched,
  } = collectChangedSkillContext(changedFiles);

  // Keep only items that meet the rules for this step.
  const activeChangesetFiles = changedChangesetFiles.filter((file) =>
    Boolean(tryRunGitArgs(["show", `HEAD:${file}`])),
  );

  const releasePrDetected =
    activeChangesetFiles.length === 0 && packageJsonTouched && rootChangelogTouched;

  // Fail fast here so the remaining logic can assume valid input.
  if (changedSkillDirs.size === 0) {
    console.log("No changed skill directories detected.");
    return;
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (activeChangesetFiles.length === 0 && !releasePrDetected) {
    console.error(
      "ERROR: One or more skills changed, but no .changeset/*.md file was updated in this PR.",
    );
    console.error("Changed skill directories:");
    // Process entries in order so behavior stays predictable.
    for (const dir of changedSkillDirs) {
      console.error(`- ${dir}`);
    }
    console.error(
      '\nAdd a changeset file, for example:\n---\n"fusion-skill-authoring": minor\n---',
    );
    throw new Error("Missing required changeset files.");
  }

  // Maintainer note: release PRs remove processed changesets and include package/changelog updates.
  if (!releasePrDetected) {
    validateChangesetCoverage(changedSkillIds, activeChangesetFiles);
  } else {
    console.log(
      "Detected release PR (package.json + CHANGELOG.md changed with no .changeset files); skipping changeset coverage checks.",
    );
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (!releasePrDetected) {
    console.log("Validating metadata.version is unchanged for existing changed skills...");
    validateNoManualVersionEdits(changedSkillDirs, baseRemoteRef);
  } else {
    console.log("Detected release PR; skipping manual metadata.version validation.");
  }
  console.log("PR version/changeset checks passed.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
