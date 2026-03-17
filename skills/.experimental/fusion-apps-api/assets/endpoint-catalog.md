# Apps API Endpoint Catalog

This catalog covers the verified public application surface in Fusion Apps. It includes application, build, tag, category, governance, and person-scoped routes. Internal support routes and widget-specific routes are still excluded here.

## Application endpoints
- `GET /apps` → `ApiPagedCollection<ApiAppListItem>`
	OData: `Expand(category, admins, owners, keywords, build, classification)`, `Filter(type, appKey, displayName)`, `Search`, `Top`, `Skip`
- `GET /apps/{appIdentifier}` → `ApiApp`
- `GET /apps/{appIdentifier}@{versionIdentifier}` → `ApiApp`
- `HEAD /apps/{appIdentifier}` → existence probe only
- `POST /apps` → `CreateAppRequest` → `ApiApp`
- `PATCH /apps/{appIdentifier}` → `PatchAppRequest` → `ApiApp`
- `DELETE /apps/{appIdentifier}` → `204 NoContent`
- `GET /apps/{appIdentifier}/tagged-persons` → `ApiPagedCollection<ApiTaggedPerson>`
- `GET /apps/{appIdentifier}/changelog` → `ApiPagedCollection<ApiChangelog>`
	OData: `Filter(activityId, actorUpn, actorAzureUniqueId, commandName)`, `Top`, `Skip`
- `POST /apps/{appIdentifier}/restore` → `ApiApp`

## Build and config endpoints
- `GET /apps/{appIdentifier}/builds` → `ApiPagedCollection<ApiAppVersion>`
- `GET /apps/{appIdentifier}/builds/{versionIdentifier}` → `ApiAppVersion`
- `DELETE /apps/{appIdentifier}/builds/{versionIdentifier}` → `204 NoContent`
- `PUT /apps/{appIdentifier}/builds/{versionIdentifier}/config` → `CreateAppBuildConfigRequest` → `ApiAppVersionConfig`
- `GET /apps/{appIdentifier}/builds/{versionIdentifier}/config` → `ApiAppVersionConfig`
- `GET /apps/{appIdentifier}/builds/{versionIdentifier}/changelog` → `ApiPagedCollection<ApiChangelog>`
	OData: `Filter(activityId, actorUpn, actorAzureUniqueId, commandName)`, `Top`, `Skip`

## Tag endpoints
- `GET /apps/{appIdentifier}/tags` → `ApiPagedCollection<ApiAppTag>`
- `GET /apps/{appIdentifier}/tags/{tagName}/history` → `ApiPagedCollection<ApiAppTagHistory>`
- `PUT /apps/{appIdentifier}/tags/{tagName}` → `CreateAppTagRequest` → `ApiAppTag`
- `DELETE /apps/{appIdentifier}/tags/{tagName}` → `204 NoContent`

## Category endpoints
- `GET /apps/categories` → `ApiPagedCollection<ApiAppCategory>`
- `GET /apps/categories/{appCategoryIdentifier}` → `ApiAppCategory`
- `POST /apps/categories` → `CreateAppCategoryRequest` → `ApiAppCategory`
- `PATCH /apps/categories/{appCategoryIdentifier}` → patch category request → `ApiAppCategory`
- `GET /apps/categories/{appCategoryIdentifier}/changelog` → `ApiPagedCollection<ApiChangelog>`
	OData: `Filter(activityId, actorUpn, actorAzureUniqueId, commandName)`, `Top`, `Skip`

## Governance endpoints
- `GET /governance-apps` (v`1.0-preview`) → `ApiPagedCollection<ApiGovernanceAppListItem>`
	OData: `Filter(appKey)`, `Expand(documents.content)`, `Search`, `Top`, `Skip`
- `GET /apps/{appIdentifier}/governance` → `ApiGovernanceApp`
- `PATCH /apps/{appIdentifier}/governance` → `PatchGovernanceAppRequest` → `ApiGovernanceApp`
- `POST /apps/{appIdentifier}/governance/documents` → `AppGovernanceDocumentRequest` → `ApiGovernanceDocument`
- `GET /apps/{appIdentifier}/governance/documents` → `ApiGovernanceDocument[]`
- `GET /apps/{appIdentifier}/governance/documents/{documentType}` → `ApiGovernanceDocument`
- `PATCH /apps/{appIdentifier}/governance/documents/{documentType}` → `PatchGovernanceDocumentRequest` → `ApiGovernanceDocument`
- `DELETE /apps/{appIdentifier}/governance/documents/{documentType}` → `204 NoContent`
- `PUT /apps/{appIdentifier}/governance/confirmation` → `ConfirmGovernanceRequest` → `ApiGovernanceConfirmation`
- `DELETE /apps/{appIdentifier}/governance/properties/{propertyName}` → `204 NoContent`

## Person-scoped endpoints
- `GET /persons/me/apps` and `GET /persons/{accountIdentifier}/apps` → `ApiPagedCollection<ApiPersonAppListItem>`
- `GET /persons/me/apps/{appIdentifier}` and `GET /persons/{accountIdentifier}/apps/{appIdentifier}` → `ApiPersonApp`
- `PUT /persons/me/apps/{appIdentifier}/tag` and `PUT /persons/{accountIdentifier}/apps/{appIdentifier}/tag` → `CreatePersonAppTagRequest` → `ApiPersonApp`
- `DELETE /persons/me/apps/{appIdentifier}/tag` and `DELETE /persons/{accountIdentifier}/apps/{appIdentifier}/tag` → `204 NoContent`
- `GET /persons/me/pinned-apps` and `GET /persons/{accountIdentifier}/pinned-apps` → `ApiPagedCollection<ApiPinnedApp>`
- `POST /persons/me/pinned-apps` and `POST /persons/{accountIdentifier}/pinned-apps` → `CreatePinnedAppRequest` → `ApiPinnedApp`
- `GET /persons/me/pinned-apps/{appIdentifier}` and `GET /persons/{accountIdentifier}/pinned-apps/{appIdentifier}` → `ApiPinnedApp`
- `DELETE /persons/me/pinned-apps/{appIdentifier}` and `DELETE /persons/{accountIdentifier}/pinned-apps/{appIdentifier}` → `204 NoContent`

## Subscription endpoint
- `PUT /subscriptions/apps` → subscription registration/update

## Authorization notes
- Read routes generally require authenticated callers.
- Write routes are protected by app-scoped authorization such as app admin, business owner, trusted application, or global full-control roles.
- Governance write routes are more restrictive than app reads and often allow app business owners or governance-specific global roles.
- Person-scoped pinned-app routes additionally allow the current user on their own resources.

## Typical status codes
- `200 OK`
- `201 Created`
- `204 NoContent`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `410 Gone`

## Explicit exclusions
- Widget controllers and widget bundle routes
- Internal option/probe endpoints used only for permission discovery
- Internal support surfaces outside the application domain
