import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverLocalSkills } from "../validate-skills/discover-local-skills";
import { extractCliSkillIds } from "../validate-skills/extract-cli-skill-ids";
import { findCompanionSkillMetadataEntries } from "../validate-skills/find-companion-skill-metadata-entries";
import { findListedApmManagedSkills } from "../validate-skills/find-listed-apm-managed-skills";
import { getSkillIdFromDir } from "../validate-skills/get-skill-id-from-dir";

describe("validate-skills index helpers", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const tempDir of tempDirs) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("infers skill id from visible and hidden skill directories", () => {
    expect(getSkillIdFromDir("skills/fusion-alpha")).toBe("fusion-alpha");
    expect(getSkillIdFromDir("skills/.experimental/fusion-beta")).toBe("fusion-beta");
    expect(getSkillIdFromDir("skills/.curated/fusion-gamma")).toBe("fusion-gamma");
  });

  it("discovers catalog skills from all skills lanes without local agent installs", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-skills-"));
    tempDirs.push(repoRoot);

    const skillDirs = [
      "skills/fusion-visible",
      "skills/.deprecated/fusion-legacy",
      "skills/.experimental/fusion-preview",
      "skills/.system/fusion-support",
      ".agents/skills/custom-local-only",
    ];

    for (const skillDir of skillDirs) {
      mkdirSync(join(repoRoot, skillDir), { recursive: true });
      writeFileSync(join(repoRoot, skillDir, "SKILL.md"), "---\nname: test\n---\n", "utf8");
    }

    expect(discoverLocalSkills(repoRoot)).toEqual([
      "skills/.deprecated/fusion-legacy",
      "skills/.experimental/fusion-preview",
      "skills/.system/fusion-support",
      "skills/fusion-visible",
    ]);
  });

  it("extracts skill ids from representative CLI output lines", () => {
    const cliOutput = [
      "✔ Added skill fusion-core-routing",
      "some unrelated line",
      "\u001b[32mregistered\u001b[0m custom-my-helper",
      "fusion-not-captured-in-middle extra tokens",
      "- fusion-task-planner",
    ].join("\n");

    const extracted = extractCliSkillIds(cliOutput);

    expect(Array.from(extracted).sort()).toEqual([
      "custom-my-helper",
      "fusion-core-routing",
      "fusion-task-planner",
    ]);
  });

  it("finds CLI-listed skills materialized by the root APM lockfile", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-skills-"));
    tempDirs.push(repoRoot);

    writeFileSync(
      join(repoRoot, "apm.lock.yaml"),
      `dependencies:
  - name: caveman-compress
    deployed_files:
      - .agents/skills/caveman-compress
      - .agents/skills/caveman-compress/SKILL.md
      - .agents/skills/caveman-compress/scripts/validate.py
  - name: not-listed
    deployed_files:
      - .agents/skills/not-listed/SKILL.md
`,
      "utf8",
    );

    const cliOutput = [
      "◇  Found 30 skills",
      "│    fusion-core-routing",
      "│      A description that mentions caveman-compress.",
      "\u001b[32m│    caveman-compress\u001b[0m",
    ].join("\n");

    expect(findListedApmManagedSkills(repoRoot, cliOutput)).toEqual(["caveman-compress"]);
  });

  it("does not infer managed installs without an APM lockfile", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-skills-"));
    tempDirs.push(repoRoot);

    expect(findListedApmManagedSkills(repoRoot, "│    caveman-compress")).toEqual([]);
  });

  it("rejects a relative repository root when reconciling APM installs", () => {
    expect(() => findListedApmManagedSkills(".", "│    caveman-compress")).toThrow(
      "Repository root must be an absolute path.",
    );
  });

  it("finds companion metadata.skills entries excluded by CLI", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-skills-"));
    tempDirs.push(repoRoot);

    const companionDir = "skills/.experimental/fusion-companion";
    const regularDir = "skills/fusion-regular";

    mkdirSync(join(repoRoot, companionDir), { recursive: true });
    mkdirSync(join(repoRoot, regularDir), { recursive: true });

    writeFileSync(
      join(repoRoot, companionDir, "SKILL.md"),
      `---
name: fusion-companion
description: companion skill
metadata:
  version: "0.1.0"
  skills:
    - fusion-regular
---
`,
      "utf8",
    );

    writeFileSync(
      join(repoRoot, regularDir, "SKILL.md"),
      `---
name: fusion-regular
description: regular skill
metadata:
  version: "0.1.0"
---
`,
      "utf8",
    );

    const excluded = findCompanionSkillMetadataEntries(
      repoRoot,
      [companionDir, regularDir],
      new Set(["fusion-regular"]),
    );

    expect(excluded).toEqual([companionDir]);
  });
});
