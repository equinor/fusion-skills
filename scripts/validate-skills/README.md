# validate-skills

Validates that discovered local skills match the count reported by the skills CLI.

When a skill uses `metadata.skills` as companion-skill metadata without `metadata.role: "orchestrator"`, the external skills CLI can omit that skill from `--list` output. The validator tolerates this known exclusion pattern by reconciling the mismatch against local frontmatter.

## Mermaid flow

```mermaid
flowchart TD
  A[Start] --> B[Discover local SKILL.md directories]
  B --> C[Run npx skills add . --list]
  C --> D[Parse CLI count]
  D --> E{Count matches local?}
  E -- Yes --> F[Print pass]
  E -- No --> F1[Check known companion metadata.skills exclusions]
  F1 --> F2{Adjusted count matches local?}
  F2 -- Yes --> F
  F2 -- No --> G[Fail with mismatch error]
```
