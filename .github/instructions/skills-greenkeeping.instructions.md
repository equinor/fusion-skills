---
applyTo: "skills/**"
---

# Skills greenkeeping instructions

Apply this guidance when maintaining existing skills in `skills/**`.

## Goal

Keep the skill catalog discoverable, current, high-quality, secure, and owned as it grows.

## Greenkeeping activities and triggers

Run greenkeeping when any of the following happens:

- A PR changes `skills/**` content (`SKILL.md`, `assets/**`, `references/**`, `scripts/**`).
- A new skill is added or an existing skill is moved, deprecated, or removed.
- MCP server requirements or compatibility expectations change.
- A scheduled maintenance sweep is due (recommended cadence: at least monthly).
- A reliability or security incident identifies stale/unsafe skill guidance.

For each greenkeeping run, cover all activity lanes:

1. Discovery audit (activation cues, tags, findability)
2. Currency audit (metadata, dependencies, compatibility)
3. Quality audit (structure, completeness, references)
4. Security audit (unsafe patterns, secret exposure risk)
5. Ownership and lifecycle audit (owner/sponsor, status, deprecation path)

## Metadata standards and currency checks

Each skill must retain required frontmatter from baseline standards:

- `name`
- `description`
- `metadata.version`

Greenkeeping additionally requires ownership metadata:

- `metadata.owner` (required): primary accountable maintainer.
  - Use a stable GitHub identity (`@user` or `@org/team`).
  - Avoid personal names without GitHub identity.
- `metadata.sponsor` (optional): backup accountability owner (team or maintainer).

Discovery and currency checks:

- `description` clearly states what the skill does and when to use it.
- `metadata.tags` remains present and relevant to current scope.
- `metadata.mcp.required` and `metadata.mcp.suggested` match actual tool needs.
- `metadata.role`, `metadata.orchestrator`, and `metadata.skills` remain internally consistent.
- `compatibility` text (if present) reflects current prerequisites.
- Existing skill `metadata.version` is not manually bumped in regular PRs; use changesets and release automation flow.

## Quality gates and validation checklist

Before completion, verify each touched skill against this checklist:

- Includes clear “When to use” and “When not to use” guidance.
- Declares required inputs and expected outputs.
- Includes safety constraints appropriate to its actions.
- Keeps long content in `references/` and actionable assets in `assets/`.
- Avoids stale examples, broken links, and contradictory instructions.
- Has explicit owner accountability (`metadata.owner`).

Run validation commands from repository root:

```bash
npx -y skills add . --list
bun run validate:skills
```

Conditional validation when relevant files changed:

```bash
bun run validate:graphql
bun run validate:scripts
```

CI additionally enforces ShellCheck for changed `skills/**/scripts/**` files.

## Security audit procedure

For each touched skill:

1. Review instructions and scripts for unsafe command patterns.
2. Block remote-script execution patterns (for example `curl ... | sh` or equivalent).
3. Confirm no secrets, tokens, credentials, or sensitive literals are requested, hardcoded, logged, or persisted.
4. Confirm destructive actions require explicit user confirmation.
5. Ensure network access and side effects are explicit and justified.
6. Apply `.github/instructions/skills-scripts-safety.instructions.md` for any `skills/**/scripts/**` edits.

## Lifecycle workflow (add → update → deprecate → remove)

Use this lifecycle for every skill:

1. **Add**
   - Create with complete metadata, safety boundaries, and owner.
   - Validate discoverability and baseline checks.
2. **Update**
   - Keep metadata current and examples accurate.
   - Record scope with changeset entries when required by PR policy.
3. **Deprecate**
   - Mark status as deprecated (`metadata.status: deprecated`).
   - Add clear replacement/migration guidance and expected removal window.
   - Retain owner accountability until removal completes.
4. **Remove**
   - Remove only after deprecation criteria are met, unless security response requires immediate removal.
   - Clean references from orchestrators, companion metadata, and docs.

## PR evidence expectations for greenkeeping work

When reporting completion, include:

- Touched skills and why they were greenkept.
- Ownership updates (`metadata.owner`/`metadata.sponsor`) made.
- Lifecycle action taken per skill (add/update/deprecate/remove).
- Validation commands run and outcomes.
- Security findings and remediations.

## Guardrails

Never:

- claim a check passed without running it,
- introduce hidden network calls or remote code execution patterns,
- weaken safety constraints for convenience,
- manually edit generated release artifacts (`README.md`, root `CHANGELOG.md`, `skills/**/CHANGELOG.md`).
