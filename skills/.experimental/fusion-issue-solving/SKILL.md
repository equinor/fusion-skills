---
name: fusion-issue-solving
description: Work on a GitHub issue end-to-end: research, plan, implement, validate, and prepare PR-ready output for issue resolution and sub-issue coordination.
license: MIT
metadata:
  version: "0.1.1"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - github
    - github-issue
    - issue-solving
    - issue-workflow
    - implementation
    - workflow
    - continue
  mcp:
    suggested:
      - github
      - mcp_fusion
---

# Issue Solving Workflow

## When to use

Use this skill when you have a GitHub issue to work on end-to-end.

Typical triggers:
- "continue work on issue #123"
- "solve this GitHub issue"
- "implement issue #123 end-to-end"
- "work on this ticket: [issue URL]"
- "research, implement, and prepare a PR for this issue"

## When not to use

Do not use this skill when:
- the request is only issue drafting/authoring,
- no implementation changes are expected,
- repository write operations are disallowed.

## Required inputs

Collect before execution:
- issue URL or `owner/repo#number`,
- repository and branch/worktree decision,
- acceptance criteria and out-of-scope constraints,
- required validation commands for the target repository.

Optional inputs:
- related issues/PRs,
- risk areas to prioritize,
- requested commit/PR granularity.

## Instructions

1. Ask whether to use a dedicated git worktree
   - Ask this before any other workflow questions.
   - If yes, use/create the worktree and continue there.

2. Confirm issue context and success criteria
   - Read the issue body, labels, and linked discussions.
   - Restate the implementable scope and explicitly list out-of-scope items.

3. Confirm assignee intent for issue closure work
   - Check whether the current user is assigned to the primary issue.
   - If the current user is not assigned, ask whether they want to assign themselves before continuing.
   - For each sub-issue that will be resolved or closed by this workflow, check assignee status.
   - If the current user is not assigned on a sub-issue, ask whether they want to assign themselves before resolving/closing it.

4. Build and track a concrete plan
   - Create actionable todos ordered by dependencies.
   - Keep exactly one step in progress and update status as work completes.

5. Research before edits
   - Inspect relevant files, tests, and adjacent usage.
   - Prefer root-cause fixes over surface patches.

6. Implement in small scoped changes
   - Keep each change aligned to issue acceptance criteria.
   - Avoid unrelated refactors and generated release artifacts.

7. Validate incrementally
   - Run targeted checks first, then required project checks.
   - If checks fail, fix relevant issues and re-run before proceeding.

8. Prepare PR-ready output
   - Summarize what changed and why.
   - Include validation evidence and known follow-ups.
   - Draft the PR body in a `.tmp/` file with an issue/context-specific name (for example, `.tmp/pr-body-issue-123-scope-summary.md`), not a shared `.tmp/pr-body.md`.
   - Base the draft on `.github/pull_request_template.md` and keep it updated as implementation evolves.
   - Ask which base branch to target and propose a likely default (typically `main`, or the branch the current branch was cut from).
   - Ask whether the PR should be opened as draft or ready for review.
   - Ask whether the PR should be assigned to the user and whether related issues should be linked.

9. Optional GitHub mutation steps
   - Before any GitHub mutation (create/edit/comment/close), ask for explicit user confirmation.
   - If requested, update issue status/comments with objective progress.
   - If requested, create or update the PR using the repository PR template and the `.tmp/` PR body draft file, using the confirmed base branch, draft/ready state, assignee choice, and related issue links.

## Expected output

Return a concise delivery report with:
- implemented scope vs original issue criteria,
- files changed,
- validation commands and outcomes,
- assignment decisions for primary issue and affected sub-issues,
- open risks/blockers,
- PR body summary (or `.tmp/` draft file path when created).

## Assets

- [assets/issue-solving-checklist.md](assets/issue-solving-checklist.md)

## Safety & constraints

- Never request or expose secrets/credentials.
- Never run destructive commands without explicit confirmation.
- Keep changes minimal and scoped to the issue.
- Do not claim checks passed without running them.
- Follow repository instructions and contribution rules.
