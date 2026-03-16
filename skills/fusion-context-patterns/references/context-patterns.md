# Fusion Framework Context Patterns Reference

## Key Context APIs and Patterns

### Basic Context Setup

#### Enable Context in Application Configuration

```typescript
import { enableContext } from '@equinor/fusion-framework-module-context';

export const configure = (configurator) => {
  enableContext(configurator, (builder) => {
    // Restrict accepted context types
    builder.setContextType(['ProjectMaster', 'Facility']);
    
    // Post-query filter
    builder.setContextFilter((items) => items.filter((i) => i.isActive));
    
    // Custom parameter mapping for search API
    builder.setContextParameterFn(({ search, type }) => ({
      search,
      filter: { type },
    }));
  });
};
```

#### Basic Context Module Usage

```typescript
// Observe context changes
modules.context.currentContext$.subscribe((ctx) => {
  console.log('context changed', ctx);
});

// Search for context items
const items = await modules.context.queryContextAsync('Johan');

// Set context by item
await modules.context.setCurrentContextAsync(items[0]);

// Set context by ID
await modules.context.setCurrentContextByIdAsync('7fd97952-...');

// Clear the active context
modules.context.clearCurrentContext();
```

### React Hook Usage

#### Getting Current Context

```typescript
import { useModuleCurrentContext } from '@equinor/fusion-framework-react-module-context';

export const App = () => {
  // Get the current context (project, task, etc.)
  const { currentContext } = useModuleCurrentContext();
  
  return (
    <section>
      <h3>Current Context:</h3>
      <pre>{JSON.stringify(currentContext, null, 4)}</pre>
    </section>
  );
};
```

#### Custom Hook for Related Contexts

```typescript
import { useMemo } from 'react';
import { EMPTY } from 'rxjs';
import {
  type ContextItem,
  type ContextModule,
  useModuleCurrentContext,
} from '@equinor/fusion-framework-react-module-context';
import { useAppModule } from '@equinor/fusion-framework-react-app';
import { useObservableState } from '@equinor/fusion-observable/react';

/**
 * Hook to get related contexts
 * @param type - Optional filter by context type
 */
export const useRelatedContext = (
  type?: string[],
): ReturnType<typeof useObservableState<ContextItem[] | undefined>> => {
  const { currentContext } = useModuleCurrentContext();
  const provider = useAppModule<ContextModule>('context');
  
  return useObservableState(
    useMemo(() => {
      if (!currentContext) return EMPTY; // No context, return empty observable
      
      return provider.relatedContexts({
        item: currentContext,
        filter: { type },
      });
    }, [provider, currentContext]),
  );
};
```

### Custom Context Implementation

#### Custom Context Client Setup

```typescript
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

enableContext(configurator, async (builder) => {
  // Get HTTP provider to create API client
  const httpProvider = await builder.requireInstance('http');
  const httpClient = httpProvider.createClient('apps');

  // Configure the custom context client
  builder.setContextClient({
    // Method to get a single context item by ID
    get: ({ id: appIdentifier }) => {
      return httpClient.json$(`/apps/${appIdentifier}?$expand=category`, {
        selector: (response) => {
          const json$ = from(jsonSelector(response)) as Observable<App>;
          return json$.pipe(
            map((app) => {
              // Transform API response to ContextItem format
              return {
                id: app.id,
                type: { id: app.category?.displayName || 'Unknown' },
                title: app.displayName,
                value: {
                  appKey: app.appKey,
                  id: app.id,
                  app: app
                },
              } satisfies ContextItem<AppContextValue>;
            }),
            // Handle errors gracefully
            catchError((error) => {
              console.error('Failed to fetch application context:', error);
              return EMPTY;
            })
          );
        },
      });
    },

    // Method to search/query for context items
    query: ({ search }) => {
      return httpClient.json$(`/apps?$expand=category&$search=${search}`, {
        selector: (response) => {
          const json$ = from(jsonSelector(response)) as Observable<{ value: App[] }>;
          return json$.pipe(
            map(({ value: apps }) => {
              // Transform array of apps to array of ContextItems
              return apps.map((app) => {
                return {
                  id: app.id,
                  type: { id: app.category?.displayName || 'Unknown' },
                  title: app.displayName,
                  value: {
                    appKey: app.appKey,
                    id: app.id,
                    app: app
                  },
                } satisfies ContextItem<AppContextValue>;
              });
            }),
            // Handle search errors
            catchError((error) => {
              console.error('Failed to search applications:', error);
              return from([[]]); // Return empty array on error
            })
          );
        },
      });
    },
  });
});
```

