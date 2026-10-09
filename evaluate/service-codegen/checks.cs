// Deterministic scorecard for generated Fusion backend services.
// Usage: dotnet run checks.cs -- --workspace <dir> [--case <case.md>] [--out <dir>] [--no-build]
#:property PublishAot=false
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

Dictionary<string, string> options = ParseArgs(args);
string workspace = Path.GetFullPath(options.GetValueOrDefault("workspace") ?? throw new ArgumentException("--workspace is required"));
string outDir = Path.GetFullPath(options.GetValueOrDefault("out") ?? workspace);
string? caseFile = options.GetValueOrDefault("case");
bool runBuild = !options.ContainsKey("no-build");

string[] excluded = ["/bin/", "/obj/", "/.github/", "/node_modules/", "/TestResults/"];
List<SourceFile> sources = Directory.EnumerateFiles(workspace, "*.*", SearchOption.AllDirectories)
    .Where(p => p.EndsWith(".cs") || p.EndsWith(".csproj") || p.EndsWith(".props"))
    .Where(p => !excluded.Any(e => p.Replace('\\', '/').Contains(e)))
    .Select(p => new SourceFile(Path.GetRelativePath(workspace, p), File.ReadAllText(p)))
    .ToList();

List<SourceFile> csFiles = sources.Where(s => s.Path.EndsWith(".cs")).ToList();
List<SourceFile> projects = sources.Where(s => s.Path.EndsWith(".csproj") || s.Path.EndsWith(".props")).ToList();
List<SourceFile> testFiles = csFiles.Where(s => Regex.IsMatch(s.Path, @"Tests?[/\\.]", RegexOptions.IgnoreCase)).ToList();
List<SourceFile> appFiles = csFiles.Except(testFiles).ToList();
List<SourceFile> controllers = appFiles.Where(s => Regex.IsMatch(s.Content, @"\[ApiController\]|:\s*\w*ControllerBase\b")).ToList();

List<CheckResult> results = [];

void Check(string id, Severity severity, bool passed, string detail) => results.Add(new CheckResult(id, severity, passed, detail));
bool AnyApp(string pattern) => appFiles.Any(f => Regex.IsMatch(f.Content, pattern));
bool AnyProject(string pattern) => projects.Any(f => Regex.IsMatch(f.Content, pattern));
string[] Where(IEnumerable<SourceFile> files, string pattern) => files.Where(f => Regex.IsMatch(f.Content, pattern)).Select(f => f.Path).ToArray();

if (runBuild)
{
    string? solution = Directory.EnumerateFiles(workspace, "*.sln*", SearchOption.AllDirectories)
        .Where(p => !excluded.Any(e => p.Replace('\\', '/').Contains(e)))
        .OrderBy(p => p.Count(c => c == Path.DirectorySeparatorChar))
        .FirstOrDefault();
    // Relative path: on macOS /var vs /private/var aliases break test-host assembly loading for absolute paths.
    string target = solution is null ? "" : $"\"{Path.GetRelativePath(workspace, solution)}\" ";
    (int buildExit, string buildOut) = Run("dotnet", $"build {target}--nologo -clp:ErrorsOnly", workspace);
    if (buildExit != 0)
    {
        // First builds after restore occasionally fail in static web assets; one retry avoids false negatives.
        (buildExit, buildOut) = Run("dotnet", $"build {target}--nologo -clp:ErrorsOnly", workspace);
    }

    Directory.CreateDirectory(outDir);
    File.WriteAllText(Path.Combine(outDir, "build.log"), buildOut);
    Check("build", Severity.Fail, buildExit == 0, buildExit == 0 ? $"dotnet build {Path.GetFileName(solution)} succeeded" : Tail(buildOut));
    bool hasTests = projects.Any(p => Regex.IsMatch(p.Content, @"Microsoft\.NET\.Test\.Sdk|xunit|MSTest|NUnit|TUnit"));
    if (buildExit == 0 && hasTests)
    {
        // Microsoft.Testing.Platform mode (global.json "test.runner") rejects positional solution paths.
        bool mtp = File.Exists(Path.Combine(workspace, "global.json")) && File.ReadAllText(Path.Combine(workspace, "global.json")).Contains("Microsoft.Testing.Platform");
        string testTarget = solution is null ? "" : (mtp ? $"--solution {target}" : target);
        (int testExit, string testOut) = Run("dotnet", $"test {testTarget}".TrimEnd(), workspace);
        File.WriteAllText(Path.Combine(outDir, "test.log"), testOut);
        Check("test", Severity.Fail, testExit == 0, testExit == 0 ? "dotnet test succeeded" : Tail(testOut));
    }
    else
    {
        Check("test", Severity.Fail, false, hasTests ? "skipped: build failed" : "no test project found");
    }
}

