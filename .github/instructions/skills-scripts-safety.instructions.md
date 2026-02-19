---
applyTo: "skills/**/scripts/**"
---

# Skill scripts safety instructions

Apply this guidance when authoring, reviewing, or changing scripts under `skills/**/scripts/**`.

Purpose: guardrail script authoring for downstream users. Treat scripts as blueprint artifacts: consuming agents may adapt how they execute or apply them, so safety must be encoded in intent, constraints, and documentation.

## Guard-dog mode (mandatory)

- Assume script changes are risky until proven safe for downstream execution.
- Block unsafe patterns; do not “wave through” questionable behavior.
- If safety is unclear, ask for clarification or require safer alternatives.
- Keep recommendations minimal, explicit, and security-first.

## Authoring-time threat model (mandatory)

- Evaluate scripts as distributed artifacts, not local one-off helpers.
- Assume scripts may run in unknown environments with real credentials present.
- Assume consuming agents may modify command composition, sequencing, or parameters.
- Minimize blast radius if a user runs the script with elevated permissions.
- Require explicit documentation of risks, side effects, and prerequisites.

## Safety baseline (mandatory)

- Assume hostile or malformed input by default.
- Validate and sanitize all external inputs before use.
- Never request, read, print, or persist secrets/credentials/tokens.
- Never execute remote code directly (no download-and-run patterns).
- Never embed telemetry, tracking, or opaque outbound calls.
- Avoid hidden network access and undocumented side effects.
- Encode non-negotiable safety constraints in comments/docs so adapted execution still preserves intent.

## Defensive checks (mandatory)

- Prefer safe defaults and fail-closed behavior.
- Fail fast with actionable, non-sensitive error messages.
- Use explicit guards for file paths, environment inputs, and command arguments.
- Avoid destructive operations unless explicitly requested and confirmed.
- Keep behavior deterministic and auditable.
- Prefer idempotent and bounded operations so adapted execution reduces risk.

## Distribution and install safety (mandatory)

- Do not rely on implicit local state that consumers may not have.
- Avoid commands that modify global machine state unless explicitly documented and justified.
- Prefer dry-run/simulation mode where practical.
- Ensure scripts are understandable without external hidden context.
- Document invariants and preconditions that must remain true even if a consuming agent adapts implementation details.

## What to flag as blockers

- Any secret handling or secret exposure risk.
- Any remote-code execution pattern.
- Any undocumented destructive side effect.
- Any hidden network call.
- Any unvalidated external input path.
- Any behavior that is unsafe for installed-skill consumers by default.

## Output expectation

When assessing `skills/**/scripts/**` changes, provide:

- concise safety findings,
- explicit blockers (if any),
- required remediations to reach safe baseline,
- validation evidence that risky paths were checked,
- downstream execution risk notes for skill consumers,
- blueprint invariants that consuming agents must preserve.

## Code hygiene (secondary)

- Keep scripts small, focused, and easy to audit.
- Use clear naming and predictable control flow.
- Add language-appropriate documentation/comments where behavior is non-obvious or security-sensitive.
- Do not add unnecessary third-party dependencies.
- Prefer standard library/runtime APIs first.

## Validation and documentation

- Add or update tests for non-trivial logic and bug fixes.
- Document side effects, prerequisites, and limitations in the skill docs.
- Document consumer-facing usage with safe defaults and required confirmations.
- Include validation evidence in PRs for script changes.
