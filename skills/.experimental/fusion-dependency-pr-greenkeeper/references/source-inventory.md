# Source inventory and scope boundaries

This note records the source workflows reviewed while shaping `fusion-dependency-pr-greenkeeper` and separates portable guidance from repository-specific automation.

## Fusion Framework sources reviewed

### `dependabot-pr-handler`

Reusable patterns:

- Structured operating modes (`audit-only`, `validate`, `full`) so the workflow can stay read-only until the user asks for mutations.
- Research-first flow before validation or merge action.
- Dedicated research and results comment templates to keep maintainer communication consistent.
- Explicit consent gates before posting comments, pushing changes, or merging.

Non-portable patterns:

- Fusion Framework monorepo specifics (`pnpm`, workspaces, changesets, rebase/push flow, `gh pr comment`, force-with-lease guidance).
- Dependabot-actor filtering and branch/worktree automation tied to that repository layout.

### `npm-research`

Reusable patterns:

- Research dimensions: changelog, security advisories, breaking changes, transitive dependency changes, peer dependency warnings, and PR-level follow-up when release notes are insufficient.
- Structured research template with sources and explicit recommendation framing.
- Cross-source verification rather than relying on a single registry or changelog page.

Non-portable patterns:

- npm and GitHub CLI commands tied to npm package research.
- Tool-specific command examples that assume local shell tooling.

### `pnpm-dependency-analysis`

Reusable patterns:

- Blast-radius thinking: direct use count, dependency type, version consistency, and config-file touch points all affect review confidence.
- Risk classification tied to spread and dependency role, not just semver.

Non-portable patterns:

- `pnpm why` and workspace-graph commands that only apply to pnpm monorepos.
- Workspace-count heuristics that are useful inspiration but not universal defaults.

### `dependabot.agent.md`

Reusable patterns:

- Clear role framing: research thoroughly, validate rigorously, communicate findings clearly, operate safely.
- Use structured templates instead of ad hoc summary comments.
- Never merge or post without explicit consent.

Non-portable patterns:

- Full 15-step automation workflow and repository-specific command expectations.

## Public reference

### GitHub Docs: About Dependabot version updates

Reusable patterns:

- Dependabot version updates should still be reviewed by maintainers before merge.
- Maintainers should check tests and review changelog/release notes included in the PR summary.
- Version updates and security updates are different lanes and should not be conflated.

Non-portable patterns:

- `dependabot.yml` configuration, repository setup, and notification behavior are not part of this skill's review workflow.

## Portable v1 boundaries for this skill

Include in the installable skill:

- Strong activation cues and anti-triggers for dependency PR review
- Structured research and verdict templates
- Security, code quality, and impact lenses
- Explicit confidence model and approve/merge confirmation gate
- Follow-up remediation handoff through existing issue-authoring flows

Keep out of the installable skill:

- Repo-specific rebase/push/merge automation
- Package-manager-specific command recipes that are not broadly portable
- Changeset policy, branch strategy, and CI conventions from a single repository
- Bot configuration or Dependabot setup guidance

## Representative requests

- "Review this dependency PR"
- "Should we merge this Renovate bump?"
- "Give me a verdict on this library upgrade"
- "Assess security, code quality, and impact for this dependency update"

## Anti-triggers

- "Configure Dependabot for this repo"
- "Review this feature PR"
- "Merge this PR now" without prior dependency analysis
- "Set repo-wide dependency policy"