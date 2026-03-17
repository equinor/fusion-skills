---
name: fusion-people-api
description: 'Guides developers implementing integrations with the Fusion People API using source-grounded endpoint mapping and model clarity notes. USE FOR: person/profile lookups, people search, presence, subscriptions, and image/profile workflows. DO NOT USE FOR: Roles v1 workflows or generic identity platform setup.'
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - people
    - profile
    - experimental
---

# Fusion People API

## When to use

Use this skill when implementing code that calls People API endpoints for person/profile, people picker/search, presence, or subscriptions.

## When not to use

Do not use this skill for:
- legacy roles guidance superseded by RolesV2
- generic Azure AD or identity architecture guidance
- non-Fusion people services

## Required inputs

- target workflow (search, person lookup, profile update, presence, subscription)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- API version expectations
- source system/application context
- expected request and response shape

## Instructions

1. Scope check
- Confirm the request is for People API and not Roles v1 migration work.

2. Endpoint mapping
- Use the endpoint groups documented in [API surface](references/api-surface.md).
- Identify the minimum endpoint set needed for the workflow.

3. Model mapping
- Map request and response models from the model clarity notes.
- Call out version-specific DTO differences when relevant.

4. Consumer implementation plan
- If the target is React/frontend, return a minimal TypeScript client plus a React-friendly usage pattern.
- If the target is C#, return a typed `HttpClient` wrapper and DTO record suggestions.

5. Integration code sketch
- Produce typed request/response code with explicit error handling.
- Include pagination/filtering guidance when the endpoint supports query options.

6. Validation and test notes
- Suggest integration test cases for happy path, auth failure, and data-not-found scenarios.

7. Risks and assumptions
- State assumptions clearly and highlight any unresolved model ambiguity.

## Expected output

Return in this order:
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

Never:
- include Roles v1 guidance from People API legacy endpoints
- invent DTO fields or endpoint routes
- present non-source-backed behavior as facts
