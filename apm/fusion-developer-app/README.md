# Fusion Developer App APM Package

Installs the Fusion application-development profile for GitHub Copilot:

- the shared Fusion developer workflow for issues, PR review conversations, research, conventions, and reporting,
- application, research, code-convention, and design-system skills,
- Fusion MCP setup and troubleshooting guidance,
- a Fusion app developer agent,
- scoped TypeScript and React instructions,
- the hosted production Fusion MCP server with VS Code OAuth.

Install the current compatible `1.x` release:

```bash
apm install equinor/fusion-skills/apm/fusion-developer-app#^1.6.1 --target copilot
```

This package depends on `fusion-developer` and adds application-specific skills, agents, and TypeScript/React instructions.

For local package development from this repository checkout, use `apm install ./apm/fusion-developer-app --target copilot`.

See the [APM package guide](../README.md) and [`npx skills` migration guide](../MIGRATION.md).
