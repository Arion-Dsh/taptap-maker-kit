#!/bin/sh

set -eu

skill_name="taptap-maker-kit"
scope="user"
selected_editor="all"
project_target="."

usage() {
  cat <<'EOF'
Usage: ./install.sh [options]

Install taptap-maker-kit as a symbolic link.

Options:
  --scope user|project        Install for the current user or one project.
                              Default: user
  --editor NAME              codex, cursor, claude, gemini, or all.
                              Default: all
  --target DIRECTORY         Project directory used with --scope project.
                              Default: current directory
  -h, --help                 Show this help.
EOF
}

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --scope)
      [ "$#" -ge 2 ] || fail "--scope requires a value"
      scope="$2"
      shift 2
      ;;
    --editor)
      [ "$#" -ge 2 ] || fail "--editor requires a value"
      selected_editor="$2"
      shift 2
      ;;
    --target)
      [ "$#" -ge 2 ] || fail "--target requires a directory"
      project_target="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

case "$scope" in
  user|project) ;;
  *) fail "--scope must be user or project" ;;
esac

case "$selected_editor" in
  all) editors="codex cursor claude gemini" ;;
  codex|cursor|claude|gemini) editors="$selected_editor" ;;
  *) fail "--editor must be codex, cursor, claude, gemini, or all" ;;
esac

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
[ -f "$script_dir/SKILL.md" ] || fail "SKILL.md was not found beside install.sh"

if [ "$scope" = "user" ]; then
  [ -n "${HOME:-}" ] || fail "HOME is not set"
  install_root=$HOME
else
  [ -d "$project_target" ] || fail "project target does not exist: $project_target"
  install_root=$(CDPATH= cd -- "$project_target" && pwd -P)
fi

destination_for() {
  editor_name=$1
  printf '%s/.%s/skills/%s\n' "$install_root" "$editor_name" "$skill_name"
}

# Check every destination before making changes so a collision cannot leave a
# partially installed set of links.
for editor_name in $editors; do
  destination=$(destination_for "$editor_name")
  if [ -L "$destination" ]; then
    existing_target=$(readlink "$destination")
    [ "$existing_target" = "$script_dir" ] || \
      fail "$destination is already a link to another location"
  elif [ -e "$destination" ]; then
    fail "$destination already exists; remove or relocate it manually"
  fi
done

for editor_name in $editors; do
  destination=$(destination_for "$editor_name")
  if [ -L "$destination" ]; then
    printf 'Already installed: %s\n' "$destination"
    continue
  fi

  mkdir -p "$(dirname -- "$destination")"
  ln -s "$script_dir" "$destination"
  printf 'Installed: %s -> %s\n' "$destination" "$script_dir"
done
