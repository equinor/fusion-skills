---
"fusion-issue-task-planning": patch
---

Add explicit devil's-advocate review step before task draft generation

Inserts a new step 6 that inspects the proposed task set for architecture-ambiguity signals before any drafts are generated. When two or more signals are present (unresolved design decisions, implicit backend/frontend contracts, vague sequencing, contested ownership), the workflow automatically routes to interrogator mode without requiring a user trigger. In draft-only mode with unresolved ambiguities, an `⚠ Ambiguity warning` block is emitted at the top of the plan preview.

resolves equinor/fusion-skills#132
