# Authorization with Roles V2 and FluentAuthorization

## Contents

- Model
- Registration
- Checking access in actions (imperative)
- OPTIONS endpoints: tell the frontend what the user can do
- Tests

## Model

- **Access role** (`PssInventory.Read`): what the API checks. Defined in the app's Roles V2 system config
  (`infra/roles/roles.<env>.json`, deployed with `froles`, see `fusion-roles-cli`).
- **Role / claimable role / binding / assignment**: how people get access roles (Entra groups, time-boxed claims).
  The API never checks these directly.
- Keep access-role names in one constants class mirrored from the roles config:

```csharp
/// <summary>Access roles, matching infra/roles/roles.{env}.json. Never inline these strings.</summary>
public static class AppAccessRoles
{
    public const string Read = "PssInventory.Read";
    public const string Write = "PssInventory.Write";
}
```

## Registration

```csharp
// Authentication: Entra ID JWT for this API's app registration; outbound tokens via workload identity.
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(
        jwt => configuration.Bind("AzureAd", jwt),
        identity =>
        {
            configuration.Bind("AzureAd", identity);
            if (HasWorkloadIdentityFederatedToken())   // AZURE_FEDERATED_TOKEN_FILE exists (Radix/AKS)
            {
                identity.ClientCredentials = [new CredentialDescription { SourceType = CredentialSource.SignedAssertionFilePath }];
            }
        })
    .EnableTokenAcquisitionToCallDownstreamApi(o => configuration.Bind("AzureAd", o))
    .AddInMemoryTokenCaches();
services.AddAuthorization(o => o.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

// Roles V2
services.AddFusionIntegration(o =>
{
    o.UseServiceInformation("pss-inventory", configuration["Fusion:Environment"] ?? "ci");
    o.UseDefaultEndpointResolver(configuration["Fusion:Environment"] ?? "ci");
    o.UseMsalTokenProvider();
});
services.AddFusionRolesV2(filter => filter.SystemName = "pss-inventory");
```

Packages: `Microsoft.Identity.Web`, `Fusion.Integration`, `Fusion.Integration.Roles` (brings
`Fusion.AspNetCore.FluentAuthorization`). Health and OpenAPI endpoints opt out with `.AllowAnonymous()`.

## Checking access in actions (imperative)

```csharp
using Fusion.AspNetCore.FluentAuthorization;
using Fusion.Authorization;
using Fusion.Integration.Roles.Extensions;

var auth = await Request.RequireEnhancedAuthorizationAsync(r => r.Must(m => m.HaveActiveAccessRole(AppAccessRoles.Write)));
if (auth.Unauthorized)
{
    return await auth.CreateForbiddenResponseAsync();
}
```

- `RequireEnhancedAuthorizationAsync` (Fusion.Integration.Roles) returns a 403 ProblemDetails that names the failed
  requirement and the claimable roles the caller could activate, so users and frontends can see exactly what is missing.
- Combine rules: `r.Must(m => ...)` (all must pass), `r.AnyOf(a => a.HaveActiveAccessRole(AppAccessRoles.Admin).HaveActiveAccessRole(AppAccessRoles.Write))`
  (one must pass), `r.AlwaysAccessWhen(...)` (override), `r.LimitedAccessWhen(...)` (check `auth.LimitedAuth` and filter results).
- Scoped access roles: `HaveScopedActiveAccessRole(role, scopeType, scopeValue)`,
  `HaveActiveAccessRoleForScopeTypeWithAnyScopeValue(role, scopeType)`. Scoped and global access roles must sit in
  separate roles in the roles config.
- Authorize in the controller before dispatching; handlers can assume an authorized caller.

## OPTIONS endpoints: tell the frontend what the user can do

Frontends call `OPTIONS` on a collection or item and enable buttons from the `Allow` header. Advisory only: the real
verbs still authorize. Role-based; do not leak whether an item exists.

```csharp
/// <summary>Reports which methods the caller may use on the item collection.</summary>
[MapToApiVersion("1.0")]
[HttpOptions]
[ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
[ProducesResponseType(typeof(void), StatusCodes.Status401Unauthorized)]
public async Task<ActionResult> CollectionOptions()
{
    Response.Headers[HeaderNames.Allow] = string.Join(',', await AllowedMethodsAsync(
        (HttpMethods.Get, AppAccessRoles.Read),
        (HttpMethods.Post, AppAccessRoles.Write)));
    return NoContent();
}

[HttpOptions("{id:guid}")]   // same pattern: GET → Read; PATCH/PUT/DELETE → Write

private async Task<List<string>> AllowedMethodsAsync(params (string Method, string Role)[] checks)
{
    var allowed = new List<string> { HttpMethods.Options };
    foreach (var (method, role) in checks)
    {
        var auth = await Request.RequireEnhancedAuthorizationAsync(r => r.Must(m => m.HaveActiveAccessRole(role)));
        if (!auth.Unauthorized)
        {
            allowed.Add(method);
        }
    }

    return allowed;
}
```

CORS must allow the `OPTIONS` method and expose `Allow` if the frontend reads it cross-origin
(`hosting-and-observability.md`). Exclude OPTIONS from request telemetry to avoid preflight noise.

## Tests

Mock `IFusionRolesV2Client` and create users with global roles through `Fusion.Testing` (`testing.md`).

Learn more: fusion-docs "Authorization Strategies" and "Roles Quick Start" under
`https://docs.fusion.equinor.com/docs/developer/core-services/role-service/`; role config → `fusion-roles-cli`.
