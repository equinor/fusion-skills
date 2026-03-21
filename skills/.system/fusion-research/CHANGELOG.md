# Changelog

## 0.1.0 - 2026-03-20

### minor

- [#103](https://github.com/equinor/fusion-skills/pull/103) [`06b664d`](https://github.com/equinor/fusion-skills/commit/06b664d177a01a760738ae3d43f1670e665f81fe) - Add the `fusion-research-framework` skill under `skills/.system/` for source-backed Fusion Framework implementation lookup through MCP.


  - route framework research to the framework-focused MCP index
  - define repeatable search lanes for APIs, package docs, and cookbook examples
  - require source-path and excerpt evidence before finalizing answers
  - limit refinement to one pass and redirect out-of-scope requests cleanly

  resolves equinor/fusion-core-tasks#410

