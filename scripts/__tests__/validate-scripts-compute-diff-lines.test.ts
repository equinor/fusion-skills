import { describe, expect, it } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { computeDiffLineMap } from "../validate-scripts/compute-diff-lines";

function runGit(repoRoot: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

describe("computeDiffLineMap", () => {
  it("extracts changed line ranges for modified files", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "fusion-skills-diff-lines-"));

    try {
      runGit(tempRoot, ["init"]);
      runGit(tempRoot, ["config", "user.name", "Test User"]);
      runGit(tempRoot, ["config", "user.email", "test@example.com"]);

      const scriptsDir = join(tempRoot, "scripts");
      mkdirSync(scriptsDir, { recursive: true });

      const filePath = join(scriptsDir, "example.ts");
      writeFileSync(filePath, "line1\nline2\nline3\nline4\n", "utf8");
      runGit(tempRoot, ["add", "."]);
      runGit(tempRoot, ["commit", "-m", "initial"]);

      const baseRef = runGit(tempRoot, ["rev-parse", "HEAD"]);

      writeFileSync(filePath, "line1\nline2-updated\nline3\nline4\nline5-added\n", "utf8");
      runGit(tempRoot, ["add", "."]);
      runGit(tempRoot, ["commit", "-m", "update"]);

      const lineMap = computeDiffLineMap(tempRoot, baseRef);
      const ranges = lineMap["scripts/example.ts"];
      const includesLine = (line: number): boolean =>
        // Check each captured range to assert expected changed-line membership.
        (ranges ?? []).some((range) => line >= range.start && line <= range.end);

      expect(ranges).toBeDefined();
      expect(includesLine(2)).toBe(true);
      expect(includesLine(5)).toBe(true);
      expect(includesLine(1)).toBe(false);
      expect(includesLine(3)).toBe(false);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("returns an empty map when git diff fails", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "fusion-skills-diff-lines-"));

    try {
      runGit(tempRoot, ["init"]);
      const lineMap = computeDiffLineMap(tempRoot, "does-not-exist");
      expect(lineMap).toEqual({});
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
