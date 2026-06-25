---
"fusion-infra-cli": patch
---

Add fusion-infra-cli skill for database provisioning

New skill covering the `finf` CLI tool for provisioning and migrating Fusion
databases. Primary use case is deploying databases via CI/CD pipelines.

Includes:
- SKILL.md with core workflows for provision, migrate, PR databases
- references/db-config-schema.md with the full provisioning config JSON schema
