---
"fusion-skill-self-report-bug": patch
---

Deprecate `fusion-skill-self-report-bug` in favour of the `warden` agent in `fusion-skills`

The bug reporting workflow has been inlined into `fusion-skills/agents/warden.agent.md`, which also adds proactive frustration detection and skill smell inspection. The `fusion-skill-self-report-bug` skill is no longer needed as a standalone install.

Resolves by supersession — use `fusion-skills` instead.
