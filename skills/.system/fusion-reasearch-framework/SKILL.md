---
name: fusion-reasearch-framework
description: 'Researches Fusion Framework implementation questions through the framework MCP index, uses repeatable query lanes for APIs, packages, and examples, and returns source-backed answers with one refinement pass when results are weak. USE FOR: Fusion Framework package or hook behavior, module and API lookup, cookbook example discovery, source-backed implementation answers. DO NOT USE FOR: general Fusion product docs, EDS component docs, MCP setup, or inventing framework behavior without evidence.'
license: MIT
compatibility: Works best with Fusion MCP access via `mcp_fusion_search_framework`, with `mcp_fusion_search_docs` and `mcp_fusion_search_eds` available for out-of-scope redirects. If Fusion MCP is unavailable, this skill should say so clearly and avoid claiming verified framework evidence.
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - framework
    - research
    - mcp
    - evidence
    - api
  mcp:
    suggested:
      - mcp_fusion
---

# Fusion Reasearch Framework

## When to use

Use this skill when a user needs a source-backed answer about Fusion Framework implementation details.

Typical triggers:
- "How does `useFramework` work?"
- "Which package owns `FrameworkConfigurator`?"
- "Find a Fusion Framework example for loaders and `fusion.modules.http`."
- "Research this Fusion Framework hook and show me the supporting source."
- "Which module or package should I read for this framework behavior?"

## When not to use

Do not use this skill for:
- general Fusion product documentation, onboarding, or ADR context
- EDS component props, accessibility, or design-token questions
- Fusion MCP installation or troubleshooting
- business logic or repository-specific code that is not a Fusion Framework question

## Required inputs

Collect before responding:
- the framework question in the user's own words
- the intended help shape: API lookup, package overview, example search, or behavior verification
- any exact package, hook, module, or symbol names already known
- whether the user wants a quick answer or a deeper evidence set
- any local code snippet that should be compared to the framework sources

If key inputs are missing, ask only the smallest follow-up needed to choose the right search lane.

## Instructions

1. Confirm the question is really about Fusion Framework implementation.
   - If the user wants broader platform or product guidance, redirect to `mcp_fusion_search_docs` instead of forcing a framework answer.
   - If the user wants EDS component guidance, redirect to `mcp_fusion_search_eds`.
   - If the user needs MCP setup or troubleshooting, redirect to `fusion-mcp`.

2. Choose the initial search lane using [references/query-patterns.md](references/query-patterns.md).
   - Use `tsdoc` for exact hooks, functions, classes, or symbols.
   - Use `markdown` for package overviews, README guidance, and module summaries.
   - Use `cookbook` for how-to and implementation examples.
   - Use `storybook` only when the user clearly needs a framework-owned UI example rather than EDS documentation.

3. Query the framework index first.
   - Call `mcp_fusion_search_framework` with the user's wording plus the exact symbol, package, or workflow terms when known.
   - Use the `type` filter when the lane is obvious.
   - Start small, usually `top: 3` to `top: 5`.
   - Capture the result `metadata.source`, `metadata.type`, any useful package metadata, and the excerpt that supports the claim.

4. Evaluate whether the first pass is good enough.
   - A strong hit directly names the requested symbol, package, or workflow and includes an excerpt that supports the answer.
   - If the first pass is weak or ambiguous, do one refinement pass only.
   - Refine by adding the exact symbol or package name, narrowing the `type`, or switching lanes from API to package docs or cookbook examples.
   - If the second pass is still weak, stop searching and state the uncertainty plainly.

5. Build the answer from evidence, not guesswork.
   - Prefer one to three sources that each add something useful, such as a `tsdoc` definition plus a `markdown` overview or `cookbook` example.
   - Quote or paraphrase only the excerpt needed to support the point.
   - Separate confirmed facts from inference.
   - If the user's local code differs from the retrieved examples, call out the mismatch and what should be verified locally.

6. Return the answer with the structure in [assets/source-backed-answer-template.md](assets/source-backed-answer-template.md).
   - Include the search lane used and whether a refinement pass was needed.
   - Include source paths and the excerpt-backed reasoning for each claim.
   - End with assumptions, uncertainty, or the next verification step when the evidence is incomplete.

## Representative requests

- "Research `useFrameworkModule` and tell me what it returns."
- "Find the right package and source for `FrameworkConfigurator` and `init`."
- "Show me a Fusion Framework example of loaders using `fusion.modules.http`."

## Expected output

Return:
- whether the request stayed in framework scope or was redirected elsewhere
- the search lane used: `tsdoc`, `markdown`, `cookbook`, or `storybook`
- whether a refinement pass was needed
- a concise answer grounded in one to three source-backed evidence bullets
- any explicit assumptions or uncertainty that remain
- the next best search or verification step when evidence is weak or the question is out of scope

## References

- [references/query-patterns.md](references/query-patterns.md)

## Assets

- [assets/source-backed-answer-template.md](assets/source-backed-answer-template.md)

## Safety & constraints

Never:
- invent Fusion Framework hooks, packages, modules, or behaviors
- claim framework evidence exists when MCP is unavailable or the results are weak
- keep refining indefinitely instead of stating uncertainty
- use `fusion-docs` or `eds` results as if they were framework implementation proof

Always:
- prefer `mcp_fusion_search_framework` first for framework questions
- capture `metadata.source` and the supporting excerpt before finalizing an answer
- do at most one refinement pass
- redirect cleanly when the request belongs in docs, EDS, or MCP setup instead