import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const skillFile = join(repoRoot, "skills/.experimental/fusion-github-review-resolution/SKILL.md");
const checklistFile = join(
  repoRoot,
  "skills/.experimental/fusion-github-review-resolution/assets/review-resolution-checklist.md",
);
const resolveScriptFile = join(
  repoRoot,
  "skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh",
);

describe("fusion-github-review-resolution regression guardrails", () => {
  it("documents the deterministic phase order and bans ad hoc mutation scripts", () => {
    const skill = readFileSync(skillFile, "utf8");

    expect(skill).toContain("fetch → analyze → fix → validate → push → reply → resolve → verify");
    expect(skill).toContain("never ad hoc temporary Python scripts");
    expect(skill).toContain("Post at most one reply attempt per thread per run.");
  });

  it("requires reasoning about whether reviewer feedback is actually correct", () => {
    const skill = readFileSync(skillFile, "utf8");

    expect(skill).toContain("Reviewers are not automatically correct");
    expect(skill).toContain("If the feedback is clearly incorrect or outdated");
    expect(skill).toContain("If doubt remains after local research, ask the user");
    expect(skill).toContain("Do not resolve a thread that is still uncertain");
  });

  it("tracks duplicate-reply checks in the checklist", () => {
    const checklist = readFileSync(checklistFile, "utf8");

    expect(checklist).toContain("## Pre-mutation checks");
    expect(checklist).toContain(
      "Classify each comment (valid, partial, incorrect/outdated, uncertain)",
    );
    expect(checklist).toContain("Each targeted thread checked for existing agent replies");
    expect(checklist).toContain(
      "Any uncertain comments escalated to the user before reply/resolve",
    );
    expect(checklist).toContain(
      "Any failed/uncertain mutation attempts re-checked before retrying",
    );
  });

  it("guards helper-script reply mutations against duplicate comments", () => {
    const script = readFileSync(resolveScriptFile, "utf8");

    expect(script).toContain("--allow-additional-reply");
    expect(script).toContain("addPullRequestReviewThreadReply");
    expect(script).toContain("identical reply already exists");
    expect(script).toContain("Re-run with --allow-additional-reply only after manual inspection.");
  });
});
