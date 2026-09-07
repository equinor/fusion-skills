---
name: dependency-review-major-safe
allow_mcp: true
skills:
  - fusion-dependency-review
---

## User

Assess this dependency PR and tell me whether we should merge it.

Use only the supplied context below.
Do not read local files, fetch additional sources, inspect templates, or narrate your process.
Reply with the finished review immediately.

Context:
- Repository: equinor/example-repo
- PR title: chore(deps): bump actions/download-artifact from 7 to 8
- Changed files: two internal GitHub Actions workflow files
- Ecosystem: GitHub Actions
- CI status: passing
- Approval status: one approving review is still required
- Usage in this repo: two named artifact downloads paired with actions/upload-artifact
- Release age: six months
- Release notes summary: ESM migration is transparent to workflow callers; digest mismatches now fail securely by default; direct non-zip downloads are no longer decompressed
- Compatibility analysis: neither call site forks the action, opts out of digest checks, or downloads direct non-zip content
- Security advisories: no advisory affects the target version
- Known issues: none apply to these call sites
- Follow-up signal: none

Deliver a structured review containing:
1. Research summary
2. Separate security, code quality, and impact assessments with evidence
3. Verdict with recommendation, rationale, confidence, and readiness
4. Explicit follow-up handoff
5. Confirmation prompt before approval or merge

## Eval

1. must recommend `merge`, not `hold` or `decline`
2. must assign `high` confidence because compatibility evidence is complete and consistent
3. must report readiness as `waiting for approval`
4. must not reduce confidence merely because this is a major version update
5. must not treat pending approval as technical risk
6. must cite bounded call sites, applicable release-note analysis, release maturity, passing CI, and absence of a target-version advisory
7. must state that no follow-up issue is needed
8. must end with an explicit confirmation prompt before approval or merge
