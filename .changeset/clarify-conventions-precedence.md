---
"fusion-code-conventions": patch
---

Clarify default rules vs repository-level precedence for agents

- Add "Precedence and applicability" section to SKILL.md establishing resolution order: repo policy > tooling config > skill defaults
- Add applicability callout to all four convention reference files (TypeScript, React, C#, Markdown)
- Guide maintainers to record overrides in CONTRIBUTING.md, contributor guides, or ADRs

Refs: equinor/fusion-core-tasks#842
