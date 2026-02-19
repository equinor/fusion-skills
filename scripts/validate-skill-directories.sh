#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

echo "Discovering local skill directories from SKILL.md files..."
skill_dirs=()
while IFS= read -r skill_dir; do
  skill_dirs+=("$skill_dir")
done < <(find skills -type f -name "SKILL.md" -print | sed 's|/SKILL.md$||' | sort)

local_count="${#skill_dirs[@]}"

echo
echo "Local skills ($local_count):"
if [[ "$local_count" -eq 0 ]]; then
  echo "- none"
else
  for skill_dir in "${skill_dirs[@]}"; do
    echo "- $skill_dir"
  done
fi

echo
echo "Running skills CLI validation..."
cli_output="$(npx -y skills add . --list 2>&1)"
echo "$cli_output"

cli_count="$(printf '%s\n' "$cli_output" | grep -Eo 'Found[[:space:]]+[0-9]+[[:space:]]+skill(s)?' | grep -Eo '[0-9]+' | tail -n 1 || true)"

if [[ -z "$cli_count" ]]; then
  echo
  echo "ERROR: Could not parse skill count from CLI output."
  exit 1
fi

echo
echo "CLI reported skills: $cli_count"

if [[ "$local_count" != "$cli_count" ]]; then
  echo "ERROR: Mismatch detected. Local SKILL.md directories=$local_count, CLI reported=$cli_count"
  exit 1
fi

echo "Skill count check passed."
