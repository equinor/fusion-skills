---
"fusion-github-review-resolution": patch
---

Skip the worktree question when already on the PR's head branch

Step 1 now checks whether the current checkout's branch matches the PR's head
branch before asking about a dedicated git worktree. If they match, the skill
proceeds directly instead of asking a redundant question; the worktree
question is only asked when the branch differs or the workspace is on a
shared/long-lived branch.
