/**
 * Formats a parsed frontmatter object for terminal output.
 *
 * @param skillPath - Repository-relative path to the SKILL.md file.
 * @param frontmatter - Parsed frontmatter key/value data.
 * @returns Human-readable multi-line summary text.
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
    // Keep only items that meet the rules for this step.
    .filter((key) => key.startsWith("metadata.") && key !== "metadata.version")
    .sort();

  // Process entries in order so behavior stays predictable.
  for (const key of metadataExtras) {
    // This regex matches the expected text format for this step.
    const displayKey = key.replace(/^metadata\./, "");
    const value = frontmatter[key] ?? "";
    // Fail fast here so the remaining logic can assume valid input.
    if (value.includes(",")) {
      const items = value
        .split(",")
        // Convert each value into the shape expected by downstream code.
        .map((item) => item.trim())
        // Keep only items that meet the rules for this step.
        .filter(Boolean);

      lines.push(`  - ${displayKey}:`);
      // Process entries in order so behavior stays predictable.
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
