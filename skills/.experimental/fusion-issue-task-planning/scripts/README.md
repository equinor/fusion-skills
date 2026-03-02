# GraphQL fallback queries

These GraphQL documents are fallback helpers for environments where GitHub MCP write tools are unavailable or incomplete for parent/sub-issue operations.

## Files

- `issue_lookup.graphql`: fetch issue id/type/parent/labels by issue number.
- `issue_types_list.graphql`: list organization issue types and ids.
- `issue_type_update.graphql`: set issue type by ids.
- `sub_issue_write.graphql`: add child issue to parent issue.
- `sub_issue_remove.graphql`: remove child issue from parent issue.
- `sub_issue_reprioritize.graphql`: reprioritize child issue order.
- `linkage_verify.graphql`: verify parent/child linkage and child type.

## Usage examples

Run from repository root.

### 1) Lookup parent/child issue ids

```bash
GH_PAGER=cat gh api graphql \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/scripts/issue_lookup.graphql)" \
  -F owner=equinor \
  -F repo=fusion-core-tasks \
  -F number=410
```

### 2) List issue types (find `Task` id)

```bash
GH_PAGER=cat gh api graphql \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/scripts/issue_types_list.graphql)" \
  -F owner=equinor
```

### 3) Set issue type on child issue

```bash
GH_PAGER=cat gh api graphql \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/scripts/issue_type_update.graphql)" \
  -F id='<child-issue-node-id>' \
  -F issueTypeId='<task-issue-type-node-id>'
```

### 4) Link child to parent

```bash
GH_PAGER=cat gh api graphql \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/scripts/sub_issue_write.graphql)" \
  -F issueId='<parent-issue-node-id>' \
  -F subIssueId='<child-issue-node-id>'
```

### 5) Verify linkage

```bash
GH_PAGER=cat gh api graphql \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/scripts/linkage_verify.graphql)" \
  -F owner=equinor \
  -F repo=fusion-core-tasks \
  -F parentNumber=410 \
  -F childNumber=441
```

## Notes

- `subIssueId` expects the child issue node id, not issue number.
- Prefer MCP tools first when available; use these GraphQL files as explicit fallback.
