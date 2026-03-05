# Changesets

When a pull request changes any skill under `skills/`, include at least one markdown file in `.changeset/` and list each changed skill with a bump type.

## Bump types

- `major` - Breaking changes to skill API, incompatible behavior shifts
- `minor` - New capabilities, backwards-compatible enhancements
- `patch` - Fixes, documentation improvements, metadata updates

## Required changeset format

Each changeset file must include:
1. Frontmatter with skill names and bump types (YAML block)
2. Changelog body describing the change

```markdown
---
"skill-name": patch
"another-skill": minor
---

Clear description of what changed and why

- Specific improvements or fixes
- Additional context or migration notes

[Optional issue reference below]
resolves equinor/fusion-core-tasks#123
```

## Naming and scope

- File naming: Use descriptive, context-specific names (e.g., `.changeset/add-ownership-metadata.md`, `.changeset/fix-activation-cues.md`)
- Avoid generic names like `.changeset/changes.md`
- Skill key should match the skill folder name (for example `fusion-skill-authoring`).
- You can include multiple skills in one changeset file if they share a logical change.
- Each skill changed in the PR must appear in at least one `.changeset/*.md` file.
- PR validation enforces changeset completeness.

## Issue references in changesets

**When to include an issue reference:**
- The change resolves an issue that should be closed when the PR merges
- The change implements an acceptance criterion from a GitHub issue
- The changeset documents a bug fix or feature completion

**How to reference issues:**
- Use lowercase GitHub closing keywords: `resolves`, `fixes`, `closes`
- Include full reference with owner: `resolves equinor/fusion-core-tasks#123`
- Place the reference on its own line or as the last line of the body
- Example:
  ```markdown
  Improve skill metadata validation to require owner field (equinor/fusion-core-tasks#474 requirement)
  
  resolves equinor/fusion-core-tasks#474
  ```

**Important notes:**
- Changesets themselves do NOT auto-close issues; the PR body does
- Issue auto-closure is triggered by commit messages and PR descriptions, not by text inside changeset files
- Use `resolves` when the issue fully resolves with this change (preferred)
- Use `fixes` when fixing a bug described in an issue
- Use `closes` if neither `resolves` nor `fixes` is appropriate

