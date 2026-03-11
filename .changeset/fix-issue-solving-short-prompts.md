---
"fusion-issue-solving": patch
---

Strengthen issue-solving discovery cues for short prompts and direct GitHub issue URLs.

- move representative activation phrases into the frontmatter description so semantic routing can match `solve #123`, `lets solve #123`, and full `https://github.com/owner/repo/issues/123` prompts
- clarify that direct GitHub issue URLs can stand in for `#123` references, including URL-first prompts

resolves equinor/fusion-skills#66
