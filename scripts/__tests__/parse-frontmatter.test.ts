import { describe, expect, it } from "bun:test";
import { parseFrontmatter } from "../list-skills/parse-frontmatter";

describe("parseFrontmatter", () => {
  it("preserves # inside quoted strings", () => {
    const frontmatter = [
      "name: fusion-issue-solving",
      'description: \'Handles prompts like "solve #123", "work on #123".\'',
      "metadata:",
      '  version: "0.1.4"',
    ].join("\n");

    const parsed = parseFrontmatter(frontmatter);

    expect(parsed.name).toBe("fusion-issue-solving");
    expect(parsed.description).toBe('Handles prompts like "solve #123", "work on #123".');
    expect(parsed["metadata.version"]).toBe("0.1.4");
  });

  it("strips unquoted inline comments", () => {
    const frontmatter = [
      "name: fusion-test # remove this comment",
      "metadata:",
      '  owner: "@equinor/fusion-core" # owner team',
    ].join("\n");

    const parsed = parseFrontmatter(frontmatter);

    expect(parsed.name).toBe("fusion-test");
    expect(parsed["metadata.owner"]).toBe("@equinor/fusion-core");
  });
});
