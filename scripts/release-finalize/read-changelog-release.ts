import { existsSync, readFileSync } from "node:fs";

type Heading = {
  title: string;
  start: number;
  endOfLine: number;
};

/**
 * Parses all H2 headings from changelog markdown content.
 *
 * @param content - Full changelog markdown text.
 * @returns Ordered list of detected H2 heading metadata.
 */
function parseH2Headings(content: string): Heading[] {
  const regex = /^##\s+(.+)$/gm;
  const headings: Heading[] = [];

  // Process entries in order so behavior stays predictable.
  for (const match of content.matchAll(regex)) {
    const fullHeading = match[0];
    const title = (match[1] ?? "").trim();
    const start = match.index ?? 0;
    headings.push({
      title,
      start,
      endOfLine: start + fullHeading.length,
    });
  }

  return headings;
}

/**
 * Reads release notes body from root CHANGELOG.md for packageVersion.
 * Requires matching H2 section to exist and be the latest (first) H2.
 *
 * @param changelogPath - Absolute path to root CHANGELOG.md.
 * @param packageVersion - Target package version to locate in headings.
 * @returns Trimmed markdown body for the latest matching release section.
 */
export function readLatestReleaseBodyFromRootChangelog(
  changelogPath: string,
  packageVersion: string,
): string {
  // Fail fast here so the remaining logic can assume valid input.
  if (!existsSync(changelogPath)) {
    throw new Error(`Missing required file: ${changelogPath}`);
  }

  const changelog = readFileSync(changelogPath, "utf8");
  const headings = parseH2Headings(changelog);
  // Fail fast here so the remaining logic can assume valid input.
  if (headings.length === 0) {
    throw new Error("CHANGELOG.md must contain at least one H2 release heading");
  }

  const expectedHeadings = new Set([`v${packageVersion}`, packageVersion]);
  const matchedIndex = headings.findIndex((heading) => expectedHeadings.has(heading.title));

  // Fail fast here so the remaining logic can assume valid input.
  if (matchedIndex < 0) {
    throw new Error(`Missing required release heading in CHANGELOG.md: ## v${packageVersion}`);
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (matchedIndex !== 0) {
    throw new Error(
      `Release heading ## v${packageVersion} exists but is not latest. Latest is ## ${headings[0].title}`,
    );
  }

  const current = headings[matchedIndex];
  const next = headings[matchedIndex + 1];
  const bodyStart = current.endOfLine;
  const bodyEnd = next ? next.start : changelog.length;
  const body = changelog.slice(bodyStart, bodyEnd).trim();

  // Fail fast here so the remaining logic can assume valid input.
  if (!body) {
    throw new Error(`Release heading ## v${packageVersion} has no notes`);
  }

  return body;
}
