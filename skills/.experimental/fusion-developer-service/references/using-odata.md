# OData querying with Fusion.AspNetCore

Fusion APIs use a light OData flavour from `Fusion.AspNetCore` (namespace `Fusion.AspNetCore.OData`) for filtering,
paging, sorting, search, and expand. It parses query options into `ODataQueryParams`; you map public field names to
LINQ expressions, so no OData EDM model is needed.

## Controller

```csharp
[MapToApiVersion("1.0")]
[HttpGet]
[ProducesResponseType(typeof(ApiCollection<ApiItem>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
[ODataFilter("name", "location", "quantity")]   // documents allowed $filter fields in OpenAPI
[ODataOrderBy("name", "quantity")]
[ODataTop(200, 50)]                             // max 200, default 50 (documentation only)
[ODataSkip]
[ODataExpand("supplier")]
public async Task<ActionResult<ApiCollection<ApiItem>>> List([FromQuery] ODataQueryParams query, CancellationToken cancellationToken)
{
    // authorize first (using-fluent-authorization.md)
    QueryPage<QueryItem> page = await mediator.Send(new ListItems(query), cancellationToken);
    return Ok(new ApiCollection<ApiItem>(page.Items.Select(ApiItem.FromQueryModel).ToList(), page.TotalCount));
}
```

## Handler

```csharp
private const int DefaultPageSize = 50;
private const int MaxPageSize = 200;

IQueryable<DbItem> items = db.Items.AsNoTracking();
items = items.ApplyODataFilters(request.Query, m =>
{
    m.MapField("name", x => x.Name);
    m.MapField("location", x => x.Location);
    m.MapField("quantity", x => x.Quantity);
});

int totalCount = await items.CountAsync(cancellationToken);   // before paging

items = items.ApplyODataSorting(request.Query, m =>
{
    m.MapField("name", x => x.Name);
    m.MapField("quantity", x => x.Quantity);
}, defaultSort: q => q.OrderBy(x => x.Name));

int top = Math.Clamp(request.Query.Top.GetValueOrDefault(DefaultPageSize), 1, MaxPageSize);
List<QueryItem> page = await items
    .Skip(request.Query.Skip.GetValueOrDefault(0))
    .Take(top)
    .Select(QueryItem.Projection)
    .ToListAsync(cancellationToken);
```

`$expand`: check `request.Query.ShouldExpand("supplier")` and only `Include`/project the child when requested; emit the
child property as `null` when not expanded (no `JsonIgnore`).

## Rules and pitfalls

- Attributes only document the options in OpenAPI; **clamp `$top` and validate in the handler**.
- Unknown fields or bad syntax throw `ODataParserException` / `ODataBindingException` during binding → map to 400 in an
  `IExceptionHandler` (`error-handling.md`), otherwise callers get 500.
- Number/date parsing uses the current culture; pin `CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture`
  in `Program.cs` so `quantity ge 6.5` works on every host.
- Filter operators: `eq ne lt le gt ge in contains startswith`, combined with `and`/`or`.
- Add `[ODataSearch]` and read `request.Query.Search` when a free-text search is needed.
- With Asp.Versioning OpenAPI, register the OData OpenAPI transformers on the versioning builder
  (`options.Document.AddOperationTransformer<ODataFilterParamOpenApiTransformer>()`, `...OrderBy...`, `...Top...`,
  `...Skip...`, `...Search...`, `...Select...`, `...Expand...`, plus `ODataQueryParamOpenApiDocumentTransformer`), not
  `AddODataOpenApi()`, which calls its own `AddOpenApi()`.
- Count before paging; return `{ value, totalCount }` (`api-conventions.md`).

Learn more: `Fusion.AspNetCore` README in `equinor/fusion-libraries` (`src/Web/Fusion.AspNetCore`), or the Fusion MCP
`search_backend_code` tool with "ApplyODataFilters".
