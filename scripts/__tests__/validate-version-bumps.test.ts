import { beforeEach, describe, expect, it, vi } from "vitest";

const { getVersionAtRefMock } = vi.hoisted(() => ({
  getVersionAtRefMock: vi.fn<(ref: string, skillDir: string) => string | null>(),
}));

vi.mock("../validate-pr/get-version-at-ref", () => ({
  getVersionAtRef: getVersionAtRefMock,
}));

import { validateVersionBumps } from "../validate-pr/validate-version-bumps";

describe("validateVersionBumps", () => {
  beforeEach(() => {
    getVersionAtRefMock.mockReset();
  });

  it("passes when a changed skill version increases", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.1.0" : "1.0.0";
    });

    expect(() =>
      validateVersionBumps(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).not.toThrow();
  });

  it("fails when the version is unchanged", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.0.0" : "1.0.0";
    });

    expect(() =>
      validateVersionBumps(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).toThrow("Skill metadata.version bump validation failed.");
  });

  it("fails when the version is downgraded", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "0.9.9" : "1.0.0";
    });

    expect(() =>
      validateVersionBumps(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).toThrow("Skill metadata.version bump validation failed.");
  });

  it("passes for newly added skills", () => {
    getVersionAtRefMock.mockImplementation((ref, skillDir) => {
      if (skillDir !== "skills/fusion-skill-authoring") return null;
      return ref === "HEAD" ? "1.0.0" : null;
    });

    expect(() =>
      validateVersionBumps(new Set(["skills/fusion-skill-authoring"]), "origin/main"),
    ).not.toThrow();
  });
});
