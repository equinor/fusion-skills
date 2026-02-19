import { execSync } from "node:child_process";

/**
 * Runs the skills CLI list/validate command and returns raw output.
 */
export function runSkillsCliList(repoRoot: string): string {
  return execSync("npx -y skills add . --list", {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
