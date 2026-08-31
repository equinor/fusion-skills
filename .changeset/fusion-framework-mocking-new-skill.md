---
"fusion-framework-mocking": minor
---

Add fusion-framework-mocking skill for test-time module and HTTP mocking in Fusion Framework apps

Covers `mockFramework`/`FrameworkMockConfigurator`, `mockAppModules`/`enableAppManifestMock`, each module's own `/mock` entry point (MSAL, Node auth, service discovery, context, bookmarks, feature flags, analytics, telemetry), HTTP middleware mocking with `createRouterMiddleware`/`createOpenApiMockMiddleware`, `@equinor/fusion-openapi-mock`, and registering mocks for custom modules.
