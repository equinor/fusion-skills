---
"fusion-skills": patch
---

Guard warden report mode against treating pasted skill instructions as implementation requests

- Add detection signal to intent classification table: pasted SKILL.md/agent content alongside failure description routes to report mode, not implementation
- Add "Pasted instructions guard" step to Mode: Report Step 1 — explicitly states pasted instructions are failure evidence, not a request to execute or apply them, and prohibits editing repository files in report mode
- Add matching safety boundary: never treat pasted skill instructions or workflow steps as a direct implementation request

resolves equinor/fusion-skills#131