Check("mvc-controllers", Severity.Fail, controllers.Count > 0, $"{controllers.Count} controller file(s)");
string[] minimalApis = Where(appFiles, @"\.Map(Get|Post|Put|Patch|Delete)\(");
Check("no-minimal-apis", Severity.Fail, minimalApis.Length == 0, minimalApis.Length == 0 ? "no MapGet/MapPost endpoints" : string.Join(", ", minimalApis));
Check("api-versioning", Severity.Warn, AnyApp(@"\[ApiVersion\("), "[ApiVersion] on controllers");

(int actions, int documented, List<string> missing) = CountProducesResponseType(controllers);
Check("produces-response-type", actions > 0 && missing.Count == 0 ? Severity.Fail : (documented * 2 >= actions ? Severity.Warn : Severity.Fail),
    actions > 0 && missing.Count == 0, $"{documented}/{actions} actions declare [ProducesResponseType]" + (missing.Count > 0 ? $"; missing: {string.Join(", ", missing.Take(8))}" : ""));
Check("xml-docs-enabled", Severity.Fail, AnyProject(@"<GenerateDocumentationFile>\s*true"), "GenerateDocumentationFile=true");
Check("xml-docs-on-controllers", Severity.Warn, controllers.Count > 0 && controllers.All(c => c.Content.Contains("/// <summary>")), "/// <summary> in every controller");

Check("problem-details", Severity.Fail, AnyApp(@"AddProblemDetails|IExceptionHandler|IProblemDetailsService") && AnyApp(@"UseExceptionHandler"), "ProblemDetails + UseExceptionHandler");
Check("problem-details-trace-id", Severity.Warn, AnyApp(@"""traceId""|TraceId|Activity\.Current"), "traceId added to ProblemDetails");
Check("opentelemetry", Severity.Fail, AnyApp(@"AddOpenTelemetry|UseAzureMonitor"), "OpenTelemetry / Azure Monitor configured");
Check("activity-source", Severity.Warn, AnyApp(@"new ActivitySource\(|ActivitySource\s+\w+\s*=\s*new\("), "custom ActivitySource");
Check("otel-service-name", Severity.Warn, AnyApp(@"\.AddService\(") || sources.Any(f => f.Content.Contains("OTEL_SERVICE_NAME")), "cloud role name set via service.name");
Check("cors", Severity.Fail, AnyApp(@"AddCors\(") && AnyApp(@"UseCors\("), "AddCors + UseCors");
Check("health-endpoints", Severity.Warn, AnyApp(@"/health/live") && AnyApp(@"""/health"""), "/health (readiness) and /health/live (liveness)");

string[] wrappers = Where(appFiles, @"(record|class)\s+Api\w*(Collection|Page|List)\w*(<\w+>)?\s*[\(\{:\r\n]");
bool valueWrapper = appFiles.Any(f => Regex.IsMatch(f.Content, @"(record|class)\s+Api\w*(Collection|Page|List)\w*[^\n]*\n?[\s\S]{0,400}?\bValue\b"));
Check("list-wrapper-value", Severity.Fail, valueWrapper, valueWrapper ? $"wrapper with Value: {string.Join(", ", wrappers)}" : "no Api*Collection type exposing Value");
Check("list-wrapper-total-count", Severity.Warn, AnyApp(@"\bTotalCount\b"), "TotalCount on list responses");
Check("no-raw-list-responses", Severity.Warn, !AnyApp(@"ActionResult<(IEnumerable|List|IReadOnlyList|ICollection)<"), "controllers do not return bare arrays");
Check("odata", Severity.Warn, AnyApp(@"ODataQueryParams|\[OData(Filter|Top|Skip|Search|Expand)"), "Fusion.AspNetCore OData attributes/params");

Check("fluent-authorization", Severity.Fail, AnyApp(@"Require(Enhanced)?AuthorizationAsync"), "FluentAuthorization checks in controllers");
Check("options-endpoints", Severity.Warn, AnyApp(@"\[HttpOptions") && AnyApp(@"HeaderNames\.Allow|""Allow"""), "[HttpOptions] returning Allow header");

