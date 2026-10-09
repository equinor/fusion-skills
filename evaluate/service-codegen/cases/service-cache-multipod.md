---
agent: fusion-services-developer
---

## User

Create a Fusion backend API in this empty repository called `work-order-categories` that exposes a list endpoint of
maintenance categories (filtering and paging) protected by the access role `WorkOrderCategories.Read`. Categories are stored in
the API's own Azure SQL database and change a few times per week through a `PUT /categories/{id}` endpoint protected by
`WorkOrderCategories.Write`. Reads are very frequent, so cache the list. The API runs with 3 replicas on Radix, and users must
see a change on every replica right after it is saved.

Build the solution and run the tests before you finish. Work only inside this repository; do not deploy anything or push.

## Expect

- cache: `IMemoryCache|HybridCache|IFusionCache|IDistributedCache`
- cross-pod-invalidation: `DistributedNotification|AddMediatRDistributedNotification|IDistributedCache|Redis`

## Eval

Key expectations: per-pod cache invalidated on every replica after a write (Fusion.Infrastructure.MediatR distributed
notification, or a shared L2 cache with justification), not an in-memory cache that only the writing pod clears.
