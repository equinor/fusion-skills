# Changelog

All notable changes to this repository are documented in this file.

## v0.12.0

### Minor

__🎯 [feat: add fusion-app-react-dev skill #97](https://github.com/equinor/fusion-skills/pull/97)<br/>
🗂️ [da1c011](https://github.com/equinor/fusion-skills/commit/da1c011b803f79ba159313d54b531ab9dbcc6708)<br/>
📦 fusion-app-react-dev@0.1.0__

Add fusion-app-react-dev skill to the catalog

Guides feature development in Fusion Framework React apps — scaffolding
components, hooks, services, and types that follow EDS conventions and
Fusion Framework patterns. Includes helper agents for framework review,
styling review, and code-quality review, plus reference docs and asset
checklists.

resolves equinor/fusion-core-tasks#799

### Patch

__🎯 [trim(fusion-help-api): progressive disclosure — 716 → 121 lines #90](https://github.com/equinor/fusion-skills/pull/90)<br/>
🗂️ [25f8dcd](https://github.com/equinor/fusion-skills/commit/25f8dcd9e6a3931db836949aded52bc47a3f6139)<br/>
📦 fusion-help-api@0.0.2__

Trim SKILL.md from 716 to 121 lines with progressive disclosure

- Move detailed auth code samples to references/authentication.md
- Move full CRUD endpoint docs to references/api-endpoints.md
- Move integration pattern examples to references/integration-patterns.md
- Keep activation guidance, base URLs, auth summary, and safety in SKILL.md
- Link to all five reference files for on-demand loading

resolves equinor/fusion-core-tasks#800

---

__🎯 [fix: actionable diagnostics, PR review comments, and SKILL.md size check #88](https://github.com/equinor/fusion-skills/pull/88)<br/>
🗂️ [8cd7d9d](https://github.com/equinor/fusion-skills/commit/8cd7d9d3a878b27425eb8a3e7be8398278e337e3)<br/>
📦 fusion-skill-authoring@0.3.1__

Document SKILL.md size limits and CI guardrails

- Document 300-line recommended limit (triggers CI warning)
- Document 500-line hard limit (fails CI)
- Clarify expectation to move overflow to references/ early
- Add failure signal for exceeding size thresholds

Relates to: equinor/fusion-core-tasks#84

## v0.11.1

### Patch

__🎯 [feat: add fusion-help skills and fix Windows validation scripts #83](https://github.com/equinor/fusion-skills/pull/83)<br/>
🗂️ [f776146](https://github.com/equinor/fusion-skills/commit/f776146b536cba9fe9c068ed07bad23abf4c2bcc)<br/>
📦 fusion-help-api@0.0.1__

Add fusion-help-api skill

- Guides developers through direct Fusion Help REST API interaction
- Covers articles, FAQs, release notes, search, and content management

---

__🎯 [feat: add fusion-help skills and fix Windows validation scripts #83](https://github.com/equinor/fusion-skills/pull/83)<br/>
🗂️ [f776146](https://github.com/equinor/fusion-skills/commit/f776146b536cba9fe9c068ed07bad23abf4c2bcc)<br/>
📦 fusion-help-docs@0.0.1__

Add fusion-help-docs skill

- Guides app teams through authoring and publishing help documentation using fusion-help-cli
- Covers articles, release notes, and FAQs

---

__🎯 [feat: add fusion-help skills and fix Windows validation scripts #83](https://github.com/equinor/fusion-skills/pull/83)<br/>
🗂️ [f776146](https://github.com/equinor/fusion-skills/commit/f776146b536cba9fe9c068ed07bad23abf4c2bcc)<br/>
📦 fusion-help-integration@0.0.1__

Add fusion-help-integration skill

- Wires Fusion Help Center into app pages via useHelpCenter hook and PageLayout props
- Creates article slug constants and connects contextual help articles

---

__🎯 [fix(skills): harden GitHub API token conservation across issue-authoring and related skills #85](https://github.com/equinor/fusion-skills/pull/85)<br/>
🗂️ [c8ba3df](https://github.com/equinor/fusion-skills/commit/c8ba3df924c5a712c835cdb9f4de44bac03b7ad4)<br/>
📦 fusion-dependency-review@0.1.2<br/>
📦 fusion-discover-skills@0.1.3<br/>
📦 fusion-github-review-resolution@0.1.5<br/>
📦 fusion-issue-authoring@0.2.4<br/>
📦 fusion-issue-solving@0.1.5<br/>
📦 fusion-issue-task-planning@0.1.4__

Make all GitHub-API-consuming skills more conservative with token usage.

- `fusion-issue-authoring`: concrete session-cache flow for labels and assignee candidates; per-session budget table
- `fusion-issue-solving`: expanded low-token strategy with session-cache references and budget awareness
- `fusion-github-review-resolution`: token budget guidance for thread-heavy reviews; cache PR metadata once
- `fusion-issue-task-planning`: session-cache delegation rules and batch-size warning for large task plans
- `fusion-dependency-review`: explicit data-reuse rules across parallel advisor fan-out
- `fusion-discover-skills`: tighter GraphQL budget and call-count cap for discovery sessions

resolves equinor/fusion-core-tasks#797

---

__🎯 [feat: add fusion-help skills and fix Windows validation scripts #83](https://github.com/equinor/fusion-skills/pull/83)<br/>
🗂️ [f776146](https://github.com/equinor/fusion-skills/commit/f776146b536cba9fe9c068ed07bad23abf4c2bcc)__

Fix Windows compatibility in validation scripts

- Fix extractFrontmatter regex to handle \r\n line endings
- Fix parseFrontmatter split to normalize \r\n line endings
- Fix discoverLocalSkills regex to strip both / and \ path separators

## v0.11.0

### Minor

__🎯 [feat(skill): add fusion framework feature toggling skill #80](https://github.com/equinor/fusion-skills/pull/80)<br/>
🗂️ [112f6ae](https://github.com/equinor/fusion-skills/commit/112f6aee1bf3b972c51fc78008856c29cb3186e8)<br/>
📦 fusion-framework-feature-toggling@0.1.0__

Add the experimental `fusion-framework-feature-toggling` skill for Fusion Framework feature-flag guidance.

- prefer Fusion MCP retrieval when the local framework index is available
- fall back to bundled public-source references when Fusion MCP is unavailable or weak
- add offline assets for implementation prompts and review checklists when users do not have the server
- anchor the guidance to current public Fusion Framework surfaces such as `enableFeatureFlag`, `enableFeatureFlagging`, `useFeature`, and the feature-flag plugins
- call out current public-source ambiguity like `readonly` vs `readOnly` instead of inventing API details

Related to: equinor/fusion-core-tasks#362
resolves equinor/fusion-core-tasks#740

## v0.10.4

### Patch

__🎯 Update root documentation<br/>
🗂️ n/a__

- Update root documentation

## v0.10.3

### Patch

__🎯 [fix(skills): reduce GitHub GraphQL usage in workflows #76](https://github.com/equinor/fusion-skills/pull/76)<br/>
🗂️ [3efc478](https://github.com/equinor/fusion-skills/commit/3efc47886871a14b18eb9f68abd562a10c6cf277)<br/>
📦 fusion-discover-skills@0.1.2__

Tighten GraphQL fallback guidance in discover-skills to minimize point cost and avoid retries on rate-limit errors.

- Require small `first`/`last` values and shallow connections for catalog queries
- Do not retry on rate-limit errors; surface the failure and suggest retrying later

resolves equinor/fusion-core-tasks#535

---

__🎯 [fix(skills): reduce GitHub GraphQL usage in workflows #76](https://github.com/equinor/fusion-skills/pull/76)<br/>
🗂️ [3efc478](https://github.com/equinor/fusion-skills/commit/3efc47886871a14b18eb9f68abd562a10c6cf277)<br/>
📦 fusion-issue-authoring@0.2.3__

Reduce token-heavy issue authoring behaviors by tightening MCP-first mutation sequencing and fallback guidance.

- Replace redundant two-pass issue update guidance with single-call-first `issue_write` sequencing
- Clarify cache-first behavior for labels and issue types to avoid repeated lookups
- Add explicit rate-limit handling guidance that avoids retry loops and preserves local draft state
- Tighten duplicate-search guidance to one focused pass unless scope changes

resolves equinor/fusion-core-tasks#535

---

__🎯 [fix(skills): reduce GitHub GraphQL usage in workflows #76](https://github.com/equinor/fusion-skills/pull/76)<br/>
🗂️ [3efc478](https://github.com/equinor/fusion-skills/commit/3efc47886871a14b18eb9f68abd562a10c6cf277)<br/>
📦 fusion-issue-solving@0.1.4__

Improve issue-solving workflow reliability under GitHub API limits by documenting a low-token execution strategy.

- Require reuse of fetched issue context instead of repeated reads
- Add MCP-first guidance for issue workflow mutations and lookups
- Add explicit no-retry-loop behavior for rate-limit failures
- Extend the workflow checklist with token-usage and fallback controls

resolves equinor/fusion-core-tasks#535

---

__🎯 [fix(skills): reduce GitHub GraphQL usage in workflows #76](https://github.com/equinor/fusion-skills/pull/76)<br/>
🗂️ [3efc478](https://github.com/equinor/fusion-skills/commit/3efc47886871a14b18eb9f68abd562a10c6cf277)<br/>
📦 fusion-github-review-resolution@0.1.4__

Add GraphQL cost awareness section to review-resolution skill to enforce conservative mutation pacing and secondary rate-limit handling.

- Document per-mutation secondary cost (5 points) and per-query cost (1 point)
- Require at least 1-second pause between consecutive GraphQL mutation calls
- Require respect for `retry-after` headers before retrying on rate-limit errors

resolves equinor/fusion-core-tasks#535

## v0.10.2

### Patch

__🎯 [fix(skills): require Bip Bop title prefix in dependency review output #73](https://github.com/equinor/fusion-skills/pull/73)<br/>
🗂️ [c0070d2](https://github.com/equinor/fusion-skills/commit/c0070d26e874e01aeef3d79f35fb2c3fb0198dcc)<br/>
📦 fusion-dependency-review@0.1.1__

Require the dependency review research and verdict outputs to use the Bip Bop title prefix.

- align the advisor guidance with the required PR comment title format
- update the research and verdict templates to start with the Bip Bop heading prefix

## v0.10.1

### Patch

__🎯 [fix(skills): improve issue-solving URL activation cues #71](https://github.com/equinor/fusion-skills/pull/71)<br/>
🗂️ [b7fe258](https://github.com/equinor/fusion-skills/commit/b7fe2581ba6bab7325d953c44b853a2a94ba65da)<br/>
📦 fusion-issue-solving@0.1.3__

Strengthen issue-solving discovery cues for short prompts and direct GitHub issue URLs.

- move representative activation phrases into the frontmatter description so semantic routing can match `solve #123`, `lets solve #123`, and full `https://github.com/owner/repo/issues/123` prompts
- clarify that direct GitHub issue URLs can stand in for `#123` references, including URL-first prompts

resolves equinor/fusion-skills#66

## v0.10.0

### Minor

__🎯 [feat(skill): expand dependency review workflow #69](https://github.com/equinor/fusion-skills/pull/69)<br/>
🗂️ [9503fd8](https://github.com/equinor/fusion-skills/commit/9503fd8b9fdf1fd509d8cc765e316a57004addc9)<br/>
📦 fusion-dependency-review@0.1.0__

Add experimental dependency review skill

- Structured research template for dependency update PRs
- Helper advisors for research, security, code quality, impact, source control, and verdict synthesis
- Multi-lens review analysis: security, code quality, impact
- Reusable verdict template with recommendation, rationale, confidence, and follow-up
- Review tracker/checklist asset for consistent dependency PR triage
- GitHub MCP retrieval of existing PR comments and review threads before analysis
- Minimal follow-up questions and candidate dependency PR listing when the target PR is unclear
- Focused advisor/reference files for target-PR selection and detailed workflow sequencing
- High-confidence evaluation coverage for dependency review
- Advisor-driven source guidance, confidence rules, remediation handoff, and safe PR patching flow
- Mandatory PR research checkpoint comments before mutation and final verdict comments before merge or decision
- Evaluation prompt for dependency review validation
- Explicit maintainer confirmation before any merge action

resolves equinor/fusion-core-tasks#523

## v0.9.1

### Patch

__🎯 [feat: add dev-time skill evaluation harness #64](https://github.com/equinor/fusion-skills/pull/64)<br/>
🗂️ [01ce2c7](https://github.com/equinor/fusion-skills/commit/01ce2c748ddf31518deb8f8b75122cbe1fcc9586)<br/>
📦 fusion-discover-skills@0.1.1__

Fix missing trailing newlines in SKILL.md and follow-up-questions.md

Resolves equinor/fusion-core-tasks#521

## v0.9.0

### Minor

__🎯 [Add fusion-discover-skills experimental skill for MCP-backed discovery #62](https://github.com/equinor/fusion-skills/pull/62)<br/>
🗂️ [1f7d4f9](https://github.com/equinor/fusion-skills/commit/1f7d4f99e32dcd0c15cb964888a0cdbb9fc58541)<br/>
📦 fusion-discover-skills@0.1.0__

Add an experimental MCP-backed skills discovery skill that routes user requests through the Fusion skills index and returns actionable next-step guidance.

- Detect query, install, update, and remove intent before calling the skills MCP tool
- Preserve advisory lifecycle commands exactly when MCP returns them
- Allow GitHub MCP, shell listing, and GraphQL-backed discovery fallback when Fusion MCP is unavailable
- Add a follow-up question bank for vague requests so discovery can narrow to the right skill before searching
- Place the first iteration in the experimental skill lane
- Require explicit low-confidence handling instead of guessed matches

resolves equinor/fusion-core-tasks#412

## v0.8.0

### Minor

__🎯 [feat: refresh fusion skill authoring guidance #60](https://github.com/equinor/fusion-skills/pull/60)<br/>
🗂️ [0e7d702](https://github.com/equinor/fusion-skills/commit/0e7d702f01d8a768f6295fc6d08d8732768edbf4)<br/>
📦 fusion-skill-authoring@0.3.0__

Refresh `fusion-skill-authoring` with clearer discovery cues, decision-gated authoring guidance, and a Fusion-flavored helper-agent layer inspired by Anthropic's `skill-creator`.

- modernize the main skill around reuse-first, evaluation-first, and progressive-disclosure patterns
- default portable scaffold naming to `custom-<name>` unless the target repository defines a stronger convention
- strengthen the follow-up questions and skill-readiness checklist for real skill authoring work
- keep the shipped package portable while restoring Fusion-specific overlays for `fusion-`, reserved skill lanes, and local validation in repo-local instructions
- bundle installable helper agents for scoping, review, and trigger tuning inside the skill package

resolves equinor/fusion-core-tasks#499

## v0.7.4

### Patch

__🎯 [fix: harden fusion-github-review-resolution workflow #58](https://github.com/equinor/fusion-skills/pull/58)<br/>
🗂️ [22b4d66](https://github.com/equinor/fusion-skills/commit/22b4d6655c01edd338aff61ece97f4f6cfe7d245)<br/>
📦 fusion-github-review-resolution@0.1.3__

Tighten the experimental review-resolution workflow so agents follow a deterministic fetch → analyze → fix → validate → push → reply → resolve sequence and avoid ad hoc mutation scripts.

- Prefer structured review-thread tools when the client exposes them, otherwise use the bundled GraphQL assets or shell helper.
- Guard `resolve-review-comments.sh` against duplicate authenticated-user replies by default and use the thread-scoped GraphQL reply mutation.
- Track mutation baselines and retry checks in the skill checklist so retries re-fetch state before posting again.
- Require the skill to judge whether review feedback is actually correct, reply with rationale when it is not, and ask the user when the comment remains ambiguous.

resolves equinor/fusion-skills#57

## v0.7.3

### Patch

__🎯 [feat: establish skills greenkeeping standards and automation #55](https://github.com/equinor/fusion-skills/pull/55)<br/>
🗂️ [2d346c8](https://github.com/equinor/fusion-skills/commit/2d346c812b4927ed1fdf17c92d51856d1fdc09c3)<br/>
📦 fusion-github-review-resolution@0.1.2<br/>
📦 fusion-issue-author-bug@0.1.2<br/>
📦 fusion-issue-author-feature@0.1.2<br/>
📦 fusion-issue-author-task@0.1.2<br/>
📦 fusion-issue-author-user-story@0.1.2<br/>
📦 fusion-issue-authoring@0.2.2<br/>
📦 fusion-issue-solving@0.1.2<br/>
📦 fusion-issue-task-planning@0.1.3<br/>
📦 fusion-mcp@0.1.1<br/>
📦 fusion-skill-authoring@0.2.2<br/>
📦 fusion-skill-self-report-bug@0.1.1__

Add required ownership metadata (`metadata.owner`, `metadata.status`) to all skills. Owner is set to `@equinor/fusion-core` (repository default) and status is set according to skill lifecycle (`active` for production skills, `experimental` for early-stage skills). Sponsor metadata was considered but is not required for MVP.

resolves equinor/fusion-core-tasks#474

---

__🎯 [feat: establish skills greenkeeping standards and automation #55](https://github.com/equinor/fusion-skills/pull/55)<br/>
🗂️ [2d346c8](https://github.com/equinor/fusion-skills/commit/2d346c812b4927ed1fdf17c92d51856d1fdc09c3)<br/>
📦 fusion-issue-solving@0.1.2__

Improve skill activation and discoverability cues

- Enhance description with explicit activation keywords: "continue on", "GitHub issue workflow"
- Reorganize "When to use" section to lead with "continue work on" pattern as primary trigger
- Add discoverable trigger examples matching common issue-solving requests

## v0.7.2

### Patch

__🎯 [fix(skills): normalize MCP contracts and centralize GraphQL fallback assets #42](https://github.com/equinor/fusion-skills/pull/42)<br/>
🗂️ [947c0ab](https://github.com/equinor/fusion-skills/commit/947c0ab73844f5eb13b80e7cb2f3e5ea8146ea59)<br/>
📦 fusion-issue-authoring@0.2.1__

Normalize issue-authoring orchestration/reference docs to canonical MCP tool naming (`mcp_github::tool`) for duplicate checks, ordered mutations, and issue-type lookup guidance.

Maintains MCP-first behavior and adds documented GraphQL fallback query assets for parent/sub-issue and issue-type operations where MCP write coverage is unavailable.

refs equinor/fusion-skills#40
resolves equinor/fusion-core-tasks#446

---

__🎯 [fix(skills): normalize MCP contracts and centralize GraphQL fallback assets #42](https://github.com/equinor/fusion-skills/pull/42)<br/>
🗂️ [947c0ab](https://github.com/equinor/fusion-skills/commit/947c0ab73844f5eb13b80e7cb2f3e5ea8146ea59)<br/>
📦 fusion-issue-task-planning@0.1.2__

Shift publish/repair execution in `fusion-issue-task-planning` to delegated handling through `fusion-issue-authoring` (prefer sub-agent invocation), while keeping this skill focused on planning and draft generation.

Clarifies that MCP-first mutation and GraphQL fallback behavior are enforced by the delegated authoring workflow.

Removes local `fusion-issue-task-planning/assets/graphql/` fallback files and points fallback usage to `fusion-issue-authoring/assets/graphql/`.

refs equinor/fusion-skills#40
resolves equinor/fusion-core-tasks#446

## v0.7.1

### Patch

__🎯 [fix(skills): smooth task-planning MCP publish flow #40](https://github.com/equinor/fusion-skills/pull/40)<br/>
🗂️ [cd68535](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290)<br/>
📦 fusion-github-review-resolution@0.1.1__

Add one-operation-per-file GraphQL assets for review-thread workflows and document the MCP-vs-GraphQL tooling map in the experimental `fusion-github-review-resolution` skill.

---

__🎯 [fix(skills): smooth task-planning MCP publish flow #40](https://github.com/equinor/fusion-skills/pull/40)<br/>
🗂️ [cd68535](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290)<br/>
📦 fusion-issue-solving@0.1.1__

Remove deprecated `origin` frontmatter metadata from the experimental `fusion-issue-solving` skill.

---

__🎯 [fix(skills): smooth task-planning MCP publish flow #40](https://github.com/equinor/fusion-skills/pull/40)<br/>
🗂️ [cd68535](https://github.com/equinor/fusion-skills/commit/cd685353575cca870a01e255cf1c13ccf6e55290)<br/>
📦 fusion-issue-task-planning@0.1.1__

Refine the experimental `fusion-issue-task-planning` workflow to be MCP-first for issue publishing and repair, clarify parent-linking as a separate sub-issue operation, and add reusable GraphQL fallback query/mutation files under `skills/.experimental/fusion-issue-task-planning/assets/graphql/`.

resolves equinor/fusion-skills#39

## v0.7.0

### Minor

__🎯 [feat(skills): add experimental fusion-issue-task-planning skill #37](https://github.com/equinor/fusion-skills/pull/37)<br/>
🗂️ [54d03bc](https://github.com/equinor/fusion-skills/commit/54d03bcc21bdf71c0f8aefa5f00c3ded7f22b3b9)<br/>
📦 fusion-issue-task-planning@0.1.0__

Add experimental `fusion-issue-task-planning` skill with user-story task planning workflow, explicit publish gates, provenance metadata, and reusable planning assets.

References equinor/fusion-core-tasks#430.

## v0.6.0

### Minor

__🎯 [feat(skills): add experimental fusion-issue-solving skill #35](https://github.com/equinor/fusion-skills/pull/35)<br/>
🗂️ [73809e4](https://github.com/equinor/fusion-skills/commit/73809e42d8cac011c6ba5e5c06fa321cb82ab9f7)<br/>
📦 fusion-issue-solving@0.1.0__

Add experimental `fusion-issue-solving` skill under `skills/.experimental/` with a structured workflow for issue intake, planning, implementation, validation, and PR-ready reporting.

Includes a companion execution checklist asset for consistent progress tracking.

resolves equinor/fusion-core-tasks#432

## v0.5.0

### Minor

__🎯 [feat(skills): add experimental github review resolution skill #33](https://github.com/equinor/fusion-skills/pull/33)<br/>
🗂️ [c8b513c](https://github.com/equinor/fusion-skills/commit/c8b513cb9070f73fa5c90464dc8ecfd29fab3a0c)<br/>
📦 fusion-github-review-resolution@0.1.0__

Add experimental `fusion-github-review-resolution` skill with a deterministic workflow for unresolved PR review comments, including review-url trigger guidance, per-comment remediation process, and checklist support.

Add companion bash helpers:
- `skills/.experimental/fusion-github-review-resolution/scripts/get-review-comments.sh`
- `skills/.experimental/fusion-github-review-resolution/scripts/resolve-review-comments.sh`

The scripts support review-id scoped collection and safe dry-run-first resolution flows using `gh`.

resolves equinor/fusion-core-tasks#432

---

__🎯 [feat: add experimental fusion-mcp setup skill #30](https://github.com/equinor/fusion-skills/pull/30)<br/>
🗂️ [1ad69fb](https://github.com/equinor/fusion-skills/commit/1ad69fb80e6f8c9050f40b26b10e281a376f15e7)<br/>
📦 fusion-mcp@0.1.0__

Add an experimental `fusion-mcp` skill scoped to VS Code + Docker setup, with prerequisite guidance, MCP client configuration instructions, actionable troubleshooting, and MCP JSON-RPC validation examples including a non-empty basic query pass check.

Bug-report guidance and template updates are tracked in a dedicated follow-up changeset.

resolves equinor/fusion-core-tasks#409

### Patch

__🎯 [feat: add experimental fusion-mcp setup skill #30](https://github.com/equinor/fusion-skills/pull/30)<br/>
🗂️ [1ad69fb](https://github.com/equinor/fusion-skills/commit/1ad69fb80e6f8c9050f40b26b10e281a376f15e7)<br/>
📦 fusion-mcp@0.1.0__

Add bug report guidance and template usage for MCP setup failures/misbehavior, including default issue-target guidance in the skill and sanitized report structure.

resolves equinor/fusion-core-tasks#413

## v0.4.0

### Minor

__🎯 [feat(skills): add fusion-skill-self-report-bug #28](https://github.com/equinor/fusion-skills/pull/28)<br/>
🗂️ [443ec19](https://github.com/equinor/fusion-skills/commit/443ec197e8a6e9705cf471f29fd0b4400b79c081)<br/>
📦 fusion-skill-self-report-bug@0.1.0__

Add a new skill that self-reports Fusion skill workflow failures into a structured local bug draft with explicit confirmation gates before any GitHub mutation.

resolves equinor/fusion-core-tasks#403

## v0.3.0

### Minor

__🎯 [docs(skills): migrate issue-authoring docs to mcp #23](https://github.com/equinor/fusion-skills/pull/23)<br/>
🗂️ [14b9c99](https://github.com/equinor/fusion-skills/commit/14b9c9902dbf8bafdae9fe0fc6c08c81dec004b1)<br/>
📦 fusion-issue-author-bug@0.1.1<br/>
📦 fusion-issue-author-feature@0.1.1<br/>
📦 fusion-issue-author-task@0.1.1<br/>
📦 fusion-issue-author-user-story@0.1.1<br/>
📦 fusion-issue-authoring@0.2.0<br/>
📦 fusion-skill-authoring@0.2.1__

Migrate issue authoring guidance from helper scripts to GitHub MCP-first workflows, including MCP metadata declarations and updated orchestration/ref docs.

resolves equinor/fusion-skills#21

## v0.2.1

### Patch

__🎯 [Clarify issue-closing keyword guidance across skill and contributor docs #20](https://github.com/equinor/fusion-skills/pull/20)<br/>
🗂️ [66d85b8](https://github.com/equinor/fusion-skills/commit/66d85b8200f7712fd916148e75906bf7fa15101c)<br/>
📦 fusion-issue-authoring@0.1.1__

- align wording to keyword families (`fix|fixes|resolve|resolves|close|closes`)
- standardize direct issue reference examples (`owner/repo#123`)
- keep `Refs`/`Ref` as the default for non-closing references

---

__🎯 [Improve issue automation reliability in fusion-issue-authoring #13](https://github.com/equinor/fusion-skills/pull/13)<br/>
🗂️ [205df94](https://github.com/equinor/fusion-skills/commit/205df948ffaaf785e15f2cacd392126ca4c398e3)<br/>
📦 fusion-issue-authoring@0.1.1__

- switch issue-type updates to GraphQL `updateIssue(issueTypeId: ...)` in shell and PowerShell helpers
- add explicit post-update verification output for issue type
- guard `set -u` in VS Code integrated zsh sessions to avoid shell integration hook failures
- update runbook/docs snippets to use the robust pattern and verification command

resolves equinor/fusion-core-tasks#402

## v0.2.0

### Minor

__🎯 [Adds structured frontmatter metadata for discoverability and clarifies skill relationship semantics #10](https://github.com/equinor/fusion-skills/pull/10)<br/>
🗂️ [d473723](https://github.com/equinor/fusion-skills/commit/d4737239be54736e344d74be4ce8271b9be84313)<br/>
📦 fusion-issue-author-bug@0.1.0<br/>
📦 fusion-issue-author-feature@0.1.0<br/>
📦 fusion-issue-author-task@0.1.0<br/>
📦 fusion-issue-author-user-story@0.1.0<br/>
📦 fusion-issue-authoring@0.1.0<br/>
📦 fusion-skill-authoring@0.2.0__

Scope delivered:
- Added `metadata.tags` to affected skills for discoverability.
- Renamed relationship keys to a clearer schema: `skill_role` → `role`, `required_skill` → `orchestrator`, `sub_skills` → `skills`.
- Updated dependent role value from `subskill` to `subordinate` to explicitly indicate orchestrator dependency.
- Updated skill authoring guidance to document `metadata.role`, `metadata.orchestrator`, `metadata.skills`, and `metadata.tags`.

---

__🎯 [Implements equinor/fusion-core-tasks#395 (sub-task of #391) by restructuring issue authoring skills into a top-level orchestrator plus type-specific specialists #7](https://github.com/equinor/fusion-skills/pull/7)<br/>
🗂️ [2194e7a](https://github.com/equinor/fusion-skills/commit/2194e7a99f6055dd394dffca6e0e6286d3bb2d41)<br/>
📦 fusion-issue-author-bug@0.1.0<br/>
📦 fusion-issue-author-feature@0.1.0<br/>
📦 fusion-issue-author-task@0.1.0<br/>
📦 fusion-issue-author-user-story@0.1.0<br/>
📦 fusion-issue-authoring@0.1.0__

Refs: `equinor/fusion-core-tasks#391`

closes equinor/fusion-core-tasks#395

Scope delivered:
- `fusion-issue-authoring` is now the orchestration layer for shared gates (classification, labels, assignee, confirmation, publish flow).
- Added specialist skills: `fusion-issue-author-bug`, `fusion-issue-author-feature`, `fusion-issue-author-user-story`, and `fusion-issue-author-task`.
- Specialist skills now explicitly depend on `fusion-issue-authoring` and keep only type-specific guidance.
- Moved fallback templates from shared assets to each specialist skill’s own `assets/issue-templates/`.
- Added label listing helpers: `list-labels.sh` and `list-labels.ps1`.
- Hardened relationship scripts for reliable GraphQL calls and idempotent "already linked" handling.

---

__🎯 [Updates skill authoring defaults and metadata constraints to support complex repository-internal skill relationships #7](https://github.com/equinor/fusion-skills/pull/7)<br/>
🗂️ [2194e7a](https://github.com/equinor/fusion-skills/commit/2194e7a99f6055dd394dffca6e0e6286d3bb2d41)<br/>
📦 fusion-skill-authoring@0.2.0__

Scope delivered:
- Permitted YAML arrays in frontmatter `metadata` specifically for modeling skill relationships (e.g., `metadata.sub_skills` or `metadata.required_skill`).
- Updated documentation and checklists to reflect the new versioning and metadata standards.

## v0.1.1

### Patch

__🎯 [Fix wording in the skill changelog and align metadata/versioning consistency for the updated skill package #4](https://github.com/equinor/fusion-skills/pull/4)<br/>
🗂️ [7dad576](https://github.com/equinor/fusion-skills/commit/7dad5761f18701c15048130951d150e477c95189)<br/>
📦 fusion-skill-authoring@0.1.1__

- Fix wording in the skill changelog and align metadata/versioning consistency for the updated skill package.

## v0.1.0

### Minor

__🎯 [New authoring skill to standardize how skills are created and reduce inconsistency #2](https://github.com/equinor/fusion-skills/pull/2)<br/>
🗂️ [57d6f8b](https://github.com/equinor/fusion-skills/commit/57d6f8b744fe5e3e4b0e4e61a229d009d4bbb32f)<br/>
📦 fusion-skill-authoring@0.1.0__

The skill guides contributors to reuse existing skills when possible, collect required inputs, scaffold the skill structure, and run validation/checklist steps.
