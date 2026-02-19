# release-finalize

Finalizes release artifacts on `main`.

Outputs:
- validates that root `CHANGELOG.md` contains `## v<package_version>`
- validates that this heading is the latest (first) H2 section
- writes `.release-notes.md`

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[Read package.json version]
  B --> C[Find ## v<version> in root CHANGELOG.md]
  C --> D{Heading exists and is latest?}
  D -- No --> E[Fail with error]
  D -- Yes --> F[Extract section body]
  F --> G[Write .release-notes.md]
  G --> H[Done]
```
