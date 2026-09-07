---
"fusion-skills": patch
---

Prefer live, public OpenAPI documents over static snapshots in the experimental
`fusion-core-services` skill, and finish removing invented `Dto`-suffixed naming from it.

- Every Fusion Core service now publishes its current OpenAPI document publicly, with no JWT
  required (`https://{service}.api.fusion.equinor.com/openapi/api-v{version}.json`), following the
  migration off Swashbuckle-generated docs. Added a new instruction step directing the skill to
  fetch this live document and read exact type names from `components.schemas` before naming
  anything, treating the bundled `references/*.md`/`assets/*.ts` snapshots as a curated index of
  what exists rather than the source of truth for exact shapes.
- Stripped the remaining `Dto` suffix from every suggested type name across all 12 per-service
  reference files (e.g. `ContextEntityDto` → `ContextEntity`, `NewMailRequestDto` →
  `NewMailRequest`), and replaced "DTO"-based prose ("Suggested DTOs", "local DTOs", "DTO records")
  with "local models"/"model records" throughout.
- Applied the same fix to `contribute/api-skill-template.md` and `api-skill-standards.md` — the
  meta-templates every per-service reference file (and any future one) is generated from — so the
  naming issue and the missing live-document guidance don't reintroduce themselves next time a
  service reference is added.

Follows up on the `Dto`-naming fix already shipped for `fusion-backend-dev` in a separate PR.
