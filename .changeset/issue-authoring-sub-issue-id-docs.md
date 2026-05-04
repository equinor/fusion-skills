---
"fusion-issue-authoring": patch
---

Clarify sub_issue_id requires object ID, not issue number

- Promote the ID vs number distinction to a prominent warning block above the example
- Add a `gh api` command showing how to retrieve the object ID
- Add a troubleshooting table covering 404, invalid input, and silent-failure modes
- Clarify that `after_id`/`before_id` in reprioritize are also object IDs
- Add sub-issue linking activation cues to SKILL.md triggers

resolves equinor/fusion-skills#79
