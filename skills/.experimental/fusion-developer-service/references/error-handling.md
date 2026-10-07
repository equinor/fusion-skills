# Error handling with ProblemDetails

Every error response is RFC 7807 ProblemDetails with a `traceId` so support can find the trace in Application Insights.

## Registration

```csharp
services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
        context.ProblemDetails.Extensions["traceId"] = Activity.Current?.Id ?? context.HttpContext.TraceIdentifier;
});
services.AddExceptionHandler<ValidationExceptionHandler>();
services.AddExceptionHandler<DomainExceptionHandler>();
services.AddExceptionHandler<ODataQueryExceptionHandler>();
```

```csharp
app.UseExceptionHandler();   // first in the pipeline
```

`[ApiController]` already turns model-binding errors into `ValidationProblemDetails`; `AddProblemDetails` makes
`NotFound()`, `Conflict()`, unhandled exceptions (500), and status-code results use the same shape and get `traceId`.

## Central mapping

```csharp
internal sealed class DomainExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        (int status, string title)? mapped = exception switch
        {
            NotFoundError => (StatusCodes.Status404NotFound, "Resource not found"),
            ConflictError => (StatusCodes.Status409Conflict, "Conflict"),
            _ => null
        };
        if (mapped is null)
        {
            return false;
        }

        httpContext.Response.StatusCode = mapped.Value.status;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails { Status = mapped.Value.status, Title = mapped.Value.title, Detail = exception.Message }
        });
    }
}
```

`ValidationExceptionHandler`: map FluentValidation `ValidationException` to 400 with `errors` grouped by property
(`ValidationProblemDetails`). `ODataQueryExceptionHandler`: map `ODataParserException`/`ODataBindingException`
(`Fusion.AspNetCore.OData`) to 400; they happen during model binding, so controllers cannot catch them.

## Rules

- Do not catch domain exceptions in every controller; one handler per exception family keeps responses consistent.
- `Detail` must not leak internals (SQL, stack traces, secrets). Unhandled exceptions return a generic 500.
- 403 comes from FluentAuthorization (`CreateForbiddenResponseAsync`), which already explains the missing role
  (`using-fluent-authorization.md`).
- Declare the error types in `[ProducesResponseType]` (`api-conventions.md`).
- `Fusion.AspNetCore` also offers `FusionApiError.NotFound(...)`, `.ResourceExists(...)`, `.Forbidden(...)` factories for
  repos that prefer returning errors over throwing.
