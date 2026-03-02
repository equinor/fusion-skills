/// <reference types="node" />

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
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

  if (files.length === 0) {
    console.log("No GraphQL files found under skills/**/assets/graphql/*.graphql.");
    return;
  }

  console.log(`Validating ${files.length} GraphQL file(s)...`);

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    parse(source);
    console.log(`OK: ${file}`);
  }

  console.log("GraphQL syntax validation passed.");
}

/**
 * Finds GraphQL asset files under skills directories.
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
 */
function walkDirectory(directoryPath: string, files: string[], repoRoot: string): void {
  const entries = readdirSync(directoryPath, {
    withFileTypes: true,
    recursive: true,
  });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const parentPath = entry.parentPath;
    const relativeParent = parentPath.replace(`${repoRoot}/`, "").replaceAll("\\", "/");
    if (!relativeParent.endsWith("/assets/graphql")) {
      continue;
    }
    if (!entry.name.endsWith(".graphql")) {
      continue;
    }

    files.push(`${relativeParent}/${entry.name}`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exit(1);
}
