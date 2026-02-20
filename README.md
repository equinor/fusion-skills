# 🤖 Fusion Skills

This is Fusion’s shared catalog of GitHub Copilot **Agent Skills** — reusable, versioned “mini playbooks” that help you run common workflows consistently.

Skills are designed to be:
- 🧭 **Actionable**: they guide you through a specific task (not generic chat)
- 📎 **Concrete**: they state what the agent will produce (files/commands/summary)
- 🔒 **Safer by default**: they call out constraints and avoid risky automation

If you just want to use the skills, start with **Quick start**.

## 🚀 Quick start

For Fusion issue-authoring with GitHub Copilot, use the explicit agent-targeted install command:

```bash
npx skills add equinor/fusion-skills \
	--skill fusion-issue-authoring \
	--skill fusion-issue-author-feature \
	--skill fusion-issue-author-user-story \
	--skill fusion-issue-author-task \
	--skill fusion-issue-author-bug \
	--agent github-copilot \
	-y
```

For GitHub Copilot project installs, skills are placed in `.agents/skills`.
See https://skills.sh for CLI behavior and agent support details.

List what’s available:

```bash
npx skills add equinor/fusion-skills --list
```

Install into a repo (team sharing):

```bash
npx skills add equinor/fusion-skills
```

Install for your user (local experimentation):

```bash
npx skills add equinor/fusion-skills -g
```

Update installed skills:

```bash
npx skills update
```

Check if updates are available before updating:

```bash
npx skills check
```

Remove skills:

```bash
npx skills remove
```

## 🤌 What you get

This repo contains reusable skills for common workflows (planning, triage, reviews, runbooks, etc.).

Each skill should tell you:
- when to use it (and when not to),
- what it will produce (files/commands/summary),
- what inputs it needs,
- and what safety constraints apply.

## 📦 What’s in the repo

Skills live under `skills/`. The structure inside a skill is intentionally flexible, but most skills have an entry file:

`skills/fusion-<skill-name>/SKILL.md`

### Available skills

<!-- skills-table:start -->
| Skill | Description | Version |
| --- | --- | --- |
| [`fusion-issue-author-bug`](skills/fusion-issue-author-bug/SKILL.md) | Draft and update bug issues using a bug-focused structure, repository-valid labels, and explicit publish confirmation before GitHub mutation. | `0.1.1` |
| [`fusion-issue-author-feature`](skills/fusion-issue-author-feature/SKILL.md) | Draft and update feature issues with clear problem framing, scoped requirements, repository-valid labels, and explicit confirmation before publishing. | `0.1.1` |
| [`fusion-issue-author-task`](skills/fusion-issue-author-task/SKILL.md) | Draft and update task issues with checklist-first decomposition, dependency-aware sequencing, repository-valid labels, and explicit publish confirmation. | `0.1.1` |
| [`fusion-issue-author-user-story`](skills/fusion-issue-author-user-story/SKILL.md) | Draft and update user-story issues with role-action-value framing, workflow scenarios, repository-valid labels, and explicit publish confirmation. | `0.1.1` |
| [`fusion-issue-authoring`](skills/fusion-issue-authoring/SKILL.md) | Orchestrate GitHub issue authoring by classifying request type, routing to a type-specific issue-author skill, and enforcing shared safety gates before mutation. | `0.2.0` |
| [`fusion-skill-authoring`](skills/fusion-skill-authoring/SKILL.md) | Create or scaffold a new skill in a repository with valid metadata, clear activation cues, standard resource folders, safety boundaries, and validation evidence. | `0.2.1` |
<!-- skills-table:end -->

In this repository, use `fusion-<skill-name>` as the default skill naming convention.

Some conventions you may see:
- `skills/.experimental/` 🧪 preview / in-development skills
- `skills/.curated/` ✅ curated, broadly reusable skills
- `skills/.system/` ⚙️ internal/system skills and shared building blocks

## 🔖 Versioning

For predictable consumer upgrades with `npx skills add|update`:

- Use git tags with semantic versioning for releases (`vMAJOR.MINOR.PATCH`)
- Treat `main` as latest stable-ish; use prerelease tags for experiments (`v1.3.0-beta.1`)
- Pin production installs to a tag: `npx skills add equinor/fusion-skills@v1.2.3`

See `CHANGELOG.md` for release notes.

If you are developing or maintaining skills in this repository, use `CONTRIBUTING.md` for changesets, release automation, and validation workflows.

<details>
	<summary>Where do skills get installed?</summary>

- For GitHub Copilot project installs, skills land in `.agents/skills/` in the current repo.
- Personal installs use your Copilot user-level skills location.

</details>

## 🔒 Safety & security

> [!CAUTION]
> - Never paste secrets (tokens/keys/credentials) into prompts, logs, or docs
> - Only install skills from sources you trust; skills may include executable commands or scripts
> - Treat `skills/**/scripts/` as security-sensitive code; review and verify before execution
> - Confirm side effects before running commands (especially destructive operations)

For details and reporting guidance, see `SECURITY.md`.

> [!WARNING]
> - This is __NOT__ a general Fusion documentation site (keep long-form docs in the relevant product repos)
> - This is __NOT__ a place for secrets, tokens, or environment-specific configuration
> - This is __NOT__ a dumping ground for one-off prompts — skills should be owned and maintained

---

Want to contribute or review changes? See `CONTRIBUTING.md`.

Are you an agent making changes in this repo? See `AGENTS.md`.
