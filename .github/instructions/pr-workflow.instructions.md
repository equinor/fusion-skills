---
applyTo: "**"
---

# Pull request workflow instructions

Apply when handling issue/PR workflows: intake, branch/PR prep, updates, finalization.

## Required PR flow

- Use `.github/pull_request_template.md` as the PR structure.
- For PR/issue work, ask whether to use `git worktree` before any other workflow questions (before branch, base branch, PR body, or PR creation steps).
- Trigger immediately when issue intent detected — `#123`, `issue 123`, or GitHub issue URL.
- Draft PR body in `.tmp/` with issue/context-specific names (e.g. `.tmp/pr-body-issue-402-issue-automation-reliability.md`); edit with user before submission.
- Don't use generic `.tmp/pr-body.md` for new PR drafts.
- Ask which base branch to target.
- Propose likely default base branch: usually repo default (`main`). If current branch was created from another (`next`, feature branch), suggest that instead.
- Assume head ref is current branch unless user requests otherwise.
- Ask whether related issues should be linked.
- Ask whether the PR should be assigned to the user.
- Ask whether the PR should be opened as draft or ready for review.
- Create or update the PR body from that temporary file.

## Example commands

- Create PR from draft body file:
	- `gh pr create --base <base-branch> --head <current-branch> --title "<title>" --body-file .tmp/pr-body-<issue-or-context>.md --assignee @me`
- Update an existing PR body from draft body file:
	- `gh pr edit <pr-number> --body-file .tmp/pr-body-<issue-or-context>.md`

## Required checks before PR update/create

### Code quality

- Run lint/format checks before commit operations (`bun run biome:check`; optionally `bun run biome:fix` first).
- Check current branch changes and summarize staged/unstaged scope.
- Check code and docs against `CONTRIBUTING.md`, `contribute/`, and relevant `.github/instructions/*.instructions.md`.
- Confirm validation commands run.

### Changesets

- Keep changesets single-scope: each `.changeset/*.md` file must describe one skill/package change only.
- If multiple skills/packages changed, split into multiple `.changeset/*.md` files (one entry per file).

### Issue references

- Use lower-case issue-closing keywords consistently in changeset and PR text when closure is intended.
- Prefer `resolves owner/repo#123`; use `fixes owner/repo#123` or `closes owner/repo#123` only when those verbs are more accurate.

## Issue closure vs reference guidance

GitHub auto-closes issues when PR body or commit message includes closure keywords.

**Close an issue:**
- Use in PR body when PR directly resolves/fixes/closes the linked issue.
- Use closure keywords: `resolves`, `fixes`, or `closes` (lowercase).
- Example: `Resolves equinor/fusion-core-tasks#123`
- Result: GitHub closes the issue when PR merges.
- Use when: PR fully implements the issue's acceptance criteria.

**Reference an issue without closing:**
- Use in PR body when PR relates to but doesn't fully resolve the issue (multi-step plan, planning phase, sub-task).
- Use plain text: `Related to:`, `Refs:`, or `See:` (no closure keyword).
- Example: `Related to: equinor/fusion-core-tasks#123` or `Refs: equinor/fusion-core-tasks#123`
- Result: GitHub links PR to issue but does not auto-close.
- Use when: parent/planning task with multiple PRs, or closure not intended.

**Changesets and issue references:**
- Changesets document version bumps, released independently from issue closure.
- Include issue references in changeset bodies to document why.
- Use `resolves` (lowercase) in changeset body when the change directly resolves that issue.
- Example changeset format:
  ```markdown
  ---
  "skill-name": patch
  ---
  
  Fix missing validation rule in skill metadata
  
  - Add required owner field validation
  - Improve error messaging for missing fields
  
  Resolves equinor/fusion-core-tasks#123
  ```
- Changeset references don't auto-close issues; only PR body references do (on merge).

## Policy gaps that review workflows must surface as findings

Review workflows must explicitly flag these as findings — not suggestions. Each gap must appear in review output before merge.

**Missing or incomplete changesets:**
- A skill or package changed without a corresponding `.changeset/*.md` file.
- A single changeset file covers multiple skills/packages (must be one entry per file).

**Missing validation evidence:**
- The PR does not document which validation commands were run and their outcomes.
- Required repository checks (`bun run biome:check`, `bun run validate:skills`, `bun run validate:ownership`) are not evidenced.

**Weak PR body or template usage:**
- The PR body does not follow `.github/pull_request_template.md` structure.
- The "Why" section is missing or vacuous.
- Issue references use closure keywords (`resolves`, `fixes`, `closes`) when the PR only partially addresses the issue, or plain references when full closure is intended.

**Repository-policy drift in skills:**
- A mutation-capable skill encodes repository-specific commit, validation, changeset, or PR rules inline instead of deferring to repo-local instructions.
- A skill references repo-local files (`.github/instructions/`, `contribute/`, `CONTRIBUTING.md`) that do not exist or have moved.

**Safety and constraint gaps:**
- Destructive operations introduced without explicit confirmation gates.
- Scripts or skill instructions that request, expose, or log secrets/tokens.
