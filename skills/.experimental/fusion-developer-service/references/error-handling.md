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

## Domain exceptions

One base class carries the HTTP status, like `HttpRequestException.StatusCode` or Azure.Core's
`RequestFailedException.Status`, so the handler and telemetry never need a type switch:

```csharp
// Domain/Errors/DomainException.cs
public abstract class DomainException(string message, Exception? inner = null) : Exception(message, inner)
{
    public abstract int StatusCode { get; }

    /// <summary>Stable machine-readable code for clients, e.g. "WorkOrderNotFound".</summary>
    public virtual string? ErrorCode => null;

    /// <summary>Expected outcomes (4xx) are not telemetry failures unless set; 5xx always are.</summary>
    public bool TrackAsFailure { get; init; }
}

public sealed class NotFoundError(string message) : DomainException(message)
{
    public override int StatusCode => StatusCodes.Status404NotFound;
}

public sealed class ConflictError(string message) : DomainException(message)
{
    public override int StatusCode => StatusCodes.Status409Conflict;
}
```

Throw `new NotFoundError(...) { TrackAsFailure = true }` when a missing resource signals a real problem (for example a
row that a previous step just created). Keep the classes in the app; Fusion libraries do not ship this base type yet
(`Fusion.Infrastructure.Core` has `NotFoundError`/`ResourceExistsError` without a status code).

## Central mapping

```csharp
internal sealed class DomainExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not DomainException domain)
        {
            return false;
        }

        httpContext.Response.StatusCode = domain.StatusCode;
        ProblemDetails problem = new() { Status = domain.StatusCode, Title = ReasonPhrases.GetReasonPhrase(domain.StatusCode), Detail = domain.Message };
        if (domain.ErrorCode is not null)
        {
            problem.Extensions["errorCode"] = domain.ErrorCode;
        }

        return await problemDetails.TryWriteAsync(new ProblemDetailsContext { HttpContext = httpContext, Exception = exception, ProblemDetails = problem });
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
