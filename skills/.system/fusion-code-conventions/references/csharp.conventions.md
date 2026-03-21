# C# Code Conventions

Naming, null safety, async/await, and code style conventions for C# in Fusion projects.

## Project structure

ASP.NET Core services typically follow a layered internal layout:

```
Controllers/          ← API controllers + response model types
Domain/
  Commands/           ← MediatR IRequest command + nested Handler class
  Query/              ← MediatR IRequest query + nested Handler class
  Models/             ← Domain-internal result types
  Errors/             ← Domain-specific exception types
  Behaviours/         ← MediatR pipeline behaviours
Database/
  Entities/           ← EF Core entity types
  Extensions/         ← EF Core queryable helpers
  *DbContext.cs       ← EF Core DbContext
Authorization/        ← IAuthorizationRequirement and handler extensions
Integrations/         ← External service client adapters
Program.cs            ← Entry point
Startup.cs            ← DI registration
```

Common reusable packages and shared libraries live in a separate `common/` or `shared/` directory.
Integration tests live in a sibling `test/` directory, mirroring the production project name.

## Naming

| Kind                 | Convention      | Example                         |
|----------------------|-----------------|---------------------------------|
| Interfaces           | `I` prefix      | `IUserCache`, `IEmailClient`    |
| Types / classes      | PascalCase      | `OrderDbContext`, `CreateOrder` |
| Methods / properties | PascalCase      | `GetActiveItemsAsync`, `CreatedAt` |
| Local variables      | camelCase       | `filteredItems`, `cachedResults` |
| Parameters           | camelCase       | `cancellationToken`, `userId`   |
| Private fields       | camelCase       | `logger`, `mediator`            |
| DB entity classes    | `Db` prefix     | `DbOrder`, `DbLineItem`         |
| API response models  | `Api` prefix    | `ApiOrderV2`, `ApiLineItem`     |
| Domain query results | semantic prefix | `QueryOrder`, `QueryProfile`    |
| MediatR commands     | verb phrase     | `CreateOrder`, `CancelBooking`  |
| MediatR queries      | `Get*` phrase   | `GetOrderById`, `GetActiveUsers` |
| Test classes         | `*Tests` suffix | `OrderApiTests`, `CacheTests`   |
| Test methods         | `Subject_Context_ShouldOutcome` | `CreateOrder_AsGuest_ShouldBeUnauthorized` |

## Compiler settings and style enforcement

- **Nullable reference types**: `enable` — set globally (via `Directory.Build.props` or project file). New code must not opt out without a documented reason.
- **TreatWarningsAsErrors**: `true` — warnings are not allowed to accumulate.
- **ImplicitUsings**: project preference; production services are explicit, test projects may enable it.
- **GenerateDocumentationFile**: `true` on service/library projects. Warning `1591` (missing XML comment) is suppressed — comments are generated where present but not required on every member.
- **`csharp_using_directive_placement`**: `outside_namespace` — `using` directives before the namespace declaration.
- **File-scoped namespaces**: prefer (`csharp_style_namespace_declarations = file_scoped`). Exception: EF Core migration files.
- Enforce style via `.editorconfig` checked into the repository root.

## Null safety

- Nullable reference types are enabled project-wide — no dereference without a null check or null-conditional access (`?.`).
- Null-forgiving operator (`!`) is used sparingly, typically on `DbSet` properties initialized by EF Core (`= null!`).
- Use `ArgumentNullException.ThrowIfNull(arg)` for guard checks at method entry points.
- Prefer `FirstOrDefault()` / `SingleOrDefault()` over `First()` / `Single()` when the result may be absent.

## Async/await

- All I/O methods are `async Task` / `async Task<T>`. Never `async void` outside event handlers.
- Never block with `.Result` or `.Wait()`.
- Accept `CancellationToken cancellationToken = default` in async public methods.

## Disposables

- `IDisposable` resources are wrapped in `using` statements or `using` declarations.
- EF Core `DbContext` lifetimes are managed by DI (scoped — not manually disposed in handlers).

## Architecture patterns

