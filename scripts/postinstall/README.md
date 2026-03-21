# postinstall

Symlinks selected skills from `skills/` into `.github/skills/` so Copilot agent mode discovers them as workspace-local skills.

## Linked skills

| Skill | Source | Link |
|-------|--------|------|
| `fusion-skill-authoring` | `skills/fusion-skill-authoring` | `.github/skills/fusion-skill-authoring` |
| `fusion-issue-authoring` | `skills/fusion-issue-authoring` | `.github/skills/fusion-issue-authoring` |

## Behavior

- Creates `.github/skills/` if it does not exist.
- Uses **relative** symlinks so the links work regardless of the absolute repo path.
- Idempotent — re-running leaves correct symlinks untouched.
- Refuses to overwrite a non-symlink entry (fails with an actionable error).

## Usage

Runs automatically after `bun install` / `npm install`:

```bash
bun install          # triggers postinstall
bun run postinstall  # manual run
```
