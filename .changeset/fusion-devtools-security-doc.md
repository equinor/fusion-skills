---
"fusion-devtools": patch
---

Add SECURITY.md explaining High Risk false positive

Static analysis flags the token-in-shell-variable patterns in
`references/agentic-patterns.md` (Pattern 2 and Pattern 7) as a credential
exposure risk. The file documents that these are false positives — the skill
contains no scripts or executable code, and the tokens are short-lived Azure AD
bearer tokens that exist only as local shell variables during a command.
