# Hosting and observability

## Contents

- OpenTelemetry → Azure Monitor
- Cloud role name and instance
- Sampling, noise, and cost
- CORS
- Health
- Container and Radix

## OpenTelemetry → Azure Monitor

```csharp
public static class AppActivitySource
{
    public const string Name = "Pss.Inventory.Api";
    public static readonly ActivitySource Instance = new(Name);
}

public static IServiceCollection AddAppTelemetry(this IServiceCollection services, IConfiguration configuration)
{
    // Health probes and CORS preflights are high-volume and carry no diagnostic value.
    services.Configure<AspNetCoreTraceInstrumentationOptions>(o =>
        o.Filter = ctx => ctx.Request.Method != HttpMethods.Options
            && ctx.Request.Path != "/health" && ctx.Request.Path != "/health/live");

    // Radix sets APPLICATIONINSIGHTS_CONNECTION_STRING; skip locally.
    if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
    {
        return services;
    }

    services.AddOpenTelemetry()
        .UseAzureMonitor(o =>
        {
            o.Credential = CreateAzureCredential();   // App Insights with local auth disabled
            o.EnableTraceBasedLogsSampler = true;     // drop logs of unsampled traces
        })
        // After UseAzureMonitor so it overrides the distro's detected defaults.
        .ConfigureResource(r => r
            .AddService(serviceName: "pss-inventory-api", serviceInstanceId: Environment.MachineName)
            .AddAttributes(new Dictionary<string, object>
            {
                ["deployment.environment.name"] = configuration["Fusion:Environment"] ?? "unknown"
            }))
        .WithTracing(t => t
            .AddSource(AppActivitySource.Name)
            .AddSource("Fusion.Integration"))                           // Fusion.Integration v10 emits its own spans
        .WithMetrics(m => m
            // Metrics are never sampled; drop high-volume, low-value HTTP gauges (Fusion standalone services do the same).
            .AddView("http.client.active_requests", MetricStreamConfiguration.Drop)
            .AddView("http.client.connection.duration", MetricStreamConfiguration.Drop)
            .AddView("http.client.request.time_in_queue", MetricStreamConfiguration.Drop)
            .AddView("http.server.active_requests", MetricStreamConfiguration.Drop)
            .AddView("http.client.open_connections", new MetricStreamConfiguration { TagKeys = ["server.address", "http.connection.state"] }));
    return services;
}

private static TokenCredential CreateAzureCredential() =>
    File.Exists(Environment.GetEnvironmentVariable("AZURE_FEDERATED_TOKEN_FILE") ?? "")
        ? new WorkloadIdentityCredential()
        : new DefaultAzureCredential();
```

- Package: `Azure.Monitor.OpenTelemetry.AspNetCore` (+ `Azure.Identity`). It already includes ASP.NET Core and
  HttpClient instrumentation and live metrics.
- MediatR `TelemetryBehaviour` creates a span per command/query (`using-mediatr.md`).
- Enrich request spans with the caller app id (`appid`/`azp` claim) and `Referer` when useful.
- Structured logging with templates (`logger.LogInformation("Item {ItemId} created", id)`), no string interpolation.
- ProblemDetails `traceId` links an error response to the trace (`error-handling.md`).

## Cloud role name and instance

Application Map, failures, and cross-app queries group telemetry by **cloud role name**. Without it the distro guesses,
and several components or environments sharing a workspace become hard to tell apart.

- Cloud role name = `service.namespace` + `.` + `service.name`, or just `service.name` when no namespace is set.
  Use a stable, unique name per deployable component, e.g. the app key plus component (`pss-inventory-api`).
- Cloud role instance = `service.instance.id`; use `Environment.MachineName` (the pod name on Radix).
- Set them with `ConfigureResource(...AddService(...))` **after** `UseAzureMonitor()`, or with environment variables
  in radixconfig: `OTEL_SERVICE_NAME=pss-inventory-api` and
  `OTEL_RESOURCE_ATTRIBUTES=service.namespace=pss,deployment.environment.name=ci` (env vars win over code for
  `service.name`).
- A custom `cloud.role` resource attribute is **not** what Azure Monitor reads; set `service.name`.
- Keep the environment as an attribute (`deployment.environment.name`), not in the role name, unless environments share
  one Application Insights resource and you need them split on the map.

## Sampling, noise, and cost

- Traces: the distro samples with its default sampler unless configured. Choose explicitly per environment:
  `o.SamplingRatio = 0.5F` (fixed share, used by Fusion standalone services) or `o.TracesPerSecond = 5` (rate-limited,
  predictable cost). Environment variables override code, so prefer setting them per environment in radixconfig:
  `OTEL_TRACES_SAMPLER=microsoft.rate_limited`, `OTEL_TRACES_SAMPLER_ARG=5` (or `microsoft.fixed_percentage` with `0.0–1.0`).
- Keep 100 % in ci only if volume is low; production APIs with steady traffic should sample.
- Logs follow trace sampling when `EnableTraceBasedLogsSampler` is on; logs without a trace (startup) are always kept.
- Metrics are never sampled; use `AddView(..., MetricStreamConfiguration.Drop)` or reduce tag keys for noisy instruments.
- Filter health, liveness, and OPTIONS requests (above). Add other high-volume, low-value paths (e.g. SAS-token image
  delivery) to the filter or sample them down.
- The distro does **not** redact URL query strings by default. If query strings can carry credentials (`sastoken`),
  set `OTEL_DOTNET_EXPERIMENTAL_ASPNETCORE_DISABLE_URL_QUERY_REDACTION=false` (and the `HTTPCLIENT` variant) or redact
  in an enrich callback.
- Alert on metrics (unaffected by sampling), not on sampled request counts.

Learn more: Microsoft Learn "Configuring OpenTelemetry in Application Insights" (cloud role name, sampling),
fusion-docs `developer/api/deployment/observability`.

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
