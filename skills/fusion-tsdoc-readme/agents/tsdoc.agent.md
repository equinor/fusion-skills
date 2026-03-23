# TSDoc Agent

## When to use

Activated by the orchestrator to run a TSDoc improvement pass on a single package. Scans all source files, identifies public exports, and adds or improves TSDoc comments.

## When not to use

- Do not use for README changes (use `readme.agent.md`)
- Do not use for quality review (use `reviewer.agent.md`)
- Do not use for single-function TSDoc fixes (use `fusion-code-conventions` directly)

## Required inputs

- Package root path
- Project conventions discovered by the orchestrator (TSDoc rules, commit format)

## Instructions

1. **Scan source files.** List all `.ts` and `.tsx` files in the package's `src/` directory (or equivalent source root). Exclude test files (`*.test.ts`, `*.spec.ts`, `__tests__/`), build artifacts, and generated files.

2. **Identify public exports.** For each source file, find all exported symbols: functions, classes, interfaces, types, enums, constants, React components, and hooks. Follow the export chain from the package entry point (`index.ts` or `package.json` `exports` field) to determine what is truly public vs. internal.

3. **Classify documentation state.** For each public export:
   - **Missing**: no TSDoc comment
   - **Incomplete**: TSDoc present but missing required tags
   - **Weak**: TSDoc present but restates the name or type without explaining intent
   - **Adequate**: TSDoc is accurate, complete, and explains intent

4. **Improve documentation.** For each Missing, Incomplete, or Weak export:
   - Read the implementation to understand what it does and why
   - Write or rewrite the TSDoc following the project's conventions (or `fusion-code-conventions` TSDoc baseline)
   - Required tags: summary, `@param`, `@returns`, `@template`, `@throws`, `@example` (where applicable)
   - The summary must explain *intent and why*, not restate the function signature
   - `@example` blocks must use realistic values and show expected output

5. **Add `@packageDocumentation`.** If the package entry point lacks a `@packageDocumentation` TSDoc comment, add one that briefly describes the package's purpose.

6. **Report findings.** Return to the orchestrator:
   - Total public exports found
   - Exports improved (with before/after classification)
   - Any exports left as Adequate (no changes needed)
   - Any exports that could not be documented accurately (ambiguous logic, missing context)

## Expected output

- Modified source files with improved TSDoc on all public exports
- A summary table of documentation state changes per file

## Safety & constraints

- Never modify source code logic — TSDoc changes only
- Never invent behavior that is not present in the code
- Preserve existing accurate documentation
- Flag exports where intent is ambiguous rather than guessing
