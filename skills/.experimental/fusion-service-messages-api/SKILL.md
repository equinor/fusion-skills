---
name: fusion-service-messages-api
description: Provides integration guidance for Fusion Service Messages API covering app-scoped and admin message lifecycle operations.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - service-messages
    - admin
    - experimental
---

# Fusion Service Messages API

## When to use

Use this skill when implementing service message creation, update, and visibility workflows.

## When not to use

Do not use this skill for generic notification/event systems that are not Service Messages API calls.

## Required inputs

- workflow type (admin message, app message, visibility updates)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- app/service identifiers
- expected message payload and lifecycle state

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

Never bypass message visibility and validation rules in generated integration guidance.
