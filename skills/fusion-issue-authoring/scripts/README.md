# Issue authoring helper scripts

These scripts are optional helpers for `fusion-issue-authoring` workflows.

## Safety invariants

- Read-only scripts never mutate GitHub state.
- Mutation scripts require explicit flags (`--yes`) and support `--dry-run`.
- All scripts validate required inputs and fail with actionable messages.
- Issue-type mutation scripts use GraphQL `updateIssue(issueTypeId: ...)` and surface explicit compatibility/permission errors.

## VS Code zsh strict mode note

- In VS Code integrated zsh terminals, `set -u` can conflict with shell integration hooks.
- Bash helpers keep strict-mode fail-fast behavior while guarding nounset in VS Code sessions.
- For ad-hoc interactive snippets in VS Code zsh, avoid `set -u` unless you explicitly guard prompt-hook variables.

## Template policy

- Always check the target repository templates in `.github/ISSUE_TEMPLATE/` first.
- Use specialist-local template assets only when no suitable repository template exists.
- When repository templates are missing or unclear, suggest a follow-up update in that repository.

## Scripts

- `list-issues.sh`: list issues for a repository with state/limit filters.
- `list-issues.ps1`: Windows PowerShell equivalent.
- `list-labels.sh`: list labels for a repository with limit filter.
- `list-labels.ps1`: Windows PowerShell equivalent.
- `search-duplicates.sh`: keyword search for potentially duplicate issues.
- `search-duplicates.ps1`: Windows PowerShell equivalent.
- `research-repo-content.sh`: gather issue-authoring context (labels, templates, recent issues).
- `research-repo-content.ps1`: Windows PowerShell equivalent.
- `set-issue-type.sh`: set issue type after explicit confirmation.
- `set-issue-type.ps1`: Windows PowerShell equivalent.
- `add-sub-issues.sh`: link one or many child issues to a parent issue (already-linked children are skipped).
- `add-sub-issues.ps1`: Windows PowerShell equivalent (already-linked children are skipped).
- `add-blocking-issues.sh`: link one or many blocking issues to a target issue (already-linked blockers are skipped).
- `add-blocking-issues.ps1`: Windows PowerShell equivalent (already-linked blockers are skipped).

All scripts are `gh`-only and have the same safety model (`--yes`/`-Yes` and `--dry-run`/`-DryRun`).

## Quick examples

```bash
# List open issues
./skills/fusion-issue-authoring/scripts/list-issues.sh --repo equinor/fusion-core-tasks --state open --limit 20

# List repository labels
./skills/fusion-issue-authoring/scripts/list-labels.sh --repo equinor/fusion-core-tasks --limit 100

# Search potential duplicates
./skills/fusion-issue-authoring/scripts/search-duplicates.sh --repo equinor/fusion-core-tasks --query "csv export"

# Research repo issue context
./skills/fusion-issue-authoring/scripts/research-repo-content.sh --repo equinor/fusion-core-tasks

# Set issue type (dry-run first)
./skills/fusion-issue-authoring/scripts/set-issue-type.sh --repo equinor/fusion-core-tasks --issue 391 --type "Feature" --dry-run
./skills/fusion-issue-authoring/scripts/set-issue-type.sh --repo equinor/fusion-core-tasks --issue 391 --type "Feature" --yes

# Verify issue type directly
gh api graphql -f query='query($owner: String!, $name: String!, $number: Int!) { repository(owner: $owner, name: $name) { issue(number: $number) { number url issueType { name } } } }' -F owner=equinor -F name=fusion-core-tasks -F number=391 --jq '.data.repository.issue'

# Link one child issue
./skills/fusion-issue-authoring/scripts/add-sub-issues.sh --repo equinor/fusion-core-tasks --parent 362 --children 391 --dry-run

# Link many child issues
./skills/fusion-issue-authoring/scripts/add-sub-issues.sh --repo equinor/fusion-core-tasks --parent 362 --children 391,392,393 --yes

# Add blocking issue relationships (dry-run first)
./skills/fusion-issue-authoring/scripts/add-blocking-issues.sh --repo equinor/fusion-core-tasks --issue 394 --blocking 391 --dry-run
./skills/fusion-issue-authoring/scripts/add-blocking-issues.sh --repo equinor/fusion-core-tasks --issue 394 --blocking 391 --yes

# Windows PowerShell examples
pwsh ./skills/fusion-issue-authoring/scripts/list-issues.ps1 -Repo equinor/fusion-core-tasks -State open -Limit 20
pwsh ./skills/fusion-issue-authoring/scripts/list-labels.ps1 -Repo equinor/fusion-core-tasks -Limit 100
pwsh ./skills/fusion-issue-authoring/scripts/search-duplicates.ps1 -Repo equinor/fusion-core-tasks -Query "csv export"
pwsh ./skills/fusion-issue-authoring/scripts/research-repo-content.ps1 -Repo equinor/fusion-core-tasks
pwsh ./skills/fusion-issue-authoring/scripts/set-issue-type.ps1 -Repo equinor/fusion-core-tasks -Issue 391 -Type Feature -DryRun
pwsh ./skills/fusion-issue-authoring/scripts/set-issue-type.ps1 -Repo equinor/fusion-core-tasks -Issue 391 -Type Feature -Yes
pwsh ./skills/fusion-issue-authoring/scripts/add-sub-issues.ps1 -Repo equinor/fusion-core-tasks -Parent 362 -Children 391,392,393 -DryRun
pwsh ./skills/fusion-issue-authoring/scripts/add-blocking-issues.ps1 -Repo equinor/fusion-core-tasks -Issue 394 -Blocking 391 -DryRun
```