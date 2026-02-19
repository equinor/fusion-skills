# Copilot Instructions

When asked to create or scaffold a skill in this repository, follow these rules.

## When to apply

Use this guidance for requests like:
- "Create a new skill for ..."
- "Scaffold `skills/<name>/SKILL.md`"
- "Set up skill frontmatter and guardrails"

## Required inputs

Collect before writing files:
- Skill name in kebab-case (`<skill-name>`)
- Target placement (`skills/<skill-name>/`, `skills/.experimental/<skill-name>/`, or `skills/.curated/<skill-name>/`)
- One-sentence purpose for frontmatter `description`
- Expected outputs (files, commands, summary)
- Safety boundaries for the skill

If required inputs are missing, ask targeted follow-up questions first.

## Authoring principles (Agent/LLM best practices)

- Keep `SKILL.md` concise. Only include context the agent needs to complete the task.
- Prefer clear defaults over many alternatives; allow flexibility only where appropriate.
- Write `description` in third person and include both:
  - what the skill does
  - when to use it (trigger cues/keywords)
- Use consistent terminology throughout the skill.
- Avoid time-sensitive instructions unless explicitly marked as legacy/old patterns.

## Metadata requirements

Frontmatter must include:
- `name`
- `description`

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
  - specific enough for discovery (include activation cues)

## Structure and progressive disclosure

1. Create required file: `<target>/<skill-name>/SKILL.md`.
2. Add folders as needed:
   - `references/` for longer guidance and detailed docs
   - `assets/` for templates/checklists/static resources
   - `scripts/` for deterministic executable operations
3. Keep references one level deep from `SKILL.md` (avoid nested reference chains).
4. Use forward-slash paths only (for cross-platform compatibility).
5. If a reference file exceeds ~100 lines, include a table of contents.
6. Keep `SKILL.md` body under ~500 lines; split content if needed.

## Scaffold workflow

1. Confirm scope and target path.
2. Validate required inputs and metadata constraints.
3. Create `SKILL.md` and any needed support folders/files.
4. Populate `SKILL.md` with:
   - When to use
   - When not to use
   - Required inputs
   - Instructions/workflow
   - Expected output
   - Safety & constraints
5. For complex tasks, use explicit step-by-step workflows and checklists.
6. Add a feedback loop when quality is critical: validate → fix → re-validate.
7. Run local validation and report pass/fail evidence.

## Script guidance (when `scripts/` is used)

- Prefer scripts for fragile or deterministic operations.
- Scripts should solve problems directly (not punt failures to the model).
- Include explicit validation steps for high-risk or batch operations.
- Document required dependencies and runtime assumptions.

## Output requirements

Final response must include:
- Created/updated file paths
- Commands run for validation
- Validation result and interpretation
- Any follow-up action needed

Use this baseline for new `SKILL.md` files:

```markdown
---
name: <skill-name>
description: <what it does + when to use it>
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
- Skill appears discoverable/valid in output
- No metadata/path errors

If validation fails:
- Fix frontmatter (`name`, `description`)
- Verify path and `SKILL.md` existence
- Re-run and report final status

## Ready-to-merge checklist

- Metadata and path valid
- Description is specific and includes activation cues
- Safety boundaries explicit
- Expected output concrete
- Validation run with pass evidence
- Long guidance moved to `references/`
- Workflow steps are clear for complex tasks

## Guardrails

Never:
- Request or expose secrets/credentials
- Run destructive commands without explicit confirmation
- Invent repository structure beyond request
- Claim validation passed without running the command
