import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { updateApmPackageVersions } from "../release-prepare/update-apm-package-versions";

const testRoots: string[] = [];

afterEach(() => {
  // Remove every temporary repository created by the completed test.
  for (const testRoot of testRoots.splice(0)) {
    rmSync(testRoot, { recursive: true, force: true });
  }
});

describe("updateApmPackageVersions", () => {
  it("updates package manifests without changing other fields", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "fusion-skills-apm-versions-"));
    testRoots.push(repoRoot);
    const appDir = join(repoRoot, "apm", "app");
    const servicesDir = join(repoRoot, "apm", "services");
    mkdirSync(appDir, { recursive: true });
    mkdirSync(servicesDir, { recursive: true });
    writeFileSync(
      join(appDir, "apm.yml"),
      'name: app\nversion: "1.0.0"\ndependencies:\n  apm:\n    - git: equinor/fusion-skills\n      ref: v1.0.0 # release-managed\n',
    );
    writeFileSync(
      join(servicesDir, "apm.yml"),
      "name: services\nversion: 1.0.0\ndependencies:\n  apm:\n    - git: external/toolkit\n      ref: v4.2.0\n",
    );

    expect(updateApmPackageVersions(repoRoot, "1.1.0")).toEqual(["app", "services"]);
    expect(readFileSync(join(appDir, "apm.yml"), "utf8")).toBe(
      'name: app\nversion: "1.1.0"\ndependencies:\n  apm:\n    - git: equinor/fusion-skills\n      ref: v1.1.0 # release-managed\n',
    );
    expect(readFileSync(join(servicesDir, "apm.yml"), "utf8")).toBe(
      'name: services\nversion: "1.1.0"\ndependencies:\n  apm:\n    - git: external/toolkit\n      ref: v4.2.0\n',
    );
  });

  it("rejects manifests without one top-level version", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "fusion-skills-apm-versions-"));
    testRoots.push(repoRoot);
    const packageDir = join(repoRoot, "apm", "invalid");
    mkdirSync(packageDir, { recursive: true });
    writeFileSync(join(packageDir, "apm.yml"), "name: invalid\n");

    expect(() => updateApmPackageVersions(repoRoot, "1.1.0")).toThrow(
      "must contain exactly one top-level version field",
    );
  });
});
