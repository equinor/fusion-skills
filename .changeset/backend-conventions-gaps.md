---
"fusion-code-conventions": patch
---

Close backend-convention gaps found while validating `fusion-developer-services` against
`equinor/fusion-pss-subsea-catalog`:

- `csharp.conventions.md`: declare `[ProducesResponseType]` for every status code an action can
  actually return (including negative paths); note that XML doc comments on controller actions and
  request/response model properties surface in the generated OpenAPI document's `summary`/
  `description` fields when the project enables XML-comment inclusion (`Microsoft.AspNetCore.OpenApi`/
  Swashbuckle), not just IntelliSense; prefer a small static factory class for enriched
  `ProblemDetails` responses so controller actions stay one-liners.
