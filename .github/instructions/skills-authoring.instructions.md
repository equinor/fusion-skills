---
applyTo: "skills/**"
---

# Skills authoring instructions (repo overrides)

Apply this guidance when creating or modifying skills in `skills/**`.
This file intentionally keeps only repository-specific overrides.
Keep repository-only naming, ownership, release, validation, and local-example guidance here rather than in the installable skill package.
Use `skills/fusion-skill-authoring/SKILL.md` as the canonical authoring workflow.

## Precedence

- Follow `skills/fusion-skill-authoring/SKILL.md` for end-to-end skill authoring behavior.
- If any instruction conflicts with this file, this file takes precedence for this repository.

## Repository overrides

- Portable default naming from the installed skill is `custom-<base-skill-name>`. Override that default in this repository with the rules below.
- Prefix defaults:
  - internal repository-owned skills: `fusion-`
  - external/user-created skills: `custom-`
- Placement defaults:
  - use `skills/` for active repository-managed skills
  - use `skills/.experimental/` for preview, in-development, or not-yet-curated skills
  - use `skills/.curated/` only when a skill is intentionally being placed in the curated lane
  - use `skills/.system/` only for internal/system skills and shared building blocks
- Local discovery and reuse checks should inspect `skills/`, `skills/.experimental/`, and `skills/.curated/` before creating a new skill; inspect `skills/.system/` as well when looking for internal building blocks or shared foundations.
- Initial version default for new skills in this repository: `"0.0.0"`.
- **Ownership metadata (required):**
  - `metadata.owner`: Primary accountable maintainer (GitHub identity: `@user` or `@org/team`). Use repository team `@equinor/fusion-core` as default.
  - `metadata.status`: Lifecycle state of the skill. Must be one of: `active`, `experimental`, `deprecated`, `archived`. Use `active` for stable production skills, `experimental` for new/unstable skills.
  - `metadata.sponsor` (optional): Secondary owner or team providing backup accountability.
- Generated release artifacts must not be edited manually in skill authoring/update work:
  - root `README.md`
  - root `CHANGELOG.md`
  - any `skills/**/CHANGELOG.md`

Author the portable skill package first, then layer these repository rules on top before treating the work as complete in this repository.

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

These validation commands are part of the local development contract for this repository even though the installed skill only describes validation generically.

## Repository completion gate

Before considering a skill change PR ready in this repository, verify:

- `metadata.version`, `metadata.owner`, and `metadata.status` are present where required by repository policy
- `metadata.version` was not manually bumped for an existing skill; new skills start at `"0.0.0"`
- each touched skill has a single-scope `.changeset/*.md` entry
- role/composition metadata (`metadata.role`, `metadata.orchestrator`, `metadata.skills`) is internally consistent when present
- required validation evidence was recorded for:
  - `npx -y skills add . --list`
  - `bun run validate:skills`
  - `bun run validate:ownership`
- conditional validation ran when relevant:
  - `bun run validate:graphql`
  - `bun run validate:scripts`

## Local examples

Use these repository-local skill examples when you need richer patterns that should not ship as dependencies of the installed skill package:

- `skills/fusion-issue-authoring/SKILL.md` for orchestrator routing, shared safety gates, and draft-first mutation flow
- `skills/fusion-skill-self-report-bug/SKILL.md` for concise conditional flow and clear confirmation boundaries
- focused issue-author subskills for narrow scope and strong anti-triggers

## Related instructions

- For maintenance/quality sweeps, apply `.github/instructions/skills-greenkeeping.instructions.md`.
- For `skills/**/scripts/**`, apply `.github/instructions/skills-scripts-safety.instructions.md`.
- For issue/PR handling, apply `.github/instructions/pr-workflow.instructions.md`.

## Guardrails

Never:

- request or expose secrets/credentials,
- run destructive commands without explicit confirmation,
- claim validation passed without running the commands.
