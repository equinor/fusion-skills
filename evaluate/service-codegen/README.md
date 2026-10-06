# Service code-generation evaluation

Measures whether the backend profile (`apm/fusion-developer-services`: agent, instructions, and skills) makes Copilot CLI
generate Fusion backend code shaped like the reference apps (`fusion-pss-project-demand`, `fusion-pss-subsea-catalog`).
It checks the generated code only. App registrations, Radix, Roles, and databases are out of scope.

## How a run works

1. Creates `.tmp/eval/service-codegen/<timestamp>-<case>/run-<n>/workspace`, runs `git init`, and seeds it with
   `seed/` (empty API) or with a sibling repo path (`seed_repo` / `seed_path` front matter).
2. Copies the **working-tree** skills, agents, and instructions of the profile into `.github/` (resolving nested APM packages),
   so uncommitted skill changes are tested.
3. Runs `copilot --agent <agent> --allow-all-tools --no-ask-user --autopilot -p "<## User>"` inside the workspace.
   File access is limited to the workspace (no `--allow-all-paths`); shell commands are not sandboxed, so run in a
   container if that matters.
4. Runs `checks.cs` (`dotnet build`, `dotnet test`, and regex convention checks plus the case's `## Expect` patterns) and writes
   `scorecard.md` / `scorecard.json`.
5. With `--judge`, asks Copilot to score the workspace against `fusion-pss-project-demand/backend` using `judge.md`
   plus the case's `## Eval` rubric (`judge.md` in the run folder, ends with `TOTAL: n/50`).

## Usage

```bash
evaluate/service-codegen/run.sh evaluate/service-codegen/cases/service-new-api.md --runs 2 --model <model> --judge
```

Requirements: Copilot CLI (authenticated), .NET 10 SDK, access to the Fusion-Public NuGet feed, and the reference repos
cloned next to this repository (override with `REPOS_ROOT`). Use `COPILOT_BIN` to point at a specific Copilot CLI binary.

Calibrate the checks against a reference without running Copilot:

```bash
dotnet run evaluate/service-codegen/checks.cs -- --workspace ../fusion-pss-project-demand/backend --no-build
```

## Case files

`cases/*.md` with front matter (`agent`, optional `seed_repo`, `seed_path`) and sections:

- `## User`: the prompt sent to Copilot.
- `## Expect`: `- id: \`regex\`` lines; each must match at least one source file (fail if not).
- `## Eval`: extra rubric for the judge.

## Comparing runs

Run every case before and after a skill change with the same model and at least two runs per case (LLM variance), and
compare failed checks and judge totals. Record the numbers in the pull request body.
