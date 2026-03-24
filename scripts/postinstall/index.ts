/**
 * Postinstall script — symlinks selected skills into `.github/skills/`
 * so Copilot agent mode can discover them as workspace-local skills.
 *
 * Idempotent: safe to re-run; existing correct symlinks are left in place.
 *
 * @module postinstall
 */

import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

/** Skills to symlink into `.github/skills/`. */
const SKILLS_TO_LINK: readonly string[] = ["fusion-skill-authoring", "fusion-issue-authoring"];

const ROOT = resolve(import.meta.dirname, "..", "..");
const SKILLS_SRC = resolve(ROOT, "skills");
const SKILLS_DEST = resolve(ROOT, ".github", "skills");

/**
 * Ensure {@link dir} exists, creating intermediate directories as needed.
 *
 * @param dir - Absolute path of the directory to create.
 */
function ensureDirectory(dir: string): void {
  // Create the directory tree only when it is missing.
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Create a relative symlink from {@link linkPath} pointing to {@link targetPath}.
 * If a symlink already exists and points to the correct target it is left untouched.
 *
 * @param targetPath - Absolute path to the symlink target (the skill directory).
 * @param linkPath   - Absolute path where the symlink should be created.
 */
function ensureSymlink(targetPath: string, linkPath: string): void {
  const relTarget = relative(dirname(linkPath), targetPath);

  // Check whether something already exists at the link location.
  if (existsSync(linkPath) || lstatSync(linkPath, { throwIfNoEntry: false })) {
    const stat = lstatSync(linkPath, { throwIfNoEntry: false });
    // If the existing entry is a symlink, check whether it already points to the right target.
    if (stat?.isSymbolicLink()) {
      const current = readlinkSync(linkPath);
      // Correct symlink already in place — nothing to do.
      if (current === relTarget) {
        console.log(`  ✔ ${linkPath} → already correct`);
        return;
      }
      // Symlink exists but points elsewhere — replace it.
      unlinkSync(linkPath);
      // A non-symlink file/directory occupies the path — refuse to clobber it.
    } else if (stat) {
      throw new Error(
        `Refusing to overwrite non-symlink at ${linkPath}. Remove it manually and re-run.`,
      );
    }
  }

  symlinkSync(relTarget, linkPath);
  console.log(`  ✔ ${linkPath} → ${relTarget}`);
}

/** Entrypoint — symlink each configured skill into the agent-discoverable directory. */
function main(): void {
  console.log("postinstall: symlinking skills into .github/skills/");

  ensureDirectory(SKILLS_DEST);

  // Iterate configured skills to create or verify each symlink.
  for (const skill of SKILLS_TO_LINK) {
    const src = resolve(SKILLS_SRC, skill);
    // Skip skills whose source directory does not exist (e.g. not yet created).
    if (!existsSync(src)) {
      console.warn(`  ⚠ source not found, skipping: ${src}`);
      continue;
    }
    const dest = resolve(SKILLS_DEST, skill);
    ensureSymlink(src, dest);
  }

  console.log("postinstall: done");
}

main();
