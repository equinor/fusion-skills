---
name: fusion-developer-service
description: 'Guides building and changing Fusion backend APIs in .NET: project layout, MVC controllers, MediatR CQRS, API contracts and OpenAPI, ProblemDetails, authorization with Fusion Roles V2 and FluentAuthorization, OPTIONS endpoints, OData, Azure SQL via Fusion Database-as-a-Service, Fusion.Integration, Fusion events, multi-pod caching, observability, CORS, and integration tests with Fusion.Testing. USE FOR: creating a new Fusion API, adding or reviewing endpoints, commands, queries, persistence, authorization, event handlers, caching, hosting setup, and tests in a Fusion .NET service. DO NOT USE FOR: frontend apps (use fusion-developer-app), only calling existing Fusion APIs from a client (use fusion-core-services), changing fusion-core-services internals (follow that repo), or running finf/froles/fhelp CLIs (use fusion-infra-cli, fusion-roles-cli, fusion-help-docs).'
license: MIT
compatibility: Targets ASP.NET Core on .NET 8+ (examples from .NET 10 apps). Packages come from nuget.org and the Fusion-Public feed. Works best with Fusion MCP for deeper docs and library lookups.
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  skills:
    - fusion-research
    - fusion-code-conventions
    - fusion-infra-cli
    - fusion-roles-cli
    - fusion-help-docs
    - fusion-devtools
  tags:
    - fusion-backend
    - dotnet
    - aspnetcore
    - api-development
    - mediatr
    - odata
    - roles-v2
    - fusion-integration
    - testing
  mcp:
    suggested:
      - fusion
---

# Fusion Service Development

## When to use

Building or changing a Fusion backend API (.NET, ASP.NET Core).

Typical triggers:
- "Create a new Fusion API / backend for ..."
- "Add an endpoint / command / query / entity"
- "Protect this endpoint with Roles V2", "frontend needs to know what the user can do"
- "Add filtering and paging", "keep a local copy of profiles in sync", "cache this, we run several pods"
- "Wire up telemetry / CORS / health checks / OpenAPI"
- "Write integration tests for this API"

## When not to use

- Fusion Framework React apps → `fusion-developer-app`
- Only consuming existing Fusion Core APIs → `fusion-core-services`
- Changes inside `fusion-core-services` → follow that repo's instructions (`CODEMAP.md`, `.github/instructions/`)
- Running `finf`, `froles`, `fhelp` → `fusion-infra-cli`, `fusion-roles-cli`, `fusion-help-docs`

## Core rule: existing code wins

Recommendations here are defaults for **new** code and **new** repos. In an existing repo, read its layout, ADRs
(`docs/adr/`), `CODEMAP.md`, and instructions first, then follow its patterns even where they differ. Mention a
deviation from these defaults only when it causes a real problem; do not refactor unasked.

## Defaults at a glance

| Area | Default |
| --- | --- |
| API style | MVC controllers (`[ApiController]`, `ControllerBase`), not minimal APIs |
| CQRS | MediatR **< 13** (12.5.0 is Apache-licensed), handlers next to their request, pipeline behaviours |
| Validation | FluentValidation through a MediatR behaviour (recommended, not mandatory) |
| Contract | `[ProducesResponseType]` for every status, XML docs in OpenAPI, own `Api*` model per endpoint, lists as `{ value, totalCount }`, never `JsonIgnore` |
| Errors | ProblemDetails for every error, `traceId` extension, central exception mapping |
| Auth | Entra ID JWT + Fusion Roles V2 access roles, checked with FluentAuthorization; OPTIONS endpoints return `Allow` |
| Querying | `Fusion.AspNetCore` OData (`$filter`, `$top`, `$skip`, `$expand`) |
| Data | Azure SQL via Fusion Database-as-a-Service (`finf`), EF Core, Entra token auth, no passwords |
| Hosting | OpenTelemetry → Azure Monitor, CORS for Fusion origins, `/health` + `/health/live`, Radix |
| Multi-pod | Assume ≥ 2 replicas: no per-pod state that must be shared; shared Data Protection keys |
| Tests | `WebApplicationFactory` integration tests with `Fusion.Testing` + `Fusion.Testing.Authentication` |

