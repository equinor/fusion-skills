# release-prepare

Applies changesets into release artifacts.

Outputs:
- bumps affected skill `metadata.version`
- updates per-skill `skills/<skill>/CHANGELOG.md`
- removes processed `.changeset/*.md`
- creates `.changeset/release.md`

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[List .changeset files]
  B --> C{Any changesets?}
  C -- No --> D[Exit]
  C -- Yes --> E[Parse changesets]
  E --> F[Aggregate bump + notes by skill]
  F --> G[Update skills/<skill>/SKILL.md version]
  G --> H[Update skills/<skill>/CHANGELOG.md]
  H --> I[Write .changeset/release.md]
  I --> J[Delete processed changesets]
  J --> K[Done]
```
