# Cross-Service & External API Integration

## Calling Other Fusion Services

### Typed HTTP Client Pattern

Fusion services use typed HTTP clients for service-to-service calls:

```csharp
// Backend service example structure
public interface IPeopleApiClient
{
    Task<PersonDto> GetPerson(string personId);
    Task<List<PersonDto>> SearchPeople(string query);
    Task<bool> UserHasRole(string personId, string role);
}

// Implementation handles:
// - Base URL configuration
// - Authorization token acquisition
// - Error handling and retries
// - Timeout management
```

**What this means for consumers**: Services have well-defined contracts. When a service calls another, it's using a typed interface (type-safe, testable).

### How Services Find Each Other

Services discover other services via **service discovery**:

```
1. Service startup → Register with discovery service (Consul, Kubernetes)
2. Need to call People API → Query discovery for People service URL
3. Discovery returns → Current URL(s) for People API
4. Service calls → People API at discovered URL
```

**Why this matters**: Services can move without breaking things. Discovery handles routing.

### Authentication Between Services

When Service A calls Service B:

```
1. Service A needs token for Service B
2. Service A requests token (using its own credentials)
3. Token returned with Service B's scope
4. Service A includes token in call to Service B
5. Service B validates token → Check caller service identity
```

**Different from user auth**: Service-to-service uses service principal, not user identity. As a client, you don't implement this — it happens internally.

---

## External API Integration

When Fusion services call external systems (outside Equinor):

### Pattern: HTTP Client with Retry

```json
{
  "ExternalApis": {
    "SAPSystem": {
      "BaseUrl": "https://sap.example.com/api",
      "RetryPolicy": "ExponentialBackoff",
      "RetryCount": 3,
      "TimeoutSeconds": 30
    }
  }
}
```

### Pattern: API Keys & Secrets

Credentials stored in:
- **Key Vault** (Azure Key Vault) — for production
- **Configuration** (appsettings.json) — for development only
- **Environment variables** — for containerized deployment

**As a consumer**: You don't see the keys. They're managed by the service team.

### Pattern: Request Mapping

```csharp
// Fusion model
public class PersonDto
{
  public string Name { get; set; }
  public string Email { get; set; }
}

// External system model
public class SAPPerson
{
  public string FULLNAME { get; set; }  // Different casing
  public string EMAIL_ADDRESS { get; set; }
  public string STATUS { get; set; }  // Extra field
}

// Mapper converts between formats
PersonDto fusion = mapper.Map<PersonDto>(sapPerson);
```

---

## Webhook Handling

When external systems call Fusion (Fusion receives webhooks):

### Webhook Registration

```
PUT /api/v1/webhooks
{
  "url": "https://external-system.com/fusion-updates",
  "events": ["ContextCreated", "PositionAssigned"],
  "secret": "webhook-secret"  // For signature validation
}
```

### Webhook Delivery

```
POST https://external-system.com/fusion-updates
Content-Type: application/json
X-Fusion-Signature: sha256={hmac_signature}
X-Fusion-Delivery-Id: {uuid}

{ /* event body */ }
```

### Signature Validation

The receiver validates the signature:

```csharp
byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(secret);
byte[] bodyBytes = System.Text.Encoding.UTF8.GetBytes(requestBody);
byte[] computedSignature;

using (HMACSHA256 hmac = new System.Security.Cryptography.HMACSHA256(keyBytes))
{
  computedSignature = hmac.ComputeHash(bodyBytes);
}

string headerValue = request.Headers["X-Fusion-Signature"].ToString();
const string signaturePrefix = "sha256=";

if (!headerValue.StartsWith(signaturePrefix, StringComparison.Ordinal))
{
  // Missing or malformed signature; reject it
  return 401 Unauthorized;
}

byte[] providedSignature = Convert.FromHexString(headerValue.Substring(signaturePrefix.Length));

if (!System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(computedSignature, providedSignature))
{
  // Request may be spoofed; reject it
  return 401 Unauthorized;
}
```

---

## Resilience Patterns

Services handle external API calls carefully:

### Timeout Management

```csharp
// All external calls have timeouts
TimeSpan timeout = TimeSpan.FromSeconds(30);
using CancellationTokenSource cts = new CancellationTokenSource(timeout);
HttpResponseMessage response = await _httpClient.GetAsync(url, cts.Token);
```

**Why**: Prevents a slow external API from blocking the entire service

### Circuit Breaker

When external API is failing:

```
1. Initial: Requests go through
2. Errors exceed threshold → Circuit opens
3. Circuit open: Requests immediately fail (fast-fail)
4. After delay: Circuit half-open → Try one request
5. If succeeds: Circuit closes → Back to normal
```

**Result**: Service doesn't hammer a broken external API.

### Fallback & Degraded Mode

If external integration fails:

```csharp
try
{
  SAPPersonDto sap = await _sapClient.GetPerson(personId);
  return enriched(sap);
}
catch (SAPUnavailableException)
{
  // SAP is down; use cached data or return minimal response
  PersonDto? cached = _cache.Get(personId);
  return cached ?? new MinimalPersonDto();
}
```

---

## When to Cache External Data

### Cache Pattern

```csharp
public async Task<PersonDto> GetPerson(string id)
{
  PersonDto? cached = _cache.Get<PersonDto>($"person:{id}");
  if (cached != null)
    return cached;
  
  PersonDto person = await _sapClient.GetPerson(id);
  _cache.Set($"person:{id}", person, expiration: TimeSpan.FromHours(1));
  return person;
}
```

**When to cache**:
- Data doesn't change frequently (person profile)
- Read volume is high
- External API has rate limits or latency

**When NOT to cache**:
- Data must be current (real-time inventory)
- Small read volume (caching overhead > benefit)
- Consistency is critical

---

## Testing External Integration

### Mock/Stub Pattern

```csharp
// Interfaces allow swapping real vs mock
public interface IExternalApiClient
{
  Task<PersonDto> GetPerson(string id);
}

// Production: Real HTTP client
public class HttpExternalApiClient : IExternalApiClient { }

// Testing: Mock
public class TestExternalApiClient : IExternalApiClient
{
  public Task<PersonDto> GetPerson(string id)
  {
    return Task.FromResult(new PersonDto { Name = "Test User" });
  }
}
```

### Contract Testing

```
1. External API publishes its OpenAPI/Swagger spec
2. Your service generates tests from spec
3. Tests verify: "If I call this endpoint with this request, I get this response"
4. Detect breaking changes early
```

---

## Common Pitfalls

| Pitfall | Problem | Solution |
| --- | --- | --- |
| No timeout | Slow API blocks service | Always set request timeout |
| No retry | Transient failure crashes feature | Retry transient errors (500, 503, 429) |
| No circuit breaker | Cascade failures | Use resilience library (Polly, etc.) |
| Exposing secrets | Security breach | Use Key Vault, not config files |
| No caching | Rate limit hit | Cache appropriately |
| Tight coupling | Hard to test/change | Use interfaces and dependency injection |
