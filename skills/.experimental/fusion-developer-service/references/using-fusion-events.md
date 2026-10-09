# Fusion events

Fusion core services (People, Context, Org, Roles, Tasks, ...) publish change events. An API subscribes through the
service's `/subscriptions/...` endpoint and receives messages from an Azure Service Bus subscription created for it.

## Transient vs persistent

| | Transient | Persistent |
| --- | --- | --- |
| Use for | Clearing per-pod caches, instance notifications | Keeping a local copy (DB) in sync |
| Subscription | One per pod (random id) → **every pod gets every event** | One per app (keyed on app client id) → **pods compete, each event handled once** |
| Survives | Deleted after 60 min idle; events while all pods are down > 60 min are lost | Kept 14 days idle; messages expire after 3 days |
| Wrong choice | For DB sync: N duplicate writes, lost events on downtime | For cache clear: only one pod clears its cache |

Common to both: no ordering guarantee, at-least-once delivery (max 30 attempts, then dead-letter). Handlers must be
idempotent (upsert, compare timestamps/versions). For heavy work, read the event, store/queue it, and process
afterwards so failures do not dead-letter messages.

## Built-in handlers (Fusion.Integration) — use first

```csharp
// Keep local person data in sync (persistent, shared by all replicas)
services.AddFusionIntegration(o =>
{
    // ...UseServiceInformation / UseDefaultEndpointResolver / UseMsalTokenProvider
    o.AddProfileSync<ProfileSyncHandler>();
});

public sealed class ProfileSyncHandler(AppDbContext db) : IProfileSyncHandler
{
    public async Task ProcessProfileAsync(IProfileSyncHandler.ProfileUpdatedEventContext context)
    {
        FusionPersonProfile? profile = await context.ResolveProfileAsync();   // null when removed
        // upsert or mark removed by context.Person.AzureUniqueId; must be idempotent
    }
}
```

Fusion.Integration also registers transient handlers internally to clear its own profile/context/roles caches; you do
not need to do that yourself.

Context events: `services.AddFusionEventHandler(s => s.AddPersistentContextHandler<THandler>())` or
`AddTransientContextHandler<THandler>()` (Fusion.Integration.Context).

## Other event sources (Fusion.Events.Client)

```csharp
services.AddFusionEventHandler(s => s.AddPersistentHandler<OrgChangedHandler>(
    "<fusion integration http client name for the service>", "/subscriptions/org-projects",
    e => e.OnlyTriggerOn(/* FusionEventType values from Fusion.Events.Services */)));
```

Use `AddTransientHandler<T>` for per-pod reactions. Do not hand-roll Service Bus processors or subscription requests.

Examples: `fusion-resource-allocation-services` (`IEventHandler<>` handlers), `fusion-core-services` RolesV2/FusionTasks
(`AddProfileSync`), `fusion-services-meetings`.

Learn more: `Fusion.Events` README in `equinor/fusion-libraries` (`src/Events`), fusion-docs "Subscribing to events"
(role service), or Fusion MCP.
