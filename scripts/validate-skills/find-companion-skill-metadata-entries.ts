import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractFrontmatter } from "../list-skills/extract-frontmatter";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";
import { getSkillIdFromDir } from "./get-skill-id-from-dir";

/**
 * Finds missing local skills that declare `metadata.skills` or are deprecated.
 *
 * Maintainer note: the external skills CLI currently excludes these from `--list`
 * output, so we treat them as known/explicit exclusions:
 * - companion-skill metadata (`metadata.skills`) usage
 * - deprecated skills (`metadata.status: deprecated`) in `skills/.deprecated/`
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

    // Treat deprecated skills as expected CLI exclusions (the external CLI
    // does not discover skills under skills/.deprecated/).
    const isDeprecated = frontmatter["metadata.status"] === "deprecated";

    // Collect skills that are expected to be absent from external CLI output.
    if (hasMetadataSkills || isDeprecated) {
      excluded.push(skillDir);
    }
  }

  return excluded;
}
