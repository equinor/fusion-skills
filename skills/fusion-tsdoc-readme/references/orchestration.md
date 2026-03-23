# Multi-Package Orchestration

Guidance for running documentation passes across multiple packages efficiently.

## Batch sizing

Estimate package complexity before deciding batch strategy:

| Package complexity | Approximate exports | Strategy |
|---|---|---|
| Small (utility) | < 15 public exports | Inline sequentially — low context cost |
| Medium (module) | 15–50 public exports | Sub-agent per package when available |
| Large (framework) | 50+ public exports | Sub-agent per package, split into file groups if needed |

## Sub-agent vs. inline

Use sub-agents (when the runtime supports them) to:
- Isolate package context — prevents cross-package confusion in TSDoc descriptions
- Parallelize independent packages — batch 3–5 small packages or 1–2 large packages per round
- Checkpoint progress — each sub-agent commits its package independently

Use inline sequential processing when:
- The runtime does not support sub-agents
- Only 1–3 packages are targeted
- Packages share significant API surface and benefit from cross-referencing

## Context isolation

Each package pass should start fresh:
1. Read only the target package's source files and its direct dependencies' type definitions.
2. Do not carry TSDoc phrasing or README content from a previous package into the next.
3. Re-read project conventions at the start of each batch (conventions may differ per package in heterogeneous monorepos).

## Progress tracking

For runs covering more than 5 packages:

1. Maintain a tracking list with status per package: `pending`, `in-progress`, `review`, `done`.
2. After each package, report: package name, exports documented, README sections updated, any review findings.
3. If a tracking issue exists, update its body or add a progress comment after each batch.

## Token budget awareness

Documentation passes are token-intensive. Budget considerations:

- **TSDoc pass**: ~50–100 tokens per export (reading source + writing TSDoc)
- **README pass**: ~500–1500 tokens per package (reading + rewriting)
- **Review pass**: ~200–500 tokens per package

For large monorepos (20+ packages), plan multiple sessions rather than attempting all packages in one context window.

## Error recovery

If a sub-agent fails mid-package:
1. Check what was committed — partial work may already be pushed.
2. Resume from the last uncommitted file rather than restarting the package.
3. If the failure was context-related (too many exports), split the package into file groups and process each group as a separate sub-agent call.

## Commit strategy

- **Per-package commits**: `docs(<package-name>): improve TSDoc and README`
- **Per-file commits** (only for very large packages): `docs(<package-name>): add TSDoc to <file-group>`
- Never combine multiple packages in a single commit — keeps history reviewable and revertable.
