/**
 * Aggregated repository-change context used by PR validation checks.
 */
export interface ChangedSkillContext {
  changedSkillDirs: Set<string>;
  changedSkillIds: Set<string>;
  changedChangesetFiles: string[];
  packageJsonTouched: boolean;
  rootChangelogTouched: boolean;
}

/**
 * Collects skill-related context from changed file paths.
 *
 * @param changedFiles - Repository-relative file paths changed in the PR diff.
 * @returns Aggregated change context used by validation checks.
 */
export function collectChangedSkillContext(changedFiles: string[]): ChangedSkillContext {
  const changedSkillDirs = new Set<string>();
  const changedSkillIds = new Set<string>();
  const changedChangesetFiles: string[] = [];
  let packageJsonTouched = false;
  let rootChangelogTouched = false;

  // Process entries in order so behavior stays predictable.
  for (const file of changedFiles) {
    // Fail fast here so the remaining logic can assume valid input.
    if (file === "package.json") {
      packageJsonTouched = true;
    }

    // Fail fast here so the remaining logic can assume valid input.
    if (file === "CHANGELOG.md") {
      rootChangelogTouched = true;
    }

    // This regex identifies changed markdown files under the .changeset directory.
    if (/^\.changeset\/.*\.md$/.test(file)) {
      changedChangesetFiles.push(file);
    }

    // Fail fast here so the remaining logic can assume valid input.
    if (!file.startsWith("skills/")) {
      continue;
    }

    const [_, second, third] = file.split("/");
    // Fail fast here so the remaining logic can assume valid input.
    if (!second) continue;

    // Maintainer note: hidden top-level folders store skill id in path segment #3.
    if (second.startsWith(".")) {
      // Fail fast here so the remaining logic can assume valid input.
      if (!third) continue;
      changedSkillDirs.add(`skills/${second}/${third}`);
      changedSkillIds.add(third);
      continue;
    }

    changedSkillDirs.add(`skills/${second}`);
    changedSkillIds.add(second);
  }

  return {
    changedSkillDirs,
    changedSkillIds,
    changedChangesetFiles,
    packageJsonTouched,
    rootChangelogTouched,
  };
}
