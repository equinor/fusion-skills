import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type GroupedNotes, renderGroupedNotes } from "./release-notes-format";

/**
 * Prepends a version entry to skills/<skill>/CHANGELOG.md.
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

  if (!existsSync(changelogPath)) {
    writeFileSync(changelogPath, `# Changelog\n\n${newEntry}\n`, "utf8");
    return;
  }

  const current = readFileSync(changelogPath, "utf8");
  if (current.includes(`## ${version}`)) {
    return;
  }

  if (current.startsWith("# Changelog")) {
    const rest = current.replace(/^# Changelog\s*\n?/, "");
    writeFileSync(changelogPath, `${`# Changelog\n\n${newEntry}\n${rest}`.trimEnd()}\n`, "utf8");
  } else {
    writeFileSync(changelogPath, `${`${newEntry}\n${current}`.trimEnd()}\n`, "utf8");
  }
}
