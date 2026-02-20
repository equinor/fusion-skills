# Versioning and release flow

## Versioning policy

This repository uses semantic versioning for both repository releases and individual skills.

- **Repository releases**: tag as `vMAJOR.MINOR.PATCH`
- **Skill metadata**: `metadata.version` is managed by release automation (do not edit manually in non-release PRs)
- **PR changesets**: when a skill changes, add or update a `.changeset/*.md` entry using `major|minor|patch`
- **Consumer safety**: encourage pinned installs for production (`npx skills add equinor/fusion-skills@vX.Y.Z`)

SemVer meaning in this repo:

- **MAJOR**: breaking changes to required inputs, outputs, or behavior expectations
- **MINOR**: backward-compatible capability additions or guidance improvements
- **PATCH**: safe fixes, clarifications, and non-breaking refinements

## Releasing changes

1. Add a `.changeset/*.md` file describing skill-level bump(s) and impact in skill-changing PRs
	- Use lower-case GitHub closing keywords when closure is intended.
	- Prefer `resolves` with direct references (for example `resolves owner/repo#123`).
	- Use `fixes` or `closes` only when those verbs are more accurate.
	- Remember that changeset text can be propagated into release PR/changelog content and may close issues when the release PR merges.
2. Let release automation apply affected skill `metadata.version` bumps
3. Tag the repository release
4. Document behavior impact and migration notes in release notes/changelog

## Changeset release flow

Skill-changing PRs must include `.changeset/*.md` entries, for example:

```yaml
---
"fusion-skill-authoring": minor
---
```

On `main`, release automation runs with Bun scripts:

- `bun run release:prepare` applies changesets, bumps `package.json`, and updates root `CHANGELOG.md`
- `bun run release:finalize` validates/extracts release notes from root `CHANGELOG.md` for `package.json.version`

Automation branch behavior:

- `release/skills` is expected to be deleted after merge
- it is recreated automatically on the next release cycle

Workflows:

- `.github/workflows/release-pr.yml` creates/updates the release PR
- `.github/workflows/publish-release.yml` validates changelog heading, tags, and publishes GitHub release
