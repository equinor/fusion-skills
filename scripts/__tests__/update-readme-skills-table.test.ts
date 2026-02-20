import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { updateReadmeSkillsTable } from "../release-prepare/update-readme-skills-table";

function writeSkill(
  repoRoot: string,
  skillDirName: string,
  name: string,
  description: string,
  version: string,
): void {
  const skillDir = join(repoRoot, "skills", skillDirName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, "SKILL.md"),
    [
      "---",
      `name: ${name}`,
      `description: ${description}`,
      "metadata:",
      `  version: "${version}"`,
      "---",
      "",
      "# Skill",
      "",
    ].join("\n"),
    "utf8",
  );
}

describe("updateReadmeSkillsTable", () => {
  it("rebuilds README skills table from discovered SKILL.md files", () => {
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

      const count = updateReadmeSkillsTable(repoRoot);
      const readme = readFileSync(join(repoRoot, "README.md"), "utf8");

      expect(count).toBe(2);
      expect(readme).toContain("| Skill | Description | Version |");
      expect(readme).toContain(
        "| [`fusion-a-skill`](skills/fusion-a-skill/SKILL.md) | Handles A flow. | `0.2.0` |",
      );
      expect(readme).toContain(
        "| [`fusion-z-skill`](skills/fusion-z-skill/SKILL.md) | Handles Z flow \\\\ with pipe \\| carefully. | `1.2.3` |",
      );

      const aIndex = readme.indexOf("fusion-a-skill");
      const zIndex = readme.indexOf("fusion-z-skill");
      expect(aIndex).toBeGreaterThan(-1);
      expect(zIndex).toBeGreaterThan(-1);
      expect(aIndex).toBeLessThan(zIndex);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
