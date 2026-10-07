# Fusion NuGet packages for app teams

Feed: Fusion-Public (`https://pkgs.dev.azure.com/statoil-proview/5309109e-a734-4064-a84c-fbce45336913/_packaging/Fusion-Public/nuget/v3/index.json`),
add it next to nuget.org in `nuget.config`. Source: `equinor/fusion-integration-lib`, `equinor/fusion-libraries`.

## Primary

| Package | Use |
| --- | --- |
| `Fusion.Integration` | Entry point: service info, endpoint resolver, token provider, profile/context integration |
| `Fusion.Integration.Roles` | Roles V2 client, `RequireEnhancedAuthorizationAsync`, `HaveActiveAccessRole` |
| `Fusion.Integration.Profile` / `.Context` / `.Org` / `.LineOrg` | Resolve people, context, org data; built-in event handlers |
| `Fusion.Integration.Notification` / `.Mail` / `.Tasks` | Send notifications, mail, Fusion tasks |

## Recommended standalone libraries

| Package | Use |
| --- | --- |
| `Fusion.AspNetCore` | OData query params/attributes, `PatchRequest`/`PatchProperty<T>`, `FusionApiError` |
| `Fusion.AspNetCore.FluentAuthorization` | Fluent imperative authorization (transitive via Fusion.Integration.Roles) |
| `Fusion.Infrastructure.Database` | `AddSqlDbContext` with Entra token auth to Azure SQL |
| `Fusion.Testing`, `Fusion.Testing.Authentication` | Test fixture, test users with roles, in-process mocks of Org/People/LineOrg/Context/Service Bus/Storage |
| `Fusion.Infrastructure.MediatR` | `DistributedNotification`: run a MediatR notification on every pod via Service Bus |

## Problem-specific

| Package | Use |
| --- | --- |
| `Fusion.Infrastructure.Authentication.SasToken` | URL tokens for `<img src>`/downloads; needs shared Data Protection keys |
| `Fusion.Events.Client` | Event subscriptions not wrapped by Fusion.Integration |
| `Fusion.Infrastructure.Caching` | Redis `IDistributedCache` with memory fallback (connection string only; little adoption) |
| `Fusion.AspNetCore.Versioning` | Header/query versioning helpers (Asp.Versioning directly is equally fine) |

## Avoid

- `Fusion.Infrastructure.Internal.*`: internal to fusion-core-services.
- `Fusion.ApiClients.Org` / `.People`: superseded by Fusion.Integration.
- `Fusion.Hashing`: use `System.IO.Hashing`.
- `Fusion.Infrastructure.HttpClients` / `.ServiceDiscovery` when you already use Fusion.Integration (overlapping features).

Each package has a README in its source folder; the Fusion MCP `search_backend_code` tool finds usages.
