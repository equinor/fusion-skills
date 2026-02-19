# AGENT

Audience: GitHub Copilot / coding agents making changes in this repository.

This repo is a shared catalog of Fusion GitHub Copilot Agent Skills. Treat it like a library: changes should be small, reviewable, and security-first.

## Where to look first

- Consumer-facing overview: `README.md`
- Maintainer workflow / quality bar: `CONTRIBUTING.md`
- Security policy / disclosure: `SECURITY.md`

## Operating principles

- Optimize for **safety**, **clarity**, and **maintainability** over cleverness.
- Prefer minimal diffs. Avoid refactors unrelated to the request.
- Don’t invent new rigid repo-wide structure. Follow existing conventions where they exist.
- If requirements are ambiguous, ask targeted questions instead of guessing.

## Practical checklist

Before you open a PR or commit:

- Keep changes scoped to the request.
- Don’t add governance/process docs unless explicitly requested.
- Don’t introduce new mandatory structure for all skills (this is a general skills repo).
- Ensure docs are GitHub-flavored Markdown and render cleanly.

## Security rules (be defensive)

- Never request, store, or print secrets (tokens, keys, cookies, credentials).
- Avoid including sensitive log excerpts or real credentials in docs/examples; redact.
- Prefer read-only operations by default; call out side effects explicitly.
- Avoid risky automation patterns (e.g., `curl | bash`, running remote scripts).

### Scripts (`skills/**/scripts/`)

Anything under `scripts/` is security-sensitive:
- Treat it like production code: small, auditable, deterministic.
- Avoid hidden network calls and surprising side effects.
- Document prerequisites and side effects.
- If something could delete/overwrite/modify repos, require explicit user confirmation.

If you touch `scripts/`, assume it needs deeper maintainer review.

## When adding or changing a skill

Follow the maintainer guidance in `CONTRIBUTING.md` (metadata + instructions + examples). At minimum:

- Keep the entrypoint (`SKILL.md`) skimmable.
- Use progressive disclosure (`references/`) for long docs.

## Documentation alignment

- README is for consumers.
- CONTRIBUTING is for maintainers.
- AGENT is for agent behavior.

Avoid duplicating content across these files; prefer links.
