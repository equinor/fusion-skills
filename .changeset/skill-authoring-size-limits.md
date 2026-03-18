---
"fusion-skill-authoring": patch
---

Document SKILL.md size limits and CI guardrails

- Document 300-line recommended limit (triggers CI warning)
- Document 500-line hard limit (fails CI)
- Clarify expectation to move overflow to references/ early
- Add failure signal for exceeding size thresholds

Relates to: equinor/fusion-core-tasks#84
