---
"fusion-design": patch
---

Add action and layout references; fix typography and table-width guidance

- Add `references/actions.md`: action bar (experimental), destructive-action `Dialog` structure, and button placement rules
- Add `references/layout-centered-content.md`: centered-content layout rules for form- and reading-heavy pages
- `references/eds-typography.md`: document the grouped-variant trap — `cell_header`/`cell_text` require `group="table"` (passes typecheck but crashes at runtime without it); prefer group-free quick variants
- `references/layout.md`: data tables and lists must fill the full content width (`width: 100%`) in the full-width pattern
- `SKILL.md`: add `actions.md` to the references table
