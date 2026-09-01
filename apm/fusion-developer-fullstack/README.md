# Fusion Developer Full-Stack APM Package

Installs the combined Fusion application and service development profile for
GitHub Copilot:

- shared Fusion implementation, research, issue, review, convention, and delivery workflows,
- Fusion Framework React application development, testing, mocking, design, and EDS guidance,
- Fusion backend APIs, core services, infrastructure, roles, and operational guidance,
- application, testing, services, and cross-language developer agents,
- scoped TypeScript, React, C#, testing, and project instructions,
- the hosted production Fusion MCP server with VS Code OAuth.

Install the current compatible `1.x` release:

```bash
apm install equinor/fusion-skills/apm/fusion-developer-fullstack#^1.7.0 --target copilot
```

This package composes `fusion-developer-app` and `fusion-developer-services`. Both
specialized profiles already include `fusion-developer`, which APM resolves once.
Do not install the three profiles separately.

For local package development from this repository checkout, use
`apm install ./apm/fusion-developer-fullstack --target copilot`.

See the [APM package guide](../README.md) and
[`npx skills` migration guide](../MIGRATION.md).
