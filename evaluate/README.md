# Evaluate

Run an evaluation by loading a case file from `evaluate/prompts/` into the `PROMPT` build arg:

```bash
mkdir -p .tmp/copilot-evaluation
PROMPT="$(cat evaluate/prompts/find-skills.pull-request-automation-validation.md)" \
GH_TOKEN="$(gh auth token)" docker buildx build \
  --file evaluate/Dockerfile \
  --target export \
  --no-cache-filter export-files \
  --build-arg PROMPT \
  --secret id=GH_TOKEN,env=GH_TOKEN \
  --output type=local,dest=.tmp/copilot-evaluation \
  .
```

Optional execution overrides can be passed as extra build args:

```bash
GH_TOKEN="$(gh auth token)" docker buildx build \
  --file evaluate/Dockerfile \
  --target export \
  --build-arg PROMPT="$(cat evaluate/prompts/find-skills.pull-request-automation-validation.md)" \
  --build-arg AUTOPILOT=true \
  --build-arg YOLO=true \
  --build-arg MODEL=gpt-5.2 \
  --secret id=GH_TOKEN,env=GH_TOKEN \
  --output type=local,dest=.tmp/copilot-evaluation \
  .
```

The exported directory contains `<nonce>.log` and `<nonce>.evaluate.log`, where the nonce is generated inside the container.
Use `--no-cache-filter export-files` so only the export stage reruns and produces a fresh nonce without invalidating earlier cached stages.
`ALLOW_MCP_SERVER`, `AUTOPILOT`, and `YOLO` are resolved from prompt front matter by default. Set `--build-arg ALLOW_MCP_SERVER=...`, `--build-arg AUTOPILOT=...`, or `--build-arg YOLO=...` to override the prompt file.
`MODEL` is build-arg only and maps directly to `copilot --model <model>`.
The execute step passes `--agent <agent>`, `--autopilot`, and `--yolo` to `copilot` when those settings are enabled.

## Case Files

Case files in `evaluate/prompts/` are Markdown documents with YAML front matter and a single evaluation case per file.

### Front Matter

Use YAML front matter for Copilot execution arguments that apply to the whole file.

```md
---
allow_mcp: true
agent: my-custom-agent
autopilot: false
yolo: false
---
```

Supported front matter keys:

- `allow_mcp`: whether the case expects the Fusion MCP server to be available.
- `agent`: optional custom Copilot agent name for the execution step. When present, the wrapper runs `copilot --agent <agent> -p <user prompt>`.
- `autopilot`: optional boolean that enables `copilot --autopilot` for the execution step unless overridden by `--build-arg AUTOPILOT=...`.
- `yolo`: optional boolean that enables `copilot --yolo` for the execution step unless overridden by `--build-arg YOLO=...`.

The Docker prepare stage resolves those args and extracts the `## User` (or legacy `## Prompt`) and `## Eval` text blocks.

### `## User`

Use `## User` for the prompt text that should be sent to Copilot. The prepare stage extracts this section into `copilot-prompt.md`.
`## Prompt` is also accepted for backward compatibility.

### `## Eval`

Use `## Eval` for the evaluation rubric associated with that prompt file. The prepare stage extracts this section into `eval-prompt.md`.

## Judge Prompt

Shared evaluation instructions live in `evaluate/judge.md`.
The evaluate step combines that judge prompt with the case-specific `## Eval` rubric and the execution result before asking Copilot to rank the result against the eval checks and score the run.

Step-based sections such as `## 1. ...` are not supported. Use one prompt file per case.

Example structure:

```md
---
allow_mcp: true
agent: my-custom-agent
autopilot: true
yolo: false
---

## User
Ask Copilot to discover skills for pull request automation.

## Eval
Verify the response returns relevant skills and correct paths.
```

