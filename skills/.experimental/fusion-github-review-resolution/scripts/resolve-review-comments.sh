#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh \
    --owner <owner> --repo <repo> --pr <number> --review-id <number> \
    [--message <text> | --message-file <path>] [--apply] [--include-resolved] [--include-outdated]

Description:
  Resolves matching review threads for a given pull request review id.
  Note: Uses GraphQL queries limited to the first 100 review threads and first 100
  comments per thread; results may be incomplete on very large pull requests.

Safety:
  - Default mode is dry-run and performs no GitHub mutations.
  - --apply is required to post replies and resolve threads.
  - --message or --message-file is required with --apply.

Examples:
  Dry-run:
    skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh \
      --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --include-resolved

  Apply:
    skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh \
      --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 \
      --apply --message "Addressed in <commit>: <what changed>."
EOF
}

OWNER=""
REPO=""
PR_NUMBER=""
REVIEW_ID=""
MESSAGE=""
APPLY="false"
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
    --message)
      MESSAGE="${2:-}"
      shift 2
      ;;
    --message-file)
      MESSAGE_FILE="${2:-}"
      if [[ -z "$MESSAGE_FILE" ]]; then
        echo "ERROR: --message-file requires a path argument" >&2
        exit 1
      fi
      if [[ ! -r "$MESSAGE_FILE" ]]; then
        echo "ERROR: Message file '$MESSAGE_FILE' does not exist or is not readable" >&2
        exit 1
      fi
      MESSAGE="$(cat "$MESSAGE_FILE")"
      shift 2
      ;;
    --apply)
      APPLY="true"
      shift
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

if [[ "$APPLY" == "true" && -z "${MESSAGE// }" ]]; then
  echo "ERROR: --message or --message-file is required when --apply is set." >&2
  exit 1
fi

QUERY='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{id isResolved isOutdated path line comments(first:100){nodes{databaseId url body pullRequestReview{databaseId}}}}}}}}'

JSON_OUTPUT="$({
  GH_PAGER=cat gh api graphql \
    -f "query=$QUERY" \
    -F "owner=$OWNER" \
    -F "repo=$REPO" \
    -F "number=$PR_NUMBER"
} )"

TARGETS_JSON="$(printf '%s\n' "$JSON_OUTPUT" | jq -c \
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
            path: ($thread.path // "<unknown>"),
            line: $thread.line,
            commentIds: (
              $thread.comments.nodes
              | map(select(.pullRequestReview.databaseId == $reviewId) | .databaseId)
            )
          }
        | select(.commentIds | length > 0)
        | if $includeResolved == "true" then . else select(.isResolved == false) end
        | if $includeOutdated == "true" then . else select(.isOutdated == false) end
      )
  ')"

TARGET_COUNT="$(printf '%s\n' "$TARGETS_JSON" | jq 'length')"
if [[ "$TARGET_COUNT" == "0" ]]; then
  echo "No matching review threads found for review $REVIEW_ID with current filters."
  exit 0
fi

echo "Found $TARGET_COUNT matching thread(s):"
printf '%s\n' "$TARGETS_JSON" | jq -r '
  to_entries[]
  | "\(.key + 1). \(.value.threadId) \(.value.path)\(if .value.line then ":\(.value.line)" else "" end) comments=\(.value.commentIds|join(","))\(if .value.isResolved then " [resolved]" else "" end)\(if .value.isOutdated then " [outdated]" else "" end)"
'

if [[ "$APPLY" != "true" ]]; then
  echo "Dry-run only. Re-run with --apply to post replies and resolve threads."
  exit 0
fi

while IFS= read -r row; do
  THREAD_ID="$(printf '%s\n' "$row" | jq -r '.threadId')"
  REPLY_TO_COMMENT_ID="$(printf '%s\n' "$row" | jq -r '.commentIds[-1]')"

  GH_PAGER=cat gh api -X POST "repos/$OWNER/$REPO/pulls/$PR_NUMBER/comments" \
    -F "in_reply_to=$REPLY_TO_COMMENT_ID" \
    -f "body=$MESSAGE" >/dev/null

  GH_PAGER=cat gh api graphql \
    -f 'query=mutation($threadId:ID!){resolveReviewThread(input:{threadId:$threadId}){thread{id isResolved}}}' \
    -F "threadId=$THREAD_ID" >/dev/null

  echo "Resolved thread $THREAD_ID (reply comment target $REPLY_TO_COMMENT_ID)."
done < <(printf '%s\n' "$TARGETS_JSON" | jq -c '.[]')

echo "Completed: resolved $TARGET_COUNT thread(s)."
