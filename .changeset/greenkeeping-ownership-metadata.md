---
"fusion-issue-author-bug": patch
"fusion-issue-author-feature": patch
"fusion-issue-author-task": patch
"fusion-issue-author-user-story": patch
"fusion-issue-authoring": patch
"fusion-skill-authoring": patch
"fusion-skill-self-report-bug": patch
"fusion-github-review-resolution": patch
"fusion-issue-solving": patch
"fusion-issue-task-planning": patch
"fusion-mcp": patch
---

Add required ownership metadata (`metadata.owner`, `metadata.status`) to all skills. Owner is set to `@equinor/fusion-core` (repository default) and status is set according to skill lifecycle (`active` for production skills, `experimental` for early-stage skills). Sponsor metadata was considered but is not required for MVP. Resolves equinor/fusion-core-tasks#474.
