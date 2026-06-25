#!/usr/bin/env bash
set -euo pipefail
CONTENT_DIR="$(dirname "$0")/../content/upstream"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

sync_repo() {
  local name="$1"
  local url="$2"
  shift 2
  local sparse_dirs=("$@")
  local target="$CONTENT_DIR/$name"
  echo "→ Syncing $name..."
  if [ ! -d "$target/.git" ]; then
    git clone --depth=1 --filter=blob:none --sparse "$url" "$target"
    cd "$target"
    git sparse-checkout set "${sparse_dirs[@]}"
    cd - > /dev/null
  else
    cd "$target"
    git pull --depth=1
    git sparse-checkout set "${sparse_dirs[@]}"
    cd - > /dev/null
  fi
  local commit_hash
  commit_hash=$(git -C "$target" rev-parse --short HEAD)
  echo "  ✓ $name @ $commit_hash"
  echo "$commit_hash"
}

mkdir -p "$CONTENT_DIR"

hash1=$(sync_repo \
  "ai-engineering-from-scratch" \
  "https://github.com/rohitg00/ai-engineering-from-scratch" \
  "phases" "projects" "glossary")

hash2=$(sync_repo \
  "dictionary-of-ai-coding" \
  "https://github.com/ZakyTm/dictionary-of-ai-coding" \
  "." )

cat > "$CONTENT_DIR/.sync-meta.json" <<EOF
{
  "lastSynced": "$TIMESTAMP",
  "repos": {
    "ai-engineering-from-scratch": "$hash1",
    "dictionary-of-ai-coding": "$hash2"
  }
}
EOF

echo ""
echo "✓ Sync complete at $TIMESTAMP"
