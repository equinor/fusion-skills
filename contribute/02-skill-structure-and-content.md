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
- `metadata.skills`: list of subordinate skill names (orchestrators only)
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

## Format background

- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://agentskills.io/specification
