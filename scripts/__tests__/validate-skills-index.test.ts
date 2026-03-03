import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractCliSkillIds } from "../validate-skills/extract-cli-skill-ids";
import { findCompanionSkillMetadataEntries } from "../validate-skills/find-companion-skill-metadata-entries";
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
