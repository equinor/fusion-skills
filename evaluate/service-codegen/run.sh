#!/usr/bin/env bash
# Runs a service code-generation case with Copilot CLI in a fresh git repo and scores the result.
# Usage: evaluate/service-codegen/run.sh <case.md> [--runs N] [--model M] [--judge] [--profile apm/fusion-developer-services]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
# Sibling repos (e.g. fusion-pss-project-demand) live next to the main checkout, also when run from a worktree.
REPOS_ROOT="${REPOS_ROOT:-$(cd "$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)/../.." && pwd)}"
COPILOT_BIN="${COPILOT_BIN:-copilot}"

CASE_FILE=""
RUNS=1
MODEL=""
JUDGE=false
PROFILE="apm/fusion-developer-services"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --runs) RUNS="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --judge) JUDGE=true; shift ;;
    --profile) PROFILE="$2"; shift 2 ;;
    -h|--help) sed -n 2,3p "$0"; exit 0 ;;
    *) CASE_FILE="$1"; shift ;;
  esac
done

[[ -f "$CASE_FILE" ]] || { echo "Case file not found: $CASE_FILE" >&2; exit 1; }
command -v "$COPILOT_BIN" >/dev/null || { echo "Copilot CLI not found (set COPILOT_BIN)" >&2; exit 1; }
command -v dotnet >/dev/null || { echo "dotnet SDK not found" >&2; exit 1; }

CASE_FILE="$(cd "$(dirname "$CASE_FILE")" && pwd)/$(basename "$CASE_FILE")"
CASE_NAME="$(basename "$CASE_FILE" .md)"

front_matter() { awk -v key="$1" 'NR==1 && $0=="---"{fm=1; next} fm && $0=="---"{exit} fm && index($0, key ":")==1 {sub("^" key ":[ ]*", ""); print}' "$CASE_FILE"; }
section() { awk -v name="$1" '$0 == "## " name {s=1; next} s && /^## /{exit} s' "$CASE_FILE"; }

AGENT="$(front_matter agent)"; AGENT="${AGENT:-fusion-services-developer}"
SEED_REPO="$(front_matter seed_repo)"
SEED_PATH="$(front_matter seed_path)"
PROMPT="$(section User)"
[[ -n "$PROMPT" ]] || { echo "Case has no '## User' section" >&2; exit 1; }

# Resolves every skills/... path reachable from an APM package, following nested apm/... dependencies.
resolve_skill_paths() {
  local pkg="$1"
  grep -E '^[[:space:]]+path:' "$ROOT/$pkg/apm.yml" | sed -E 's/^[[:space:]]+path:[[:space:]]*//' | while read -r dep; do
    if [[ "$dep" == apm/* ]]; then resolve_skill_paths "$dep"; else echo "$dep"; fi
  done
}
resolve_apm_packages() {
  local pkg="$1"
  echo "$pkg"
  grep -E '^[[:space:]]+path:[[:space:]]*apm/' "$ROOT/$pkg/apm.yml" | sed -E 's/^[[:space:]]+path:[[:space:]]*//' | while read -r dep; do resolve_apm_packages "$dep"; done
}

install_profile() {
  local ws="$1"
  mkdir -p "$ws/.github/skills" "$ws/.github/agents" "$ws/.github/instructions"
  resolve_skill_paths "$PROFILE" | sort -u | while read -r skill; do
    cp -R "$ROOT/$skill" "$ws/.github/skills/$(basename "$skill")"
  done
  resolve_apm_packages "$PROFILE" | sort -u | while read -r pkg; do
    [[ -d "$ROOT/$pkg/.apm/agents" ]] && cp "$ROOT/$pkg/.apm/agents/"*.md "$ws/.github/agents/"
    [[ -d "$ROOT/$pkg/.apm/instructions" ]] && cp "$ROOT/$pkg/.apm/instructions/"*.md "$ws/.github/instructions/"
  done
  return 0
}

seed_workspace() {
  local ws="$1"
  if [[ -n "$SEED_REPO" ]]; then
    local src="$REPOS_ROOT/$SEED_REPO"
    [[ -d "$src" ]] || { echo "Seed repo not found: $src" >&2; exit 1; }
    rsync -a --exclude bin --exclude obj --exclude TestResults --exclude node_modules "$src/${SEED_PATH:-.}/" "$ws/${SEED_PATH:-.}/"
    [[ -f "$src/global.json" ]] && cp "$src/global.json" "$ws/"
  else
    cp "$SCRIPT_DIR/seed/"* "$ws/"
  fi
}

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$ROOT/.tmp/eval/service-codegen/$STAMP-$CASE_NAME"
mkdir -p "$OUT"
git -C "$ROOT" rev-parse --short HEAD > "$OUT/skills-commit.txt"
echo "Results: $OUT"

for ((i = 1; i <= RUNS; i++)); do
  RUN_DIR="$OUT/run-$i"
  WS="$RUN_DIR/workspace"
  mkdir -p "$WS"
  git -C "$WS" init -q
  seed_workspace "$WS"
  install_profile "$WS"
  git -C "$WS" add -A
  git -C "$WS" -c user.name=eval -c user.email=eval@localhost commit -q -m "seed" --allow-empty

  echo "== $CASE_NAME run $i/$RUNS (agent: $AGENT)"
  COPILOT_ARGS=(--agent "$AGENT" --allow-all-tools --no-ask-user --autopilot --max-autopilot-continues 15
    --add-dir "$WS" --log-dir "$RUN_DIR/logs" --share "$RUN_DIR/session.md" -p "$PROMPT")
  [[ -n "$MODEL" ]] && COPILOT_ARGS+=(--model "$MODEL")
  START=$(date +%s)
  (cd "$WS" && "$COPILOT_BIN" "${COPILOT_ARGS[@]}") > "$RUN_DIR/transcript.log" 2>&1 || echo "copilot exited non-zero" >> "$RUN_DIR/transcript.log"
  echo "$(( $(date +%s) - START ))" > "$RUN_DIR/duration-seconds.txt"

  git -C "$WS" add -A >/dev/null 2>&1 || true
  git -C "$WS" diff --cached --stat HEAD > "$RUN_DIR/diffstat.txt" 2>/dev/null || true

  dotnet run "$SCRIPT_DIR/checks.cs" -- --workspace "$WS" --case "$CASE_FILE" --out "$RUN_DIR" || true

  if [[ "$JUDGE" == true ]]; then
    REFERENCE="$REPOS_ROOT/fusion-pss-project-demand/backend"
    JUDGE_PROMPT="$(cat "$SCRIPT_DIR/judge.md")

## Case rubric
$(section Eval)

## Paths
- Generated workspace: $WS
- Reference implementation: $REFERENCE
- Deterministic scorecard: $RUN_DIR/scorecard.md"
    (cd "$WS" && "$COPILOT_BIN" --allow-all-tools --no-ask-user --add-dir "$WS" --add-dir "$REFERENCE" --add-dir "$RUN_DIR" \
      ${MODEL:+--model "$MODEL"} -p "$JUDGE_PROMPT") > "$RUN_DIR/judge.md" 2>&1 || true
  fi
done

echo
echo "Summary ($OUT):"
for f in "$OUT"/run-*/scorecard.md; do [[ -f "$f" ]] && head -n 3 "$f"; done
