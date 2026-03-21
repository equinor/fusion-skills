---
"fusion-rules": minor
---

Add fusion-rules gateway skill for AI coding assistant rule authoring

Gateway entrypoint that detects the target editor (GitHub Copilot, Cursor, Claude Code) and routes to the matching agent for guided rule scaffolding.

- `agents/copilot.agent.md` — GitHub Copilot instructions workflow
- `agents/cursor.agent.md` — Cursor project rules workflow
- `agents/claude-code.agent.md` — Claude Code rules workflow
