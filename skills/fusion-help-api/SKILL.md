---
name: fusion-help-api
description: 'Guides developers and admins through direct interaction with the Fusion Help REST API — reading articles, FAQs, release notes, searching content, and managing help documentation programmatically. USE FOR: fetch help articles from API, integrate help content in app, search help content, manage help documentation via API, automate help content, build help tooling. DO NOT USE FOR: using the fhelp CLI tool (use fusion-help-docs skill), modifying Fusion.Services.Help backend code, or non-help-API tasks.'
license: MIT
compatibility: Requires authenticated HTTP client with Fusion bearer token. Works with any language or framework that can make REST calls.
metadata:
  version: "0.0.0"
  status: active
  owner: "@equinor/fusion-core"
  tags:
    - help-api
    - fusion-help
    - articles
    - release-notes
    - faq
    - search
    - integration
---

# Fusion Help API

Use this skill when a developer or admin needs to interact directly with the Fusion Help REST API — whether to read help content in their own app, build custom tooling, or automate content management.

## When to use

- App developer wants to display help articles, FAQs, or release notes inside their Fusion app
- Developer building a custom CLI or automation script to manage help content
- Admin wants to programmatically create, update, or delete help documentation
- Developer needs to search or suggest help content from their application
- Someone wants to understand the Help API endpoints, authentication, or data models
- Building an integration that reads help content for another system

## When not to use

- Using the `fhelp` CLI tool to sync markdown docs (use the `fusion-help-docs` skill instead)
- Modifying the Fusion.Services.Help backend service code
- General REST API questions unrelated to Help

## Required inputs

| Input | Required | Description |
|-------|----------|-------------|
| **Use case** | Yes | Reading content, managing content, or searching |
| **App key** | For scoped queries | The Fusion app key to read/manage help for |
| **Target environment** | Yes | `ci`, `fqa`, `tr`, or `fprd` |
| **Auth context** | Yes | User token (interactive) or service principal (automation) |

## Instructions

### 1. Discover the Help API base URL

The Help API is registered in the Fusion service discovery. Resolve the URL dynamically or use the known patterns:

| Environment | Base URL |
|-------------|----------|
| `ci` | `https://help.ci.api.fusion-dev.net` |
| `fqa` | `https://help.fqa.api.fusion-dev.net` |
| `fprd` | `https://help.api.fusion.equinor.com` |

**Dynamic discovery** (recommended for production tooling):

```
GET https://discovery.fusion.equinor.com/service-registry/environments/{env}/services
```

Look for the service with `key: "help"` in the response. Use the `uri` field as the base URL.

### 2. Authentication

All endpoints require a valid Azure AD bearer token.

**Token audiences by environment:**

| Environment | Resource ID (audience) |
|-------------|----------------------|
| `ci`, `fqa`, `tr` | `5a842df8-3238-415d-b168-9f16a6a6031b/.default` |
| `fprd` | `97978493-9777-4d48-b38a-67b0b9cd88d2/.default` |

**From a Fusion app (frontend):**

Use the Fusion Framework module's HTTP client, which handles token acquisition automatically. The help service is registered as `"help"` in the Fusion service discovery.

```typescript
// Fusion Framework React example
const httpClient = useHttpClient("help");
const response = await httpClient.fetchAsync("/articles?$expand=content&$filter=appKey eq 'my-app'");
```

**From a backend service or script:**

```csharp
// Using Azure.Identity
var credential = new DefaultAzureCredential();
var token = await credential.GetTokenAsync(
    new TokenRequestContext(new[] { "5a842df8-3238-415d-b168-9f16a6a6031b/.default" }));

var client = new HttpClient { BaseAddress = new Uri("https://help.ci.api.fusion-dev.net") };
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);
```

**From Azure CLI (quick testing):**

```bash
az login
az account get-access-token --resource 5a842df8-3238-415d-b168-9f16a6a6031b
```

### 3. Authorization levels

