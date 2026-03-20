# Using Analytics

How to instrument Fusion app and portal experiences with Fusion Framework analytics.

## What the framework provides

Fusion Framework analytics gives apps a common tracking API while letting the platform handle collection. The portal already includes analytics support, so most app work starts with the hook, not a custom telemetry client.

## Basic tracking

```typescript
import { useTrackFeature } from '@equinor/fusion-framework-react-app/analytics';

const trackFeature = useTrackFeature();
trackFeature('dashboard-opened');
```

## Track user actions and screen loads

```typescript
import { useTrackFeature } from '@equinor/fusion-framework-react-app/analytics';
import { useEffect } from 'react';

const DashboardPage = () => {
  const trackFeature = useTrackFeature();

  useEffect(() => {
    trackFeature('DashboardPage loaded');
  }, [trackFeature]);

  return (
    <Button onClick={() => trackFeature('Dashboard filter opened')}>
      Open filters
    </Button>
  );
};
```

## Send small structured metadata

```typescript
trackFeature('dashboard-filter-applied', {
  filterCount: 3,
  section: 'overview',
});
```

Use small, intentional metadata. Avoid secrets, access tokens, or personal data that does not belong in analytics events.

## When to instrument

Good analytics events usually capture:
- page or feature entry points
- meaningful user actions such as apply, create, approve, or export
- important workflow milestones or failures
- rollout observation for newly introduced features

Avoid tracking every render or low-value UI noise.

## Local testing

To inspect analytics locally:
1. Enable the `Log Fusion Analytics` feature in the portal profile.
2. Refresh the page.
3. Inspect console output prefixed with `Analytics::Adapter::Console`.

## Advanced configuration

Most app work can rely on the portal's existing analytics setup. If you need custom collectors or adapters, configure them in app configuration and validate the current analytics module docs first.

## Review guidance

- Prefer `useTrackFeature()` over ad hoc analytics wrappers unless the project already standardizes one.
- Reuse stable event names when extending an existing workflow.
- Track business-significant interactions, not implementation details.

## Relevant sources

- Fusion docs analytics guide
- analytics module documentation