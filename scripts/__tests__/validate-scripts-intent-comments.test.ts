import { describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  collectFileIntentCommentIssues,
  collectIntentCommentIssuesForFiles,
} from "../validate-scripts/check-intent-comments";

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
