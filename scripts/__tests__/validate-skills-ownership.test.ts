import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isValidGitHubIdentity, validateSkillOwnership } from "../validate-skills-ownership/index";

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

  describe("isValidGitHubIdentity", () => {
    it("accepts valid user identities", () => {
      expect(isValidGitHubIdentity("@user")).toBe(true);
      expect(isValidGitHubIdentity("@user-name")).toBe(true);
      expect(isValidGitHubIdentity("@user123")).toBe(true);
      expect(isValidGitHubIdentity("@u")).toBe(true);
    });

    it("accepts valid team identities", () => {
      expect(isValidGitHubIdentity("@org/team")).toBe(true);
      expect(isValidGitHubIdentity("@org/team-name")).toBe(true);
      expect(isValidGitHubIdentity("@equinor/fusion-core")).toBe(true);
    });

    it("rejects invalid formats", () => {
      expect(isValidGitHubIdentity("user")).toBe(false); // missing @
      expect(isValidGitHubIdentity("@")).toBe(false); // empty user
      expect(isValidGitHubIdentity("@user/")).toBe(false); // empty team
      expect(isValidGitHubIdentity("@user/team/extra")).toBe(false); // too many segments
      expect(isValidGitHubIdentity("@-user")).toBe(false); // starts with hyphen
      expect(isValidGitHubIdentity("@user-")).toBe(false); // ends with hyphen
      expect(isValidGitHubIdentity("@org/team-")).toBe(false); // team ends with hyphen
      expect(
        isValidGitHubIdentity(
          "@very-long-user-name-that-exceeds-the-thirty-nine-character-limit-imposed-by-github",
        ),
      ).toBe(false);
    });

    it("is case-insensitive", () => {
      expect(isValidGitHubIdentity("@Equinor/Fusion-Core")).toBe(true);
    });
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
});
