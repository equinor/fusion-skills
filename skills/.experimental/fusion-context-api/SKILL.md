---
name: fusion-context-api
description: Helps developers integrate with Fusion Context API endpoints for contexts, entities, relations, and subscriptions with clear model mapping guidance.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - context
    - entities
    - experimental
---

# Fusion Context API

## When to use

Use this skill when implementing code that reads or mutates Fusion context entities, relations, and subscriptions.

## When not to use

Do not use this skill for unrelated graph/entity services outside Fusion Context.

## Required inputs

- target context workflow (query, create, update, relation management, subscription)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- expected context types/entities
- API version and auth expectations

## Instructions

1. Scope check
2. Endpoint mapping
3. Model mapping
4. Consumer implementation plan
5. Integration code sketch
6. Validation and test notes
7. Risks and assumptions

Use [API surface](references/api-surface.md) as the source anchor for endpoint and model selection.

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

Never invent relation semantics or context type contracts.
