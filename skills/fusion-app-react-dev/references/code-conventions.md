# Code Conventions

TSDoc, naming, inline comments, code style, and error handling conventions for Fusion Framework apps.

## TSDoc — mandatory for all exports

Every exported function, component, hook, class, and type MUST have TSDoc.

### Required tags

- **Summary**: lead sentence explaining intent and *why* the API exists.
- `@param` for every parameter.
- `@returns` for every non-void function.
- `@template` for every generic type parameter.
- `@throws` for meaningful error paths.
- `@example` for user-facing and non-trivial public APIs.

### Example

```typescript
/**
 * Formats a time range into a human-readable string.
 *
 * Combines start and end times, showing only the time portion
 * for same-day ranges.
 *
 * @param startTime - ISO 8601 start timestamp.
 * @param endTime - ISO 8601 end timestamp.
 * @returns A formatted time range like "09:00 – 10:30".
 *
 * @example
 * ```ts
 * formatTimeRange('2026-03-17T09:00:00Z', '2026-03-17T10:30:00Z');
 * // => "09:00 – 10:30"
 * ```
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  // ...
};
```

### Anti-patterns

- Do NOT restate the function name: ~~"formatTimeRange formats a time range"~~
- Do NOT restate parameter types: ~~"@param startTime - string"~~

## Naming conventions

| Kind           | Convention     | Example                  |
|----------------|----------------|--------------------------|
| Component file | PascalCase     | `DataGrid.tsx`           |
| Component name | PascalCase     | `DataGrid`               |
| Hook file      | camelCase      | `useItems.ts`            |
| Hook name      | `use` prefix   | `useItems`               |
| Service file   | camelCase      | `itemService.ts`         |
| Type file      | camelCase      | `item.ts`                |
| Interface      | PascalCase     | `Item`, `ApiResponse`    |
| Enum           | PascalCase     | `ItemStatus`             |
| Constants      | SCREAMING_SNAKE| `MAX_ITEMS_PER_PAGE`     |
| Variables      | camelCase      | `filteredItems`          |
| Functions      | camelCase      | `formatTimeSlot`         |

## Inline comments

Add intent comments (*why*, not *what*) for:

- Iterator blocks (`for`, `map`, `filter`, `reduce`, `flatMap`)
- Decision gates (`if`, `switch`, non-trivial ternaries)
- RxJS operator chains and subscriptions
- Complex decisions, heuristics, thresholds, workarounds

```typescript
// Exclude inactive items so the grid only shows current entries
const activeItems = items.filter((item) => item.status !== 'inactive');
```

Do NOT write comments that restate syntax:
```typescript
// WRONG: "Filter items" (restates what's obvious)
const active = items.filter((item) => item.status !== 'inactive');
```

## Code style

- **Readability first**: clarity over cleverness ("stupid code").
- **Single responsibility**: each function/component has one reason to change.
- **Immutable patterns**: prefer `map`, `filter`, `reduce` over mutable accumulators.
- **No `any`**: TypeScript strict mode is enforced.
- **Explicit return types** on exported functions for API clarity.

## Error handling

- Use specific error types with context, not bare `throw new Error('fail')`.
- Catch and rethrow async errors with additional context.
- Define error class hierarchies for distinct failure scenarios.

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```
