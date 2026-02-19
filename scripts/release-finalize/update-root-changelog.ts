import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Inserts a release section into root CHANGELOG.md.
 */
export function updateRootChangelog(
  changelogPath: string,
  packageVersion: string,
  releaseContent: string,
): void {
  const releaseSection = `## v${packageVersion}\n\n${releaseContent}\n`;
  let changelog = existsSync(changelogPath)
    ? readFileSync(changelogPath, "utf8")
    : "# Changelog\n\nAll notable changes to this repository are documented in this file.\n\n";

  if (/^## \[Unreleased\]/m.test(changelog)) {
    changelog = changelog.replace(
      /^## \[Unreleased\][^\n]*\n/m,
      (match) => `${match}\n${releaseSection}\n`,
    );
  } else {
    changelog = `${changelog.trimEnd()}\n\n${releaseSection}\n`;
  }

  writeFileSync(changelogPath, `${changelog.trimEnd()}\n`, "utf8");
}
