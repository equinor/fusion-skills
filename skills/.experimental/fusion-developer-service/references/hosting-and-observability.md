# Hosting and observability

## OpenTelemetry → Azure Monitor

```csharp
public static class AppActivitySource
{
    public const string Name = "Pss.Inventory.Api";
    public static readonly ActivitySource Instance = new(Name);
}

public static IServiceCollection AddAppTelemetry(this IServiceCollection services, IConfiguration configuration)
{
    services.Configure<AspNetCoreTraceInstrumentationOptions>(o =>
        o.Filter = ctx => ctx.Request.Method != HttpMethods.Options
            && ctx.Request.Path != "/health" && ctx.Request.Path != "/health/live");

    // Radix sets APPLICATIONINSIGHTS_CONNECTION_STRING; skip locally.
    if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
    {
        return services;
    }

    services.AddOpenTelemetry()
        .UseAzureMonitor(o => o.Credential = CreateAzureCredential())   // App Insights with local auth disabled
        .WithTracing(t => t
            .AddSource(AppActivitySource.Name)
            .AddSource("Fusion.Integration"));                           // Fusion.Integration v10 emits its own spans
    return services;
}

private static TokenCredential CreateAzureCredential() =>
    File.Exists(Environment.GetEnvironmentVariable("AZURE_FEDERATED_TOKEN_FILE") ?? "")
        ? new WorkloadIdentityCredential()
        : new DefaultAzureCredential();
```

- Package: `Azure.Monitor.OpenTelemetry.AspNetCore` (+ `Azure.Identity`).
- MediatR `TelemetryBehaviour` creates a span per command/query (`using-mediatr.md`).
- Enrich request spans with the caller app id (`appid`/`azp` claim) and `Referer` when useful; redact credentials in
  query strings (e.g. `sastoken`).
- Structured logging with templates (`logger.LogInformation("Item {ItemId} created", id)`), no string interpolation.
- ProblemDetails `traceId` links an error response to the trace (`error-handling.md`).

## CORS

Fusion frontends call the API from the portal and local dev servers. Allow `*.equinor.com`, `*.fusion-dev.net`,
localhost, plus configured extra hosts:

```csharp
internal static partial class CorsExtensions
{
    [GeneratedRegex(@"^http[s]*:\/\/localhost(:\d{1,5})?($|\/.*$)")]
    private static partial Regex Localhost();

    [GeneratedRegex(@"^https:\/\/[a-zA-Z0-9\-\.]*\.(fusion-dev\.net|equinor\.com)($|\/.*$)")]
    private static partial Regex FusionHosts();

    public static IServiceCollection AddAppCors(this IServiceCollection services, IConfiguration configuration)
    {
        string[] extra = (configuration["FusionCors:AllowedHosts"] ?? "")
            .Split([',', ';'], StringSplitOptions.RemoveEmptyEntries);

        services.AddCors(o => o.AddDefaultPolicy(p => p
            .SetIsOriginAllowed(origin => extra.Contains(origin) || Localhost().IsMatch(origin) || FusionHosts().IsMatch(origin))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders(HeaderNames.Allow)
            .SetPreflightMaxAge(TimeSpan.FromMinutes(30))));
        return services;
    }
}
```

Pipeline order: `UseExceptionHandler` → `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.

## Health

- `/health` readiness: includes the database check, so a broken DB takes the pod out of rotation.
- `/health/live` liveness: no checks (`Predicate = _ => false`), so a slow DB never restarts a healthy pod.
- Both `.AllowAnonymous()`.

## Container and Radix

- Image `mcr.microsoft.com/dotnet/aspnet:<ver>-noble-chiseled-extra`, non-root (`runAsUser: 1654`), `readOnlyFileSystem: true`,
  port 8080.
- `ASPNETCORE_FORWARDEDHEADERS_ENABLED: 'true'` behind the Radix ingress.
- Workload identity per environment (`identity.azure.clientId` in radixconfig), secrets only for things that truly are
  secrets (`APPLICATIONINSIGHTS_CONNECTION_STRING` is set as a Radix secret by convention).
- Run at least 2 replicas; design for it (`caching-and-multi-pod.md`).
- More: `platform-and-deployment.md`.
