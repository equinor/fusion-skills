---
"fusion-issue-task-planning": patch
---

Shift publish/repair execution in `fusion-issue-task-planning` to delegated handling through `fusion-issue-authoring` (prefer sub-agent invocation), while keeping this skill focused on planning and draft generation.

Clarifies that MCP-first mutation and GraphQL fallback behavior are enforced by the delegated authoring workflow.

Removes local `fusion-issue-task-planning/assets/graphql/` fallback files and points fallback usage to `fusion-issue-authoring/assets/graphql/`.

refs equinor/fusion-skills#40
resolves equinor/fusion-core-tasks#446
