/**
 * Formats a parsed frontmatter object for terminal output.
 */
export function formatSkillSummary(skillPath: string, frontmatter: Record<string, string>): string {
  const lines: string[] = [];

  lines.push("─".repeat(72));
  lines.push(skillPath);
  lines.push("─".repeat(72));
  lines.push(`name:                 ${frontmatter.name ?? "(missing)"}`);
  lines.push(`description:          ${frontmatter.description ?? "(missing)"}`);
  lines.push(`license:              ${frontmatter.license ?? "(none)"}`);
  lines.push("metadata:");
  lines.push(`  - version: ${frontmatter["metadata.version"] ?? "(missing)"}`);

  const metadataExtras = Object.keys(frontmatter)
    .filter((key) => key.startsWith("metadata.") && key !== "metadata.version")
    .sort();

  for (const key of metadataExtras) {
    const displayKey = key.replace(/^metadata\./, "");
    const value = frontmatter[key] ?? "";
    if (value.includes(",")) {
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      lines.push(`  - ${displayKey}:`);
      for (const item of items) {
        lines.push(`      - ${item}`);
      }
    } else {
      lines.push(`  - ${displayKey}: ${value}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}
