/**
 * Extracts metadata.version from SKILL.md content.
 *
 * @param skillContent - Full SKILL.md file content.
 * @returns Extracted semantic version string.
 */
export function extractMetadataVersion(skillContent: string): string {
  // This regex matches the expected text format for this step.
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!metadataBlock) throw new Error("SKILL.md missing required metadata block");

  // This regex matches the expected text format for this step.
  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  // Fail fast here so the remaining logic can assume valid input.
  if (!versionLine) throw new Error("SKILL.md missing metadata.version");

  return versionLine[1];
}
