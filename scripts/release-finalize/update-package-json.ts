import { readFileSync, writeFileSync } from "node:fs";
import type { BumpType } from "./semver";
import { bumpSemver } from "./semver";

/**
 * Bumps package.json version and writes file.
 */
export function updatePackageVersion(packageJsonPath: string, bump: BumpType): string {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
  if (!pkg.version) throw new Error("package.json is missing version");

  const nextVersion = bumpSemver(pkg.version, bump);
  pkg.version = nextVersion;

  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return nextVersion;
}
