/**
 * Extracts metadata.version from SKILL.md content.
 *
 * @param skillContent - Full SKILL.md file content.
 * @returns Extracted semantic version string.
 */
export function extractMetadataVersion(skillContent: string): string {
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  // Fail fast here so the remaining logic can assume valid input.
  if (!metadataBlock) throw new Error("SKILL.md missing required metadata block");

  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  // Fail fast here so the remaining logic can assume valid input.
  if (!versionLine) throw new Error("SKILL.md missing metadata.version");

  return versionLine[1];
}

/**
 * Updates metadata.version in SKILL.md frontmatter.
 *
 * @param skillContent - Full SKILL.md file content.
 * @param newVersion - Semantic version string to persist.
 * @returns Updated SKILL.md content.
 */
export function updateMetadataVersion(skillContent: string, newVersion: string): string {
  const lines = skillContent.split("\n");
  const metadataIndex = lines.findIndex((line) => /^metadata:\s*$/.test(line));
  // Fail fast here so the remaining logic can assume valid input.
  if (metadataIndex < 0) throw new Error("SKILL.md missing required metadata block");

  let blockEnd = lines.length;
  // Process entries in order so behavior stays predictable.
  for (let i = metadataIndex + 1; i < lines.length; i += 1) {
    // Fail fast here so the remaining logic can assume valid input.
    if (/^---\s*$/.test(lines[i]) || /^[^\s]/.test(lines[i])) {
      blockEnd = i;
      break;
    }
  }

  let replaced = false;
  // Process entries in order so behavior stays predictable.
  for (let i = metadataIndex + 1; i < blockEnd; i += 1) {
    // Fail fast here so the remaining logic can assume valid input.
    if (/^\s+version:\s*/.test(lines[i])) {
      const indentation = (lines[i].match(/^(\s+)/) || ["  "])[1];
      lines[i] = `${indentation}version: "${newVersion}"`;
      replaced = true;
      break;
    }
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (!replaced) {
    lines.splice(metadataIndex + 1, 0, `  version: "${newVersion}"`);
  }

  return lines.join("\n");
}
