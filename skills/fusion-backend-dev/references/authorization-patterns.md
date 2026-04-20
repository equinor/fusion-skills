# Authorization Patterns

## Request Authentication

All Fusion services require an Azure AD access token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

The token is obtained from Azure AD using the Fusion app registration:
- **Client ID**: `{app-client-id}` (obtain from your Fusion app registration)
- **Authority**: `https://login.microsoftonline.com/{tenant-id}/` (replace `{tenant-id}` with your Azure AD tenant ID, or use `common` / `organizations` if appropriate)
- **Delegated scope format**: `api://{resource-app-id}/{scope-name}`
- **Client credentials scope format**: `api://{resource-app-id}/.default`

### Example Scopes

**Delegated scopes** (user/app acting on behalf of a signed-in user):

| Service | Scope |
| --- | --- |
| People | `api://{resource-app-id}/people` |
| Org | `api://{resource-app-id}/org` |
| Context | `api://{resource-app-id}/context` |

**Application scope** (client credentials / app-only access):

| Flow | Scope |
| --- | --- |
| Client credentials | `api://{resource-app-id}/.default` |

---

## Authorization Requirements

Fusion services use ASP.NET Core authorization requirements. Common patterns:

### Requirement-Based Authorization

```csharp
// Backend service defines a requirement
public class MustBeContextManagerRequirement : IAuthorizationRequirement
{
    public string ContextId { get; set; }
}

// Frontend passes the requirement check implicitly via:
// 1. User identity (roles, claims)
// 2. Resource ownership (context manager, project lead, etc.)
```

**What this means for consumers**:
- Your Azure AD identity must include the required role/claim
- Or you must be explicitly listed as responsible (context manager, position holder)
- If denied: `403 Forbidden`

### Common Requirements

| Scenario | Requirement | How to satisfy |
| --- | --- | --- |
| Read Context | `CanReadContext` | Any authenticated user with `api://fusion-context/.default` scope |
| Modify Context | `IsContextManager` | Must have "ContextManager" role in that context OR hold a position in it |
| Delete Position | `CanDeletePosition` | Must be HR admin OR context manager where position exists |
| View Person | `CanViewPerson` | Any authenticated user with `api://fusion-people/.default` scope |

---

## Role-Based Access Control (RBAC)

Fusion services assign roles per user per resource. Example: roles in a context:

```json
{
  "contextId": "abc-def",
  "userId": "person-123",
  "roles": ["ContextManager", "Approver", "Contributor"]
}
```

**How roles affect API behavior**:
- **ContextManager**: Can create positions, assign responsibilities, modify context properties
- **Approver**: Can approve requests within the context
- **Contributor**: Can edit owned resources; read access to context
- **Viewer**: Read-only access to context and positions

Check role claims in your token to understand what you can do.

---

## Common Authorization Errors

### 401 Unauthorized

**Cause**: Missing or invalid token

**Fix**:
- Confirm token is in `Authorization: Bearer {token}` header
- Verify token is not expired
- Verify token was requested with correct scope

### 403 Forbidden

**Cause**: Token is valid but user doesn't have required role/permission

**Fix**:
- Confirm user has required role in this context/service
- Ask context manager to assign role if needed
- Check if user is responsible (position holder, manager, etc.)

### 400 Bad Request with authorization detail

**Cause**: Authorization requirement validation failed

**Response example**:
```json
{
  "code": "REQUIREMENT_NOT_MET",
  "message": "User must be context manager",
  "details": { "requirement": "IsContextManager" }
}
```

**Fix**: Escalate to someone with the required role, or ask your manager to add your responsibility

---

## Service-to-Service Authentication

When one Fusion service calls another (internal only):

1. Service acquires a token for the **service principal** (not user)
2. Token is requested with service's own scope
3. Called service validates the caller's service identity

**This is internal only** — as a client, you don't implement this directly. But you should know:
- Fusion services can communicate securely
- Cross-service calls are authenticated and authorized
- If a service can't reach another, it's usually a service principal permission issue (not your problem as a consumer)

---

## API Key Authentication (Special Cases)

Some non-user integrations accept API keys instead of Azure AD tokens:

```
Authorization: ApiKey {api-key}
```

**When**: Limited external integrations, batch operations, webhook receivers

**How to get**: Request from service owner; usually provided in project setup

---

## Checking Your Permissions

Before calling an endpoint, understand what you can do:

1. **Get your token**: Request from Azure AD with `api://{service}/.default` scope
2. **Decode the token**: Use jwt.ms or similar to see your roles/claims
3. **Check the endpoint docs**: Look for "Required role" or "Requirement" field
4. **Verify you have that role**: If not, ask your manager or context manager to assign it

### Example Token Claims

```json
{
  "oid": "person-object-id",
  "name": "John Doe",
  "email": "john.doe@equinor.com",
  "roles": ["engineer", "approver"],
  "scp": "api://{resource-app-id}/.default",
  "aud": "{app-client-id}"
}
```

The `roles` array shows what you can do globally. Per-context roles are usually returned in API responses.
