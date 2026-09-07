---
description: Use when creating or changing C# code, project files, solutions, APIs, persistence, authorization, or tests in a Fusion backend service repository.
applyTo: "**/*.{cs,csproj,sln}"
---

# Fusion Service Development

- Follow repository-local architecture, authorization, persistence, testing, and contribution rules.
- Use nearby service implementations and source-backed Fusion research before introducing new patterns.
- Preserve existing API, event, and data contracts unless the task explicitly changes them.
- Apply established C# naming, XML documentation, async, validation, and error-handling conventions.
- Prefer workload identity / federated credentials over client secrets for outbound auth and token
  acquisition (e.g. `SignedAssertionFilePath` credential sources, `AddDefaultSqlTokenCredentials()`
  for database access) — a client secret is a fallback, not the default.
- Prefer integration tests exercising the real HTTP pipeline (`WebApplicationFactory`) over isolated
  unit tests of handlers; mock or stub only true external dependencies at the boundary (e.g. a
  Fusion Roles V2 client), not the service's own database or MediatR pipeline. Use `Fusion.Testing`
  and `Fusion.Testing.Authentication` to simulate an authenticated caller with specific access roles
  rather than hand-rolling test JWTs.
- Keep service changes scoped and validate affected units, integration boundaries, and builds before completion.