- **MediatR CQRS**: business logic flows through `IRequest` + nested `Handler : IRequestHandler`. Commands (state-changing) and queries (read-only) are separated into distinct folders.
- **Base controller**: share common concerns (authorization helpers, dispatch, enrichment) via a base `ControllerBase` subclass rather than duplicating logic per controller.
- **Authorization**: prefer policy/requirement-based authorization over inline role string checks in action methods.
- **API versioning**: `[ApiVersion("X.0")]` + `[MapToApiVersion("X.0")]` from `Asp.Versioning`. Versioned controllers may be split as `partial` classes per version file.
- **Route naming**: kebab-case path segments (`/orders/{orderId}/line-items`).

## API response models

- All API response types carry an `Api` prefix (`ApiOrderV2`, `ApiLineItem`).
- Null properties should be suppressed in JSON output where they add noise: `[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]` (Newtonsoft) or `[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]` (`System.Text.Json`).
- Pick one JSON serializer per project and use it consistently. Prefer `System.Text.Json` for new projects; Newtonsoft.Json for projects that already rely on it.
- Versioned response models use a `V2`/`V3` suffix and may inherit from the previous version to extend incrementally.
- Response models live close to their controllers (`Controllers/Models/` or `Controllers/ViewModels/`).

## EF Core conventions

- Entity types use a `Db` prefix to distinguish them from domain models (`DbOrder`, `DbLineItem`).
- `DbSet<T>` properties initialized with `= null!` (EF Core sets them at runtime via DI).
- Store enum columns as strings: `HasConversion(new EnumToStringConverter<TEnum>())` — improves readability in the database and survives enum reordering.
- Keep index and relationship configuration in `OnModelCreating` using fluent lambda builders, not data annotations.

## Error handling

- Domain errors are typed exceptions that extend `Exception` directly (`RoleExistsError : Exception`).
- Constructor sets a formatted message; the class exposes domain-specific read-only properties.
- Controllers translate domain errors to HTTP responses via `FusionApiError.NotFound(...)`, `FusionApiError.IllegalAction(...)`.
- Catch the specific domain exception; let middleware handle unexpected exceptions.

## Code style (enforced via `.editorconfig`)

- **`var` is not used** (`csharp_style_var_*` all set to `false`) — always write explicit types.
- 4 spaces indent; CRLF line endings; final newline required; max line length 200 characters.
- Always use braces on control flow blocks (`csharp_prefer_braces = true`).
- Expression-bodied members: allowed for accessors, lambdas, properties — not for constructors or full methods.
- No `this.` qualifier (`dotnet_style_qualification_for_*` all `false`).
- Prefer predefined language keywords over BCL type names (`int`, not `Int32`).
- Prefer pattern matching (`is`, `switch` expressions) over `as`-with-null-check casts.
- Use object/collection initializers; prefer null-coalescing (`??`) and null-propagation (`?.`).
- `dotnet_style_readonly_field = true` — fields that are not mutated after construction should be `readonly`.

## XML doc comments

- `GenerateDocumentationFile = true` on all service projects.
- Warning `1591` is suppressed, so comments are generated where present but not required on every member.
- Use `<summary>`, `<param>`, `<returns>`, `<remarks>`, `<list>` as needed; `<see cref="..."/>` for cross-references.

## Testing

- **Framework**: xUnit + `Microsoft.AspNetCore.Mvc.Testing` for integration tests.
- **Assertions**: `FluentAssertions` is preferred for readable assertion messages; plain xUnit `Assert.*` is fine for simple checks.
- **Containers**: `Testcontainers` (e.g. `Testcontainers.MsSql`) for integration tests that need a real database — prefer over in-memory providers for production-representative coverage.
- **Test class naming**: `*Tests` suffix, one class per subject (`OrderApiTests`, `CacheTests`).
- **Test method naming**: `Subject_Context_ShouldOutcome` (`CreateOrder_AsGuest_ShouldBeUnauthorized`).
- **Structure**: `// Arrange` / `// Act` / `// Assert` comment blocks in unit tests.
- **Grouping**: `[Collection(...)]` to group integration tests sharing a `WebApplicationFactory` instance.
- **Mocks**: prefer hand-written `Test*` adapter classes over a mocking framework for external dependencies — keeps tests readable and avoids `Setup`/`Verify` complexity.
