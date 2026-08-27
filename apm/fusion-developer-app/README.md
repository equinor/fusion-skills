# Fusion Developer App APM Package

Installs the Fusion application-development profile for GitHub Copilot:

- the shared Fusion developer workflow for issues, PR review conversations, research, conventions, and reporting,
- application, research, code-convention, and design-system skills,
- Fusion MCP setup and troubleshooting guidance,
- a Fusion app developer agent,
- scoped TypeScript and React instructions,
- the hosted production Fusion MCP server with VS Code OAuth.

Install from this repository checkout:

```bash
apm install ./apm/fusion-developer-app --target copilot
```

Remote installs can target this package after it is included in a repository release.

This package depends on `fusion-developer` and adds application-specific skills, agents, and TypeScript/React instructions.
