---
name: fusion-dependency-pr-greenkeeper
description: 'Review dependency PRs with structured research, multi-lens analysis (security, code quality, impact), and a repeatable verdict template. USE FOR: dependency update PRs, Renovate/Dependabot PRs, library upgrade reviews, "review this dependency PR", "should we merge this update". DO NOT USE FOR: feature PRs, application code reviews, dependency automation/bot configuration, or unattended merge without confirmation.'
license: MIT
compatibility: Requires GitHub MCP server for PR context.
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  tags:
    - github
    - pull-request
    - dependency-review
    - greenkeeping
    - security
  mcp:
    required:
      - github
---

# Dependency PR Greenkeeper

Structured review workflow for dependency update PRs. Produces consistent research notes, multi-lens analysis, and an actionable verdict with explicit maintainer confirmation before any merge action.

## When to use

Use this skill when a dependency PR needs review and you want a consistent, auditable decision process.

Typical triggers:

- "Review this dependency PR"
- "Should we merge this dependency update?"
- "Check this Renovate/Dependabot PR"
- "What changed in this library bump?"
- "Is this dependency update safe to merge?"
- A PR title contains dependency update patterns (for example `chore(deps):`, `fix(deps):`, `bump`, `update`)
- The user shares a PR URL for a dependency update

## When not to use

Do not use this skill for:

- Feature PRs or application code reviews (use standard code review workflows)
- Dependency automation or bot configuration
- Approving/merging without explicit user confirmation
- Deciding organizational dependency policy

## Required inputs

Collect before starting the review:

- **Repository** owner and name
- **PR number or URL** for the dependency update
- Optional: specific review concerns or areas of focus from the maintainer

Auto-extract from the PR when available:

- Package(s) being updated and version range (from → to)
- Changelog/release notes URL
- CI status

## Instructions

### Step 1 — Gather PR context

1. Fetch PR metadata: title, description, changed files, CI status, labels.
2. Identify the dependency being updated: package name, ecosystem, current version, target version.
3. Determine the update type: patch, minor, or major (based on semver).
4. Pull the diff to understand what files changed (typically lockfiles and/or manifest files).

### Step 2 — Research the update

Investigate the dependency update using available sources:

1. **Release notes / changelog**: summarize what changed between the old and new version.
2. **Breaking changes**: flag any breaking changes, deprecations, or migration steps.
3. **Known issues**: check for reported regressions or issues with the target version.
4. **Transitive dependency changes**: note significant sub-dependency shifts when visible in the diff.

Draft findings into `assets/research-template.md` structure (either in `.tmp/` or as a PR comment draft).

### Step 3 — Analyze through review lenses

Evaluate the update through three structured lenses. Each lens produces a short assessment.

#### Security lens

- Does the update address known vulnerabilities (CVEs)?
- Does the new version introduce new dependencies or widen the attack surface?
- Are there security advisories for the target version?
- Assessment: `clear` / `concern` / `blocking`

#### Code quality lens

- Is the update well-tested upstream (CI status, test coverage signals)?
- Are there API changes that affect the consuming codebase?
- Does the changelog indicate stability (bug fixes, refactors vs. large rewrites)?
- Assessment: `clear` / `concern` / `blocking`

#### Impact lens

- What is the blast radius in this repository? (lockfile-only vs. code changes needed)
- Does the CI pass with the update?
- Are there downstream consumers that would be affected?
- Does the update require follow-up work (config changes, migration steps, code adaptation)?
- Assessment: `clear` / `concern` / `blocking`

### Step 4 — Synthesize verdict

Combine the three lens assessments into a single verdict using `assets/verdict-template.md` structure:

- **Recommendation**: `merge` / `merge with follow-up` / `hold` / `decline`
- **Rationale**: concise summary of why
- **Confidence**: `high` / `medium` / `low`
- **Follow-up items**: explicit list of any required actions after merge (migrations, config changes, monitoring)

If any lens has a `blocking` assessment, the recommendation must not be `merge` without addressing the blocker first.

### Step 5 — Present findings to maintainer

Present the complete review as a structured comment or summary:

1. Research notes (step 2 output)
2. Lens assessments (step 3 output)
3. Verdict (step 4 output)
4. Suggested action with explicit confirmation prompt

### Step 6 — Act on maintainer decision

After the maintainer reviews the findings:

- **If maintainer approves merge**: ask for explicit confirmation, then approve and/or merge the PR via MCP.
- **If maintainer requests hold**: add a comment noting the hold reason and any follow-up criteria.
- **If maintainer declines**: add a comment with the rationale and close if requested.
- **If follow-up work is identified**: propose creating a tracking issue for migration/remediation tasks.

Never merge or approve without explicit user confirmation, even when confidence is high.

## Expected output

Return a structured review containing:

- Package name, version change, and update type
- Research summary (changelog highlights, breaking changes, known issues)
- Security assessment with evidence
- Code quality assessment with evidence
- Impact assessment with evidence
- Verdict: recommendation, rationale, confidence, and follow-up items
- Explicit action prompt for the maintainer

## Safety & constraints

Never:

- Merge or approve a dependency PR without explicit user confirmation
- Claim CI passed or security is clear without checking actual status
- Expose secrets or tokens in comments or logs
- Dismiss security concerns for convenience
- Fabricate changelog entries or version details not found in sources

Always:

- Present evidence for each assessment (link to changelog, CVE, CI status)
- Make follow-up work explicit rather than burying it in review notes
- Respect the maintainer as the final decision-maker
- Keep review output in a consistent, repeatable structure
