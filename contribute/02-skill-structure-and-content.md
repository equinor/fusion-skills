# Skill structure and content

## Minimum content expectations for SKILL.md

`SKILL.md` is the entry point. It should be easy to skim and clearly explain:
- what the skill does,
- when to use it,
- what it outputs,
- and what safety constraints apply.

## Frontmatter requirements

Include YAML frontmatter with:
- `name`: matches folder name; lowercase letters, numbers, hyphens
- `description`: what the skill does and when to use it
- `metadata.version`: semantic version (for example `"0.0.0"`)
- `metadata`: primarily string key/value pairs; arrays allowed for explicit relationship fields (for example `metadata.skills`)
- `metadata.role`: `"orchestrator"` for top-level skills; `"subordinate"` for skills that require their orchestrator to run
- `metadata.orchestrator`: name of the required orchestrator skill (subordinates only)
- `metadata.skills`: optional list of related/companion skill names for composition and routing hints
- `metadata.tags`: optional list of free-form lowercase kebab-case strings for discoverability (for example `["github", "issue-authoring"]`)
- `metadata.mcp`: optional map for MCP server requirements
  - `metadata.mcp.required`: list of required MCP servers
  - `metadata.mcp.suggested`: list of suggested MCP servers
- `license` and `compatibility`: optional top-level fields when needed

## Content requirements

Each skill should cover:
- **When to use** (activation criteria)
- **When not to use** (anti-patterns)
- **Expected output** (files, commands, summary)
- **Inputs** (repo context, env vars, links, etc.)
- **Safety & constraints** (secrets, destructive commands, approvals)

## Recommended baseline template

```markdown
---
name: fusion-example-skill
description: What it does + when to use it (trigger guidance).
license: MIT
metadata:
  version: "0.0.0"
  tags:
    - example-tag
  mcp:
    suggested:
      - github
---

# Example Skill

## Instructions

Provide clear, step-by-step guidance. Ensure the instructions cover:
- when to use / when not to use
- expected output
- required inputs
- safety constraints (especially around scripts / destructive commands)

## Examples (optional but strongly encouraged)

### Example
User: ...
Agent: ...
```

## Progressive disclosure

Keep `SKILL.md` lean. Prefer:
- `SKILL.md` for activation rules, summary steps, and constraints
- `references/` for long explanations, checklists, screenshots, and deeper background

Guideline: if a section exceeds roughly one page, move it to `references/` and link to it.

## SKILL.md size limits

SKILL.md files are loaded into agent context windows. Oversized files cause token exhaustion, instruction dilution, and unreliable behavior across runtimes. These limits are enforced by CI (`validate:skill-sizes`).

| Feature | Grok (custom agents) | Claude Skills (SKILL.md) | GitHub Copilot (custom agents/skills) |
|---|---|---|---|
| Hard max (chars) | ~4,000–5,000 (observed truncation) | None strict; soft ~500 lines | 30,000 chars (custom agents prompt); skills softer |
| Recommended lines | 30–70 (sweet spot 40–60) | <500 (ideal); 150–400 common | 100–500+ possible, but aim <300–400 for reliability |
| Preferred / safe zone | 800–2,500 tokens | 2k–5k tokens | 5k–15k tokens per agent/skill (test heavily) |
| Risk at high end | Forgetting/dilution >3k tokens | Degradation >500 lines | Token exhaustion in 64k window; quality drop |
| Best for complex skills | Split or chain via reminders | Progressive disclosure / refs | Split skills; use refs/scripts; explicit agent selection |

### Repository thresholds

- **Warning at 300 lines**: SKILL.md is getting large. Consider moving content to `references/`.
- **Error at 500 lines**: SKILL.md is too large for reliable cross-platform behavior. Must split.

When a skill needs more than 300 lines of guidance, use progressive disclosure:
- Keep core activation, workflow steps, and safety in `SKILL.md`
- Move detailed examples, platform notes, and checklists to `references/`
- Move templates and reusable artifacts to `assets/`

## Format background

- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://agentskills.io/specification