| Action | Who can do it |
|--------|---------------|
| **Read** articles, FAQs, release notes, search | Any authenticated Fusion user |
| **Create / Update / Delete** articles, FAQs, release notes | App admin for the specific `appKey`, trusted application, or `Fusion.Help.FullControl` scope |
| **Upload assets** (images) | App admin for any app, trusted application, or `Fusion.Help.FullControl` scope |
| **View changelog** (global) | `Fusion.Help.FullControl` scope only |
| **View changelog** (per app) | App admin for that app or `Fusion.Help.FullControl` |

---

## API Reference

All endpoints are versioned. Add `?api-version=1.0` to requests (or use the default).

### Articles

#### List all articles

```
GET /articles?api-version=1.0
```

**OData support:**
- `$filter`: `appKey`, `title`, `summary`, `slug`, `createdAt`, `updatedAt`
- `$expand`: `content`, `sections`
- `$top`: max 100
- `$skip`: for pagination

**Example — get articles for an app with content:**

```
GET /articles?$filter=appKey eq 'my-app'&$expand=content&$top=10&api-version=1.0
```

#### List articles for a specific app

```
GET /apps/{appKey}/articles?api-version=1.0
```

Same OData support as above. Automatically scoped to the given app.

#### Get linked articles for an app

Articles from other apps that have been cross-linked to this app:

```
GET /apps/{appKey}/linked-articles?api-version=1.0
```

#### Get a single article

```
GET /articles/{articleIdentifier}?$expand=content,sections&api-version=1.0
```

`articleIdentifier` can be the article **GUID** or the **slug** string.

**Response model:**

```jsonc
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "appKey": "my-app",
  "slug": "my-app-getting-started",
  "title": "Getting Started",
  "summary": "Learn how to get started.",
  "contentPath": "articles/my-app-getting-started",
  "createdAt": "2026-01-15T10:30:00Z",
  "createdBy": { "azureUniqueId": "...", "name": "John Doe", "upn": "john@equinor.com" },
  "lastModifiedBy": { "azureUniqueId": "...", "name": "Jane Doe", "upn": "jane@equinor.com" },
  "lastModified": "2026-03-01T08:00:00Z",
  "sortOrder": 1.0,
  "sourceSystem": "Fusion.Help.Cli",        // null when created via UI
  "content": "## Overview\n\nThis guide...",  // Only when $expand=content
  "tags": ["getting-started"],
  "linkedAppKeys": ["other-app"],
  "sections": [                               // Only when $expand=sections
    { "title": "Overview", "sections": [] },
    { "title": "Prerequisites", "sections": [] }
  ],
  "category": null,
  "updatedAt": "2026-03-01T08:00:00Z",
  "updatedBy": { ... }
}
```

#### Create an article (admin)

```
POST /apps/{appKey}/articles
Content-Type: application/json

{
  "title": "Getting Started",           // required, max 100 chars
  "summary": "Learn how to get started", // required, max 1000 chars
  "content": "## Overview\n\n...",       // required, markdown string
  "slug": "my-app-getting-started",      // optional, auto-generated if omitted, max 200 chars, URL-safe
  "sortOrder": 1.0,                      // optional, >= 0
  "sourceSystem": "my-custom-tool",      // optional, max 50 chars
  "category": "onboarding",             // optional
  "tags": ["getting-started"],           // optional, each max 50 chars
  "linkedAppKeys": ["other-app"]         // optional, cross-link to other apps
}
```

Returns `201 Created` with the full article object (including `content` and `sections`).

#### Update an article (admin)

Uses JSON Patch semantics — only send fields you want to change:

```
PATCH /apps/{appKey}/articles/{articleIdentifier}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "## New content\n\n...",
  "tags": ["updated-tag"]
}
```

Returns `200 OK` with the updated article.

#### Delete an article (admin)

```
DELETE /apps/{appKey}/articles/{articleIdentifier}
```

Returns `204 No Content`. Note: deleted articles are soft-deleted — the slug cannot be reused.

---

### FAQs

#### List all FAQs

```
GET /faqs?api-version=1.0
```

