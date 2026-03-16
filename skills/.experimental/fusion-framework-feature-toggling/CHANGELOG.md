# Changelog

## 0.1.0 - 2026-03-16

### minor

- [#80](https://github.com/equinor/fusion-skills/pull/80) [`112f6ae`](https://github.com/equinor/fusion-skills/commit/112f6aee1bf3b972c51fc78008856c29cb3186e8) - Add the experimental `fusion-framework-feature-toggling` skill for Fusion Framework feature-flag guidance.


  - prefer Fusion MCP retrieval when the local framework index is available
  - fall back to bundled public-source references when Fusion MCP is unavailable or weak
  - add offline assets for implementation prompts and review checklists when users do not have the server
  - anchor the guidance to current public Fusion Framework surfaces such as `enableFeatureFlag`, `enableFeatureFlagging`, `useFeature`, and the feature-flag plugins
  - call out current public-source ambiguity like `readonly` vs `readOnly` instead of inventing API details

  Related to: equinor/fusion-core-tasks#362
  resolves equinor/fusion-core-tasks#740

