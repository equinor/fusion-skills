---
"fusion-issue-authoring": minor
"fusion-issue-author-bug": minor
"fusion-issue-author-feature": minor
"fusion-issue-author-task": minor
"fusion-issue-author-user-story": minor
"fusion-skill-authoring": minor
---

Adds structured frontmatter metadata for discoverability and clarifies skill relationship semantics.

Scope delivered:
- Added `metadata.tags` to affected skills for discoverability.
- Renamed relationship keys to a clearer schema: `skill_role` → `role`, `required_skill` → `orchestrator`, `sub_skills` → `skills`.
- Updated dependent role value from `subskill` to `subordinate` to explicitly indicate orchestrator dependency.
- Updated skill authoring guidance to document `metadata.role`, `metadata.orchestrator`, `metadata.skills`, and `metadata.tags`.
