---
name: fusion-github-review-resolution
description: "Resolves unresolved GitHub PR review threads end-to-end: researches each comment, applies a targeted fix, commits, replies with the commit reference, and resolves the thread. USE FOR: unresolved review threads, PR review feedback, changes requested PRs, PR review URLs (#pullrequestreview-...), fix the review comments, close the open threads, address PR feedback. DO NOT USE FOR: summarizing feedback without code changes, creating new PRs, or read-only branches."
license: MIT
compatibility: Requires GitHub MCP server or gh CLI, and git.
metadata:
   version: "0.1.1"
   status: experimental
   owner: "@equinor/fusion-core"
   tags:
      - github
      - pull-request
      - review-comments
      - remediation
   mcp:
      suggested:
         - github
---

# Resolve GitHub Review Comments

## When to use

Use this skill when a pull request has unresolved inline review comments and you need a repeatable, auditable closure workflow.

Typical triggers (skill should activate on all of these):

**URL patterns — activate immediately:**
- `https://github.com/<owner>/<repo>/pull/<number>#pullrequestreview-<id>`
- `https://github.com/<owner>/<repo>/pull/<number>` (when context implies review work)

**Explicit user requests:**
- "Fix the review comments"
- "Address the review feedback on this PR"
- "There are unresolved review comments — fix them"
- "Resolve the conversations on this PR"
- "Handle all unresolved comments on this PR"
- "For each review comment: fix, test, commit, reply, resolve"
- "Close the open review threads"
- "Check this review and resolve the conversation when fixed"
- "Resolve outstanding review feedback"
- "The PR has changes requested — fix it"

**Implicit / agent-detected:**
- A PR is in "changes requested" state and the agent is asked to work on it
- A PR has unresolved review threads and the user asks to improve or merge the PR
- An agent working on a PR detects open review conversations

## When not to use

Do not use this skill when:
- no unresolved review comments exist,
- the request is only to summarize or describe feedback without making code changes,
- all targeted threads are already resolved or outdated and acknowledged,
- the branch/worktree is intentionally read-only.

## Required inputs

Collect before execution:
- repository owner/name,
- pull request number or URL,
- optional review id to scope comments (for example `pullrequestreview-<id>`),
- branch/worktree decision,
- required validation commands for the repository.

> **When a review URL is provided** (`github.com/<owner>/<repo>/pull/<number>#pullrequestreview-<id>`),
> auto-extract owner, repo, PR number, and review id from it.
> Only branch/worktree choice and validation commands still need confirming.

Optional context:
- linked issue reference (for example `equinor/fusion-core-tasks#432`),
- commit granularity preference when comments overlap the same file.

## Instructions

1. Ask whether to use a dedicated git worktree
   - Ask this before any other workflow questions.
   - If yes, use/create the worktree and continue there.

2. Gather unresolved comments and create working tracker
   - If a review URL with `#pullrequestreview-<id>` was provided, parse owner, repo, PR number, and review id from it before fetching.
   - **Copy or open `assets/review-resolution-checklist.md`—this becomes your working document.** Fill in the context section and update the comment tracking table as you work through each thread.
   - Fetch review threads for the PR and filter unresolved threads.
   - If a specific review id or review URL is provided, limit to comments from that review.
   - Within the targeted review, collect all comments associated with that review id (do not include replies from other reviews unless explicitly requested).
   - Build a working list with: thread id, comment id, parent review id, file path, original comment body, and all subsequent replies in that thread (including contributor replies).
   - Read the full reply chain for each thread — contributors may have added clarifications, constraints, or additional context that must be taken into account when deciding how to resolve the comment.

3. Understand and research each comment
   - Read the referenced file(s) and nearby logic.
   - Verify root cause and identify the smallest safe fix.
   - If uncertain, inspect adjacent tests/usages before editing.

4. Fix, check, commit (per comment)
   - Apply focused code/doc changes for one comment at a time.
   - Run targeted checks first, then required repo checks.
   - Create one commit per comment when practical.
   - If two comments require one inseparable change, use one commit and map both comments to that commit in replies.

