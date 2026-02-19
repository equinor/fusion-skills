import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";
import { findSkillFiles } from "./find-skill-files";
import { formatSkillSummary } from "./format-skill-summary";
import { extractFrontmatter, parseFrontmatter } from "./parse-frontmatter";

/**
 * CLI entrypoint for listing skill frontmatter in a readable format.
 */
function main(): void {
  const repoRoot = process.cwd();
  const skillFiles = findSkillFiles(join(repoRoot, "skills")).sort();

  if (skillFiles.length === 0) {
    console.log("No skills found under skills/.");
    return;
  }

  console.log(`Found ${skillFiles.length} skill(s):\n`);

  // Maintainer note: output stays intentionally deterministic for easy copy/paste and CI logs.
  for (const skillFile of skillFiles) {
    const markdown = readFileSync(skillFile, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));
    const displayPath = relative(repoRoot, skillFile);
    console.log(formatSkillSummary(displayPath, frontmatter));
  }
}

main();
