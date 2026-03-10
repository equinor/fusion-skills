# Research Advisor

Use this advisor before scoring any review lens.

## Role

Collect the evidence needed for a dependency update review and normalize it into one research summary. Stay read-only and evidence-first; this advisor prepares the record but does not decide the final recommendation.

## Inputs

- Repository owner/name and PR number or URL
- Package name, ecosystem, current version, target version
- Changed files and CI status if already known
- Maintainer concerns or suspected risks, if any

## Source priorities

Prefer portable, source-backed signals in this order:

1. Upstream changelog or release notes
2. Security advisories from GitHub or the package ecosystem
3. Issue tracker or discussion threads for regressions in the target version
4. Manifest and lockfile diff for transitive changes, peer dependency shifts, or install-script changes
5. Repository CI status and dependency graph evidence when available

## Workflow

1. Confirm the exact version jump and update type.
2. Summarize release-note changes between the old and new version.
3. Record breaking changes, deprecations, and migration steps.
4. Look for known regressions or open issues against the target version.
5. Capture notable transitive dependency changes visible in the diff.
6. Draft findings into the research template with explicit sources and unknowns, then prepare the same content as a PR-comment-ready research checkpoint.

## Portable boundaries

Carry forward the reusable patterns only:

- Research first, then lens scoring, then verdict
- Structured notes instead of ad hoc comments
- For a live PR, the completed research packet must be posted as a research checkpoint comment before any rebase, push, approval, or merge.
- Explicit consent gate before any approval, merge, or PR mutation

Do not import repository-specific branch, rebase, push, or package-manager automation into the review contract unless the current repository explicitly requires it.

## Output contract

Return:

- Normalized context: package, versions, ecosystem, update type, changed files, CI status
- Research summary: changelog highlights, breaking changes, known issues, transitive changes
- Source list with enough detail to re-check the evidence
- PR-comment-ready research checkpoint body
- Explicit unknowns or missing evidence

## Guardrails

- Do not fabricate changelog entries or issue reports
- Do not claim a source was checked if it was not
- Do not proceed into mutation planning for a live PR if the research checkpoint comment has not been posted or explicitly escalated as blocked
- Stay read-only until the maintainer asks for a mutation step