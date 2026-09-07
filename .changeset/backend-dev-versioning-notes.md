---
"fusion-skills": patch
---

Document Fusion's endpoint versioning philosophy in `fusion-backend-dev`'s API contracts
reference: versioning is per endpoint (not per service), only bumped when an endpoint actually
needs a breaking change, and a non-breaking option — most commonly adding an optional response
property — is preferred over introducing a new version at all.
