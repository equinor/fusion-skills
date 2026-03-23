# README Structure Guide

Standard structure for package READMEs. Adapt section depth to the package's complexity — small utility packages may collapse sections; large framework packages may expand them.

## Required sections (in order)

### 1. Package name and badge row

```markdown
# @scope/package-name

[![npm version](https://img.shields.io/npm/v/@scope/package-name)](https://www.npmjs.com/package/@scope/package-name)
```

Use the published package name as the heading. Add relevant badges (npm version, build status, license) on the line below.

### 2. Description

One to three sentences explaining:
- What the package does (capability, not implementation)
- Who it is for (target audience or consumer type)
- Why it exists (the problem it solves or the gap it fills)

Avoid repeating the package name. Write for someone who has never seen this package before.

### 3. Features

Bulleted list of key capabilities. Each bullet should be a concrete, scannable feature — not a vague benefit.

```markdown
## Features

- Automatic retry with configurable backoff for transient HTTP errors
- Type-safe request/response wrappers for Fusion API endpoints
- Built-in token refresh using the Fusion auth module
```

### 4. Installation

```markdown
## Installation

\`\`\`bash
npm install @scope/package-name
\`\`\`
```

Show the primary package manager command. Add alternatives (yarn, pnpm, bun) only when the monorepo explicitly supports them.

### 5. Usage

Show realistic, working examples that demonstrate the most common use case. Include:
- Import statement
- Minimal setup
- Expected output or behavior

For packages with multiple entry points, show the primary one first and link to others.

```markdown
## Usage

\`\`\`typescript
import { createClient } from '@scope/package-name';

const client = createClient({ baseUrl: '/api/v1' });
const result = await client.get('/resources');
\`\`\`
```

### 6. API reference

Summarize the key public exports with brief descriptions. For large APIs, link to generated docs or a separate API reference page.

```markdown
## API

| Export | Description |
|---|---|
| `createClient(config)` | Creates an HTTP client instance with the given configuration |
| `useClient(name)` | React hook to access a named client from the framework |
| `ClientConfig` | Configuration interface for `createClient` |
```

### 7. Configuration (conditional)

Include only when the package has meaningful configuration options. Show defaults and explain when to override.

### 8. Related packages (conditional)

Include only when the package is part of a family. Link to sibling packages and explain the relationship.

## Optional sections

Add these when they provide genuine value:

- **Migration guide** — when a major version introduced breaking changes
- **Troubleshooting** — when specific error states are common and non-obvious
- **Contributing** — when the package accepts contributions and has specific guidelines
- **License** — when it differs from the monorepo root license

## Anti-patterns

- Do not include a changelog in the README — use `CHANGELOG.md`
- Do not duplicate the full API surface in prose — summarize and link
- Do not include internal implementation details — focus on the consumer perspective
- Do not use "Introduction" or "Overview" as section headings — the description serves that purpose
- Do not add empty sections with "TODO" — omit them until content exists
