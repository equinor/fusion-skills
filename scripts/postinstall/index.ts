/**
 * Postinstall script — symlinks selected skills into `.github/skills/`
 * so Copilot agent mode can discover them as workspace-local skills.
 *
 * Idempotent: safe to re-run; existing correct symlinks are left in place.
 *
 * @module postinstall
 */

import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync, unlinkSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";

/** Skills to symlink into `.github/skills/`. */
const SKILLS_TO_LINK: readonly string[] = [
	"fusion-skill-authoring",
	"fusion-issue-authoring",
];

const ROOT = resolve(import.meta.dirname, "..", "..");
const SKILLS_SRC = resolve(ROOT, "skills");
const SKILLS_DEST = resolve(ROOT, ".github", "skills");

function ensureDirectory(dir: string): void {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

/**
 * Create a relative symlink from {@link linkPath} pointing to {@link targetPath}.
 * If a symlink already exists and points to the correct target it is left untouched.
 */
function ensureSymlink(targetPath: string, linkPath: string): void {
	const relTarget = relative(dirname(linkPath), targetPath);

	if (existsSync(linkPath) || lstatSync(linkPath, { throwIfNoEntry: false })) {
		const stat = lstatSync(linkPath, { throwIfNoEntry: false });
		if (stat?.isSymbolicLink()) {
			const current = readlinkSync(linkPath);
			if (current === relTarget) {
				console.log(`  ✔ ${linkPath} → already correct`);
				return;
			}
			// Symlink exists but points elsewhere — replace it.
			unlinkSync(linkPath);
		} else if (stat) {
			throw new Error(
				`Refusing to overwrite non-symlink at ${linkPath}. Remove it manually and re-run.`,
			);
		}
	}

	symlinkSync(relTarget, linkPath);
	console.log(`  ✔ ${linkPath} → ${relTarget}`);
}

function main(): void {
	console.log("postinstall: symlinking skills into .github/skills/");

	ensureDirectory(SKILLS_DEST);

	for (const skill of SKILLS_TO_LINK) {
		const src = resolve(SKILLS_SRC, skill);
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
