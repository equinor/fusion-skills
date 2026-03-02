import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { readLatestReleaseBodyFromRootChangelog } from "./read-changelog-release";

/**
 * Reads and validates the current root package version from package.json.
 *
 * @param packageJsonPath - Absolute path to the repository package.json.
 * @returns Semantic version string from the package manifest.
 */
function readPackageVersion(packageJsonPath: string): string {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
  // Fail fast here so the remaining logic can assume valid input.
  if (!pkg.version) {
    throw new Error("package.json is missing version");
  }
  return pkg.version;
}

/**
 * CLI entrypoint for finalizing a release on main.
 *
 * @returns Nothing. Writes `.release-notes.md` derived from root changelog.
 */
function main(): void {
  const repoRoot = process.cwd();
  const packageJsonPath = join(repoRoot, "package.json");
  const changelogPath = join(repoRoot, "CHANGELOG.md");
  const releaseNotesPath = join(repoRoot, ".release-notes.md");
  const packageVersion = readPackageVersion(packageJsonPath);

  const releaseBody = readLatestReleaseBodyFromRootChangelog(changelogPath, packageVersion);
  writeFileSync(releaseNotesPath, `${releaseBody}\n`, "utf8");
  console.log(`Prepared .release-notes.md from CHANGELOG.md section ## v${packageVersion}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
