---
"fusion-issue-authoring": patch
"fusion-issue-solving": patch
"fusion-github-review-resolution": patch
"fusion-issue-task-planning": patch
"fusion-dependency-review": patch
"fusion-discover-skills": patch
---

Make all GitHub-API-consuming skills more conservative with token usage.

- `fusion-issue-authoring`: concrete session-cache flow for labels and assignee candidates; per-session budget table
- `fusion-issue-solving`: expanded low-token strategy with session-cache references and budget awareness
- `fusion-github-review-resolution`: token budget guidance for thread-heavy reviews; cache PR metadata once
- `fusion-issue-task-planning`: session-cache delegation rules and batch-size warning for large task plans
- `fusion-dependency-review`: explicit data-reuse rules across parallel advisor fan-out
- `fusion-discover-skills`: tighter GraphQL budget and call-count cap for discovery sessions

resolves equinor/fusion-core-tasks#797