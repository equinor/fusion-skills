# Fusion Developer APM Package

Installs the shared Fusion development profile for GitHub Copilot:

- source-backed Fusion research and MCP guidance,
- Fusion API testing and service discovery with DevTools,
- Fusion skill lifecycle management and sanitized self-reporting,
- Fusion code conventions and review reporting,
- GitHub issue drafting, triage, and publishing,
- user-story decomposition into traceable task drafts,
- end-to-end GitHub issue implementation,
- structured dependency update review,
- unresolved pull request review conversation handling,
- a cross-language Fusion developer agent,
- on-demand implementation and delivery instructions,
- the hosted production Fusion MCP server with VS Code OAuth.

Install from this repository checkout:

```bash
apm install ./apm/fusion-developer --target copilot
```

Application and service profiles depend on this package and add their domain-specific skills, agents, and instructions.
