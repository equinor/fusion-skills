# Task Plan Draft — User Story

## Experimental caveat
EXPERIMENTAL: This workflow is not yet stable and may change.

## Skill availability
- Drafting mode: {orchestrated | direct-subordinate | inline}
- `fusion-issue-authoring`: {available | not installed}
- `fusion-issue-author-task`: {available | not installed}

## Run mode
- Mode: {draft-only | draft+publish-ready | publish-now}
- Planning depth: {minimal | standard | detailed}

## Issue context
- Issue: {owner/repo#number}
- Title: {title}
- Story: {as a / i want / so that}

## Ancestors and relevant links
- Parent/ancestor chain:
  - {owner/repo#x}
  - {owner/repo#y}
- Relevant links:
  - {issue/pr/doc url}
  - {issue/pr/doc url}

## Acceptance criteria anchors
- {criterion 1}
- {criterion 2}
- {criterion 3}

## Acceptance-criteria traceability
- AC-1 -> Task {n}, Task {m}
- AC-2 -> Task {n}
- AC-3 -> Task {n}, Task {m}

## Ordered implementation tasks
- [ ] Task 1 — {objective}
  - Sequence: {01}
  - Acceptance criteria: {ac refs}
  - Scope boundary: {in/out}
  - Deliverable: {artifact}
  - Verification: {test/check}
- [ ] Task 2 — {objective}
  - Sequence: {02}
  - Acceptance criteria: {ac refs}
  - Scope boundary: {in/out}
  - Deliverable: {artifact}
  - Verification: {test/check}

## Dependency notes
- Task {n} depends on Task {m} because {reason}

## Generated task issue drafts
- Draft: `.tmp/TASK-{2-digit-sequence}-{slug}.md`
  - Proposed title: {title}
  - Sequence: {n}
  - Depends on: {task refs}

## Publish plan (requires explicit confirmation)
- Publish path: {orchestrated via fusion-issue-authoring | subordinate-draft via fusion-issue-author-task then publish via orchestrator or direct MCP | direct MCP (orchestrator absent)}
- Runtime tool naming:
  - `fusion-issue-authoring` convention: `issue_write`, `issue_read`, `search_issues`, `sub_issue_write`
  - Alternate MCP bindings: `mcp_github_issue_write` (or `mcp_github2_issue_write`), `mcp_github_issue_read`, `mcp_github_search_issues`, `sub_issue_write`
- MCP create tool:
  - `issue_write` with `method=create`, `owner`, `repo`, `title`, optional `body`, `labels`, `type=Task`
- MCP repair tool:
  - `issue_write` with `method=update`, `owner`, `repo`, `issue_number`, optional `labels`, `type=Task`
- MCP parent-link tool:
  - `sub_issue_write` with `method=add`, `owner`, `repo`, `issue_number={parent-number}`, `sub_issue_id={child-issue-id}`
- MCP verification tools:
  - `search_issues` with `query` (+ optional `owner`, `repo`, `perPage`)
  - `issue_read` with `method=get` (and `method=get_labels` when labels are required)
- Parent/sub-issue linkage is a separate mutation after create/update; it is not part of `issue_write method=create` arguments.
- Apply sub-issue ordering from planned sequence
- Optional: parent summary comment with created issue links

## Post-flight report
- `{owner}/{repo}#{n}` | exists: {yes/no} | type: {actual} | parent: {actual} | status: {ok/fixed/failed}

## Assumptions
- Assumption: {explicit assumption}

## Blockers (if any)
- Blocker: {what is blocked}
  - Why: {reason}
  - Next action: {required user input or system step}

## Risks and open questions
- Risk: {risk}
- Question: {question}

## Status
Status: Awaiting user approval
