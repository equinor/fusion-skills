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
  "name": "pss-inventory",
  "environment": "ci",
  "accessControl": {
    "administratorGroupName": "<entra group for admins>",
    "developerGroupName": "<entra group for developers>"
  }
}
```

```bash
# CI build
dotnet ef migrations script --idempotent --project backend/Api/App.Api.csproj --context AppDbContext \
  --configuration Release --no-build --output artifacts/migrations/migration.sql

# Deploy (pipeline identity needs the Fusion.Infrastructure.Database.Manage app role)
finf database provision -f infra/database/db-config.json -e ci --sql-contributor-client-id "<api app client id>" -o provisioning-output.json
finf database migrate -d "<database name from provisioning output>" -m artifacts/migrations/migration.sql

# PR database: copy of CI, removed when the PR closes
finf database provision -an pss-inventory -pr <pr-number> -ghr <owner/repo> --sql-contributor-client-id "<id>" -c ci
```

Database names follow `sqldb-fapp-<app>-db-<env>`; read the real name from the provisioning output.

## EF Core registration

```csharp
// Fusion.Infrastructure.Database: Entra token auth (workload identity on Radix, az login locally)
services.AddSqlDbContext<AppDbContext>(configuration.GetConnectionString("AppDbContext") ?? string.Empty)
    .AddAccessTokenSupport()
    .AddDefaultSqlTokenCredentials();
```

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

## Local development and tests

- Integration tests: SQLite `:memory:` (one open connection per fixture) with `EnsureCreated`, swapped in through
  `WebApplicationFactory` (`testing.md`).
- SQLite cannot verify SQL Server features (sequences, `rowversion`, migrations). Add a small SQL Server test set gated by
  an environment variable (e.g. `APP_SQLSERVER_TEST_CONNECTION`) and run it in CI against a container or PR database.
- Local stack: SQL Server in a container or SQLite behind an explicit local-only mock switch that throws when a workload
  identity token is present (Project Demand ADR 0020).

## Pitfalls

- `finf database provision` for PR databases can exceed the default 300 s timeout; pass a longer timeout in pipelines.
- `finf database migrate` reports HTTP errors, not the failing SQL; test the script locally first.
- Developer access via `fdev sql-access` needs the app's access group set up on Fusion Developer Tools.
- The pipeline identity needs the `Fusion.Infrastructure.Database.Manage` app role (request via Fusion Infrastructure);
  record it in `docs/manual-solution-setup.md`.

Learn more: `https://docs.fusion.equinor.com/docs/developer/api/database` (+ migration guide), `fusion-infra-cli`.
