---
"fusion-developer-app": minor
---

Add custom Fusion Framework module authoring reference

- Add `references/using-custom-modules.md` covering the IModule contract, wiring into `config.ts`, accessing via `useAppModule`, module lifecycle, file structure, and common pitfalls (naming conflicts, outside-React access, un-awaited config)
- Update `SKILL.md` Step 6 module table with a `using-custom-modules.md` entry
- Add custom-module-related activation triggers

resolves equinor/fusion-core-tasks#753
