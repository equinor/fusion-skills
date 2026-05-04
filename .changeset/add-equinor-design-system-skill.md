---
"equinor-design-system": minor
---

Add equinor-design-system system skill

New `.system` subordinate skill encoding authoritative EDS design rules for agents:
- Color tokens (interactive, semantic, text, surface) with brand constraints
- Typography variant hierarchy and usage rules
- Spacing token reference (`--eds-space-*`)
- Elevation and shadow tokens
- Icon usage rules via `@equinor/eds-icons` + `Icon`
- Fusion Portal three-zone page layout conventions, empty/loading state patterns

Consumed by other skills and agents as a ground-truth lookup reference, not as a standalone workflow.

resolves equinor/fusion-core-tasks#859
