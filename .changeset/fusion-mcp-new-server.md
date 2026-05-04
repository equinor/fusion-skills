---
"fusion-mcp": minor
---

Update skill to reflect the new `equinor/fusion-mcp` server

- Replace all references to the old `fusion-poc-mcp` PoC server and image
- Promote the hosted production server (`https://mcp.api.fusion.equinor.com/mcp`) as the only recommended setup path; remove local Docker/GHCR guidance for end users
- Update VS Code config to use HTTP + OAuth (Microsoft Entra) instead of Docker `stdio` with API keys
- Rewrite `references/vscode-mcp-config.md` with one-click install link and manual OAuth config template
- Update tool inventory to match the new server: `search`, `search_framework`, `search_docs`, `search_backend_code`, `search_eds`, `search_indexes`
- Rewrite `references/mcp-call-snippets.md` with accurate per-tool parameter tables sourced from server code
- Remove `references/local-http-quickstart.md` (local setup not promoted to end users)
- Update troubleshooting to cover hosted-server failure modes (Entra auth, `401`, empty tool list)

Resolves equinor/fusion-skills#149
