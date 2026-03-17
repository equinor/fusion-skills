# Portal Config API Surface

## Service source
- `fusion-core-services/src/Fusion.Services.PortalConfig`

## Endpoint groups (controller-level)
- `PortalController`
- `PortalConfigController`
- `PortalAppController`
- `CategoriesController`
- `TemplateController`
- `TemplateVersionsController`
- `TemplateBundlesController`
- `TemplateTagsController`
- `PortalTagsController`
- `SettingsController`

## Priority workflow coverage
- portal list/detail flows
- template and template-version flows
- category/tag management flows
- settings and bundle operations

## Model clarity map
- Request models: `Controllers/RequestModels/*`
- Response models: `Controllers/ViewModels/*`
- Identifier binders: `Controllers/Binders/*`

## React/TypeScript defaults
- Preferred Fusion Framework stack:
	- `@equinor/fusion-framework-module-http`
	- service-discovery-backed named clients configured in app startup
- Suggested client file: `src/api/portalConfigClient.ts`
- Suggested hook file: `src/features/portalConfig/usePortalConfig.ts`
- Keep portal, template, category, and settings DTOs separate.
- Starter shape:

```ts
export interface PortalSummary {
	id: string;
	title?: string;
}

export async function listPortals(baseUrl: string, init?: RequestInit) {
	const response = await fetch(`${baseUrl}/portals`, init);
	if (!response.ok) throw new Error(`Portal Config API failed: ${response.status}`);
	return (await response.json()) as PortalSummary[];
}
```

## C# HttpClient defaults
- Preferred backend stack:
	- `AddFusionIntegrationCore(environment)`
	- `AddFusionIntegrationHttpClient("portal-config-client", setup)`
	- `WithFusionServiceEndpoint(FusionServiceEndpointKeys.PortalConfig)`
	- version-aware DTO separation for template/version endpoints
- Suggested client class: `PortalConfigApiClient`
- Suggested DTOs: `PortalSummary`, `TemplateSummary`, `PortalSettingsDto`
- Version template DTOs separately when working with `TemplateVersionsController`.
- Starter shape:

```csharp
public sealed class PortalConfigApiClient(HttpClient httpClient)
{
		public async Task<IReadOnlyList<PortalSummary>?> GetPortalsAsync(CancellationToken cancellationToken)
				=> await httpClient.GetFromJsonAsync<IReadOnlyList<PortalSummary>>("portals", cancellationToken);
}

public sealed record PortalSummary(string Id, string? Title);
```

## Suggested local models
- `PortalSummary`
- `TemplateSummary`
- `PortalTagDto`
- `PortalSettingsDto`

## Representative model snapshots
- `PortalSummary`: portal id and title/display metadata
- `TemplateSummary`: template id/name plus version/tag metadata
- `CreatePortalRequestDto`: name, displayName, template, admins
- `PortalSettingsDto`: global portal-config settings shape

## Validation highlights
- `CreatePortalRequest.Name` is required, min 3, max 50, and URL-safe
- `CreatePortalRequest.DisplayName` is required
- `CreatePortalRequest.Template` is required
- `CreatePortalRequest.Admins` must contain at least one valid account

## Versioning notes
- Template and version endpoints have additional identifier and schema constraints; preserve them in client implementations.
