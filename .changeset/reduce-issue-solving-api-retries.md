---
"fusion-issue-solving": patch
---

Improve issue-solving workflow reliability under GitHub API limits by documenting a low-token execution strategy.

- Require reuse of fetched issue context instead of repeated reads
- Add MCP-first guidance for issue workflow mutations and lookups
- Add explicit no-retry-loop behavior for rate-limit failures
- Extend the workflow checklist with token-usage and fallback controls

resolves equinor/fusion-core-tasks#535
