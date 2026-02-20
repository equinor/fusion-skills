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
- Use lower-case GitHub closing keywords in changeset bodies when closure is intended.
- Prefer `resolves:` with direct references (for example `resolves: owner/repo#123`).
- Use `fixes:` or `closes:` only when those verbs are more accurate.
- Keep in mind that release PR/changelog generation can propagate these strings and trigger merge-time issue closure.
