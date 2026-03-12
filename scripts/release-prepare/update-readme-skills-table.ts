import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { extractFrontmatter } from "../list-skills/extract-frontmatter";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";

const SKILLS_TABLE_START = "<!-- skills-table:start -->";
const SKILLS_TABLE_END = "<!-- skills-table:end -->";

type SkillRow = {
  typeIcon: string;
  name: string;
  description: string;
  version: string;
  relativePath: string;
};

/**
 * Derives skill type icon from a discovered SKILL.md relative path.
 *
 * @param relativePath - Repository-relative path using POSIX separators.
 * @returns Type icon for the README skills list.
 */
function getSkillTypeIcon(relativePath: string): string {
  if (relativePath.startsWith("skills/.experimental/")) {
    return "🧪";
  }

  if (relativePath.startsWith("skills/.curated/")) {
    return "👌";
  }

  if (relativePath.startsWith("skills/.system/")) {
    return "⚙️";
  }

  return "👍";
}

/**
 * Normalizes markdown text for generated README list entries.
 *
 * @param value - Raw text.
 * @returns Normalized single-line markdown-safe text.
 */
function normalizeListText(value: string): string {
  // This regex matches the expected text format for this step.
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

/**
 * Renders the README skills markdown list.
 *
 * @param rows - Sorted skill rows.
 * @returns Markdown skill list string.
 */
function buildSkillsList(rows: SkillRow[]): string {
  // Convert each value into the shape expected by downstream code.
  const entries = rows.map((row) => {
    const safeDescription = normalizeListText(row.description);
    return `**${row.typeIcon} [\`${row.name}@${row.version}\`](${row.relativePath})**\n\n${safeDescription}`;
  });

  return entries.join("\n\n---\n\n");
}

/**
 * Updates README skills list from discovered skill frontmatter files.
 *
 * The README must contain skills table start/end HTML comment markers.
 *
 * @param repoRoot - Absolute repository root path.
 * @returns Number of discovered skills rendered into the table.
 */
export function updateReadmeSkillsTable(repoRoot: string): number {
  const readmePath = join(repoRoot, "README.md");
  const readmeContent = readFileSync(readmePath, "utf8");
  const startIndex = readmeContent.indexOf(SKILLS_TABLE_START);
  const endIndex = readmeContent.indexOf(SKILLS_TABLE_END);

  // Fail fast here so the remaining logic can assume valid input.
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(
      "README.md is missing valid skills table markers: <!-- skills-table:start --> / <!-- skills-table:end -->",
    );
  }

  const skillFiles = findSkillFiles(join(repoRoot, "skills")).sort();
  // Convert each value into the shape expected by downstream code.
  const rows: SkillRow[] = skillFiles.map((skillFile) => {
    const markdown = readFileSync(skillFile, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));
    const name = frontmatter.name?.trim();
    const description = frontmatter.description?.trim();
    const version = frontmatter["metadata.version"]?.trim();
    const relativePath = relative(repoRoot, skillFile).replace(/\\/g, "/");

    // Fail fast here so the remaining logic can assume valid input.
    if (!name || !description || !version) {
      throw new Error(`Missing required frontmatter fields in ${relative(repoRoot, skillFile)}`);
    }

    return {
      typeIcon: getSkillTypeIcon(relativePath),
      name,
      description,
      version,
      relativePath,
    };
  });

  rows.sort((left, right) => left.name.localeCompare(right.name));

  const list = buildSkillsList(rows);
  const updatedContent =
    readmeContent.slice(0, startIndex + SKILLS_TABLE_START.length) +
    "\n" +
    list +
    "\n" +
    readmeContent.slice(endIndex);

  writeFileSync(readmePath, updatedContent, "utf8");
  return rows.length;
}
