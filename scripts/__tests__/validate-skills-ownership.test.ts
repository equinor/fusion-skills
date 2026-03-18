import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateSkillOwnership } from "../validate-skills-ownership/index";

function createSkill(
  rootDir: string,
  skillName: string,
  metadataBlock: string,
): { skillDir: string; skillName: string } {
  const skillDir = join(rootDir, skillName);
  mkdirSync(skillDir, { recursive: true });
  const skillMarkdown = `---
name: ${skillName}
description: test skill
metadata:
${metadataBlock}
---
`;
  writeFileSync(join(skillDir, "SKILL.md"), skillMarkdown, "utf8");
  return { skillDir, skillName };
}

describe("validate-skills-ownership", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const tempDir of tempDirs) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  describe("validation logic", () => {
    it("passes with valid metadata", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-valid",
        '  owner: "@equinor/fusion-core"\n  status: "active"',
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("fails when owner is missing", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(repoRoot, "fusion-missing-owner", '  status: "active"');

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(`${skill.skillName}: Missing required metadata.owner`);
    });

    it("fails when status is missing", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(repoRoot, "fusion-missing-status", '  owner: "@user"');

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(`${skill.skillName}: Missing required metadata.status`);
    });

    it("fails with invalid status", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-invalid-status",
        '  owner: "@user"\n  status: "unknown"',
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid status "unknown"');
    });

    it("fails with invalid owner format", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-invalid-owner",
        '  owner: "not-an-identity"\n  status: "active"',
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid owner format");
    });

    it("fails with owner format containing too many path segments", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-invalid-owner-segments",
        '  owner: "@org/team/extra"\n  status: "active"',
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid owner format");
    });
  });

  describe("frontmatter parsing integration", () => {
    it("accepts metadata values wrapped in single quotes", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-single-quoted",
        "  owner: '@equinor/fusion-core'\n  status: 'experimental'",
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("deprecated_at validation", () => {
    it("fails when deprecated skill in .deprecated/ is missing deprecated_at", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skillDir = join(repoRoot, ".deprecated", "fusion-old-skill");
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(
        join(skillDir, "SKILL.md"),
        `---
name: fusion-old-skill
description: test
metadata:
  owner: "@equinor/fusion-core"
  status: deprecated
  successor: fusion-new-skill
---
`,
        "utf8",
      );

      const result = validateSkillOwnership(skillDir, "fusion-old-skill");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Missing required metadata.deprecated_at");
    });

    it("fails with invalid deprecated_at format", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skillDir = join(repoRoot, ".deprecated", "fusion-bad-date");
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(
        join(skillDir, "SKILL.md"),
        `---
name: fusion-bad-date
description: test
metadata:
  owner: "@equinor/fusion-core"
  status: deprecated
  deprecated_at: "March 2026"
---
`,
        "utf8",
      );

      const result = validateSkillOwnership(skillDir, "fusion-bad-date");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid metadata.deprecated_at");
    });

    it("passes with valid deprecated_at in .deprecated/", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skillDir = join(repoRoot, ".deprecated", "fusion-good-date");
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(
        join(skillDir, "SKILL.md"),
        `---
name: fusion-good-date
description: test
metadata:
  owner: "@equinor/fusion-core"
  status: deprecated
  deprecated_at: "2026-03-18"
---
`,
        "utf8",
      );

      const result = validateSkillOwnership(skillDir, "fusion-good-date");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("does not require deprecated_at for deprecated skill outside .deprecated/", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-ownership-"));
      tempDirs.push(repoRoot);

      const skill = createSkill(
        repoRoot,
        "fusion-deprecated-not-moved",
        '  owner: "@equinor/fusion-core"\n  status: deprecated',
      );

      const result = validateSkillOwnership(skill.skillDir, skill.skillName);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
