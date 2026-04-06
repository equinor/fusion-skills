---
"fusion-issue-authoring": patch
---

Make draft location flexible — check user preferences and session memory before defaulting to `.tmp/`

- Step 4 now checks user preferences and session memory for a preferred draft location
- Asks once when intent is ambiguous and remembers the answer for the session
- Falls back to `.tmp/{TYPE}-{CONTEXT}.md` only when no preference is found
