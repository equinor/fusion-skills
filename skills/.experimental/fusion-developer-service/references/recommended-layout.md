# Recommended layout for a new Fusion API

## Contents

- Repository
- Naming
- Project file
- Program.cs shape

Use for **new** repos only. Existing repos keep their layout. Example names use the invented Work Orders app
(`<App>` = `WorkOrders`), a .NET 10 API on Radix.

## Repository

```text
backend/
  <App>.slnx                    # WorkOrders.slnx
  nuget.config                  # nuget.org + Fusion-Public
  global.json                   # SDK pin + Microsoft.Testing.Platform runner
  <App>.Api/                    # WorkOrders.Api/
    <App>.Api.csproj
    Program.cs                  # composition only: calls registration extensions, maps middleware
    ServiceRegistrationExtensions.cs  # AddXxxApplication/Database/Authentication/Authorization/Cors/Telemetry/ApiInfrastructure
    CorsExtensions.cs
    Authorization/              # <App>AccessRoles constants
    Controllers/                # one controller per resource
    Models/                     # Api* responses, *Request inputs, ApiCollection<T>
    Domain/
      Commands/                 # Create/Update/Delete* : IRequest<T> + handler
      Queries/                  # Get/List* : IRequest<T> + handler
      Behaviours/               # TelemetryBehaviour, RequestValidationBehavior
      Errors/                   # domain exceptions mapped to ProblemDetails
      Models/                   # Query* read models returned by handlers
    Database/
      <App>DbContext.cs
      <App>DbContextFactory.cs  # IDesignTimeDbContextFactory for `dotnet ef`
      Entities/                 # Db* entities
      Configurations/           # IEntityTypeConfiguration<Db*>
      Migrations/
    ErrorHandling/              # IExceptionHandler implementations
    Observability/              # ActivitySource, enrichment
    OpenApi/                    # OpenAPI transformers
  <App>.Api.Tests/              # WorkOrders.Api.Tests/
    <App>.Api.Tests.csproj
    Fixtures/                   # WebApplicationFactory + Fusion test fixture
    Mocks/                      # IFusionRolesV2Client mock etc.
    Tests/
infra/
  database/db-config.json       # finf
  roles/roles.<env>.json, bindings.<env>.json, access-assignments.<env>.json   # froles
  radix/radixconfig.yaml
  bicep/                        # monitoring, storage, key vault, pipeline identities
docs/
  adr/
  manual-solution-setup.md      # steps done outside the repo (app regs, role grants), no secrets
```

## Naming

- Projects `<App>.Api` and `<App>.Api.Tests`; folder name = project name = root namespace (`WorkOrders.Api.Domain.Commands`).
  Add further projects the same way (`<App>.Worker`, `<App>.Api.IntegrationTests`), not generic `Api/` or `Tests/`.
- `Db*` EF entities, `Api*` response models, `*Request` inputs, `Query*` read models from handlers.
- `<App>DbContext`, `<App>AccessRoles`, `<App>ActivitySource`.

## Project file

```xml
<PropertyGroup>
  <TargetFramework>net10.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```

Baseline packages (versions current for .NET 10 Fusion APIs; check for newer releases):

| Package | Why |
| --- | --- |
| `MediatR` 12.5.0 | CQRS; last Apache-licensed line (see `using-mediatr.md`) |
| `FluentValidation.DependencyInjectionExtensions` | Request validation (recommended) |
| `Asp.Versioning.Mvc`, `Asp.Versioning.Mvc.ApiExplorer`, `Asp.Versioning.OpenApi` | Versioning + per-version OpenAPI |
| `Microsoft.AspNetCore.OpenApi`, `Swashbuckle.AspNetCore.SwaggerUI` | OpenAPI document; UI only |
| `Microsoft.Identity.Web` | Entra ID JWT validation + token acquisition |
| `Fusion.Integration`, `Fusion.Integration.Roles` | Fusion service integration, Roles V2 |
| `Fusion.AspNetCore` | OData, FluentAuthorization helpers, PATCH models |
| `Fusion.Infrastructure.Database`, `Microsoft.EntityFrameworkCore.SqlServer`, `...Design` | Azure SQL with token auth |
| `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore` | DB readiness check |
| `Azure.Monitor.OpenTelemetry.AspNetCore`, `Azure.Identity` | Telemetry, workload identity credential |

Tests: `xunit.v3`, `Microsoft.AspNetCore.Mvc.Testing`, `Fusion.Testing`, `Fusion.Testing.Authentication`,
`Microsoft.EntityFrameworkCore.Sqlite`, `AwesomeAssertions`.

## Program.cs shape

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>("database");
builder.Services.AddAppDatabase(builder.Configuration);
builder.Services.AddAppApplication();          // MediatR + behaviours + validators
builder.Services.AddAppAuthentication(builder.Configuration);
builder.Services.AddAppAuthorization(builder.Configuration);   // Fusion.Integration + Roles V2
builder.Services.AddAppCors(builder.Configuration);
builder.Services.AddAppTelemetry(builder.Configuration);
builder.Services.AddAppApiInfrastructure();    // versioning, OpenAPI, ProblemDetails, exception handlers

var app = builder.Build();

app.UseExceptionHandler();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi().WithDocumentPerVersion().AllowAnonymous();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "v1"));
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health").AllowAnonymous();
app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false }).AllowAnonymous();
app.Run();

public partial class Program;   // for WebApplicationFactory<Program>
```

Keep `Program.cs` to composition; put each concern in an `AddXxx` extension so tests can swap pieces.
