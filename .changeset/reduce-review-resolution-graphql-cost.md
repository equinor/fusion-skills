---
"fusion-github-review-resolution": patch
---

Add GraphQL cost awareness section to review-resolution skill to enforce conservative mutation pacing and secondary rate-limit handling.

- Document per-mutation secondary cost (5 points) and per-query cost (1 point)
- Require at least 1-second pause between consecutive GraphQL mutation calls
- Require respect for `retry-after` headers before retrying on rate-limit errors

resolves equinor/fusion-core-tasks#535
