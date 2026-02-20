#!/usr/bin/env bash

set -eo pipefail

# VS Code integrated zsh shell hooks can touch unset prompt vars when nounset is on.
# Keep fail-fast behavior while guarding nounset in that environment.
if [[ -z "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
  set -u
fi

usage() {
  cat <<'EOF'
Usage: set-issue-type.sh --repo owner/repo --issue NUMBER --type "Feature|User Story|Task|Bug" [--yes] [--dry-run]

Sets issue type using GitHub GraphQL API (updateIssue + issueTypeId).
Safety: requires --yes unless --dry-run is used.
EOF
}

repo=""
issue=""
type=""
confirm="false"
dry_run="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
      shift 2
      ;;
    --issue)
      issue="${2:-}"
      shift 2
      ;;
    --type)
      type="${2:-}"
      shift 2
      ;;
    --yes)
      confirm="true"
      shift
      ;;
    --dry-run)
      dry_run="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$repo" || -z "$issue" || -z "$type" ]]; then
  echo "Missing required arguments." >&2
  usage
  exit 1
fi

if ! [[ "$repo" =~ ^[^/]+/[^/]+$ ]]; then
  echo "Invalid --repo '$repo'. Use owner/repo." >&2
  exit 1
fi

if ! [[ "$issue" =~ ^[0-9]+$ ]]; then
  echo "Invalid --issue '$issue'. Use a positive integer." >&2
  exit 1
fi

if ! [[ "$type" =~ ^(Feature|User\ Story|Task|Bug)$ ]]; then
  echo "Invalid --type '$type'. Use one of: Feature, User Story, Task, Bug." >&2
  exit 1
fi

owner="${repo%%/*}"
name="${repo##*/}"

read_query='query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      id
      number
      title
      url
    }
    issueTypes(first: 100) {
      nodes {
        id
        name
      }
    }
  }
}'

update_mutation='mutation($issueId: ID!, $issueTypeId: ID!) {
  updateIssue(input: {id: $issueId, issueTypeId: $issueTypeId}) {
    issue {
      number
      title
      url
      issueType {
        name
      }
    }
  }
}'

verify_query='query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      number
      title
      url
      issueType {
        name
      }
    }
  }
}'

lookup_cmd=(gh api graphql -f query="$read_query" -F owner="$owner" -F name="$name" -F number="$issue")
mutate_cmd=(gh api graphql -f query="$update_mutation")

if [[ "$dry_run" == "true" ]]; then
  echo "DRY RUN: ${lookup_cmd[*]}"
  echo "DRY RUN: ${mutate_cmd[*]} -F issueId=<issue-node-id> -F issueTypeId=<issue-type-node-id>"
  echo "DRY RUN: gh api graphql -f query='<verify-query>' -F owner=$owner -F name=$name -F number=$issue"
  exit 0
fi

if [[ "$confirm" != "true" ]]; then
  echo "Refusing to mutate GitHub state without --yes."
  echo "Tip: run with --dry-run first."
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "This script requires 'jq' to be installed to process GitHub API responses." >&2
  exit 1
fi

if ! issue_payload=$("${lookup_cmd[@]}" 2>&1); then
  echo "Failed to read issue metadata for #$issue in $repo." >&2
  echo "Original error: $issue_payload" >&2
  exit 1
fi

issue_id=$(printf '%s\n' "$issue_payload" | jq -r '.data.repository.issue.id // empty')

if [[ -z "$issue_id" ]]; then
  echo "Issue #$issue was not found in $repo, or issue metadata is unavailable." >&2
  exit 1
fi

issue_type_id=$(printf '%s\n' "$issue_payload" | jq -r --arg type "$type" '.data.repository.issueTypes.nodes[] | select(.name == $type) | .id' | head -n 1)
if [[ -z "$issue_type_id" ]]; then
  available_types=$(printf '%s\n' "$issue_payload" | jq -r '.data.repository.issueTypes.nodes[].name' | paste -sd ', ' -)
  echo "Issue type '$type' is not available in $repo." >&2
  if [[ -n "$available_types" ]]; then
    echo "Available issue types: $available_types" >&2
  fi
  exit 1
fi

if ! response=$(gh api graphql -f query="$update_mutation" -F issueId="$issue_id" -F issueTypeId="$issue_type_id" 2>&1); then
  echo "Failed to set issue type for #$issue in $repo." >&2
  echo "GraphQL updateIssue failed. Repository configuration or token permissions may block issue type updates." >&2
  echo "Original error: $response" >&2
  exit 1
fi

gh api graphql -f query="$verify_query" -F owner="$owner" -F name="$name" -F number="$issue" \
  --jq '{number: .data.repository.issue.number, title: .data.repository.issue.title, url: .data.repository.issue.url, issueType: (.data.repository.issue.issueType.name // "(unset)")}'