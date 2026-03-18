---
"fusion-issue-authoring": minor
---

Consolidate issue-authoring capability into a single skill with agent modes

- Merge type-specific drafting logic from 4 subordinate skills into agent mode files (`agents/*.agent.md`)
- Move all 10 issue templates into `assets/issue-templates/` within this skill
- Update orchestrator to route to internal agent modes instead of external subordinate skills
- Retain full 8-step workflow, shared gates, caching strategy, and MCP mutation sequencing

Resolves equinor/fusion-core-tasks#802
