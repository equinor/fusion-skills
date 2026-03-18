# Copilot Instructions

Repository-wide guidance for Copilot in this repository.

## Scope

- Keep this file concise and global.
- Put detailed, domain-specific rules in `.github/instructions/*.instructions.md`.

## Path-specific instructions

- For skill authoring and updates in `skills/**`, follow `.github/instructions/skills-authoring.instructions.md`.
- For scripts inside skills (`skills/**/scripts/**`), follow `.github/instructions/skills-scripts-safety.instructions.md`.
- For repository script changes in `scripts/**`, follow `.github/instructions/scripts-code-rules.instructions.md`.
- For pull request preparation and updates, follow `.github/instructions/pr-workflow.instructions.md`.

## Skill discovery defaults

- For local skill discovery in this repository, search `skills/` first.
- Include `skills/` and `skills/.experimental/` in local `.agents/skills` lookup paths for this workspace.

## SKILL.md size limits

- SKILL.md files must stay under 500 lines (CI error threshold).
- SKILL.md files above 300 lines trigger a CI warning — consider moving content to `references/`.
- See `contribute/02-skill-structure-and-content.md` for the cross-platform size rationale and progressive disclosure guidance.

## Maintainer docs

- For maintainer workflow and policy context, use `contribute/README.md` and the topic files in `contribute/`.

## Contributor parity

Copilot is a repository contributor and must follow the same standards as human contributors, including `CONTRIBUTING.md` and maintainers guidance in `contribute/` for all relevant changes.

## Global guardrails

- Keep changes minimal and scoped to the request.
- Never request, expose, or store secrets/credentials.
- Do not run destructive commands without explicit user confirmation.
- Do not invent validation outcomes; run commands and report actual results.
- For skill create/update PRs, never manually edit generated release artifacts:
	- root `README.md`
	- root `CHANGELOG.md`
	- any `skills/**/CHANGELOG.md`
	These are maintained by release automation.
