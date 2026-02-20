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

/**
 * Updates metadata.version in SKILL.md frontmatter.
 *
 * @param skillContent - Full SKILL.md file content.
 * @param newVersion - Semantic version string to persist.
 * @returns Updated SKILL.md content.
 */
export function updateMetadataVersion(skillContent: string, newVersion: string): string {
  const lines = skillContent.split("\n");
  // This regex matches the expected text format for this step.
  const metadataIndex = lines.findIndex((line) => /^metadata:\s*$/.test(line));
  // Fail fast here so the remaining logic can assume valid input.
  if (metadataIndex < 0) throw new Error("SKILL.md missing required metadata block");

  const afterMetadata = lines.slice(metadataIndex + 1);
  const isMetadataBoundary = (line: string): boolean => {
    // This regex matches frontmatter delimiters that end the metadata block.
    if (/^---\s*$/.test(line)) {
      return true;
    }

    // This regex matches top-level keys (non-indented lines) that end metadata nesting.
    return /^[^\s]/.test(line);
  };
  const relativeBlockEnd = afterMetadata.findIndex(isMetadataBoundary);
  const blockEnd = relativeBlockEnd < 0 ? lines.length : metadataIndex + 1 + relativeBlockEnd;

  const metadataLines = lines.slice(metadataIndex + 1, blockEnd);
  // This regex matches the metadata.version line so we can replace it in place.
  const versionRelativeIndex = metadataLines.findIndex((line) => /^\s+version:\s*/.test(line));
  const versionIndex = versionRelativeIndex < 0 ? -1 : metadataIndex + 1 + versionRelativeIndex;

  // Fail fast here so the remaining logic can assume valid input.
  if (versionIndex < 0) {
    lines.splice(metadataIndex + 1, 0, `  version: "${newVersion}"`);
  } else {
    // This regex matches the expected text format for this step.
    const indentation = (lines[versionIndex].match(/^(\s+)/) || ["  "])[1];
    lines[versionIndex] = `${indentation}version: "${newVersion}"`;
  }

  return lines.join("\n");
}
