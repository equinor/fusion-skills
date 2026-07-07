# Error Messages

An error message tells the user something went wrong, why, and what to do next. Grounded in `docs/patterns/error-messages.md` and the error/status voice in `docs/guidelines/ux-writing.md`.

---

## Placement

- **Show the error where the problem is** — inline, next to or in place of the element/region that failed. Not as a global overlay.
- **Modal `Dialog` only for critical, blocking errors.** A non-blocking failure (e.g. a failed data load) uses an inline message, not a modal.
- **Never use a snackbar or toast for an actionable error** — it disappears before the user can act. Toasts are for transient confirmations only.
- **Don't show errors before the user has acted.** Validate after submit; for error-prone inputs, give real-time guidance instead of pre-emptive blocking errors.

## Content

- State, in order: **what happened → the cause (if useful) → the next step.** Put the key info first.
- Plain, concise language — no jargon the user can't act on. `Save failed. Please try again.` not `Request failed with status 500`.
- Give a specific fix when possible (`Use DD/MM/YYYY format`). If recovery is out of the user's hands, say when/how the system will recover.

## Voice (impersonal, non-blaming)

- Use impersonal, action-named phrasing. **Not** first person, **not** user-blaming:
  - ✅ `Save failed — permission may be required.`
  - ❌ `We couldn't save` (consumer voice)
  - ❌ `You don't have permission` (blames the user)
- For high-impact failures (downtime, data loss), acknowledge with empathy and confirm recovery is in progress.
- No humour.

## Efficiency & support

- **Preserve user input** after an error — never clear the form. Highlight the problematic field while keeping the entry.
- **Provide escalation affordances:** an **Error ID**, a **Copy** button, and a **Show details** control for technical context.
- **Confirm when resolved** — once fixed (by user or system), show a clear confirmation (`Connection restored. Changes synced.`).

## Accessibility

- Screen-reader friendly; sufficient contrast; never rely on colour alone to signal an error.
- Use EDS components and `Typography` — no bare HTML text.
