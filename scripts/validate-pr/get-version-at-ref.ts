import { runGit } from "./git-helpers";
import { gitPathExists } from "./git-path-exists";
import { getMetadataVersionFromSkillContent } from "./version-from-skill-content";

/**
 * Reads metadata.version for <skillDir>/SKILL.md at a specific git ref.
 *
 * @param ref - Git ref to read from.
 * @param skillDir - Repository-relative skill directory path.
 * @returns Parsed metadata version, or `null` when unavailable.
 */
export function getVersionAtRef(ref: string, skillDir: string): string | null {
  const skillPath = `${skillDir}/SKILL.md`;
  // Fail fast here so the remaining logic can assume valid input.
  if (!gitPathExists(ref, skillPath)) return null;

  const skillContent = runGit(`git show ${ref}:${skillPath}`);
  return getMetadataVersionFromSkillContent(skillContent);
}
