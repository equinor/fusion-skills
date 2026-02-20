import { describe, expect, it } from "bun:test";
import {
  type GroupedRootReleaseNotes,
  renderRootReleaseNotes,
} from "../release-prepare/root-release-notes-format";

describe("renderRootReleaseNotes", () => {
  it("renders only non-empty semver headings and keeps separators between entries only", () => {
    const notes: GroupedRootReleaseNotes = {
      major: [],
      minor: [
        {
          bumpType: "minor",
          body: [
            "Adds structured frontmatter metadata for discoverability and clarifies skill relationship semantics:",
            "",
            "Scope delivered:",
            "- Added metadata tags.",
          ].join("\n"),
          prNumber: "10",
          commitSha: "d4737239be54736e344d74be4ce8271b9be84313",
          packages: ["fusion-issue-authoring@0.1.0", "fusion-skill-authoring@0.2.0"],
        },
        {
          bumpType: "minor",
          body: "Updates defaults and metadata constraints",
          prNumber: "7",
          commitSha: "2194e7a99f6055dd394dffca6e0e6286d3bb2d41",
          packages: ["fusion-skill-authoring@0.2.0"],
        },
      ],
      patch: [],
    };

    const output = renderRootReleaseNotes(notes, "equinor/fusion-skills").join("\n");

    expect(output).toContain("### Minor");
    expect(output).not.toContain("### Major");
    expect(output).not.toContain("### Patch");

    expect(output).toContain(
      "__🎯 [Adds structured frontmatter metadata for discoverability and clarifies skill relationship semantics #10](https://github.com/equinor/fusion-skills/pull/10)<br/>",
    );
    expect(output).toContain(
      "🗂️ [d473723](https://github.com/equinor/fusion-skills/commit/d4737239be54736e344d74be4ce8271b9be84313)<br/>",
    );
    expect(output).toContain("📦 fusion-issue-authoring@0.1.0<br/>");
    expect(output).toContain("📦 fusion-skill-authoring@0.2.0__");
    expect(output).toContain("Scope delivered:\n- Added metadata tags.");

    const separatorCount = output.split("\n---\n").length - 1;
    expect(separatorCount).toBe(1);

    expect(output.trimEnd().endsWith("---")).toBeFalse();
  });

  it("falls back to a bullet body when note has only a title line", () => {
    const notes: GroupedRootReleaseNotes = {
      major: [],
      minor: [],
      patch: [
        {
          bumpType: "patch",
          body: "Fix wording in skill changelog",
          prNumber: "4",
          commitSha: "7dad5761f18701c15048130951d150e477c95189",
          packages: ["fusion-skill-authoring@0.1.1"],
        },
      ],
    };

    const output = renderRootReleaseNotes(notes, "equinor/fusion-skills").join("\n");

    expect(output).toContain("### Patch");
    expect(output).toContain("- Fix wording in skill changelog");
    expect(output.trimEnd().endsWith("---")).toBeFalse();
  });
});
