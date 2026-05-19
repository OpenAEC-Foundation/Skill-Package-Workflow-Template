#!/usr/bin/env bash
# bootstrap-new-package.sh : Copy templates + placeholder-replace + dir-tree init
# Used by BOOTSTRAP-RUNBOOK.md Phase 1.
#
# Usage:
#   bash bootstrap-new-package.sh \
#     --tech frappe \
#     --tech-full "Frappe Framework" \
#     --prefix frappe \
#     --repo-name Frappe-Claude-Skill-Package \
#     --license MIT \
#     --versions "v14,v15,v16" \
#     --languages "Python,JavaScript" \
#     --workspace /home/freek/GitHub/Frappe-Claude-Skill-Package \
#     [--github-owner FreekHeijting] \
#     [--template /home/freek/GitHub/Skill-Package-Workflow-Template]

set -euo pipefail

TECH=""
TECH_FULL=""
PREFIX=""
REPO_NAME=""
LICENSE="MIT"
VERSIONS=""
LANGUAGES=""
WORKSPACE=""
GITHUB_OWNER="FreekHeijting"
TEMPLATE=""
SHORT_DESCRIPTION=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tech) TECH="$2"; shift 2 ;;
    --tech-full) TECH_FULL="$2"; shift 2 ;;
    --prefix) PREFIX="$2"; shift 2 ;;
    --repo-name) REPO_NAME="$2"; shift 2 ;;
    --license) LICENSE="$2"; shift 2 ;;
    --versions) VERSIONS="$2"; shift 2 ;;
    --languages) LANGUAGES="$2"; shift 2 ;;
    --workspace) WORKSPACE="$2"; shift 2 ;;
    --github-owner) GITHUB_OWNER="$2"; shift 2 ;;
    --template) TEMPLATE="$2"; shift 2 ;;
    --short-description) SHORT_DESCRIPTION="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# Auto-resolve template path if not given
if [[ -z "$TEMPLATE" ]]; then
  # Script lives at <template>/scripts/bootstrap-new-package.sh
  TEMPLATE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

# Required args
for var in TECH TECH_FULL PREFIX REPO_NAME VERSIONS LANGUAGES WORKSPACE; do
  if [[ -z "${!var}" ]]; then
    echo "ERROR: --${var,,} is required" >&2
    exit 2
  fi
done

# Validate prefix
if ! [[ "$PREFIX" =~ ^[a-z][a-z0-9-]{2,7}$ ]]; then
  echo "ERROR: prefix must match ^[a-z][a-z0-9-]{2,7}$ (got: $PREFIX)" >&2
  exit 2
fi

# Validate template exists
if [[ ! -d "$TEMPLATE/templates" ]]; then
  echo "ERROR: template dir not found: $TEMPLATE/templates" >&2
  exit 1
fi

# Lower-case repo name for npm
REPO_NAME_LOWER=$(echo "$REPO_NAME" | tr '[:upper:]' '[:lower:]')
TECH_BADGE_NAME=$(echo "$TECH_FULL" | sed 's/ /_/g')
LANGUAGES_LOWER=$(echo "$LANGUAGES" | tr '[:upper:]' '[:lower:]' | sed 's/,/","/g')
YEAR=$(date +%Y)
DATE=$(date +%Y-%m-%d)
SHORT_DESC_DEFAULT="Deterministic Claude skills for ${TECH_FULL} ${VERSIONS}"
SHORT_DESCRIPTION="${SHORT_DESCRIPTION:-$SHORT_DESC_DEFAULT}"

echo "=== Bootstrap : ${REPO_NAME} ==="
echo "  tech           : $TECH ($TECH_FULL)"
echo "  prefix         : $PREFIX"
echo "  versions       : $VERSIONS"
echo "  languages      : $LANGUAGES"
echo "  license        : $LICENSE"
echo "  workspace      : $WORKSPACE"
echo "  github owner   : $GITHUB_OWNER"
echo "  template src   : $TEMPLATE"
echo ""

mkdir -p "$WORKSPACE"
cd "$WORKSPACE"

# -----------------------------------------------------------------------------
# Dir tree
# -----------------------------------------------------------------------------
echo "[1/4] Creating directory tree"
mkdir -p \
  skills/source/${PREFIX}-core \
  skills/source/${PREFIX}-syntax \
  skills/source/${PREFIX}-impl \
  skills/source/${PREFIX}-errors \
  skills/source/${PREFIX}-agents \
  docs/masterplan \
  docs/research/topic-research \
  docs/research/fragments \
  docs/validation \
  agents \
  .github/workflows \
  .github/ISSUE_TEMPLATE \
  .vscode \
  .claude

