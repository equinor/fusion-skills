import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { findSkillFiles } from "../list-skills/find-skill-files";
import { extractFrontmatter, parseFrontmatter } from "../list-skills/parse-frontmatter";

const SKILLS_TABLE_START = "<!-- skills-table:start -->";
const SKILLS_TABLE_END = "<!-- skills-table:end -->";

type SkillRow = {
  name: string;
  description: string;
  version: string;
  relativePath: string;
};

function escapeTableCell(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function buildSkillsTable(rows: SkillRow[]): string {
  const header = ["| Skill | Description | Version |", "| --- | --- | --- |"];

  const body = rows.map((row) => {
    const safeDescription = escapeTableCell(row.description);
    return `| [\`${row.name}\`](${row.relativePath}) | ${safeDescription} | \`${row.version}\` |`;
  });

  return [...header, ...body].join("\n");
}

/**
 * Updates README skills table from discovered skill frontmatter files.
 *
 * The README must contain skills table start/end HTML comment markers.
 */
export function updateReadmeSkillsTable(repoRoot: string): number {
  const readmePath = join(repoRoot, "README.md");
  const readmeContent = readFileSync(readmePath, "utf8");
  const startIndex = readmeContent.indexOf(SKILLS_TABLE_START);
  const endIndex = readmeContent.indexOf(SKILLS_TABLE_END);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(
      "README.md is missing valid skills table markers: <!-- skills-table:start --> / <!-- skills-table:end -->",
    );
  }

  const skillFiles = findSkillFiles(join(repoRoot, "skills")).sort();
  const rows: SkillRow[] = skillFiles.map((skillFile) => {
    const markdown = readFileSync(skillFile, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));
    const name = frontmatter.name?.trim();
    const description = frontmatter.description?.trim();
    const version = frontmatter["metadata.version"]?.trim();

    if (!name || !description || !version) {
      throw new Error(`Missing required frontmatter fields in ${relative(repoRoot, skillFile)}`);
    }

    return {
      name,
      description,
      version,
      relativePath: relative(repoRoot, skillFile).replace(/\\/g, "/"),
    };
  });

  rows.sort((left, right) => left.name.localeCompare(right.name));

  const table = buildSkillsTable(rows);
  const updatedContent =
    readmeContent.slice(0, startIndex + SKILLS_TABLE_START.length) +
    "\n" +
    table +
    "\n" +
    readmeContent.slice(endIndex);

  writeFileSync(readmePath, updatedContent, "utf8");
  return rows.length;
}
