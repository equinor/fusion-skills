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

### Project-first workflow (recommended)

> [!TIP]
> Use project installs as the default for team sharing and reproducible onboarding.

| Step | Command | Scope | Typical use |
| --- | --- | --- | --- |
| Discover | `npx skills add equinor/fusion-skills --list` | Project | See available skills |
| Install | `npx skills add equinor/fusion-skills` | Project | Add skills to the repo |
| Restore | `npx skills experimental_install` | Project | Rehydrate from `skills-lock.json` (fresh clones/CI) |
| Remove | `npx skills remove` | Project | Remove installed skills |

<details>
<summary><strong>Optional: global install and global update checks</strong></summary>

Install for your user (local experimentation):

```bash
npx skills add equinor/fusion-skills -g
```

Check if global updates are available:

```bash
npx skills check
```

Update globally installed skills:

```bash
npx skills update
```

</details>

> [!NOTE]
> `npx skills check` and `npx skills update` currently read the global lock file (`~/.agents/.skill-lock.json`).

## 🔄 Automated skill updates

This repository provides a **GitHub Actions workflow** you can copy into your repo for automated skill updates — like Dependabot for GitHub Copilot Agent Skills.

> [!IMPORTANT]
> Current CLI lock scope differs by command:
> - `npx skills experimental_install` restores from project `skills-lock.json`
> - `npx skills check` and `npx skills update` read the global lock file (`~/.agents/.skill-lock.json`)

The workflow automatically:
- Detects available skill updates from this skills catalog (`equinor/fusion-skills`)
- Creates a pull request only when skills actually change
- Includes per-skill changelog summaries in the PR description

### Setup in your repository

In your repository's `.github/workflows/` directory, create a workflow file (e.g., `skills-update.yml`):

```yaml
name: Upgrade Agent Skills

on:
  schedule:
    # Run weekdays at 8 AM UTC
    - cron: '0 8 * * 1-5'
  workflow_dispatch:  # Allow manual trigger

permissions:
  contents: write
  pull-requests: write

jobs:
  upgrade:
    uses: equinor/fusion-skills/.github/workflows/skills-update.yml@main
```

### Configuration notes

- **Schedule**: Adjust the cron expression to your preferred frequency. Examples:
  - `0 2 * * 1` — Every Monday at 2 AM UTC
  - `0 0 * * 0` — Every Sunday at midnight UTC
  - `0 9 * * 1-5` — Every weekday at 9 AM UTC

- **Version pinning**: Replace `@main` with a specific release tag to pin to a version:
  ```yaml
  uses: equinor/fusion-skills/.github/workflows/skills-update.yml@v1.0.0
  ```

- **Manual-only updates**: If you prefer manual-only triggers, remove the `schedule:` section and keep only `workflow_dispatch:`.

- **Permissions**: The workflow requires write access to:
  - `contents` — to commit skill updates
  - `pull-requests` — to create and manage pull requests

- **Concurrency**: This workflow does not use concurrency limits. If you run multiple concurrent updates (e.g., from both scheduled and manual triggers), they may update the same PR. This is safe—later commits will overwrite earlier ones on the branch. If you prefer stricter control, add a concurrency block at the job level:
  ```yaml
  concurrency:
    group: skills-upgrade
    cancel-in-progress: true
  ```

## 🆕 Automated new-skill discovery (one PR per skill)

This repository also provides a separate reusable workflow for discovering **new** skills and creating **one PR per skill**.

The workflow compares:
- `npx skills add --list equinor/fusion-skills`
- `npx skills add --list .`

Then it filters ignored skills from `.github/skills-ignore.json`, and opens one branch/PR per remaining skill.

### Setup in your repository

Create `.github/workflows/skills-discovery.yml`:

```yaml
name: Discover New Agent Skills

on:
  schedule:
    - cron: '0 8 * * 1-5'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  discover:
    uses: equinor/fusion-skills/.github/workflows/skills-discovery.yml@main
```

Optional inputs:

```yaml
jobs:
  discover:
    uses: equinor/fusion-skills/.github/workflows/skills-discovery.yml@main
    with:
      source: equinor/fusion-skills
      ignore-file: .github/skills-ignore.json
      draft-prs: false
      skip-if-rejected-pr-exists: true
```

Optional ignore list in your repository at `.github/skills-ignore.json`:

```json
{
  "ignored": [
    "fusion-example-skill"
  ]
}
```

If the ignore file exists, the workflow validates this shape before continuing.

