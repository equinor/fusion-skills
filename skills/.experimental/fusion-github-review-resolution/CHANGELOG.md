# Changelog

## 0.1.2 - 2026-03-05

### patch

- [#55](https://github.com/equinor/fusion-skills/pull/55) [`2d346c8`](https://github.com/equinor/fusion-skills/commit/2d346c812b4927ed1fdf17c92d51856d1fdc09c3) - Add required ownership metadata (`metadata.owner`, `metadata.status`) to all skills. Owner is set to `@equinor/fusion-core` (repository default) and status is set according to skill lifecycle (`active` for production skills, `experimental` for early-stage skills). Sponsor metadata was considered but is not required for MVP.


  resolves equinor/fusion-core-tasks#474

## 0.1.1 - 2026-03-03

### patch

- [#40](https://github.com/equinor/fusion-skills/pull/40) [`cd68535`](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290) - Add one-operation-per-file GraphQL assets for review-thread workflows and document the MCP-vs-GraphQL tooling map in the experimental `fusion-github-review-resolution` skill.

## 0.1.0 - 2026-03-02

### minor

- [#33](https://github.com/equinor/fusion-skills/pull/33) [`c8b513c`](https://github.com/equinor/fusion-skills/commit/c8b513cb9070f73fa5c90464dc8ecfd29fab3a0c) - Add experimental `fusion-github-review-resolution` skill with a deterministic workflow for unresolved PR review comments, including review-url trigger guidance, per-comment remediation process, and checklist support.


  Add companion bash helpers:
  - `skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh`
  - `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh`

  The scripts support review-id scoped collection and safe dry-run-first resolution flows using `gh`.

  resolves equinor/fusion-core-tasks#432
