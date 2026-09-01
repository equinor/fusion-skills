# APM Packages

APM is the supported installer for Fusion developer context. It manages profiles and individual skills through a repository-owned `apm.yml`, generates the reproducible `apm.lock.yaml`, and materializes skills, agents, instructions, and MCP configuration into the target repository.

Install the [APM CLI](https://microsoft.github.io/apm/getting-started/installation/) before using these packages, then run `apm --version` to verify it is available.

| Preset | Purpose |
| --- | --- |
| `fusion-developer` | Shared implementation, research, API testing, issue, and PR review workflows |
| `fusion-developer-app` | Fusion Framework React application development |
| `fusion-developer-services` | Fusion backend service development and operations |

`fusion-developer-app` and `fusion-developer-services` include `fusion-developer` transitively, then add track-specific skills, agents, and instructions. Do not install `fusion-developer` separately when using either specialized preset.

## Install a preset

Run one command from the repository that should receive the developer context:

```bash
# Shared workflows for any Fusion repository
apm install equinor/fusion-skills/apm/fusion-developer#^1.6.1 --target copilot

# Shared workflows plus Fusion Framework React development
apm install equinor/fusion-skills/apm/fusion-developer-app#^1.6.1 --target copilot

# Shared workflows plus Fusion backend service development
apm install equinor/fusion-skills/apm/fusion-developer-services#^1.6.1 --target copilot
```

The `^1.6.1` range accepts compatible `1.x` releases. APM resolves the exact release into `apm.lock.yaml`; `apm install` reproduces that lock, while `apm update` advances it within the declared range. Use an exact tag such as `#v1.6.1` instead when updates must never advance automatically.

Commit these generated and deployed files:

- `apm.yml`
- `apm.lock.yaml`
- `.agents/` and relevant `.github/` files materialized by APM
- `.vscode/mcp.json` when generated

Do not commit `apm_modules/`; APM adds it to `.gitignore`.

## Install one skill

Install a skill directly from this monorepo without adopting a preset:

```bash
apm install equinor/fusion-skills/skills/fusion-issue-authoring#^1.6.1 --target copilot
```

Or declare the dependency explicitly in an existing `apm.yml`:

```yaml
dependencies:
  apm:
    - equinor/fusion-skills/skills/fusion-issue-authoring#^1.6.1
```

Then materialize it:

```bash
apm install --target copilot
```

Replace `fusion-issue-authoring` with a directory name under `skills/`. Use the full catalog path for non-default lanes, for example `skills/.experimental/fusion-framework-testing`.

## Keep dependencies current

Use `apm outdated` for a read-only check and `apm update` to refresh dependencies:

```bash
apm outdated
apm update
```

For scheduled updates, use the reusable workflow or copyable template in the [migration guide](MIGRATION.md#automate-updates). APM packages intentionally do not install GitHub workflow files. In CI, use `apm install --frozen` to verify `apm.yml` and `apm.lock.yaml` remain synchronized; it does not upgrade dependencies.

## Migrate from `npx skills`

See [Migrate from `npx skills` to APM](MIGRATION.md) for command mapping, safe cleanup of legacy installed copies, preset selection, single-skill conversion, and scheduled update automation.

## Maintainer notes

Package versions follow the root `fusion-skills` release version. Internal dependency refs marked `# release-managed` advance to the same repository tag during release preparation.

All three presets configure the hosted production Fusion MCP server in `.vscode/mcp.json`. VS Code requests Equinor Microsoft Entra sign-in on first use; no API key or stored credential is included in a preset.

These directories are source APM packages. A standalone plugin release must first materialize dependencies with `apm install` in an isolated build workspace, then run `apm pack`; `apm lock` alone does not record the deployed-file provenance required for packing transitive skills.

Do not replace package dependencies with symlinks. Published APM archives exclude symlinks, while dependency manifests preserve source and lockfile provenance.
