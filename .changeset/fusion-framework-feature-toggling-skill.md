---
"fusion-framework-feature-toggling": minor
---

Add the experimental `fusion-framework-feature-toggling` skill for Fusion Framework feature-flag guidance.

- prefer Fusion MCP retrieval when the local framework index is available
- fall back to bundled public-source references when Fusion MCP is unavailable or weak
- add offline assets for implementation prompts and review checklists when users do not have the server
- anchor the guidance to current public Fusion Framework surfaces such as `enableFeatureFlag`, `enableFeatureFlagging`, `useFeature`, and the feature-flag plugins
- call out current public-source ambiguity like `readonly` vs `readOnly` instead of inventing API details

Related to: equinor/fusion-core-tasks#362
resolves equinor/fusion-core-tasks#740