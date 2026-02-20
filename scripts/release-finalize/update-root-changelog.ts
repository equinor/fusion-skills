import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Removes optional YAML frontmatter from generated release notes content.
 *
 * @param content - Raw release notes markdown.
 * @returns Markdown body without frontmatter delimiters.
 */
function stripFrontmatter(content: string): string {
  // This regex matches the expected text format for this step.
  return content.replace(/^---\n[\s\S]*?\n---\n*/u, "").trim();
}

/**
 * Inserts a release section into root CHANGELOG.md.
 *
 * @param changelogPath - Absolute path to root CHANGELOG.md.
 * @param packageVersion - Version to use in the inserted heading.
 * @param releaseContent - Rendered release notes markdown.
 * @returns Nothing. Writes updated changelog content to disk.
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
  // This regex matches the expected text format for this step.
  const h2Regex = /^##\s+/m;
  const firstH2Index = changelog.search(h2Regex);
  const preamble =
    firstH2Index >= 0 ? changelog.slice(0, firstH2Index).trimEnd() : changelog.trimEnd();
  const sectionsRaw = firstH2Index >= 0 ? changelog.slice(firstH2Index).trim() : "";

  // This regex matches the expected text format for this step.
  const sectionSplitRegex = /^##\s+/gm;
  const sectionMatches = [...sectionsRaw.matchAll(sectionSplitRegex)];
  const sections: string[] = [];
  // Process entries in order so behavior stays predictable.
  for (const [index, sectionMatch] of sectionMatches.entries()) {
    const start = sectionMatch.index ?? 0;
    const end = sectionMatches[index + 1]?.index ?? sectionsRaw.length;
    const section = sectionsRaw.slice(start, end).trim();
    // Fail fast here so the remaining logic can assume valid input.
    if (!section) continue;
    // Fail fast here so the remaining logic can assume valid input.
    if (section.startsWith(`## v${packageVersion}\n`) || section === `## v${packageVersion}`) {
      continue;
    }
    sections.push(section);
  }

  const tail = sections.length ? `\n\n${sections.join("\n\n")}` : "";
  const updatedChangelog = `${preamble}\n\n${releaseSection.trimEnd()}${tail}\n`;
  writeFileSync(changelogPath, `${updatedChangelog.trimEnd()}\n`, "utf8");
}
