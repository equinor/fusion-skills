---
description: Apply Fusion Framework app testing conventions when creating, maintaining, reviewing, or running TypeScript and React test files.
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Fusion App Tests

## Local conventions

- Read nearest `AGENTS.md`, repository Copilot instructions, `package.json`, Vitest configuration,
  setup files, and nearby tests before editing.
- Follow existing package manager, test placement, suffix, imports, fixture patterns, and scripts.
- Do not add another runner, browser provider, DOM environment, dependency, or test convention when
  existing setup covers the behavior.

## Boundaries and skills

- Use smallest layer that proves behavior: pure logic, hook, component, route, then complete app.
- Use `fusion-framework-testing` for Fusion Vitest configuration, Browser Mode, render helpers, and
  fixtures.
- Use `fusion-framework-mocking` for auth, context, service discovery, bookmarks, feature flags,
  analytics, telemetry, app manifests, and Fusion HTTP/OpenAPI boundaries.
- Use both skills when rendered code consumes mocked Fusion state.
- Mock external boundaries, not behavior under test. Keep real Fusion providers and configurators
  when module-owned client mocks provide the required seam.

## Test structure

- Name suites and cases by observable condition and result.
- Assert public contracts and user-visible behavior, not private state or implementation order.
- Prefer accessible roles, labels, and visible text for UI queries.
- Await every Fusion render/hook helper and asynchronous UI transition.
- Prefer focused assertions over broad snapshots.
- Keep one-off setup in the test; extract typed fixtures only for meaningfully shared setup.

## Determinism and maintenance

- Never use real credentials, tokens, tenants, production services, or accidental network access.
- Seed identity, time, module state, and HTTP responses when behavior depends on them.
- Explicitly answer every expected request in tests intended to stay offline.
- Reset mutable spies, timers, and fixture state with existing lifecycle hooks.
- Preserve valuable regression coverage unless product behavior intentionally changed.
- Update test name, setup, and assertions together when public behavior changes.
- Do not hide flakes with arbitrary sleeps, retries, `.skip`, `.only`, or weakened assertions.

## Execution

- Inspect existing scripts; do not guess command names or switch package managers.
- Run narrowest supported selector for changed tests first.
- Run broader package tests when shared fixtures/configuration changed or local policy requires it.
- Run relevant typecheck and lint commands after test changes.
- Treat "no matching tests" as missing validation, not success.
- Report exact commands and pass/fail outcomes.
