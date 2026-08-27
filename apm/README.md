# APM Packages

APM packages provide installable Fusion developer profiles while keeping skills independently owned and versioned under `skills/`.

Install the [APM CLI](https://microsoft.github.io/apm/getting-started/quick-start/) before using these packages. APM materializes each profile's skills, agents, instructions, and MCP configuration into the target repository.

| Package | Purpose |
| --- | --- |
| `fusion-developer` | Shared implementation, research, API testing, issue, and PR review workflows |
| `fusion-developer-app` | Fusion Framework React application development |
| `fusion-developer-services` | Fusion backend service development and operations |

`fusion-developer-app` and `fusion-developer-services` depend transitively on `fusion-developer`, then add track-specific skills, agents, and instructions. The shared package owns Fusion research, MCP guidance, DevTools, skill lifecycle and self-reporting, code conventions, issue authoring, planning and implementation, dependency review, and PR review resolution. Each profile keeps its own MCP declaration so transitive MCP trust does not require an install flag.

Package versions follow the root `fusion-skills` release version. Internal dependency refs marked `# release-managed` advance to the same repository tag during release preparation.

Both profiles configure the hosted production Fusion MCP server in `.vscode/mcp.json`. VS Code requests Equinor Microsoft Entra sign-in on first use; no API key or stored credential is included in the package.

These directories are source APM packages. A standalone plugin release must first materialize dependencies with `apm install` in an isolated build workspace, then run `apm pack`; `apm lock` alone does not record the deployed-file provenance required for packing transitive skills.

Install a package from a tagged release:

```bash
apm install equinor/fusion-skills/apm/fusion-developer#<release-tag> --target copilot
apm install equinor/fusion-skills/apm/fusion-developer-app#<release-tag> --target copilot
apm install equinor/fusion-skills/apm/fusion-developer-services#<release-tag> --target copilot
```

Replace `<release-tag>` with a repository release containing the packages, for example `v1.6.0`. The repository release tag makes all three source packages available at their versioned GitHub paths.

Do not replace package dependencies with symlinks. Published APM archives exclude symlinks, while dependency manifests preserve source and lockfile provenance.
