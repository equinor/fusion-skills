# Using Framework Modules

How to access Fusion Framework modules (context, auth, navigation, feature flags, settings, environment) in components.

## Module access patterns

All module hooks are available from sub-path imports of `@equinor/fusion-framework-react-app`:

```typescript
import { useAppModule } from '@equinor/fusion-framework-react-app';            // generic
import { useHttpClient } from '@equinor/fusion-framework-react-app/http';       // HTTP
import { useCurrentContext } from '@equinor/fusion-framework-react-app/context'; // context
import { useCurrentAccount } from '@equinor/fusion-framework-react-app/msal';   // auth
import { useRouter } from '@equinor/fusion-framework-react-app/navigation';     // routing
import { useFeature } from '@equinor/fusion-framework-react-app/feature-flag';  // flags
import { useAppSetting } from '@equinor/fusion-framework-react-app/settings';   // settings
```

## Context

Access the current Fusion context (project, facility, etc.):

```typescript
import { useCurrentContext } from '@equinor/fusion-framework-react-app/context';

const MyComponent = () => {
  const context = useCurrentContext();
  if (!context) return <p>No context selected</p>;
  return <p>Selected: {context.title}</p>;
};
```

## Authentication (MSAL)

The MSAL module is configured by the host portal — apps only consume the hooks:

```typescript
import { useCurrentAccount, useAccessToken } from '@equinor/fusion-framework-react-app/msal';

const UserInfo = () => {
  const user = useCurrentAccount();
  const { token } = useAccessToken({ scopes: ['User.Read'] });

  if (!user) return <p>Not signed in</p>;
  return <p>Welcome, {user.name}</p>;
};
```

## Navigation

```typescript
import { useRouter, useNavigationModule } from '@equinor/fusion-framework-react-app/navigation';

const MyComponent = () => {
  const router = useRouter();
  // router.navigate('/path')
};
```

## Feature flags

```typescript
import { useFeature } from '@equinor/fusion-framework-react-app/feature-flag';

// In config.ts — enable a flag
configurator.enableFeatureFlag({ key: 'new-dashboard', title: 'New Dashboard' });

// In components — read the flag
const MyComponent = () => {
  const [isEnabled] = useFeature('new-dashboard');
  if (!isEnabled) return null;
  return <NewDashboard />;
};
```

## App settings

Per-user settings stored by the Fusion platform:

```typescript
import { useAppSetting, useAppSettings } from '@equinor/fusion-framework-react-app/settings';

const MyComponent = () => {
  const [theme, setTheme] = useAppSetting<string>('theme');
  // theme is the current value, setTheme persists a new value
};
```

## Environment variables

Access runtime configuration from `app.config.ts`:

```typescript
import { useAppEnvironmentVariables } from '@equinor/fusion-framework-react-app';

const MyComponent = () => {
  const env = useAppEnvironmentVariables();
  // env contains values defined in app.config.ts environment: {}
};
```

## Bookmarks

```typescript
import { useCurrentBookmark, useBookmark } from '@equinor/fusion-framework-react-app/bookmark';
```

## Analytics

```typescript
import { useTrackFeature } from '@equinor/fusion-framework-react-app/analytics';
```

## Generic module access

Access any module by key when a dedicated hook is not available:

```typescript
import { useAppModule, useAppModules } from '@equinor/fusion-framework-react-app';

const auth = useAppModule('auth');
const allModules = useAppModules();
```
