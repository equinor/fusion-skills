#!/usr/bin/env bash

set -eo pipefail

# VS Code integrated zsh shell hooks can touch unset prompt vars when nounset is on.
if [[ -z "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
  set -u
fi

usage() {
  cat <<'EOF'
Usage: research-repo-content.sh --repo owner/repo [--issue-limit N]

Collects issue-authoring context from a repo:
- repo metadata
- labels (first 100)
- issue templates (if present)
- recent open issues
EOF
}

repo=""
issue_limit="10"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="${2:-}"
      shift 2
      ;;
    --issue-limit)
      issue_limit="${2:-}"
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

if ! [[ "$issue_limit" =~ ^[0-9]+$ ]] || [[ "$issue_limit" -lt 1 ]] || [[ "$issue_limit" -gt 100 ]]; then
  echo "Invalid --issue-limit '$issue_limit'. Use integer 1..100." >&2
  exit 1
fi

echo "== Repository =="
gh repo view "$repo" --json nameWithOwner,description,defaultBranchRef,url,isPrivate \
  --jq '{repo: .nameWithOwner, private: .isPrivate, defaultBranch: .defaultBranchRef.name, url: .url, description: .description}'

echo
echo "== Labels (first 100) =="
gh label list --repo "$repo" --limit 100 --json name,description,color \
  --jq '.[] | "\(.name) | color=\(.color) | \(.description // "")"'

echo
echo "== Issue templates =="
if gh api "repos/$repo/contents/.github/ISSUE_TEMPLATE" >/dev/null 2>&1; then
  gh api "repos/$repo/contents/.github/ISSUE_TEMPLATE" \
    --jq '.[] | "\(.name) | \(.path)"'
else
  echo "No .github/ISSUE_TEMPLATE directory found"
fi

echo
echo "== Recent open issues =="
gh issue list --repo "$repo" --state open --limit "$issue_limit" \
  --json number,title,labels,url,updatedAt \
  --jq '.[] | "#\(.number) \(.title) | labels=\(.labels | map(.name) | join(",")) | updated=\(.updatedAt) | \(.url)"'