import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { sanitizeAnsi } from "./sanitize-ansi";

/**
 * Finds APM-managed installed skills that are present in skills CLI output.
 *
 * The root APM lockfile is the source of truth for managed materializations.
 * Only `.agents/skills/<id>/SKILL.md` entries are considered, so unrelated APM
 * deployments cannot affect catalog validation.
 *
 * @param repoRoot - Absolute repository root path.
 * @param cliOutput - Raw skills CLI output text.
 * @returns Sorted skill ids that should be excluded from the CLI catalog count.
 */
export function findListedApmManagedSkills(repoRoot: string, cliOutput: string): string[] {
  // Reject ambiguous relative paths before reading repository-controlled state.
  if (!isAbsolute(repoRoot)) {
    throw new Error("Repository root must be an absolute path.");
  }

  const lockfilePath = join(repoRoot, "apm.lock.yaml");
  // Preserve validation behavior for repositories that do not use root APM dependencies.
  if (!existsSync(lockfilePath)) {
    return [];
  }

  const lockfile = readFileSync(lockfilePath, "utf8");
  const managedSkillIds = new Set<string>();

  // Parse only the narrow lockfile path contract instead of accepting general YAML data.
  for (const line of lockfile.split("\n")) {
    const match = line.match(
      // This regex matches an APM-deployed skill manifest path and captures its safe directory id.
      /^\s*-\s+\.agents\/skills\/([a-zA-Z0-9][a-zA-Z0-9._-]*)\/SKILL\.md\s*$/,
    );
    // A set prevents duplicate deployed-file sections from changing the reconciled count.
    if (match) {
      managedSkillIds.add(match[1]);
    }
  }

  const cliLines = sanitizeAnsi(cliOutput)
    .split("\n")
    // Normalize only CLI decoration so exact skill-id comparisons remain strict.
    .map((line) => {
      const trimmedLine = line.trim();
      // CLI list entries have a box-drawing prefix; descriptions cannot equal a
      // known id after this exact normalization.
      return trimmedLine.startsWith("│") ? trimmedLine.slice(1).trim() : trimmedLine;
    });

  return (
    Array.from(managedSkillIds)
      // Exclude a managed install only when the CLI actually included its exact id.
      .filter((skillId) => cliLines.includes(skillId))
      .sort()
  );
}
