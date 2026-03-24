# validate-governance

Validates that skills do not contain broken governance references.

## What it checks

- Scans all `SKILL.md` files under `skills/` for references to repo-local governance paths (`.github/instructions/`, `contribute/`, `CONTRIBUTING.md`).
- Scans skill-local `agents/*.md` files for the same governance references.
- Verifies that each referenced path resolves to an existing file or directory relative to the repository root (or skill directory for relative paths).
- Fails with an actionable error listing each broken reference.

## Usage

```bash
bun run validate:governance
```

## When to run

- During PR validation when skills are changed.
- During greenkeeping sweeps to detect drift from renamed or removed governance files.
