# Input Validation & Error Handling

## Validation Pattern

Fusion services validate all input before processing. Validation happens in layers:

### 1. Request-Level Validation (HTTP)

```
✓ Content-Type: application/json
✓ Authorization header present
✓ API version supported
```

**Errors**: `400 Bad Request`, `401 Unauthorized`, `415 Unsupported Media Type`

### 2. Model Validation (FluentValidation)

Before business logic runs, all input is validated:

```csharp
// Backend service rule example:
"Email must be a valid format"
"Name must be 1-200 characters"
"StartDate must be before EndDate"
```

**Error response** (ProblemDetails with validation extensions):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "error": {
    "code": "ModelValidationError",
    "message": "Model contained 2 error",
    "errors": [
      { "property": "email", "message": "Email must be a valid email address" },
      { "property": "startDate", "message": "Start date must be before end date" }
    ]
  },
  "errors": {
    "email": ["Email must be a valid email address"],
    "startDate": ["Start date must be before end date"]
  },
  "traceId": "...",
  "timestamp": "..."
}
```

### 3. Business Logic Validation

After model validation passes, business rules are checked:

```csharp
// Example rules:
"Cannot assign position holder outside hiring period"
"Cannot delete context with active positions"
"Cannot modify archived context"
```

**Error response** (via `FusionApiError.InvalidOperation` or thrown as domain exception):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Invalid operation",
  "status": 400,
  "detail": "Cannot delete context with active positions",
  "error": {
    "code": "InvalidOperation",
    "message": "Cannot delete context with active positions"
  },
  "traceId": "...",
  "timestamp": "..."
}
```

---

## Error Response Format

All Fusion services return errors as RFC 7807 `ProblemDetails` with Fusion-specific extensions. The envelope is always the same; what varies is the `error` extension content.

### Validation errors (400)

FluentValidation failures produce a `ProblemDetails` with both a legacy `error` object and a standard `errors` dictionary:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "error": {
    "code": "ModelValidationError",
    "message": "Model contained 2 error",
    "errors": [
      { "property": "email", "message": "Email must be a valid email address", "attemptedValue": "bad" },
      { "property": "startDate", "message": "Must be before end date" }
    ]
  },
  "errors": {
    "email": ["Email must be a valid email address"],
    "startDate": ["Must be before end date"]
  },
  "traceId": "00-abc123...",
  "timestamp": "2026-04-17T10:30:00Z"
}
```

> **Note:** The top-level `errors` dictionary (field name → message array) matches the standard ASP.NET Core validation format. The nested `error.errors` array is a legacy format with additional context like `attemptedValue`. Consumers should prefer the top-level `errors` dictionary.

### Domain and operational errors (404, 409, 424, etc.)

Domain-specific errors use the same `ProblemDetails` envelope with an `error` extension:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource not found",
  "status": 404,
  "instance": "abc-123",
  "error": {
    "code": "ResourceNotFound",
    "message": "Context abc-123 was not found",
    "resourceIdentifier": "abc-123"
  },
  "traceId": "00-abc123...",
  "timestamp": "2026-04-17T10:30:00Z"
}
```

Controllers produce these via `FusionApiError` static factory methods (defined in `fusion-libraries`):
- `FusionApiError.NotFound(resource, message)` → 404
- `FusionApiError.InvalidOperation(code, message)` → 400
- `FusionApiError.ResourceExists(resource, message, exception)` → 409
- `FusionApiError.Forbidden(message)` → 403
- `FusionApiError.FailedDependency(code, message)` → 424
- `FusionApiError.IncorrectETag(message)` → 409

### Unhandled exceptions (500, middleware-caught)

The `ApiExceptionMiddleware` catches unhandled exceptions and maps known types:
- `NotFoundError` → 404
- `NotAuthorizedError` → 403 (includes `accessRequirements` in the error)
- `ResourceExistsError` → 409
- `ReadOnlyModeError` → 500 with read-only context

Stack traces are included only in development/test environments.

### Common Error Codes

| Code | HTTP Status | Meaning |
| --- | --- | --- |
| `ModelValidationError` | 400 | Input doesn't match schema or FluentValidation rules |
| `ResourceNotFound` | 404 | Resource doesn't exist |
| `InvalidOperation` | 400 | Business logic constraint violated |
| `ResourceExists` / exception type | 409 | Resource already exists |
| `NotAuthorized` | 403 | Not authorized for action |
| `FailedDependency` | 424 | Downstream service error |
| `Gone` | 410 | Resource has been removed |
| `NotImplemented` | 501 | Endpoint not yet implemented |

---

## How to Handle Error Responses

### For Validation Errors (400)

1. Check the `errors` dictionary for field-level messages
2. Show the user the specific error message
3. Let them correct the input
4. Retry the request

**Frontend example**:
```typescript
if (response.status === 400) {
  const body = await response.json();
  // body.errors is a Record<string, string[]>
  const fieldErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(body.errors)) {
    fieldErrors[field] = (messages as string[])[0];
  }
  
  // Show errors in form next to fields
  form.setErrors(fieldErrors);
}
```

### For Business Rule Violations (400)

Business rules are often recoverable but require additional steps:

1. Parse `error.code` and `error.message` from the ProblemDetails response
2. Either:
   - Fix the prerequisite (delete active positions first, etc.)
   - Take an alternate action (update instead of delete)
   - Contact someone with higher permissions

**Example** (returned via `FusionApiError.InvalidOperation`):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Invalid operation",
  "status": 400,
  "detail": "Cannot delete context with active positions",
  "error": {
    "code": "InvalidOperation",
    "message": "Cannot delete context with active positions"
  },
  "traceId": "...",
  "timestamp": "..."
}
```

### For Conflict (409)

Resource already exists or state changed:

1. Fetch current state
2. Decide: overwrite (send version), merge, or error to user

**Optimistic lock pattern**:
```json
Request: PUT /contexts/{id}
Headers: { "If-Match": "\"etag-value\"" }
Body: { "title": "New Title" }

Response: 409 Conflict
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.8",
  "title": "Resource version does not match",
  "status": 409,
  "error": {
    "code": "IncorrectETag",
    "message": "ETag did not match, the resource might have been updated. Refresh and try again."
  },
  "traceId": "...",
  "timestamp": "..."
}
```

---

## Retry Strategy

Services support idempotent retries for transient failures:

| Status | Retryable? | Strategy |
| --- | --- | --- |
| 400, 401, 403, 404, 422 | ❌ No | Fix the request; retrying won't help |
| 409 | ⚠️ Depends | Do not blindly retry version/state conflicts; fetch current state, resolve the conflict, then retry only with an updated request. Use backoff only for explicitly transient conflicts |
| 429, 503, 504 | ✅ Yes | Wait and retry (exponential backoff) |
| 500 | ✅ Maybe | Retry once; if still fails, likely needs investigation |

**Recommended backoff**:
```
Attempt 1: immediate
Attempt 2: wait 100ms + random jitter
Attempt 3: wait 200ms + random jitter
Attempt 4: wait 400ms + random jitter
...stop after 3-4 attempts
```

---

## Testing Validation

Before sending requests to production:

1. **Happy path**: Valid data with all required fields
2. **Missing required fields**: Each required field removed one at a time
3. **Invalid formats**: 
   - Wrong type (string instead of number)
   - Invalid email format
   - Date outside allowed range
4. **Business rules**: 
   - Conflicting values (StartDate > EndDate)
   - Violating constraints (duplicate, out of bounds)
   - State violations (can't transition from this state)

Most Fusion services include example payloads in their Swagger/OpenAPI documentation.
