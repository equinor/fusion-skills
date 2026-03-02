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
MESSAGE_FROM_INLINE="false"
MESSAGE_FROM_FILE="false"

require_command() {
  local name="$1"
  local hint="$2"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "ERROR: '$name' is required. $hint" >&2
    exit 1
  fi
}

require_arg() {
  local flag="$1"
  local value="$2"
  local hint="$3"
  if [[ -z "$value" || "$value" == -* ]]; then
    echo "ERROR: $flag requires $hint." >&2
    usage
    exit 1
  fi
}

validate_owner() {
  local value="$1"
  if ! [[ "$value" =~ ^[A-Za-z0-9]([A-Za-z0-9-]{0,37}[A-Za-z0-9])?$ ]]; then
    echo "ERROR: --owner must match GitHub owner naming rules (1-39 chars, alphanumeric or single hyphens, no leading/trailing hyphen)." >&2
    exit 1
  fi
  if [[ "$value" =~ -- ]]; then
    echo "ERROR: --owner cannot contain consecutive hyphens." >&2
    exit 1
  fi
}

validate_repo() {
  local value="$1"
  if ! [[ "$value" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "ERROR: --repo must contain only letters, numbers, dots, underscores, or hyphens." >&2
    exit 1
  fi
  if (( ${#value} > 100 )); then
    echo "ERROR: --repo must be 100 characters or fewer." >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner)
      require_arg "--owner" "${2:-}" "an owner value"
      OWNER="$2"
      shift 2
      ;;
    --repo)
      require_arg "--repo" "${2:-}" "a repository value"
      REPO="$2"
      shift 2
      ;;
    --pr)
      require_arg "--pr" "${2:-}" "a pull request number"
      PR_NUMBER="$2"
      shift 2
      ;;
    --review-id)
      require_arg "--review-id" "${2:-}" "a review id value"
      REVIEW_ID="$2"
      shift 2
      ;;
    --message)
      require_arg "--message" "${2:-}" "a message value"
      MESSAGE="$2"
      MESSAGE_FROM_INLINE="true"
      shift 2
      ;;
    --message-file)
      require_arg "--message-file" "${2:-}" "a path argument"
      MESSAGE_FILE="$2"
      if [[ ! -r "$MESSAGE_FILE" ]]; then
        echo "ERROR: Message file '$MESSAGE_FILE' does not exist or is not readable" >&2
        exit 1
      fi
      MESSAGE="$(cat "$MESSAGE_FILE")"
      MESSAGE_FROM_FILE="true"
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

validate_owner "$OWNER"
validate_repo "$REPO"

if ! [[ "$PR_NUMBER" =~ ^[1-9][0-9]*$ ]]; then
  echo "ERROR: --pr must be a positive integer." >&2
  exit 1
fi

if ! [[ "$REVIEW_ID" =~ ^[1-9][0-9]*$ ]]; then
  echo "ERROR: --review-id must be a positive integer." >&2
  exit 1
fi

if [[ "$MESSAGE_FROM_INLINE" == "true" && "$MESSAGE_FROM_FILE" == "true" ]]; then
  echo "ERROR: Use only one of --message or --message-file." >&2
  exit 1
fi

if [[ "$APPLY" == "true" && ! "$MESSAGE" =~ [^[:space:]] ]]; then
  echo "ERROR: --message or --message-file is required when --apply is set." >&2
  exit 1
fi

require_command "gh" "Install GitHub CLI and authenticate with 'gh auth login'."
require_command "jq" "Install jq to parse JSON output."
if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI is not authenticated. Run 'gh auth login'." >&2
  exit 1
fi

# shellcheck disable=SC2016
QUERY='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{id isResolved isOutdated path line comments(first:100){nodes{databaseId url body pullRequestReview{databaseId}}}}}}}}'

# shellcheck disable=SC2209
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

if printf '%s\n' "$JSON_OUTPUT" | jq -e '.errors | length > 0' >/dev/null 2>&1; then
  echo "ERROR: GitHub GraphQL errors: $(printf '%s\n' "$JSON_OUTPUT" | jq -c '.errors')" >&2
  exit 1
fi

if printf '%s\n' "$JSON_OUTPUT" | jq -e '.data == null' >/dev/null 2>&1; then
  echo "ERROR: GitHub GraphQL response missing data." >&2
  exit 1
fi

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
            commentIds: ($thread.comments.nodes | map(.databaseId)),
            matchingReviewCommentIds: (
              $thread.comments.nodes
              | map(select(.pullRequestReview.databaseId == $reviewId) | .databaseId)
            )
          }
        | select(.matchingReviewCommentIds | length > 0)
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
  | "\(.key + 1). \(.value.threadId) \(.value.path)\(if .value.line then ":\(.value.line)" else "" end) comments=\(.value.matchingReviewCommentIds | map(tostring) | join(","))\(if .value.isResolved then " [resolved]" else "" end)\(if .value.isOutdated then " [outdated]" else "" end)"
'

if [[ "$APPLY" != "true" ]]; then
  echo "Dry-run only. Re-run with --apply to post replies and resolve threads."
  exit 0
fi

while IFS= read -r row; do
  THREAD_ID="$(printf '%s\n' "$row" | jq -r '.threadId')"
  REPLY_TO_COMMENT_ID="$(printf '%s\n' "$row" | jq -r '.commentIds[-1]')"

# shellcheck disable=SC2209
  GH_PAGER=cat gh api -X POST "repos/$OWNER/$REPO/pulls/$PR_NUMBER/comments" \
    -F "in_reply_to=$REPLY_TO_COMMENT_ID" \
    -f "body=$MESSAGE" >/dev/null

# shellcheck disable=SC2209,SC2016
  MUTATION_OUTPUT="$({
    GH_PAGER=cat gh api graphql \
      -f 'query=mutation($threadId:ID!){resolveReviewThread(input:{threadId:$threadId}){thread{id isResolved}}}' \
      -F "threadId=$THREAD_ID"
  } )"

  if [[ -z "$MUTATION_OUTPUT" ]]; then
    echo "ERROR: Empty mutation response for thread $THREAD_ID." >&2
    exit 1
  fi

  if printf '%s\n' "$MUTATION_OUTPUT" | jq -e '.errors | length > 0' >/dev/null 2>&1; then
    echo "ERROR: GraphQL mutation errors for thread $THREAD_ID: $(printf '%s\n' "$MUTATION_OUTPUT" | jq -c '.errors')" >&2
    exit 1
  fi

  if ! printf '%s\n' "$MUTATION_OUTPUT" | jq -e '.data.resolveReviewThread.thread.isResolved == true' >/dev/null 2>&1; then
    echo "ERROR: Thread $THREAD_ID was not resolved." >&2
    exit 1
  fi

  echo "Resolved thread $THREAD_ID (reply comment target $REPLY_TO_COMMENT_ID)."
done < <(printf '%s\n' "$TARGETS_JSON" | jq -c '.[]')

echo "Completed: resolved $TARGET_COUNT thread(s)."
