## Why

The skill `fusion-framework-feature-toggling` has been in `skills/.deprecated/` since 2026-03-21T15:28:47+01:00 — past the 3-month retention period.
It was replaced by `fusion-app-react-dev`.

## What this PR does

- Deletes `skills/.deprecated/fusion-framework-feature-toggling/` and all its contents from the repository

## Reviewer focus

- Confirm no other skills reference `fusion-framework-feature-toggling` as a dependency
- Confirm successor `fusion-app-react-dev` covers the use cases previously handled by `fusion-framework-feature-toggling`
- Verify no active consumers still rely on this skill

## References

- Workflow run: https://github.com/equinor/fusion-skills/actions/runs/27944914738
- Successor skill: `fusion-app-react-dev`
