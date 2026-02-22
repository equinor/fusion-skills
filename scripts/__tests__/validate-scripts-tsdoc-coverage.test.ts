import { describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectFileTSDocCoverageIssues } from "../validate-scripts/collect-file-tsdoc-coverage-issues";
import { collectTSDocCoverageIssuesForFiles } from "../validate-scripts/collect-tsdoc-coverage-issues-for-files";

describe("collectFileTSDocCoverageIssues", () => {
  it("returns no issues when function TSDoc coverage is complete", () => {
    const source = `
/**
 * Adds two numbers.
 *
 * @param left - Left operand.
 * @param right - Right operand.
 * @returns Sum of both operands.
 */
export function add(left: number, right: number): number {
  return left + right;
}
`;

    const issues = collectFileTSDocCoverageIssues(source, "/repo/scripts/example.ts");
    expect(issues).toEqual([]);
  });

  it("reports missing @param and @returns tags", () => {
    const source = `
/**
 * Computes value.
 */
export function compute(input: string): string {
  return input.trim();
}
`;

    const issues = collectFileTSDocCoverageIssues(source, "/repo/scripts/example.ts");
    expect(issues).toHaveLength(1);
    expect(issues[0]?.missing).toEqual(["param:input", "returns"]);
  });

  it("reports missing doc block", () => {
    const source = `
function internal(value: number): number {
  return value;
}
`;

    const issues = collectFileTSDocCoverageIssues(source, "/repo/scripts/example.ts");
    expect(issues).toHaveLength(1);
    expect(issues[0]?.missing).toEqual(["doc"]);
  });

  it("validates only provided file paths", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "fusion-skills-validate-scripts-"));
    const documentedFile = join(tempRoot, "documented.ts");
    const undocumentedFile = join(tempRoot, "undocumented.ts");

    writeFileSync(
      documentedFile,
      `
/**
 * Adds two numbers.
 *
 * @param left - Left operand.
 * @param right - Right operand.
 * @returns Sum.
 */
export function add(left: number, right: number): number {
  return left + right;
}
`,
      "utf8",
    );

    writeFileSync(
      undocumentedFile,
      `
export function trim(value: string): string {
  return value.trim();
}
`,
      "utf8",
    );

    try {
      const issues = collectTSDocCoverageIssuesForFiles([undocumentedFile]);
      expect(issues).toHaveLength(1);
      expect(issues[0]?.filePath).toBe(undocumentedFile);
      expect(issues[0]?.missing).toEqual(["doc"]);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
