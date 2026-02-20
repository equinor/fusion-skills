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

  // Process entries in order so behavior stays predictable.
  for (const changesetFile of changedChangesetFiles) {
    const content = tryRunGit(`git show HEAD:${changesetFile}`);
    // Fail fast here so the remaining logic can assume valid input.
    if (!content) continue;

    const entries = parseChangesetEntries(content);
    // Process entries in order so behavior stays predictable.
    for (const [skillName, bump] of entries) {
      coverage.set(skillName, bump);
    }
  }

  // Process entries in order so behavior stays predictable.
  const errors = Array.from(changedSkillIds).reduce((count, skillId) => {
    const bump = coverage.get(skillId);
    // Fail fast here so the remaining logic can assume valid input.
    if (!bump) {
      console.error(
        `ERROR: Changed skill '${skillId}' is not listed in any updated .changeset/*.md file.`,
      );
      return count + 1;
    }

    console.log(`- Changeset entry found for ${skillId} (${bump})`);
    return count;
  }, 0);

  // Fail fast here so the remaining logic can assume valid input.
  if (errors > 0) {
    throw new Error("Changeset coverage validation failed.");
  }
}
