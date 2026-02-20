# Where to start

## Quick start (add a new skill)

1. Choose where the skill belongs (stable, preview, or system).

   Reserved folders under `skills/` (names starting with `.`) are conventions used in this repo:
   - `skills/.experimental/fusion-<skill-name>/` – preview / in-development skills
   - `skills/.curated/fusion-<skill-name>/` – curated, high-confidence skills intended for broad reuse
   - `skills/.system/` – internal/system skills and shared building blocks

   If unsure, start in `skills/.experimental/` and promote later.

2. Create the skill folder:
   - `skills/fusion-<skill-name>/` (default)
   - or `skills/.experimental/fusion-<skill-name>/`
   - or `skills/.curated/fusion-<skill-name>/`

   Use kebab-case for `<skill-name>`, and keep the name stable.

3. Add the required file:
   - `skills/fusion-<skill-name>/SKILL.md`

4. Add supporting folders only when needed:
   - `references/` for long docs, checklists, and examples
   - `assets/` for static assets referenced by docs
   - `scripts/` for helper scripts (security-sensitive)

5. Use Conventional Commits for your commit messages.
   - Examples: `feat: add new skill scaffold`, `fix: tighten script safety guidance`, `docs: clarify changeset expectations`.
   - If you need to include follow-up doc fixes in the latest commit, use `git commit --amend`.

6. Open a PR.
   - If your skill adds or modifies anything under `scripts/`, expect deeper review.

## Questions and uncertainty

If naming, safety constraints, or ownership are unclear, open a draft PR early and document the open questions in the PR description.
