/// <reference types="node" />

/**
 * Extracts governance references from skill content.
 *
 * Collects both Markdown link targets and backtick-quoted path references
 * that point at `.github/`, `contribute/`, or `CONTRIBUTING.md`.
 */

/**
 * Regex: matches Markdown-style relative links that target repo-local governance
 * paths — `.github/`, `contribute/`, or `CONTRIBUTING.md`.
 *
 * Captures the link target (group 1).
 */
// regex: match Markdown link targets pointing at .github/, contribute/, or CONTRIBUTING.md
const GOVERNANCE_LINK_RE =
  // regex: match [text](target) where target contains .github/, contribute/, or CONTRIBUTING.md
  /\[[^\]]*\]\(([^)]*(?:\.github\/|contribute\/|CONTRIBUTING\.md)[^)]*)\)/g;

/**
 * Regex: matches plain-text references to repo-local governance paths that are
 * not inside a Markdown link.
 *
 * Captures the path (group 1).
 */
// regex: match backtick-quoted or bare references to .github/instructions/, contribute/, or CONTRIBUTING.md
const GOVERNANCE_REF_RE =
  // regex: match `path` where path starts with .github/instructions/, contribute/, or equals CONTRIBUTING.md
  /`((?:\.github\/instructions\/[^\s`]+|contribute\/[^\s`]+|CONTRIBUTING\.md))`/g;

/**
 * Extracts governance references from SKILL.md content.
 *
 * Collects both Markdown link targets and backtick-quoted path references
 * that point at `.github/`, `contribute/`, or `CONTRIBUTING.md`.
 *
 * @param content - The raw SKILL.md file content.
 * @returns Deduplicated array of governance reference paths.
 */
export function extractGovernanceRefs(content: string): string[] {
  const refs = new Set<string>();

  // Collect Markdown link targets that reference governance paths.
  for (const match of content.matchAll(GOVERNANCE_LINK_RE)) {
    refs.add(match[1]);
  }

  // Collect backtick-quoted governance path references.
  for (const match of content.matchAll(GOVERNANCE_REF_RE)) {
    refs.add(match[1]);
  }

  return [...refs];
}
