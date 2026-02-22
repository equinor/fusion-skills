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
- Use lower-case issue-closing keywords consistently in changeset and PR text when closure is intended.
- Prefer `resolves owner/repo#123`; use `fixes owner/repo#123` or `closes owner/repo#123` only when those verbs are more accurate.
