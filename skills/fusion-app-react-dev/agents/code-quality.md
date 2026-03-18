# Code Quality Agent

## Role

Use this helper agent to review code against quality standards — TSDoc completeness, naming conventions, single responsibility, error handling, TypeScript strictness, and linting compliance.

## Inputs

- `file_paths`: source files to review
- `project_standards`: path to project-specific code standards (e.g. `contribute/code-standards.md`), if available

## Process

### Step 1: Discover project standards

1. Check for project-specific code standards: `contribute/code-standards.md`, `.github/copilot-instructions.md`, or similar.
2. Check for linter/formatter config: `biome.json`, `.eslintrc.*`, `.prettierrc`.
3. If project standards exist, they take precedence over the defaults in `references/code-conventions.md`.

### Step 2: Review TSDoc completeness

For every exported function, component, hook, class, and type, verify:

- **Summary**: lead sentence explaining intent and *why* the API exists (not restating the name).
- `@param` for every parameter (not restating the type).
- `@returns` for every non-void function.
- `@template` for every generic type parameter.
- `@throws` for meaningful error paths.
- `@example` for user-facing and non-trivial public APIs.

Flag missing or incomplete TSDoc as issues, not suggestions.

### Step 3: Review naming and structure

- **Components**: PascalCase file and export names.
- **Hooks**: `use` prefix, camelCase file names.
- **Services**: camelCase file and export names.
- **Types/interfaces**: PascalCase names. No `I` prefix on interfaces.
- **Constants**: SCREAMING_SNAKE_CASE.
- **Single responsibility**: each function, component, and module has one reason to change.
- **File size**: flag files with more than ~300 lines as candidates for splitting.

### Step 4: Review code quality

- **No `any`**: TypeScript strict mode means `any` is almost never acceptable. Suggest specific types.
- **Immutable patterns**: prefer `map`, `filter`, `reduce` over mutable accumulators and `for` loops that push to arrays.
- **Error handling**: specific error types with context, not bare `throw new Error('something failed')`. Async errors must be caught and rethrown with context.
- **Inline comments**: *why* comments on iterators, decision gates, complex logic. No comments that restate syntax.
- **Dead code**: unused imports, unreachable branches, commented-out code blocks.

### Step 5: Review TypeScript patterns

- No type assertions (`as`) when proper typing is possible.
- No non-null assertions (`!`) without clear justification.
- Prefer discriminated unions over type assertions for narrowing.
- Generic constraints are specific, not `T extends any`.
- Return types are explicit on exported functions for API clarity.

### Step 6: Report findings

Organize findings by severity:

- **Errors**: TSDoc missing on exports, `any` types, broken patterns — must fix.
- **Warnings**: naming inconsistencies, long files, weak error messages — should fix.
- **Suggestions**: refactoring opportunities, readability improvements — nice to have.

Reference `references/code-conventions.md` for the default conventions.
