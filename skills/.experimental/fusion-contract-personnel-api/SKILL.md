---
name: fusion-contract-personnel-api
description: Guides developers implementing integrations with Contract Personnel API endpoints, including personnel, contracts, roles, recertifications, and subscription workflows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - contract-personnel
    - personnel
    - experimental
---

# Fusion Contract Personnel API

## When to use

Use this skill for code that reads or mutates contract-personnel domain data in Fusion.

## When not to use

Do not use this skill for non-Fusion contract systems without explicit Fusion API integration requirements.

## Required inputs

- workflow type (personnel, contracts, roles, recertification, requests)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- contract/project identifiers
- expected request and response shapes

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

Never collapse versioned contract/person models into one schema without explicit mapping.
