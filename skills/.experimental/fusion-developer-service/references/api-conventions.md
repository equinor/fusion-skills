# API conventions

## Contents

- MVC controllers
- Status codes in OpenAPI
- XML docs → OpenAPI
- Versioning
- API models
- Lists
- PATCH
- Caching responses

Defaults for new endpoints. Follow the existing repo when it differs.

## MVC controllers

Use MVC controllers, not minimal APIs: attributes carry versioning, status codes, OData, and authorization metadata
consistently and are what Fusion repos and reviewers expect.

```csharp
[ApiController]
[ApiVersion("1.0")]
[Route("items")]
public class ItemsController(IMediator mediator) : ControllerBase
{
    /// <summary>Gets one item.</summary>
    /// <param name="id">Item id.</param>
    [MapToApiVersion("1.0")]
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(void), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiItem>> Get(Guid id, CancellationToken cancellationToken)
    {
        var auth = await Request.RequireEnhancedAuthorizationAsync(r => r.Must(m => m.HaveActiveAccessRole(AppAccessRoles.Read)));
        if (auth.Unauthorized)
        {
            return await auth.CreateForbiddenResponseAsync();
        }

        QueryItem? item = await mediator.Send(new GetItem(id), cancellationToken);
        return item is null ? NotFound() : Ok(ApiItem.FromQueryModel(item));
    }
}
```

Controller job: authorize → map input → `mediator.Send` → map to `Api*` → typed result. No EF Core, no business rules.

## Status codes in OpenAPI

Declare **every** status an action can return with `[ProducesResponseType]`, not only 200/201:

| Status | Type | When |
| --- | --- | --- |
| 200 / 201 / 204 | `Api*` / `Api*` / `void` | Success (`CreatedAtAction` for 201) |
| 400 | `ValidationProblemDetails` | Validation or malformed OData |
| 401 | `void` | No/invalid token (from auth middleware) |
| 403 | `ProblemDetails` | Missing access role (FluentAuthorization) |
| 404 | `ProblemDetails` | Resource not found |
| 409 | `ProblemDetails` | Conflict / concurrency |
| 503 | `ProblemDetails` | Downstream dependency unavailable |

## XML docs → OpenAPI

- `<GenerateDocumentationFile>true</GenerateDocumentationFile>` + `<NoWarn>$(NoWarn);1591</NoWarn>`.
- `/// <summary>` on every action, `<param>` for route/query parameters, summaries on `Api*` models and properties.
- `Microsoft.AspNetCore.OpenApi` (.NET 9+) adds XML comments automatically for a plain `AddOpenApi()`. When OpenAPI is
  registered through `Asp.Versioning.OpenApi` (`.AddOpenApi(...)` on the versioning builder), add small
  `XmlCommentsOperationTransformer`/`XmlCommentsSchemaTransformer` classes (`<App>.Api/OpenApi/`) when the
  descriptions do not appear in `/openapi/v1.json`.

## Versioning

Asp.Versioning, query `api-version` or header `x-api-version`, default 1.0, URL stays unversioned:

```csharp
services.AddApiVersioning(o =>
{
    o.ReportApiVersions = true;
    o.DefaultApiVersion = new ApiVersion(1, 0);
    o.AssumeDefaultVersionWhenUnspecified = true;
    o.ApiVersionReader = ApiVersionReader.Combine(
        new QueryStringApiVersionReader("api-version"),
        new HeaderApiVersionReader("x-api-version"));
})
    .AddMvc()
    .AddApiExplorer(o => o.GroupNameFormat = "'v'VVV")
    .AddOpenApi(o => { /* document/operation transformers here, not a separate AddOpenApi() */ });
```

Register OpenAPI through the versioning builder only; a second `services.AddOpenApi()` (including
`Fusion.AspNetCore`'s `AddODataOpenApi()`) creates a conflicting document (Asp.Versioning analyzer AV0029).

## API models

- Response models `Api*`, input models `*Request`, built from handler read models (`Query*`) with a static
  `FromQueryModel(...)`; never return `Db*` entities.
- **One model per endpoint purpose.** Do not reuse a model across endpoints just because fields overlap today; list and
  detail responses, and create vs update requests, evolve separately. Shared nested types are fine.
- **Never use `[JsonIgnore]`** (including `WhenWritingNull`/`WhenWritingDefault`) or `NullValueHandling.Ignore`.
  Properties that appear and disappear make client schemas and generated types harder. Always emit the property
  (`null` or `[]`), or give the endpoint its own model without the field. For expandable children, emit `null` when
  not expanded and document it.
- `System.Text.Json` with camelCase (ASP.NET default) for new APIs.

## Lists

Never return a bare JSON array; wrap so paging and metadata can be added without a breaking change. Fusion services use
`value` (OData style) with `totalCount`:

```csharp
/// <summary>A page of items.</summary>
public sealed record ApiCollection<T>(IReadOnlyList<T> Value, int TotalCount);
```

`TotalCount` = matches before `$top`/`$skip`. Always serialize it (no `JsonIgnore`). Paging and filters: see
`using-odata.md`.

## PATCH

Use `Fusion.AspNetCore` `PatchRequest` + `PatchProperty<T>` so "not sent" and "set to null" differ:

```csharp
public class PatchItemRequest : PatchRequest
{
    public PatchProperty<string> Name { get; set; } = new();
    public PatchProperty<int?> Quantity { get; set; } = new();
}

if (request.Name.HasValue) entity.Name = request.Name.Value;
```

Validate with FluentValidation; `PatchPropertyValidator` helpers exist in `Fusion.AspNetCore`.

## Caching responses

For read-heavy lists consider caching in the handler (see `caching-and-multi-pod.md`); do not add HTTP response caching
for user-specific data.
