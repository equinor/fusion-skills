---
"fusion-developer-services": patch
---

`fusion-services.instructions.md`: prefer workload identity/federated credentials over client
secrets for outbound auth and database access; prefer integration tests over isolated unit tests,
mocking only true external dependencies at the boundary; use `Fusion.Testing`/
`Fusion.Testing.Authentication` to simulate an authenticated caller instead of hand-rolling test
JWTs.
