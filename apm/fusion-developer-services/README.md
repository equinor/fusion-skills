# Fusion Developer Services APM Package

Installs the Fusion service-development profile for GitHub Copilot:

- the shared Fusion developer workflow for issues, PR review conversations, research, conventions, and reporting,
- backend, core-service, research, convention, and operational skills,
- Fusion MCP setup and troubleshooting guidance,
- a Fusion services developer agent,
- scoped C# and project instructions,
- the hosted production Fusion MCP server with VS Code OAuth.

Install the current compatible `1.x` release:

```bash
apm install equinor/fusion-skills/apm/fusion-developer-services#^1.6.1 --target copilot
```

The current backend skills cover contracts, integration, research, and supporting tools. Service-specific repositories remain authoritative for implementation and hosting patterns until a dedicated service-authoring skill is added.

This package depends on `fusion-developer` and adds service-specific skills, agents, and C# instructions.

For local package development from this repository checkout, use `apm install ./apm/fusion-developer-services --target copilot`.

See the [APM package guide](../README.md) and [`npx skills` migration guide](../MIGRATION.md).
