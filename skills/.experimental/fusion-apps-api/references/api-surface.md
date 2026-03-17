# Apps Service API Surface

## Service source
- `fusion-core-services/src/Fusion.Services.Apps`

## Endpoint groups (source-grounded)
- Controllers are not currently exposed as a standard `Controllers/*` surface in this snapshot.
- Treat this service as requiring source validation of exposed routes before implementation.

## Priority workflow coverage
- app metadata retrieval
- application synchronization and registry-adjacent flows
- startup/configuration-driven service interaction patterns

## Model clarity map
- Service configuration and context: `Configuration/*`, `Database/*`, and startup wiring in `Program.cs`/`Startup.cs`.

## React/TypeScript defaults
- Preferred Fusion Framework stack:
	- `@equinor/fusion-framework-module-http`
	- `@equinor/fusion-framework-module-service-discovery`
- Suggested client file: `src/api/appsClient.ts`
- Suggested hook file: `src/features/apps/useApps.ts`
- Because endpoint details are sparse in this snapshot, keep DTOs narrow and confirm route contracts before shipping.
- Starter shape:

```ts
export interface AppSummary {
	key: string;
	title?: string;
}

export async function getApps(baseUrl: string, init?: RequestInit) {
	const response = await fetch(`${baseUrl}/apps`, init);
	if (!response.ok) throw new Error(`Apps API failed: ${response.status}`);
	return (await response.json()) as AppSummary[];
}
```

## C# HttpClient defaults
- Preferred backend stack:
	- `AddFusionIntegrationCore(environment)`
	- `AddFusionIntegrationHttpClient("apps-client", setup)` when service endpoint details are available
	- otherwise a named client using explicit URI until a stable endpoint key is confirmed
- Suggested client class: `AppsApiClient`
- Suggested DTOs: `AppSummary`, `AppSyncStatusDto`
- Treat route and payload names as provisional until confirmed from concrete controller source.
- Starter shape:

```csharp
public sealed class AppsApiClient(HttpClient httpClient)
{
		public async Task<IReadOnlyList<AppSummary>?> GetAppsAsync(CancellationToken cancellationToken)
				=> await httpClient.GetFromJsonAsync<IReadOnlyList<AppSummary>>("apps", cancellationToken);
}

public sealed record AppSummary(string Key, string? Title);
```

## Suggested local models
- `AppSummary`
- `AppDetailsDto`
- `AppSyncStatusDto`

## Representative model snapshots
- `AppSummary`: key and display/title metadata
- `AppDetailsDto`: application metadata, owners/admins, tags, classification
- `CreateAppRequestDto`: app name, type, admins, and ownership fields

## Validation highlights
- validation in this service varies by controller surface
- representative create-widget/create-app style flows typically require a `Name` with minimum/maximum length constraints
- admin/account collections are validated and usually require at least one valid account
- treat route-specific validation as required to confirm before shipping because controller coverage is broader than the currently bundled asset

## Versioning notes
- Route and model contracts should be confirmed directly from current source before generating client code.
