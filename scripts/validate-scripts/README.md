# validate-scripts

Validates TSDoc coverage for function declarations under `scripts/**`.

Checks:
- each function declaration has a TSDoc block,
- each named parameter has an `@param` tag,
- functions returning values include `@returns`.

Excluded paths:
- `scripts/__tests__/**`

## CLI

- Full scan (default):
  - `bun run validate:scripts`
- Diff-only scan:
  - `bun run validate:scripts --only-diff`
- Diff-only scan against explicit base ref:
  - `bun run validate:scripts --only-diff --base-ref origin/main`

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[Discover scripts/**/*.ts]
  B --> C[Exclude scripts/__tests__]
  C --> D[Parse source with TypeScript AST]
  D --> E[Validate doc + @param + @returns]
  E --> F{Any issues?}
  F -- No --> G[Pass]
  F -- Yes --> H[Print actionable file:line:function issues and fail]
```
