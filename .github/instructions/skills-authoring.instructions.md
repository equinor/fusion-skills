---
applyTo: "skills/**"
---

# Skills authoring instructions (repo overrides)

Apply this guidance when creating or modifying skills in `skills/**`.
This file intentionally keeps only repository-specific overrides.
Use `skills/fusion-skill-authoring/SKILL.md` as the canonical authoring workflow.

## Precedence

- Follow `skills/fusion-skill-authoring/SKILL.md` for end-to-end skill authoring behavior.
- If any instruction conflicts with this file, this file takes precedence for this repository.

## Repository overrides

- Prefix defaults:
  - internal repository-owned skills: `fusion-`
  - external/user-created skills: `custom-`
- Initial version default for new skills in this repository: `"0.0.0"`.
- **Ownership metadata (required):**
  - `metadata.owner`: Primary accountable maintainer (GitHub identity: `@user` or `@org/team`). Use repository team `@equinor/fusion-core` as default.
  - `metadata.status`: Lifecycle state of the skill. Must be one of: `active`, `experimental`, `deprecated`, `archived`. Use `active` for stable productions skills, `experimental` for new/unstable skills.
  - `metadata.sponsor` (optional): Secondary owner or team providing backup accountability.
- Generated release artifacts must not be edited manually in skill authoring/update work:
  - root `README.md`
  - root `CHANGELOG.md`
  - any `skills/**/CHANGELOG.md`

## Required validation

Run from repository root after skill authoring updates:

```bash
npx -y skills add . --list
bun run validate:skills
bun run validate:ownership
```

When relevant files changed, also run:

```bash
bun run validate:graphql
bun run validate:scripts
```

## Related instructions

- For maintenance/quality sweeps, apply `.github/instructions/skills-greenkeeping.instructions.md`.
- For `skills/**/scripts/**`, apply `.github/instructions/skills-scripts-safety.instructions.md`.
- For issue/PR handling, apply `.github/instructions/pr-workflow.instructions.md`.

## Guardrails

Never:

- request or expose secrets/credentials,
- run destructive commands without explicit confirmation,
- claim validation passed without running the commands.
