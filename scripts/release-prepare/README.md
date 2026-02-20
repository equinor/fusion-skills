# release-prepare

Applies changesets into release artifacts.

Outputs:
- bumps affected skill `metadata.version`
- updates per-skill `skills/<skill>/CHANGELOG.md`
- updates root `README.md` skills table from discovered `skills/**/SKILL.md`
- bumps root `package.json` version
- updates root `CHANGELOG.md` under latest `## v<package_version>` using grouped `### Major|Minor|Patch` sections with entry separators and package lists
- removes processed `.changeset/*.md`

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
  H --> I[Bump root package.json]
  I --> J[Update root CHANGELOG.md]
  J --> K[Delete processed changesets]
  K --> L[Done]
```
