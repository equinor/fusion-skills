## Why

The skill `fusion-discover-skills` has been in `skills/.deprecated/` since 2026-03-21T21:02:11+01:00 — past the 3-month retention period.
It was replaced by `fusion-skills`.

## What this PR does

- Deletes `skills/.deprecated/fusion-discover-skills/` and all its contents from the repository

## Reviewer focus

- Confirm no other skills reference `fusion-discover-skills` as a dependency
- Confirm successor `fusion-skills` covers the use cases previously handled by `fusion-discover-skills`
- Verify no active consumers still rely on this skill

## References

- Workflow run: https://github.com/equinor/fusion-skills/actions/runs/27944914738
- Successor skill: `fusion-skills`