If a skill already has an open PR from branch `chore/skills-discovery/<skill>`, the workflow updates that PR.

`skip-if-rejected-pr-exists` blocks re-proposing skills where a previous PR from that skill branch was closed without merge.

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
**🧪 [`fusion-dependency-review@0.1.1`](skills/.experimental/fusion-dependency-review/SKILL.md)**

Review dependency PRs with structured research, existing-PR-discussion capture, multi-lens analysis (security, code quality, impact), and a repeatable verdict template. USE FOR: dependency update PRs, Renovate/Dependabot PRs, library upgrade reviews, "review this dependency PR", "should we merge this update". DO NOT USE FOR: feature PRs, application code reviews, dependency automation/bot configuration, or unattended merge without confirmation.

---

**🧪 [`fusion-discover-skills@0.1.2`](skills/.experimental/fusion-discover-skills/SKILL.md)**

Discovers relevant Fusion skills through Fusion MCP first, falls back to GitHub-backed catalog inspection when needed, returns concise matches with purpose and next-step guidance, and handles install, update, or remove intent without guesswork. USE FOR: finding a skill for a task, asking what to install, checking update or remove guidance, discovering available Fusion skills. DO NOT USE FOR: creating new skills, performing the task itself, or inventing results when discovery signals are unavailable.

---

**🧪 [`fusion-github-review-resolution@0.1.4`](skills/.experimental/fusion-github-review-resolution/SKILL.md)**

Resolves unresolved GitHub PR review threads end-to-end: evaluates whether each review comment is correct, applies a targeted fix when valid, replies with rationale when not, commits, and resolves the thread. USE FOR: unresolved review threads, PR review feedback, changes requested PRs, PR review URLs (#pullrequestreview-...), fix the review comments, close the open threads, address PR feedback. DO NOT USE FOR: summarizing feedback without code changes, creating new PRs, or read-only branches.

---

**👍 [`fusion-issue-author-bug@0.1.2`](skills/fusion-issue-author-bug/SKILL.md)**

Draft and update bug issues using a bug-focused structure, repository-valid labels, and explicit publish confirmation before GitHub mutation.

---

**👍 [`fusion-issue-author-feature@0.1.2`](skills/fusion-issue-author-feature/SKILL.md)**

Draft and update feature issues with clear problem framing, scoped requirements, repository-valid labels, and explicit confirmation before publishing.

---

**👍 [`fusion-issue-author-task@0.1.2`](skills/fusion-issue-author-task/SKILL.md)**

Draft and update task issues with checklist-first decomposition, dependency-aware sequencing, repository-valid labels, and explicit publish confirmation.

---

**👍 [`fusion-issue-author-user-story@0.1.2`](skills/fusion-issue-author-user-story/SKILL.md)**

Draft and update user-story issues with role-action-value framing, workflow scenarios, repository-valid labels, and explicit publish confirmation.

---

**👍 [`fusion-issue-authoring@0.2.3`](skills/fusion-issue-authoring/SKILL.md)**

Orchestrate GitHub issue authoring by classifying request type, routing to a type-specific issue-author skill, and enforcing shared safety gates before mutation.

---

**🧪 [`fusion-issue-solving@0.1.4`](skills/.experimental/fusion-issue-solving/SKILL.md)**

Handles GitHub issue resolution end-to-end for prompts like "solve

---

**🧪 [`fusion-issue-task-planning@0.1.3`](skills/.experimental/fusion-issue-task-planning/SKILL.md)**

Plan and break down user-story issues into ordered, traceable task issue drafts with explicit publish gates.

---

**🧪 [`fusion-mcp@0.1.1`](skills/.experimental/fusion-mcp/SKILL.md)**

Explain what Fusion MCP is and guide users through setting it up when they need Fusion-aware MCP capabilities in Copilot workflows.

---

**👍 [`fusion-skill-authoring@0.3.0`](skills/fusion-skill-authoring/SKILL.md)**

Creates or modernizes repository skills with clear activation cues, purposeful support files, and practical review loops. USE FOR: creating a new skill, tightening an existing skill, improving discovery wording, and structuring references/assets/optional helper agents when they genuinely add value. DO NOT USE FOR: product-code changes, routine copy edits outside skills/, or documentation that should not become an installable skill.

---

**👍 [`fusion-skill-self-report-bug@0.1.1`](skills/fusion-skill-self-report-bug/SKILL.md)**

Capture Fusion skill workflow failure context and guide a draft-first bug reporting flow with explicit confirmation before any GitHub mutation.
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
