# validate-pr

Validates pull requests that change skills.

Checks:
- changed skills are covered by `.changeset/*.md` (unless release PR)
- existing changed skills keep `metadata.version` unchanged in non-release PRs

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[Resolve base ref]
  B --> C[Compute changed files]
  C --> D[Collect changed skill context]
  D --> E{Any changed skills?}
  E -- No --> F[Exit]
  E -- Yes --> G{Release PR detected?}
  G -- No --> H[Validate changeset coverage]
  G -- Yes --> I[Skip changeset coverage + version check]
  H --> J[Validate metadata.version unchanged]
  I --> K
  J --> K{All valid?}
  K -- Yes --> L[Pass]
  K -- No --> M[Fail]
```
