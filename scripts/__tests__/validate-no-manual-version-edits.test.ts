import { beforeEach, describe, expect, it, mock } from "bun:test";

const getVersionAtRefMock = mock((ref: string, skillDir: string): string | null => {
  void ref;
  void skillDir;
  return null;
});

mock.module("../validate-pr/get-version-at-ref", () => ({
  getVersionAtRef: getVersionAtRefMock,
}));

import { validateNoManualVersionEdits } from "../validate-pr/validate-no-manual-version-edits";

describe("validateNoManualVersionEdits", () => {
  beforeEach(() => {
    getVersionAtRefMock.mockReset();
  });

  it("passes when an existing changed skill version is unchanged", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.0.0" : "1.0.0";
    });

    expect(() =>
      validateNoManualVersionEdits(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).not.toThrow();
  });

  it("fails when the version increases", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.1.0" : "1.0.0";
    });

    expect(() =>
      validateNoManualVersionEdits(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).toThrow("Manual skill metadata.version edits are not allowed in non-release PRs.");
  });

  it("fails when the version is downgraded", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "0.9.9" : "1.0.0";
    });

    expect(() =>
      validateNoManualVersionEdits(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).toThrow("Manual skill metadata.version edits are not allowed in non-release PRs.");
  });

  it("passes for newly added skills", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.0.0" : null;
    });

    expect(() =>
      validateNoManualVersionEdits(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).not.toThrow();
  });
});
