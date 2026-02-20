# Quality and safety

## PR quality bar

A contribution is ready when the skill is:

- **Clear**: a new teammate understands when to run it
- **Specific**: expected outputs are concrete
- **Deterministic-ish**: branching is minimized and questions are targeted
- **Safe**: forbidden actions are explicit (secrets, destructive actions, policy violations)
- **Scoped**: one workflow done well

For skills that include `scripts/`:
- **Reviewed**: at least one owner review
- **Documented**: usage and side effects documented in `SKILL.md` or `references/`
- **No secrets**: never read, print, or require credentials in docs or code

## Scripts (extra scrutiny)

Anything under `skills/fusion-<skill-name>/scripts/` is treated as security-sensitive:

- Prefer small, auditable scripts
- Avoid downloading/executing remote code
- Avoid `curl | bash` patterns
- Prefer read-only behavior by default
- Document expected side effects and required permissions

If a script can modify repos, delete files, or perform network actions, the skill must:

1. call this out explicitly,
2. provide a safe dry-run approach where feasible,
3. require explicit user confirmation.

## Deprecation and superseding

When a skill is no longer recommended:

1. Mark deprecation clearly at the top of `SKILL.md`
2. If a replacement exists, include:
   - replacement skill name,
   - what changed and why migration is recommended
3. Keep deprecated skills available long enough for migration unless blocked by security concerns

When superseding, prefer creating a new folder for the new skill and deprecating the old skill with a clear pointer.
