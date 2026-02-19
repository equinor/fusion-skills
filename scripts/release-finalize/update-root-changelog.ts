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
  const h2Regex = /^##\s+/m;
  const firstH2Index = changelog.search(h2Regex);
  const preamble = firstH2Index >= 0 ? changelog.slice(0, firstH2Index).trimEnd() : changelog.trimEnd();
  const sectionsRaw = firstH2Index >= 0 ? changelog.slice(firstH2Index).trim() : "";

  const sectionSplitRegex = /^##\s+/gm;
  const sectionMatches = [...sectionsRaw.matchAll(sectionSplitRegex)];
  const sections: string[] = [];
  for (let index = 0; index < sectionMatches.length; index++) {
    const start = sectionMatches[index].index ?? 0;
    const end = sectionMatches[index + 1]?.index ?? sectionsRaw.length;
    const section = sectionsRaw.slice(start, end).trim();
    if (!section) continue;
    if (section.startsWith(`## v${packageVersion}\n`) || section === `## v${packageVersion}`) {
      continue;
    }
    sections.push(section);
  }

  const tail = sections.length ? `\n\n${sections.join("\n\n")}` : "";
  const updatedChangelog = `${preamble}\n\n${releaseSection.trimEnd()}${tail}\n`;
  writeFileSync(changelogPath, `${updatedChangelog.trimEnd()}\n`, "utf8");
}
