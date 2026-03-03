# Changelog

## 0.1.2 - 2026-03-03

### patch

- [#42](https://github.com/equinor/fusion-skills/pull/42) [`947c0ab`](https://github.com/equinor/fusion-skills/commit/947c0ab73844f5eb13b80e7cb2f3e5ea8146ea59) - Shift publish/repair execution in `fusion-issue-task-planning` to delegated handling through `fusion-issue-authoring` (prefer sub-agent invocation), while keeping this skill focused on planning and draft generation.


  Clarifies that MCP-first mutation and GraphQL fallback behavior are enforced by the delegated authoring workflow.

  Removes local `fusion-issue-task-planning/assets/graphql/` fallback files and points fallback usage to `fusion-issue-authoring/assets/graphql/`.

  refs equinor/fusion-skills#40
  resolves equinor/fusion-core-tasks#446

## 0.1.1 - 2026-03-03

### patch

- [#40](https://github.com/equinor/fusion-skills/pull/40) [`cd68535`](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290) - Refine the experimental `fusion-issue-task-planning` workflow to be MCP-first for issue publishing and repair, clarify parent-linking as a separate sub-issue operation, and add reusable GraphQL fallback query/mutation files under `skills/.experimental/fusion-issue-task-planning/assets/graphql/`.


  resolves equinor/fusion-skills#39

## 0.1.0 - 2026-03-02

### minor

- [#37](https://github.com/equinor/fusion-skills/pull/37) [`54d03bc`](https://github.com/equinor/fusion-skills/commit/54d03bcc21bdf71c0f8aefa5f00c3ded7f22b3b9) - Add experimental `fusion-issue-task-planning` skill with user-story task planning workflow, explicit publish gates, provenance metadata, and reusable planning assets.


  References equinor/fusion-core-tasks#430.
