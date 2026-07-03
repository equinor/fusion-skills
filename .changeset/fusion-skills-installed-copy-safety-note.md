---
"fusion-skills": patch
---

Clarify installed-copy safety guidance in the entrypoint

The entrypoint's Safety section now states explicitly that installed skill
files are copies (per `skills-lock.json`), and points to `author.agent.md`
(content fixes, redirects to `fusion-skill-authoring`) and `warden.agent.md`
(failure reports) instead of editing them in place. This is visible even when
`fusion-skill-authoring` itself is not installed alongside `fusion-skills`.
