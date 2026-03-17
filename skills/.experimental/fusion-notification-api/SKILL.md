---
name: fusion-notification-api
description: Provides implementation guidance for Fusion Notification API endpoints for notification creation, patching, and notification settings flows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - notification
    - settings
    - experimental
---

# Fusion Notification API

## When to use

Use this skill for code that creates, updates, or configures notification settings through Fusion Notification API.

## When not to use

Do not use this skill for unrelated eventing systems not backed by Notification service endpoints.

## Required inputs

- workflow type (notification create/update vs settings)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- source system and app context
- required recipient and priority fields

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

Never assume notification delivery guarantees without explicit API contract evidence.
