---
name: equinor-design-system
description: 'Authoritative, machine-readable EDS design rules for color tokens, typography, spacing, elevation, icons, and page layout zones. USE FOR: looking up correct EDS CSS custom properties, typography variant names, spacing tokens, shadow/elevation tokens, icon usage rules, and Fusion Portal page layout conventions. This is a lookup reference consumed by other skills and agents — it has no standalone workflow. DO NOT USE FOR: React component props or usage examples (use fusion-research + mcp_fusion_search_eds), general Copilot coding tasks, or Fusion Framework API questions.'
license: MIT
metadata:
  version: "0.0.0"
  status: experimental
  owner: "@equinor/fusion-core"
  role: subordinate
  tags:
    - eds
    - design-system
    - design-tokens
    - color
    - typography
    - spacing
    - elevation
    - icons
    - layout
    - equinor-brand
    - system-skill
---

# Equinor Design System — Design Rules

Compact reference for EDS design tokens and Equinor brand constraints. All rules are sourced from [eds.equinor.com](https://eds.equinor.com) and the [Equinor Communication Toolbox](https://communicationtoolbox.equinor.com).

This file is a **subordinate lookup reference**. There are no workflow steps. Consuming agents should look up the relevant section and apply the rule directly.

---

## Color tokens

Use **EDS CSS custom properties** (`--eds-color-*`) for all color values. Never use raw hex, rgb(), or named CSS colors in Fusion app code.

### Primary interactive colors

| Purpose | EDS token |
|---|---|
| Primary action (button, link) | `--eds-interactive-primary` |
| Hover state | `--eds-interactive-primary__hover` |
| Pressed/active state | `--eds-interactive-primary__active` |
| Disabled foreground | `--eds-interactive-disabled__text` |
| Disabled background | `--eds-interactive-disabled__fill` |

### Semantic colors

| Purpose | EDS token |
|---|---|
| Success / positive | `--eds-feedback-success` |
| Warning | `--eds-feedback-warning` |
| Danger / error | `--eds-feedback-danger` |
| Informational | `--eds-feedback-info` |

### Text colors

| Purpose | EDS token |
|---|---|
| Primary text | `--eds-text-static-icons__primary-white` (on dark) / `--eds-text-static-icons__tertiary` (subtle) |
| Default body text | Use `color: var(--eds-text-static-icons__default)` |
| Disabled text | `--eds-text-static-icons__tertiary` |

### UI surface colors

| Purpose | EDS token |
|---|---|
| App background | `--eds-ui-background__default` |
| Elevated surface (card, panel) | `--eds-ui-background__light` |
| Overlay / scrim | `--eds-ui-background__overlay` |
| Dividers / borders | `--eds-ui-background__medium` |

> **Brand constraint**: Equinor red (`#FF1243`) is used in the primary logo only — never as a UI action or semantic color. Use EDS interactive tokens for all clickable surfaces.

### Token access in code

Prefer EDS CSS custom properties in styled-components over the `@equinor/eds-tokens` JS object when possible — they respect system dark/light mode automatically.

```typescript
import styled from 'styled-components';

const Card = styled.div`
  background: var(--eds-ui-background__light);
  border: 1px solid var(--eds-ui-background__medium);
  color: var(--eds-text-static-icons__default);
`;
```

---

## Typography

Use `Typography` from `@equinor/eds-core-react` for all text rendering. Never set raw `font-size`, `font-family`, or `line-height` manually — use the EDS `variant` prop.

### Variant hierarchy

| Level | `variant` | Usage |
|---|---|---|
| Display | `h1` | Hero headings (rarely used in apps) |
| Page title | `h2` | Top-level page heading |
| Section heading | `h3` | Section title, card header |
| Sub-heading | `h4` | Sub-section, panel title |
| Overline | `overline` | Category labels, breadcrumb-level text |
| Body | `body_long` | Multi-line body text |
| Body short | `body_short` | Single-line body, table cells |
| Caption | `caption` | Metadata, timestamps, helper text |
| Label | `label` | Form field labels |

```typescript
import { Typography } from '@equinor/eds-core-react';

// Correct
<Typography variant="h3">Section heading</Typography>
<Typography variant="body_short">Table cell value</Typography>
<Typography variant="caption">Last updated 2 hours ago</Typography>

// Wrong — never do this
<p style={{ fontSize: '14px' }}>…</p>
```

### Brand constraint

Equinor brand typeface is **Equinor** (used in marketing). Fusion apps must use the EDS system typeface defined by `@equinor/eds-core-react` — do not import or override the Equinor brand font in app CSS.

---

## Spacing tokens

Use `--eds-space-*` custom properties for margin and padding. Do not use arbitrary pixel values.

| Token | Value | Use for |
|---|---|---|
| `--eds-space-4` | 4 px | XS gap, icon padding |
| `--eds-space-8` | 8 px | SM gap, tight list spacing |
| `--eds-space-12` | 12 px | Inner padding (chips, badges) |
| `--eds-space-16` | 16 px | MD gap, standard content padding |
| `--eds-space-24` | 24 px | LG gap, section spacing |
| `--eds-space-32` | 32 px | XL gap, card-to-card separation |
| `--eds-space-40` | 40 px | XXL gap, major layout breaks |
| `--eds-space-48` | 48 px | Section-level whitespace |

```typescript
// Correct
const Section = styled.section`
  padding: var(--eds-space-24);
  margin-bottom: var(--eds-space-16);
`;

// Wrong
const Section = styled.section`
  padding: 24px;   /* arbitrary — use the token */
  margin-bottom: 16px;
`;
```

---

## Elevation and shadow tokens

Use `--eds-elevation-*` for shadow levels. Do not write raw `box-shadow` values.

| Token | Use for |
|---|---|
| `--eds-elevation-none` | Flat surface, no elevation |
| `--eds-elevation-raised` | Cards, inline elevated elements |
| `--eds-elevation-overlay` | Dropdowns, tooltips, floating elements |
| `--eds-elevation-raised_overlaying` | Modals, dialogs |

```typescript
const ElevatedCard = styled.div`
  box-shadow: var(--eds-elevation-raised);
`;
```

---

## Icon usage

Use `@equinor/eds-icons` with the EDS `Icon` component. Do not import SVGs directly or use third-party icon sets.

```typescript
import { Icon } from '@equinor/eds-core-react';
import { add, close, settings } from '@equinor/eds-icons';

// Register icons once (e.g. in App.tsx or a global setup file)
Icon.add({ add, close, settings });

// Use the registered name string
<Icon name="add" />
<Icon name="close" size={16} />
```

Icon sizes follow a fixed scale: `16`, `24` (default), `32`, `40`, `48`. Do not set arbitrary sizes.

---

## Page layout zones

Fusion Portal apps run inside the Fusion Portal shell, which owns the top navigation, left rail, and outer margins. Apps must **not** replicate or conflict with these zones.

### Three-zone app shell

| Zone | Component | Notes |
|---|---|---|
| Top bar / header | Provided by Fusion Portal shell | Apps do not render a global header |
| Main content area | `<main>` or top-level app `<div>` | Full available width and height |
| Side panel / detail | `@equinor/fusion-react-side-sheet` | Slides in from the right; do not use custom positioned overlays |

### Layout constraints

- **Do not** add outer `margin` or `padding` to the root app component — the portal shell provides the content inset.
- Use `--eds-space-*` tokens for internal section spacing.
- **Do not** use fixed `height` on the root container — allow content to stretch to the available viewport height.
- **Do not** create custom scrollable containers that wrap the full page — the browser scroll is the standard scroll surface.
- Nested scrollable regions are acceptable for fixed-height grid/table areas, but must be deliberate and clearly bounded.

### Empty and loading states

| State | Pattern |
|---|---|
| Loading | EDS `CircularProgress` or Fusion `ProgressIndicator` centered in content area |
| Empty (no data) | EDS `Typography` + optional EDS `Button` for a primary action; centered or top-aligned |
| Error | EDS `Typography variant="body_short"` with red semantic color + retry action |

---

## Sources

- EDS design resources: https://eds.equinor.com/docs/resources/
- EDS component library: https://eds.equinor.com/components/
- Equinor brand color: https://communicationtoolbox.equinor.com/point/en/equinor/component/default/100056
- Equinor brand typography: https://communicationtoolbox.equinor.com/point/en/equinor/component/default/100059
- Equinor brand layout: https://communicationtoolbox.equinor.com/point/en/equinor/component/default/100061
