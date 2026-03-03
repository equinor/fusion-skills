import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findGraphqlFiles } from "../validate-graphql/find-graphql-files";

describe("validate-graphql file discovery", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const tempDir of tempDirs) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("includes only .graphql and .gql files under skills assets folders", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-graphql-"));
    tempDirs.push(repoRoot);

    mkdirSync(join(repoRoot, "skills/fusion-a/assets"), { recursive: true });
    mkdirSync(join(repoRoot, "skills/fusion-a"), { recursive: true });

    writeFileSync(
      join(repoRoot, "skills/fusion-a/assets/query.graphql"),
      "query A { viewer { login } }",
      "utf8",
    );
    writeFileSync(
      join(repoRoot, "skills/fusion-a/assets/mutation.gql"),
      'mutation B { addStar(input: {starrableId: "x"}) { starrable { id } } }',
      "utf8",
    );
    writeFileSync(join(repoRoot, "skills/fusion-a/assets/readme.md"), "not graphql", "utf8");
    writeFileSync(
      join(repoRoot, "skills/fusion-a/query.graphql"),
      "query C { viewer { id } }",
      "utf8",
    );

    const files = findGraphqlFiles(repoRoot);

    expect(files).toEqual([
      "skills/fusion-a/assets/mutation.gql",
      "skills/fusion-a/assets/query.graphql",
    ]);
  });

  it("keeps discovery bounded to assets even with nested non-asset folders", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "validate-graphql-"));
    tempDirs.push(repoRoot);

    mkdirSync(join(repoRoot, "skills/.experimental/fusion-b/assets/nested"), {
      recursive: true,
    });
    mkdirSync(join(repoRoot, "skills/.experimental/fusion-b/references"), {
      recursive: true,
    });
    mkdirSync(join(repoRoot, "skills/.curated/fusion-c/scripts"), {
      recursive: true,
    });

    writeFileSync(
      join(repoRoot, "skills/.experimental/fusion-b/assets/nested/inside.graphql"),
      "query D { viewer { avatarUrl } }",
      "utf8",
    );
    writeFileSync(
      join(repoRoot, "skills/.experimental/fusion-b/references/outside.graphql"),
      "query E { viewer { name } }",
      "utf8",
    );
    writeFileSync(
      join(repoRoot, "skills/.curated/fusion-c/scripts/outside-too.gql"),
      "query F { viewer { email } }",
      "utf8",
    );

    const files = findGraphqlFiles(repoRoot);

    expect(files).toEqual(["skills/.experimental/fusion-b/assets/nested/inside.graphql"]);
  });
});
