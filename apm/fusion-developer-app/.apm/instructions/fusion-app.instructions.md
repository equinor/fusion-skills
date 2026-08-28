---
description: Use when creating or changing TypeScript or React code in a Fusion Framework application, including components, hooks, routes, services, app configuration, data fetching, and tests.
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Fusion Application Development

## Framework integration

- Follow repository-local architecture, configuration, formatting, testing, and contribution rules.
- Treat installed package versions and nearby implementations as constraints, not suggestions.
- Use `fusion-research` before choosing an API when Fusion package exports, hook behavior, module ownership, or runtime configuration is uncertain.
- Prefer React-facing hooks from `@equinor/fusion-framework-react-app/*` in React code. Use direct framework module access only in non-React contexts or where the repository already requires it.
- Configure Fusion modules through the app's existing module initiator and configuration surfaces.
- Register named HTTP clients through established app configuration and access them with Fusion hooks.
- Preserve existing routes, endpoint names, module contracts, and runtime configuration unless the task explicitly changes them.

## React and data

- Keep components focused; place reusable side effects and data access in custom hooks or established service layers.
- Wrap remote queries in focused hooks, use stable parameter-derived query keys, and keep server state separate from local UI state.
- Reuse established loading, error, empty-state, mocking, and test patterns.
- Preserve strict typing. Do not add `any`, suppress type errors, or manipulate the DOM directly to bypass React.

## User interface

- Use `fusion-design` for every UI implementation or review. Read local `DESIGN.md` first when present.
- Use `equinor-design-system` as authoritative ground truth for tokens, typography, spacing, icons, and Fusion Portal layout zones.
- Use `fusion-research` and Fusion MCP EDS search for component props, usage examples, and accessibility guidance; do not infer APIs from design rules.
- Prefer EDS and `@equinor/fusion-react-*` components before building custom equivalents.
- Apply EDS tokens and the repository's styled-components patterns for custom styling. Do not hardcode colors, typography, or spacing.
- Preserve keyboard access, visible focus, semantic structure, and understandable loading and error feedback.
- Match the application's existing density, layout, and interaction language.

## Validation

- Keep changes scoped and add or update focused tests for changed behavior.
- Run the repository's relevant tests, typecheck, lint, and build commands before completion.
- Report actual results and identify anything that could not be validated.
- Do not add dependencies without explicit approval.