### Path and Context Integration

#### Context Path Configuration

```typescript
enableContext(configurator, (builder) => {
  // Path ↔ context integration
  // Extract context ID from URL path
  builder.setContextPathExtractor((path) => path.split('/')[2]);
  
  // Generate URL path with context
  builder.setContextPathGenerator((ctx, path) =>
    path.replace(/\/context\/[^/]+/, `/context/${ctx.id}`)
  );
});
```

### Error Handling and Events

#### Context Events

```typescript
// Listen to context change events
modules.event.addEventListener('onCurrentContextChanged', (e) => {
  console.log('previous:', e.detail.previous);
  console.log('next:', e.detail.next);
});

// Listen to context validation failures
modules.event.addEventListener('onSetContextValidationFailed', (e) => {
  console.error('Context validation failed:', e.detail);
});
```

#### Custom Error Handling

```typescript
import { FusionContextSearchError } from '@equinor/fusion-framework-module-context/errors.js';

try {
  await modules.context.queryContextAsync('...');
} catch (err) {
  if (err instanceof FusionContextSearchError) {
    console.error(err.title, err.description);
  }
}
```

#### Custom Context Error Message

```typescript
// Throw custom context error for display
throw new FusionContextSearchError({
  title: 'Custom Context Error',
  message: 'This is a custom error message for context issues'
});
```

### Advanced Configuration Patterns

#### Custom Validation and Resolution

```typescript
enableContext(configurator, (builder) => {
  // Custom validation logic
  builder.setValidateContext(function (item) {
    return item !== null && this.validateContext(item);
  });

  // Custom context resolution
  builder.setResolveContext(function (item) {
    return this.relatedContexts({ item, filter: { type: ['ProjectMaster'] } });
  });

  // Connect or disconnect from parent context
  builder.connectParentContext(false);
});
```

## Common Context Types

- **ProjectMaster**: Standard project context
- **Facility**: Facility/installation context  
- **Task**: Task-specific context
- **Application**: Application-specific context (for custom implementations)

## Troubleshooting Guide

### Context Not Loading

1. **Check context type configuration**: Ensure context types are properly set with `setContextType(['ProjectMaster'])`
2. **Verify context client setup**: Confirm context client is configured correctly
3. **Check network requests**: Context may fail due to API connectivity issues
4. **Validate context path extraction**: Ensure path extraction is configured for URL-based context

### Context Change Not Detected

1. **Subscribe to context changes**: Use `currentContext$` observable or `useModuleCurrentContext` hook
2. **Check event listeners**: Ensure context change events are properly subscribed
3. **Verify component re-rendering**: Context changes should trigger component updates

### Custom Context Issues

1. **Check ContextItem format**: Ensure custom context returns proper `ContextItem` structure
2. **Verify error handling**: Add `catchError` operators for robust error handling  
3. **Validate API responses**: Confirm API responses match expected format
4. **Check path generation**: Ensure custom path generators work correctly

## When to Use Custom Context

Consider implementing custom context when:
- Default context behavior doesn't match application requirements
- Application requires unique context identifiers (not standard facility or project)
- Custom URL routing patterns are needed for context navigation
- Context data comes from specialized APIs or services

## Official Documentation Links

- [Fusion Framework Context Module](https://equinor.github.io/fusion-framework/modules/context/)
- [Context Cookbook - React Context](https://github.com/equinor/fusion-framework/tree/main/cookbooks/app-react-context)
- [Custom Context Error Cookbook](https://github.com/equinor/fusion-framework/tree/main/cookbooks/app-react-context-custom-error)
- [Path Extraction and Generation](https://equinor.github.io/fusion-framework/modules/context/#setcontextpathextractor)