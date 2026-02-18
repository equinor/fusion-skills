# Fusion Skills

This repository is the shared home for Fusion team GitHub Copilot Agent Skills.

## Purpose and scope

This repo:
- Collects reusable Agent Skills that encode repeatable workflows (planning, triage, reviews, runbooks, etc.).
- Provides a consistent structure so skills can be installed in a project or in a user profile.

This repo is not:
- A general documentation site for Fusion (put long-form docs in the relevant product repos).
- A place for secrets, tokens, or environment-specific configuration.
- A dumping ground for one-off prompts; keep skills focused, maintained, and owned.

## Repository structure (Agent Skills standard)

Skills live in:

`skills/<skill-name>/SKILL.md`

Each `SKILL.md` must include YAML frontmatter with at least `name` and `description`.

Example:

```markdown
---
name: my-skill
description: One sentence describing when to use it.
---

# When to Activate
...
```

Common optional folders (use only when needed):
- `skills/<skill-name>/references/` - Longer docs, checklists, examples.
- `skills/<skill-name>/assets/` - Images or other static assets referenced by the skill.
- `skills/<skill-name>/scripts/` - Helper scripts used by the skill (treat as sensitive; see Security).

## Consume skills in GitHub Copilot

Use the `skills` CLI to install and keep skills up to date.

### Project install (recommended for team sharing)

Installs into `.github/skills/` in the current repository.

```bash
npx skills add equinor/fusion-skills
```

To see what skills are available before installing:

```bash
npx skills add equinor/fusion-skills --list
```

### Personal install (recommended for local experimentation)

Installs globally for your user (Copilot user-level skills).

```bash
npx skills add equinor/fusion-skills -g
```

### Update

Update all installed skills to the latest versions:

```bash
npx skills update
```

### Remove

Interactive remove:

```bash
npx skills remove
```

Remove specific skills:

```bash
npx skills remove <skill-name>
```

## Install / update mechanics

Fusion supports installing skills via the `skills` CLI (which manages what is copied into the project/global skills locations). Avoid committing symlinks as an installation mechanism.

## Security note

Skills may reference scripts. Treat everything under `scripts/` as security-sensitive code:
- Review scripts like any other code change (ownership + PR review).
- Do not add secrets; never log or print credentials.
- Prefer least-privilege execution and avoid running scripts from untrusted sources.