# -----------------------------------------------------------------------------
# Render function (placeholder replace)
# -----------------------------------------------------------------------------
render() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "$src" ]]; then
    echo "  WARN: template missing: $src (skipping $dest)"
    return
  fi
  sed \
    -e "s|{{TECH}}|${TECH}|g" \
    -e "s|{{TECH_FULL_NAME}}|${TECH_FULL}|g" \
    -e "s|{{TECHNOLOGY}}|${TECH_FULL}|g" \
    -e "s|{{TECH_BADGE_NAME}}|${TECH_BADGE_NAME}|g" \
    -e "s|{{PREFIX}}|${PREFIX}|g" \
    -e "s|{{REPO_NAME}}|${REPO_NAME}|g" \
    -e "s|{{REPO_NAME_LOWER}}|${REPO_NAME_LOWER}|g" \
    -e "s|{{LICENSE}}|${LICENSE}|g" \
    -e "s|{{VERSIONS}}|${VERSIONS}|g" \
    -e "s|{{LANGUAGES}}|${LANGUAGES}|g" \
    -e "s|{{LANGUAGES_LOWER}}|${LANGUAGES_LOWER}|g" \
    -e "s|{{YEAR}}|${YEAR}|g" \
    -e "s|{{DATE}}|${DATE}|g" \
    -e "s|{{GITHUB_OWNER}}|${GITHUB_OWNER}|g" \
    -e "s|{{SHORT_DESCRIPTION}}|${SHORT_DESCRIPTION}|g" \
    -e "s|{{SKILL_COUNT}}|0|g" \
    -e "s|{{CORE_COUNT}}|0|g" \
    -e "s|{{SYNTAX_COUNT}}|0|g" \
    -e "s|{{IMPL_COUNT}}|0|g" \
    -e "s|{{ERRORS_COUNT}}|0|g" \
    -e "s|{{AGENTS_COUNT}}|0|g" \
    "$src" > "$dest"
  echo "  OK: $dest"
}

# -----------------------------------------------------------------------------
# Render core files
# -----------------------------------------------------------------------------
echo ""
echo "[2/4] Rendering core files"

render "$TEMPLATE/templates/CLAUDE.md.template"             "CLAUDE.md"
render "$TEMPLATE/templates/ROADMAP.md.template"            "ROADMAP.md"
render "$TEMPLATE/templates/REQUIREMENTS.md.template"       "REQUIREMENTS.md"
render "$TEMPLATE/templates/DECISIONS.md.template"          "DECISIONS.md"
render "$TEMPLATE/templates/SOURCES.md.template"            "SOURCES.md"
render "$TEMPLATE/templates/WAY_OF_WORK.md.template"        "WAY_OF_WORK.md"
render "$TEMPLATE/templates/LESSONS.md.template"            "LESSONS.md"
render "$TEMPLATE/templates/CHANGELOG.md.template"          "CHANGELOG.md"
render "$TEMPLATE/templates/README.md.template"             "README.md"
render "$TEMPLATE/templates/INDEX.md.template"              "INDEX.md"
render "$TEMPLATE/templates/HANDOFF.md.template"            "HANDOFF.md"
render "$TEMPLATE/templates/OPEN-QUESTIONS.md.template"     "OPEN-QUESTIONS.md"
render "$TEMPLATE/templates/START-PROMPT.md.template"       "START-PROMPT.md"
render "$TEMPLATE/templates/INSTALL.md.template"            "INSTALL.md"
render "$TEMPLATE/templates/USAGE.md.template"              "USAGE.md"
render "$TEMPLATE/templates/CONTRIBUTING.md.template"       "CONTRIBUTING.md"
render "$TEMPLATE/templates/SECURITY.md.template"           "SECURITY.md"
render "$TEMPLATE/templates/AGENT-SKILLS-STANDARD.md.template" "AGENT-SKILLS-STANDARD.md"
render "$TEMPLATE/templates/package.json.template"          "package.json"
render "$TEMPLATE/templates/openai.yaml.template"           "agents/openai.yaml"
render "$TEMPLATE/templates/gitignore.template"             ".gitignore"
render "$TEMPLATE/templates/CODEOWNERS.template"            ".github/CODEOWNERS"
render "$TEMPLATE/templates/quality.yml.template"           ".github/workflows/quality.yml"
render "$TEMPLATE/templates/auto-assign-issues.yml.template" ".github/workflows/auto-assign-issues.yml"
render "$TEMPLATE/templates/vscode-tasks.json.template"     ".vscode/tasks.json"
render "$TEMPLATE/templates/claude-settings.json.template"  ".claude/settings.json"
render "$TEMPLATE/templates/social-preview-banner.html.template" "docs/social-preview-banner.html"