**OData support:**
- `$filter`: `appKey`, `question`, `slug`, `createdAt`, `updatedAt`
- `$expand`: `answer`, `linkedArticle`, `linkedArticle.content`
- `$top`: max 100
- `$skip`: for pagination

#### List FAQs for an app

```
GET /apps/{appKey}/faqs?api-version=1.0
```

#### Get a single FAQ

```
GET /faqs/{faqIdentifier}?$expand=answer,linkedArticle&api-version=1.0
```

**Response model:**

```jsonc
{
  "id": "3fa85f64-...",
  "appKey": "my-app",
  "question": "How do I reset my password?",
  "slug": "my-app-faq-reset-password",
  "contentPath": "faqs/my-app-faq-reset-password",
  "createdAt": "2026-01-15T10:30:00Z",
  "createdBy": { ... },
  "lastModifiedBy": { ... },
  "lastModified": "2026-03-01T08:00:00Z",
  "sortOrder": 1.0,
  "sourceSystem": null,
  "answer": "Navigate to Settings > Account...",  // Only when $expand=answer
  "linkedArticle": { ... }                        // Only when $expand=linkedArticle
}
```

#### Create a FAQ (admin)

```
POST /apps/{appKey}/faqs
Content-Type: application/json

{
  "question": "How do I reset my password?",  // required, max 200 chars
  "answer": "Navigate to Settings > Account...", // required, markdown
  "slug": "my-app-faq-reset-password",        // optional, URL-safe, max 200 chars
  "sortOrder": 1.0,                            // optional, >= 0
  "sourceSystem": "my-tool",                   // optional, max 50 chars
  "linkedArticleIdentifier": "my-app-getting-started" // optional, slug or GUID of related article
}
```

#### Update a FAQ (admin)

```
PATCH /apps/{appKey}/faqs/{faqIdentifier}
Content-Type: application/json

{
  "question": "Updated question?",
  "answer": "Updated answer content."
}
```

#### Delete a FAQ (admin)

```
DELETE /apps/{appKey}/faqs/{faqIdentifier}
```

---

### Release Notes

#### List all release notes

```
GET /release-notes?api-version=1.0
```

**OData support:**
- `$filter`: `appKey`, `title`, `slug`, `createdAt`, `updatedAt`, `publishedDate`
- `$expand`: `content`, `sections`, `linkedArticle`, `linkedArticle.content`
- `$top`: max 100
- `$skip`: for pagination

#### List release notes for an app

```
GET /apps/{appKey}/release-notes?api-version=1.0
```

#### List published-only release notes

```
GET /apps/{appKey}/release-notes/published?api-version=1.0
```

Only returns release notes where `publishedDate` is in the past.

#### List linked release notes for an app

```
GET /apps/{appKey}/linked-release-notes?api-version=1.0
```

#### Get a single release note

```
GET /release-notes/{releaseNoteIdentifier}?$expand=content,sections,linkedArticle&api-version=1.0
```

**Response model:**

```jsonc
{
  "id": "3fa85f64-...",
  "appKey": "my-app",
  "slug": "my-app-v2-release",
  "title": "Version 2.0 Release",
  "contentPath": "release-notes/my-app-v2-release",
  "createdAt": "2026-03-01T08:00:00Z",
  "createdBy": { ... },
  "lastModifiedBy": { ... },
  "lastModified": "2026-03-01T08:00:00Z",
  "publishedDate": "2026-03-14T00:00:00Z",
  "sourceSystem": null,
  "content": "## What's new\n\n...",     // Only when $expand=content
  "tags": ["release", "v2"],
  "linkedArticle": null,                  // Only when $expand=linkedArticle
  "releaseNoteLinkedAppKeys": [],
  "sections": [ ... ],                   // Only when $expand=sections
  "category": null
}
```

#### Create a release note (admin)

