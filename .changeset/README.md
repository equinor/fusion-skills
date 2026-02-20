# Changesets

When a pull request changes any skill under `skills/`, include at least one markdown file in `.changeset/` and list each changed skill with a bump type.

Allowed bump types:
- `major`
- `minor`
- `patch`

Example:

```markdown
---
"fusion-skill-authoring": minor
---

Added semantic version and license defaults to the generated `SKILL.md` template.
```

Notes:
- Skill key should match the skill folder name (for example `fusion-skill-authoring`).
- You can include multiple skills in one changeset file.
- PR validation enforces that changed skills are present in updated `.changeset/*.md` files.
- Use non-closing issue references by default in changeset bodies (for example `Refs: owner/repo#123`).
- Use auto-closing keywords intentionally (for example `Fixes:`/`Resolves:`) when the skill fix in the release PR should close that issue on merge.
- Keep in mind that release PR/changelog generation can propagate these strings and trigger merge-time issue closure.
