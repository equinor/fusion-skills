---
"fusion-github-review-resolution": patch
---

Tighten the experimental review-resolution workflow so agents follow a deterministic fetch → analyze → fix → validate → push → reply → resolve sequence and avoid ad hoc mutation scripts.

- Prefer structured review-thread tools when the client exposes them, otherwise use the bundled GraphQL assets or shell helper.
- Guard `resolve-review-comments.sh` against duplicate authenticated-user replies by default and use the thread-scoped GraphQL reply mutation.
- Track mutation baselines and retry checks in the skill checklist so retries re-fetch state before posting again.
- Require the skill to judge whether review feedback is actually correct, reply with rationale when it is not, and ask the user when the comment remains ambiguous.

resolves equinor/fusion-skills#57
