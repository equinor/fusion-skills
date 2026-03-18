# API Skill Standards (Experimental)

This document defines the baseline structure and quality bar for experimental API interaction skills in this repository.

## Scope

Use this standard for skills in `skills/.experimental/` that help developers create code interacting with Fusion Core service APIs.

Explicit exclusions for the current wave:
- `Fusion.Services.Roles` (v1)
- `Fusion.Services.Org`
- roles endpoints in `Fusion.Services.People` that are superseded by `Fusion.Services.RolesV2`

## Required Sections in `SKILL.md`

1. Frontmatter metadata
- `name`
- `description`
- `license`
- `metadata.version` (new skills default to `"0.0.0"`)
- `metadata.status` (`experimental` for this wave)
- `metadata.owner` (`@equinor/fusion-core` unless otherwise specified)
- `metadata.tags`

2. Intent boundaries
- `When to use`
- `When not to use`

3. Input contract
- `Required inputs` section with minimal set needed to produce grounded API integration code.

4. Execution guidance
- `Instructions` section that prioritizes repository-grounded evidence:
  - endpoint discovery from controller files and route attributes
  - capability discovery from `OPTIONS` routes or other access-probe patterns when the service exposes them
  - model discovery from API model packages and view model classes
  - versioning and request/response handling details
  - consumer-oriented guidance for at least these integration shapes:
    - frontend React/TypeScript application
    - C# `HttpClient` consumer for console, worker, or backend integration

5. Output contract
- `Expected output` section with a deterministic response shape.

6. Safety boundaries
- `Safety & constraints` with anti-hallucination and anti-destructive constraints.

7. API evidence
- `References` must include a local `references/api-surface.md` file.

## Required Sections in `references/api-surface.md`

Each API skill must document:
- service source path
- endpoint coverage map with priority workflows, not just controller names
- capability or `OPTIONS` probe routes when the service exposes them and they affect client behavior
- endpoint groups (by controller/domain)
- model clarity map (key request/response model families)
- known versioning notes
- explicit out-of-scope notes (if relevant)
- consumer integration defaults for React/TypeScript
- consumer integration defaults for C# `HttpClient`
- suggested local model names or starter DTO shapes so the skill can answer without re-reading source files
- preferred frontend transport stack when a Fusion Framework app is the consumer
- preferred backend transport stack when `fusion-integration-lib` is available
- representative model snapshots for common request/response shapes
- validation highlights for important request types, especially required properties and notable constraints

## Output Format Baseline

Every API skill response should include these headings in order:
1. Scope check
2. Endpoint mapping
3. Model mapping
4. Consumer implementation plan
5. Integration code sketch
6. Validation and test notes
7. Risks and assumptions

## Client stack defaults

When the consumer is a Fusion Framework frontend, prefer these packages and patterns before generic `fetch` wrappers:
- `@equinor/fusion-framework-module-http`
- `@equinor/fusion-framework-module-service-discovery`
- `@equinor/fusion-framework-react-module-http`
- `@equinor/fusion-framework-module-services` when a typed service client already exists

Use these patterns explicitly when relevant:
- `useHttpClient(name)` in React components
- `serviceDiscovery.createClient(serviceName)` for service-resolved clients
- `IHttpClient.json<T>()`, `fetch<T>()`, or selector-based response handling
- `OPTIONS` capability checks, or equivalent access-probe endpoints, to decide whether create/edit/delete UI should be enabled for the current caller

When the consumer is a .NET console app, worker, or backend service and `fusion-integration-lib` is available, prefer these patterns before raw `new HttpClient()` setup:
- `AddFusionIntegrationCore(environment)` to wire service discovery and HTTP support
- `AddFusionIntegrationHttpClient(name, setup)`
- `WithFusionServiceEndpoint(FusionServiceEndpointKeys.<Service>)`
- `FusionHttpClientOptions` with a Fusion endpoint key or explicit URI
- service discovery via `DefaultFusionEndpointResolver` / configured `Fusion:ServiceDiscovery:*`
- typed wrapper classes over the named `HttpClient`

## Verification Checklist

Before considering a skill ready:
- endpoint groups are grounded in current source files
- priority endpoint/workflow coverage is broad enough that common consumer tasks do not require source spelunking
- capability-probe or `OPTIONS` routes are documented when the service uses them to expose effective permissions
- model notes point to concrete model families or packages
- exclusions are explicit where scope is deprecated or superseded
- no generic/non-Fusion assumptions are presented as facts
- examples are copy/pasteable and include safe defaults
- frontend guidance explains when it is appropriate to disable editing functionality based on the caller's effective API capabilities
- React/TypeScript guidance can produce a starter client and local DTOs without needing to browse source files again
- C# guidance can produce a typed `HttpClient` wrapper and DTO records without needing to browse source files again
- representative request/response model notes are present for common workflows
- required-field and constraint notes are present for at least the highest-value request models
