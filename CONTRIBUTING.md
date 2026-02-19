# Contributing to Fusion Skills

Thanks for helping improve Fusion’s shared GitHub Copilot Agent Skills.

Skills are meant to be reusable, owned, and safe. This guide describes the maintainer workflow and the quality bar.

## Quick start (add a new skill)

1. Choose where the skill belongs (stable vs preview vs system).

   Reserved folders under `skills/` (names starting with `.`) are conventions used in this repo:
   - `skills/.experimental/fusion-<skill-name>/` – preview / in-development skills (closest thing to a “preview” convention)
   - `skills/.curated/fusion-<skill-name>/` – curated, high-confidence skills intended for broad reuse
   - `skills/.system/` – internal/system skills and shared building blocks (not generally intended for broad, direct use)

   If you are unsure, start in `skills/.experimental/` and promote later.

2. Create the skill folder: `skills/fusion-<skill-name>/` (or `skills/.experimental/fusion-<skill-name>/`, etc.)
   - Use **kebab-case** for `<skill-name>`.
   - Prefix with `fusion-` by default in this repository.
   - Keep the name stable; it becomes the installation identifier.

3. Add the required file: `skills/fusion-<skill-name>/SKILL.md`

4. (Optional) Add supporting folders only if needed:
   - `skills/fusion-<skill-name>/references/` – long docs, checklists, examples (preferred over bloating `SKILL.md`)
   - `skills/fusion-<skill-name>/assets/` – images/static assets referenced by docs
   - `skills/fusion-<skill-name>/scripts/` – helper scripts (security-sensitive; see “Scripts”)

5. Open a PR.
   - If your skill adds or modifies anything under `scripts/`, expect deeper review.

## Local pre-PR checks

Run this from repo root before opening or updating a PR:

```bash
bun install --frozen-lockfile
bun run test
bun run biome:check
bunx tsc --noEmit -p tsconfig.json
bun run validate:skills
GITHUB_BASE_REF=main bun run validate:pr
```

If you are not on a PR branch, `validate:pr` can be skipped.

## Minimum content expectations for `SKILL.md`

`SKILL.md` is the entry point. It should be **easy to skim** and tell a user:
- what the skill does,
- when to use it,
- what it outputs,
- and what safety constraints apply.

### What it must cover

- Include YAML frontmatter (Agent Skills metadata) with:
   - `name`: matches the folder name (lowercase letters, numbers, hyphens)
   - `description`: brief description of what the skill does **and when to use it**
   - `metadata.version`: semantic version for that skill (for example `1.0.0`)
   - `metadata`: string-to-string key/value map (metadata values should be strings)
   - `license` and `compatibility` as optional top-level fields when needed

- Content that covers:
  - **When to use** (activation criteria)
  - **When not to use** (anti-patterns / when to choose a different skill)
  - **Expected output** (what the agent should produce: files, commands, a summary, etc.)
  - **Inputs** (what the user must provide: repo context, env vars, links, etc.)
  - **Safety & constraints** (data handling, secrets, destructive commands, approvals)

### Example skeleton

```markdown
---
name: fusion-example-skill
description: What it does + when to use it (trigger guidance).
license: MIT
metadata:
   version: "1.0.0"
---

# Example Skill

## Instructions

Provide clear, step-by-step guidance. Ensure the instructions cover:
- when to use / when not to use
- expected output
- required inputs
- safety constraints (especially around scripts / destructive commands)

## Examples (optional but strongly encouraged)

### Example
User: ...
Agent: ...
```

For format background, see the Agent Skills overview and specification:
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://agentskills.io/specification

## Progressive disclosure (keep `SKILL.md` lean)

Prefer:
- `SKILL.md` for the activation rules + steps summary + safety constraints.
- `references/` for long explanations, large checklists, screenshots, and deep background.

Guideline: if a section is more than ~1 page, move it to `references/` and link to it.

## Quality bar (PR checklist)

