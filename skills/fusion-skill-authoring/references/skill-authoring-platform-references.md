# Skill authoring platform references

## Sources

- Claude Agent Skills overview:
  - https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Claude Agent Skills best practices:
  - https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Gemini CLI creating skills:
  - https://geminicli.com/docs/cli/creating-skills/
- GitHub Copilot create skills:
  - https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills

## Shared guidance across platforms

- A skill directory should contain a `SKILL.md` with valid metadata (`name`, `description`)
- The description should state both what the skill does and when it should be used
- Skills should be reusable and focused on recurring workflows
- Instructions should be actionable, scoped, and safety-aware
- Supporting resources should be organized clearly (`references/`, `assets/`, and optional `scripts/`)
- Keep the main instructions concise and move longer material to supporting files

## How this informs `fusion-skill-authoring`

- Enforce metadata quality and naming constraints before scaffolding
- Capture user intent, outcomes, and triggers through follow-up questions
- Scaffold standard resource folders for consistency
- Include explicit safety boundaries and validation evidence in outputs