# Integration tests

Default: in-process integration tests through the real HTTP pipeline with `WebApplicationFactory<Program>`, SQLite in
memory, Fusion test authentication, and a mocked Roles V2 client. Mock only true external boundaries.

Packages: `xunit.v3`, `Microsoft.AspNetCore.Mvc.Testing`, `Microsoft.EntityFrameworkCore.Sqlite`, `Fusion.Testing`,
`Fusion.Testing.Authentication`, `AwesomeAssertions`.

xunit.v3 runs on Microsoft.Testing.Platform; on the .NET 10 SDK `dotnet test` then needs the runner opt-in in the repo
root `global.json`, or it fails with "Testing with VSTest target is no longer supported". `dotnet` reads the
`global.json` nearest the **working directory**, so extend an existing root file instead of adding a second one under
`backend/`:

```json
{ "test": { "runner": "Microsoft.Testing.Platform" } }
```

Run with `dotnet test --solution <path>.slnx` (positional paths are not accepted in this mode).

## Factory

```csharp
public sealed class AppWebAppFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection connection = new("DataSource=:memory:");
    private readonly FusionTestFixture fusionFixture;

    public FusionRolesClientMock RolesClient { get; } = new();

    public AppWebAppFactory(FusionTestFixture fusionFixture)
    {
        this.fusionFixture = fusionFixture;
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "IntegrationTesting");
        Environment.SetEnvironmentVariable("FORWARD_JWT", "True");
        // Placeholders so AddMicrosoftIdentityWebApi/AddFusionIntegration validate while the host builds.
        Environment.SetEnvironmentVariable("AzureAd__Instance", "https://login.microsoftonline.com/");
        Environment.SetEnvironmentVariable("AzureAd__TenantId", "3aa4a235-b6e2-48d5-9195-7fcf05b459b0");
        Environment.SetEnvironmentVariable("AzureAd__ClientId", Guid.Empty.ToString());
        Environment.SetEnvironmentVariable("Fusion__Environment", "ci");
        connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder) => builder.ConfigureServices(services =>
    {
        services.AddIntegrationTestingAuthentication();             // Fusion.Testing.Authentication
        services.AddDbContext<AppDbContext>(o => o.UseSqlite(connection));
        services.RemoveAll<IFusionRolesV2Client>();
        services.AddSingleton<IFusionRolesV2Client>(RolesClient);
        services.OverrideFusionHttpClientFactory(fusionFixture);    // in-process Fusion service mocks
    });

    public async Task InitializeDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreatedAsync();
    }
}
```

In `Program.cs`, skip the SQL Server registration when `builder.Environment.IsEnvironment("IntegrationTesting")` so the
test SQLite context does not conflict.

## Fixture and users

```csharp
public sealed class AppTestFixture : IAsyncLifetime
{
    private readonly FusionTestFixture fusionFixture = new();
    private readonly AppWebAppFactory factory;

    public TestUser Reader { get; }
    public TestUser Writer { get; }
    public TestUser NoRole { get; }

    public AppTestFixture()
    {
        factory = new AppWebAppFactory(fusionFixture);
        Reader = fusionFixture.CreateUser().AsEmployee().WithGlobalRole(AppAccessRoles.Read);
        Writer = fusionFixture.CreateUser().AsEmployee().WithGlobalRole(AppAccessRoles.Read).WithGlobalRole(AppAccessRoles.Write);
        NoRole = fusionFixture.CreateUser().AsEmployee();
    }

    public HttpClient CreateClient(TestUser user) => factory.CreateClient().WithTestUser(user).AddTestAuthToken();
    public async ValueTask InitializeAsync() => await factory.InitializeDatabaseAsync();
    public ValueTask DisposeAsync() { factory.Dispose(); return ValueTask.CompletedTask; }
}
```

`FusionRolesClientMock : IFusionRolesV2Client` implements `GetActiveAccessRoleAssignmentsAsync` (used when the token does
not already carry the role) and throws `NotImplementedException` for the rest. `Fusion.Testing` ships no Roles V2 mock.

## What to cover per endpoint

- Success with the minimum role, asserting status, body shape (`value`, `totalCount`), and persisted state.
- 403 for a user without the role (body is ProblemDetails), 401 without a token.
- 404 for unknown ids, 400 for invalid input and bad `$filter`.
- OPTIONS returns the expected `Allow` per role.
- Use Bogus or builders for data; no shared mutable state between tests.

SQL Server–specific behaviour (sequences, `rowversion`, migrations): separate tests gated by an environment variable
(`using-sql-database.md`).
