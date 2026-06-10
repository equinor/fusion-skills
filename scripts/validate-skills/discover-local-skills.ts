import { join, relative } from "node:path";
import { findSkillFiles } from "../list-skills/find-skill-files";

/**
 * Discovers local skill directories from SKILL.md files.
 *
 * @param repoRoot - Absolute repository root path.
 * @returns Sorted repository-relative skill directory paths.
 */
export function discoverLocalSkills(repoRoot: string): string[] {
  // Only scan skills/ — CLI does not scan .agents/skills/ so we exclude it.
  const skillRoots = [join(repoRoot, "skills")];
  return (
    skillRoots
      .flatMap((root) => findSkillFiles(root))
      // This regex strips the trailing /SKILL.md (or \SKILL.md on Windows) so we keep only the skill directory path.
      .map((skillFile) => skillFile.replace(/[/\\]SKILL\.md$/, ""))
      // Convert each value into the shape expected by downstream code.
      .map((skillDir) => relative(repoRoot, skillDir))
      // Note: deprecated skills are intentionally included — the CLI lists them in its "Found N" count.
      .sort()
  );
}
