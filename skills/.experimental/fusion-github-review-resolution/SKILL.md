---
name: fusion-github-review-resolution
description: Resolve unresolved GitHub pull request review comments by researching each comment, applying fixes with validation, committing per comment, then posting fix replies and resolving threads.
license: MIT
metadata:
   version: "0.0.0"
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

Typical triggers:
- "Handle all unresolved comments on this PR"
- "For each review comment: fix, test, commit, reply, resolve"
- "Close review threads with concrete commit references"
- "https://github.com/<owner>/<repo>/pull/<number>#pullrequestreview-<id>"
- "See all sub comments for this review URL and fix them"

## When not to use

Do not use this skill when:
- no unresolved review comments exist,
- the request is only to summarize feedback without code changes,
- the branch/worktree is intentionally read-only.

## Required inputs

Collect before execution:
- repository owner/name,
- pull request number or URL,
- optional review id to scope comments (for example `pullrequestreview-<id>`),
- branch/worktree decision,
- required validation commands for the repository.

Optional context:
- linked issue reference (for example `equinor/fusion-core-tasks#432`),
- commit granularity preference when comments overlap the same file.

## Instructions

1. Gather unresolved comments
   - Copy `assets/review-resolution-checklist.md` and use it as the working tracker.
   - Fetch review threads for the PR and filter unresolved threads.
   - If a specific review id or review URL is provided, limit to comments from that review.
   - Within the targeted review, collect all comments in each matching thread, including sub-comments/replies.
   - Build a working list with: thread id, comment id, parent review id, file path, comment body, reply context.

2. Understand and research each comment
   - Read the referenced file(s) and nearby logic.
   - Verify root cause and identify the smallest safe fix.
   - If uncertain, inspect adjacent tests/usages before editing.

3. Fix, check, commit (per comment)
   - Apply focused code/doc changes for one comment at a time.
   - Run targeted checks first, then required repo checks.
   - Create one commit per comment when practical.
   - If two comments require one inseparable change, use one commit and map both comments to that commit in replies.

4. Push once after all fixes
   - After all comment-related commits are created, push branch updates once.

5. Reply and resolve each review comment
   - For each resolved comment/thread:
     - post a reply describing what changed,
     - include commit hash(es),
     - resolve the review thread.
   - Keep replies precise and implementation-specific.

6. Verify closure state
   - Re-check review threads and confirm no targeted unresolved threads remain.
   - Re-check latest CI status if the workflow expects green checks.

7. Optional scripted execution
    - Use `scripts/get-review-comments.sh` to fetch matching review comments (including sub-comments in matching threads).
    - Example test:
       - `skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674`
    - Use `--include-outdated` when you need comments from outdated matching threads.
    - Use `scripts/resolve-review-comments.sh` to reply+resolve matching threads.
    - Keep default dry-run behavior; use `--apply` only after fixes are committed and pushed.
    - Example dry-run:
       - `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --include-resolved`
    - Example apply:
       - `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh --owner equinor --repo fusion-skills --pr 27 --review-id 3837647674 --apply --message "Addressed in <commit>: <what changed>."`

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

## Safety & constraints

- Never expose secrets or tokens in logs/replies.
- Prefer argv-based process execution over shell-interpolated command strings.
- Keep diffs minimal and scoped to review feedback.
- Do not resolve a thread without posting a concrete fix reply.
- Do not claim checks passed unless commands were actually run.
- If a comment is outdated but still unresolved, either:
  - resolve with a clear explanation and commit reference, or
  - leave unresolved and report why.
- In scripted mode, keep default dry-run behavior and require explicit `--apply` for mutations.

## Linked issue usage

When an issue is provided (for example `equinor/fusion-core-tasks#432`):
- mention the issue in progress/final summaries,
- keep implementation aligned with issue scope,
- avoid expanding to unrelated PR automation.
