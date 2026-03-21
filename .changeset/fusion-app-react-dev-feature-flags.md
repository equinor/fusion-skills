---
"fusion-app-react-dev": minor
---

Add feature-flag guidance as `references/using-feature-flags.md`

- Covers app-level `enableFeatureFlag` + `useFeature` from `@equinor/fusion-framework-react-app/feature-flag`
- Covers framework-level `enableFeatureFlagging` with `createLocalStoragePlugin` and `createUrlPlugin` from `@equinor/fusion-framework-module-feature-flag`
- Documents provider-based `useFeature(provider, key)` variant
- Includes rollout checklist and cleanup guidance
- Calls out `readonly` vs `readOnly` API ambiguity
- Updated Step 6 module table and trigger phrases in SKILL.md to point to the new reference

Resolves equinor/fusion-core-tasks#840
