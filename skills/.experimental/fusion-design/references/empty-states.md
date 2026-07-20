# Empty States

An empty state communicates that no content is available yet — on first use, after deletion, when a filter matches nothing, or when access is restricted. Done well it orients the user and offers a path forward. Grounded in `docs/patterns/empty-states.md`.

---

## Rules

- **An empty state is not an error.** If something is *wrong*, that's an error message (see `error-messages.md`). An empty state means the app is working, there's just no content. Never show both at once, and never borrow error styling/language (no error icon, no red/danger colour, no failure wording).
- **Use positive, action-oriented titles.** `Start by adding data` — never `No data found` / `No results`. Negative phrasing discourages.
- **Explain the next step in the body.** State what to do (and briefly why the space is empty if it isn't obvious). Highlight the benefit of acting.
- **At most one primary action; two actions total is the hard limit.** Empty states are calm — don't overcrowd.
- **Never use an empty state as decorative filler.** Every element must serve the user's next action.
- Use EDS components and `Typography` — no bare HTML text.

## Anatomy

| Element | Guidance |
|---|---|
| Icon | Informational icon signalling the context |
| Title | Positive phrasing — `Start by creating a report` |
| Subheading (optional) | Secondary context supporting the title |
| Body | The next step, and the benefit of taking it |
| Primary action (optional) | One CTA — button or inline link |
| Secondary action (optional) | A supporting link, e.g. to a help article |

## Component choice

| Component | Use when |
|---|---|
| **Message** | Persistent UI — lists, tables, dashboards where content is expected but absent. The default for a page/section empty state. |
| **Banner** | Contextual, non-disruptive notice — e.g. missing permissions or a setup step. |
| **Dialog** | The empty state requires immediate action/awareness — first-time setup, critical missing config, onboarding. |

> **"Message" is a pattern, not an importable component.** `@equinor/eds-core-react` has **no `Message` export** — build it as a composition of EDS primitives: a centred container with an informational `Icon`, `Typography` for the title/body, and at most one (two total) `Button`. For the other two rows, use the real EDS components: `Banner` (with `BannerIcon`/`BannerMessage`/`BannerActions`) and `Dialog`.

## Common contexts

| Context | Copy angle |
|---|---|
| First use (nothing created yet) | Invite creation — `Start by creating your first …` |
| Filter/search returns nothing | `No results match …` + a way to clear the filter (distinct from first-use) |
| Access restricted / temporary issue | Explain gently without framing it as the user's failure |
