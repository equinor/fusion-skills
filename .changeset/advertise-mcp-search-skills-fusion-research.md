---
"fusion-research": patch
---

Switch skills catalog agent to `mcp_fusion_search_skills` for source-backed retrieval.

- update `agents/skills.agent.md` to use `mcp_fusion_search_skills` (semantic search over local skills index) instead of the advisory `mcp_fusion_skills`
- update `mcp.suggested` list in metadata: replace `mcp_fusion_skills` with `mcp_fusion_search_skills`
- update compatibility line and agent description to reflect the correct tool
- update source labels in `references/skills.query.md` evidence checklist

Resolves equinor/fusion-core-tasks#834
