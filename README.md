# 🤖 Fusion Skills

This is Fusion’s shared catalog of GitHub Copilot **Agent Skills** — reusable, versioned “mini playbooks” that help you run common workflows consistently.

Skills are designed to be:
- 🧭 **Actionable**: they guide you through a specific task (not generic chat)
- 📎 **Concrete**: they state what the agent will produce (files/commands/summary)
- 🔒 **Safer by default**: they call out constraints and avoid risky automation

If you just want to use the skills, start with **Quick start**.

## 🚀 Quick start

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

In this repository, use `fusion-<skill-name>` as the default skill naming convention.

Some conventions you may see:
- `skills/.experimental/` 🧪 preview / in-development skills
- `skills/.curated/` ✅ curated, broadly reusable skills
- `skills/.system/` ⚙️ internal/system skills and shared building blocks

<details>
	<summary>Where do skills get installed?</summary>

- Project installs typically land in `.github/skills/` in the current repo.
- Personal installs use your Copilot user-level skills location.

</details>

## 🔒 Safety & security

> [!CAUTION]
> - Never paste secrets (tokens/keys/credentials) into prompts, logs, or docs
> - Treat `skills/**/scripts/` as security-sensitive code; don’t run scripts you don’t understand
> - Confirm side effects before running commands (especially destructive operations)

For details and reporting guidance, see `SECURITY.md`.

> [!WARNING]
> - This is __NOT__ a general Fusion documentation site (keep long-form docs in the relevant product repos)
> - This is __NOT__ a place for secrets, tokens, or environment-specific configuration
> - This is __NOT__ a dumping ground for one-off prompts — skills should be owned and maintained

---

Want to contribute or review changes? See `CONTRIBUTING.md`.

Are you an agent making changes in this repo? See `AGENT.md`.
