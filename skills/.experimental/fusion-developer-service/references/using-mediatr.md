# MediatR CQRS

## Contents

- Version and license
- Registration
- Request + handler in one file
- Behaviours
- FluentValidation

## Version and license

- Use **MediatR < 13** while it supports your target .NET version. 12.5.0 is the last Apache-2.0 release and is what the
  PSS apps use. MediatR 13+ needs a commercial license key.
- Equinor holds a MediatR license, but how teams obtain the key is not documented yet; ask the Fusion Core team before
  moving to 13+.

## Registration

```csharp
public static IServiceCollection AddAppApplication(this IServiceCollection services)
{
    services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceRegistrationExtensions).Assembly));
    services.AddValidatorsFromAssembly(typeof(ServiceRegistrationExtensions).Assembly);
    // Order matters: telemetry first so validation failures are traced spans.
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TelemetryBehaviour<,>));
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));
    return services;
}
```

## Request + handler in one file

```csharp
// Domain/Queries/GetItem.cs
public sealed record GetItem(Guid Id) : IRequest<QueryItem?>
{
    public sealed class Handler(AppDbContext db) : IRequestHandler<GetItem, QueryItem?>
    {
        public async Task<QueryItem?> Handle(GetItem request, CancellationToken cancellationToken) =>
            await db.Items.AsNoTracking()
                .Where(x => x.Id == request.Id)
                .Select(QueryItem.Projection)
                .SingleOrDefaultAsync(cancellationToken);
    }
}
```

- Commands in `Domain/Commands`, queries in `Domain/Queries`; handler nested (or directly beside) its request.
- Handlers return `Query*` read models (or result records), never `Db*` entities or `Api*` models.
- Queries use `AsNoTracking()` and projections.
- Throw domain exceptions from `Domain/Errors` for not-found/conflict/rule violations and map them centrally
  (`error-handling.md`), or return result records the controller maps; pick one per repo.
- Publish `INotification` after state changes when other parts react; use `DistributedNotification` when every pod must
  react (`caching-and-multi-pod.md`).

## Behaviours

```csharp
public sealed class TelemetryBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        using var activity = AppActivitySource.Instance.StartActivity(typeof(TRequest).Name, ActivityKind.Internal);
        activity?.SetTag("mediatr.request_type", typeof(TRequest).Name);
        try
        {
            var response = await next();
            activity?.SetStatus(ActivityStatusCode.Ok);
            return response;
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.AddException(ex);
            throw;
        }
    }
}
```

```csharp
public sealed class RequestValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);
        var failures = new List<ValidationFailure>();
        foreach (var validator in validators)
        {
            failures.AddRange((await validator.ValidateAsync(context, cancellationToken)).Errors);
        }

        if (failures.Count != 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
```

Map `ValidationException` to 400 `ValidationProblemDetails` in an `IExceptionHandler` (`error-handling.md`).

## FluentValidation

Recommended good practice, not mandatory. One `AbstractValidator<TCommand>` per command with input rules; keep rules
that need the database (uniqueness, existence) in the handler or a validator that takes the `DbContext`.
