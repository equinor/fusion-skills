# Changelog

## 0.1.2 - 2026-03-05

### patch

- [#55](https://github.com/equinor/fusion-skills/pull/55) [`2d346c8`](https://github.com/equinor/fusion-skills/commit/2d346c812b4927ed1fdf17c92d51856d1fdc09c3) - Add required ownership metadata (`metadata.owner`, `metadata.status`) to all skills. Owner is set to `@equinor/fusion-core` (repository default) and status is set according to skill lifecycle (`active` for production skills, `experimental` for early-stage skills). Sponsor metadata was considered but is not required for MVP.


  resolves equinor/fusion-core-tasks#474

- [#55](https://github.com/equinor/fusion-skills/pull/55) [`2d346c8`](https://github.com/equinor/fusion-skills/commit/2d346c812b4927ed1fdf17c92d51856d1fdc09c3) - Improve skill activation and discoverability cues


  - Enhance description with explicit activation keywords: "continue on", "GitHub issue workflow"
  - Reorganize "When to use" section to lead with "continue work on" pattern as primary trigger
  - Add discoverable trigger examples matching common issue-solving requests

## 0.1.1 - 2026-03-03

### patch

- [#40](https://github.com/equinor/fusion-skills/pull/40) [`cd68535`](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290) - Remove deprecated `origin` frontmatter metadata from the experimental `fusion-issue-solving` skill.

## 0.1.0 - 2026-03-02

### minor

- [#35](https://github.com/equinor/fusion-skills/pull/35) [`73809e4`](https://github.com/equinor/fusion-skills/commit/73809e42d8cac011c6ba5e5c06fa321cb82ab9f7) - Add experimental `fusion-issue-solving` skill under `skills/.experimental/` with a structured workflow for issue intake, planning, implementation, validation, and PR-ready reporting.


  Includes a companion execution checklist asset for consistent progress tracking.

  resolves equinor/fusion-core-tasks#432
