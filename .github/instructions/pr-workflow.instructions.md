---
applyTo: "**"
---

# Pull request workflow instructions

Apply this guidance when handling issue and pull request workflows, including issue intake, branch/PR preparation, PR updates, and PR finalization.

## Required PR flow

- Use `.github/pull_request_template.md` as the PR structure.
- For PR and issue work, ask whether to use a dedicated `git worktree` before any other workflow questions (for example before branch, base branch, PR body, or PR creation steps).
- Trigger this question immediately when issue intent is detected, including references like `#123`, `issue 123`, or a GitHub issue URL.
- Create temporary PR body drafts in `.tmp/` using issue/context-specific names (for example `.tmp/pr-body-issue-402-issue-automation-reliability.md`) and edit with the user before submission.
- Do not use a generic shared filename like `.tmp/pr-body.md` for new PR drafts.
- Ask which base branch to target.
- Propose a likely default base branch when asking:
  - usually the repository default branch (for example `main`),
  - but if the current branch is clearly cut from another branch (for example `next` or a feature branch), suggest that branch instead.
- Assume head ref is the current branch unless the user explicitly requests another head branch.
- Follow up by asking whether related issues should be linked.
- Ask whether the PR should be assigned to the user.
- Ask whether the PR should be opened as draft or ready for review.
- Create or update the PR body from that temporary file.

## Example commands

- Create PR from draft body file:
	- `gh pr create --base <base-branch> --head <current-branch> --title "<title>" --body-file .tmp/pr-body-<issue-or-context>.md --assignee @me`
- Update an existing PR body from draft body file:
	- `gh pr edit <pr-number> --body-file .tmp/pr-body-<issue-or-context>.md`

## Required checks before PR update/create

- Run lint/format checks before commit operations (`bun run biome:check`; optionally `bun run biome:fix` first).
- Check current branch changes and summarize staged/unstaged scope.
- Check code and docs against repository guides (`CONTRIBUTING.md`, `contribute/`, and relevant `.github/instructions/*.instructions.md`).
- Confirm validation commands run.
- Keep changesets single-scope: each `.changeset/*.md` file must describe one skill/package change only.
- If multiple skills/packages changed, split into multiple `.changeset/*.md` files (one entry per file).
- Use lower-case issue-closing keywords consistently in changeset and PR text when closure is intended.
- Prefer `resolves owner/repo#123`; use `fixes owner/repo#123` or `closes owner/repo#123` only when those verbs are more accurate.

## Issue closure vs reference guidance

GitHub automatically closes issues when a PR body or commit message includes closure keywords targeting that issue.

**Close an issue:**
- Use in PR body when this PR directly resolves/fixes/closes the issue it's linked to.
- Use closure keywords: `resolves`, `fixes`, or `closes` (lowercase).
- Example: `Resolves equinor/fusion-core-tasks#123`
- Result: GitHub closes the issue when PR merges.
- Use when: The PR implements the complete solution to the issue's acceptance criteria.

**Reference an issue without closing:**
- Use in PR body when the PR is related to or contributes to an issue but does not fully resolve it (e.g., part of a multi-step plan, planning phase, sub-task phase).
- Use plain text: `Related to:`, `Refs:`, or `See:` (no closure keyword).
- Example: `Related to: equinor/fusion-core-tasks#123` or `Refs: equinor/fusion-core-tasks#123`
- Result: GitHub links the PR to the issue but does not auto-close.
- Use when: The issue is a parent/planning task with multiple PRs or sub-issues, or when closure is explicitly not intended.

**Changesets and issue references:**
- Changesets document version bumps and are released independently from issue closure.
- Include issue references in changeset bodies to document why the change was made.
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
- Changeset closure references do not auto-close issues; only PR body references do (when PR merges).

## Policy gaps that review workflows must surface as findings

Review-oriented workflows (including agent-driven reviews) must explicitly flag the following as findings when they are detected. These are not optional suggestions — each gap must appear in the review output so the author can address it before merge.

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
