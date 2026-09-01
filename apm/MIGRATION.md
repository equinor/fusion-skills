# Migrate from `npx skills` to APM

APM replaces the `skills` CLI for installing and updating Fusion agent context. It can install a complete Fusion developer preset or one skill, records dependencies in `apm.yml`, and locks exact content in `apm.lock.yaml`.

## Before you start

1. Create a branch with a clean working tree.
2. Install the [APM CLI](https://microsoft.github.io/apm/getting-started/installation/).
3. Verify the CLI:

   ```bash
   apm --version
   ```

4. Review `skills-lock.json` and `.agents/skills/` to identify files managed by the old CLI. Preserve any hand-authored skills that are not represented in `skills-lock.json`.

## Choose an installation model

Use a preset when the repository needs a complete Fusion development workflow:

| Repository type | Preset |
| --- | --- |
| General or mixed | `fusion-developer` |
| Fusion Framework React application | `fusion-developer-app` |
| Fusion backend service | `fusion-developer-services` |
| Repository containing both Fusion React and backend service code | `fusion-developer-fullstack` |

Use individual dependencies when the repository needs only a small, explicitly selected set of skills.

## Option 1: install a preset

Run one command:

```bash
# General or mixed repository
apm install equinor/fusion-skills/apm/fusion-developer#^1.6.1 --target copilot

# Fusion Framework React application
apm install equinor/fusion-skills/apm/fusion-developer-app#^1.6.1 --target copilot

# Fusion backend service
apm install equinor/fusion-skills/apm/fusion-developer-services#^1.6.1 --target copilot

# Combined Fusion application and backend service
apm install equinor/fusion-skills/apm/fusion-developer-fullstack#^1.6.1 --target copilot
```

The application and services presets already include `fusion-developer`. The
full-stack preset includes both specialized presets.

## Option 2: add individual skills

The CLI can add a single monorepo directory to `apm.yml` and install it:

```bash
apm install equinor/fusion-skills/skills/fusion-issue-authoring#^1.6.1 --target copilot
```

For direct control, add readable shorthand entries to `apm.yml`. Presets and individual skills can be composed:

```yaml
name: my-repository
version: 1.0.0
targets:
  - copilot

dependencies:
  apm:
    - equinor/fusion-skills/apm/fusion-developer#^1.6.1
    - equinor/fusion-skills/skills/fusion-skill-authoring#^1.6.1
```

Then run:

```bash
apm install
```

Use the directory's complete repository path, including lanes such as `skills/.experimental/` or `skills/.system/`.

## Remove legacy managed copies

Do not install APM over files still owned by the old CLI. APM treats unexpected existing files as collisions rather than silently overwriting them.

1. Use `skills-lock.json` to identify old managed skill directories.
2. Remove only those corresponding directories from `.agents/skills/`.
3. Remove `skills-lock.json` after all entries have been migrated.
4. Keep unrelated, hand-authored content under `.agents/skills/`.
5. Run the chosen `apm install` command again.

Do not use `apm install --force` as a migration shortcut. It can overwrite locally authored files and bypass a critical security finding block.

Review the diff, then commit `apm.yml`, `apm.lock.yaml`, and all APM-deployed context. Do not commit `apm_modules/`.

## Command mapping

| Old workflow | APM workflow |
| --- | --- |
| `npx skills add ...` | Add a dependency with `apm install <package>` |
| `npx skills experimental_install` | Reproduce locked dependencies with `apm install` |
| `npx skills check` | Check dependencies with `apm outdated` |
| `npx skills update` | Refresh dependencies with `apm update` |
| `npx skills remove <name>` | Remove dependency from `apm.yml`, then run `apm prune` |
| `skills-lock.json` | `apm.lock.yaml` |

`apm install` respects the lockfile and does not silently upgrade existing dependencies. Use `apm update` when an upgrade is intended.

## Automate updates

APM does not install GitHub workflow files from packages. Add sync automation separately using either the reusable workflow or the copyable template below.

### Use the reusable workflow

Add `.github/workflows/apm-sync.yml` to the consuming repository:

```yaml
name: APM Sync

on:
  schedule:
    - cron: "0 8 * * 1"
  workflow_dispatch:

jobs:
  sync:
    uses: equinor/fusion-skills/.github/workflows/apm-sync.yml@main
    permissions:
      contents: write
      pull-requests: write
```

Pin `@main` to a Fusion Skills release tag when the reusable workflow itself must remain fixed.

### Copy the standalone template

Copy [`templates/apm-sync.yml`](templates/apm-sync.yml) into the consuming repository as `.github/workflows/apm-sync.yml`. The template uses the official `microsoft/apm-action` in update mode and opens a pull request with `peter-evans/create-pull-request`.

Both options run every Monday at 08:00 UTC and support manual dispatch. The action runs non-interactive `apm update --yes`, refreshing only within constraints declared in `apm.yml`; the `#^1.6.1` examples accept compatible `1.x` Fusion Skills releases. Replace the range with an exact tag such as `#v1.6.1` when automated version advancement is not wanted.

For private dependencies, configure authentication as described in the [APM authentication guide](https://microsoft.github.io/apm/getting-started/authentication/) rather than placing tokens in the workflow.

## Verify the migration

Run:

```bash
apm install --frozen
apm audit --ci
git status --short
```

Confirm:

- `apm.yml` contains every intended direct preset or skill.
- `apm.lock.yaml` is committed.
- expected skills exist under `.agents/skills/`.
- expected agents and instructions exist under `.github/`.
- `skills-lock.json` and old-CLI-only workflow files are gone.
- no credentials or `apm_modules/` content are staged.
