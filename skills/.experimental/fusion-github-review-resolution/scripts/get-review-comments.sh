#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh \
    --owner <owner> --repo <repo> --pr <number> --review-id <number> [--include-resolved] [--include-outdated]

Description:
  Lists review-thread comments for a specific PR review id, including any sub-comments
  that are associated with that review id. Default output is unresolved + non-outdated
  threads only.
  Note: Uses GraphQL queries limited to the first 100 review threads and first 100
  comments per thread; results may be incomplete on very large pull requests.

Examples:
  skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh \
    --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674

  skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh \
    --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --include-outdated
EOF
}

OWNER=""
REPO=""
PR_NUMBER=""
REVIEW_ID=""
INCLUDE_RESOLVED="false"
INCLUDE_OUTDATED="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner)
      OWNER="${2:-}"
      shift 2
      ;;
    --repo)
      REPO="${2:-}"
      shift 2
      ;;
    --pr)
      PR_NUMBER="${2:-}"
      shift 2
      ;;
    --review-id)
      REVIEW_ID="${2:-}"
      shift 2
      ;;
    --include-resolved)
      INCLUDE_RESOLVED="true"
      shift
      ;;
    --include-outdated)
      INCLUDE_OUTDATED="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$OWNER" || -z "$REPO" || -z "$PR_NUMBER" || -z "$REVIEW_ID" ]]; then
  echo "ERROR: Missing required arguments." >&2
  usage
  exit 1
fi

if ! [[ "$PR_NUMBER" =~ ^[1-9][0-9]*$ ]]; then
  echo "ERROR: --pr must be a positive integer." >&2
  exit 1
fi

if ! [[ "$REVIEW_ID" =~ ^[1-9][0-9]*$ ]]; then
  echo "ERROR: --review-id must be a positive integer." >&2
  exit 1
fi

QUERY='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{id isResolved isOutdated path line comments(first:100){nodes{databaseId body url author{login}createdAt pullRequestReview{databaseId state author{login}}}}}}}}}'

JSON_OUTPUT="$({
  GH_PAGER=cat gh api graphql \
    -f "query=$QUERY" \
    -F "owner=$OWNER" \
    -F "repo=$REPO" \
    -F "number=$PR_NUMBER"
} )"

if [[ -z "$JSON_OUTPUT" ]]; then
  echo "ERROR: Empty response from GitHub API." >&2
  exit 1
fi

printf '%s\n' "$JSON_OUTPUT" | jq \
  --argjson reviewId "$REVIEW_ID" \
  --arg includeResolved "$INCLUDE_RESOLVED" \
  --arg includeOutdated "$INCLUDE_OUTDATED" '
    .data.repository.pullRequest.reviewThreads.nodes
    | map(
        . as $thread
        | {
            threadId: $thread.id,
            isResolved: $thread.isResolved,
            isOutdated: $thread.isOutdated,
            path: $thread.path,
            line: $thread.line,
            comments: (
              $thread.comments.nodes
              | map(select(.pullRequestReview.databaseId == $reviewId))
            )
          }
        | select(.comments | length > 0)
        | if $includeResolved == "true" then . else select(.isResolved == false) end
        | if $includeOutdated == "true" then . else select(.isOutdated == false) end
      )
    | if length == 0 then
        { summary: "No matching review comments found for the requested filters." }
      else
        {
          summary: ("Found " + (length|tostring) + " matching thread(s)."),
          threads: .
        }
      end
  '
