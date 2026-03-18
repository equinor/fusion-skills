import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkSkillSizes } from "../validate-skills/check-skill-sizes";

const generateLines = (lineCount: number): string =>
  Array.from({ length: lineCount }, () => "line").join("\n");

describe("checkSkillSizes", () => {
  it("reports no findings for SKILL.md files under 300 lines", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const skillDir = join(tempRoot, "skills", "test-skill");
    mkdirSync(skillDir, { recursive: true });
    // Generate a SKILL.md with 100 lines (well under the warning threshold).
    writeFileSync(join(skillDir, "SKILL.md"), generateLines(100), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(0);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("reports a warning for SKILL.md files between 300 and 499 lines", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const skillDir = join(tempRoot, "skills", "test-skill");
    mkdirSync(skillDir, { recursive: true });
    // Generate a SKILL.md with 350 lines (above warning, below error).
    writeFileSync(join(skillDir, "SKILL.md"), generateLines(350), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(1);
      expect(findings[0]?.level).toBe("warning");
      expect(findings[0]?.lineCount).toBe(350);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("reports a warning for SKILL.md files with exactly 300 lines", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const skillDir = join(tempRoot, "skills", "boundary-warning-skill");
    mkdirSync(skillDir, { recursive: true });
    // Generate a SKILL.md with exactly 300 lines (warning threshold).
    writeFileSync(join(skillDir, "SKILL.md"), generateLines(300), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(1);
      expect(findings[0]?.level).toBe("warning");
      expect(findings[0]?.lineCount).toBe(300);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("reports an error for SKILL.md files with 500 or more lines", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const skillDir = join(tempRoot, "skills", "test-skill");
    mkdirSync(skillDir, { recursive: true });
    // Generate a SKILL.md with 600 lines (above error threshold).
    writeFileSync(join(skillDir, "SKILL.md"), generateLines(600), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(1);
      expect(findings[0]?.level).toBe("error");
      expect(findings[0]?.lineCount).toBe(600);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("reports an error for SKILL.md files with exactly 500 lines", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const skillDir = join(tempRoot, "skills", "boundary-error-skill");
    mkdirSync(skillDir, { recursive: true });
    // Generate a SKILL.md with exactly 500 lines (error threshold).
    writeFileSync(join(skillDir, "SKILL.md"), generateLines(500), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(1);
      expect(findings[0]?.level).toBe("error");
      expect(findings[0]?.lineCount).toBe(500);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("sorts errors before warnings", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "skill-sizes-"));
    const warnDir = join(tempRoot, "skills", "a-warn-skill");
    const errorDir = join(tempRoot, "skills", "b-error-skill");
    mkdirSync(warnDir, { recursive: true });
    mkdirSync(errorDir, { recursive: true });
    // Warning-level file (350 lines).
    writeFileSync(join(warnDir, "SKILL.md"), generateLines(350), "utf8");
    // Error-level file (600 lines).
    writeFileSync(join(errorDir, "SKILL.md"), generateLines(600), "utf8");

    try {
      const findings = checkSkillSizes(tempRoot);
      expect(findings).toHaveLength(2);
      expect(findings[0]?.level).toBe("error");
      expect(findings[1]?.level).toBe("warning");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
