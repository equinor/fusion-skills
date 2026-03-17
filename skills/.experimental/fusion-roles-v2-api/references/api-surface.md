# RolesV2 API Surface

## Service source
- `fusion-core-services/src/Fusion.Services.RolesV2`

## Endpoint groups (controller-level)
- `RolesController`
- `ClaimableRolesController`
- `AccessRolesController`
- `AccountsController`
- `SystemsController`
- `ScopeTypesController`
- `RoleBindingConfigurationController`
- `SubscriptionsController`

## Priority workflow coverage
- role CRUD and lookup via `RolesController`
- claimable role workflows via `ClaimableRolesController`
- access-role assignment and activation via `AccessRolesController`
- account/system/scope-type management via `AccountsController`, `SystemsController`, and `ScopeTypesController`
- binding configuration flows via `RoleBindingConfigurationController`

## Model clarity map
- Request models: `Controllers/RequestModels/*`
- Response models: `Controllers/ViewModels/*`
- Binder types for path identifiers: `Controllers/Binders/*`

## React/TypeScript defaults
- Preferred Fusion Framework stack:
	- `@equinor/fusion-framework-module-http`
	- `@equinor/fusion-framework-module-service-discovery`
- Prefer a configured framework client and keep role, claimable-role, and access-role operations in separate local modules.
- Suggested client file: `src/api/rolesV2Client.ts`
- Suggested hook file: `src/features/roles/useRoleAssignments.ts`
- Keep role, claimable role, and access-role DTOs distinct.
- Starter shape:

```ts
export interface RoleSummary {
	id: string;
	name: string;
}

export async function listRoles(baseUrl: string, init?: RequestInit) {
	const response = await fetch(`${baseUrl}/roles`, init);
	if (!response.ok) throw new Error(`RolesV2 API failed: ${response.status}`);
	return (await response.json()) as RoleSummary[];
}
```

## C# HttpClient defaults
- Preferred backend stack:
	- `AddFusionIntegrationCore(environment)`
	- `AddFusionIntegrationHttpClient(name, setup)` with a Roles endpoint key
	- typed wrapper over the named client similar to the `Fusion.Integration.Roles` package pattern
- Suggested client class: `RolesV2ApiClient`
- Suggested DTOs: `RoleSummary`, `AssignRoleRequestDto`, `AccessRoleSummary`
- Preserve separate DTOs for assignments, activations, and scope values.
- Starter shape:

```csharp
public sealed class RolesV2ApiClient(HttpClient httpClient)
{
		public async Task<IReadOnlyList<RoleSummary>?> GetRolesAsync(CancellationToken cancellationToken)
				=> await httpClient.GetFromJsonAsync<IReadOnlyList<RoleSummary>>("roles", cancellationToken);
}

public sealed record RoleSummary(string Id, string Name);

// Example registration aligned with fusion-integration-lib patterns
services.AddFusionIntegrationCore("FPRD");
services.AddFusionIntegrationHttpClient("roles-client", options =>
{
	options.WithFusionServiceEndpoint(FusionServiceEndpointKeys.Roles);
});
```

## Representative model snapshots
- `RoleSummary`: `id`, `name`
- `AssignRoleRequestDto`: account identifier, role identifier, reason, validity range
- `AccessRoleSummary`: access-role identifier and metadata
- `ClaimableRoleSummary`: claimable role plus scope/activation metadata

## Validation highlights
- `CreateAccessRoleRequest.Name` is required, max 200 chars, URL-safe, and must be a valid access-role identifier
- `AssignRoleRequest.AccountIdentifier` is required
- `AssignRoleRequest.Reason` is required and limited to 500 chars
- `AssignRoleRequest.ValidTo` must be after `ValidFrom`
- `CreateRoleRequest.AccessRoleMappings` must be non-empty and each mapping is validated

## Suggested local models
- `RoleSummary`
- `AssignRoleRequestDto`
- `AccessRoleSummary`
- `ClaimableRoleSummary`

## Versioning notes
- RolesV2 is the target role-management API surface; deprecated Roles v1 is out of scope.
