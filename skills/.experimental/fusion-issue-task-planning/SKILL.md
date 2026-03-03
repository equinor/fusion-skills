---
name: fusion-issue-task-planning
description: Plan and break down user-story issues into ordered, traceable task issue drafts with explicit publish gates.
license: MIT
metadata:
  version: "0.1.0"
  status: experimental
  skills:
      - fusion-issue-author-task
      - fusion-issue-authoring
  tags:
    - github
    - planning
    - user-story
    - task-planning
  mcp:
    required:
      - github
    suggested:
      - mcp_fusion
---

# User Story Task Planning

## Experimental caveat

This skill is experimental and not yet stable. Behavior, structure, and outputs may change between versions.

## When to use

Use this skill when you need an actionable task plan for a User Story issue before implementation.

Typical triggers:
- "plan tasks for #123"
- "break this story into steps"
- "create task issue drafts from this user story"

## When not to use

Do not use this skill for direct code implementation, PR review, or GitHub mutations without explicit confirmation.

## Required inputs

- Target issue reference (`owner/repo#number` or URL)
- Desired planning depth (`minimal`, `standard`, `detailed`)
- Run mode (`draft-only`, `draft+publish-ready`, or `publish-now`)

If missing inputs block planning, ask up to 3 focused follow-up questions from `assets/follow-up-questions.md`.

## Defaults

- Planning depth: `standard`
- Run mode: `draft-only`
- Publish behavior: explicit same-turn confirmation required before any mutation

## Instructions

Execute in order and state assumptions explicitly.

1. Probe preferred skills and classify drafting mode
   - `orchestrated`: both `fusion-issue-authoring` and `fusion-issue-author-task` available; full workflow with explicit publish gates handled by the orchestrator.
   - `direct-subordinate`: only `fusion-issue-author-task` available; operate in **draft-only** mode using its templates and safeguards, do **not** perform any GitHub mutations, and surface drafts plus clear instructions for how an orchestrator or user should publish them.
   - `inline`: neither available; stay in **draft-only** mode, generate task drafts with a minimal built-in structure (`Title`, `Problem`, `Scope`, `Acceptance criteria mapping`, `Verification`, `Dependencies`), and avoid direct references to another skill's `assets/` files.
   - Prefer `fusion-issue-author-task` whenever it is available; do not bypass it with direct cross-skill file references.
   - Never stop due to missing preferred skills; degrade gracefully.

2. Research the user story
   - Gather title, body, acceptance criteria, scenarios, ancestor chain, existing sub-issues, and related links.
   - If issue type is ambiguous, confirm whether to proceed as `User Story`.

3. Clarify only when needed
   - Ask at most 3 questions per batch.
   - Continue with explicit assumptions when safe defaults exist.

4. Extract planning anchors
   - Outcomes
   - Constraints and non-goals
   - Verification points

5. Build dependency-ordered tasks
   - For each task include objective, scope boundary, deliverable, verification method, and mapped AC references.
   - Prefer independently verifiable slices.

6. Generate task issue drafts
   - `orchestrated`: route through `fusion-issue-authoring` with issue type `Task`
   - `direct-subordinate`: invoke `fusion-issue-author-task` in draft-only mode and output explicit publish instructions for orchestrator or direct MCP paths
   - `inline`: write `.tmp/TASK-<nn>-<slug>.md` drafts using the minimal built-in structure from step 1
   - Keep drafts local until explicit publish approval.

7. Generate plan preview
   - Write `.tmp/USER-STORY-TASK-PLAN-<context>.md` from `assets/task-plan-template.md`.
   - Include summary, traceability, ordered tasks, draft paths, publish plan, assumptions, risks.

8. Publish only after explicit confirmation
   - Require explicit confirmation in the same turn.
   - Stop if unresolved assumptions remain.
    - In runtimes following the `fusion-issue-authoring` conventions, these are typically exposed as `issue_write`, `issue_read`, `search_issues`, and `sub_issue_write`. In some MCP bindings they may appear as `mcp_github_issue_write` / `mcp_github2_issue_write`, `mcp_github_issue_read`, and `mcp_github_search_issues` with equivalent behavior.
   - Use GitHub MCP tools as the canonical publish path:
       - `issue_write` with `method=create`, `owner`, `repo`, `title`, and optional `body`, `labels`, `type=Task`.
       - `issue_write` with `method=update`, `owner`, `repo`, `issue_number`, and `type=Task` to repair type metadata when needed.
       - `sub_issue_write` (when exposed in the runtime) with `method=add`, `owner`, `repo`, `issue_number=<parent-number>`, `sub_issue_id=<child-issue-id>` to link each task to the parent story.
       - `search_issues` with `query` (+ optional `owner`, `repo`, `perPage`) and `issue_read` with `method=get` to verify created issues exist and have expected metadata.
   - Parent linkage is not a `create` argument; it is a separate sub-issue link step after child issue creation.
   - If `sub_issue_write` is not exposed in the active MCP binding, use `gh api graphql` fallback for the link step and then re-verify.
   - Hard fail publish mode if any created issue fails verification.

9. Repair mode for already-created tasks
   - If tasks were created but are missing `Issue Type` or parent linkage, use repair mode via MCP updates:
   - `issue_write` with `method=update`, `owner`, `repo`, `issue_number`, and `type=Task`.
     - `sub_issue_write` (when exposed in the runtime) with `method=add`, `owner`, `repo`, `issue_number=<parent-number>`, `sub_issue_id=<child-issue-id>` when parent linkage is missing.
   - Verify with `issue_read` using `method=get` (and `method=get_labels` when labels are required).
     - If `sub_issue_write` is unavailable, perform parent linking via `gh api graphql` and re-run verification.
   - Repair mode must be idempotent: skip already-correct issues and fix only missing metadata.
   - Run post-flight verification after repairs and return actionable failures.

## Expected output

Return in this heading order:
1. Experimental caveat
2. Story summary
3. Acceptance-criteria traceability
4. Ordered tasks
5. Draft file paths
6. Publish plan
7. Assumptions, risks, and open questions

Always include: `Status: Awaiting user approval` until publish is confirmed and completed.

For `publish-now` or `repair` mode, include a per-issue post-flight report with:
- issue exists
- issue type equals requested type
- parent equals expected story number
- status (`ok`, `fixed`, or `failed`)

## Assets

- [assets/follow-up-questions.md](assets/follow-up-questions.md)
- [assets/task-plan-template.md](assets/task-plan-template.md)

## Safety & constraints

- Never mutate GitHub state without explicit confirmation.
- Never infer acceptance criteria without flagging assumptions.
- Always preserve AC traceability in the task plan.
- Keep drafts in `.tmp/` before any publish action.
- In publish/repair mode, treat missing `Issue Type` or missing parent linkage as a failure until post-flight checks pass.
- Prefer GitHub MCP tools for create/update/verify steps and document exact tool arguments used.
