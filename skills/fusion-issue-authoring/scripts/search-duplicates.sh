#!/usr/bin/env bash

set -eo pipefail

# VS Code integrated zsh shell hooks can touch unset prompt vars when nounset is on.
if [[ -z "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
  set -u
fi

usage() {
  cat <<'EOF'
Usage: search-duplicates.sh --repo owner/repo --query "keywords" [--state open|closed|all] [--limit N]

Searches issues by keyword to detect potential duplicates.
EOF
}

repo=""
query=""
state="all"
limit="20"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
      shift 2
      ;;
    --query)
      query="${2:-}"
      shift 2
      ;;
    --state)
      state="${2:-}"
      shift 2
      ;;
    --limit)
      limit="${2:-}"
      shift 2
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

if [[ -z "$repo" ]]; then
  echo "Missing required --repo owner/repo" >&2
  exit 1
fi

if [[ -z "$query" ]]; then
  echo "Missing required --query \"keywords\"" >&2
  exit 1
fi

if ! [[ "$state" =~ ^(open|closed|all)$ ]]; then
  echo "Invalid --state '$state'. Use open|closed|all." >&2
  exit 1
fi

if ! [[ "$limit" =~ ^[0-9]+$ ]] || [[ "$limit" -lt 1 ]] || [[ "$limit" -gt 200 ]]; then
  echo "Invalid --limit '$limit'. Use integer 1..200." >&2
  exit 1
fi

gh search issues \
  --repo "$repo" \
  --state "$state" \
  --limit "$limit" \
  "$query" \
  --json number,title,state,updatedAt,labels,repository,url \
  --jq '.[] | "#\(.number) [\(.state)] \(.title) | labels=\(.labels | map(.name) | join(",")) | updated=\(.updatedAt) | \(.repository.owner.login)/\(.repository.name) | \(.url)"'