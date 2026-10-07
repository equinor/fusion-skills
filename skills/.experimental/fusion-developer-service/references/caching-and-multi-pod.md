# Caching and multiple pods

Fusion APIs run at least 2 replicas on Radix. Anything kept in process memory exists once per pod.

## Choose the cache

| Scenario | Use |
| --- | --- |
| Reference data, rarely changes, staleness up to TTL is fine | `IMemoryCache` or `HybridCache` (L1 only) with TTL, per pod |
| Data your API writes; every pod must see changes right away | Per-pod cache + invalidate on all pods with `DistributedNotification` |
| Data owned by Fusion core (profiles, roles, context) | Fusion.Integration caches + transient event handlers (`using-fusion-events.md`) |
| Expensive values to share across pods (tokens, computed blobs) | `HybridCache` + Redis `IDistributedCache`, only where Redis exists (Fusion k8s); otherwise accept per-pod L1 |

Radix has no managed Redis; provisioning one is a platform decision, not a default. `Fusion.Infrastructure.Caching`
(Redis + memory fallback) exists but has no known app consumers and only supports connection-string auth.

## Invalidate on every pod: DistributedNotification

`Fusion.Infrastructure.MediatR` publishes a MediatR notification through Azure Service Bus; each instance gets its own
subscription and runs the normal local handler. Used by Fusion core services (Apps, Context, PortalConfig, RolesV2, ...)
and app repos (resource allocation, app-resources, discovery).

```csharp
services.AddMediatRDistributedNotification(o =>
{
    o.ConnectionString = configuration.GetConnectionString("ServiceBus");
    o.TopicPath = "notifications";
    o.SourceName = "pss-inventory";
});

public sealed class CategoriesChanged : DistributedNotification
{
    public sealed class Handler(IMemoryCache cache) : INotificationHandler<CategoriesChanged>
    {
        public Task Handle(CategoriesChanged notification, CancellationToken cancellationToken)
        {
            cache.Remove(CategoryCacheKeys.All);
            return Task.CompletedTask;
        }
    }
}

// in the command handler, after SaveChangesAsync
await mediator.Publish(new CategoriesChanged(), cancellationToken);
```

Requires an Azure Service Bus namespace/topic for the app (Bicep) and its connection configured as a secret or via
identity per your platform setup. Without a Service Bus, use a short TTL and state the staleness window explicitly.

## Data Protection with several pods

Anything protected with ASP.NET Data Protection (SAS tokens, cookies, antiforgery) must use one shared key ring and the
same application name on every pod, or tokens issued by one pod fail on another:

```csharp
services.AddDataProtection()
    .SetApplicationName("pss-inventory")
    .PersistKeysToAzureBlobStorage(new BlobClient(new Uri(configuration["DataProtection:KeyRingBlobUri"]!), credential))
    .ProtectKeysWithAzureKeyVault(new Uri(configuration["DataProtection:KeyVaultKeyUri"]!), credential);
```

## SAS tokens for browser-loaded resources

A browser cannot attach a bearer token to `<img src>`. Use `Fusion.Infrastructure.Authentication.SasToken`:

```csharp
services.AddAuthentication()                        // keep JWT bearer as default scheme
    .AddSasToken(configureService: o => o.Purpose = "Pss.Inventory.SasToken");
services.AddAuthorization(o => o.AddPolicy("ImageDelivery", p => p.RequireSasTokenResource("inventory/images")));
services.AddSasTokenProvider(o => { o.Validity = TimeSpan.FromDays(7); o.CacheDuration = TimeSpan.FromDays(5); });
```

Issue with `ISasTokenProvider.GetTokenAsync(resource, userObjectId, ct)`, protect the endpoint with
`[Authorize(Policy = "ImageDelivery")]`, and redact `sastoken` from telemetry (`SasTokenRedaction`). Tokens cannot be
revoked; keep SAS endpoints read-only and low-risk. Needs the shared Data Protection key ring above.

## Other multi-pod rules

- No in-memory queues, locks, or counters that must be global; use the database (unique constraints, `rowversion`).
- Background jobs run on every pod unless coordinated; use a persistent event subscription or a DB lease.
- Startup work (seeding) must be idempotent and safe to run concurrently.