```
POST /apps/{appKey}/release-notes
Content-Type: application/json

{
  "title": "Version 2.0 Release",         // required, max 100 chars
  "content": "## What's new\n\n...",       // required, markdown
  "publishedDate": "2026-03-14T00:00:00Z", // required, ISO 8601
  "slug": "my-app-v2-release",            // optional, URL-safe, max 200 chars
  "sourceSystem": "my-tool",              // optional, max 50 chars
  "category": null,                        // optional
  "tags": ["release", "v2"],              // optional
  "releaseNoteLinkedAppKeys": [],          // optional, cross-link to other apps
  "linkedArticleIdentifier": null          // optional, link to an article by slug/GUID
}
```

#### Update a release note (admin)

```
PATCH /apps/{appKey}/release-notes/{releaseNoteIdentifier}
Content-Type: application/json

{
  "title": "Updated Release Title",
  "content": "## Updated content"
}
```

#### Delete a release note (admin)

```
DELETE /apps/{appKey}/release-notes/{releaseNoteIdentifier}
```

---

### Assets (Images)

#### Upload an image (admin)

```
POST /assets
Content-Type: multipart/form-data

Form fields:
  - asset: <binary PNG file>
  - slug: "img-my-image-slug"  (optional)
```

Returns `201 Created` with:

```json
{
  "uri": "/help-proxy/assets/resources/images/img-my-image-slug/processed.webp"
}
```

#### Get an asset

```
GET /assets/{resourcePath}
```

Returns the binary file. Supports `If-None-Match` ETag for caching (returns `304 Not Modified`).

Cache headers: `Cache-Control: private, max-age=31536000` (1 year).

#### Check if asset exists

```
HEAD /assets/{assetIdentifier}
```

Returns `200 OK` if exists, `404 Not Found` if not.

---

### Search & Suggestions

#### Full-text search

```
POST /search
Content-Type: application/json

{
  "search": "getting started",
  "filter": "appKey eq 'my-app'",
  "top": 10,
  "skip": 0,
  "count": true,
  "highlight": "content",
  "queryType": "simple",
  "searchMode": "any"
}
```

Uses Azure Cognitive Search under the hood. Supports Lucene query syntax when `queryType` is `"full"`.

#### Auto-suggest

```
POST /suggest
Content-Type: application/json

{
  "search": "get",
  "suggesterName": "sg",
  "filter": "appKey eq 'my-app'",
  "fuzzy": true,
  "top": 5
}
```

---

### Changelog (admin)

Available to app admins (scoped) or `Fusion.Help.FullControl` (global).

#### Global changelog

```
GET /changelog?$filter=commandName eq 'CreateArticle'&$top=50&api-version=1.0
```

**OData filters:** `appKey`, `articleIdentifier`, `faqIdentifier`, `activityId`, `actorUpn`, `actorAzureUniqueId`, `commandName`

#### Per-app changelog

```
GET /apps/{appKey}/changelog?$top=50&api-version=1.0
```

**OData filters:** `activityId`, `actorUpn`, `actorAzureUniqueId`, `commandName`

---

## Common integration patterns

### Pattern 1: Display help articles in a Fusion app

Fetch articles for your app key and render them in a side panel or help section.

```typescript
// React component using Fusion Framework HTTP client
import { useHttpClient } from "@equinor/fusion-framework-react/hooks";

function HelpArticles({ appKey }: { appKey: string }) {
  const httpClient = useHttpClient("help");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    httpClient
      .fetchAsync(
        `/apps/${appKey}/articles?$expand=content&$orderby=sortOrder asc&api-version=1.0`
      )
      .then((res) => res.json())
      .then((data) => setArticles(data.value));
  }, [appKey]);

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
          {/* Render article.content as markdown */}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 2: Show latest release notes on app startup

```typescript
const response = await httpClient.fetchAsync(
  `/apps/${appKey}/release-notes/published?$expand=content&$top=1&$orderby=publishedDate desc&api-version=1.0`
);
const data = await response.json();
const latestRelease = data.value?.[0];
```

### Pattern 3: Inline FAQ search

```typescript
const response = await httpClient.fetchAsync("/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    search: userQuery,
    filter: `appKey eq '${appKey}'`,
    top: 5,
  }),
});
```

### Pattern 4: Backend automation script (C#)

```csharp
using Azure.Identity;
using System.Net.Http;
using System.Net.Http.Json;

