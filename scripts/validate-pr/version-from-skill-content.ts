/**
 * Extracts metadata.version from SKILL.md content.
 */
export function getMetadataVersionFromSkillContent(skillContent: string): string | null {
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  if (!metadataBlock) return null;

  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  return versionLine?.[1] ?? null;
}
