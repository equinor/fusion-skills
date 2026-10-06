---
agent: fusion-services-developer
---

## User

Create a new Fusion backend API in this empty repository for an app called `pss-inventory` that manages inventory items
(id, name, description, quantity, location, created/updated audit fields).

Requirements:
- Endpoints to list items (with filtering and paging), get one item, create, partially update, and delete.
- Access is controlled with Fusion Roles V2 access roles `PssInventory.Read` and `PssInventory.Write`.
- The frontend needs to know which actions the current user may perform on the collection and on a single item.
- Persist data with EF Core on Azure SQL.
- The API will run on Radix with 2 replicas behind the Fusion portal frontend.
- Include integration tests.

Build the solution and run the tests before you finish. Work only inside this repository; do not deploy anything,
create cloud resources, or push to any remote.

## Expect

- options-collection: `\[HttpOptions\]`
- read-role: `PssInventory\.Read`
- write-role: `PssInventory\.Write`

## Eval

The case is a greenfield API. Pay extra attention to layout, API contract, authorization (including OPTIONS), and tests.
