---
name: fusion-issue-authoring
description: Orchestrate GitHub issue authoring by classifying request type, routing to a type-specific issue-author skill, and enforcing shared safety gates before mutation.
license: MIT
metadata:
  version: "0.0.0"
  skill_role: "orchestrator"
  sub_skills:
    - fusion-issue-author-bug
    - fusion-issue-author-feature
    - fusion-issue-author-user-story
    - fusion-issue-author-task
  tags:
    - github
    - issue-authoring
---

# Issue Authoring Orchestrator

## Subskills

This skill routes to the following specialist subskills:

- `fusion-issue-author-bug` (`skills/fusion-issue-author-bug/SKILL.md`): bug-focused issue drafting and triage structure
- `fusion-issue-author-feature` (`skills/fusion-issue-author-feature/SKILL.md`): feature-focused scope and acceptance structure
- `fusion-issue-author-user-story` (`skills/fusion-issue-author-user-story/SKILL.md`): role/workflow/scenario-driven story structure
- `fusion-issue-author-task` (`skills/fusion-issue-author-task/SKILL.md`): checklist-first task decomposition and dependency planning

All subskills require this orchestrator for shared gates (labels, assignee confirmation, draft review, publish confirmation, and mutation sequencing).

## When to use

Use this skill when you need to turn ideas, bugs, feature requests, or user needs into clear, actionable GitHub issues.
Use it as the top-level router for both creating and updating issues.

Typical triggers:
- "create an issue"
- "draft a ticket"
- "turn this into a GitHub issue"
- "help me structure this work item"
- "update this issue"
- "maintain/clean up this issue"

## When not to use

Do not use this skill for:
- Implementing code changes
- Pull request authoring or review
- General research tasks not resulting in an issue draft
- Mutating GitHub state without explicit user confirmation

## Required inputs

Collect before publishing:
- Target repository for issue creation/update
- Issue intent/context
- Issue type (Bug, Feature, User Story, Task)
- Existing issue number/url when updating
- Repository label set (or confirmation that labels are intentionally skipped)
- Parent/related issue links and dependency direction (sub-issue vs blocking)
- Assignee preference (assign to user, specific person, or leave unassigned)

If required details are missing, ask concise clarifying questions from `references/questions.md`.
If issue destination is unclear, ask explicitly where the issue should be created/updated before drafting mutation commands.

## Instructions

### Step 1 — Classify issue type and route

Use this decision tree:
- Broken behavior -> Bug
- New capability -> Feature
- User workflow/use case -> User Story
- Enablement work -> Task (planning/research/spec/testing/documentation/generic)

Route to the matching specialized skill:
- Bug -> `skills/fusion-issue-author-bug/SKILL.md`
- Feature -> `skills/fusion-issue-author-feature/SKILL.md`
- User Story -> `skills/fusion-issue-author-user-story/SKILL.md`
- Task -> `skills/fusion-issue-author-task/SKILL.md`

If type is ambiguous, ask concise clarifying questions before routing.

### Step 2 — Enforce shared pre-publish gates

Before proposing or applying labels:
- Inspect available labels in the target repository.
- Propose labels that exist in that repository only.
- If no suitable labels exist, ask whether to proceed without labels or use nearest available labels.

Before publishing or updating issues:
- Ask whether the issue should be assigned.
- Confirm assignee target (for example `@me` or specific login) when assignment is requested.
- If assignment is not requested, proceed unassigned.

Always run draft-first review and explicit publish confirmation before mutation.

### Step 3 — Resolve target repository

Before any GitHub mutation:
- Use explicit user input when provided.
- If missing, inspect repository guidance first (for example `CONTRIBUTING.md`, `contribute/`, and maintainer docs).
- If still unclear, ask the user directly which repository should own the issue.

### Step 4 — Check duplicates for new issues

Run a quick issue search in the target repository and surface likely duplicates.

### Step 5 — Resolve template source

Template precedence:
- Inspect target repository templates first (for example `.github/ISSUE_TEMPLATE/`).
- Use repository template when suitable.
- Use type-specific specialist fallback templates only when no suitable repository template exists.
- Suggest template follow-up improvements if repository templates are missing/outdated.

### Step 6 — Draft locally first

Prepare a local draft in `.tmp/{TYPE}-{CONTEXT}.md` using GitHub Flavored Markdown.

### Step 7 — Run user draft review

Share draft summary and ask for edits before publication.

### Step 8 — Ask explicit publish confirmation

Only after content is approved, ask:
- "I've drafted this in `.tmp/{TYPE}-{CONTEXT}.md`. Do you want any edits before publishing?"
- After edits/approval: "Draft looks good. Want me to apply this to GitHub now? (y/n)"

### Step 9 — Mutate GitHub only after confirmation

Only if the user confirms publication, run mutation commands (`gh issue create` or issue update).
After creation/update:
- Apply requested labels from repository-validated label names.
- Set issue type explicitly (for Task work, set type to `Task`).
- Apply assignee updates based on confirmed assignee intent.

### Step 10 — Optional relationship/type operations

If requested, set issue type and link parent/sub-issue/blocking relationships.

### Step 11 — Validate relationship logic before linking

Before adding relationships:
- Verify ordering is logically consistent (prerequisite tasks first).
- Use sub-issues for decomposition under a parent.
- Use blocking links when a task depends on completion of another task.
- Avoid contradictory links (for example a task both blocking and depending on the same issue).

## Core behavior to preserve

- Classification-first workflow
- Route-to-specialized-skill workflow
- Draft-first workflow
- Clarifying questions for missing critical context
- Explicit confirmation before any GitHub mutation

Use detailed authoring guidance in `references/instructions.md`.
Use optional command helpers in `scripts/README.md`.
Specialist fallback template locations:
- Bug: `skills/fusion-issue-author-bug/assets/issue-templates/bug.md`
- Feature: `skills/fusion-issue-author-feature/assets/issue-templates/feature.md`
- User Story: `skills/fusion-issue-author-user-story/assets/issue-templates/user-story.md`
- Task: `skills/fusion-issue-author-task/assets/issue-templates/task*.md`

## Expected output

Return:
- Selected specialized skill path
- Draft issue file path under `.tmp/`
- Template source used (repository template path or fallback asset path)
- Proposed title, body summary, and labels
- Issue type plan
- Dependency plan (order + proposed sub-issue/blocking links)
- Assignee plan (who will be assigned, or explicit unassigned decision)
- Explicit status: `Awaiting user content approval` before any publish/update command
- Any related/duplicate issue links found
- Exact create/update command(s) to be run after confirmation
- Created/updated issue URL/number only after confirmed mutation
- Suggested template maintenance follow-up when repository templates are missing or weak

## Safety & constraints

Never:
- Run `gh issue create` without explicit user confirmation
- Publish/update an issue before the user confirms the draft content is correct
- Assume the user wants to publish to GitHub
- Request or expose secrets/credentials
- Perform destructive commands without explicit confirmation

Always:
- Keep drafts concise and editable
- Prefer WHAT/WHY over implementation HOW in issue text
- Use full repository issue references (for example `owner/repo#123`)
