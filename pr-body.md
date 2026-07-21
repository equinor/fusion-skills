## Why

The skill `fusion-issue-author-user-story` has been in `skills/.deprecated/` since 2026-03-18T22:24:38+01:00 — past the 3-month retention period.
It was replaced by `fusion-issue-authoring`.

## What this PR does

- Deletes `skills/.deprecated/fusion-issue-author-user-story/` and all its contents from the repository

## Reviewer focus

- Confirm no other skills reference `fusion-issue-author-user-story` as a dependency
- Confirm successor `fusion-issue-authoring` covers the use cases previously handled by `fusion-issue-author-user-story`
- Verify no active consumers still rely on this skill

## References

- Workflow run: https://github.com/equinor/fusion-skills/actions/runs/27944914738
- Successor skill: `fusion-issue-authoring`
