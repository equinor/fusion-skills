# Issue authoring guidance

Goal: help users turn ideas into actionable GitHub issues quickly while keeping drafts concise and easy to refine.

## Core approach

- Draft naturally; avoid rigid structure unless needed
- Be concise; focus on information needed now
- Encourage iteration; start minimal and refine collaboratively
- Guide instead of prescribe
- For task decomposition, prefer small, single-purpose tasks and checklist-first guidance

## Always do this

- Use clear, scannable titles, e.g. `[area] - Brief action/outcome`
- Link related issues in full format, e.g. `owner/repo#123`
- Use GitHub Flavored Markdown for all issue content
- Include a problem statement
- Discover repository labels before suggesting labels; user decides final selection
- Ask clarifying questions only if essential to move forward
- Resolve and confirm the target issue repository before any `gh` mutation
- Ensure dependency direction is logically correct before adding sub-issue/blocking links
- Ask whether the issue should be assigned, and to whom, before publish/update

## Avoid this

- Excessive sections or unnecessary template rigidity
- Over-detailed acceptance criteria too early
- Premature implementation prescriptions
- Assumptions about missing context that were not confirmed
- Large multi-deliverable task tickets when smaller subtasks would be clearer

## Task checklist mode (for Task-type requests)

When a user asks to create tasks or break down work:

1. Start with a short checklist of suggested tasks from the user's perspective.
2. Keep each task focused on one concrete outcome.
3. Add brief feedback on suggested order/dependencies.
4. Ask which one task to draft first.
5. Draft one issue at a time unless the user explicitly asks for bulk drafting.

If user explicitly requests bulk task creation:
6. Keep all created issues typed as `Task`.
7. Include a dependency map (ordered steps + blockers).
8. Add blocking relationships for tasks that cannot start yet.

## Draft-first and publish-later workflow

1. Draft in `.tmp/{TYPE}-{CONTEXT}.md`
2. Share draft summary and ask for content review first: "Do you want any edits before publishing?"
3. If user requests edits, update draft and re-share summary.
4. Ask publication confirmation only after user approves content: "Want me to publish this to GitHub now? (y/n)"
5. Publish only after explicit yes

Mandatory gate: never create or update a GitHub issue in the same pass as the first draft unless the user explicitly confirms the draft content is correct and asks to publish.

## Target repository discovery

When the destination repository is not explicit:

1. Check repository guidance sources first (for example `CONTRIBUTING.md`, files under `contribute/`, and maintainer docs).
2. Look for explicit references to where issues should be created/reported.
3. If multiple candidates exist or no clear owner is defined, ask the user directly before drafting mutation commands.

Rule: never assume the current repository is the issue destination when guidance is unclear.

## Template sources

Template precedence:

1. Always inspect the target repository first, especially `.github/ISSUE_TEMPLATE/`.
2. Use a repository-local template when a suitable one exists.
3. Use specialist-local templates only as fallback when repository templates are missing, outdated, or not suitable.
4. If repository templates are weak/missing, suggest a follow-up improvement issue or PR so future issue authoring is clearer.

Specialist fallback templates:

- Feature: `skills/fusion-issue-author-feature/assets/issue-templates/feature.md`
- User Story: `skills/fusion-issue-author-user-story/assets/issue-templates/user-story.md`
- Bug: `skills/fusion-issue-author-bug/assets/issue-templates/bug.md`
- Task variants: `skills/fusion-issue-author-task/assets/issue-templates/task*.md`

## Labels workflow

Before proposing labels for a draft:

1. Query repository labels first (for example `gh label list --repo <owner>/<repo>`).
2. Propose only labels that exist in that repository.
3. If expected labels are missing, call it out and ask whether to continue with available labels.
4. Apply labels only after user approves the draft and publication.

Rule: never invent labels or silently drop requested labels without telling the user.

## Assignee workflow

Before publishing or updating issues:

1. Ask whether assignment is wanted.
2. If yes, confirm assignee target (`@me` or specific login).
3. If no, record explicit unassigned decision.
4. Apply assignee after draft approval and publish confirmation.

Rule: never assume assignment preferences without asking.

## Issue type workflow

After issue creation/update, set issue type when supported by repository configuration.

