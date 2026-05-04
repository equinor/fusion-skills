---
"equinor-design-system": minor
---

Add equinor-design-system system skill

New `.system` subordinate skill encoding authoritative EDS design rules for agents:
- Color tokens (interactive, semantic, text, surface) with brand constraints
- Typography variant hierarchy and usage rules
- Spacing token reference (`--eds-spacing-horizontal-<size>` / `--eds-spacing-vertical-<size>`)
- Elevation: no CSS vars in EDS v2; guidance to use `Paper` component or JS token import
- Icon usage rules via `@equinor/eds-icons` + `<Icon data={...} />` (accessibility: `title` required)
- Fusion Portal three-zone page layout conventions, empty/loading state patterns

Consumed by other skills and agents as a ground-truth lookup reference, not as a standalone workflow.

resolves equinor/fusion-core-tasks#859
