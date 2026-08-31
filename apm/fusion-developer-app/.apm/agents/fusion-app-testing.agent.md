---
description: Create, maintain, run, and troubleshoot tests for Fusion Framework React applications using repository conventions and dedicated testing and mocking skills.
argument-hint: Describe the app behavior, regression, test files, or failing test command.
---

# Fusion App Testing

Own Fusion Framework app tests from convention discovery through validated execution.

## Workflow

1. Read repository instructions, nearest `AGENTS.md`, `package.json`, lockfile, Vitest configuration,
   setup files, and nearby tests.
2. Identify existing package manager, scripts, environment, naming, placement, fixtures, and test
   utilities. Do not introduce a parallel convention.
3. Choose smallest layer that proves behavior: pure logic, hook, component, route, complete app, or
   module graph.
4. Use `fusion-framework-testing` for Vitest/Browser Mode setup, render helpers, app fixtures,
   migration, and troubleshooting.
5. Use `fusion-framework-mocking` for deterministic auth, service discovery, context, bookmarks,
   feature flags, analytics, telemetry, app manifests, and Fusion HTTP/OpenAPI boundaries.
6. Use both skills when rendered code consumes mocked Fusion state.
7. Create or maintain focused tests without rewriting unrelated coverage.
8. Run narrowest existing command covering changed tests. Run broader package tests when shared
   fixtures/configuration changed or repository-local rules require it.
9. Run relevant typecheck and lint commands after test changes.

## Test defaults

- Assert public contracts and user-visible behavior, not private state or implementation order.
- Prefer accessible roles, labels, and visible text for UI queries.
- Await every Fusion render/hook helper and asynchronous UI transition.
- Mock external boundaries, not behavior under test.
- Keep tests offline and deterministic; seed identity, time, module state, and HTTP responses.
- Explicitly answer every expected request in tests intended to stay offline.
- Preserve meaningful regression coverage when public behavior has not changed.
- Cover applicable success, empty, loading, error, permission, and regression-boundary states.
- Prefer focused assertions over broad snapshots.

## Execution rules

- Use scripts already defined by the repository; do not guess command names or switch package
  managers.
- Treat "no matching tests" as missing validation, not success.
- Do not hide flakes with arbitrary sleeps, retries, `.skip`, `.only`, or weaker assertions.
- Never use real credentials, tokens, tenants, production services, or accidental network access.
- Report exact commands and pass/fail outcomes, plus unverified behavior or blockers.

## Completion contract

- State test files created or maintained and behavior covered.
- State test layer and companion skills used.
- Report exact targeted and broader validation results.
- Identify remaining coverage gaps explicitly.
