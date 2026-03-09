---
"fusion-skill-authoring": minor
---

Refresh `fusion-skill-authoring` with clearer discovery cues, decision-gated authoring guidance, and a Fusion-flavored helper-agent layer inspired by Anthropic's `skill-creator`.

- modernize the main skill around reuse-first, evaluation-first, and progressive-disclosure patterns
- default portable scaffold naming to `custom-<name>` unless the target repository defines a stronger convention
- strengthen the follow-up questions and skill-readiness checklist for real skill authoring work
- keep the shipped package portable while restoring Fusion-specific overlays for `fusion-`, reserved skill lanes, and local validation in repo-local instructions
- bundle installable helper agents for scoping, review, and trigger tuning inside the skill package

resolves equinor/fusion-core-tasks#499