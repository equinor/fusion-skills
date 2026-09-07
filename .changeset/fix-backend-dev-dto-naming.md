---
"fusion-backend-dev": patch
---

Fix `fusion-backend-dev` reference docs using invented `Dto`-suffixed type names
(`PositionDto`, `ContextDto`, `PersonDto`, `SAPPersonDto`, `MinimalPersonDto`) instead of Fusion's
actual naming convention.

- `references/cqrs-reference.md`: rename examples to `Api{Entity}`, and add a naming-convention
  section explaining `Db{Entity}`/`Query{Entity}`/`Api{Entity}` and the optional `Query` layer
  `fusion-core-services` inserts between handler and controller.
- `references/integration-patterns.md`: rename the Fusion People API example to `ApiPersonV3`
  (matching the real, versioned contract), fix an inconsistent `SAPPersonDto` reference, and label
  the illustrative model shape explicitly as illustrative.
- `SKILL.md`: fix a stale `fusion-services-develop` cross-reference (no such skill/agent exists;
  the correct escalation target is the `fusion-services-developer` agent).

Resolves the naming issue reported while validating the skill against
`equinor/fusion-pss-subsea-catalog`.
