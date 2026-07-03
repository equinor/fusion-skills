---
"fusion-skill-authoring": patch
---

Detect installed-copy provenance before editing an existing skill

Adds a new Step 1 that checks `skills-lock.json` before editing an existing
`SKILL.md` or its supporting files. If the target matches a locked entry whose
`source` differs from the current repository, it is an installed copy — the
skill now surfaces the source repo and redirects there (or offers to draft an
issue) instead of silently editing a copy that would be overwritten on the
next update.
