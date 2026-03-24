# Changelog

All notable changes to this repository are documented in this file.

## v0.19.1

### Patch

__🎯 [fix: harden governance guardrails and add governance-link validation #126](https://github.com/equinor/fusion-skills/pull/126)<br/>
🗂️ [1470bc8](https://github.com/equinor/fusion-skills/commit/1470bc81e1b04e9727049f01742ea881579ad57b)<br/>
📦 fusion-dependency-review@0.1.3__

Add repository-policy handoff section for governance alignment

- Add explicit "Repository-policy handoff" section that defers commit, validation, changeset, and PR rules to repo-local instructions
- Update source-control-advisor to also defer to repo-local workflow instructions

Resolves equinor/fusion-core-tasks#581

---

__🎯 [fix: harden governance guardrails and add governance-link validation #126](https://github.com/equinor/fusion-skills/pull/126)<br/>
🗂️ [1470bc8](https://github.com/equinor/fusion-skills/commit/1470bc81e1b04e9727049f01742ea881579ad57b)<br/>
📦 fusion-issue-solving@0.1.6__

Add repository-policy handoff section for governance alignment

- Add explicit "Repository-policy handoff" section that defers commit, validation, changeset, and PR rules to repo-local instructions

Resolves equinor/fusion-core-tasks#581

---

__🎯 [fix: harden governance guardrails and add governance-link validation #126](https://github.com/equinor/fusion-skills/pull/126)<br/>
🗂️ [1470bc8](https://github.com/equinor/fusion-skills/commit/1470bc81e1b04e9727049f01742ea881579ad57b)<br/>
📦 fusion-issue-task-planning@0.1.5__

Add repository-policy handoff section for governance alignment

- Add explicit "Repository-policy handoff" section that defers issue type, changeset, and PR rules to repo-local instructions

Resolves equinor/fusion-core-tasks#581

---

__🎯 [fix: harden governance guardrails and add governance-link validation #126](https://github.com/equinor/fusion-skills/pull/126)<br/>
🗂️ [1470bc8](https://github.com/equinor/fusion-skills/commit/1470bc81e1b04e9727049f01742ea881579ad57b)<br/>
📦 fusion-github-review-resolution@0.1.6__

Add repository-policy handoff section for governance alignment

- Add explicit "Repository-policy handoff" section that defers commit, validation, changeset, and PR rules to repo-local instructions
- Keeps the skill portable while ensuring repo-local policy takes precedence when present

Resolves equinor/fusion-core-tasks#581

## v0.19.0

### Minor

__🎯 [feat(skills): rename fusion-app-react-dev to fusion-developer-app #124](https://github.com/equinor/fusion-skills/pull/124)<br/>
🗂️ [42150b6](https://github.com/equinor/fusion-skills/commit/42150b62e1aa14c3c08007258a73d6902bb4dceb)<br/>
📦 fusion-developer-app@0.1.0__

Add fusion-developer-app skill (renamed from fusion-app-react-dev)

- New skill with the same capability as fusion-app-react-dev under the fusion-developer-* naming convention
- Aligns naming with fusion-developer-portal and other developer-facing skills
- Content migrated from fusion-app-react-dev v0.2.0

Resolves equinor/fusion-core-tasks#848

### Patch

__🎯 [Update C# conventions for clarity and consistency #120](https://github.com/equinor/fusion-skills/pull/120)<br/>
🗂️ [5eb8e4d](https://github.com/equinor/fusion-skills/commit/5eb8e4d4af2fd8d1cb11d042339100cb1197753d)<br/>
📦 fusion-code-conventions@0.1.2__

Improve C# conventions for clarity and consistency

- Separate Controllers/ and Endpoints/ into distinct lines in the project layout to avoid ambiguity
- Clarify Startup.cs guidance to distinguish the older Startup class pattern from the .NET 6+ minimal hosting model
- Broaden error-handling guidance to cover both minimal API and MVC ProblemDetails helpers across supported target frameworks

---

__🎯 [feat(skills): add fusion-developer-portal skill for portal shell development #123](https://github.com/equinor/fusion-skills/pull/123)<br/>
🗂️ [aa9fc17](https://github.com/equinor/fusion-skills/commit/aa9fc1707ca4c95edc15f2ef3068a3175c47670e)<br/>
📦 fusion-developer-portal@0.0.1__

Add fusion-developer-portal skill for Fusion portal shell development

- Guides scaffolding portals with the Fusion Framework CLI (`ffc portal dev/build/upload`)
- Documents portal-level module configuration (`FrameworkConfigurator` vs `AppModuleInitiator`)
- Covers app loading (Apploader component, useApploader hook, custom AppLoader with RxJS)
- Includes portal routing, chrome (header, context selector), analytics, and telemetry
- Reference file with full portal architecture patterns from framework cookbooks

resolves equinor/fusion-core-tasks#752

---

__🎯 [feat: add devil's advocate agents for issue and skill authoring #121](https://github.com/equinor/fusion-skills/pull/121)<br/>
🗂️ [831f8ee](https://github.com/equinor/fusion-skills/commit/831f8eed3054ee747d3300c9144312ef3b5c02e0)<br/>
📦 fusion-issue-authoring@0.3.2__

Add devil's advocate agent for issue authoring

- Always-on moderate mode raises 2-3 key concerns after classification
- Interrogator mode runs full structured interview on explicit user request or when scope/criteria gaps are significant
- Wired into SKILL.md agent modes section

Refs: equinor/fusion-core-tasks#847

---

__🎯 [feat(skills): rename fusion-app-react-dev to fusion-developer-app #124](https://github.com/equinor/fusion-skills/pull/124)<br/>
🗂️ [42150b6](https://github.com/equinor/fusion-skills/commit/42150b62e1aa14c3c08007258a73d6902bb4dceb)<br/>
📦 fusion-app-react-dev@0.2.1__

Deprecate fusion-app-react-dev in favor of fusion-developer-app

- Set status to deprecated with successor pointer to fusion-developer-app
- Added deprecation notice and migration guidance to SKILL.md
- Moved to skills/.deprecated/

Resolves equinor/fusion-core-tasks#848

---

__🎯 [feat: add devil's advocate agents for issue and skill authoring #121](https://github.com/equinor/fusion-skills/pull/121)<br/>
🗂️ [831f8ee](https://github.com/equinor/fusion-skills/commit/831f8eed3054ee747d3300c9144312ef3b5c02e0)<br/>
📦 fusion-skill-authoring@0.3.3__

Add devil's advocate agent for skill authoring

- Always-on moderate mode raises 2-3 key concerns during scoping/drafting
- Interrogator mode runs full structured interview on explicit user request or when the orchestrator detects significant ambiguity
- Wired into SKILL.md helper agents and Step 6 validation sections

Refs: equinor/fusion-core-tasks#847

## v0.18.1

### Patch

__🎯 [docs(fusion-code-conventions): clarify repo-level precedence over skill defaults #118](https://github.com/equinor/fusion-skills/pull/118)<br/>
🗂️ [90e0ee2](https://github.com/equinor/fusion-skills/commit/90e0ee2c0f14b3e0c5e0073839b6679baea16295)<br/>
📦 fusion-code-conventions@0.1.1__

Clarify default rules vs repository-level precedence for agents

- Add "Precedence and applicability" section to SKILL.md establishing resolution order: repo policy > tooling config > skill defaults
- Add applicability callout to all four convention reference files (TypeScript, React, C#, Markdown)
- Guide maintainers to record overrides in CONTRIBUTING.md, contributor guides, or ADRs

Resolves equinor/fusion-core-tasks#842

## v0.18.0

### Minor

__🎯 [feat: add fusion-rules gateway and fusion-rule-author support skill #116](https://github.com/equinor/fusion-skills/pull/116)<br/>
🗂️ [2037597](https://github.com/equinor/fusion-skills/commit/20375978cba700b828b5c912e7159ef117ee2422)<br/>
📦 fusion-rule-author@0.1.0__

Add fusion-rule-author support skill with workflow, templates, and references

Internal support skill providing the canonical 7-step authoring workflow, starter templates, frontmatter scenarios, follow-up questions, quality checklist, and tech-stack examples for GitHub Copilot, Cursor, and Claude Code rule files.

---

__🎯 [feat: add fusion-rules gateway and fusion-rule-author support skill #116](https://github.com/equinor/fusion-skills/pull/116)<br/>
🗂️ [2037597](https://github.com/equinor/fusion-skills/commit/20375978cba700b828b5c912e7159ef117ee2422)<br/>
📦 fusion-rules@0.1.0__

Add fusion-rules gateway skill for AI coding assistant rule authoring

Gateway entrypoint that detects the target editor (GitHub Copilot, Cursor, Claude Code) and routes to the matching agent for guided rule scaffolding.

- `agents/copilot.agent.md` — GitHub Copilot instructions workflow
- `agents/cursor.agent.md` — Cursor project rules workflow
- `agents/claude-code.agent.md` — Claude Code rules workflow

## v0.17.1

### Patch

__🎯 [feat(workflow): auto-install successor when removing deprecated skills #114](https://github.com/equinor/fusion-skills/pull/114)<br/>
🗂️ [ba55a17](https://github.com/equinor/fusion-skills/commit/ba55a1781dc2860af47c2645a08bdf9ede7e385b)__

Document `skip-successor-install` and `skills-source` inputs in sync-workflows reference

Update `references/sync-workflows.md` to document the two new workflow inputs added to
`skills-update.yml` for automated successor installation during deprecation cleanup.

Resolves equinor/fusion-core-tasks#841

## v0.17.0

### Minor

__🎯 [feat: add fusion main gate and fusion-skills lifecycle orchestrator #113](https://github.com/equinor/fusion-skills/pull/113)<br/>
🗂️ [d777366](https://github.com/equinor/fusion-skills/commit/d777366fe6e1b710876a8e1abd2f311e3f4440c4)<br/>
📦 fusion@0.1.0__

Add `fusion` skill — main Copilot gate for the Fusion ecosystem

Introduces `skills/fusion` as the universal cross-domain router. Routes any Fusion-related request to the right installed skill: `fusion-skills` (skill lifecycle), `fusion-issue-authoring`, `fusion-issue-solving`, `fusion-issue-task-planning`, `fusion-github-review-resolution`, `fusion-dependency-review`. Includes status column (active/experimental), loop prevention, first-contact response, and MCP fallback guidance.

Related to: equinor/fusion-core-tasks#470

---

__🎯 [feat(fusion-research): add docs domain for platform documentation research #110](https://github.com/equinor/fusion-skills/pull/110)<br/>
🗂️ [859fd0c](https://github.com/equinor/fusion-skills/commit/859fd0c466884178169e7c14fd29565ad6a0d156)<br/>
📦 fusion-research@0.3.0__

Add docs domain to fusion-research skill

- Add `agents/docs.agent.md` routing platform documentation questions to `mcp_fusion_search_docs`
- Add `assets/docs.follow-up.md` for pre-dispatch scope questions
- Add `references/docs.query.md` with proven query lanes for docs retrieval
- Update SKILL.md description, classification table, dispatch table, agents list, and assets list to cover the new Docs domain
- Docs domain covers: Fusion platform concepts, onboarding, platform operations, and governance

Resolves equinor/fusion-core-tasks#411

---

__🎯 [feat: add fusion main gate and fusion-skills lifecycle orchestrator #113](https://github.com/equinor/fusion-skills/pull/113)<br/>
🗂️ [d777366](https://github.com/equinor/fusion-skills/commit/d777366fe6e1b710876a8e1abd2f311e3f4440c4)__

Add `fusion-skills` skill — agentic entrypoint for all Fusion skill lifecycle operations

New skill with four focused agents:
- **discovery** — find skills by task, list installed skills, proactive promotion via Fusion MCP semantic search
- **greenkeeper** — install, update, remove, check for updates, and set up automated sync/discovery workflows
- **author** — clarify and redirect skill creation/improvement requests to `fusion-skill-authoring`
- **warden** — inspect SKILL.md for quality smells; report skill failures via inline bug drafting (supersedes `fusion-skill-self-report-bug`)

Includes `references/sync-workflows.md` (canonical workflow YAML patterns), `references/skill-catalog.md` (MCP fallback lookup), `references/follow-up-questions.md` (per-agent tiebreakers), and `assets/issue-templates/skill-workflow-failure-bug.md` (bug report template from deprecated skill).

Resolves equinor/fusion-core-tasks#470

### Patch

__🎯 [feat: add fusion main gate and fusion-skills lifecycle orchestrator #113](https://github.com/equinor/fusion-skills/pull/113)<br/>
🗂️ [d777366](https://github.com/equinor/fusion-skills/commit/d777366fe6e1b710876a8e1abd2f311e3f4440c4)<br/>
📦 fusion-discover-skills@0.1.5__

Deprecate `fusion-discover-skills` in favour of `fusion-skills`

All discovery, install, update, and remove functionality has been absorbed into the `discover` mode of `fusion-skills`. The skill is moved to `.deprecated/` with `metadata.status: deprecated` and `metadata.successor: fusion-skills`.

Install the replacement: `npx -y skills add equinor/fusion-skills fusion-skills`

---

__🎯 [feat: add fusion main gate and fusion-skills lifecycle orchestrator #113](https://github.com/equinor/fusion-skills/pull/113)<br/>
🗂️ [d777366](https://github.com/equinor/fusion-skills/commit/d777366fe6e1b710876a8e1abd2f311e3f4440c4)<br/>
📦 fusion-skill-self-report-bug@0.1.2__

Deprecate `fusion-skill-self-report-bug` in favour of the `warden` agent in `fusion-skills`

The bug reporting workflow has been inlined into `fusion-skills/agents/warden.agent.md`, which also adds proactive frustration detection and skill smell inspection. The `fusion-skill-self-report-bug` skill is no longer needed as a standalone install.

Superseded by the `warden` agent in `fusion-skills`.

---

__🎯 [docs: add issue routing guidance and contributor-guide-aware routing to fusion-issue-authoring #112](https://github.com/equinor/fusion-skills/pull/112)<br/>
🗂️ [e90fb97](https://github.com/equinor/fusion-skills/commit/e90fb97b20d1aceb0929dbc96bddf28fdf358f0a)<br/>
📦 fusion-issue-authoring@0.3.1__

Add contributor-guide-aware repository routing to issue authoring

- SKILL.md Step 2: read active workspace `CONTRIBUTING.md` / `contribute/` for routing rules before asking the user
- `references/instructions.md`: add Repository routing note pointing to SKILL.md Step 2 as authoritative flow

## v0.16.0

### Minor

__🎯 [feat(skills): merge feature-toggling into fusion-app-react-dev, deprecate experimental skill #108](https://github.com/equinor/fusion-skills/pull/108)<br/>
🗂️ [5573046](https://github.com/equinor/fusion-skills/commit/5573046cc9534d48740c6487690d2db3956c5a3b)<br/>
📦 fusion-app-react-dev@0.2.0__

Add feature-flag guidance as `references/using-feature-flags.md`

- Covers app-level `enableFeatureFlag` + `useFeature` from `@equinor/fusion-framework-react-app/feature-flag`
- Covers framework-level `enableFeatureFlagging` with `createLocalStoragePlugin` and `createUrlPlugin` from `@equinor/fusion-framework-module-feature-flag`
- Documents provider-based `useFeature(provider, key)` variant
- Includes rollout checklist and cleanup guidance
- Calls out `readonly` vs `readOnly` API ambiguity
- Updated Step 6 module table and trigger phrases in SKILL.md to point to the new reference

resolves equinor/fusion-core-tasks#840

### Patch

__🎯 [feat(skills): merge feature-toggling into fusion-app-react-dev, deprecate experimental skill #108](https://github.com/equinor/fusion-skills/pull/108)<br/>
🗂️ [5573046](https://github.com/equinor/fusion-skills/commit/5573046cc9534d48740c6487690d2db3956c5a3b)<br/>
📦 fusion-framework-feature-toggling@0.1.1__

Deprecate skill — content consolidated into `fusion-app-react-dev`

- Set `metadata.status: deprecated`, `metadata.successor: fusion-app-react-dev`
- Added `deprecated` tag
- Added deprecation notice in SKILL.md
- Moved from `skills/.experimental/` to `skills/.deprecated/`

resolves equinor/fusion-core-tasks#840

## v0.15.0

### Minor

__🎯 [feat: add fusion-code-conventions system skill #104](https://github.com/equinor/fusion-skills/pull/104)<br/>
🗂️ [67bfabd](https://github.com/equinor/fusion-skills/commit/67bfabd6c3e950dc7681a000eebdc42bff3be5fb)<br/>
📦 fusion-code-conventions@0.1.0__

Add new `fusion-code-conventions` system skill — orchestrates TypeScript, React, C#, and Markdown convention checks, intent comment auditing, and ADR/contributor-doc constitution enforcement across language-specific agents.

---

__🎯 [feat(skills): add fusion-research multi-domain research orchestrator #106](https://github.com/equinor/fusion-skills/pull/106)<br/>
🗂️ [1f8a01d](https://github.com/equinor/fusion-skills/commit/1f8a01ddcb5c9afe9119a1fcf1ded2c6980036d0)<br/>
📦 fusion-research@0.2.0__

Rename `fusion-research-framework` to `fusion-research` and expand into a multi-domain research orchestrator.

- rename skill from `fusion-research-framework` to `fusion-research`
- expand scope from framework-only to three research domains: Framework, EDS, and skill catalog
- add `agents/framework.agent.md` — source-backed Fusion Framework API and cookbook research via `mcp_fusion_search_framework`
- add `agents/eds.agent.md` — source-backed EDS component props, usage, accessibility, and design token research via `mcp_fusion_search_eds`
- add `agents/skills.agent.md` — source-backed skill catalog lookup, scope boundary, and companion relationship research via `mcp_fusion_skills`
- add `assets/framework.follow-up.md`, `assets/eds.follow-up.md`, `assets/skills.follow-up.md` — pre-dispatch scope-sharpening questions per domain
- add `references/framework.query.md`, `references/eds.query.md`, `references/skills.query.md` — repeatable query patterns and evidence checklists per domain
- update `assets/source-backed-answer-template.md` to cover all three domains
- connect to `fusion-mcp` as next-step redirect when MCP is not yet running
- tighten discovery contract: description, trigger phrases, and "When not to use" boundaries
- apply council review fixes: remove erroneous `cookbook` lane reference from EDS agent, orphan follow-up assets linked from SKILL.md, `mcp_fusion_search_docs` added to suggested MCP list

Resolves equinor/fusion-core-tasks#837
Resolves equinor/fusion-core-tasks#838

### Patch

__🎯 [feat(skills): advertise mcp_fusion_search_skills for source-backed catalog retrieval #107](https://github.com/equinor/fusion-skills/pull/107)<br/>
🗂️ [d75d8c6](https://github.com/equinor/fusion-skills/commit/d75d8c60f15888fbe71340b53b2698f3361ac4c8)<br/>
📦 fusion-discover-skills@0.1.4__

Advertise `mcp_fusion_search_skills` for semantic discovery alongside advisory `mcp_fusion_skills`.

- add `mcp_fusion_search_skills` to `mcp.suggested`
- update compatibility line to distinguish source-backed search (`mcp_fusion_search_skills`) from advisory/lifecycle operations (`mcp_fusion_skills`)
- update step 4 in instructions to route discovery to `mcp_fusion_search_skills` and lifecycle to `mcp_fusion_skills`

Resolves equinor/fusion-core-tasks#834

---

__🎯 [feat(skills): advertise mcp_fusion_search_skills for source-backed catalog retrieval #107](https://github.com/equinor/fusion-skills/pull/107)<br/>
🗂️ [d75d8c6](https://github.com/equinor/fusion-skills/commit/d75d8c60f15888fbe71340b53b2698f3361ac4c8)<br/>
📦 fusion-mcp@0.1.2__

Document `search_skills` in the MCP server tool surface.

- add explicit tool listing to the setup instructions: `search_framework`, `search_docs`, `search_eds`, `search_skills`, `search_indexes`, `skills`, `skills_index_status`

Resolves equinor/fusion-core-tasks#834

---

__🎯 [feat(skills): advertise mcp_fusion_search_skills for source-backed catalog retrieval #107](https://github.com/equinor/fusion-skills/pull/107)<br/>
🗂️ [d75d8c6](https://github.com/equinor/fusion-skills/commit/d75d8c60f15888fbe71340b53b2698f3361ac4c8)<br/>
📦 fusion-research@0.2.0__

Switch skills catalog agent to `mcp_fusion_search_skills` for source-backed retrieval.

- update `agents/skills.agent.md` to use `mcp_fusion_search_skills` (semantic search over local skills index) instead of the advisory `mcp_fusion_skills`
- update `mcp.suggested` list in metadata: replace `mcp_fusion_skills` with `mcp_fusion_search_skills`
- update compatibility line and agent description to reflect the correct tool
- update source labels in `references/skills.query.md` evidence checklist

Resolves equinor/fusion-core-tasks#834

---

__🎯 [feat(skills): add fusion-research multi-domain research orchestrator #106](https://github.com/equinor/fusion-skills/pull/106)<br/>
🗂️ [1f8a01d](https://github.com/equinor/fusion-skills/commit/1f8a01ddcb5c9afe9119a1fcf1ded2c6980036d0)<br/>
📦 fusion-mcp@0.1.2__

Connect `fusion-mcp` to `fusion-research` as a next-step redirect.

- add "When not to use" entry directing source-backed research questions to `fusion-research` once MCP is running

---

__🎯 [feat: add fusion-code-conventions system skill #104](https://github.com/equinor/fusion-skills/pull/104)<br/>
🗂️ [67bfabd](https://github.com/equinor/fusion-skills/commit/67bfabd6c3e950dc7681a000eebdc42bff3be5fb)<br/>
📦 fusion-app-react-dev@0.1.2__

Delegate code convention checks to `fusion-code-conventions` skill — removes inline `references/code-conventions.md`, replaces Step 6 wall-of-links with a module routing table, and updates `code-quality` agent to aggregate findings from the dedicated conventions skill.

---

__🎯 [feat(skills): add fusion-research multi-domain research orchestrator #106](https://github.com/equinor/fusion-skills/pull/106)<br/>
🗂️ [1f8a01d](https://github.com/equinor/fusion-skills/commit/1f8a01ddcb5c9afe9119a1fcf1ded2c6980036d0)<br/>
📦 fusion-app-react-dev@0.1.2__

Update companion skill reference from `fusion-research-framework` to `fusion-research`.

- update `metadata.skills` entry to `fusion-research`
- update all inline references in SKILL.md and `agents/framework.md` to the renamed companion skill
- broaden companion description to reflect the expanded scope (Framework, EDS, and skill catalog research)

## v0.14.0

### Minor

__🎯 [feat(skills): add fusion-research-framework #103](https://github.com/equinor/fusion-skills/pull/103)<br/>
🗂️ [06b664d](https://github.com/equinor/fusion-skills/commit/06b664d177a01a760738ae3d43f1670e665f81fe)<br/>
📦 fusion-research-framework@0.1.0__

Add the `fusion-research-framework` skill under `skills/.system/` for source-backed Fusion Framework implementation lookup through MCP.

- route framework research to the framework-focused MCP index
- define repeatable search lanes for APIs, package docs, and cookbook examples
- require source-path and excerpt evidence before finalizing answers
- limit refinement to one pass and redirect out-of-scope requests cleanly

resolves equinor/fusion-core-tasks#410

### Patch

__🎯 [feat(skills): expand fusion app framework guides #101](https://github.com/equinor/fusion-skills/pull/101)<br/>
🗂️ [2bc25ee](https://github.com/equinor/fusion-skills/commit/2bc25eee94cd7bb80a8a9a0d1c844071fac0296f)<br/>
📦 fusion-app-react-dev@0.1.1__

Expand `fusion-app-react-dev` with focused framework guidance for app settings, bookmarks, runtime config and assets, and analytics.

- add dedicated references for the current settings, bookmark, runtime-config, and analytics surfaces
- improve module guidance and review checklists for these workflows
- broaden activation cues so the skill is easier to discover for common Fusion app tasks

resolves equinor/fusion-core-tasks#746
resolves equinor/fusion-core-tasks#747
resolves equinor/fusion-core-tasks#751
resolves equinor/fusion-core-tasks#754

---

__🎯 [feat(skills): add fusion-research-framework #103](https://github.com/equinor/fusion-skills/pull/103)<br/>
🗂️ [06b664d](https://github.com/equinor/fusion-skills/commit/06b664d177a01a760738ae3d43f1670e665f81fe)<br/>
📦 fusion-app-react-dev@0.1.1__

Teach `fusion-app-react-dev` to use the `fusion-research-framework` companion skill when implementation work depends on uncertain Fusion Framework APIs or examples.

- add companion-skill metadata for `fusion-research-framework`
- delegate framework API and package research before choosing app implementation patterns
- align the framework helper agent with the shared source-backed research workflow

## v0.13.0

### Minor

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-issue-authoring@0.3.0__

Consolidate issue-authoring capability into a single skill with agent modes

- Merge type-specific drafting logic from 4 subordinate skills into agent mode files (`agents/*.agent.md`)
- Move all 10 issue templates into `assets/issue-templates/` within this skill
- Update orchestrator to route to internal agent modes instead of external subordinate skills
- Retain full 8-step workflow, shared gates, caching strategy, and MCP mutation sequencing

Resolves equinor/fusion-core-tasks#802

### Patch

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-issue-author-bug@0.1.3__

Deprecate in favor of consolidated `fusion-issue-authoring` skill

- Set `metadata.status: deprecated` and `metadata.successor: fusion-issue-authoring`
- Move to `skills/.deprecated/` placement lane
- Add deprecation notice pointing to the consolidated skill

Resolves equinor/fusion-core-tasks#802

---

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-issue-author-feature@0.1.3__

Deprecate in favor of consolidated `fusion-issue-authoring` skill

- Set `metadata.status: deprecated` and `metadata.successor: fusion-issue-authoring`
- Move to `skills/.deprecated/` placement lane
- Add deprecation notice pointing to the consolidated skill

Resolves equinor/fusion-core-tasks#802

---

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-issue-author-task@0.1.3__

Deprecate in favor of consolidated `fusion-issue-authoring` skill

- Set `metadata.status: deprecated` and `metadata.successor: fusion-issue-authoring`
- Move to `skills/.deprecated/` placement lane
- Add deprecation notice pointing to the consolidated skill

Resolves equinor/fusion-core-tasks#802

---

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-issue-author-user-story@0.1.3__

Deprecate in favor of consolidated `fusion-issue-authoring` skill

- Set `metadata.status: deprecated` and `metadata.successor: fusion-issue-authoring`
- Move to `skills/.deprecated/` placement lane
- Add deprecation notice pointing to the consolidated skill

Resolves equinor/fusion-core-tasks#802

---

__🎯 [feat: consolidate issue-authoring skills into single skill with agent modes #98](https://github.com/equinor/fusion-skills/pull/98)<br/>
🗂️ [6bb9cdc](https://github.com/equinor/fusion-skills/commit/6bb9cdcc1e2e0ed25d562bfd5db4dfab52559c0f)<br/>
📦 fusion-skill-authoring@0.3.2__

Extract template baseline and validation signals to references/

- Move folder structure and SKILL.md baseline template to `references/skill-template-baseline.md`
- Move success/failure signals and recovery steps to `references/validation-signals.md`
- Reduce SKILL.md from 356 to 286 lines (below 300-line CI warning threshold)

## v0.12.1

### Patch

__🎯 [Add experimental Fusion API skills wave 1 and 2 #87](https://github.com/equinor/fusion-skills/pull/87)<br/>
🗂️ [62d3098](https://github.com/equinor/fusion-skills/commit/62d30981a36e29198d009d20e5e7a899451a9d02)<br/>
📦 fusion-core-services@0.0.1__

Add a consolidated experimental `fusion-core-services` skill that bundles the Fusion Core API references into a single installable catalog.

resolves equinor/fusion-core-tasks#791
resolves equinor/fusion-core-tasks#792

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