# Raw masterplan stub
cat > "docs/masterplan/${TECH}-masterplan.md" <<EOF
# Masterplan : ${TECH_FULL}

> Status : Phase 1 raw : pre-research
> Generated : ${DATE}

## Scope

- Technology : ${TECH_FULL}
- Versions : ${VERSIONS}
- Languages : ${LANGUAGES}
- Prefix : ${PREFIX}
- License : ${LICENSE}

## Identified Topics (raw, pre-research)

TODO : fill via Phase 1 step 3.5 brainstorm. Group by category.

### Core

- ...

### Syntax

- ...

### Implementation

- ...

### Errors

- ...

### Agents

- ...

## Estimated Skill Count

TODO

## Next : Phase 2 Deep Research

After this raw masterplan is committed, dispatch research-agent per topic-cluster to produce \`docs/research/vooronderzoek-${TECH}.md\`.
EOF
echo "  OK: docs/masterplan/${TECH}-masterplan.md"

# Vooronderzoek stub
cat > "docs/research/vooronderzoek-${TECH}.md" <<EOF
# Vooronderzoek : ${TECH_FULL}

> Status : Phase 2 pending
> Generated : ${DATE}

This file will be populated by the Phase 2 research agent.
Target : 2000+ words, all sections per BOOTSTRAP-RUNBOOK §4.

## Newly Discovered Sub-Topics

(populated during research)
EOF
echo "  OK: docs/research/vooronderzoek-${TECH}.md"

# -----------------------------------------------------------------------------
# License file
# -----------------------------------------------------------------------------
echo ""
echo "[3/4] Writing LICENSE"
if [[ "$LICENSE" == "MIT" ]]; then
cat > LICENSE <<EOF
MIT License

Copyright (c) ${YEAR} OpenAEC Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
  echo "  OK: LICENSE (MIT)"
else
  echo "  WARN: license=${LICENSE} : write LICENSE manually"
fi

# -----------------------------------------------------------------------------
# Verify
# -----------------------------------------------------------------------------
echo ""
echo "[4/4] Verify"
MISSING=()
for f in CLAUDE.md ROADMAP.md REQUIREMENTS.md DECISIONS.md SOURCES.md WAY_OF_WORK.md LESSONS.md CHANGELOG.md README.md INDEX.md HANDOFF.md OPEN-QUESTIONS.md START-PROMPT.md package.json agents/openai.yaml .gitignore .github/CODEOWNERS .github/workflows/quality.yml .github/workflows/auto-assign-issues.yml .vscode/tasks.json .claude/settings.json LICENSE; do
  [[ -f "$f" ]] || MISSING+=("$f")
done
for d in skills/source docs/masterplan docs/research; do
  [[ -d "$d" ]] || MISSING+=("$d/")
done

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "FAIL : missing files/dirs :"
  printf '  - %s\n' "${MISSING[@]}"
  exit 1
fi

echo "  OK : all core files + dirs present"
echo ""
echo "=== Bootstrap complete ==="
echo ""
echo "Next steps :"
echo "  1. cd $WORKSPACE"
echo "  2. git init -b main && git add . && git commit -m 'feat: bootstrap ${TECH_FULL} skill package workspace'"
echo "  3. gh repo create OpenAEC-Foundation/${REPO_NAME} --public --description \"${SHORT_DESCRIPTION}\""
echo "  4. git remote add origin https://github.com/OpenAEC-Foundation/${REPO_NAME}.git && git push -u origin main"
echo "  5. gh repo edit OpenAEC-Foundation/${REPO_NAME} --add-topic claude --add-topic skills --add-topic ai --add-topic deterministic --add-topic openaec --add-topic agentskills --add-topic ${TECH}"
echo "  6. Edit docs/masterplan/${TECH}-masterplan.md : fill in Identified Topics"
echo "  7. Dispatch Phase 2 research agent (see BOOTSTRAP-RUNBOOK.md §4)"
