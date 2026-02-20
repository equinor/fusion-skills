/**
 * Extracts metadata.version from SKILL.md content.
 *
 * @param skillContent - Full SKILL.md file content.
 * @returns Parsed metadata version, or `null` when not present.
 */
export function getMetadataVersionFromSkillContent(skillContent: string): string | null {
  // This regex matches the expected text format for this step.
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!metadataBlock) return null;

  // This regex matches the expected text format for this step.
  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  return versionLine?.[1] ?? null;
}
