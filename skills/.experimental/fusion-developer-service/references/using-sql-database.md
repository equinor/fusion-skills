# Azure SQL via Fusion Database-as-a-Service

Preferred store for Fusion APIs: Azure SQL (SQL Server) provisioned with `finf` (Fusion Database-as-a-Service), accessed
with EF Core and Entra ID tokens. Never hand-create Azure SQL servers/databases for a Fusion app. CLI details:
`fusion-infra-cli`.

## Flow

1. `infra/database/db-config.json` per app (name, environment, access groups).
2. CI build generates an idempotent migration script from EF Core migrations.
3. Deploy: `finf database provision` (idempotent) then `finf database migrate` with the script, then deploy the app.
4. App connects with its workload identity; the connection string has no user or password.
5. Developers get temporary access with `fdev sql-access`.

```json
{
  "name": "work-orders",
  "environment": "ci",
  "accessControl": {
    "administratorGroupName": "<entra group for admins>",
    "developerGroupName": "<entra group for developers>"
  }
}
```

```bash
# CI build
dotnet ef migrations script --idempotent --project backend/WorkOrders.Api/WorkOrders.Api.csproj --context WorkOrdersDbContext \
  --configuration Release --no-build --output artifacts/migrations/migration.sql

# Deploy (pipeline identity needs the Fusion.Infrastructure.Database.Manage app role)
finf database provision -f infra/database/db-config.json -e ci --sql-contributor-client-id "<api app client id>" -o provisioning-output.json
finf database migrate -d "<database name from provisioning output>" -m artifacts/migrations/migration.sql

# PR database: copy of CI, removed when the PR closes
finf database provision -an work-orders -pr <pr-number> -ghr <owner/repo> --sql-contributor-client-id "<id>" -c ci
```

Database names follow `sqldb-fapp-<app>-db-<env>`; read the real name from the provisioning output.

## EF Core registration

```csharp
// Fusion.Infrastructure.Database: Entra token auth (workload identity on Radix, az login locally)
services.AddSqlDbContext<AppDbContext>(
        configuration.GetConnectionString("AppDbContext") ?? string.Empty,
        sqlServerOptionsAction: sql => sql
            .UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)   // see "Querying efficiently"
            .EnableRetryOnFailure(maxRetryCount: 5))                          // Azure SQL transient faults
    .AddAccessTokenSupport()
    .AddDefaultSqlTokenCredentials();
```

With retries enabled, a manual transaction must run inside the execution strategy, or EF throws:
`await db.Database.CreateExecutionStrategy().ExecuteAsync(async () => { await using var tx = await db.Database.BeginTransactionAsync(ct); ... })`.

Connection string (radixconfig variable, not a secret):
`Server=tcp:fusion-test-sqlserver-alias.database.windows.net,1433;Initial Catalog=sqldb-fapp-<app>-db-ci;Encrypt=True;Connection Timeout=30;`
(prod uses the prod server alias). Add `healthChecks.AddDbContextCheck<AppDbContext>("database")` for readiness.

## Model

- `Db*` entities, configured with `IEntityTypeConfiguration<T>` (Fluent API), applied in `OnModelCreating`; no data
  annotations for schema.
- Explicit max lengths, indexes, unique constraints, check constraints; `rowversion` for optimistic concurrency where
  concurrent edits matter (map `DbUpdateConcurrencyException` to 409).
- `IDesignTimeDbContextFactory<AppDbContext>` so `dotnet ef` works without booting the app (CI script generation fails
  without it).
- Migrations live in `Database/Migrations`; every model change ships with its migration in the same PR. Keep them
  backward compatible (add nullable/defaulted columns first) because the old pods run during deploy.
- Production migrations run in the pipeline (`finf database migrate`), never `Database.Migrate()` on startup; startup
  migration is fine only for local/compose.
- EF sequential GUIDs are not RFC-variant UUIDs; frontends using strict UUID validation need `guid()`-style checks.

## Queries

- Use LINQ **method (fluent) syntax**: `db.WorkOrders.AsNoTracking().Where(...).OrderBy(...).Select(...)`. It chains
  with `AsNoTracking`, `TagWith`, and the OData helpers; use query syntax (`from x in ... select`) only where a
  multi-join is clearly easier to read.
- Tag every query with the MediatR request that runs it: `.TagWith(nameof(GetWorkOrders))`. EF Core writes the tag as a
  `-- GetWorkOrders` comment in the SQL, which shows in the SQL dependency text, Query Store, and `sys.dm_exec_*` views,
  so a slow query can be traced back to its handler. Use constant names only (tags are SQL literals; never user input).
  Several `TagWith` calls add up, so a shared query helper can add its own tag.
- `TagWith` does not apply to `SaveChanges`; those commands are identified through the parent MediatR span in traces.

