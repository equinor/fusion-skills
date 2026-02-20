import { describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectFileIntentCommentIssues } from "../validate-scripts/check-intent-comments";
import { collectIntentCommentIssuesForFiles } from "../validate-scripts/collect-intent-comment-issues-for-files";

describe("collectFileIntentCommentIssues", () => {
  it("passes when intent comments exist before control-flow lines", () => {
    const source = `
// Validate only positive values.
if (value > 0) {
  // Iterate all items to normalize values.
  for (const item of items) {
    // Transform each line into trimmed text.
    const normalized = lines.map((line) => line.trim());
    return normalized;
  }
}
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues).toEqual([]);
  });

  it("reports missing comments for control-flow and iterator lines", () => {
    const source = `
if (value > 0) {
  const normalized = lines.map((line) => line.trim());
  return normalized;
}
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues).toHaveLength(2);
    expect(issues[0]?.statement).toContain("if (value > 0)");
    expect(issues[1]?.statement).toContain(".map(");
  });

  it("rejects while loops", () => {
    const source = `
// Keep scanning while values are present.
while (index < values.length) {
  index += 1;
}
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "disallowed-while-loop")).toBe(true);
  });

  it("rejects let declarations", () => {
    const source = `
let value = 1;
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "disallowed-let-declaration")).toBe(true);
  });

  it("rejects files with more than one exported function declaration", () => {
    const source = `
export function first(): void {}
export function second(): void {}
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "disallowed-multiple-exported-functions")).toBe(
      true,
    );
  });

  it("allows files with a single exported function declaration", () => {
    const source = `
export function onlyOne(): void {}
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "disallowed-multiple-exported-functions")).toBe(
      false,
    );
  });

  it("requires a regex explanation comment above regex literals", () => {
    const source = `
const match = input.match(/Found[^0-9]*([0-9]+)/i);
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "missing-regex-explanation")).toBe(true);
  });

  it("accepts regex literals when a regex explanation comment is present", () => {
    const source = `
// This regex extracts the numeric count from the CLI output line.
const match = input.match(/Found[^0-9]*([0-9]+)/i);
`;

    const issues = collectFileIntentCommentIssues(source, "/repo/scripts/example.ts");
    expect(issues.some((issue) => issue.code === "missing-regex-explanation")).toBe(false);
  });

  it("validates only provided file paths", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "fusion-skills-validate-intent-"));
    const checkedFile = join(tempRoot, "checked.ts");
    const ignoredFile = join(tempRoot, "ignored.ts");

    writeFileSync(
      checkedFile,
      `
if (value > 0) {
  return value;
}
`,
      "utf8",
    );

    writeFileSync(
      ignoredFile,
      `
if (value > 0) {
  return value;
}
`,
      "utf8",
    );

    try {
      const issues = collectIntentCommentIssuesForFiles([checkedFile]);
      expect(issues).toHaveLength(1);
      expect(issues[0]?.filePath).toBe(checkedFile);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
