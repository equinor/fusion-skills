# API Contracts & Versioning

## Fusion Service API Structure

All Fusion backend services follow a consistent REST API pattern:

### Base Pattern

```
GET    /api/v{major}/                    # Endpoint root
POST   /api/v{major}/                    # Resource creation
PUT    /api/v{major}/{id}                # Resource replacement
PATCH  /api/v{major}/{id}                # Resource partial update
DELETE /api/v{major}/{id}                # Resource deletion
```

### Versioning Strategy

- **Major version**: Incompatible changes (breaking changes to response shape, required fields, semantics)
- **Minor version** (via header): Non-breaking enhancements (new optional fields, new endpoints, new operations)
- **Version in URL** (`/api/v3/`): Always required; defines minimum compatibility level
- **Version in header** (`Api-Version: 3.1`): Optional; enables minor-version selection within a major version

### Error Response Format

All errors return a standard JSON shape:

```json
{
  "code": "VALIDATION_FAILED",           // Machine-readable error code
  "message": "One or more validation errors occurred",  // Human-readable message
  "details": [                           // Optional: structured error details
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Email format is invalid"
    }
  ],
  "timestamp": "2026-04-17T10:30:00Z"
}
```

### Authorization Header

All requests (except health checks) require:

```
Authorization: Bearer {access_token}
```

The access token is a JWT obtained from Azure AD. Scope required depends on the endpoint.

---

## Common API Contracts

### People Service

**Endpoint**: `GET /api/v3/persons/{personId}`

**Response** (simplified):
```json
{
  "id": "bbe7b3e5-b1da-4a3f-a0b8-7f7f8f8f8f8f",
  "name": "John Doe",
  "email": "john.doe@equinor.com",
  "roles": ["engineer", "reviewer"],
  "phone": "+47 40 00 00 00"
}
```

**Required scope**: `api://fusion-people/.default`

**Authentication**: Azure AD access token

---

### Org Service

**Endpoint**: `GET /api/v2/org-units/{orgUnitId}`

**Response** (simplified):
```json
{
  "id": "a-uuid",
  "name": "Engineering",
  "parentId": "parent-uuid",
  "children": [
    { "id": "child-uuid", "name": "Subsystems" }
  ],
  "manager": { "id": "person-id", "name": "Jane Smith" }
}
```

**Required scope**: `api://fusion-org/.default`

---

### Context Service

**Endpoint**: `GET /api/v1/contexts/{contextId}`

**Response** (simplified):
```json
{
  "id": "ctx-uuid",
  "title": "Project Alpha",
  "type": "ProjectDeliveryContext",
  "externalId": "external-ref",
  "startDate": "2026-01-01",
  "endDate": "2027-12-31"
}
```

**Required scope**: `api://fusion-context/.default`

---

## Integration Points

### REST API Consumption

Most common for:
- Frontend applications reading data
- External integrations (webhooks, periodic sync)
- Service-to-service calls via typed HTTP clients

### Event Subscription

Available for:
- Real-time updates (Person promoted, Context created)
- Async integration with other systems
- Workflow triggers

See `async-patterns.md` for event details.

---

## Rate Limiting

Fusion services may apply rate limiting, but quotas, headers, and retry behavior can vary by service and environment.

Common patterns include:
- **Exceeded**: `429 Too Many Requests`, sometimes with a `Retry-After` header
- **Headers**: Some services or gateways may expose headers such as `X-RateLimit-Remaining`
- **Quotas**: Request limits are service-specific; verify exact limits in the target API/OpenAPI documentation

---

## Pagination

Endpoints supporting large result sets use cursor-based pagination:

```json
{
  "data": [ /* items */ ],
  "pageInfo": {
    "hasNextPage": true,
    "nextCursor": "eyJwYWdlIjogMn0="
  }
}
```

Query with `?first=50&after={cursor}` to fetch next page.

---

## When Contracts Change

### Breaking Changes
- New required field
- Removed field
- Changed field type or semantics
- New mandatory query parameter

**Action**: New major version `/api/v4/` endpoint, old version remains for compatibility window (usually 2 versions or 6 months)

### Non-Breaking Changes
- New optional field
- New optional query parameter
- New operation/endpoint

**Action**: Increment minor version in header; no URL change required
