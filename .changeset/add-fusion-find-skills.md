---
"fusion-discover-skills": minor
---

Add an experimental MCP-backed skills discovery skill that routes user requests through the Fusion skills index and returns actionable next-step guidance.

- Detect query, install, update, and remove intent before calling the skills MCP tool
- Preserve advisory lifecycle commands exactly when MCP returns them
- Allow GitHub MCP, shell listing, and GraphQL-backed discovery fallback when Fusion MCP is unavailable
- Add a follow-up question bank for vague requests so discovery can narrow to the right skill before searching
- Place the first iteration in the experimental skill lane
- Require explicit low-confidence handling instead of guessed matches

resolves equinor/fusion-core-tasks#412