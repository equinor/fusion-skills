---
name: fusion-research
description: 'Source-backed research orchestrator for the Fusion ecosystem. Routes to the correct research agent based on question type. Returns source-backed evidence only; will not invent Framework behavior, component APIs, or skill catalog relationships. USE FOR: any research question needing source-backed evidence about Fusion Framework APIs, EDS components, or the Fusion skill catalog. DO NOT USE FOR: implementing code changes, installing or editing skills, MCP setup or troubleshooting, or inventing Fusion behavior without evidence.'
license: MIT
compatibility: Works best with Fusion MCP. Dispatches to `agents/framework.agent.md` for `mcp_fusion_search_framework`, `agents/eds.agent.md` for `mcp_fusion_search_eds`, and `agents/skills.agent.md` for `mcp_fusion_skills`. If MCP is unavailable, state that clearly rather than guessing.
metadata:
  version: "0.1.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - research
    - mcp
    - evidence
    - framework
    - eds
    - skills
  mcp:
    suggested:
      - mcp_fusion_search_framework
      - mcp_fusion_search_eds
      - mcp_fusion_search_docs
      - mcp_fusion_skills
---

# Fusion Research

## When to use

Use this skill when a user needs a source-backed answer about the Fusion ecosystem.

Typical triggers:
- "Research this Fusion Framework hook and show me the supporting source."
- "What props does this EDS component accept?"
- "Which skill handles X in a Fusion workflow?"
- "Find a source-backed example for…"
- "Which Fusion package or module owns this API?"
- "Is there an EDS design token for this value?"
- "How can I persist user preferences in a Fusion app?"
- "What's the recommended pattern for X in Fusion?"
- "Show me a Fusion Framework example for building X."
- "What are the design tokens for color and spacing in EDS?"

## When not to use

Do not use this skill for:
- implementing code changes — use `fusion-app-react-dev` or the relevant dev skill; if the research is for a specific app you are actively building, use `fusion-app-react-dev` first — it will call this skill when needed
- finding, installing, updating, or removing skills — use `fusion-discover-skills`; use this skill only to understand a skill's scope, relationships, or catalog fit — not to discover what to install
- creating or editing skill files — use `fusion-skill-authoring` for authoring-time research
- Fusion MCP installation or troubleshooting — use `fusion-mcp`; once MCP is running, return here for research
- pure conceptual Fusion questions with no specific artifact name (hook, component, package, token) — ask the user for a concrete artifact reference first

## Instructions

### Step 0 — Sharpen scope (optional)

Before classifying, you may use the domain-specific follow-up questions to narrow the user's exact need:
- Framework scope: [assets/framework.follow-up.md](assets/framework.follow-up.md)
- EDS scope: [assets/eds.follow-up.md](assets/eds.follow-up.md)
- Skills catalog scope: [assets/skills.follow-up.md](assets/skills.follow-up.md)

Skip this step if the question already names a specific artifact (hook, component, package, token, or skill).

### Step 1 — Classify the research question

Determine which domain the question belongs to:

| Domain | Indicators | Agent |
| --- | --- | --- |
| **Framework** | Fusion Framework hooks, packages, modules, TypeScript APIs, cookbook examples | [`agents/framework.agent.md`](agents/framework.agent.md) |
| **EDS** | EDS component props, usage examples, accessibility, design tokens | [`agents/eds.agent.md`](agents/eds.agent.md) |
| **Skills** | Skill catalog lookup, scope boundaries, companion/orchestrator relationships | [`agents/skills.agent.md`](agents/skills.agent.md) |

If the question spans multiple domains, answer each domain separately using the appropriate agent in sequence.

### Step 2 — Dispatch to the correct agent

- Framework questions → follow [`agents/framework.agent.md`](agents/framework.agent.md).
- EDS questions → follow [`agents/eds.agent.md`](agents/eds.agent.md).
- Skills questions → follow [`agents/skills.agent.md`](agents/skills.agent.md).

If the runtime supports skill-local agents, invoke the agent directly. Otherwise, apply the agent's instructions inline.

### Step 3 — Return the source-backed answer

Use the structure in [assets/source-backed-answer-template.md](assets/source-backed-answer-template.md):
- State which domain and agent was used.
- Include one to three source-backed evidence bullets.
- End with any remaining assumptions, uncertainty, or the next verification step.

## Research agents

This skill includes three research agents in `agents/`. Each covers one Fusion research domain with its own query patterns and evidence checklist.

- **[`agents/framework.agent.md`](agents/framework.agent.md)** — source-backed answers about Fusion Framework hooks, packages, modules, and cookbook examples. Uses `mcp_fusion_search_framework`.
- **[`agents/eds.agent.md`](agents/eds.agent.md)** — source-backed answers about EDS component props, usage, accessibility, and design tokens. Uses `mcp_fusion_search_eds`.
- **[`agents/skills.agent.md`](agents/skills.agent.md)** — source-backed answers about the Fusion skill catalog: what skills exist, their scope, and how they relate. Uses `mcp_fusion_skills`.

## Assets

- [assets/source-backed-answer-template.md](assets/source-backed-answer-template.md)
- [assets/framework.follow-up.md](assets/framework.follow-up.md) — pre-dispatch scope questions for Framework research
- [assets/eds.follow-up.md](assets/eds.follow-up.md) — pre-dispatch scope questions for EDS research
- [assets/skills.follow-up.md](assets/skills.follow-up.md) — pre-dispatch scope questions for skills catalog research

## Safety & constraints

Never:
- invent Fusion Framework hooks, EDS props, or skill catalog entries
- claim evidence exists when MCP is unavailable or results are weak
- keep refining indefinitely — state uncertainty after one refinement pass per agent
- implement code changes or mutate repositories during a research flow

Always:
- classify the question before choosing an agent
- capture the source path and supporting excerpt before finalizing any claim
- state explicitly which agent and source backed each part of the answer