#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: list-issues.sh --repo owner/repo [--state open|closed|all] [--limit N]

Lists issues with number, state, title, labels, and update timestamp.
EOF
}

repo=""
state="open"
limit="20"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
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

if ! [[ "$state" =~ ^(open|closed|all)$ ]]; then
  echo "Invalid --state '$state'. Use open|closed|all." >&2
  exit 1
fi

if ! [[ "$limit" =~ ^[0-9]+$ ]] || [[ "$limit" -lt 1 ]] || [[ "$limit" -gt 200 ]]; then
  echo "Invalid --limit '$limit'. Use integer 1..200." >&2
  exit 1
fi

gh issue list \
  --repo "$repo" \
  --state "$state" \
  --limit "$limit" \
  --json number,title,state,updatedAt,labels,author,url \
  --jq '.[] | "#\(.number) [\(.state)] \(.title) | labels=\(.labels | map(.name) | join(",")) | updated=\(.updatedAt) | author=\(.author.login) | \(.url)"'