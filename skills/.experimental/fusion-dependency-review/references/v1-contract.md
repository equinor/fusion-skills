# V1 contract

This document records the explicit contract for the first release of `fusion-dependency-review`.

## Identity and placement

- Skill name: `fusion-dependency-review`
- Initial placement: `skills/.experimental/`
- Scope: maintainers reviewing dependency update PRs with a repeatable research and verdict structure

## Inputs

Required:

- Repository owner/name
- PR number or URL, or a copied dependency PR summary with package name, version change, changed files, and CI status

Optional:

- Maintainer concerns to prioritize
- Known advisories, changelog links, or migration notes already collected

## Outputs

The skill must produce:

- Research notes using the research template
- Separate security, code quality, and impact assessments
- A verdict with recommendation, rationale, and confidence
- Explicit follow-up items when additional work is required
- An action prompt that requests confirmation before any approve/merge step

## Review-lens strategy

V1 keeps the lenses inline inside a single skill rather than splitting them into helper agents or separate installable skills.

Reasoning:

- The output must feel like one coherent review, not three disconnected analyses.
- The first version should minimize activation complexity.
- The lens sections can still challenge each other during verdict synthesis.

## Confidence model

- `high`: evidence is consistent, CI is green, no blocking lens exists, and the blast radius is low or clearly bounded
- `medium`: at least one concern exists, impact is moderate, or source coverage is partial, but no blocker exists
- `low`: major ambiguity, failing or unknown CI, missing release notes, or conflicting lens outcomes that prevent a reliable merge recommendation

## Handoff rule for remediation work

When the review surfaces work beyond the PR itself, the skill should hand off through `fusion-issue-authoring` so the maintainer can turn follow-up into a tracked `Task`, `Bug`, or `User Story`.

Examples:

- migration steps needed after a major upgrade -> `Task`
- regression or incompatibility discovered in the target version -> `Bug`
- broader consumer-facing workflow change triggered by the update -> `User Story`

## Evaluation strategy

V1 should prove at least one representative ambiguous or high-risk case with explicit follow-up needs.

Success criteria:

- The skill activates from dependency-review prompts
- The response includes the research structure and all three lenses
- The verdict uses the confidence model consistently
- The response never auto-approves or auto-merges
- High-risk cases surface explicit handoff/follow-up guidance