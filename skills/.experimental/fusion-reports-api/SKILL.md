---
name: fusion-reports-api
description: Supports coding integrations with Fusion Reports API for report configuration, embedding, admin operations, and group/security workflows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - reports
    - powerbi
    - experimental
---

# Fusion Reports API

## When to use

Use this skill for integrations involving report metadata, config validation, embedding setup, or report admin flows.

## When not to use

Do not use this skill for direct Power BI APIs unless Fusion Reports endpoint behavior is part of the workflow.

## Required inputs

- report workflow type (query, create/update, embed config, admin)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- report/config identifiers
- expected security and token requirements

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

Never assume security requirement checks are optional when producing integration guidance.
