import { tryRunGit } from "./git-helpers";
import { parseChangesetEntries } from "./parse-changeset-entries";

/**
 * Validates that all changed skills are covered by updated changeset files.
 *
 * @param changedSkillIds - Skill ids changed in the current PR.
 * @param changedChangesetFiles - Repository-relative changed changeset file paths.
 * @returns Nothing.
 */
export function validateChangesetCoverage(
  changedSkillIds: Set<string>,
  changedChangesetFiles: string[],
): void {
  const coverage = new Map<string, string>();

  for (const changesetFile of changedChangesetFiles) {
    const content = tryRunGit(`git show HEAD:${changesetFile}`);
    if (!content) continue;

    const entries = parseChangesetEntries(content);
    for (const [skillName, bump] of entries) {
      coverage.set(skillName, bump);
    }
  }

  let errors = 0;
  for (const skillId of changedSkillIds) {
    const bump = coverage.get(skillId);
    if (!bump) {
      console.error(
        `ERROR: Changed skill '${skillId}' is not listed in any updated .changeset/*.md file.`,
      );
      errors += 1;
    } else {
      console.log(`- Changeset entry found for ${skillId} (${bump})`);
    }
  }

  if (errors > 0) {
    throw new Error("Changeset coverage validation failed.");
  }
}
