---
"fusion-discover-skills": patch
---

Tighten GraphQL fallback guidance in discover-skills to minimize point cost and avoid retries on rate-limit errors.

- Require small `first`/`last` values and shallow connections for catalog queries
- Do not retry on rate-limit errors; surface the failure and suggest retrying later

resolves equinor/fusion-core-tasks#535