```csharp
List<QueryWorkOrder> items = await db.WorkOrders.AsNoTracking()
    .TagWith(nameof(GetWorkOrders))
    .Where(x => x.Status == request.Status)
    .OrderByDescending(x => x.Created).ThenBy(x => x.Id)
    .Take(top)
    .Select(QueryWorkOrder.Projection)
    .ToListAsync(cancellationToken);
```

## Querying efficiently

From Microsoft Learn "Efficient querying"; apply in every handler.

**Tracking**

- MediatR **queries** always use `AsNoTracking()`: no change-tracker snapshots or identity map for data that is never
  saved (roughly 30 % faster and less memory in Microsoft's benchmark). Projections into `Query*` models are not tracked
  anyway, but an entity inside a projection is; `AsNoTracking()` keeps the intent explicit.
- **Commands** track only the entities they change (`FindAsync`/`SingleAsync` without `AsNoTracking`, modify,
  `SaveChangesAsync`). Read-only lookups inside a command still use `AsNoTracking()`.
- Do not switch the context default to `NoTracking`: a command that forgets `AsTracking()` then saves nothing, silently.
- Use `AsNoTrackingWithIdentityResolution()` only when a no-tracking result must share instances (same row referenced
  many times).

**Related data and cartesian explosion**

- Loading two or more sibling collections in one query (`Include(x => x.Tasks).Include(x => x.Comments)`, or both in a
  projection) makes SQL return their cross product: 10 tasks × 10 comments = 100 rows per work order.
- The registration above makes **split queries the default**: one SQL query per collection, no cross product. Reference
  (one-to-one/many-to-one) navigations are still joined. EF also stops warning about multiple collection includes.
- Opt out with `.AsSingleQuery()` for hot queries that load one small collection, where one round trip is cheaper.
- Split-query caveats: one extra round trip per collection; no consistency across the queries (wrap in a snapshot
  transaction when it matters); earlier result sets are buffered in memory. Always order by a unique key before
  `Skip`/`Take` (`.ThenBy(x => x.Id)`); EF before 10 could return wrong rows otherwise.
- Prefer projecting the needed columns (`Select`) over `Include`: it loads related data without full entities and skips
  large columns.

**Result size and paging**

- Every list query is bounded: `Take` with a clamped `$top` (`using-odata.md`), never an unbounded `ToListAsync()`.
- Page on a stable, unique order. `Skip`/`Take` gets slower with deep pages; for feeds or sync endpoints use keyset
  paging (`Where(x => x.Created < lastCreated || (x.Created == lastCreated && x.Id < lastId))`).
- Count and page are two queries; skip the count when the client does not need `totalCount`.

**Round trips**

- No lazy loading (do not add `Microsoft.EntityFrameworkCore.Proxies`); it hides N+1 queries.
- No queries inside loops: load the set once (`Where(x => ids.Contains(x.Id))`) and join in memory.
- Set-based changes use `ExecuteUpdateAsync`/`ExecuteDeleteAsync` (one SQL statement, no loading). They bypass the change
  tracker and `SaveChanges` logic, so do not use them where concurrency tokens or domain notifications depend on it.
- Async APIs only, with the request `CancellationToken`; never mix sync and async EF calls.

**SQL shape**

- Index the columns used in filters, joins and sorting (`HasIndex` in the entity configuration); composite index order
  matters (an index on A, B serves filters on A and A+B, not B alone).
- `StartsWith` can use an index; `Contains`/`EndsWith` (OData `contains`) scan the table, so limit them on large tables.
- Inspect slow queries with the query plan (Query Store; the `TagWith` comment finds the handler).
- Raw SQL is a last resort: `FromSql($"...{value}")` (parameterized), never `FromSqlRaw` with concatenated input.

## Local development and tests

- Integration tests: SQLite `:memory:` (one open connection per fixture) with `EnsureCreated`, swapped in through
  `WebApplicationFactory` (`testing.md`).
- SQLite cannot verify SQL Server features (sequences, `rowversion`, migrations). Add a small SQL Server test set gated by
  an environment variable (e.g. `APP_SQLSERVER_TEST_CONNECTION`) and run it in CI against a container or PR database.
- Local stack: SQL Server in a container or SQLite behind an explicit local-only mock switch that throws when a workload
  identity token is present; record that choice in an ADR.

## Pitfalls

- `finf database provision` for PR databases can exceed the default 300 s timeout; pass a longer timeout in pipelines.
- `finf database migrate` reports HTTP errors, not the failing SQL; test the script locally first.
- Developer access via `fdev sql-access` needs the app's access group set up on Fusion Developer Tools.
- The pipeline identity needs the `Fusion.Infrastructure.Database.Manage` app role (request via Fusion Infrastructure);
  record it in `docs/manual-solution-setup.md`.

Learn more: `https://docs.fusion.equinor.com/docs/developer/api/database` (+ migration guide), `fusion-infra-cli`.
