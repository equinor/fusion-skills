# Validate Skills Ownership

Validates that all skills have required ownership and lifecycle metadata.

## What it checks

- ✓ Every skill has `metadata.owner` (required)
- ✓ Every skill has `metadata.status` (required)
- ✓ Owner is in valid GitHub identity format (`@user` or `@org/team`)
- ✓ Status is one of: `active`, `experimental`, `deprecated`, `archived`

## Running it

### From workspace root

```bash
bun run scripts/validate-skills-ownership/index.ts
# or
bun run validate:ownership
```

### What success looks like

```
Validating skill ownership metadata...

Ownership validation: 11/11 skills passed.
✓ All skills have valid ownership metadata.
```

### What failure looks like

```
Validating skill ownership metadata...
✗ fusion-example-skill: Missing required metadata.owner
✗ fusion-other-skill: Invalid status "draft". Must be one of: active, experimental, deprecated, archived

ERROR: Ownership metadata validation failed.
```

## Metadata requirements

Every `SKILL.md` must include in its frontmatter:

```yaml
metadata:
  owner: "@equinor/fusion-core"  # required: GitHub username or team
  status: "active"               # required: active|experimental|deprecated|archived
  sponsor: "@equinor/fusion-core" # recommended: backup owner
```

## Integration

This script is integrated into:

- CI/CD workflows for validation on pull requests
- `bun run validate:ownership` script command
- New skill creation scaffolding (pre-populated with defaults)
