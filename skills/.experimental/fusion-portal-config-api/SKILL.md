---
name: fusion-portal-config-api
description: Guides implementation against Fusion Portal Config API for portals, templates, categories, tags, and settings management flows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - portal
    - config
    - templates
    - experimental
---

# Fusion Portal Config API

## When to use

Use this skill for integrations that create, update, or query portal configuration resources.

## When not to use

Do not use this skill for front-end-only portal rendering concerns without service calls.

## Required inputs

- configuration workflow (portal, template, category, tag, settings)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- portal/template identifiers
- expected schema and lifecycle constraints

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

Never treat schema-dependent template operations as generic CRUD without version-aware checks.
