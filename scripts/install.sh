#!/usr/bin/env bash
# Copies selected skills from this repo into a target project's skills
# directory. Select by exact name, by category, or copy everything.
#
# Usage:
#   install.sh --target <dir> --all
#   install.sh --target <dir> --name skill-a,skill-b
#   install.sh --target <dir> --category diagnosis,behaviour-definition
#   install.sh --target <dir> --check
#   install.sh --list
set -euo pipefail

# Empty when the script is piped from curl rather than run from a file.
SCRIPT_PATH="${BASH_SOURCE[0]:-}"
REPO_TARBALL_URL="https://github.com/Joe-Speed/behavioural-skills/archive/refs/heads/main.tar.gz"
REPO_RAW_BASE="https://raw.githubusercontent.com/Joe-Speed/behavioural-skills/main"

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
  $(basename "$0") --target <dir> --check
  $(basename "$0") --list

Options:
  --target <dir>     Project directory to install into. Skills are copied
                      into <dir>/skills/<skill-name>/.
  --all               Install every skill in the repo.
  --name <list>        Comma-separated exact skill names (folder names).
  --category <list>    Comma-separated category ids (see schema/taxonomy.yaml).
  --check              Compare each skill already installed under
                        <dir>/skills/ against its current version in the
                        repo and report which are outdated.
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

skill_version() {
  grep -m1 '^version:' "$1" | sed -E 's/^version:[[:space:]]*//'
}

# Compares each locally installed skill's version against the repo's current
# one, fetched per-skill via raw.githubusercontent.com rather than the full
# tarball — this only needs to know what changed, not the content itself.
check_versions() {
  local installed_dir="$TARGET/skills"
  if [ ! -d "$installed_dir" ]; then
    echo "Error: no skills installed under $installed_dir" >&2
    exit 1
  fi

  local outdated=0
  for dir in "$installed_dir"/*/; do
    local name local_version remote_version
    name="$(basename "$dir")"
    [ -f "$dir/SKILL.md" ] || continue
    local_version="$(skill_version "$dir/SKILL.md")"
    remote_version="$(curl -sSL "$REPO_RAW_BASE/skills/$name/SKILL.md" | (grep -m1 '^version:' || true) | sed -E 's/^version:[[:space:]]*//')"
    if [ -z "$remote_version" ]; then
      printf "%-40s local %-10s remote: not found in repo\n" "$name" "$local_version"
    elif [ "$local_version" = "$remote_version" ]; then
      printf "%-40s %s (up to date)\n" "$name" "$local_version"
    else
      printf "%-40s %-10s -> %s available\n" "$name" "$local_version" "$remote_version"
      outdated=$((outdated + 1))
    fi
  done

  if [ "$outdated" -gt 0 ]; then
    echo "$outdated skill(s) have a newer version available. Re-run install with --name to update."
  else
    echo "All installed skills are up to date."
  fi
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
    --check)
      MODE="check"; shift ;;
    --list)
      MODE="list"; shift ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [ -z "$MODE" ]; then
  echo "Error: specify --all, --name, --category, or --check (or use --list)." >&2
  usage >&2
  exit 1
fi

# --check compares against the repo directly (one file per installed skill)
# rather than fetching the whole tarball, so it's dispatched before
# ensure_skills_src.
if [ "$MODE" = "check" ]; then
  if [ -z "$TARGET" ]; then
    echo "Error: --target <dir> is required." >&2
    exit 1
  fi
  check_versions
  exit 0
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
