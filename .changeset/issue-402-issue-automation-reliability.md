---
"fusion-issue-authoring": patch
---

Improve issue automation reliability in `fusion-issue-authoring`:

- switch issue-type updates to GraphQL `updateIssue(issueTypeId: ...)` in shell and PowerShell helpers
- add explicit post-update verification output for issue type
- guard `set -u` in VS Code integrated zsh sessions to avoid shell integration hook failures
- update runbook/docs snippets to use the robust pattern and verification command

resolves: equinor/fusion-core-tasks#402