string[] jsonIgnore = Where(sources, @"\[JsonIgnore|NullValueHandling\.Ignore|DefaultIgnoreCondition\s*=\s*JsonIgnoreCondition\.(WhenWritingNull|WhenWritingDefault)");
Check("no-json-ignore", Severity.Fail, jsonIgnore.Length == 0, jsonIgnore.Length == 0 ? "no JsonIgnore / NullValueHandling.Ignore" : string.Join(", ", jsonIgnore));

Match mediatr = projects.Select(p => Regex.Match(p.Content, @"Include=""MediatR""\s+Version=""(\d+)")).FirstOrDefault(m => m.Success) ?? Match.Empty;
Check("mediatr-below-13", Severity.Fail, mediatr.Success && int.Parse(mediatr.Groups[1].Value) < 13, mediatr.Success ? $"MediatR major {mediatr.Groups[1].Value}" : "MediatR not referenced");
Check("cqrs-handlers", Severity.Fail, AnyApp(@"IRequestHandler<"), "MediatR request handlers");
Check("fluent-validation", Severity.Warn, AnyProject(@"Include=""FluentValidation"), "FluentValidation referenced (recommended)");
Check("no-entities-in-responses", Severity.Fail, !AnyApp(@"ActionResult<\w*<?Db[A-Z]"), "controllers never return Db* entities");
Check("naming-db-entities", Severity.Warn, AnyApp(@"class\s+Db[A-Z]\w+"), "Db* entity classes");
Check("naming-api-models", Severity.Warn, AnyApp(@"(class|record)\s+Api[A-Z]\w+"), "Api* response models");
Check("ef-fluent-config", Severity.Warn, AnyApp(@"IEntityTypeConfiguration<|OnModelCreating"), "Fluent API entity configuration");
Check("design-time-factory", Severity.Warn, AnyApp(@"IDesignTimeDbContextFactory<"), "IDesignTimeDbContextFactory");
Check("ef-query-tag", Severity.Warn, AnyApp(@"\.TagWith(CallSite)?\("), "EF queries tagged with TagWith");
Check("ef-no-tracking", Severity.Warn, AnyApp(@"\.AsNoTracking(WithIdentityResolution)?\("), "read queries use AsNoTracking");
Check("ef-split-query", Severity.Warn, AnyApp(@"UseQuerySplittingBehavior\(QuerySplittingBehavior\.SplitQuery\)|\.AsSplitQuery\("), "split queries configured");
Check("linq-method-syntax", Severity.Warn, !AnyApp(@"\bfrom\s+\w+\s+in\s+[\w.]+(\s|$)[\s\S]{0,400}?\bselect\b"), "LINQ method syntax, no query expressions");
Check("sql-server", Severity.Fail, AnyApp(@"UseSqlServer\(|AddSqlDbContext(Pool)?<"), "EF Core on SQL Server");
Check("sql-token-auth", Severity.Warn, AnyApp(@"AddAccessTokenSupport|AddDefaultSqlTokenCredentials|Active Directory (Default|Workload Identity|Managed Identity)"), "Entra token auth to SQL (Fusion.Infrastructure.Database)");
Check("layout", Severity.Warn, appFiles.Any(f => f.Path.Contains("Controllers")) && appFiles.Any(f => f.Path.Contains("Domain")), "Controllers/ and Domain/ folders");

Check("tests-webapplicationfactory", Severity.Fail, testFiles.Any(f => f.Content.Contains("WebApplicationFactory")), "integration tests use WebApplicationFactory");
Check("tests-fusion-testing", Severity.Warn, AnyProject(@"Include=""Fusion\.Testing"), "Fusion.Testing packages");

if (caseFile is not null)
{
    foreach ((string id, string pattern) in ParseExpectations(File.ReadAllText(caseFile)))
    {
        string[] hits = Where(sources, pattern);
        Check($"case:{id}", Severity.Fail, hits.Length > 0, hits.Length > 0 ? string.Join(", ", hits.Take(5)) : $"pattern not found: {pattern}");
    }
}

int failed = results.Count(r => !r.Passed && r.Severity == Severity.Fail);
int warnings = results.Count(r => !r.Passed && r.Severity == Severity.Warn);
int passed = results.Count(r => r.Passed);

StringBuilder md = new();
md.AppendLine($"# Scorecard: {passed}/{results.Count} passed, {failed} failed, {warnings} warnings");
md.AppendLine();
md.AppendLine($"Workspace: `{workspace}`");
md.AppendLine();
md.AppendLine("| Check | Severity | Result | Detail |");
md.AppendLine("| --- | --- | --- | --- |");
foreach (CheckResult r in results)
{
    string status = r.Passed ? "pass" : (r.Severity == Severity.Fail ? "FAIL" : "warn");
    md.AppendLine($"| {r.Id} | {r.Severity} | {status} | {r.Detail.Replace("|", "\\|").ReplaceLineEndings(" ")} |");
}

