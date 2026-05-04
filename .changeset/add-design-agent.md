---
"fusion-developer-app": minor
---

Add design agent to fusion-developer-app

- Add `agents/design.md` helper agent covering Fusion Portal shell composition, layout zone nesting, side panel usage (SideSheet), empty/loading state patterns, and structural anti-patterns
- Update `SKILL.md` Step 4 to reference `design.md` for page/view structure review and `styling.md` for component-level checks
- Update helper agents section to include `design.md` with clear scope boundary vs `styling.md`

Agent references `equinor-design-system` system skill for authoritative token and layout zone ground truth, and delegates component-level EDS checks to `agents/styling.md`.

resolves equinor/fusion-core-tasks#860
