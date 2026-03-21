# Issue authoring

All issues related to this repository must be drafted and published using the **`fusion-issue-authoring`** skill.

The skill enforces draft-first review, reads this repository's contributor guides to resolve the correct destination automatically, and walks through a confirm-before-publish gate — so no issue lands in the wrong tracker or goes out half-baked.

## Where issues go

| Issue type | Repository |
|---|---|
| Bug, CI failure, tooling error, skill regression | [equinor/fusion-skills](https://github.com/equinor/fusion-skills/issues) |
| Feature, user story, task, improvement | [equinor/fusion-core-tasks](https://github.com/equinor/fusion-core-tasks) |

## Install the skill

If you don't have it installed, ask Copilot:

> "find a skill for issue authoring"

## How to use

Just describe what you want — the skill classifies, templates, routes, and drafts:

- "create an issue for X"
- "draft a bug report"
- "turn this into a task"
- "update issue #123"

## Why the skill, not a manual issue form?

- Applies the right template (repository template or type-specific fallback).
- Checks for duplicates before drafting.
- Confirms routing against this repo's contributor guides — no wrong-tracker mistakes.
- Enforces a confirm-before-publish gate — no accidental mutations.
- Caches label and assignee lookups to minimize back-and-forth.
- Ensures full issue references (`owner/repo#123`) and closing keywords are used consistently.

Skipping the skill means skipping these gates.
