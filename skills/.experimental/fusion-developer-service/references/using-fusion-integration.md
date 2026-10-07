# Fusion.Integration

Primary library for app teams talking to Fusion: Roles V2, profiles, context, service discovery, and authenticated
HTTP clients to Fusion and other Entra-protected APIs. Package family `Fusion.Integration.*` (Fusion-Public feed).

## Setup

```csharp
services.AddFusionIntegration(o =>
{
    o.UseServiceInformation("pss-inventory", configuration["Fusion:Environment"] ?? "ci");   // app key + environment
    o.UseDefaultEndpointResolver(configuration["Fusion:Environment"] ?? "ci");              // Fusion service discovery
    o.UseMsalTokenProvider();   // tokens via Microsoft.Identity.Web (workload identity on Radix)
    // o.AddProfileSync<ProfileSyncHandler>();   // see using-fusion-events.md
});
services.AddFusionRolesV2(filter => filter.SystemName = "pss-inventory");
```

Requires `Microsoft.Identity.Web` with `EnableTokenAcquisitionToCallDownstreamApi` (`using-fluent-authorization.md`).
Never configure a client secret; workload identity supplies the credential.

## Calling another API

```csharp
services.AddFusionIntegrationHttpClient("subsea-catalog", client =>
{
    client.Uri = new Uri(configuration["Catalog:BaseUrl"]!);
    client.Scope = configuration["Catalog:Scope"]!;            // api://<app-id>/.default
    client.IndividualTimeout = TimeSpan.FromSeconds(10);
    client.OverallTimeout = TimeSpan.FromSeconds(30);
});

public sealed class CatalogClient(IHttpClientFactory factory)
{
    public async Task<ApiComponent?> GetAsync(Guid id, CancellationToken ct)
    {
        HttpClient http = factory.CreateClient("subsea-catalog");
        using HttpResponseMessage response = await http.GetAsync($"components/{id}", ct);
        if (response.StatusCode == HttpStatusCode.NotFound) return null;
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ApiComponent>(ct);
    }
}
```

The client attaches an app token for `Scope` and applies retries/timeouts. Wrap each downstream API in an interface so
tests can replace it; map downstream outages to 503 ProblemDetails.

## Common services

| Need | Use |
| --- | --- |
| Current user's access roles | FluentAuthorization `HaveActiveAccessRole` (`using-fluent-authorization.md`) |
| Query/assign Roles V2 | `IFusionRolesV2Client` |
| Resolve people by id/mail | `IFusionProfileResolver` (Fusion.Integration.Profile) |
| Fusion context (project, facility...) | `IFusionContextResolver` (Fusion.Integration.Context) |
| Org / line org data | Fusion.Integration.Org / .LineOrg |
| Notifications, mail, tasks | Fusion.Integration.Notification / .Mail / .Tasks |
| React to changes | Event handlers (`using-fusion-events.md`) |

Fusion.Integration v10 emits spans from an `ActivitySource` named `Fusion.Integration`; add it to tracing.

Prefer these over hand-written HTTP calls to Fusion core services. For endpoint details of a core service use
`fusion-core-services` or Fusion MCP.