Directory.CreateDirectory(outDir);
File.WriteAllText(Path.Combine(outDir, "scorecard.md"), md.ToString());
File.WriteAllText(Path.Combine(outDir, "scorecard.json"), JsonSerializer.Serialize(new { passed, failed, warnings, total = results.Count, results }, new JsonSerializerOptions { WriteIndented = true }));
Console.WriteLine(md.ToString());
return failed == 0 ? 0 : 1;

static (int Actions, int Documented, List<string> Missing) CountProducesResponseType(List<SourceFile> controllers)
{
    int actions = 0;
    int documented = 0;
    List<string> missing = [];
    foreach (SourceFile file in controllers)
    {
        string[] lines = file.Content.Split('\n');
        for (int i = 0; i < lines.Length; i++)
        {
            if (!Regex.IsMatch(lines[i], @"^\s*\[Http(Get|Post|Put|Patch|Delete|Options)\b"))
            {
                continue;
            }

            int start = i;
            while (start > 0 && IsAttributeOrComment(lines[start - 1]))
            {
                start--;
            }

            int end = i;
            while (end + 1 < lines.Length && IsAttributeOrComment(lines[end + 1]))
            {
                end++;
            }

            actions++;
            string block = string.Join('\n', lines[start..(end + 1)]);
            if (block.Contains("ProducesResponseType") || block.Contains("[Produces"))
            {
                documented++;
            }
            else
            {
                missing.Add($"{Path.GetFileName(file.Path)}:{i + 1}");
            }

            i = end;
        }
    }

    return (actions, documented, missing);
}

static bool IsAttributeOrComment(string line)
{
    string trimmed = line.TrimStart();
    return trimmed.StartsWith('[') || trimmed.StartsWith("///");
}

static IEnumerable<(string Id, string Pattern)> ParseExpectations(string caseContent)
{
    Match section = Regex.Match(caseContent, @"^## Expect\s*\n(?<body>[\s\S]*?)(?=^## |\z)", RegexOptions.Multiline);
    if (!section.Success)
    {
        yield break;
    }

    foreach (Match m in Regex.Matches(section.Groups["body"].Value, @"^-\s*(?<id>[\w-]+):\s*`(?<pattern>.+)`\s*$", RegexOptions.Multiline))
    {
        yield return (m.Groups["id"].Value, m.Groups["pattern"].Value);
    }
}

static (int ExitCode, string Output) Run(string file, string arguments, string workingDirectory)
{
    ProcessStartInfo info = new(file, arguments)
    {
        WorkingDirectory = workingDirectory,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
    };
    // `dotnet run` leaks MSBuild/host variables that break nested dotnet build/test runs.
    foreach (string key in info.Environment.Keys.Where(k => k.StartsWith("MSBuild", StringComparison.OrdinalIgnoreCase) || k.StartsWith("DOTNET_", StringComparison.Ordinal) && k != "DOTNET_ROOT").ToList())
    {
        info.Environment.Remove(key);
    }

    using Process process = Process.Start(info)!;
    Task<string> stdout = process.StandardOutput.ReadToEndAsync();
    Task<string> stderr = process.StandardError.ReadToEndAsync();
    if (!process.WaitForExit(TimeSpan.FromMinutes(10)))
    {
        process.Kill(entireProcessTree: true);
        return (-1, "timed out after 10 minutes");
    }

    return (process.ExitCode, stdout.Result + stderr.Result);
}

static string Tail(string text) => string.Join(" ", text.Split('\n', StringSplitOptions.RemoveEmptyEntries).TakeLast(5)).Trim();

static Dictionary<string, string> ParseArgs(string[] args)
{
    Dictionary<string, string> parsed = [];
    for (int i = 0; i < args.Length; i++)
    {
        if (!args[i].StartsWith("--"))
        {
            continue;
        }

        string key = args[i][2..];
        bool hasValue = i + 1 < args.Length && !args[i + 1].StartsWith("--");
        parsed[key] = hasValue ? args[++i] : "true";
    }

    return parsed;
}

enum Severity { Fail, Warn }

record SourceFile(string Path, string Content);

record CheckResult(string Id, Severity Severity, bool Passed, string Detail);