## Instructions

### Step 1 — Discover conventions

1. Find solution/project files, `Program.cs`, registration extensions, `Controllers/`, `Domain/`, `Database/`.
2. Read `docs/adr/`, `CODEMAP.md`, `CONTRIBUTING.md`, `.github/instructions/` if present.
3. Note target framework, package versions, test framework, and how auth/roles are registered.
4. New repo → use `references/recommended-layout.md` and `assets/new-api-checklist.md`.

### Step 2 — Plan

Map the request to files: controller action → request/response models → command/query + handler → entity/config →
tests. Read only the references the task needs:

| Need | Reference |
| --- | --- |
| Folder layout, `Program.cs`, registration extensions, packages | `references/recommended-layout.md` |
| Controllers, status codes, OpenAPI/XML docs, API models, list wrapper, PATCH, versioning | `references/api-conventions.md` |
| Commands, queries, handlers, behaviours, validation | `references/using-mediatr.md` |
| ProblemDetails, traceId, exception mapping | `references/error-handling.md` |
| Roles V2 checks, FluentAuthorization, OPTIONS endpoints, test roles | `references/using-fluent-authorization.md` |
| Filtering, paging, search, expand | `references/using-odata.md` |
| Azure SQL, EF Core, migrations, finf, local DB | `references/using-sql-database.md` |
| Telemetry, CORS, health, container, Radix settings | `references/hosting-and-observability.md` |
| Calling Fusion/other APIs, profiles, context, Roles V2 client | `references/using-fusion-integration.md` |
| Reacting to Fusion events (profiles, context, roles) | `references/using-fusion-events.md` |
| Caching with several pods, Data Protection, SAS tokens | `references/caching-and-multi-pod.md` |
| Which Fusion NuGet packages exist and when to use them | `references/fusion-libraries.md` |
| Integration tests | `references/testing.md` |
| Radix, PR environments, roles/db/help deployment, IaC, workload identity | `references/platform-and-deployment.md` |

### Step 3 — Implement

- Thin controllers: authorize → map request → `mediator.Send` → map to `Api*` model → typed result.
- Business logic in handlers; EF Core entities (`Db*`) never leave the domain layer.
- Propagate `CancellationToken` to MediatR and EF Core.
- Access-role names as constants mirrored from the roles config; never inline strings.
- Apply `fusion-code-conventions` for naming, XML docs, nullability, and comments.

### Step 4 — Test

Add or update integration tests for success, forbidden (403), not found (404), and validation (400) paths.
Follow `references/testing.md`.

### Step 5 — Validate

1. `dotnet build` with warnings as errors; `dotnet test`.
2. Walk `assets/review-checklist.md`.
3. Report what changed, manual steps left (app registration, roles, database, Radix), and real validation output.

## Research

- Fusion MCP: `mcp_fusion_search_docs` for platform guides (Radix, Roles V2, database, PR pipeline),
  `mcp_fusion_search_backend_code` for library and service source. Use `fusion-research` when unsure.
- If MCP is unavailable, say so and link the docs: `https://docs.fusion.equinor.com/docs/developer/api`.
- Never invent Fusion package names, extension methods, or endpoints. Check a reference file, MCP, or library README first.

## Expected output

- Code following repo conventions (or the defaults above for new repos) that builds and passes tests.
- Tests for new behavior.
- Short summary: changes, decisions with reasons, remaining manual/platform steps.

## Safety & constraints

- Never commit secrets, client secrets, connection-string passwords, or tokens; use workload identity.
- Never hand-create Azure SQL databases for Fusion apps; use Fusion Database-as-a-Service (`finf`).
- Do not deploy, run `finf`/`froles` against shared environments, or push without explicit user approval.
- No new dependencies beyond the defaults here without stating why.
