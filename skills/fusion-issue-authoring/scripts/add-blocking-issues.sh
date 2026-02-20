#!/usr/bin/env bash

set -eo pipefail

# VS Code integrated zsh shell hooks can touch unset prompt vars when nounset is on.
if [[ -z "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
  set -u
fi

usage() {
  cat <<'EOF'
Usage: add-blocking-issues.sh --repo owner/repo --issue NUMBER --blocking N[,N2,...] [--yes] [--dry-run]

Links one or many blocking issues to a target issue using GraphQL addBlockedBy.
Safety: requires --yes unless --dry-run is used.
EOF
}

repo=""
issue=""
blocking_csv=""
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
    --blocking)
      blocking_csv="${2:-}"
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

if [[ -z "$repo" || -z "$issue" || -z "$blocking_csv" ]]; then
  echo "Missing required arguments." >&2
  usage
  exit 1
fi

if ! [[ "$issue" =~ ^[0-9]+$ ]]; then
  echo "Invalid --issue '$issue'. Use a positive integer." >&2
  exit 1
fi

IFS=',' read -r -a blocking_issues <<< "$blocking_csv"
if [[ "${#blocking_issues[@]}" -eq 0 ]]; then
  echo "No blocking issues provided in --blocking." >&2
  exit 1
fi

for blocking in "${blocking_issues[@]}"; do
  if ! [[ "$blocking" =~ ^[0-9]+$ ]]; then
    echo "Invalid blocking issue '$blocking'. Use comma-separated integers, e.g. 391,392,393." >&2
    exit 1
  fi
done

if [[ "$dry_run" == "true" ]]; then
  echo "DRY RUN: would link blocking issues (${blocking_csv}) to issue #$issue in $repo"
  exit 0
fi

if [[ "$confirm" != "true" ]]; then
  echo "Refusing to mutate GitHub state without --yes."
  echo "Tip: run with --dry-run first."
  exit 1
fi

issue_id=$(gh api "repos/$repo/issues/$issue" --jq .node_id)
mutation='mutation($issueId:ID!,$blockingIssueId:ID!){addBlockedBy(input:{issueId:$issueId,blockingIssueId:$blockingIssueId}){issue{url}}}'

for blocking in "${blocking_issues[@]}"; do
  blocking_id=$(gh api "repos/$repo/issues/$blocking" --jq .node_id)
  set +e
  output=$(gh api graphql -f query="$mutation" -f issueId="$issue_id" -f blockingIssueId="$blocking_id" 2>&1)
  status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    echo "Linked blocking issue #$blocking -> issue #$issue"
    continue
  fi

  if grep -Eiq "already|duplicate|exists" <<< "$output"; then
    echo "Skipped blocking issue #$blocking (already linked to #$issue)"
    continue
  fi

  if [[ $status -ne 0 ]]; then
    echo "Failed to add blocking issue #$blocking -> issue #$issue." >&2
    echo "This repository/API combination may not support issue dependency mutation, or your token lacks permissions." >&2
    echo "$output" >&2
    exit 1
  fi
done