A PR is “good enough” when the skill is:

- **Clear**: a new teammate can understand when to run it.
- **Specific**: avoids vague prompts like “do the thing”; includes concrete expected output.
- **Deterministic-ish**: minimizes branching; asks the user targeted questions only when required.
- **Safe**: explicitly states what it must never do (secrets, destructive actions, policy violations).
- **Scoped**: does one workflow well; not a catch-all.

For skills that include `scripts/`:
- **Reviewed**: at least one owner review (treat like production code).
- **Documented**: script usage documented in `SKILL.md` or `references/`.
- **No secrets**: never read, print, or require credentials in code or docs.

## Scripts (extra scrutiny)

Anything under `skills/fusion-<skill-name>/scripts/` is considered security-sensitive:

- Prefer small, auditable scripts.
- Avoid downloading/executing remote code.
- Avoid “curl | bash” patterns.
- Prefer read-only operations by default.
- Document expected side effects and required permissions.

If a script can modify repos, delete files, or perform network actions, the skill must:
- call this out explicitly,
- provide a safe “dry run” approach where feasible,
- and require explicit user confirmation.

## Deprecation and superseding

When a skill is no longer recommended:

1. Update `skills/fusion-<skill-name>/SKILL.md` to clearly mark it as deprecated at the top.
2. If there is a replacement, include:
   - the replacement skill name, and
   - what changed / why users should migrate.
3. Keep deprecated skills around long enough for users to migrate unless there is a security reason.

When superseding a skill, prefer:
- creating a new folder for the new skill,
- and deprecating the old one with a clear pointer.

## Questions

If you’re unsure about naming, safety constraints, or ownership, open a draft PR early and ask in the PR description.

## Versioning policy

This repository uses semantic versioning for both releases and individual skills.

- **Repository releases**: tag releases as `vMAJOR.MINOR.PATCH`
- **Skill metadata**: set `metadata.version` in each skill's frontmatter
- **PR changesets**: when a skill changes, add/update a `.changeset/*.md` entry for each changed skill using `major|minor|patch`
- **Consumer safety**: encourage pinned installs for production via `npx skills add equinor/fusion-skills@vX.Y.Z`

SemVer meaning in this repo:

- **MAJOR**: breaking changes to required inputs, outputs, or behavior expectations
- **MINOR**: backward-compatible capability additions or guidance improvements
- **PATCH**: safe fixes (typos, clarifications, non-breaking refinements)

When releasing:

1. Bump the affected skill version(s) in frontmatter metadata.
2. Add a `.changeset/*.md` file describing the skill-level bump(s) and impact.
3. Tag the repository release.
4. Document model-behavior impact and migration notes in release notes/changelog.

## Changeset release flow

- Skill-changing PRs must include `.changeset/*.md` entries such as:

```yaml
---
"fusion-skill-authoring": minor
---
```

- On `main`, release automation runs with Bun scripts:
   - `bun run release:prepare` to apply changesets and generate `.changeset/release.md`
   - `bun run release:finalize` to bump package version, update root changelog, and remove `.changeset/release.md`
   - the automation branch `release/skills` is expected to be deleted after merge and is recreated automatically on the next release cycle
- Workflows:
   - `.github/workflows/release-pr.yml` creates/updates the release PR
   - `.github/workflows/publish-release.yml` commits finalize changes, tags, and publishes GitHub release

## CI validation split

Validation workflows are separated to reduce unrelated CI noise:

- `.github/workflows/validate-skills.yml`
   - runs on `skills/**` and `.changeset/**`
   - checks skill discovery/consistency and PR version+changeset rules
- `.github/workflows/validate-scripts.yml`
   - runs on `scripts/**` and script-tooling files (`biome.json`, `tsconfig.json`, `package.json`, `bun.lock`)
   - runs tests (`bun run test`), checks formatting/linting (`bun run biome:check`), and TypeScript (`bunx tsc --noEmit -p tsconfig.json`)
