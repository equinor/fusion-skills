# release-finalize

Finalizes release artifacts on `main`.

Outputs:
- bumps root `package.json` version
- injects `.changeset/release.md` into root `CHANGELOG.md` under `v<package_version>`
- writes `.release-notes.md`
- deletes `.changeset/release.md`

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[Read .changeset/release.md]
  B --> C{.changeset/release.md exists?}
  C -- No --> D[Exit]
  C -- Yes --> E[Detect package bump from skill version deltas]
  E --> F[Bump package.json version]
  F --> G[Update root CHANGELOG.md]
  G --> H[Write .release-notes.md]
  H --> I[Delete .changeset/release.md]
  I --> J[Done]
```
