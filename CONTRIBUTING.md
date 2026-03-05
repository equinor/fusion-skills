# Contributing to Fusion Skills

Thank you for helping improve Fusion’s shared GitHub Copilot Agent Skills.

## Code of conduct

Contribute in a professional, inclusive, and respectful way. Assume good intent, communicate clearly, and keep feedback constructive.

We value contributions that are:
- clear and easy to review,
- scoped to one problem at a time,
- documented with enough context for maintainers.

## Security first

Do not expose secrets, credentials, or sensitive internal data in prompts, commits, issues, or documentation.

For vulnerability reporting, follow [SECURITY.md](SECURITY.md) and Equinor CSIRT guidance:
- https://www.equinor.com/about-us/csirt

## Follow Equinor policies

Contributions must follow applicable Equinor policies, internal governance, and legal/compliance requirements.

If a contribution could have legal, compliance, data handling, or operational impact, align early with the relevant owner before merging.

## Skills greenkeeping

All skills must maintain clear ownership and current metadata. See [Greenkeeping Guide](contribute/greenkeeping.md) for:
- Ownership and lifecycle requirements (`metadata.owner`, `metadata.status`)
- When greenkeeping is triggered (every PR, periodic audits)
- Currency checks (versions, dependencies, MCP compatibility)
- Security audits (anti-patterns, secrets, unsafe scripts)
- Deprecation workflow (timeline, replacement, communication)

All skills are validated automatically in CI — ensure your changes pass:
- `bun run validate:skills` — skill inventory and structure
- `bun run validate:ownership` — ownership metadata completeness
- `bun run validate:scripts` — script safety and intent comments

## Pull request expectations

Before requesting review, make sure your PR is:
- focused and minimal,
- safe by default (no secret handling, no hidden side effects),
- uses Conventional Commit messages,
- runs lint/format checks before commit operations (`bun run biome:check`; use `bun run biome:fix` when needed),
- uses single-scope changesets (`.changeset/*.md`): one skill/package change per file,
- includes greenkeeping metadata if adding/updating skills (owner, status, tags),
- clear about what changed and why.

If you are unsure about direction, open a draft PR early and ask for feedback.

## Full contribution guide

Use the full maintainer workflow in [contribute/README.md](contribute/README.md).
