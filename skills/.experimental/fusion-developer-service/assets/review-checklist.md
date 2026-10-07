# Review checklist for Fusion API changes

Existing repo conventions override any item here.

## Contract

- [ ] MVC controller action with `[MapToApiVersion]`, route, and `[ProducesResponseType]` for every possible status
- [ ] XML `<summary>`/`<param>` on actions and `Api*` models; visible in `/openapi/v1.json`
- [ ] Response is an `Api*` model built from a `Query*` model; no `Db*` entities, no reuse of another endpoint's model
- [ ] Lists wrapped as `{ value, totalCount }`; `$top` clamped; count taken before paging
- [ ] No `[JsonIgnore]` / `NullValueHandling.Ignore`; PATCH uses `PatchProperty<T>`

## Behaviour

- [ ] Authorization first, via FluentAuthorization and access-role constants; 403 via `CreateForbiddenResponseAsync`
- [ ] OPTIONS endpoints updated when verbs or roles change
- [ ] Logic in a MediatR handler; `CancellationToken` passed to MediatR and EF Core
- [ ] Errors surface as ProblemDetails with `traceId`; domain exceptions mapped centrally
- [ ] Input validated (FluentValidation or explicit checks) with 400 `ValidationProblemDetails`

## Data

- [ ] Entity changes have a migration in the same change; migration is backward compatible
- [ ] Queries use `AsNoTracking` and projections; no N+1
- [ ] Concurrency handled where edits can collide (`rowversion` → 409)

## Runtime

- [ ] Safe with multiple pods (caches, background work, Data Protection)
- [ ] No secrets in code or config; outbound calls use workload identity
- [ ] New spans/logs use structured templates; no sensitive data logged

## Tests

- [ ] Success, 403, 404, 400 paths covered through `WebApplicationFactory`
- [ ] `dotnet build` (warnings as errors) and `dotnet test` pass
