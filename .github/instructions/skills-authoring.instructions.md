---
applyTo: "skills/**"
---

# Skills authoring instructions

Apply this guidance when creating or modifying skills in `skills/**`.

## When to apply

Use this guidance for requests like:
- "Create a new skill for ..."
- "Scaffold `skills/<name>/SKILL.md`"
- "Set up skill frontmatter and guardrails"

## Required inputs

Collect before writing files:
- Base skill name in kebab-case (`<skill-name>`, without prefix)
- Prefix choice:
  - internal repository-owned skills: default `fusion-`
  - external/user-created skills: default `custom-`
- Final skill name:
  - internal repository-owned skills: `fusion-<skill-name>` unless intentionally overridden
  - external/user-created skills: `custom-<skill-name>` unless intentionally overridden
- Target placement (`skills/<final-skill-name>/`, `skills/.experimental/<final-skill-name>/`, or `skills/.curated/<final-skill-name>/`)
- Initial semantic version (`MAJOR.MINOR.PATCH`, default `0.0.0` for skills created in this repository)
- License for frontmatter (default `MIT`)
- One-sentence purpose for frontmatter `description`
- Expected outputs (files, commands, summary)
- Safety boundaries for the skill

If required inputs are missing, ask targeted follow-up questions first.

## Authoring principles

- Keep `SKILL.md` concise and skimmable.
- Prefer clear defaults over many alternatives.
- Write `description` in third person and include what it does and when to use it.
- Use consistent terminology throughout the skill.
- Avoid time-sensitive instructions unless explicitly marked legacy.

## Metadata requirements

Frontmatter must include:
- `name`
- `description`
- `metadata.version`

Field constraints:
- `name`:
  - max 64 characters
  - lowercase letters, numbers, hyphens only
  - no XML tags
  - must not include platform-reserved words
- `description`:
  - non-empty
  - max 1024 characters
  - no XML tags
  - includes discovery cues (what + when)
- `metadata.version`:
  - semantic version (`MAJOR.MINOR.PATCH`)
  - quoted YAML string (for example `"0.0.0"`)
- `metadata`:
  - prefer string-to-string key/value pairs
  - arrays are allowed when modeling explicit skill relationships (for example `metadata.skills`)
  - `metadata.tags`: optional list of free-form lowercase kebab-case strings for discoverability
  - avoid nested objects under `metadata`
- `license` and `compatibility`:
  - optional top-level fields
  - do not nest under `metadata`

## Structure and progressive disclosure

1. Create `<target>/<final-skill-name>/SKILL.md`.
2. Add folders as needed:
   - `references/` for long guidance
   - `assets/` for templates/checklists/static resources
   - `scripts/` only for deterministic executable operations
3. Keep references one level deep from `SKILL.md`.
4. Use forward-slash paths only.
5. If a reference file exceeds ~100 lines, include a table of contents.
6. Keep `SKILL.md` under ~500 lines; split long content.

## Scaffold workflow

1. Confirm scope and target path.
2. Confirm prefix and derive `<final-skill-name>`.
3. Validate required inputs and metadata constraints.
4. Create `SKILL.md` and needed support folders/files.
5. Populate sections:
   - When to use
   - When not to use
   - Required inputs
   - Instructions/workflow
   - Expected output
   - Safety & constraints
6. For complex tasks, include explicit step-by-step workflows/checklists.
7. Add validation → fix → re-validate feedback loop where needed.

## Output requirements

Final response should include:
- Created/updated file paths
- Commands run for validation
- Validation result and interpretation
- Any follow-up action needed

Use this baseline for new `SKILL.md` files:

```markdown
---
name: <final-skill-name>
description: <what it does + when to use it>
license: MIT
metadata:
  version: "<initial-version>"
  tags:
    - <tag>
---

# <Readable Skill Title>

## When to use

## When not to use

## Required inputs

## Instructions

## Expected output

## Safety & constraints
```

## Validation command

Run from repo root:

```bash
npx -y skills add . --list
```

Pass criteria:
- Exit code is `0`
- Skill is discoverable/valid in output
- No metadata/path errors

If validation fails:
- Fix frontmatter (`name`, `description`)
- Verify path and `SKILL.md`
- Re-run and report final status

## Ready-to-merge checklist

- Metadata and path are valid
- Description is specific and includes activation cues
- Safety boundaries are explicit
- Expected output is concrete
- Validation run with pass evidence
- Long guidance moved to `references/`
- Workflow steps are clear for complex tasks

## Guardrails

Never:
- Request or expose secrets/credentials
- Run destructive commands without explicit confirmation
- Invent repository structure beyond request
- Claim validation passed without running the command
