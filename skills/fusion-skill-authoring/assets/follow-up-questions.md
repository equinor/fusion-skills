# Follow-up questions

Use these when required inputs are missing or ambiguous while creating a new skill.

## Scope

- What is the base skill name in kebab-case (without prefix)?
- What prefix should be used (`custom-`, repo/org-specific prefix like `fusion-`, or none)?
- What is the final skill name after applying the prefix choice?
- What initial semantic version should be used (`MAJOR.MINOR.PATCH`, default `0.0.0` for skills created in this repository)?
- Where should it be placed: `skills/`, `skills/.experimental/`, or `skills/.curated/`?
- Is this a net-new skill or an update to an existing one?

## Purpose

- What outcome should this skill help the user achieve?
- What concrete task(s) should the user be able to complete with this skill?
- What should success look like after the skill runs (files, decisions, or actions)?
- What user triggers should activate this skill?
- What should this skill explicitly avoid doing?

## Outputs

- Which files should be created by default (`SKILL.md`, `references/`, `scripts/`, `assets/`)?
- Should any starter content be included in `references/` or `assets/`?
- Do you want examples in `SKILL.md` or kept in `references/`?

## Safety and constraints

- Are there any destructive actions this skill must never perform?
- Are there security/privacy constraints beyond default guardrails?
- Should commands require explicit confirmation before execution?

