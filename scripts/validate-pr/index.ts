import process from "node:process";
import { collectChangedSkillContext } from "./collect-context";
import { runGit, tryRunGit } from "./git-helpers";
import { validateChangesetCoverage } from "./validate-changeset-coverage";
import { validateVersionBumps } from "./validate-version-bumps";

/**
 * CLI entrypoint for PR validation:
 * - changeset coverage for changed skills
 * - metadata.version bumps for changed skills
 */
function main(): void {
  const baseRef = process.env.GITHUB_BASE_REF?.trim();
  if (!baseRef) {
    console.log("No GITHUB_BASE_REF detected. Skipping PR version/changeset checks.");
    return;
  }

  const baseRemoteRef = `origin/${baseRef}`;
  console.log(`Comparing PR changes against ${baseRemoteRef}`);

  tryRunGit(`git fetch --no-tags origin ${baseRef}`);

  const changedFiles = runGit(`git diff --name-only --diff-filter=ACMRD ${baseRemoteRef}...HEAD`)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (changedFiles.length === 0) {
    console.log("No changed files found in PR diff.");
    return;
  }

  const { changedSkillDirs, changedSkillIds, changedChangesetFiles, releaseMdTouched } =
    collectChangedSkillContext(changedFiles);

  if (changedSkillDirs.size === 0) {
    console.log("No changed skill directories detected.");
    return;
  }

  if (changedChangesetFiles.length === 0 && !releaseMdTouched) {
    console.error(
      "ERROR: One or more skills changed, but no .changeset/*.md file was updated in this PR.",
    );
    console.error("Changed skill directories:");
    for (const dir of changedSkillDirs) {
      console.error(`- ${dir}`);
    }
    console.error(
      '\nAdd a changeset file, for example:\n---\n"fusion-skill-authoring": minor\n---',
    );
    throw new Error("Missing required changeset files.");
  }

  // Maintainer note: release PRs remove processed changesets, so coverage check is skipped for those.
  if (!releaseMdTouched) {
    validateChangesetCoverage(changedSkillIds, changedChangesetFiles);
  } else {
    console.log(
      ".changeset/release.md detected; treating this as a release PR and skipping changeset coverage checks.",
    );
  }

  console.log("Validating metadata.version bumps for changed skills...");
  validateVersionBumps(changedSkillDirs, baseRemoteRef);
  console.log("PR version/changeset checks passed.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
