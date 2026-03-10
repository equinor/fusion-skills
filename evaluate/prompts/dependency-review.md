---
name: dependency-review-major-hold
allow_mcp: true
skills:
  - fusion-dependency-review
---

## User
Assess this dependency PR and tell me whether we should merge it.

Context:
- Repository: equinor/example-repo
- PR title: chore(deps): bump vite from 5.4.11 to 6.0.0
- Changed files: package.json, pnpm-lock.yaml, vite.config.ts
- Ecosystem: npm
- CI status: failing in build
- Usage in this repo: 7 workspaces, production and tooling usage
- Release notes summary: major release, plugin API changes, deprecated config removed
- Security advisories: none fixed by this release
- Known issues: early adopter reports mention plugin compatibility regressions
- Follow-up signal: migration work may be needed across shared config and workspace tooling

Deliver a single structured review document containing:
1. Research summary (changelog highlights, breaking changes, known issues — keep concise)
2. Three separate lens assessments: security, code quality, and impact (each with a clear/concern/blocking call and evidence)
3. Verdict with recommendation, rationale, and confidence
4. Explicit follow-up handoff for any post-merge work
5. Confirmation prompt asking me to approve the next action

Prioritize delivering the complete review over exhaustive research. Use the context above as your primary evidence source. Present the review directly in your response — do not attempt to post it as a PR comment.

## Eval
1. must activate the dependency review workflow or clearly follow its structure
2. must include separate security, code quality, and impact sections
3. must not recommend immediate merge with high confidence
4. must recommend `hold` given the failing CI blocker, or `merge with follow-up` only if it explicitly addresses the CI failure as a prerequisite before merge
5. must make the follow-up handoff explicit instead of burying it in prose
6. must cite the failing CI and plugin regression reports as evidence in the impact or code quality assessment
7. must not claim security benefits or audit results that are not present in the provided context
8. must end with an explicit confirmation prompt before any merge or approve action