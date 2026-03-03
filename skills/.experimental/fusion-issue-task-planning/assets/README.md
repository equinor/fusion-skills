# GraphQL fallback queries

These GraphQL documents are fallback helpers for environments where GitHub MCP write tools are unavailable or incomplete for parent/sub-issue operations.

## Files

- `graphql/issue_lookup.github.graphql`: fetch issue id/type/parent/labels by issue number.
- `graphql/issue_types_list.github.graphql`: list organization issue types and ids.
- `graphql/issue_type_update.github.graphql`: set issue type by ids.
- `graphql/sub_issue_write.github.graphql`: add child issue to parent issue.
- `graphql/sub_issue_remove.github.graphql`: remove child issue from parent issue.
- `graphql/sub_issue_reprioritize.github.graphql`: reprioritize child issue order.
- `graphql/linkage_verify.github.graphql`: verify parent/child linkage and child type.

## Usage examples

Run from repository root.

### 1) Lookup parent/child issue ids

```bash
GH_PAGER=cat gh api graphql \
  -H "GraphQL-Features: issue_types,sub_issues" \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/assets/graphql/issue_lookup.github.graphql)" \
  -F owner=equinor \
  -F repo=fusion-core-tasks \
  -F number=410
```

### 2) List issue types (find `Task` id)

```bash
GH_PAGER=cat gh api graphql \
  -H "GraphQL-Features: issue_types,sub_issues" \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/assets/graphql/issue_types_list.github.graphql)" \
  -F owner=equinor
```

### 3) Set issue type on child issue

```bash
GH_PAGER=cat gh api graphql \
  -H "GraphQL-Features: issue_types,sub_issues" \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/assets/graphql/issue_type_update.github.graphql)" \
  -F id='<child-issue-node-id>' \
  -F issueTypeId='<task-issue-type-node-id>'
```

### 4) Link child to parent

```bash
GH_PAGER=cat gh api graphql \
  -H "GraphQL-Features: issue_types,sub_issues" \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/assets/graphql/sub_issue_write.github.graphql)" \
  -F issueId='<parent-issue-node-id>' \
  -F subIssueId='<child-issue-node-id>'
```

### 5) Verify linkage

```bash
GH_PAGER=cat gh api graphql \
  -H "GraphQL-Features: issue_types,sub_issues" \
  -f query="$(cat skills/.experimental/fusion-issue-task-planning/assets/graphql/linkage_verify.github.graphql)" \
  -F owner=equinor \
  -F repo=fusion-core-tasks \
  -F parentNumber=410 \
  -F childNumber=441
```

## Notes

- `subIssueId` expects the child issue node id, not issue number.
- Use `-H "GraphQL-Features: issue_types,sub_issues"` for these operations to ensure feature-gated fields are available.
- Prefer MCP tools first when available; use these GraphQL files as explicit fallback.
