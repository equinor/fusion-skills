---
name: fusion-app-react-dev
description: 'Guides feature development in Fusion Framework React apps — scaffolding components, hooks, services, and types that follow EDS conventions and Fusion Framework patterns. USE FOR: building new features, adding components or pages, creating hooks and services, wiring up API endpoints, and extending Fusion module configuration. DO NOT USE FOR: issue authoring, skill authoring, CI/CD configuration, or backend service changes.'
license: MIT
compatibility: Requires a Fusion Framework React app bootstrapped with @equinor/fusion-framework-cli. Works best when styled-components, @equinor/eds-core-react, and @equinor/fusion-react-* packages are installed.
metadata:
  version: "0.0.0"
  status: active
  owner: "@equinor/fusion-core"
  tags:
    - fusion-framework
    - react
    - eds
    - fusion-react-components
    - styled-components
    - app-development
  mcp:
    suggested:
      - fusion
---

# Fusion App Development

## When to use

Use this skill when developing features, components, hooks, services, or types for a Fusion Framework React application.

Typical triggers:
- "Add a component for ..."
- "Create a hook that ..."
- "Wire up the API"
- "Build a page for ..."
- "Add a service to fetch ..."
- "Configure a Fusion module"
- "Implement a feature for ..."

Implicit triggers:
- The user asks to build something in `src/`
- The user references Fusion Framework modules, EDS components, Fusion React components (`@equinor/fusion-react-*`), or styled-components patterns
- The user wants to add a new route, page, or data-fetching layer

## When not to use

Do not use this skill for:
- Issue authoring or triage (use `fusion-issue-authoring`)
- Skill authoring (use `fusion-skill-authoring`)
- Backend/service changes (separate repository)
- CI/CD pipeline or deployment configuration
- Architecture documentation (use ADR template)

## Required inputs

### Mandatory

- What to build: a clear description of the feature, component, hook, or service
- Where it fits: which layer (component, hook, service, type) and any parent/sibling context

If the user's request is ambiguous or missing critical details, consult `assets/follow-up-questions.md` for domain-specific clarifying questions before implementing.

### Conditional

- API endpoint details when the feature involves data fetching
- Design/layout specifics when building visual components
- Fusion module name when extending module configuration

## Instructions

### Step 1 — Discover project conventions

Before writing any code, inspect the target repository to learn its specific setup:

1. Read `package.json` to identify the package manager (bun/pnpm/npm), available scripts, and installed dependencies.
2. Read `tsconfig.json` to confirm TypeScript settings and path aliases.
3. Scan `src/` to understand the current directory layout and layer structure.
4. Check for ADRs (`docs/adr/`) or a `contribute/` directory for project-specific code standards.
5. Check for formatter/linter config (biome.json, .eslintrc, prettier config).
6. Read `app.config.ts` and `app.manifest.ts` to understand existing endpoint and environment setup.

Adapt all subsequent steps to the conventions discovered here. The patterns in `references/` are defaults — defer to project-specific rules when they differ.

### Step 2 — Plan the implementation

If scaffolding a new app from scratch, use `assets/new-app-checklist.md` as a progress tracker.

1. Break the work into discrete files/changes.
2. Map each piece to the correct directory. A typical Fusion app uses:
   - `src/components/` — React components (presentation layer)
   - `src/hooks/` — Custom React hooks (state and side-effect logic)
   - `src/api/` — API clients, data transforms, business logic
   - `src/types/` — TypeScript interfaces, type aliases, enums
   - `src/routes.ts` — Route definitions (when using Fusion Router)
   - `src/config.ts` — Fusion module configuration
   - `src/App.tsx` — Root component, layout shell
3. Identify shared types early — define them before referencing.
4. If the project uses routing, follow `references/using-router.md` for the DSL and page patterns.
5. If the project uses a different structure, follow it.

### Step 3 — Implement following code conventions

Follow the project's code standards (discovered in Step 1) and the defaults in `references/code-conventions.md`:

- **TSDoc**: Every exported function, component, hook, and type MUST have TSDoc with `@param`, `@returns`, and a summary explaining intent.
- **Inline comments**: Add *why* comments on iterators, decision gates, RxJS chains, and complex logic.
- **Naming**: Descriptive, self-documenting names. Components use PascalCase files. Hooks use `use` prefix.
- **Single responsibility**: Each function, component, and module has one reason to change.
- **Immutable patterns**: Prefer `map`, `filter`, `reduce` over mutable accumulators.
- **Error handling**: Use specific error types with context, not generic `Error`.

