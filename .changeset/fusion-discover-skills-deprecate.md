---
"fusion-discover-skills": patch
---

Deprecate `fusion-discover-skills` in favour of `fusion-skills`

All discovery, install, update, and remove functionality has been absorbed into the `discover` mode of `fusion-skills`. The skill is moved to `.deprecated/` with `metadata.status: deprecated` and `metadata.successor: fusion-skills`.

Install the replacement: `npx -y skills add equinor/fusion-skills fusion-skills`
