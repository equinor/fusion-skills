---
name: fusion-skill-authoring
description: "Creates or scaffolds a new skill in a repository with valid metadata, activation cues, resource folders, safety boundaries, and validation evidence. USE FOR: create a skill, scaffold SKILL.md, add a new skill, new agent skill, set up skill metadata and guardrails. DO NOT USE FOR: editing existing product code, large refactors of existing skills, or non-skill repository changes."
license: MIT
compatibility: Works best with a GitHub MCP server for issue creation and skill discovery.
metadata:
   version: "0.2.2"
   status: active
   owner: "@equinor/fusion-core"
   tags:
      - skill-authoring
      - scaffolding
   mcp:
      suggested:
         - github
---

# Create Skill

## When to use

Use this skill when you need to create a new skill under `skills/` and want a valid, maintainable `SKILL.md`.

Typical triggers (skill should activate on all of these):

**Explicit user requests:**
- "Create a skill for ..."
- "Scaffold `skills/<name>/SKILL.md`"
- "Add a new skill with proper metadata and guardrails"
- "Help me create a skill that does X"
- "Set up a new agent skill"
- "I need a skill for ..."

**Implicit / agent-detected:**
- A capability is missing and the user or agent concludes a new skill would provide it
- The user asks to package a workflow or process into a reusable, installable skill

## When not to use

Do not use this skill for:
- Editing product/application code outside `skills/`
- Large refactors of existing skills unless explicitly requested
- Running destructive commands or making unrelated repository changes

## Required inputs

Collect before writing files:
- Base skill name in kebab-case (`<skill-name>`, without prefix)
- Prefix choice (ask explicitly; suggest `custom-` by default unless the repository has its own convention)
- Final skill name (`custom-<skill-name>` unless the user chooses a different prefix or none)
- Target path (`skills/<final-skill-name>/`, `skills/.experimental/<final-skill-name>/`, or `skills/.curated/<final-skill-name>/`)
- Initial semantic version for frontmatter metadata (`MAJOR.MINOR.PATCH`, default `0.0.0` for skills created in this repository)
- License for frontmatter (`MIT` by default, or repository-specific choice)
- One-sentence purpose for frontmatter `description`
- Expected output (files, commands, summary)
- Safety boundaries

Validate metadata constraints:
- `name`: <= 64 chars, lowercase letters/numbers/hyphens only, no XML tags, and no platform-reserved words
- `description`: non-empty, <= 1024 chars, no XML tags, includes both what it does and when to use it
  - **Best practice**: use a single-quoted YAML string with inline `USE FOR:` and `DO NOT USE FOR:` keywords — this maximises agent discovery and skill routing accuracy
  - Example: `description: 'Does X and Y. USE FOR: case A, case B. DO NOT USE FOR: case C.'`
- `metadata.version`: semantic version string (`MAJOR.MINOR.PATCH`) in quoted YAML format
- `metadata.owner`: **required** for greenkeeping: GitHub user (`@username`) or team (`@org/team-name`); default for this repository: `@equinor/fusion-core`
- `metadata.status`: **required** for greenkeeping: `active`, `experimental`, `deprecated`, or `archived`; default: `active` for new skills
- `metadata`: primarily string key/value map; arrays allowed for explicit relationship fields, avoid nested objects
  - `metadata.role`: `"orchestrator"` or `"subordinate"` (subordinates cannot run without their orchestrator)
  - `metadata.orchestrator`: required orchestrator skill name (subordinates only)
  - `metadata.skills`: list of subordinate skill names (orchestrators only)
  - `metadata.tags`: optional list of lowercase kebab-case strings for discoverability
  - `metadata.sponsor`: optional secondary owner/team providing backup accountability
  - `metadata.mcp`: optional map for MCP server needs (`required` and `suggested` lists)
- `license`: optional top-level field (not inside `metadata`)
- `compatibility`: optional top-level field (not inside `metadata`); include when the skill has specific environment requirements (tools, MCP servers, network access); adding it raises skill quality score to High tier

**Note**: All skills must include `metadata.owner` and `metadata.status` for greenkeeping validation. See [Greenkeeping Guide](../../contribute/greenkeeping.md) for details.

If required inputs are missing, ask concise targeted questions first.
Use `assets/follow-up-questions.md` as the default question bank.

## Instructions

1. Check whether an existing skill already covers the request:
   - Run `npx -y skills add . --list`
   - If an existing skill matches, recommend using/updating that skill instead of creating a duplicate
   - If a skill almost matches, open/recommend a repository issue to request tweaks to that existing skill instead of creating a new custom skill
   - Prioritize reuse of repository skills to avoid proliferation of one-off custom skills
2. Confirm scope, base skill name, prefix choice, and target path.
3. Derive `<final-skill-name>` from prefix choice.
4. Create `<target>/<final-skill-name>/SKILL.md`.
5. Create resource directories as needed:
   - `references/` for longer guidance and detailed docs
   - `assets/` for templates/checklists/static resources
   - `scripts/` only when deterministic automation is required
6. Write frontmatter that satisfies constraints:
   - Use a single-quoted YAML string for `description` to avoid escaping issues
   - Include `USE FOR:` and `DO NOT USE FOR:` inline in the description for High-tier discoverability
   - Add `compatibility` if the skill has specific tool or environment requirements
7. Add the core sections:
   - When to use
   - When not to use
   - Required inputs
   - Instructions
   - Expected output
   - Safety & constraints
8. Keep `SKILL.md` concise; move long guidance/examples to `references/`.
9. Use `assets/` for templates, sample files, and static resources used by the skill.
10. Add `scripts/` only when deterministic automation is required.
11. When inputs are missing, ask from `assets/follow-up-questions.md` and proceed once answered.

## Expected output

Return:
- Created/updated file paths
- Validation command(s) run
- Pass/fail result with interpretation
- Any required follow-up actions
- Any unresolved follow-up questions (if user input was still missing)
- Whether an existing skill was reused, and if an issue was created/recommended for an almost-match

For a newly scaffolded skill, the default structure should be:

```text
skills/<final-skill-name>/
├── SKILL.md
├── references/
└── assets/
```

Use this baseline for generated `SKILL.md` files:

```markdown
---
name: <final-skill-name>
description: '<what it does>. USE FOR: <trigger phrases>. DO NOT USE FOR: <anti-triggers>.'
license: MIT
compatibility: <optional: required tools or MCP servers>
metadata:
   version: "<initial-version>"
   status: active
   owner: <owner-github-identity>
   tags:
      - <tag>
---

# <Skill Title>

## When to use

## When not to use

## Required inputs

## Instructions

## Expected output

## Safety & constraints
```

## Validation

Run from repo root:

```bash
npx -y skills add . --list
```

Pass criteria:
- Exit code is `0`
- New skill appears discoverable/valid
- No metadata/path errors

If validation fails:
- Fix frontmatter (`name`, `description`)
- Verify path and `SKILL.md` existence
- Re-run and report final status

## Ready-to-merge checklist

Use `assets/ready-to-merge-checklist.md` as a lightweight PR gate.

## Safety & constraints

Never:
- Request or expose secrets/credentials
- Run destructive commands without explicit user confirmation
- Invent validation results
- Modify unrelated files outside requested scope
- Add hidden network-fetch or unsafe script guidance without explicit request
