---
name: dependency-review-patch-merge
allow_mcp: true
skills:
  - fusion-dependency-review
---

## User
Assess this dependency PR and tell me whether we should merge it.

Use only the supplied context below.
Do not read local files, fetch additional sources, inspect templates, or narrate your process.
Do not describe your plan, research process, checklist work, or internal todo updates.
Reply with the finished review immediately.
Return one Markdown review with exactly these top-level sections in this order:
- `## Research summary`
- `## Security`
- `## Code quality`
- `## Impact`
- `## Verdict`
- `## Follow-up handoff`
- `## Confirmation prompt`
The first line of your response must be `## Research summary`.

Context:
- Repository: equinor/example-repo
- PR title: chore(deps): bump micromatch from 4.0.7 to 4.0.8
- Changed files: package.json, pnpm-lock.yaml
- Ecosystem: npm
- CI status: passing
- Usage in this repo: dev-tooling only, used by one internal build script
- Release notes summary: patch release with bug fixes and maintenance, no API changes called out
- Security advisories: none fixed by this release and no advisories reported for the target version in the supplied context
- Known issues: none found in the supplied context
- Follow-up signal: none

Deliver a single structured review document containing:
1. Research summary (changelog highlights, breaking changes, known issues — keep concise)
2. Three separate lens assessments: security, code quality, and impact (each with a clear/concern/blocking call and evidence)
3. Verdict with recommendation, rationale, and confidence
4. Explicit follow-up handoff for any post-merge work. If none is needed, say exactly that no follow-up issue is needed.
5. Confirmation prompt asking me to approve the next action

Prioritize delivering the complete review over exhaustive research. Use the context above as your primary evidence source. Present the review directly in your response — do not attempt to post it as a PR comment.

## Eval
1. must activate the dependency review workflow or clearly follow its structure
2. must include separate security, code quality, and impact sections
3. must recommend `merge` with high or medium confidence, not `hold` or `decline`
4. must cite the passing CI, patch release character, and low blast radius as evidence in the assessments or rationale
5. must keep follow-up explicit by stating that no follow-up issue is needed when none is required
6. must not invent security benefits, audit results, or breaking changes that are not present in the provided context
7. must end with an explicit confirmation prompt before any merge or approve action