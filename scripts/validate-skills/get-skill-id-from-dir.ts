/**
 * Gets skill id from a repository-relative skill directory path.
 *
 * @param skillDir - Repository-relative skill directory path.
 * @returns Skill id inferred from path segments.
 */
export function getSkillIdFromDir(skillDir: string): string {
  const normalizedSkillDir = skillDir.replaceAll("\\", "/");
  const parts = normalizedSkillDir.split("/");
  // Hidden skill folders store skill id in segment #3.
  if (parts[1]?.startsWith(".")) {
    return parts[2] ?? "";
  }

  return parts[1] ?? "";
}
