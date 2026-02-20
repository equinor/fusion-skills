# Validation and CI split

## Local pre-PR checks

Before commit operations, run lint/format checks:

```bash
bun run biome:check
# optional auto-fix when needed
bun run biome:fix
```

Run from repository root before opening or updating a PR:

```bash
bun install --frozen-lockfile
bun test
bun run biome:check
bunx tsc --noEmit -p tsconfig.json
bun run validate:skills
GITHUB_BASE_REF=main bun run validate:pr
```

If you are not on a PR branch, `validate:pr` can be skipped.

## CI validation split

Validation workflows are separated to reduce unrelated CI noise:

- `.github/workflows/validate-skills.yml`
  - runs on `skills/**` and `.changeset/**`
  - checks skill discovery/consistency and PR version + changeset rules

- `.github/workflows/validate-scripts.yml`
  - runs on `scripts/**` and script-tooling files (`biome.json`, `tsconfig.json`, `package.json`, `bun.lock`)
  - runs tests (`bun test`), formatting/linting (`bun run biome:check`), and TypeScript (`bunx tsc --noEmit -p tsconfig.json`)
