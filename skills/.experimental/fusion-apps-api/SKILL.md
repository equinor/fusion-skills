---
name: fusion-apps-api
description: Guides developers integrating with the Fusion Apps service and associated app synchronization/configuration workflows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - apps
    - registry
    - experimental
---

# Fusion Apps API

## When to use

Use this skill when implementing integrations that depend on the Fusion Apps service APIs or app synchronization behavior.

## When not to use

Do not use this skill for frontend-only app manifest decisions that do not involve service interactions.

## Required inputs

- app integration objective
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- expected app metadata payload
- source-system synchronization expectations

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

Always call out when endpoint details are sparse and require source confirmation before implementation.
