# Source-Backed Answer Template

Use this structure when returning a Fusion Framework research answer.

## Scope

- Scope decision: framework / redirected
- Search lane: `tsdoc` / `markdown` / `cookbook` / `storybook`
- Refinement used: yes / no

## Answer

- Give the shortest answer that is actually supported by the evidence.

## Evidence

- Source: `<metadata.source>`
  - Why it matters: `<what this source confirms>`
  - Excerpt: `<the minimal excerpt or paraphrase needed>`
- Source: `<metadata.source>`
  - Why it matters: `<optional second angle such as package context or example usage>`
  - Excerpt: `<the minimal excerpt or paraphrase needed>`

## Assumptions or uncertainty

- State what is confirmed.
- State what is inferred.
- If results stayed weak after one refinement pass, say that explicitly.

## Next step

- If still in scope: name the next file, package, or symbol to verify.
- If out of scope: redirect to `mcp_fusion_search_docs`, `mcp_fusion_search_eds`, or `fusion-mcp`.