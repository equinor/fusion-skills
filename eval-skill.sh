#!/bin/bash
set -e

MODEL=""
PROMPT_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --model)
      MODEL="$2"
      shift 2
      ;;
    *)
      PROMPT_FILE="$1"
      shift
      ;;
  esac
done

# If no prompt file provided, prompt user to select from available prompts
if [ -z "$PROMPT_FILE" ]; then
  echo "📋 Available prompt files:"
  echo ""
  
  # Try to use fzf if available, otherwise fall back to select
  if command -v fzf &> /dev/null; then
    PROMPT_FILE=$(find evaluate/prompts -maxdepth 1 -type f -name "*.md" | fzf --preview 'head -20 {}' --preview-window=right:50%)
    if [ -z "$PROMPT_FILE" ]; then
      exit 0
    fi
  else
    # Fallback to bash select
    PS3="Select a prompt file (enter number): "
    select file in $(find evaluate/prompts -maxdepth 1 -type f -name "*.md" | sort); do
      if [ -n "$file" ]; then
        PROMPT_FILE="$file"
        break
      fi
    done
  fi
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Error: Prompt file not found: $PROMPT_FILE"
  exit 1
fi

EVAL_RUN_DIR=".tmp/eval/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EVAL_RUN_DIR"

echo "🔨 Building evaluation container..."
docker build \
  --file evaluate/Dockerfile \
  --target execute \
  -t fusion-skill-eval:latest \
  .

echo ""
echo "🚀 Running evaluation..."

# Write the token to a temp file so it is passed as a secret mount rather than
# an environment variable (avoids leaking in `docker inspect` / process table).
GH_TOKEN_FILE="$(mktemp)"
trap 'rm -f "$GH_TOKEN_FILE"' EXIT
gh auth token > "$GH_TOKEN_FILE"

DOCKER_RUN_ARGS=(
  --rm
  -ti
  -v "$PWD:/workspace/skills:ro"
  -v "$EVAL_RUN_DIR":/logs
  -v "$GH_TOKEN_FILE":/run/secrets/GH_TOKEN:ro
)

# Add model environment variable if specified
if [ -n "$MODEL" ]; then
  DOCKER_RUN_ARGS+=(-e "LM_MODEL=$MODEL")
fi

docker run \
  "${DOCKER_RUN_ARGS[@]}" \
  fusion-skill-eval:latest \
  "$(cat "$PROMPT_FILE")"

echo ""
echo "✅ Evaluation complete! Logs saved to $EVAL_RUN_DIR"
ls -lah "$EVAL_RUN_DIR"
