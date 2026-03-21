---
"fusion-research": minor
---

Rename `fusion-research-framework` to `fusion-research` and expand into a multi-domain research orchestrator.

- rename skill from `fusion-research-framework` to `fusion-research`
- expand scope from framework-only to three research domains: Framework, EDS, and skill catalog
- add `agents/framework.agent.md` — source-backed Fusion Framework API and cookbook research via `mcp_fusion_search_framework`
- add `agents/eds.agent.md` — source-backed EDS component props, usage, accessibility, and design token research via `mcp_fusion_search_eds`
- add `agents/skills.agent.md` — source-backed skill catalog lookup, scope boundary, and companion relationship research via `mcp_fusion_skills`
- add `assets/framework.follow-up.md`, `assets/eds.follow-up.md`, `assets/skills.follow-up.md` — pre-dispatch scope-sharpening questions per domain
- add `references/framework.query.md`, `references/eds.query.md`, `references/skills.query.md` — repeatable query patterns and evidence checklists per domain
- update `assets/source-backed-answer-template.md` to cover all three domains
- connect to `fusion-mcp` as next-step redirect when MCP is not yet running
- tighten discovery contract: description, trigger phrases, and "When not to use" boundaries
- apply council review fixes: remove erroneous `cookbook` lane reference from EDS agent, orphan follow-up assets linked from SKILL.md, `mcp_fusion_search_docs` added to suggested MCP list

Resolves equinor/fusion-core-tasks#837
Resolves equinor/fusion-core-tasks#838
