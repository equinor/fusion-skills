---
"fusion-discover-skills": patch
---

Advertise `mcp_fusion_search_skills` for semantic discovery alongside advisory `mcp_fusion_skills`.

- add `mcp_fusion_search_skills` to `mcp.suggested`
- update compatibility line to distinguish source-backed search (`mcp_fusion_search_skills`) from advisory/lifecycle operations (`mcp_fusion_skills`)
- update step 4 in instructions to route discovery to `mcp_fusion_search_skills` and lifecycle to `mcp_fusion_skills`

Resolves equinor/fusion-core-tasks#834
