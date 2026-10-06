---
agent: fusion-services-developer
---

## User

Create a small Fusion backend API in this empty repository called `pss-people-directory`. It keeps a local copy of person
profiles (Azure unique id, name, mail, job title) in its own Azure SQL database so other endpoints can query them quickly
without calling Fusion People on every request. The copy must stay in sync when profiles change in Fusion, also while the API
is redeployed. The API runs with 2 replicas. Expose a list endpoint (filtering and paging) and a get-by-id endpoint, protected
by the access role `PssPeopleDirectory.Read`.

Build the solution and run the tests before you finish. Work only inside this repository; do not deploy anything or push.

## Expect

- persistent-subscription: `AddPersistent\w*Handler|ApiSubscriptionType\.Persistent|SubscriptionType\.Persistent|ProfileSync`
- fusion-integration: `AddFusionIntegration|AddIntegration`

## Eval

Key expectations: Fusion profile change events consumed through a persistent subscription (shared by both replicas, survives
redeploys), idempotent upsert handling, no transient subscription for the database sync.
