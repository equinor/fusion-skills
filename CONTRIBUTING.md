# Contributing to Fusion Skills

Thanks for helping improve Fusion’s shared GitHub Copilot Agent Skills.

This repo is intentionally small and strict: skills are meant to be reusable, owned, and safe.

## Quick start (add a new skill)

1. Choose where the skill belongs (stable vs preview vs system).

   Reserved folders under `skills/` (names starting with `.`) are conventions used in this repo:
   - `skills/.experimental/<skill-name>/` – preview / in-development skills (closest thing to a “preview” convention)
   - `skills/.curated/<skill-name>/` – curated, high-confidence skills intended for broad reuse
   - `skills/.system/` – internal/system skills and shared building blocks (not generally intended for broad, direct use)

   If you are unsure, start in `skills/.experimental/` and promote later.

2. Create the skill folder: `skills/<skill-name>/` (or `skills/.experimental/<skill-name>/`, etc.)
   - Use **kebab-case** for `<skill-name>`.
   - Keep the name stable; it becomes the installation identifier.

3. Add the required file: `skills/<skill-name>/SKILL.md`

4. (Optional) Add supporting folders only if needed:
   - `skills/<skill-name>/references/` – long docs, checklists, examples (preferred over bloating `SKILL.md`)
   - `skills/<skill-name>/assets/` – images/static assets referenced by docs
   - `skills/<skill-name>/scripts/` – helper scripts (security-sensitive; see “Scripts”)

5. Add ownership:
   - Update `.github/CODEOWNERS` to include an explicit rule for `skills/<skill-name>/`.

6. Open a PR.
   - If your skill adds or modifies anything under `scripts/`, expect deeper review.

## Minimum required content for `SKILL.md`

`SKILL.md` is the entry point. It should be **easy to skim** and tell a user:
- what the skill does,
- when to use it,
- what it outputs,
- and what safety constraints apply.

### Required structure

- YAML frontmatter with:
  - `name`: must match the folder name
  - `description`: one sentence describing the value and when to use it

- Headings/sections that cover:
  - **When to use** (activation criteria)
  - **When not to use** (anti-patterns / when to choose a different skill)
  - **Expected output** (what the agent should produce: files, commands, a summary, etc.)
  - **Inputs** (what the user must provide: repo context, env vars, links, etc.)
  - **Safety & constraints** (data handling, secrets, destructive commands, approvals)

### Example skeleton

```markdown
---
name: example-skill
description: One sentence describing when to use it.
---

# When to use

# When not to use

# Expected output

# Inputs

# Safety & constraints
```

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
- **Owned**: CODEOWNERS entry exists for the skill folder.

For skills that include `scripts/`:
- **Reviewed**: at least one owner review (treat like production code).
- **Documented**: script usage documented in `SKILL.md` or `references/`.
- **No secrets**: never read, print, or require credentials in code or docs.

## Scripts (extra scrutiny)

Anything under `skills/<skill-name>/scripts/` is considered security-sensitive:

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

1. Update `skills/<skill-name>/SKILL.md` to clearly mark it as deprecated at the top.
2. If there is a replacement, include:
   - the replacement skill name, and
   - what changed / why users should migrate.
3. Keep deprecated skills around long enough for users to migrate unless there is a security reason.

When superseding a skill, prefer:
- creating a new folder for the new skill,
- and deprecating the old one with a clear pointer.

## Questions

If you’re unsure about naming, safety constraints, or ownership, open a draft PR early and ask in the PR description.
