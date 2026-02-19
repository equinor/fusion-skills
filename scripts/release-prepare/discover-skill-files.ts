import { basename, dirname, join } from "node:path";
import { findSkillFiles } from "../list-skills/find-skill-files";

/**
 * Discovers all skills and returns a map of skill-name -> SKILL.md path.
 */
export function discoverSkillFiles(repoRoot: string): Map<string, string> {
  const files = findSkillFiles(join(repoRoot, "skills"));
  const map = new Map<string, string>();

  for (const skillFile of files) {
    map.set(basename(dirname(skillFile)), skillFile);
  }

  return map;
}
