---
"fusion-skills": minor
---

Add `fusion-skills` skill — agentic entrypoint for all Fusion skill lifecycle operations

New skill with four focused agents:
- **discovery** — find skills by task, list installed skills, proactive promotion via Fusion MCP semantic search
- **greenkeeper** — install, update, remove, check for updates, and set up automated sync/discovery workflows
- **author** — clarify and redirect skill creation/improvement requests to `fusion-skill-authoring`
- **warden** — inspect SKILL.md for quality smells; report skill failures via inline bug drafting (supersedes `fusion-skill-self-report-bug`)

Includes `references/sync-workflows.md` (canonical workflow YAML patterns), `references/skill-catalog.md` (MCP fallback lookup), `references/follow-up-questions.md` (per-agent tiebreakers), and `assets/issue-templates/skill-workflow-failure-bug.md` (bug report template from deprecated skill).

Resolves equinor/fusion-core-tasks#470
