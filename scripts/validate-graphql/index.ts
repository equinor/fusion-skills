/// <reference types="node" />

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";
import { parse } from "graphql";

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
      "No GraphQL files found under skills/**/assets/graphql/*.github.graphql; skipping validation.",
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

/**
 * Finds GraphQL asset files under skills directories.
 * @param repoRoot Repository root path.
 * @returns Sorted list of GraphQL asset file paths.
 */
function findGraphqlFiles(repoRoot: string): string[] {
  const skillsRoot = join(repoRoot, "skills");
  const files: string[] = [];

  walkDirectory(skillsRoot, files, repoRoot);
  files.sort();

  return files;
}

/**
 * Walks directories recursively and collects graphql files in assets/graphql folders.
 * @param directoryPath Absolute path for directory traversal root.
 * @param files Mutable collection of discovered GraphQL file paths.
 * @param repoRoot Repository root path used to normalize relative paths.
 */
function walkDirectory(directoryPath: string, files: string[], repoRoot: string): void {
  const entries = readdirSync(directoryPath, {
    withFileTypes: true,
  });

  // Only include files that match the intended GraphQL naming convention.
  for (const entry of entries) {
    const fullPath = join(directoryPath, entry.name);

    // Recurse into nested folders so discovery is not limited to one directory level.
    if (entry.isDirectory()) {
      walkDirectory(fullPath, files, repoRoot);
      continue;
    }

    // Ignore non-files to avoid directory-specific handling complexity.
    if (!entry.isFile()) {
      continue;
    }

    const relativeParent = relative(repoRoot, directoryPath).replaceAll("\\", "/");
    // Restrict scope to skill GraphQL assets folder to avoid unrelated files.
    if (!relativeParent.endsWith("/assets/graphql")) {
      continue;
    }
    // Enforce GitHub-targeted GraphQL suffix for explicit API compatibility.
    if (!entry.name.endsWith(".github.graphql")) {
      continue;
    }

    files.push(relative(repoRoot, fullPath).replaceAll("\\", "/"));
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
