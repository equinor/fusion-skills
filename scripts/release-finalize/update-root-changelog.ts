import { existsSync, readFileSync, writeFileSync } from "node:fs";

function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n*/u, "").trim();
}

/**
 * Inserts a release section into root CHANGELOG.md.
 */
export function updateRootChangelog(
  changelogPath: string,
  packageVersion: string,
  releaseContent: string,
): void {
  const normalizedReleaseContent = stripFrontmatter(releaseContent);
  const releaseSection = `## v${packageVersion}\n\n${normalizedReleaseContent}\n`;
  const currentChangelog = existsSync(changelogPath) ? readFileSync(changelogPath, "utf8") : "";
  const changelog = currentChangelog.trim().length
    ? currentChangelog
    : "# Changelog\n\nAll notable changes to this repository are documented in this file.\n";

  const updatedChangelog = `${changelog.trimEnd()}\n\n${releaseSection}\n`;
  writeFileSync(changelogPath, `${updatedChangelog.trimEnd()}\n`, "utf8");
}
