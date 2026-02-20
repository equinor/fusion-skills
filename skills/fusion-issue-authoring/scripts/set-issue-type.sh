#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: set-issue-type.sh --repo owner/repo --issue NUMBER --type "Feature|User Story|Task|Bug" [--yes] [--dry-run]

Sets issue type using GitHub API.
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

if ! [[ "$issue" =~ ^[0-9]+$ ]]; then
  echo "Invalid --issue '$issue'. Use a positive integer." >&2
  exit 1
fi

if ! [[ "$type" =~ ^(Feature|User\ Story|Task|Bug)$ ]]; then
  echo "Invalid --type '$type'. Use one of: Feature, User Story, Task, Bug." >&2
  exit 1
fi

endpoint="repos/$repo/issues/$issue"
cmd=(gh api "$endpoint" --method PATCH --field "type=$type")

if [[ "$dry_run" == "true" ]]; then
  echo "DRY RUN: ${cmd[*]}"
  exit 0
fi

if [[ "$confirm" != "true" ]]; then
  echo "Refusing to mutate GitHub state without --yes."
  echo "Tip: run with --dry-run first."
  exit 1
fi

if ! response=$("${cmd[@]}" 2>&1); then
  echo "Failed to set issue type for #$issue in $repo." >&2
  echo "This repository/API combination may not support issue type mutation via this endpoint, or your token lacks permissions." >&2
  echo "Original error: $response" >&2
  exit 1
fi

gh api "$endpoint" --jq '{number, title, url: .html_url, type: .type}'