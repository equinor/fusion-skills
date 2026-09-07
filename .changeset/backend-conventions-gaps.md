---
"fusion-skills": patch
---

Close backend-convention gaps found while validating `fusion-developer-services` against
`equinor/fusion-pss-subsea-catalog`:

- `csharp.conventions.md`: declare `[ProducesResponseType]` for every status code an action can
  actually return (including negative paths); note that XML doc comments on controller actions and
  request/response model properties surface directly in the generated OpenAPI document, not just
  IntelliSense; prefer a small static factory class for enriched `ProblemDetails` responses so
  controller actions stay one-liners.
- `fusion-services.instructions.md`: prefer workload identity/federated credentials over client
  secrets for outbound auth and database access; prefer integration tests over isolated unit tests,
  mocking only true external dependencies at the boundary; use `Fusion.Testing`/
  `Fusion.Testing.Authentication` to simulate an authenticated caller instead of hand-rolling test
  JWTs.
