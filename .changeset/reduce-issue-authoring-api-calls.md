---
"fusion-issue-authoring": patch
---

Reduce token-heavy issue authoring behaviors by tightening MCP-first mutation sequencing and fallback guidance.

- Replace redundant two-pass issue update guidance with single-call-first `issue_write` sequencing
- Clarify cache-first behavior for labels and issue types to avoid repeated lookups
- Add explicit rate-limit handling guidance that avoids retry loops and preserves local draft state
- Tighten duplicate-search guidance to one focused pass unless scope changes

resolves equinor/fusion-core-tasks#535
