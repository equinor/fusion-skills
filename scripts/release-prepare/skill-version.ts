/**
 * Extracts metadata.version from SKILL.md content.
 */
export function extractMetadataVersion(skillContent: string): string {
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  if (!metadataBlock) throw new Error("SKILL.md missing required metadata block");

  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  if (!versionLine) throw new Error("SKILL.md missing metadata.version");

  return versionLine[1];
}

/**
 * Updates metadata.version in SKILL.md frontmatter.
 */
export function updateMetadataVersion(skillContent: string, newVersion: string): string {
  const lines = skillContent.split("\n");
  const metadataIndex = lines.findIndex((line) => /^metadata:\s*$/.test(line));
  if (metadataIndex < 0) throw new Error("SKILL.md missing required metadata block");

  let blockEnd = lines.length;
  for (let i = metadataIndex + 1; i < lines.length; i += 1) {
    if (/^---\s*$/.test(lines[i]) || /^[^\s]/.test(lines[i])) {
      blockEnd = i;
      break;
    }
  }

  let replaced = false;
  for (let i = metadataIndex + 1; i < blockEnd; i += 1) {
    if (/^\s+version:\s*/.test(lines[i])) {
      const indentation = (lines[i].match(/^(\s+)/) || ["  "])[1];
      lines[i] = `${indentation}version: "${newVersion}"`;
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    lines.splice(metadataIndex + 1, 0, `  version: "${newVersion}"`);
  }

  return lines.join("\n");
}
