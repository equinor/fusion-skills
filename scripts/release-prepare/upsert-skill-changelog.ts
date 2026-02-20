import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type GroupedNotes, renderGroupedNotes } from "./release-notes-format";

/**
 * Prepends a version entry to skills/<skill>/CHANGELOG.md.
 *
 * @param skillDir - Absolute skill directory path.
 * @param version - Skill version heading to insert.
 * @param notesByType - Grouped release notes for the skill changelog section.
 * @param repoSlug - Optional `owner/repo` used for provenance links.
 * @returns Nothing.
 */
export function upsertSkillChangelog(
  skillDir: string,
  version: string,
  notesByType: GroupedNotes,
  repoSlug: string | null,
): void {
  const changelogPath = join(skillDir, "CHANGELOG.md");
  const today = new Date().toISOString().slice(0, 10);
  const newEntry = [
    `## ${version} - ${today}`,
    "",
    ...renderGroupedNotes(notesByType, repoSlug, 3),
  ].join("\n");

  // Fail fast here so the remaining logic can assume valid input.
  if (!existsSync(changelogPath)) {
    writeFileSync(changelogPath, `# Changelog\n\n${newEntry}\n`, "utf8");
    return;
  }

  const current = readFileSync(changelogPath, "utf8");
  // Fail fast here so the remaining logic can assume valid input.
  if (current.includes(`## ${version}`)) {
    return;
  }

  // Fail fast here so the remaining logic can assume valid input.
  if (current.startsWith("# Changelog")) {
    // This regex matches the expected text format for this step.
    const rest = current.replace(/^# Changelog\s*\n?/, "");
    writeFileSync(changelogPath, `${`# Changelog\n\n${newEntry}\n${rest}`.trimEnd()}\n`, "utf8");
  } else {
    writeFileSync(changelogPath, `${`${newEntry}\n${current}`.trimEnd()}\n`, "utf8");
  }
}
