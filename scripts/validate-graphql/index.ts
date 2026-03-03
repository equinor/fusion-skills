/// <reference types="node" />

import { readFileSync } from "node:fs";
import process from "node:process";
import { parse } from "graphql";
import { findGraphqlFiles } from "./find-graphql-files";

/**
 * Validates GraphQL document syntax for skill assets.
 *
 * Scope is limited to static fallback GraphQL files under skills assets folders.
 */
function main(): void {
  const repoRoot = process.cwd();
  const files = findGraphqlFiles(repoRoot);

  // Exit early so callers get clear feedback when no files match scope.
  if (files.length === 0) {
    console.log(
      "No GraphQL files found under skills/**/assets/**/*.graphql|*.gql; skipping validation.",
    );
    return;
  }

  console.log(`Validating ${files.length} GraphQL file(s)...`);

  // Process files in deterministic order to keep output stable across runs.
  for (const file of files) {
    try {
      const source = readFileSync(file, "utf8");
      parse(source);
      console.log(`OK: ${file}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse GraphQL file ${file}: ${message}`);
    }
  }

  console.log("GraphQL syntax validation passed.");
}

// Keep CLI execution scoped to direct invocation to avoid side effects in imports.
if (import.meta.main) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
    process.exit(1);
  }
}
