import { execSync } from "node:child_process";

/**
 * Extracts metadata.version from SKILL.md text.
 */
function extractMetadataVersion(skillContent: string): string {
  const metadataBlock = skillContent.match(/\nmetadata:\n([\s\S]*?)(\n[^\s]|\n---|$)/);
  if (!metadataBlock) throw new Error("SKILL.md missing metadata block");

  const versionLine = metadataBlock[1].match(/^\s*version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?\s*$/m);
  if (!versionLine) throw new Error("SKILL.md missing metadata.version");

  return versionLine[1];
}

/**
 * Reads a skill version from a specific git ref.
 */
export function readSkillVersionAtRef(ref: string, skillName: string): string | null {
  try {
    const files = execSync(`git ls-tree -r --name-only ${ref} -- skills/**/SKILL.md`, {
      encoding: "utf8",
    });

    const skillPath = files
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .find(
        (line: string) =>
          line.endsWith(`/${skillName}/SKILL.md`) || line.includes(`/${skillName}/SKILL.md`),
      );

    if (!skillPath) return null;

    const content = execSync(`git show ${ref}:${skillPath}`, { encoding: "utf8" });
    return extractMetadataVersion(content);
  } catch {
    return null;
  }
}
