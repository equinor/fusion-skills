#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: add-sub-issues.sh --repo owner/repo --parent NUMBER --children N[,N2,...] [--yes] [--dry-run]

Links one or many child issues to a parent issue using GraphQL addSubIssue.
Safety: requires --yes unless --dry-run is used.
EOF
}

repo=""
parent=""
children_csv=""
confirm="false"
dry_run="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
      shift 2
      ;;
    --parent)
      parent="${2:-}"
      shift 2
      ;;
    --children)
      children_csv="${2:-}"
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

if [[ -z "$repo" || -z "$parent" || -z "$children_csv" ]]; then
  echo "Missing required arguments." >&2
  usage
  exit 1
fi

if ! [[ "$parent" =~ ^[0-9]+$ ]]; then
  echo "Invalid --parent '$parent'. Use a positive integer." >&2
  exit 1
fi

IFS=',' read -r -a children <<< "$children_csv"
if [[ "${#children[@]}" -eq 0 ]]; then
  echo "No child issues provided in --children." >&2
  exit 1
fi

for child in "${children[@]}"; do
  if ! [[ "$child" =~ ^[0-9]+$ ]]; then
    echo "Invalid child issue '$child'. Use comma-separated integers, e.g. 391,392,393." >&2
    exit 1
  fi
done

if [[ "$dry_run" == "true" ]]; then
  echo "DRY RUN: would link children (${children_csv}) to parent #$parent in $repo"
  exit 0
fi

if [[ "$confirm" != "true" ]]; then
  echo "Refusing to mutate GitHub state without --yes."
  echo "Tip: run with --dry-run first."
  exit 1
fi

parent_id=$(gh api "repos/$repo/issues/$parent" --jq .node_id)
mutation='mutation($issueId:ID!,$subIssueId:ID!){addSubIssue(input:{issueId:$issueId,subIssueId:$subIssueId}){issue{url}}}'

for child in "${children[@]}"; do
  child_id=$(gh api "repos/$repo/issues/$child" --jq .node_id)
  set +e
  output=$(gh api graphql -f query="$mutation" -f issueId="$parent_id" -f subIssueId="$child_id" 2>&1)
  status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    echo "Linked child #$child -> parent #$parent"
    continue
  fi

  if grep -Eiq "already|duplicate|exists" <<< "$output"; then
    echo "Skipped child #$child (already linked to #$parent)"
    continue
  fi

  echo "$output" >&2
  exit $status
done