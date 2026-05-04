# Using the Fusion People Service

How to integrate the Fusion People API in a Fusion Framework React app — discovering people, resolving person details, and choosing the right integration approach.

**Source**: `@equinor/fusion-react-person` (UI components) + Fusion Framework people service (API access)
**Storybook**: [equinor.github.io/fusion-react-components — person](https://equinor.github.io/fusion-react-components/?path=/docs/person-docs--docs)

## When to use the people service

Reach for the people service when your app needs to:
- Let users search and pick people (assignees, owners, reviewers)
- Display a person's name, avatar, department, or role
- Show a manager or reporting relationship
- Render a person column in an AG Grid table

For most cases, the `@equinor/fusion-react-person` components handle people service integration automatically — you provide an `azureId` and the component resolves the rest.

## The preferred path: let components resolve people

All `@equinor/fusion-react-person` components resolve person data from the Fusion People API using an `azureId` (preferred) or a `upn`. Prefer `azureId` — it is stable, unambiguous, and the approach recommended for the vast majority of use cases.

```typescript
import { PersonAvatar, PersonCard, PersonListItem } from '@equinor/fusion-react-person';

// Correct — pass azureId, let the component resolve the rest
<PersonAvatar azureId={item.ownerAzureId} />
<PersonCard azureId={item.ownerAzureId} />
<PersonListItem azureId={item.ownerAzureId} />
```

Do **not** fetch person data manually and pass it as props unless you have a specific reason — the components handle loading, caching, and error states internally.

See `references/using-fusion-react-components.md` for full component usage examples (pickers, card, list item, ag-grid cell).

## Storing person references

Store only the `azureId` in your app's data model. Resolve display information at render time via components.

```typescript
// Data layer — store azureId only
interface WorkItem {
  id: string;
  title: string;
  ownerAzureId: string; // Azure AD object ID (UUID)
}

// UI layer — resolve at render time
<PersonCard azureId={item.ownerAzureId} />
```

Do not cache or persist resolved `PersonInfo` objects — they can become stale and the components will re-resolve from the API.

## People search via PersonPicker / PeoplePicker

When users need to select one or more people, use the picker components. They query the Fusion People API automatically on input.

```typescript
import { PersonPicker, type PersonInfo } from '@equinor/fusion-react-person';
import { useState } from 'react';

// Single-person picker
const AssigneeField = ({
  onSelect,
}: {
  onSelect: (azureId: string) => void;
}) => {
  const [person, setPerson] = useState<PersonInfo | null>(null);
  return (
    <PersonPicker
      person={person}
      placeholder="Search for a person…"
      subtitle="jobTitle"
      onPersonAdded={(e) => {
        setPerson(e.detail);
        onSelect(e.detail.azureId);
      }}
      onPersonRemoved={() => {
        setPerson(null);
        onSelect('');
      }}
    />
  );
};
```

> **Event pattern**: picker components use custom DOM events (`PersonAddedEvent`, `PersonRemovedEvent`). Access the person via `e.detail`, not the argument directly.

## Integration points

| Need | Component / hook |
|---|---|
| Display a person (avatar, hover details) | `PersonAvatar` |
| Full person detail (card, panel) | `PersonCard` |
| Person in a list row | `PersonListItem` |
| Person in an AG Grid column | `PersonCell` |
| Let user pick one person | `PersonPicker` or `PersonSelect` |
| Let user pick multiple people | `PeoplePicker` |
| Display a selected collection | `PeopleViewer` |

## System accounts

By default, person search excludes system accounts. If your app needs to include them (e.g. service principal selection), pass `systemAccounts={true}` to the picker:

```typescript
<PersonPicker
  systemAccounts={true}
  onPersonAdded={(e) => onSelect(e.detail.azureId)}
  onPersonRemoved={() => onSelect('')}
/>
```

## Non-goals

- **Do not** build a custom people API client using `useHttpClient` — the framework and components handle this internally.
- **Do not** manage people search state manually — the picker components handle input, debouncing, and results.
- **Do not** pass `PersonInfo` objects directly into non-picker components — pass `azureId` and let the component resolve.
