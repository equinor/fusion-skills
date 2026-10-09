# New Fusion API checklist

Code (this skill):

- [ ] `backend/` layout from `references/recommended-layout.md`, `nuget.config` with Fusion-Public, `Program.cs` composing `AddXxx` extensions
- [ ] Project file: nullable, warnings as errors, `GenerateDocumentationFile`
- [ ] Authentication (Microsoft.Identity.Web, workload identity) + fallback policy requiring an authenticated user
- [ ] `AddFusionIntegration` + `AddFusionRolesV2`, `<App>AccessRoles` constants matching the roles config
- [ ] MediatR < 13 with `TelemetryBehaviour` and `RequestValidationBehavior`; FluentValidation validators
- [ ] Versioning + OpenAPI through the versioning builder; Swagger UI in Development only
- [ ] `AddProblemDetails` with `traceId`, `IExceptionHandler`s for validation, domain, and OData errors; `UseExceptionHandler()` first
- [ ] Controllers: FluentAuthorization, `[ProducesResponseType]` per status, XML docs, `Api*` model per endpoint, `{ value, totalCount }` lists, OData attributes, OPTIONS endpoints
- [ ] EF Core on Azure SQL with `AddSqlDbContext(...).AddAccessTokenSupport().AddDefaultSqlTokenCredentials()`, Fluent configurations, design-time factory, initial migration
- [ ] OpenTelemetry → Azure Monitor with own ActivitySource + `Fusion.Integration`; CORS for Fusion origins; `/health` + `/health/live`
- [ ] Multi-pod review: caches, Data Protection, background work (`references/caching-and-multi-pod.md`)
- [ ] Integration tests with `WebApplicationFactory`, SQLite, Fusion test users, Roles V2 mock
- [ ] Dockerfile on chiseled ASP.NET image, non-root, port 8080

Platform (outside this skill; record in `docs/manual-solution-setup.md`):

- [ ] App registrations per environment
- [ ] Roles V2 system + `infra/roles/*.json`, deployed with `froles`
- [ ] `infra/database/db-config.json`, provisioned with `finf`
- [ ] Radix app + `radixconfig.yaml`, workload identity, App Insights secret
- [ ] Bicep bootstrap (resource group, pipeline identities, App Insights)
- [ ] GitHub workflows: build, deploy (provision → migrate → deploy), infra, PR preview, help
