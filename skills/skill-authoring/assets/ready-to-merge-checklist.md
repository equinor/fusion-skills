# Ready-to-merge checklist

Use this checklist before opening a PR for a new or updated skill.

## Must pass

- [ ] Frontmatter includes `name` and `description`
- [ ] `name` matches folder name, uses kebab-case, and is <= 64 chars (`[a-z0-9-]` only)
- [ ] `name` does not include reserved words (`anthropic`, `claude`) and contains no XML tags
- [ ] `description` is non-empty, <= 1024 chars, contains no XML tags, and includes activation cues
- [ ] `SKILL.md` includes: When to use, When not to use, Required inputs, Instructions, Expected output, Safety & constraints
- [ ] Existing skills were checked first (`npx skills equinor/fusion-skills --list`), and almost-matches are handled via issue/tweak recommendation instead of duplicating skills
- [ ] Validation command `npx -y skills add . --list` was run and evidence recorded (exit code `0` and discoverable/valid output)
- [ ] Content is scoped to the requested change; no unsafe or secret-handling behavior
- [ ] Long guidance is moved to `references/` (keep `SKILL.md` concise)
