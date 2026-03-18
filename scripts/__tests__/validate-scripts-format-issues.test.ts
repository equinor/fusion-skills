import { describe, expect, it } from "bun:test";
import { formatIntentCommentIssues } from "../validate-scripts/format-intent-comment-issues";

describe("formatIntentCommentIssues", () => {
  it("includes a fix hint for missing-regex-explanation issues", () => {
    const issues = [
      {
        filePath: "/repo/scripts/example.ts",
        line: 10,
        code: "missing-regex-explanation" as const,
        statement: "const match = input.match(/pattern/);",
      },
    ];

    const lines = formatIntentCommentIssues(issues, "/repo");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("missing-regex-explanation");
    expect(lines[0]).toContain("Fix:");
    expect(lines[0]).toContain("regex");
  });

  it("includes a fix hint for missing-intent-comment issues", () => {
    const issues = [
      {
        filePath: "/repo/scripts/example.ts",
        line: 5,
        code: "missing-intent-comment" as const,
        statement: "if (value > 0) {",
      },
    ];

    const lines = formatIntentCommentIssues(issues, "/repo");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("missing-intent-comment");
    expect(lines[0]).toContain("Fix:");
  });

  it("includes a fix hint for disallowed-while-loop issues", () => {
    const issues = [
      {
        filePath: "/repo/scripts/example.ts",
        line: 3,
        code: "disallowed-while-loop" as const,
        statement: "while (index < values.length) {",
      },
    ];

    const lines = formatIntentCommentIssues(issues, "/repo");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("Fix:");
    expect(lines[0]).toContain("while");
  });
});
