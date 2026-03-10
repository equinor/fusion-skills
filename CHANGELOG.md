# Changelog

All notable changes to this repository are documented in this file.

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
