import { tryRunGitArgs } from "./try-run-git";

/**
 * Checks if a file exists at a git ref/path.
 *
 * @param ref - Git ref to inspect.
 * @param path - Repository-relative file path.
 * @returns `true` when the object exists at the ref/path pair.
 */
export function gitPathExists(ref: string, path: string): boolean {
  return tryRunGitArgs(["cat-file", "-e", `${ref}:${path}`]) !== null;
}
