import { gitPathExists, runGit } from "./git-helpers";
import { getMetadataVersionFromSkillContent } from "./version-from-skill-content";

/**
 * Reads metadata.version for <skillDir>/SKILL.md at a specific git ref.
 */
export function getVersionAtRef(ref: string, skillDir: string): string | null {
  const skillPath = `${skillDir}/SKILL.md`;
  if (!gitPathExists(ref, skillPath)) return null;

  const skillContent = runGit(`git show ${ref}:${skillPath}`);
  return getMetadataVersionFromSkillContent(skillContent);
}