- For task decomposition work, set issue type to `Task`.
- Use GraphQL `updateIssue` with `issueTypeId` (do not rely on REST `--field type=...` patching).
- If issue type mutation is unsupported or fails, report the exact limitation and ask how to proceed.

Rule: do not infer Task work but leave type unset.

## Relationship reasoning (sub-issue vs blocking)

Use this model:

- Parent decomposition: child issues are sub-issues of the parent issue.
- Dependency sequencing: if B requires A first, then B is blocked by A.

Quick check before linking:

1. Can this issue start immediately?
	- Yes -> no blocking link needed.
	- No -> add blocking link(s) to prerequisite issue(s).
2. Does this issue belong under a parent objective?
	- Yes -> add as sub-issue to that parent.
3. Are links contradictory?
	- If yes, stop and fix the plan before mutating.

## Scripted helpers (optional)

VS Code zsh note:

- In integrated zsh sessions, unguarded `set -u` can interfere with shell integration hooks.
- When using interactive ad-hoc shell snippets in VS Code, prefer `set -eo pipefail` or guard `set -u` explicitly.

Use scripts in `../scripts/` to keep issue operations consistent:

- List issues: `./skills/fusion-issue-authoring/scripts/list-issues.sh --repo <owner>/<repo>`
- List labels: `./skills/fusion-issue-authoring/scripts/list-labels.sh --repo <owner>/<repo> --limit 100`
- Search duplicates: `./skills/fusion-issue-authoring/scripts/search-duplicates.sh --repo <owner>/<repo> --query "<keywords>"`
- Research repository context: `./skills/fusion-issue-authoring/scripts/research-repo-content.sh --repo <owner>/<repo>`
- Set issue type: `./skills/fusion-issue-authoring/scripts/set-issue-type.sh --repo <owner>/<repo> --issue <n> --type "Feature" --dry-run`
- Add sub-issues (single or multiple): `./skills/fusion-issue-authoring/scripts/add-sub-issues.sh --repo <owner>/<repo> --parent <n> --children 391,392,393 --dry-run`
- Add blocking issues (single or multiple): `./skills/fusion-issue-authoring/scripts/add-blocking-issues.sh --repo <owner>/<repo> --issue <n> --blocking 391,392,393 --dry-run`

Suggested mutation order for Task batches:

1. Create issues.
2. Apply labels.
3. Set issue type (`Task`).
4. Apply assignees.
5. Add sub-issue links.
6. Add blocking links.

Quick verification after setting type:

```bash
gh api graphql -f query='query($owner: String!, $name: String!, $number: Int!) { repository(owner: $owner, name: $name) { issue(number: $number) { number url issueType { name } } } }' -F owner=<owner> -F name=<repo> -F number=<n> --jq '.data.repository.issue'
```

### Windows (PowerShell)

Use the `.ps1` equivalents with `pwsh`:

- List issues: `pwsh ./skills/fusion-issue-authoring/scripts/list-issues.ps1 -Repo <owner>/<repo> -State open -Limit 20`
- List labels: `pwsh ./skills/fusion-issue-authoring/scripts/list-labels.ps1 -Repo <owner>/<repo> -Limit 100`
- Search duplicates: `pwsh ./skills/fusion-issue-authoring/scripts/search-duplicates.ps1 -Repo <owner>/<repo> -Query "<keywords>"`
- Research repository context: `pwsh ./skills/fusion-issue-authoring/scripts/research-repo-content.ps1 -Repo <owner>/<repo>`
- Set issue type: `pwsh ./skills/fusion-issue-authoring/scripts/set-issue-type.ps1 -Repo <owner>/<repo> -Issue <n> -Type Feature -DryRun`
- Add sub-issues (single or multiple): `pwsh ./skills/fusion-issue-authoring/scripts/add-sub-issues.ps1 -Repo <owner>/<repo> -Parent <n> -Children 391,392,393 -DryRun`
- Add blocking issues (single or multiple): `pwsh ./skills/fusion-issue-authoring/scripts/add-blocking-issues.ps1 -Repo <owner>/<repo> -Issue <n> -Blocking 391,392,393 -DryRun`

## Duplicate check

Run a quick search before creating a new issue:

```bash
gh search issues --repo <owner>/<repo> --state all "<keywords>"
```

If likely duplicates are found, surface them and ask whether to continue with a new issue.