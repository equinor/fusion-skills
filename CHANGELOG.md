# Changelog

All notable changes to this repository are documented in this file.

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
