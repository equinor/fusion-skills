---
applyTo: "skills/**"
---

# Skills authoring instructions (repo overrides)

Apply when creating or modifying `skills/**`.
This file intentionally keeps only repository-specific overrides.
Naming, ownership, release, validation, local-example rules grouped below.
Use `skills/fusion-skill-authoring/SKILL.md` as the canonical authoring workflow.

## Precedence

- Use `skills/fusion-skill-authoring/SKILL.md` for end-to-end skill authoring workflow and behavior.
- Where any rule in that file conflicts with a rule in this file, this file's rule takes precedence for this repository.

## Repository overrides

- Portable default naming: `custom-<base-skill-name>`. Override with rules below.
- Prefix defaults:
  - internal repository-owned skills: `fusion-`
  - external/user-created skills: `custom-`
- Placement defaults:
  - use `skills/` for active repository-managed skills
  - use `skills/.experimental/` for preview, in-development, or not-yet-curated skills
  - use `skills/.curated/` only when a skill is intentionally being placed in the curated lane
  - use `skills/.system/` only for internal/system skills and shared building blocks
  - use `skills/.deprecated/` for skills that have been superseded and are pending removal
- Before creating, check `skills/`, `skills/.experimental/`, and `skills/.curated/`; check `skills/.system/` for building blocks. `skills/.deprecated/` scanned by CI but not for new work.
- Initial version default for new skills in this repository: `"0.0.0"`.
- **Ownership metadata (required):**
  - `metadata.owner`: Primary accountable maintainer (GitHub identity: `@user` or `@org/team`). Use repository team `@equinor/fusion-core` as default.
  - `metadata.status`: Lifecycle state of the skill. Must be one of: `active`, `experimental`, `deprecated`, `archived`. Use `active` for stable production skills, `experimental` for new/unstable skills.
  - `metadata.sponsor` (optional): Secondary owner or team providing backup accountability.
- Never manually edit generated release artifacts:
  - root `README.md`
  - root `CHANGELOG.md`
  - any `skills/**/CHANGELOG.md`

Author portable skill first, layer repository rules on top before marking complete.

## Required validation

Run from repository root after making changes to skill metadata or functionality:

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

Required local dev contract even though installed skill describes validation generically.

## Repository completion gate

Before marking skill PR ready, verify:

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

Use for richer patterns that shouldn't ship as skill package dependencies:

- `skills/fusion-issue-authoring/SKILL.md` for agent-mode routing, shared safety gates, and draft-first mutation flow
- `skills/fusion-skill-self-report-bug/SKILL.md` for concise conditional flow and clear confirmation boundaries

## Related instructions

- For maintenance/quality sweeps, apply `.github/instructions/skills-greenkeeping.instructions.md`.
- For `skills/**/scripts/**`, apply `.github/instructions/skills-scripts-safety.instructions.md`.
- For issue/PR handling, apply `.github/instructions/pr-workflow.instructions.md`.

## Guardrails

Never:

- request or expose secrets/credentials,
- run destructive commands without explicit confirmation,
- claim validation passed without running the commands.

## Governance handoff for mutation-capable skills

Skills that can commit, push, rebase, open, or update pull requests are **mutation-capable** and must stay portable. They must not hard-code repository-specific workflow rules.

When mutation-capable skill operates in repo with workflow instructions, defer to repo-local rules for:

- commit message conventions and granularity,
- required validation and lint commands before push,
- changeset requirements and scope rules,
- PR template usage, base-branch selection, and issue-linking conventions,
- merge strategy, branch-refresh policy, and review-request workflow.

Repo-local instructions take precedence. Don't duplicate repo-local policy in skill; reference at point of use.

Each mutation-capable skill must include in **Safety & constraints**:

> This skill is mutation-capable. Repository-local workflow instructions take precedence over inline guidance when they conflict.

Skill-local agents handling source-control mutations: defer to repo-local instructions for commit conventions, validation, changeset requirements, branch-refresh policy.
