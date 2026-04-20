# Input Validation & Error Handling

## Validation Pattern

Fusion services validate all input before processing. Validation happens in layers:

### 1. Request-Level Validation (HTTP)

```
✓ Content-Type: application/json
✓ Authorization header present
✓ API version supported
```

**Errors**: `400 Bad Request`, `401 Unauthorized`, `406 Not Acceptable`

### 2. Model Validation (FluentValidation)

Before business logic runs, all input is validated:

```csharp
// Backend service rule example:
"Email must be a valid format"
"Name must be 1-200 characters"
"StartDate must be before EndDate"
```

**Error response**:
```json
{
  "code": "VALIDATION_FAILED",
  "message": "One or more validation errors occurred",
  "details": [
    {
      "field": "email",
      "code": "INVALID_EMAIL_FORMAT",
      "message": "Email must be a valid email address"
    },
    {
      "field": "startDate",
      "code": "INVALID_DATE_RANGE",
      "message": "Start date must be before end date"
    }
  ]
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

**Error response**:
```json
{
  "code": "BUSINESS_RULE_VIOLATION",
  "message": "Cannot delete context with active positions",
  "details": {
    "violation": "ActivePositionsExist",
    "positions": [123, 456]  // Position IDs that must be resolved first
  }
}
```

---

## Error Response Format

All Fusion services use consistent error format:

```json
{
  "code": "ERROR_CODE",              // Machine-readable code
  "message": "Human readable",       // What went wrong
  "details": {                       // Optional: additional context
    "field": "value",
    "reason": "explanation"
  },
  "timestamp": "2026-04-17T10:30:00Z",  // When it happened
  "traceId": "uuid"                  // For support/debugging
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
| --- | --- | --- |
| `VALIDATION_FAILED` | 400 | Input doesn't match schema or business rules |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Authenticated but not authorized for this action |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Operation conflicts with current state (e.g., already exists) |
| `UNPROCESSABLE_ENTITY` | 422 | Request is valid but semantically incorrect |
| `INTERNAL_SERVER_ERROR` | 500 | Service encountered unexpected error |

---

## How to Handle Validation Errors

### For VALIDATION_FAILED (400)

1. Check the `details` array for each field error
2. Show the user the specific error message
3. Let them correct the input
4. Retry the request

**Frontend example**:
```typescript
if (response.code === 'VALIDATION_FAILED') {
  const errors = response.details.reduce((acc, err) => {
    acc[err.field] = err.message;
    return acc;
  }, {});
  
  // Show errors in form next to fields
  form.setErrors(errors);
}
```

### For BUSINESS_RULE_VIOLATION (422)

Business rules are often recoverable but require additional steps:

1. Parse the `details` to understand what's blocking
2. Either:
   - Fix the prerequisite (delete active positions first, etc.)
   - Take an alternate action (update instead of delete)
   - Contact someone with higher permissions

**Example**:
```json
{
  "code": "BUSINESS_RULE_VIOLATION",
  "message": "Cannot delete context with active positions",
  "details": {
    "activePositionCount": 3,
    "alternatives": ["archive", "move_positions_to_other_context"]
  }
}
```

### For CONFLICT (409)

Resource already exists or state changed:

1. Fetch current state
2. Decide: overwrite (send version), merge, or error to user

**Optimistic lock pattern**:
```json
Request: PUT /contexts/{id}
Body: { "title": "New Title", "version": 5 }

Response: 409 Conflict
{
  "code": "VERSION_MISMATCH",
  "message": "Resource was modified; current version is 6",
  "details": { "currentVersion": 6 }
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
