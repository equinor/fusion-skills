# Repository scripts standards

This document defines the engineering standard for the repository-level scripts folder.

It applies to all code under scripts/, including tests and helper modules.

## 1 What scripts are

The scripts folder contains repository automation for:

- skill and changeset discovery,
- PR validation,
- release preparation and release finalization,
- consistency checks used by maintainers and CI.

These scripts are part of the delivery pipeline. Treat them as production tooling.

## 2 Why we keep this in code

We use scripts to make critical workflows:

- repeatable across contributors,
- deterministic across local and CI execution,
- auditable in pull requests,
- safer than manual, ad-hoc command sequences.

## 3 Current script domains

The scripts folder currently includes these domains:

- scripts/list-skills/
- scripts/list-changesets/
- scripts/validate-skills/
- scripts/validate-pr/
- scripts/release-prepare/
- scripts/release-finalize/
- scripts/__tests__/

If you add a new domain, include a README in that folder and document the new command entrypoint in package.json.

## 4 Non-negotiable rules

These rules are mandatory for script changes.

### 4.1 Security and data handling

- Never read, print, store, or require secrets, credentials, tokens, or private keys.
- Never execute remote code directly.
- Never introduce hidden network calls.
- Keep file writes explicit and limited to the minimum required scope.
- If a script modifies files, the behavior must be clearly documented.

### 4.2 Dependency policy

- Do not add third-party dependencies unless strictly necessary.
- Prefer Bun/Node built-in APIs and existing repository utilities first.
- If adding a dependency is unavoidable, justify it in the PR description.
- Avoid framework-style dependencies for simple parsing, IO, or validation tasks.

### 4.3 Code structure

- Keep one primary responsibility per file/module.
- Use small, named helper functions for readability.
- Keep helper logic private unless reused.
- Keep control flow explicit and easy to trace.
- Avoid clever abstractions that reduce maintainability.

Note: One primary responsibility does not mean exactly one function per file.

### 4.4 Documentation in code

- Add proper TSDoc for all exported interfaces, types, functions, and modules.
- Add inline maintainer comments for non-obvious behavior, constraints, and tradeoffs.
- Inline comments should explain why, not repeat obvious code behavior.

### 4.5 Error handling and contracts

- Validate all external inputs before performing actions.
- Fail fast with explicit, actionable error messages.
- Preserve existing command contracts unless intentionally changed.
- If output format or behavior changes, include migration notes in the PR.

## 5 Testing standard

Testing is mandatory for non-trivial script changes.

- Add or update tests for any logic change that can fail in edge cases.
- Add regression tests for bug fixes.
- Test observable behavior: inputs, outputs, side effects, and exit paths.
- Prefer unit tests for pure logic and targeted integration-style tests for file/CLI behavior.
- Ensure affected tests pass before requesting review.

## 6 Documentation update requirements

When behavior changes, update docs in the same PR:

- the relevant scripts/<domain>/README.md,
- contribution docs if contributor workflow changes,
- command references if package.json script entries change.

## 7 Review expectations

Script changes receive higher scrutiny than normal documentation edits.

Reviewers should be able to answer all of the following from the PR:

- What changed?
- Why was it needed?
- What side effects can occur?
- How was it tested?
- Are compatibility and release implications documented?

## 8 PR checklist for scripts

Before requesting review, confirm all items:

- no secrets are required or exposed,
- no remote code execution is introduced,
- side effects are documented,
- exported APIs include proper TSDoc,
- non-obvious logic includes maintainer comments,
- file/module responsibilities are clear,
- no unnecessary third-party dependencies were added,
- inputs are validated and errors are actionable,
- tests were added or updated as needed,
- affected tests pass,
- related script README/docs were updated.

## 9 Exceptions

If you must break a rule, document the exception clearly:

- in the PR description (what and why),
- in code comments near the exception,
- with a follow-up plan when appropriate.

Undocumented exceptions should be treated as review blockers.
