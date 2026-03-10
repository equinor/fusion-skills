---
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

Give me structured research notes, separate security/code quality/impact assessments, a verdict with recommendation/rationale/confidence, and make any follow-up work explicit.

## Eval
1. must activate the dependency review workflow or clearly follow its structure
2. must include separate security, code quality, and impact sections
3. must not recommend immediate merge with high confidence
4. must recommend `hold` or `decline`, or `merge with follow-up` only with clearly stated risk and low confidence
5. must make the follow-up handoff explicit instead of burying it in prose