# Authoring Custom Fusion Framework Modules

How to package reusable cross-cutting behavior as a Fusion Framework module in a React app — the module lifecycle, configuration pattern, and when a custom module is the right tool.

**Fusion docs**: [Fusion Framework modules](https://docs.equinor.com/fusion-framework/)
**Cookbook**: See the custom module cookbook example in the Fusion Framework source (`packages/modules/`)

## When to use a custom module

A custom Fusion Framework module is appropriate when:
- You need reusable, cross-cutting behavior that multiple components or routes need access to
- The behavior depends on the Fusion bootstrap lifecycle (needs access to the framework instance at startup)
- You want to decouple infrastructure concerns (caching, subscriptions, service clients) from component code

A custom module is **not** appropriate for:
- Single-component-only state — use React state or context instead
- Data fetching that only one page needs — use a React Query hook in that page
- Generic utility functions — use a plain TypeScript module

## Module contract

Every custom module must implement the `IModule` interface from `@equinor/fusion-framework-module`:

```typescript
import type { IModule } from '@equinor/fusion-framework-module';

export interface IMyModuleConfig {
  // Configuration shape for your module
  apiBaseUrl: string;
}

export interface IMyModule {
  // Public API your module exposes to the app
  getClient(): MyApiClient;
}

export const module: IModule<IMyModule, IMyModuleConfig> = {
  name: 'myModule', // Unique module key — must not conflict with built-in modules
  initialize: async ({ config, instance }): Promise<IMyModule> => {
    const cfg = await config;
    const client = new MyApiClient(cfg.apiBaseUrl);
    return { getClient: () => client };
  },
};
```

## Wiring a custom module into an app

Register the module in `src/config.ts` using the `AppModuleInitiator` callback:

```typescript
import type { AppModuleInitiator } from '@equinor/fusion-framework-react-app';
import { module as myModule } from './modules/myModule';

export const configure: AppModuleInitiator = (configurator) => {
  // Built-in modules
  configurator.useFrameworkServiceClient('myService');

  // Custom module
  configurator.addModule(myModule, (moduleConfigurator) => {
    moduleConfigurator.setConfig({
      apiBaseUrl: 'https://api.example.com',
    });
  });
};
```

## Accessing a custom module in components

Use `useAppModule` from `@equinor/fusion-framework-react-app` with the module name key:

```typescript
import { useAppModule } from '@equinor/fusion-framework-react-app';
import type { IMyModule } from '../modules/myModule';

const MyFeatureComponent = () => {
  // Type the module by its interface
  const myModule = useAppModule<IMyModule>('myModule');
  const client = myModule.getClient();

  // Use the client in a React Query hook or useEffect
};
```

> Only call `useAppModule` inside React components or custom hooks — it is a React hook and must follow React rules.

## Module lifecycle

Fusion Framework initializes modules before the React app mounts. The lifecycle is:

1. `initialize` — called once at bootstrap with the merged config and a reference to the parent framework instance
2. Module is stored in the framework instance under its `name` key
3. Components access the module via `useAppModule(name)` after mount

There is no `destroy` lifecycle on most modules. If your module opens subscriptions or connections, clean them up in your components (e.g. via `useEffect` cleanup).

## File structure

A conventional custom module lives alongside the app source:

```
src/
  modules/
    myModule/
      index.ts       — module definition + exports
      MyApiClient.ts — implementation
  config.ts          — registermodule here
```

## Common pitfalls

- **Naming conflicts**: the module `name` must not collide with built-in Fusion module names (`http`, `auth`, `context`, `navigation`, `featureFlag`, `settings`, `bookmarks`, `analytics`). Use a unique name specific to your app or domain.
- **Accessing modules outside React**: `useAppModule` is a hook and cannot be called outside components. For route loaders or non-React contexts, access the framework instance directly via `framework.modules.<name>`.
- **Config not awaited**: the `initialize` callback receives a `Promise<config>` — always `await config` before reading config values.
- **Over-engineering**: if only one component needs the behavior, a hook or React context is simpler. Use a module when multiple disconnected parts of the app share the same infrastructure.

## When to use `fusion-research` first

If uncertain about specific module API signatures, available module names, or how built-in module configuration works, use `fusion-research` with `mcp_fusion_search_framework` to get source-backed evidence before implementing.

Example query: `mcp_fusion_search_framework` → `"IModule initialize configure AppModuleInitiator custom module"`
