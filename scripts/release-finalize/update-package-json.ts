import { readFileSync, writeFileSync } from "node:fs";
import { bumpSemver } from "./bump-semver";
import type { BumpType } from "./semver";

/**
 * Bumps package.json version and writes file.
 *
 * @param packageJsonPath - Absolute path to package.json.
 * @param bump - Semantic bump level to apply.
 * @returns Newly written package version.
 */
export function updatePackageVersion(packageJsonPath: string, bump: BumpType): string {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
  // Fail fast here so the remaining logic can assume valid input.
  if (!pkg.version) throw new Error("package.json is missing version");

  const nextVersion = bumpSemver(pkg.version, bump);
  pkg.version = nextVersion;

  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return nextVersion;
}
