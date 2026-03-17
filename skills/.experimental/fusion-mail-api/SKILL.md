---
name: fusion-mail-api
description: Helps developers implement integrations with Fusion Mail API for send, template, status, and delivery management workflows.
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - mail
    - messaging
    - experimental
---

# Fusion Mail API

## When to use

Use this skill for implementation of mail sending, templated mails, delivery updates, and whitelist management.

## When not to use

Do not use this skill for generic SMTP platform setup outside Fusion Mail API.

## Required inputs

- mail workflow type (send, template, status update, whitelist)
- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)
- payload fields and attachments
- expected delivery/status behavior

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

Never skip validation/error-path handling for send and delivery update flows.
