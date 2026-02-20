# Changelog

## 0.2.0 - 2026-02-20

### minor

- [#10](https://github.com/equinor/fusion-skills/pull/10) [`d473723`](https://github.com/equinor/fusion-skills/commit/d4737239be54736e344d74be4ce8271b9be84313) - Adds structured frontmatter metadata for discoverability and clarifies skill relationship semantics.


  Scope delivered:
  - Added `metadata.tags` to affected skills for discoverability.
  - Renamed relationship keys to a clearer schema: `skill_role` → `role`, `required_skill` → `orchestrator`, `sub_skills` → `skills`.
  - Updated dependent role value from `subskill` to `subordinate` to explicitly indicate orchestrator dependency.
  - Updated skill authoring guidance to document `metadata.role`, `metadata.orchestrator`, `metadata.skills`, and `metadata.tags`.

- [#7](https://github.com/equinor/fusion-skills/pull/7) [`2194e7a`](https://github.com/equinor/fusion-skills/commit/2194e7a99f6055dd394dffca6e0e6286d3bb2d41) - Updates skill authoring defaults and metadata constraints to support complex repository-internal skill relationships.


  Scope delivered:
  - Permitted YAML arrays in frontmatter `metadata` specifically for modeling skill relationships (e.g., `metadata.sub_skills` or `metadata.required_skill`).
  - Updated documentation and checklists to reflect the new versioning and metadata standards.

## 0.1.1 - 2026-02-20

### patch

- [#4](https://github.com/equinor/fusion-skills/pull/4) [`7dad576`](https://github.com/equinor/fusion-skills/commit/7dad5761f18701c15048130951d150e477c95189) - Fix wording in the skill changelog and align metadata/versioning consistency for the updated skill package.

## 0.1.0 - 2026-02-19

### minor

- [#2](https://github.com/equinor/fusion-skills/pull/2) [`57d6f8b`](https://github.com/equinor/fusion-skills/commit/57d6f8b744fe5e3e4b0e4e61a229d009d4bbb32f) - New authoring skill to standardize how skills are created and reduce inconsistency. 

  The skill guides contributors to reuse existing skills when possible, collect required inputs, scaffold the skill structure, and run validation/checklist steps.
