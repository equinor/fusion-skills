---
name: fusion-issue-solving
description: Solve a GitHub issue end-to-end by researching context, planning executable todos, implementing scoped changes, validating results, and preparing PR updates.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  origin: equinor/fusion-poc-bip-bop:custom-issue-solving
  tags:
    - github
    - issue-solving
    - implementation
    - workflow
  mcp:
    suggested:
      - github
      - mcp_fusion
---

# Issue Solving Workflow

## When to use

Use this skill when you need to solve a GitHub issue from intake to PR-ready output in one structured flow.

Typical triggers:
- "solve this issue"
- "implement issue #123"
- "take this ticket end-to-end"
- "research, implement, validate, and prepare PR"

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
   - Use a PR body draft file under `.tmp/` when preparing PR updates/creation.

9. Optional GitHub mutation steps
   - If requested, update issue status/comments with objective progress.
   - If requested, create or update the PR using the repository PR template.

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
