# Skills Greenkeeping Guide

**Greenkeeping** is proactive maintenance of the skills catalog to keep it discoverable, current, secure, and high-quality as it grows.

## What is greenkeeping?

Greenkeeping ensures:
- **Discoverability**: Skills are findable with clear activation cues and tags
- **Currency**: Metadata is current (versions, dependencies, MCP servers)
- **Quality**: Standards are enforced consistently (valid schemas, complete docs)
- **Security**: No stale secrets, unsafe patterns, or unmaintained code
- **Ownership**: Clear responsibility for each skill's evolution

## Ownership requirements

Every skill must declare:

- **`metadata.owner`** (required): Primary accountable person/team
  - GitHub identity format: `@username` or `@org/team-name`
  - Default for this repository: `@equinor/fusion-core`
  - Example: `owner: "@equinor/fusion-core"`

- **`metadata.status`** (required): Lifecycle state
  - `active` — Production-ready, actively maintained
  - `experimental` — Early-stage, may change significantly
  - `deprecated` — No longer recommended; replacement available
  - `archived` — Removed from active use; kept for reference only

- **`metadata.sponsor`** (optional): Secondary owner/team providing backup accountability

### Ownership rules

- **Stable skills** must have explicit owner
- **Deprecated skills** must have replacement guidance + removal timeline
- **Experimental skills** should have a transition plan to stable
- **Orphaned skills** (no owner identified) are at risk for deprecation

## Lifecycle stages

### Active skills
- Status: `active`
- Maintenance: Regular (respond to issues, update dependencies)
- Deprecation: Rare; only if replaced by better alternative
- Activation: Clear "when to use" guidance

### Experimental skills
- Status: `experimental`
- Maintenance: Best-effort; may have breaking changes
- Deprecation: Rapid; no long transition period
- Activation: Explicit discovery; may not be recommended by default

### Deprecated skills
- Status: `deprecated`
- Placement: `skills/.deprecated/` (moved from `skills/` on deprecation)
- Maintenance: Security fixes only; no new features
- Replacement: Must document successor skill(s) via `metadata.successor`
- Timeline: Remove after 2-3 releases from deprecation notice
- Communication: Issue + PR + release notes

### Archived skills
- Status: `archived`
- Maintenance: None; reference only
- Storage: Kept in repository for history
- Discovery: Not recommended for new use

## Greenkeeping checklist

When maintaining a skill, verify:

**Metadata completeness:**
- [ ] `name` is stable and matches directory name
- [ ] `description` is clear and includes "USE FOR" / "DO NOT USE FOR"
- [ ] `metadata.version` follows semantic versioning (X.Y.Z)
- [ ] `metadata.owner` is a resolvable GitHub identity
- [ ] `metadata.status` is one of: `active`, `experimental`, `deprecated`, `archived`
- [ ] `metadata.tags` are lowercase, kebab-case, relevant

**Documentation quality:**
- [ ] "When to use" section is clear and specific
- [ ] "When not to use" section lists edge cases/anti-patterns
- [ ] Required inputs are documented
- [ ] Expected outputs are described
- [ ] Examples are provided (at least one)
- [ ] Error handling is documented (if applicable)

**Security:**
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No unsafe patterns (eval, shell injection, etc.)
- [ ] Scripts reviewed for side effects
- [ ] MCP servers and dependencies declared

**Dependencies:**
- [ ] MCP servers listed (`required` and `suggested`)
- [ ] Version compatibility noted
- [ ] No orphaned skill references (subordinates, related skills)

**Currency:**
- [ ] Dependency versions are current
- [ ] MCP server APIs are compatible
- [ ] GitHub API usage is up-to-date
- [ ] Known issues documented/tracked

## Validation in CI

Every PR running `validate:skills` checks:

```bash
# Validate skill inventory
bun run validate:skills

# Validate ownership metadata
bun run validate:ownership

# Validate scripts (PR touching skills/**/scripts/**)
bun run validate:scripts
```

Failures block merge. See [CI validation](../guidelines/ci-validation.md) for details.

## Deprecation workflow

When deprecating a skill:

1. **Create issue**: Explain why, what replaces it, removal timeline
2. **Update metadata**:
   ```yaml
   metadata:
     status: deprecated
     deprecated_at: "YYYY-MM-DD"
     successor: successor-skill-name
   ```
   `deprecated_at` is required for skills in `skills/.deprecated/` and is validated by CI (`validate:ownership`).
3. **Add `deprecated` to `metadata.tags`**
4. **Add deprecation notice**: Add a prominent blockquote at the top of the SKILL.md body pointing to the successor and the tracking issue
5. **Move to `skills/.deprecated/`**: Use `git mv skills/<skill-name> skills/.deprecated/<skill-name>` to preserve history
6. **Update description**: Prefix with `DEPRECATED: Use <successor> instead.`
7. **Notify contributors**: Comment on related PRs/issues
8. **Release notes**: Include in changelog with migration guidance
9. **Automated removal**: The `skills-greenkeeping.yml` workflow runs monthly and creates a removal PR for skills that have been in `.deprecated/` for 3+ months

**Example deprecation notice:**
```
⚠️ **DEPRECATED**: This skill is no longer maintained. 
Use `[successor-skill](../successor-skill/)` instead.
See [equinor/fusion-core-tasks#XXX](https://github.com/equinor/fusion-core-tasks/issues/XXX) for details.
```

## Common greenkeeping tasks

### I'm taking over a skill

1. Update `metadata.owner` to your GitHub identity or team
2. Run `validate:ownership` to confirm
3. Review and update dependencies
4. Create PR with changes; include in commit message why you're taking ownership

### I'm deprecating a skill

1. Create issue documenting deprecation reason + timeline
2. Update `metadata.status` to `deprecated`
3. Add `metadata.deprecated_at` with today's date in `YYYY-MM-DD` format
4. Add successor skill reference in `metadata.successor`
5. Move to `skills/.deprecated/` using `git mv`
6. Update description with deprecation notice
7. Commit with message: `deprecate: [skill-name] in favor of [successor]`
8. After 3 months, the greenkeeping workflow will auto-propose a removal PR

### I found a security issue

1. Check [SECURITY.md](../SECURITY.md) for reporting guidelines
2. If it's a skill-specific issue:
   - Create private issue (if available) or contact maintainer
   - Provide evidence and reproduction steps
   - Suggest fix if possible
3. Once patched, ensure release notes document the fix

### I'm updating a skill's dependencies

1. Check compatibility with current MCP servers
2. Update `metadata.mcp.required` and `metadata.mcp.suggested`
3. Test with affected MCP servers
4. Create PR with clear changelog entry
5. Ensure all validation passes

## FAQ

**Q: What if I don't know who owns a skill?**
A: Check git history for recent contributors, or reach out to `@equinor/fusion-core` team to assign ownership.

**Q: Can I change a skill's status without owner approval?**
A: Exceptional cases (security, compliance, critical bug): yes, document in PR. Otherwise, seek owner alignment first.

**Q: How long before a deprecated skill is removed?**
A: Minimum 2-3 release cycles to allow transition. Check the issue for specific timeline.

**Q: What counts as a breaking change?**
A: Changes to activation cues, required inputs, output format, or MCP dependencies. Document in PR and release notes.

**Q: Can I archive a skill instead of removing it?**
A: Yes — archiving keeps history accessible while marking it as out-of-use. Preferred over hard deletion.

## Support

- Questions about greenkeeping: Open issue with `[greenkeeping]` tag
- Security concerns: Follow [SECURITY.md](../SECURITY.md)
- Need help with deprecation: Contact skill owner or `@equinor/fusion-core`