// Setup
var credential = new DefaultAzureCredential();
var token = await credential.GetTokenAsync(
    new TokenRequestContext(new[] { "5a842df8-3238-415d-b168-9f16a6a6031b/.default" }));

var client = new HttpClient
{
    BaseAddress = new Uri("https://help.ci.api.fusion-dev.net")
};
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", token.Token);

// List all articles for an app
var articles = await client.GetFromJsonAsync<PagedResponse<Article>>(
    "/apps/my-app/articles?$expand=content&api-version=1.0");

// Create a new article
var newArticle = new
{
    title = "Automated Article",
    summary = "Created by automation script",
    content = "## Hello\n\nThis was created programmatically.",
    slug = "my-app-automated-article",
    sourceSystem = "my-automation-script",
    sortOrder = 10.0,
    tags = new[] { "automated" }
};

var response = await client.PostAsJsonAsync("/apps/my-app/articles", newArticle);
response.EnsureSuccessStatusCode();

// Update an existing article
var patch = new { content = "## Updated\n\nNew content." };
var patchResponse = await client.PatchAsJsonAsync(
    "/apps/my-app/articles/my-app-automated-article", patch);

// Delete an article
await client.DeleteAsync("/apps/my-app/articles/my-app-automated-article");
```

### Pattern 5: Python automation script

```python
import requests
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("5a842df8-3238-415d-b168-9f16a6a6031b/.default")

base_url = "https://help.ci.api.fusion-dev.net"
headers = {
    "Authorization": f"Bearer {token.token}",
    "Content-Type": "application/json"
}

# List articles
resp = requests.get(
    f"{base_url}/apps/my-app/articles",
    params={"$expand": "content", "api-version": "1.0"},
    headers=headers
)
articles = resp.json()["value"]

# Create article
new_article = {
    "title": "Python-created Article",
    "summary": "Created via Python script",
    "content": "## Hello from Python\n\nAutomated content.",
    "slug": "my-app-python-article",
    "sourceSystem": "python-script",
    "tags": ["automated", "python"]
}
resp = requests.post(f"{base_url}/apps/my-app/articles", json=new_article, headers=headers)
```

---

## Validation rules

The API enforces these constraints server-side via FluentValidation:

| Field | Constraint |
|-------|-----------|
| Article `title` | Required, max 100 chars |
| Article `summary` | Required, max 1000 chars |
| Article `content` | Required (non-empty) |
| Article `slug` | URL-safe characters, max 200 chars |
| Article `sortOrder` | >= 0 |
| Article `sourceSystem` | Max 50 chars |
| Article `tags` (each) | Max 50 chars |
| FAQ `question` | Required, max 200 chars |
| FAQ `answer` | Required (non-empty) |
| FAQ `slug` | URL-safe characters, max 200 chars |
| Release note `title` | Required, max 100 chars |
| Release note `content` | Required (non-empty) |
| Release note `publishedDate` | Required, non-null |
| Release note `slug` | URL-safe characters, max 200 chars |

## Expected output

When this skill completes, the user should have:

- Working code to authenticate and call the Help API
- Correct endpoint URLs and query parameters for their use case
- Understanding of the response models and OData query options
- For admin use cases: correct request bodies for create/update/delete operations
- For integration patterns: sample code in the relevant language/framework

## Safety & constraints

- Read-only endpoints are safe for any authenticated user — no admin permissions needed
- Write operations require app admin, trusted application, or `Fusion.Help.FullControl`
- Deleted articles/FAQs/release notes are **soft-deleted** — their slugs cannot be reused
- The `sourceSystem` field tracks which tool created a record — mixing source systems for the same slug will cause the `fhelp` CLI to refuse updates (unless `--no-validation` is used)
- Always test against `ci` environment before targeting `fprd` (production)
- Do not hardcode bearer tokens — always use `DefaultAzureCredential` or equivalent token providers
- Image uploads must be PNG format; the API processes them into WebP for serving
