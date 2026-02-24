---
name: fusion-framework-research
description: Research Fusion Framework implementation details through MCP with framework-index routing, refinement steps, and source-backed evidence before answering.
license: MIT
metadata:
  version: "0.0.0"
  tags:
    - fusion
    - framework
    - research
    - mcp
  mcp:
    required:
      - fusion
---

# Fusion Framework Research

## When to use

Use this skill when a user asks for Fusion Framework:
- implementation details
- API usage and behavior
- module/service wiring
- source-backed technical explanations

Typical triggers:
- "how is this implemented in Fusion Framework"
- "which API/module handles this in framework"
- "find framework source evidence for this behavior"

## When not to use

Do not use this skill when the request is:
- platform/user documentation guidance without implementation focus
- operational setup/troubleshooting of the MCP runtime itself
- unrelated to Fusion Framework internals

If out of framework scope:
- explain the scope mismatch clearly
- route to a better path (for example `fusion-docs` index for documentation-level questions)
- do not force `fusion-framework` results when they do not fit the question

## Required inputs

Collect before searching:
- user question in one sentence
- specific symbols/areas if available (API name, module, service, feature)
- desired depth (quick summary vs deep implementation trace)

If inputs are weak, ask one concise clarification question before retrieval.

## Instructions

1. Confirm this is a Fusion Framework implementation question.
2. Run MCP retrieval using `search_framework` first:
   - user query (and symbols if provided)
   - optional `type` when the question targets content classes (`markdown`, `tsdoc`, `storybook`, `cookbook`)
   - reasonable `top` (start with 5)
   - `search_framework` already routes to the `fusion-framework` index
3. Use `search` as a fallback/advanced path when you need explicit control:
   - set `index: "fusion-framework"`
   - add `filter` when narrowing source/type is needed
   - keep `top` small and focused
4. Extract evidence from results before answering:
   - source path/title metadata
   - relevant excerpt(s)
   - short interpretation linked to each excerpt
5. If first results are weak/ambiguous, run one refinement loop:
   - sharpen query with concrete terms (API/module/class/function names)
   - add/remove qualifiers to reduce ambiguity
   - rerun `search_framework`; if still noisy, retry with `search` + explicit `index/filter`
6. If refined results are still weak:
   - state explicit uncertainty
   - provide best-effort findings with assumptions
   - suggest a targeted next query or alternative index (`fusion-docs`) if the question is likely non-framework
7. Produce final answer only after evidence is captured.

## Expected output

Return:
- concise answer to the framework question
- evidence list with source path/title + excerpt per key claim
- assumptions/uncertainty (when applicable)
- refinement note (what changed and whether it improved results)
- alternative path guidance for out-of-scope questions

## Safety & constraints

Never:
- claim framework behavior without source-backed evidence from retrieval
- fabricate paths, excerpts, APIs, or implementation details
- hide uncertainty when retrieval is weak

Always:
- route implementation queries to `fusion-framework`
- perform at least one refinement pass when initial results are weak/ambiguous
- keep claims proportional to evidence quality
