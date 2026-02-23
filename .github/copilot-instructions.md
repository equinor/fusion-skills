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