### Step 4 — Style with styled-components, EDS, and Fusion React components

Follow `references/styled-components.md`, `references/styling-with-eds.md`, and `references/using-fusion-react-components.md`:

- Use `styled-components` for custom styling — this is the Fusion ecosystem convention.
- Do not introduce CSS Modules, global CSS files, Tailwind, or alternative CSS-in-JS unless the project explicitly uses them.
- Use the `Styled` object pattern for co-located styled components.
- Prefer EDS components from `@equinor/eds-core-react` as the base for standard UI elements.
- Use EDS design tokens (CSS custom properties or `@equinor/eds-tokens`) for colors, spacing, and typography.
- Extend EDS components with `styled()` when customization is needed.
- Use Fusion React components (`@equinor/fusion-react-*`) for domain-specific needs not covered by EDS — person display/selection, Fusion side sheets, and progress indicators.
- Inline `style` props are acceptable for one-off tweaks only.

### Step 5 — Wire up data fetching (when applicable)

Follow `references/configure-services.md`, `references/using-react-query.md`, and `references/configure-mocking.md` for data-fetching and local dev mocking patterns:

- Register HTTP clients via `configureHttpClient` in `config.ts` or via `app.config.ts` endpoints.
- Access clients in components with `useHttpClient(name)` from `@equinor/fusion-framework-react-app/http`.
- **Always prefer `@equinor/fusion-framework-react-app/*` hooks** (`useHttpClient`, `useCurrentContext`, etc.) over direct module access. Reserve `framework.modules.*` for non-React contexts like route loaders.
- When the project uses React Query (`@tanstack/react-query`), create thin custom hook wrappers around `useQuery`.
- Use query keys derived from API path + parameters.
- Keep client UI state in React state/context, not in server-state libraries.

### Step 6 — Configure Fusion modules (when applicable)

Follow `references/using-framework-modules.md`, `references/using-context.md`, `references/using-router.md`, `references/using-ag-grid.md`, `references/using-fusion-react-components.md`, and `references/configure-services.md` for module configuration:

- Add module setup in `config.ts` using the `AppModuleInitiator` callback.
- Access modules in components via hooks: `useAppModule`, `useHttpClient`, `useCurrentContext`.
- Register HTTP client endpoints in `app.config.ts` when adding new API integrations.
- Enable navigation with `enableNavigation` in `config.ts` when the app uses routing.
- Define routes using the Fusion Router DSL (`layout`, `index`, `route`, `prefix`) for automatic code splitting.

### Step 7 — Validate

Use `assets/review-checklist.md` as a comprehensive post-generation checklist.

1. Run the project's typecheck command (e.g. `bun run typecheck` or `pnpm typecheck`) — zero errors required.
2. Run the project's lint/format check — zero violations.
3. Verify every new exported symbol has TSDoc.
4. Confirm styling follows the project's conventions.
5. Confirm no new dependencies unless justified or explicitly approved.

## Expected output

- New or modified source files in `src/` following the project's layer structure.
- All files pass typecheck and lint.
- Every exported function, component, hook, and type has TSDoc.
- Styling follows project conventions (typically styled-components + EDS + Fusion React components where applicable).
- A brief summary of what was created or changed and why.

## Helper agents

This skill includes three optional helper agents in `agents/`. Use them for focused review after implementing changes, or consult them during implementation for specific guidance. If the runtime does not support skill-local agents, apply the same review criteria inline.

- **`agents/framework.md`** — reviews Fusion Framework integration: module configuration, HTTP clients, bootstrap lifecycle, and hook usage. **Prefers `mcp_fusion_search_framework`** for API lookups; falls back to `mcp_fusion_search_docs` for general platform guidance. Consult when wiring up `config.ts`, `app.config.ts`, or any component that accesses framework modules.
- **`agents/styling.md`** — reviews EDS component selection, styled-components patterns, design token usage, and accessibility. **Prefers `mcp_fusion_search_eds`** for component docs, props, and examples. Consult when building or modifying visual components.
- **`agents/code-quality.md`** — reviews TSDoc completeness, naming conventions, single responsibility, error handling, and TypeScript strictness. Run on every new or modified file before finalizing.

## Safety & constraints

- **No new dependencies** without explicit user approval.
- **No direct DOM manipulation** — use React patterns.
- **No `any` types** — TypeScript strict mode is standard for Fusion apps.
- **No secrets or credentials** in source files.
- **Conventional commits** for all changes (`feat:`, `fix:`, `refactor:`, etc.).
- Do not modify infrastructure files (docker-compose, CI config) unless explicitly asked.
