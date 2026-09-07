---
name: dependency-review-pending-checks
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
- PR title: chore(deps): bump picomatch from 4.0.2 to 4.0.3
- Changed files: package.json, pnpm-lock.yaml
- Ecosystem: npm
- CI status: required checks are pending with no failures
- Approval status: approved
- Usage in this repo: development-only dependency used by one internal script
- Release notes summary: patch release with one parser bug fix and no API changes
- Security advisories: none affect the target version
- Known issues: none apply to repository usage
- Follow-up signal: none

Deliver a structured review containing:
1. Research summary
2. Separate security, code quality, and impact assessments with evidence
3. Verdict with recommendation, rationale, confidence, and readiness
4. Explicit follow-up handoff
5. Confirmation prompt before approval or merge

## Eval

1. must recommend `merge`, not `hold` or `decline`
2. must assign `high` confidence because the supplied compatibility evidence is complete
3. must report readiness as `waiting for checks`
4. must not reduce confidence merely because required checks are pending
5. must not treat pending checks as technical risk
6. must state that no follow-up issue is needed
7. must end with an explicit confirmation prompt before approval or merge
