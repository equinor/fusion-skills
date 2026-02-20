#!/usr/bin/env bash

set -eo pipefail

# VS Code integrated zsh shell hooks can touch unset prompt vars when nounset is on.
if [[ -z "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
  set -u
fi

usage() {
  cat <<'EOF'
Usage: list-labels.sh --repo owner/repo [--limit N]

Lists repository labels with name, color, and description.
EOF
}

repo=""
limit="100"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
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

if ! [[ "$limit" =~ ^[0-9]+$ ]] || [[ "$limit" -lt 1 ]] || [[ "$limit" -gt 1000 ]]; then
  echo "Invalid --limit '$limit'. Use integer 1..1000." >&2
  exit 1
fi

gh label list --repo "$repo" --limit "$limit" --json name,description,color \
  --jq '.[] | "\(.name) | color=\(.color) | \(.description // "")"'
