# GraphQL fallback queries

These GraphQL documents are fallback helpers for environments where GitHub MCP write tools are unavailable or incomplete for parent/sub-issue and issue-type operations.

## Files

- `issue_lookup.github.graphql`: fetch issue id/type/parent/labels by issue number.
- `issue_types_list.github.graphql`: list organization issue types and ids.
- `issue_type_update.github.graphql`: set issue type by ids.
- `sub_issue_write.github.graphql`: add child issue to parent issue.
- `sub_issue_remove.github.graphql`: remove child issue from parent issue.
- `sub_issue_reprioritize.github.graphql`: reprioritize child issue order.
- `linkage_verify.github.graphql`: verify parent/child linkage and child type.

## Usage note

When running these files via `gh api graphql`, include:

- `-H "GraphQL-Features: issue_types,sub_issues"`

without this header, issue type and sub-issue fields may fail schema validation.

Prefer MCP tools first when available; use these files as explicit fallback.
