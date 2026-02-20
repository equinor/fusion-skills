---
"fusion-issue-authoring": minor
"fusion-issue-author-bug": minor
"fusion-issue-author-feature": minor
"fusion-issue-author-user-story": minor
"fusion-issue-author-task": minor
---

Implements `equinor/fusion-core-tasks#395` (sub-task of `#391`) by restructuring issue authoring skills into a top-level orchestrator plus type-specific specialists.

Refs: `equinor/fusion-core-tasks#391`

Closes: `equinor/fusion-core-tasks#395`

Scope delivered:
- `fusion-issue-authoring` is now the orchestration layer for shared gates (classification, labels, assignee, confirmation, publish flow).
- Added specialist skills: `fusion-issue-author-bug`, `fusion-issue-author-feature`, `fusion-issue-author-user-story`, and `fusion-issue-author-task`.
- Specialist skills now explicitly depend on `fusion-issue-authoring` and keep only type-specific guidance.
- Moved fallback templates from shared assets to each specialist skill’s own `assets/issue-templates/`.
- Added label listing helpers: `list-labels.sh` and `list-labels.ps1`.
- Hardened relationship scripts for reliable GraphQL calls and idempotent "already linked" handling.
