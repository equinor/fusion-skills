# API Skill Template

Use this template when creating a new experimental API skill under `skills/.experimental/`.

## Folder structure

```text
skills/.experimental/<skill-name>/
  SKILL.md
  references/
    api-surface.md
```

## SKILL.md template

```markdown
---
name: <skill-name>
description: <one-sentence purpose with clear triggers>
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - fusion
    - api
    - experimental
---

# <Skill Title>

## When to use

## When not to use

## Required inputs

- target consumer shape (`react`, `typescript client`, `csharp httpclient`, or other)

## Instructions

- map the request to a concrete endpoint group and model family
- if the consumer is React/frontend, return TypeScript-friendly DTOs and a starter fetch/query pattern
- if the service exposes `OPTIONS` or other access-probe routes, explain how the client can use them to disable edit/create/delete functionality when the caller lacks write permissions
- if the consumer is C#, return a typed `HttpClient` example with DTO records and serializer assumptions

## Expected output

- Scope check
- Endpoint mapping
- Model mapping
- Consumer implementation plan
- Integration code sketch
- Validation and test notes
- Risks and assumptions

## References
- [API surface](references/api-surface.md)

## Safety & constraints
```

## `references/api-surface.md` additions

Each API skill should add these self-contained sections:

- `Priority workflow coverage`
- `Capability / OPTIONS defaults` when supported by the service
- `React/TypeScript defaults`
- `C# HttpClient defaults`
- `Representative model snapshots`
- `Validation highlights`
- `Suggested local models`

When relevant, prefer these concrete client stacks in examples:
- Fusion Framework frontend: `@equinor/fusion-framework-module-http`, `@equinor/fusion-framework-module-service-discovery`, `useHttpClient(name)`, `serviceDiscovery.createClient(name)`
- Frontend capability handling: use `OPTIONS` or equivalent access-probe endpoints to drive conditional UI such as disabling editing when the current caller only has read access
- .NET backend/console: `AddFusionIntegrationCore(environment)`, `AddFusionIntegrationHttpClient(name, setup)`, `WithFusionServiceEndpoint(FusionServiceEndpointKeys.<Service>)`, `FusionHttpClientOptions`, service discovery through Fusion endpoint keys
- .NET web apps / web APIs calling downstream Fusion services: `Microsoft.Identity.Web`, `EnableTokenAcquisitionToCallDownstreamApi(...)`, and Fusion integration configured with `UseMsalTokenProvider()` inside `AddFusionIntegration(...)` or `AddFusionMsalTokenProvider()` when wiring the token provider directly
- For backend hosting and non-secret production auth, prefer workload identity federation / federated credentials over client secrets; if custom token assertion flow is needed, align with Fusion token options that support federated credentials via client assertion configuration
