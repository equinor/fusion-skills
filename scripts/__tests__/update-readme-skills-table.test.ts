import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { updateReadmeSkillsTable } from "../release-prepare/update-readme-skills-table";

function writeSkill(
  repoRoot: string,
  skillDirName: string,
  name: string,
  description: string,
  version: string,
  status?: string,
): void {
  const skillDir = join(repoRoot, "skills", skillDirName);
  mkdirSync(skillDir, { recursive: true });
  const metadataLines = [`  version: "${version}"`];
  if (status) {
    metadataLines.push(`  status: ${status}`);
  }
  writeFileSync(
    join(skillDir, "SKILL.md"),
    [
      "---",
      `name: ${name}`,
      `description: ${description}`,
      "metadata:",
      ...metadataLines,
      "---",
      "",
      "# Skill",
      "",
    ].join("\n"),
    "utf8",
  );
}

describe("updateReadmeSkillsTable", () => {
  it("rebuilds README skills list from discovered SKILL.md files", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "fusion-skills-"));

    try {
      mkdirSync(join(repoRoot, "skills"), { recursive: true });
      writeFileSync(
        join(repoRoot, "README.md"),
        [
          "# Test README",
          "",
          "## Skills",
          "<!-- skills-table:start -->",
          "| stale | stale | stale |",
          "<!-- skills-table:end -->",
          "",
        ].join("\n"),
        "utf8",
      );

      writeSkill(
        repoRoot,
        "fusion-z-skill",
        "fusion-z-skill",
        "Handles Z flow \\ with pipe | carefully.",
        "1.2.3",
      );
      writeSkill(repoRoot, "fusion-a-skill", "fusion-a-skill", "Handles A flow.", "0.2.0");
      writeSkill(
        repoRoot,
        ".experimental/fusion-preview-skill",
        "fusion-preview-skill",
        "Preview flow.",
        "0.1.0",
      );
      writeSkill(
        repoRoot,
        ".curated/fusion-curated-skill",
        "fusion-curated-skill",
        "Curated flow.",
        "0.1.0",
      );
      writeSkill(
        repoRoot,
        ".system/fusion-system-skill",
        "fusion-system-skill",
        "System flow.",
        "0.1.0",
      );

      const count = updateReadmeSkillsTable(repoRoot);
      const readme = readFileSync(join(repoRoot, "README.md"), "utf8");

      expect(count).toBe(5);
      expect(readme).not.toContain("| Skill | Description |");
      expect(readme).toContain(
        "**👍 [`fusion-a-skill@0.2.0`](skills/fusion-a-skill/SKILL.md)**\n\nHandles A flow.",
      );
      expect(readme).toContain(
        "**👌 [`fusion-curated-skill@0.1.0`](skills/.curated/fusion-curated-skill/SKILL.md)**\n\nCurated flow.",
      );
      expect(readme).toContain(
        "**🧪 [`fusion-preview-skill@0.1.0`](skills/.experimental/fusion-preview-skill/SKILL.md)**\n\nPreview flow.",
      );
      expect(readme).toContain(
        "**⚙️ [`fusion-system-skill@0.1.0`](skills/.system/fusion-system-skill/SKILL.md)**\n\nSystem flow.",
      );
      expect(readme).toContain(
        "**👍 [`fusion-z-skill@1.2.3`](skills/fusion-z-skill/SKILL.md)**\n\nHandles Z flow \\\\ with pipe \\| carefully.",
      );
      expect(readme).toContain("\n\n---\n\n");

      const aIndex = readme.indexOf("fusion-a-skill");
      const zIndex = readme.indexOf("fusion-z-skill");
      expect(aIndex).toBeGreaterThan(-1);
      expect(zIndex).toBeGreaterThan(-1);
      expect(aIndex).toBeLessThan(zIndex);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("excludes deprecated and archived skills from the list", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "fusion-skills-"));

    try {
      mkdirSync(join(repoRoot, "skills"), { recursive: true });
      writeFileSync(
        join(repoRoot, "README.md"),
        [
          "# Test README",
          "",
          "## Skills",
          "<!-- skills-table:start -->",
          "| stale |",
          "<!-- skills-table:end -->",
          "",
        ].join("\n"),
        "utf8",
      );

      writeSkill(repoRoot, "fusion-active-skill", "fusion-active-skill", "Active.", "1.0.0");
      writeSkill(
        repoRoot,
        "fusion-old-skill",
        "fusion-old-skill",
        "Old deprecated skill.",
        "2.0.0",
        "deprecated",
      );
      writeSkill(
        repoRoot,
        "fusion-gone-skill",
        "fusion-gone-skill",
        "Archived skill.",
        "3.0.0",
        "archived",
      );

      const count = updateReadmeSkillsTable(repoRoot);
      const readme = readFileSync(join(repoRoot, "README.md"), "utf8");

      expect(count).toBe(1);
      expect(readme).toContain("fusion-active-skill");
      expect(readme).not.toContain("fusion-old-skill");
      expect(readme).not.toContain("fusion-gone-skill");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