5. Push once after all fixes
   - After all comment-related commits are created, push branch updates once.

6. Reply and resolve each review comment
   - For each fixed thread, these two steps are mandatory and must happen together in order:
     1. **Post a reply** on the thread: describe what changed and include the commit hash(es).
     2. **Resolve the thread** immediately after the reply is posted — never before.
   - Never resolve a thread without a reply. Never post a reply without then resolving the thread.
   - Keep replies specific: name the file/line changed and the commit, not just "fixed".

7. Verify closure state
   - Re-check review threads and confirm no targeted unresolved threads remain.
   - Re-check latest CI status if the workflow expects green checks.

8. Ask whether to request a new review from the original review author
   - After fixes are pushed and threads are resolved, ask if the user wants to request a new review from the author of the review comments.
   - If yes, request review from that reviewer username and report that the request was sent.

9. Optional scripted execution
   - Use `scripts/get-review-comments.sh` to fetch matching review comments (including sub-comments associated with the review id).
   - Results are limited to the first 100 review threads and first 100 comments per thread.
   - Example test:
      - `skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674`
   - Use `--include-outdated` when you need comments from outdated matching threads.
   - Use `scripts/resolve-review-comments.sh` to reply+resolve matching threads.
   - Keep default dry-run behavior; use `--apply` only after fixes are committed and pushed.
   - Example dry-run:
      - `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --include-resolved`
   - Example apply:
      - `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --apply --message "Addressed in <commit>: <what changed>."`

## Tooling map (MCP vs GraphQL)

Use GitHub MCP tools for high-level PR operations and GraphQL for thread-level review operations.

| Workflow action | Preferred tool | Notes |
|---|---|---|
| Request reviewer / update PR metadata | `mcp_github_update_pull_request` | Works for collaborator reviewers and standard PR updates. |
| Create or submit PR review | `mcp_github_pull_request_review_write` | Handles pending review lifecycle actions. |
| Add general PR comment | `mcp_github_add_issue_comment` | Adds issue-style comment to PR conversation, not inline thread reply. |
| List review threads and comments | `assets/pull-request-review-threads.graphql` | Use with `gh api graphql -f query=@assets/pull-request-review-threads.graphql` for thread-level context. |
| Count unresolved threads for specific review id | `assets/unresolved-thread-count-for-review.graphql` | Post-process response (for example with `jq`) to filter by review id and unresolved state. |
| Reply to a review thread | `assets/add-pull-request-review-thread-reply.graphql` | Mutation: `addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: "...", body: "..."})` |
| Resolve a review thread | `assets/resolve-review-thread.graphql` | Mutation: `resolveReviewThread(input: {threadId: "..."})` ⚠️ Note: uses `threadId`, not `pullRequestReviewThreadId`. |
| List PR reviews (review URL/id lookup support) | `assets/pull-request-reviews.graphql` | Useful when starting from review URL context. |

> **Pro tip:** See each `.graphql` file in assets for complete mutation/query syntax and parameter names.

## Expected output

Return a concise report containing:
- comments processed count,
- files changed,
- commit list (hash + message),
- validation commands run and outcomes,
- confirmation of push,
- reply/resolve confirmation per thread,
- completed checklist location,
- any remaining unresolved threads or blockers.

## Linked issue usage

When an issue is provided (for example `equinor/fusion-core-tasks#432`):
- mention the issue in progress/final summaries,
- keep implementation aligned with issue scope,
- avoid expanding to unrelated PR automation.

## Safety & constraints

- Never expose secrets or tokens in logs/replies.
- Prefer argv-based process execution over shell-interpolated command strings.
- Keep diffs minimal and scoped to review feedback.
- Do not resolve a thread without posting a concrete fix reply.
- Do not claim checks passed unless commands were actually run.
- Do not force-push; use regular commits and a single push after all fixes.
- If a comment is outdated but still unresolved, either:
  - resolve with a clear explanation and commit reference, or
  - leave unresolved and report why.
- In scripted mode, keep default dry-run behavior and require explicit `--apply` for mutations.
