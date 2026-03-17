# Service Messages API Surface

## Service source
- `fusion-core-services/src/Fusion.Services.ServiceMessages`

## Endpoint groups (controller-level)
- `ServiceMessagesController`
- `AppsController`
- `AdminController`

## Priority workflow coverage
- message list/detail flows
- app-scoped message create/update flows
- admin create/update flows
- visibility update flows

## Model clarity map
- Request models: `Controllers/RequestModels/*`
- Response models: `Controllers/ViewModels/*`
- Validation helpers: `Controllers/Validation/*`

## React/TypeScript defaults
- Preferred Fusion Framework stack:
	- `@equinor/fusion-framework-module-http`
	- `useHttpClient(name)` for application-integrated message clients
- Suggested client file: `src/api/serviceMessagesClient.ts`
- Suggested hook file: `src/features/serviceMessages/useServiceMessages.ts`
- Keep admin message DTOs distinct from app-scoped visibility DTOs.
- Starter shape:

```ts
export interface ServiceMessageItem {
	id: string;
	title?: string;
	isActive?: boolean;
}

export async function listServiceMessages(baseUrl: string, init?: RequestInit) {
	const response = await fetch(`${baseUrl}/service-messages`, init);
	if (!response.ok) throw new Error(`Service Messages API failed: ${response.status}`);
	return (await response.json()) as ServiceMessageItem[];
}
```

## C# HttpClient defaults
- Preferred backend stack:
	- `AddFusionIntegrationCore(environment)`
	- `AddFusionIntegrationHttpClient("service-messages-client", setup)`
	- `WithFusionServiceEndpoint(FusionServiceEndpointKeys.ServiceMessages)`
	- typed request models for admin vs app-scoped writes
- Suggested client class: `ServiceMessagesApiClient`
- Suggested DTOs: `ServiceMessageItem`, `CreateServiceMessageRequestDto`, `UpdateVisibilityRequestDto`
- Preserve admin/app request DTO differences in client code.
- Starter shape:

```csharp
public sealed class ServiceMessagesApiClient(HttpClient httpClient)
{
		public async Task<IReadOnlyList<ServiceMessageItem>?> GetMessagesAsync(CancellationToken cancellationToken)
				=> await httpClient.GetFromJsonAsync<IReadOnlyList<ServiceMessageItem>>("service-messages", cancellationToken);
}

public sealed record ServiceMessageItem(string Id, string? Title, bool? IsActive);
```

## Suggested local models
- `ServiceMessageItem`
- `CreateServiceMessageRequestDto`
- `CreateServiceMessageForAppRequestDto`
- `UpdateVisibilityRequestDto`

## Representative model snapshots
- `ServiceMessageItem`: id, title, content, active/visibility metadata
- `CreateServiceMessageRequestDto`: title, content, type, scope, relevant apps/portals
- `UpdateVisibilityRequestDto`: applies-from/to and visibility targeting details

## Validation highlights
- `CreateServiceMessageRequest.Title` is required and limited to 200 chars
- `CreateServiceMessageRequest.Content` is required and limited to 2000 chars
- `CreateServiceMessageRequest.Type` must be a valid enum value
- `CreateServiceMessageRequest.Scope` must be a valid enum value
- when `Scope == App`, `RelevantApps` is required

## Versioning notes
- App-scoped and admin-scoped request models differ; map them explicitly in integration code.
