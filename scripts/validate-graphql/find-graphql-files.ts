import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Finds GraphQL asset files under skills directories.
 * @param repoRoot Repository root path.
 * @returns Sorted list of GraphQL asset file paths.
 */
export function findGraphqlFiles(repoRoot: string): string[] {
  const skillsRoot = join(repoRoot, "skills");
  const files: string[] = [];

  // Return empty results so callers can surface a clean skip message when skills root is unavailable.
  if (!existsSync(skillsRoot)) {
    return files;
  }

  walkDirectory(skillsRoot, files, repoRoot);
  files.sort();

  return files;
}

/**
 * Walks directories recursively and collects GraphQL files in skills assets folders.
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
    // Restrict scope to skill assets folders to avoid unrelated files.
    const isUnderSkillsAssets =
      relativeParent.startsWith("skills/") &&
      (relativeParent.includes("/assets/") || relativeParent.endsWith("/assets"));
    // Skip files outside skill asset folders so validation scope stays intentionally bounded.
    if (!isUnderSkillsAssets) {
      continue;
    }

    // Include all GraphQL document files in assets, regardless of endpoint naming suffix.
    const isGraphqlFile = entry.name.endsWith(".graphql") || entry.name.endsWith(".gql");
    // Skip non-GraphQL files to avoid parsing unrelated asset content.
    if (!isGraphqlFile) {
      continue;
    }

    files.push(relative(repoRoot, fullPath).replaceAll("\\", "/"));
  }
}
