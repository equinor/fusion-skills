import { join, relative } from "node:path";
import { findSkillFiles } from "../list-skills/find-skill-files";

/**
 * Discovers local skill directories from SKILL.md files.
 *
 * @param repoRoot - Absolute repository root path.
 * @returns Sorted repository-relative skill directory paths.
 */
export function discoverLocalSkills(repoRoot: string): string[] {
  return (
    findSkillFiles(join(repoRoot, "skills"))
      // Convert each value into the shape expected by downstream code.
      .map((skillFile) => skillFile.replace(/\/SKILL\.md$/, ""))
      // Convert each value into the shape expected by downstream code.
      .map((skillDir) => relative(repoRoot, skillDir))
      .sort()
  );
}
