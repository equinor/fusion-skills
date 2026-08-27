import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VERSION_LINE_PATTERN =
  // Regex matches exactly one unindented YAML version field while preserving line endings.
  /^version:[\t ]*(?:"[^"]*"|'[^']*'|[^\r\n#]+)[\t ]*$/gm;
const RELEASE_MANAGED_REF_PATTERN =
  // Regex limits ref updates to dependency lines carrying the explicit release-managed marker.
  /^([\t ]*ref:[\t ]*)v\d+\.\d+\.\d+([\t ]+# release-managed[\t ]*)$/gm;

/**
 * Updates top-level APM package manifest versions without reformatting YAML.
 *
 * @param repoRoot - Repository root containing the APM package directory.
 * @param newVersion - Root release version to apply to every package manifest.
 * @returns Package names whose manifests were updated.
 * @throws When a discovered package manifest lacks exactly one top-level version field.
 */
export function updateApmPackageVersions(repoRoot: string, newVersion: string): string[] {
  const packagesDir = join(repoRoot, "apm");
  // Repositories without APM packages retain the existing release behavior.
  if (!existsSync(packagesDir)) {
    return [];
  }

  // Only immediate package directories participate in the lockstep release contract.
  const packageNames = readdirSync(packagesDir, { withFileTypes: true })
    // Exclude files such as apm/README.md from package discovery.
    .filter((entry) => entry.isDirectory())
    // Carry stable package names instead of filesystem directory entries.
    .map((entry) => entry.name)
    .sort();
  const updatedPackages: string[] = [];

  for (const packageName of packageNames) {
    const manifestPath = join(packagesDir, packageName, "apm.yml");
    // Non-APM package directories are outside this helper's ownership.
    if (!existsSync(manifestPath)) {
      continue;
    }

    const content = readFileSync(manifestPath, "utf8");
    const matches = content.match(VERSION_LINE_PATTERN) ?? [];
    // Ambiguous manifests fail before release automation rewrites content.
    if (matches.length !== 1) {
      throw new Error(`${manifestPath} must contain exactly one top-level version field`);
    }

    const versionedContent = content
      // Align package identity with the root release.
      .replace(VERSION_LINE_PATTERN, `version: "${newVersion}"`)
      // Keep explicitly managed internal dependencies on the same release tag.
      .replace(RELEASE_MANAGED_REF_PATTERN, `$1v${newVersion}$2`);
    writeFileSync(manifestPath, versionedContent, "utf8");
    updatedPackages.push(packageName);
  }

  return updatedPackages;
}
