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
- Use non-closing issue references in changeset bodies (for example `Refs: owner/repo#123`).
- Do **not** use auto-closing keywords in changesets (`close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved`), because release PR/changelog generation can propagate those strings and close issues at release merge time.
