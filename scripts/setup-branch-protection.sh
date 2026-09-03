#!/usr/bin/env bash
# Applies branch protection to main and staging.
#
#   gh auth login          # once, first
#   ./scripts/setup-branch-protection.sh
#
# Safe to re-run: an existing ruleset of the same name is updated, not duplicated.
# Requires push access to the repo. The repo is public, so rulesets are free.

set -euo pipefail

REPO="${REPO:-James-Jok-Akuei/hasa-hasa}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/rulesets"

if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Run: gh auth login" >&2
  exit 1
fi

apply() {
  local name="$1" file="$2"
  local id
  id="$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name==\"$name\") | .id" 2>/dev/null || true)"

  if [ -n "$id" ]; then
    echo "Updating ruleset '$name' (id $id)"
    gh api "repos/$REPO/rulesets/$id" --method PUT --input "$file" >/dev/null
  else
    echo "Creating ruleset '$name'"
    gh api "repos/$REPO/rulesets" --method POST --input "$file" >/dev/null
  fi
}

apply protect-main    "$DIR/main.json"
apply protect-staging "$DIR/staging.json"

echo
echo "Done. Both branches now require:"
echo "  - a pull request (no direct pushes)"
echo "  - the 'ci' check passing, on an up-to-date branch"
echo "  - no force-pushes, no branch deletion"
echo "  - main additionally requires 1 approving review"
echo
echo "Note: no bypass actors are configured, so these apply to the repo owner too."
echo "That is intentional - it is what stops another force-push to main."
