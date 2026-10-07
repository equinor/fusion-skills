# Platform and deployment

Fusion already provides the infrastructure; reuse it and read the docs for details. This skill does not deploy.

| Topic | Default | Details |
| --- | --- | --- |
| App registration | One Entra app per environment (non-prod, prod), requested from Fusion Core / Fusion Infrastructure | docs: `developer/api/getting-started/app-registration` |
| Hosting | Radix (`infra/radix/radixconfig.yaml`), environments `ci` and `prod`, ≥ 2 replicas | docs: `developer/api/deployment/radix-deployment` |
| Identity | Workload identity per environment (`identity.azure.clientId`), federated credentials for the Radix service account; no client secrets | docs: Radix deployment guide; Radix docs `radix.equinor.com` |
| Database | Azure SQL via `finf` (Fusion Database-as-a-Service) | `using-sql-database.md`, `fusion-infra-cli` |
| Roles | Roles V2 system per environment, config as code with `froles`: `roles.<env>.json`, `bindings.<env>.json`, `access-assignments.<env>.json` | `fusion-roles-cli`, docs: role-service quick start |
| Help | Help Center articles published with `fhelp` | `fusion-help-docs` |
| PR previews | Radix does not preview backends; Fusion's Kubernetes PR pipeline does (PR database via `finf -pr`) | docs: `developer/api/deployment/pr-pipeline-setup` |
| Observability | App Insights per environment (Bicep, local auth disabled), OpenTelemetry in the app | `hosting-and-observability.md`, docs: `developer/api/deployment/observability` |
| IaC | Bicep for app-owned Azure resources (resource group, pipeline identities, App Insights, storage, Key Vault); app registrations are Terraform in Fusion Infrastructure | repo `infra/bicep/` |
| CI/CD | GitHub Actions with OIDC (`azure/login` with federated credentials), build → idempotent migration script → provision/migrate → Radix deploy, prod behind an environment approval | reference repos below |

Docs base: `https://docs.fusion.equinor.com/docs/` (start at `developer/api`, the new-service checklist). Use Fusion MCP
`mcp_fusion_search_docs` for these pages.

## Manual steps

Some steps need Fusion Core/Infrastructure (app registrations, `Fusion.Infrastructure.Database.Manage` for the pipeline
identity, Roles V2 system creation, federated credentials on the cluster). Record every manual step in
`docs/manual-solution-setup.md` (no secrets) so the next person or agent can repeat it.

## Reference repos

`equinor/fusion-pss-project-demand` and `equinor/fusion-pss-subsea-catalog`: `.github/workflows/` (`build-api.yml`,
`deploy-api.yml`, `deploy-infra.yml`, `deploy-pr-k8s.yml`, `help-docs.yml`), `infra/`, `docs/manual-solution-setup.md`.
