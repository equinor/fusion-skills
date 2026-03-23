---
name: fusion-tsdoc-readme
description: 'Systematically improves TSDoc and README documentation across packages in a monorepo. USE FOR: running documentation passes on one or more packages, adding TSDoc to all public exports, rewriting READMEs to a consistent retrieval-friendly structure, and orchestrating multi-package doc runs with parallelization guidance. DO NOT USE FOR: single TSDoc fixes (use fusion-code-conventions), API reference site generation, product-code changes, or runtime debugging.'
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  role: orchestrator
  skills:
    - fusion-code-conventions
  tags:
    - tsdoc
    - readme
    - documentation
    - monorepo
    - code-review
    - orchestration
---

# TSDoc & README Documentation

## When to use

Use this skill when you need to systematically improve documentation across one or more packages — adding TSDoc to public exports, rewriting READMEs to a consistent structure, or orchestrating a multi-package documentation pass.

Typical triggers:
- "Document all public exports in this package"
- "Run a TSDoc pass on packages X, Y, Z"
- "Rewrite the README for this package"
- "Make the documentation consistent across these packages"
- "Add TSDoc to everything that's missing it"
- "Prepare documentation for all packages in this monorepo"

Implicit triggers:
- A monorepo has inconsistent or missing documentation across packages
- A documentation sprint is planned to cover multiple packages
- Package READMEs are stale, incomplete, or structurally inconsistent

## When not to use

Do not use this skill for:
- Fixing TSDoc on a single function or small snippet (use `fusion-code-conventions` directly)
- Generating API reference websites or static doc sites
- Product-code changes, refactors, or new features
- Runtime debugging or performance profiling
- Writing documentation for non-code artifacts (use Markdown conventions from `fusion-code-conventions`)

## Required inputs

### Mandatory

- **Target packages**: one or more package paths to document
- **Repository root**: the monorepo root for discovering project conventions

### Conditional

- **Tracking issue number**: when package-level sub-issues should be assigned, updated, and closed on completion
- **README template path**: when the repository has a custom README structure (otherwise use `assets/readme-template.md`)
- **Commit format**: when the repository uses a non-standard commit convention (default: `docs(<package>): <summary>`)

## Instructions

### Step 1 — Discover project conventions

Before writing any documentation, inspect the target repository:

1. Read `package.json` (root and target package) for package name, description, and scripts.
2. Read `tsconfig.json` for TypeScript settings and path aliases.
3. Check for code-generation or documentation instruction files (e.g. `.github/instructions/code-generation.instructions.md`, `.github/instructions/documentation.instructions.md`).
4. Check for `CONTRIBUTING.md` or a `contribute/` directory for project-specific standards.
5. Check for linter/formatter config (`biome.json`, `.eslintrc`, prettier config).

**Project conventions override skill defaults.** If the repository documents its own TSDoc rules, README structure, or commit format, follow those.

When no project-specific standards exist, use:
- `fusion-code-conventions` TSDoc rules as the TSDoc baseline
- `assets/readme-template.md` as the README structure baseline

### Step 2 — Plan the documentation pass

For each target package:

1. Scan all source files and identify every public export (functions, classes, interfaces, types, enums, constants, React components, hooks).
2. Classify each export's current documentation state:
   - **Missing**: no TSDoc at all
   - **Incomplete**: TSDoc present but missing required tags (`@param`, `@returns`, `@template`, `@throws`, `@example`)
   - **Weak**: TSDoc present but restates the function name instead of explaining intent
3. Read the current README and assess against `references/readme-structure.md`.
4. Produce a package-level work plan listing files to touch and estimated scope.

For multi-package runs, see `references/orchestration.md` for batching and parallelization strategy.

### Step 3 — TSDoc pass

For each public export, add or improve TSDoc following these rules:

- **Summary line**: explain *intent and why*, not *what the name already says*
- **`@param`**: every parameter — describe purpose, constraints, and edge case behavior
- **`@returns`**: every non-void function — describe the shape and semantics of the return value
- **`@template`**: every generic type parameter — explain the constraint and typical usage
- **`@throws`**: meaningful error paths — document the error type and trigger condition
- **`@example`**: user-facing and non-trivial public APIs — show realistic usage
- **`@deprecated`**: when superseded — include the replacement

Delegate specific convention questions to `fusion-code-conventions` when they arise. That skill owns the authoritative TSDoc tag rules; this skill owns the systematic pass workflow.

### Step 4 — README pass

Rewrite or restructure each package README following `references/readme-structure.md`:

1. Verify the README has all required sections in the correct order.
2. Ensure the description accurately reflects what the package does today.
3. Add or update installation, usage, and configuration sections with working examples.
4. Add or update the API reference section — link to or summarize key public exports.
5. Remove stale content that no longer matches the package's current API surface.

Use `assets/readme-template.md` as the structural baseline unless the project has its own template.

### Step 5 — Review council

Before finalizing changes, verify quality across four dimensions:

| Dimension | Check |
|---|---|
| **Intent extraction** | Does the TSDoc explain *why* the code exists, not just parrot the name? |
| **Code comprehension** | Are complex algorithms, state machines, or side effects explained? |
| **User-facing quality** | Would a developer discovering this package for the first time understand it from the README? |
| **Retrieval fitness** | Will the documentation produce good hits in RAG / semantic search / code search? |

Use `agents/reviewer.agent.md` for a structured review pass, or apply the same criteria inline when subagents are unavailable.

### Step 6 — Commit and close

1. Stage and commit changes per package using the repository's commit format (default: `docs(<package>): improve TSDoc and README`).
2. Push the branch.
3. If a tracking issue was provided, close it with a summary of what was documented.

### Multi-package orchestration

When documenting more than one package, follow `references/orchestration.md` for:
- Batch sizing based on package complexity
- Context isolation between packages to avoid cross-contamination
- Progress tracking and checkpoint strategy
- When to split work across sub-agents vs. inline sequentially

## Agent modes

| Agent | Activated for |
|---|---|
| `agents/tsdoc.agent.md` | TSDoc analysis, gap identification, and improvement for a single package |
| `agents/readme.agent.md` | README structure assessment and rewrite for a single package |
| `agents/reviewer.agent.md` | Review council — quality, intent, comprehension, and retrieval fitness checks |

If the runtime does not support skill-local agents, apply the same review criteria inline.

## Expected output

- Modified source files with complete TSDoc on all public exports
- Rewritten README following the consistent structure
- Commit(s) following the repository's conventional commit format
- A summary of what was documented: packages touched, exports documented, README sections added/updated
- Review council findings: any remaining quality concerns or follow-up items

## Safety & constraints

Never:
- Modify source code logic — documentation changes only
- Remove or weaken existing accurate documentation
- Invent API behavior that is not present in the source code
- Request or expose secrets or credentials
- Push to protected branches without explicit confirmation
- Skip the review step for multi-package runs

Always:
- Read the source code before writing TSDoc — accuracy over coverage speed
- Preserve existing accurate documentation and only improve gaps
- Follow project-specific conventions when they override skill defaults
- Commit per-package to keep history clean and reviewable
- Delegate convention questions to `fusion-code-conventions`
