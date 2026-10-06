---
agent: fusion-services-developer
seed_repo: fusion-pss-project-demand
seed_path: backend
---

## User

In the backend of this repository, add an endpoint that returns demand statistics for a single project: the number of
demands and the number of demand items for that project. Only callers with read access may call it, and an unknown project
should return a proper error. Add integration tests for the success, forbidden, and not-found cases.

Build the solution and run the tests before you finish. Work only inside this repository; do not deploy anything or push.

## Expect

- statistics-endpoint: `[Ss]tatistic`
- read-role-check: `ProjectDemandAccessRoles\.Read`

## Eval

The repository already has established conventions (see the reference implementation, which is the same codebase).
Score "Respect existing code" strictly: new code must follow the existing controller, Domain/Query, Models and test patterns
rather than introducing a new style.
