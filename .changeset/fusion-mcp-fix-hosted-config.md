---
"fusion-mcp": patch
---

Fix outdated hosted-server config

The one-click install links and manual JSON config were missing the required
`oauth.clientId` field, and only covered Prod (no NonProd link). Both are now
aligned with the upstream README.
