---
"fusion-dependency-review": minor
---

Rename and expand the dependency review skill (experimental)

- Structured research template for dependency update PRs
- Helper advisors for research, security, code quality, impact, source control, and verdict synthesis
- Multi-lens review analysis: security, code quality, impact
- Reusable verdict template with recommendation, rationale, confidence, and follow-up
- Review tracker/checklist asset for consistent dependency PR triage
- GitHub MCP retrieval of existing PR comments and review threads before analysis
- Advisor-driven source guidance, confidence rules, remediation handoff, and safe PR patching flow
- Mandatory PR research checkpoint comments before mutation and final verdict comments before merge or decision
- Evaluation prompt for dependency review validation
- Explicit maintainer confirmation before any merge action

Resolves equinor/fusion-core-tasks#523
