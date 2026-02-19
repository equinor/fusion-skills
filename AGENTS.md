# AGENTS

Audience: GitHub Copilot / coding agents making changes in this repository.

This repository is a shared catalog of Fusion GitHub Copilot Agent Skills. Treat it like a library: changes should be small, reviewable, and security-first.

## Where to look first

- Consumer overview: `README.md`
- Maintainer workflow: `CONTRIBUTING.md`
- Security policy: `SECURITY.md`
- Script-specific agent rules: `scripts/AGENTS.md`

## Operating principles

- Optimize for safety, clarity, and maintainability over cleverness.
- Prefer minimal diffs; avoid unrelated refactors.
- Follow existing repository conventions.
- If requirements are ambiguous, ask targeted questions.

## Practical checklist

- Keep changes scoped to the request.
- Avoid introducing new global governance unless explicitly requested.
- Ensure Markdown docs render correctly on GitHub.

## Security baseline

- Never request, store, or print secrets.
- Redact sensitive data in examples/logs.
- Prefer read-only operations by default.
- Avoid risky automation patterns (for example remote-script execution).

## Skills changes

When creating or editing skills, follow `CONTRIBUTING.md` and `.github/copilot-instructions.md`.

## Custom instruction files

- Repository-wide Copilot instructions: `.github/copilot-instructions.md`
- Path-specific instructions: `.github/instructions/*.instructions.md`
- Agent instructions: nearest `AGENTS.md` in directory tree takes precedence.
