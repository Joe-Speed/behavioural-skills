#!/usr/bin/env bash
# Copies selected skills from this repo into a target project's skills
# directory. Select by exact name, by category, or copy everything.
#
# Usage:
#   install.sh --target <dir> --all
#   install.sh --target <dir> --name skill-a,skill-b
#   install.sh --target <dir> --category diagnosis,behavior-definition
#   install.sh --list
set -euo pipefail

# Empty when the script is piped from curl rather than run from a file.
SCRIPT_PATH="${BASH_SOURCE[0]:-}"
REPO_TARBALL_URL="https://github.com/Joe-Speed/behavioural-skills/archive/refs/heads/main.tar.gz"

SKILLS_SRC=""
TMP_DIR=""
TARGET=""
MODE=""
SELECTOR=""

# Guarded so an empty TMP_DIR doesn't make the trap's last command exit 1
# under `set -e` on an otherwise-successful run from a checkout.
cleanup() {
  [ -z "$TMP_DIR" ] || rm -rf "$TMP_DIR"
}
trap cleanup EXIT

# When run from a repo checkout, copy skills straight from it. When piped
# (curl ... | bash) there is no checkout on disk, so fetch the repo tarball
# into a temp dir and copy from that instead. taxonomy.yaml alongside skills/
# confirms it's *this* repo, not an unrelated sibling directory named skills.
ensure_skills_src() {
  if [ -n "$SCRIPT_PATH" ]; then
    local repo_root
    repo_root="$(cd "$(dirname "$SCRIPT_PATH")/.." 2>/dev/null && pwd)"
    if [ -n "$repo_root" ] && [ -d "$repo_root/skills" ] && [ -f "$repo_root/schema/taxonomy.yaml" ]; then
      SKILLS_SRC="$repo_root/skills"
      return
    fi
  fi
  echo "Fetching skills from $REPO_TARBALL_URL ..." >&2
  TMP_DIR="$(mktemp -d)"
  curl -sSL "$REPO_TARBALL_URL" | tar -xz -C "$TMP_DIR"
  SKILLS_SRC="$TMP_DIR/behavioural-skills-main/skills"
  if [ ! -d "$SKILLS_SRC" ]; then
    echo "Error: could not fetch skills from $REPO_TARBALL_URL" >&2
    exit 1
  fi
}

usage() {
  cat <<EOF
Usage:
  $(basename "$0") --target <dir> --all
  $(basename "$0") --target <dir> --name <skill-a,skill-b,...>
  $(basename "$0") --target <dir> --category <cat-a,cat-b,...>
  $(basename "$0") --list

Options:
  --target <dir>     Project directory to install into. Skills are copied
                      into <dir>/skills/<skill-name>/.
  --all               Install every skill in the repo.
  --name <list>        Comma-separated exact skill names (folder names).
  --category <list>    Comma-separated category ids (see schema/taxonomy.yaml).
  --list               List all available skills with their category and
                        title, then exit. Ignores --target.
  -h, --help            Show this help.
EOF
}

skill_category() {
  # Extracts the single-line `category: <id>` value from a SKILL.md.
  grep -m1 '^category:' "$1" | sed -E 's/^category:[[:space:]]*//'
}

skill_title() {
  grep -m1 '^title:' "$1" | sed -E 's/^title:[[:space:]]*//'
}

list_skills() {
  printf "%-28s %-20s %s\n" "NAME" "CATEGORY" "TITLE"
  for dir in "$SKILLS_SRC"/*/; do
    name="$(basename "$dir")"
    md="$dir/SKILL.md"
    [ -f "$md" ] || continue
    printf "%-28s %-20s %s\n" "$name" "$(skill_category "$md")" "$(skill_title "$md")"
  done
}

while [ $# -gt 0 ]; do
  case "$1" in
    --target)
      TARGET="$2"; shift 2 ;;
    --all)
      MODE="all"; shift ;;
    --name)
      MODE="name"; SELECTOR="$2"; shift 2 ;;
    --category)
      MODE="category"; SELECTOR="$2"; shift 2 ;;
    --list)
      MODE="list"; shift ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [ -z "$MODE" ]; then
  echo "Error: specify --all, --name, or --category (or use --list)." >&2
  usage >&2
  exit 1
fi

ensure_skills_src

if [ "$MODE" = "list" ]; then
  list_skills
  exit 0
fi

if [ -z "$TARGET" ]; then
  echo "Error: --target <dir> is required." >&2
  exit 1
fi

DEST="$TARGET/skills"
mkdir -p "$DEST"

declare -a TO_INSTALL=()

case "$MODE" in
  all)
    for dir in "$SKILLS_SRC"/*/; do
      TO_INSTALL+=("$(basename "$dir")")
    done
    ;;
  name)
    IFS=',' read -ra NAMES <<< "$SELECTOR"
    for n in "${NAMES[@]}"; do
      case "$n" in
        ""|*/*|*..*)
          echo "Error: invalid skill name '$n' — names cannot be empty or contain '/' or '..'" >&2
          exit 1 ;;
      esac
      if [ ! -d "$SKILLS_SRC/$n" ]; then
        echo "Error: no skill named '$n' in $SKILLS_SRC" >&2
        exit 1
      fi
      TO_INSTALL+=("$n")
    done
    ;;
  category)
    IFS=',' read -ra CATS <<< "$SELECTOR"
    for dir in "$SKILLS_SRC"/*/; do
      name="$(basename "$dir")"
      md="$dir/SKILL.md"
      [ -f "$md" ] || continue
      cat="$(skill_category "$md")"
      for c in "${CATS[@]}"; do
        if [ "$cat" = "$c" ]; then
          TO_INSTALL+=("$name")
        fi
      done
    done
    if [ ${#TO_INSTALL[@]} -eq 0 ]; then
      echo "Warning: no skills matched category selector '$SELECTOR'." >&2
    fi
    ;;
esac

for name in "${TO_INSTALL[@]}"; do
  rm -rf "$DEST/$name"
  cp -R "$SKILLS_SRC/$name" "$DEST/$name"
  echo "installed: $name -> $DEST/$name"
done

echo "${#TO_INSTALL[@]} skill(s) installed into $DEST"
