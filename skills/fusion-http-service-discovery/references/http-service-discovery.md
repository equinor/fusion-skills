# Fusion Framework HTTP and Service Discovery Reference

## HTTP Client Configuration Patterns

### Basic HTTP Client Setup

Configure named HTTP clients during application setup:

```typescript
import { configureHttpClient } from '@equinor/fusion-framework-module-http';

// Configure a named HTTP client
configurator.addConfig(
  configureHttpClient('catalog', {
    baseUri: '/api/catalog',
    defaultScopes: ['api://catalog-api/.default'],
    onCreate: (client) => {
      client.requestHandler.setHeader('X-App-Name', 'my-app');
    },
  }),
);
```

### Using HTTP Clients

Create fresh client instances for API calls:

```typescript
// Create a client from named configuration
const client = framework.modules.http.createClient('catalog');

// Call JSON API
const items = await client.json<CatalogItem[]>('/items');

// Call with custom headers
const response = await client.fetch('/data', {
  headers: { 'Custom-Header': 'value' }
});

// Observable pattern for RxJS composition
const items$ = client.json$<CatalogItem[]>('/items');
```

## Service Discovery Configuration Patterns

### Basic Service Discovery Setup

Enable service discovery to resolve service URLs dynamically:

```typescript
import { enableServiceDiscovery } from '@equinor/fusion-framework-module-service-discovery';

// Auto-detects the 'service_discovery' HTTP client
enableServiceDiscovery(configurator);

// Or configure service discovery HTTP client first
configurator.addConfig(
  configureHttpClient('service_discovery', {
    baseUri: 'https://discovery.example.com',
    defaultScopes: ['https://discovery.example.com/.default'],
  }),
);
```

### Custom Service Discovery Configuration

```typescript
// Custom HTTP client key for service discovery
enableServiceDiscovery(configurator, async (builder) => {
  builder.configureServiceDiscoveryClientByClientKey(
    'sd_custom',        // HTTP client key
    '/custom/services', // optional endpoint path
  );
});

// Custom HTTP client and endpoint
enableServiceDiscovery(configurator, async (builder) => {
  builder.configureServiceDiscoveryClient(async ({ requireInstance }) => {
    const httpProvider = await requireInstance('http');
    return {
      httpClient: httpProvider.createClient('my_key'),
      endpoint: '/custom/services',
    };
  });
});
```

### Advanced Custom Discovery Client

```typescript
// Fully custom discovery client
enableServiceDiscovery(configurator, async (builder) => {
  builder.setServiceDiscoveryClient({
    async resolveServices() {
      return [
        { key: 'api', uri: 'https://localhost:5000', defaultScopes: [] },
        { key: 'context', uri: 'https://context-api.example.com', defaultScopes: ['api://context/.default'] },
      ];
    },
    async resolveService(key) {
      const services = await this.resolveServices();
      const service = services.find((s) => s.key === key);
      if (!service) throw new Error(`Unknown service: ${key}`);
      return service;
    },
  });
});
```

## Using Service Discovery at Runtime

### Resolve Services

```typescript
// Resolve a single service
const contextService = await modules.serviceDiscovery.resolveService('context');
console.log(contextService.uri); // 'https://api.example.com/context'

// Resolve all services
const allServices = await modules.serviceDiscovery.resolveServices();
```

### Create HTTP Clients for Discovered Services

```typescript
// Create a ready-to-use HTTP client for a discovered service
const client = await modules.serviceDiscovery.createClient('people');
const data = await client.json('/persons?search=Jane');

// The client is automatically configured with:
// - Service URI as base URL
// - Authentication scopes from service discovery
// - Standard HTTP client features
```

## Integration Patterns

### HTTP + Service Discovery Together

```typescript
// Configure both HTTP and service discovery
configurator.addConfig(
  configureHttpClient('service_discovery', {
    baseUri: 'https://discovery.example.com',
    defaultScopes: ['https://discovery.example.com/.default'],
  }),
);

enableServiceDiscovery(configurator);

// At runtime: use discovered services
const contextClient = await modules.serviceDiscovery.createClient('context');
const currentContext = await contextClient.json('/current');

// Or resolve first, then create custom HTTP client
const peopleService = await modules.serviceDiscovery.resolveService('people');
configurator.addConfig(
  configureHttpClient('people-custom', {
    baseUri: peopleService.uri,
    defaultScopes: peopleService.defaultScopes,
  }),
);
```

