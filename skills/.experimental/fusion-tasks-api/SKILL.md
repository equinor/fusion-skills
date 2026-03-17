---
name: fusion-tasks-api
description: Supports implementation against Fusion Tasks API endpoints spanning Fusion tasks and source-system task integrations (PIMS and ProCoSys).
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - tasks
    - procosys
    - pims
    - experimental
---

# Fusion Tasks API

## When to use

Use this skill for integrations with Fusion tasks endpoints, including source-system task representations.

## When not to use

Do not use this skill for unrelated work management APIs outside Fusion Tasks.

## Required inputs

- workflow type (fusion task CRUD, pims/procosys retrieval, subscriptions)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- source system constraints
- required task fields and context references

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

Never merge source-system task models without explicitly mapping differences.
