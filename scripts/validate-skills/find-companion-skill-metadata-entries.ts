import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractFrontmatter } from "../list-skills/extract-frontmatter";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";
import { getSkillIdFromDir } from "./get-skill-id-from-dir";

/**
 * Finds missing local skills that declare `metadata.skills`.
 *
 * Maintainer note: the external skills CLI currently excludes these from `--list`
 * output, so we treat them as known/explicit companion-skill metadata usage.
 *
 * @param repoRoot - Absolute repository root path.
 * @param localSkills - Repository-relative skill directory paths.
 * @param cliSkillIds - Skill ids discovered in CLI output.
 * @returns Skill directories expected to be excluded by external CLI listing.
 */
export function findCompanionSkillMetadataEntries(
  repoRoot: string,
  localSkills: string[],
  cliSkillIds: Set<string>,
): string[] {
  const excluded: string[] = [];

  // Process entries in order so behavior stays predictable.
  for (const skillDir of localSkills) {
    const skillId = getSkillIdFromDir(skillDir);
    // Skip skills that are already listed by external CLI.
    if (cliSkillIds.has(skillId)) {
      continue;
    }

    const skillPath = join(repoRoot, skillDir, "SKILL.md");
    const markdown = readFileSync(skillPath, "utf8");
    const frontmatter = parseFrontmatter(extractFrontmatter(markdown));

    // Treat metadata.skills as companion metadata regardless of role hint.
    const hasMetadataSkills = Boolean(frontmatter["metadata.skills"]);

    // Collect only skills that use metadata.skills as companion metadata.
    if (hasMetadataSkills) {
      excluded.push(skillDir);
    }
  }

  return excluded;
}
