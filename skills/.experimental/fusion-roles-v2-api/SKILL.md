---
name: fusion-roles-v2-api
description: Guides integration work for Fusion RolesV2 API endpoints for roles, claimable roles, access roles, accounts, systems, and scope types.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - roles
    - rolesv2
    - access-control
    - experimental
---

# Fusion RolesV2 API

## When to use

Use this skill when implementing role management integrations against the RolesV2 service.

## When not to use

Do not use this skill for deprecated Roles v1 patterns.

## Required inputs

- role workflow (assign, activate, claimable role, scope type, system registration)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- account/system identifiers
- expected scope and ownership constraints

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

Never propose migration back to Roles v1; keep guidance anchored to RolesV2.
