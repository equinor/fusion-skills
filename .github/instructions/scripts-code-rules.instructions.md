---
applyTo: "scripts/**"
---

# Scripts engineering instructions

When changing files under `scripts/**`, follow `contribute/06-scripts-code-rules.md` as the mandatory standard.

## Required behavior

- Treat scripts as production tooling for CI and release workflows.
- Add proper TSDoc for exported interfaces, types, functions, and modules.
- Add maintainer comments for non-obvious logic, constraints, and tradeoffs.
- Keep one primary responsibility per file/module.
- Avoid unnecessary third-party dependencies.
- Validate inputs and fail with actionable errors.
- Preserve command contracts unless intentionally changed and documented.
- Add/update tests for non-trivial changes and bug fixes.
- Update relevant `scripts/<domain>/README.md` when behavior changes.

## PR expectations

- Document side effects.
- Document exceptions to rules (with rationale).
- Include migration notes when output format or command behavior changes.
