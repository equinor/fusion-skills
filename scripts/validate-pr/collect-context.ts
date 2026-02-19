export interface ChangedSkillContext {
  changedSkillDirs: Set<string>;
  changedSkillIds: Set<string>;
  changedChangesetFiles: string[];
  releaseMdTouched: boolean;
}

/**
 * Collects skill-related context from changed file paths.
 */
export function collectChangedSkillContext(changedFiles: string[]): ChangedSkillContext {
  const changedSkillDirs = new Set<string>();
  const changedSkillIds = new Set<string>();
  const changedChangesetFiles: string[] = [];
  let releaseMdTouched = false;

  for (const file of changedFiles) {
    if (file === ".changeset/release.md") {
      releaseMdTouched = true;
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

  return { changedSkillDirs, changedSkillIds, changedChangesetFiles, releaseMdTouched };
}
