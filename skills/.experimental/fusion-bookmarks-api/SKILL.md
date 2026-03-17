---
name: fusion-bookmarks-api
description: Supports integration coding against Fusion Bookmarks API for bookmark CRUD, favorites, and person-scoped bookmark operations.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - bookmarks
    - favorites
    - experimental
---

# Fusion Bookmarks API

## When to use

Use this skill for bookmark/favorite related integrations against Fusion Bookmarks service.

## When not to use

Do not use this skill for generic client-side bookmark persistence not backed by service endpoints.

## Required inputs

- workflow type (bookmark CRUD, favorites, person linkage)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- source-system context
- payload schema expectations

## Instructions

1. Scope check
2. Endpoint mapping
3. Model mapping
4. Integration code sketch
5. Validation and test notes
6. Risks and assumptions

## Expected output

Return headings in this order:
1. Scope check
2. Endpoint mapping
3. Model mapping
4. Consumer implementation plan
5. Integration code sketch
6. Validation and test notes
7. Risks and assumptions

## References
- [API surface](references/api-surface.md)

## Assets
- [Endpoint catalog](assets/endpoint-catalog.md)
- [TypeScript models](assets/models.ts)

## Safety & constraints

Never infer bookmark payload schema beyond documented view/request models.