### Services Module Integration

```typescript
// The services module automatically integrates HTTP and service discovery
import { configureServices } from '@equinor/fusion-framework-module-services';

// Enable services module (depends on HTTP and optionally service discovery)
configurator.addConfig(configureServices());

// Create service clients by name - resolves via service discovery if available
const contextService = modules.services.createService('context');
const projects = await contextService.json('/projects');
```

## Common Error Scenarios and Solutions

### Service Discovery Errors

```typescript
// Handle missing services
try {
  const service = await modules.serviceDiscovery.resolveService('unknown');
} catch (error) {
  if (error.message.includes('Unknown service')) {
    console.error('Service not found in discovery');
    // Fallback to direct HTTP client or show error
  }
}

// Check if service discovery is available
if (modules.serviceDiscovery) {
  const client = await modules.serviceDiscovery.createClient('api');
} else {
  // Fallback to direct HTTP client
  const client = modules.http.createClient('api-fallback');
}
```

### HTTP Client Errors

```typescript
// Handle missing HTTP client configurations
try {
  const client = modules.http.createClient('missing-config');
} catch (error) {
  if (error instanceof ClientNotFoundException) {
    console.error('HTTP client configuration not found');
    // Configure client or use different name
  }
}

// Check if client exists before creating
if (modules.http.hasClient('optional-service')) {
  const client = modules.http.createClient('optional-service');
}
```

### Authentication and Scope Issues

```typescript
// Configure proper scopes for service discovery
configureHttpClient('service_discovery', {
  baseUri: 'https://discovery.example.com',
  defaultScopes: [
    'https://discovery.example.com/.default',
    // Add any additional required scopes
  ],
});

// Handle authentication errors
const client = modules.http.createClient('api');
try {
  const data = await client.json('/secured-endpoint');
} catch (error) {
  if (error.status === 401) {
    console.error('Authentication failed - check scopes');
  } else if (error.status === 403) {
    console.error('Insufficient permissions');
  }
}
```

## Development and Debugging Patterns

### Request/Response Inspection

```typescript
const client = modules.http.createClient('api');

// Inspect requests and responses
client.request$.subscribe(request => {
  console.log('Request:', request.url, request.method);
});

client.response$.subscribe(response => {
  console.log('Response:', response.status, response.url);
});

// Use observable patterns for debugging
const data$ = client.json$<any[]>('/items').pipe(
  tap(data => console.log('Received items:', data.length)),
  catchError(error => {
    console.error('API call failed:', error);
    return of([]); // Fallback value
  })
);
```

### Service Discovery Debugging

```typescript
// Log all discovered services
const services = await modules.serviceDiscovery.resolveServices();
console.table(services.map(s => ({
  key: s.key,
  uri: s.uri,
  scopes: s.defaultScopes?.join(', ') || 'none'
})));

// Test service resolution
const serviceName = 'context';
try {
  const service = await modules.serviceDiscovery.resolveService(serviceName);
  console.log(`Service ${serviceName} resolved to: ${service.uri}`);
} catch (error) {
  console.error(`Failed to resolve service ${serviceName}:`, error.message);
}
```

## Best Practices

### Configuration
- Always configure HTTP clients with appropriate `baseUri` and `defaultScopes`
- Use named clients for each distinct backend service
- Configure service discovery HTTP client before enabling service discovery
- Use `onCreate` handlers for common headers and request setup

### Usage
- Create fresh client instances with `createClient()` for each usage
- Prefer `json()` for API calls, `fetch()` for custom response handling
- Use observable patterns (`json$()`, `fetch$()`) when you need RxJS composition
- Handle authentication and network errors appropriately

### Service Discovery
- Always handle cases where services might not be available
- Use service discovery for dynamic environments, direct HTTP clients for static ones
- Test service resolution during application startup
- Provide fallback mechanisms for critical services