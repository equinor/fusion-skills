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

  for (const file of changedFiles) {
    if (file === "package.json") {
      packageJsonTouched = true;
    }

    if (file === "CHANGELOG.md") {
      rootChangelogTouched = true;
    }

    if (/^\.changeset\/.*\.md$/.test(file)) {
      changedChangesetFiles.push(file);
    }

    if (!file.startsWith("skills/")) {
      continue;
    }

    const [_, second, third] = file.split("/");
    if (!second) continue;

    // Maintainer note: hidden top-level folders store skill id in path segment #3.
    if (second.startsWith(".")) {
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
