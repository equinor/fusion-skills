#!/usr/bin/env bash
set -euo pipefail

# Entrypoint script for evaluating Copilot skills.
# Usage: docker run ... <image> "$(cat prompt_file.md)"

if [[ $# -eq 0 ]]; then
  echo "Error: Please provide a prompt file content as an argument." >&2
  echo "Usage: docker run ... <image> \"\$(cat prompt_file.md)\"" >&2
  exit 1
fi

# Capture the prompt from the first argument
PROMPT="$1"

# Export the prompt for setup.ts to read
export PROMPT

# Handle model: map LM_MODEL to MODEL for setup.ts
if [[ -n "${LM_MODEL:-}" ]]; then
  export MODEL="$LM_MODEL"
fi

# Handle GH_TOKEN: either from environment variable or from secret mount
if [[ -z "${GH_TOKEN:-}" ]] && [[ -f /run/secrets/GH_TOKEN ]]; then
  export GH_TOKEN="$(cat /run/secrets/GH_TOKEN)"
fi

# Set up logs directory
mkdir -p /logs

echo "=== Evaluating Copilot Skill ==="
echo "Prompt length: ${#PROMPT} characters"

# Run setup to parse the prompt and generate config files
echo "📝 Setting up configuration..."
bun setup.ts

echo ""
echo " Running Copilot execution..."
copilot $(tr "\n" " " < execution-flags.txt) -p "$(cat copilot-prompt.md)" 2>&1 \
  | tee /logs/result.log

echo ""
echo "📊 Preparing evaluation..."
{
  printf "## Eval\n"
  cat eval-prompt.md
  printf "\n## Result\n"
  cat /logs/result.log
} > /logs/judge-input.md

echo ""
echo "🧑‍⚖️ Running judge evaluation..."
copilot --agent judge -p "$(cat /logs/judge-input.md)" $(tr "\n" " " < execution-flags.txt) 2>&1 \
  | tee /logs/evaluate.log

echo ""
echo "✅ Evaluation complete!"
echo "Logs written to /logs/"
ls -lah /logs/
