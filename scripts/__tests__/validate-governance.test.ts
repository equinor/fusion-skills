import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractGovernanceRefs } from "../validate-governance/extract-governance-refs";
import { validateGovernanceRefs } from "../validate-governance/validate-governance-refs";

function createSkillWithContent(
  rootDir: string,
  skillName: string,
  body: string,
): { skillDir: string; skillName: string } {
  const skillDir = join(rootDir, "skills", skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, "SKILL.md"), body, "utf8");
  return { skillDir, skillName };
}

describe("validate-governance", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const tempDir of tempDirs) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  describe("extractGovernanceRefs", () => {
    it("extracts Markdown link targets referencing .github/", () => {
      const content =
        "See [workflow](.github/instructions/pr-workflow.instructions.md) for guidance.";
      const refs = extractGovernanceRefs(content);
      expect(refs).toContain(".github/instructions/pr-workflow.instructions.md");
    });

    it("extracts backtick-quoted references to contribute/", () => {
      const content = "Follow `contribute/greenkeeping.md` for maintenance.";
      const refs = extractGovernanceRefs(content);
      expect(refs).toContain("contribute/greenkeeping.md");
    });

    it("extracts backtick-quoted references to CONTRIBUTING.md", () => {
      const content = "See `CONTRIBUTING.md` before submitting.";
      const refs = extractGovernanceRefs(content);
      expect(refs).toContain("CONTRIBUTING.md");
    });

    it("extracts both link and backtick refs from the same content", () => {
      const content = ["See [rules](.github/instructions/foo.md) and `contribute/bar.md`."].join(
        "\n",
      );
      const refs = extractGovernanceRefs(content);
      expect(refs).toHaveLength(2);
      expect(refs).toContain(".github/instructions/foo.md");
      expect(refs).toContain("contribute/bar.md");
    });

    it("deduplicates identical references", () => {
      const content = ["See `contribute/foo.md` and also `contribute/foo.md` again."].join("\n");
      const refs = extractGovernanceRefs(content);
      expect(refs).toHaveLength(1);
    });

    it("returns empty array when no governance refs exist", () => {
      const content = "This skill has no governance references at all.";
      const refs = extractGovernanceRefs(content);
      expect(refs).toHaveLength(0);
    });
  });

  describe("validateGovernanceRefs", () => {
    it("passes when governance references resolve to existing files", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-gov-"));
      tempDirs.push(repoRoot);

      // Create the referenced governance file.
      mkdirSync(join(repoRoot, ".github", "instructions"), { recursive: true });
      writeFileSync(
        join(repoRoot, ".github", "instructions", "pr-workflow.instructions.md"),
        "# PR workflow",
        "utf8",
      );

      const skill = createSkillWithContent(
        repoRoot,
        "test-skill",
        "See `.github/instructions/pr-workflow.instructions.md` for guidance.",
      );

      const result = validateGovernanceRefs(skill.skillDir, skill.skillName, repoRoot);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("fails when governance references point to missing files", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-gov-"));
      tempDirs.push(repoRoot);

      const skill = createSkillWithContent(
        repoRoot,
        "broken-skill",
        "See `.github/instructions/nonexistent.instructions.md` for guidance.",
      );

      const result = validateGovernanceRefs(skill.skillDir, skill.skillName, repoRoot);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("broken governance reference");
      expect(result.errors[0]).toContain("nonexistent.instructions.md");
    });

    it("passes when no governance references exist", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-gov-"));
      tempDirs.push(repoRoot);

      const skill = createSkillWithContent(
        repoRoot,
        "clean-skill",
        "This skill has no governance references.",
      );

      const result = validateGovernanceRefs(skill.skillDir, skill.skillName, repoRoot);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("handles Markdown link governance references", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-gov-"));
      tempDirs.push(repoRoot);

      const skill = createSkillWithContent(
        repoRoot,
        "link-skill",
        "See [contributing](CONTRIBUTING.md) for the rules.",
      );

      // CONTRIBUTING.md does not exist, so this should fail.
      const result = validateGovernanceRefs(skill.skillDir, skill.skillName, repoRoot);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("CONTRIBUTING.md");
    });

    it("resolves relative references from skill directory", () => {
      const repoRoot = mkdtempSync(join(tmpdir(), "validate-gov-"));
      tempDirs.push(repoRoot);

      // Create the governance file at repo root.
      writeFileSync(join(repoRoot, "CONTRIBUTING.md"), "# Contributing", "utf8");

      const skill = createSkillWithContent(
        repoRoot,
        "relative-skill",
        "See [rules](../../CONTRIBUTING.md) for guidelines.",
      );

      const result = validateGovernanceRefs(skill.skillDir, skill.skillName, repoRoot);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
