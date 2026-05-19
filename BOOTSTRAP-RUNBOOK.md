# Bootstrap Runbook — Skill Package Workspace

> Single-source-of-truth voor het volledig opzetten van een nieuwe `{Tech}-Claude-Skill-Package` workspace, van A tot Z, zonder stilvallen.
>
> **Voor wie**: Een Claude Code sessie die in een nieuwe (lege of half-gevulde) workspace start en moet bootstrappen tot een production-grade skill package volgens de standaard van de laatste OpenAEC-releases (Frappe v3.2.0, ThatOpen 2026-05-18, QGIS 2026-05-17, Blender-Bonsai 73 skills).
>
> **Harde eis**: elke fase heeft een verify-conditie. Geen "vraag user". Geen "lijkt te werken". Geen fallback. Bij failure: root-cause-fix.
>
> **Werkprincipe**: Phase 1-2 in main-sessie, Phase 3 brainstorm met user, Phase 4-5 via tmux-orchestration met 3-4 workers, Phase 6-7 weer main-sessie. De main-sessie is altijd orchestrator.

---

## 0. Pre-flight — verifieer omgeving

Voor je begint moet dit kloppen. Verify allemaal voordat je verder gaat.

```bash
# 1. CLI tools aanwezig
command -v gh && command -v tmux && command -v jq && command -v node && command -v python3

# 2. GitHub auth werkt
gh auth status

# 3. OpenAEC-Foundation org toegang
gh repo list OpenAEC-Foundation --limit 1

# 4. Template repo cloned + actueel
test -d /home/freek/GitHub/Skill-Package-Workflow-Template/ && \
  cd /home/freek/GitHub/Skill-Package-Workflow-Template/ && \
  git fetch && git status

# 5. tmux-orchestration skill geinstalleerd
test -f /home/freek/.claude/skills/tmux-orchestration/SKILL.md

# 6. tmo CLI op PATH
command -v tmo
```

**Verify**: alle 6 commando's exit 0. Bij failure: install/configure ontbrekend onderdeel. **Niet door** zonder.

---

## 1. Phase 0 — Inputs van gebruiker

Eén `AskUserQuestion` call met 4 fixed inputs (single-select) + chat-prompt voor scope:

| # | Vraag | Header | Options |
|---|-------|--------|---------|
| 1 | Welke technologie? | Technology | (Other → user typt) |
| 2 | Pakket-grootte estimate? | Pkg size | klein 5-15 / medium 15-30 / groot 30-60 / xl 60+ |
| 3 | Aantal tech in pkg? | Multi-tech | single / multi 2-4 tech |
| 4 | MCP-server parallel-track? | MCP | nee / ja (Speckle-style) |

Daarna chat-ask voor:
```
Tech-info:
- Volledige naam: <Frappe Framework>
- Versies te ondersteunen: <v14, v15, v16>
- Programmeertalen: <Python, JavaScript>
- Prefix voor skills: <frappe>  (max 8 char, kebab, geen punten)
- Korte description voor README/banner (<= 80 char): <...>
- Officiele documentatie URL: <https://...>
- License: <MIT / LGPL-3.0 / Apache-2.0>
```

**Verify**: alle 7 velden ingevuld. Prefix matcht `^[a-z][a-z0-9-]{2,7}$`. Niet door zonder.

---

## 2. Phase 0.5 — Dependent Package Inventory (alleen multi-tech of cross-tech)

Reden: Cross-Tech-AEC L-016 — skelet-repos zijn niet bruikbaar voor cross-tech work. **Skip indien single-tech pkg.**

Stap:
```bash
gh repo list OpenAEC-Foundation --limit 100 --json name,description,updatedAt \
  | jq -r '.[] | select(.name | test("-Claude-Skill-Package$")) | "\(.updatedAt[0:10])  \(.name)"' \
  | sort -r
```

Per dependent tech: check of pkg `published` is (release v1.0.0+) of `skeleton` (geen skills). Bij skeleton: meld user en wacht beslissing (build dep eerst, of doorgaan met placeholders + LESSONS-marker).

**Verify**: lijst gemaakt + per dep status `published` / `skeleton` / `n.v.t.` vastgelegd in toekomstige `OPEN-QUESTIONS.md`.

---

## 3. Phase 1 — Workspace bootstrap

Doel: lege repo wordt volwaardige skill-pkg-workspace met alle governance files, gh-repo aangemaakt, eerste commit gepusht.

### 3.1 Init lokaal

```bash
TECH={frappe}          # van Phase 0
TECH_FULL="Frappe Framework"
PREFIX={frappe}
REPO_NAME="${TECH_FULL// /-}-Claude-Skill-Package"   # spaces -> dashes
WS=/home/freek/GitHub/${REPO_NAME}
TEMPLATE=/home/freek/GitHub/Skill-Package-Workflow-Template

mkdir -p "$WS" && cd "$WS"
git init -b main
```

### 3.2 Run bootstrap script

```bash
bash "$TEMPLATE/scripts/bootstrap-new-package.sh" \
  --tech "$TECH" \
  --tech-full "$TECH_FULL" \
  --prefix "$PREFIX" \
  --repo-name "$REPO_NAME" \
  --license MIT \
  --versions "v14,v15,v16" \
  --languages "Python,JavaScript" \
  --workspace "$WS"
```

Dit script:
1. Kopieert alle `templates/*.template` → `<WS>/<file>` met placeholder-replace (`{{TECH_FULL_NAME}}`, `{{PREFIX}}`, `{{REPO_NAME}}`, `{{LICENSE}}`, `{{VERSIONS}}`, `{{LANGUAGES}}`, `{{YEAR}}`).
2. Maakt dir-tree aan: `skills/source/`, `docs/masterplan/`, `docs/research/topic-research/`, `docs/research/fragments/`, `docs/validation/`, `agents/`, `.github/workflows/`, `.github/ISSUE_TEMPLATE/`.
3. Kopieert `.gitignore.template` → `.gitignore` (PROMPTS.md, SKILLS_LOG.md, .claude/, *.code-workspace, node_modules/).
4. Schrijft initiële `package.json` (zonder agents.skills[] — die komt in Phase 6.5).
5. Schrijft `agents/openai.yaml` met placeholders die in Phase 6.5 worden bijgewerkt.
6. Voegt `.vscode/tasks.json` toe (voor tmux-orchestration in Phase 5).
7. Configureert `.claude/settings.json` met `Bypass Permissions` aan.

### 3.3 GitHub remote + eerste commit

```bash
gh repo create "OpenAEC-Foundation/${REPO_NAME}" \
  --public \
  --description "Deterministic Claude skills for ${TECH_FULL}" \
  --license MIT

git remote add origin "https://github.com/OpenAEC-Foundation/${REPO_NAME}.git"
git add .
git commit -m "feat: bootstrap ${TECH_FULL} skill package workspace"
git push -u origin main
```

### 3.4 GitHub topics + repo settings

```bash
gh repo edit "OpenAEC-Foundation/${REPO_NAME}" \
  --add-topic claude \
  --add-topic skills \
  --add-topic ai \
  --add-topic deterministic \
  --add-topic openaec \
  --add-topic agentskills \
  --add-topic "${TECH}"
```

### 3.5 Raw masterplan

Schrijf `docs/masterplan/${TECH}-masterplan.md` met ALLE topics die je nu al weet (uit Phase 0 info + 5 min eigen brainstorm per categorie):

- Core architecture / runtime model
- API surface per module
- Configuration / setup
- Workflows / use cases
- Integrations
- Errors / debugging
- Version differences
- Cross-tech boundaries (alleen multi-tech)

Per topic: geschat aantal skills + categorie (core/syntax/impl/errors/agents). Geen onderzoek doen — alleen inventariseren. **Output**: raw masterplan met `## Status: Phase 1 raw — pre-research`.

### 3.6 Verify Phase 1

```bash
test -f CLAUDE.md && \
test -f ROADMAP.md && \
test -f REQUIREMENTS.md && \
test -f DECISIONS.md && \
test -f SOURCES.md && \
test -f WAY_OF_WORK.md && \
test -f LESSONS.md && \
test -f CHANGELOG.md && \
test -f README.md && \
test -f INDEX.md && \
test -f HANDOFF.md && \
test -f OPEN-QUESTIONS.md && \
test -f START-PROMPT.md && \
test -f package.json && \
test -f agents/openai.yaml && \
test -f .github/CODEOWNERS && \
test -f .github/workflows/quality.yml && \
test -f .github/workflows/auto-assign-issues.yml && \
test -f .gitignore && \
test -d skills/source && \
test -d docs/masterplan && \
test -d docs/research && \
gh repo view "OpenAEC-Foundation/${REPO_NAME}" >/dev/null && \
test -f "docs/masterplan/${TECH}-masterplan.md"
```

Alle tests groen + `git log --oneline -1` toont `feat: bootstrap`. **Niet door zonder.**

---

## 4. Phase 2 — Deep research (vooronderzoek)

Single-tech: 1 research-agent (opus). Multi-tech: 1 agent per tech parallel.

Per agent (zelfde message, parallel dispatch):

```
Je bent research-agent voor {TECH}. Doel: vooronderzoek dat onmiddellijk de basis legt voor masterplan-refinement (Phase 3). Geen LLM-hallucinaties — alles via WebFetch tegen SOURCES.md goedgekeurde URLs.

Lees: SOURCES.md, masterplan raw versie, REQUIREMENTS.md.

Onderzoek systematisch (per sectie min 300 woorden):
- Architecture + runtime model + design philosophy
- Volledige API surface (modules, classes, methods met versie-annotaties)
- Version matrix (breaking changes v14→v15→v16)
- Configuration patterns (setup, hooks, environment)
- Security/permissions model
- Common workflows + use cases
- Error patterns + debugging strategieen
- Anti-patterns van GitHub issues (zoek minstens 10 real-world fouten)
- Build + deployment overwegingen

Output: docs/research/vooronderzoek-{TECH}.md (minimum 2000 woorden, geverifieerde URLs in SOURCES.md format met Last-Verified datum).

Update SOURCES.md met alle nieuwe verificatie-data. Capture sub-topics die nieuw zijn t.o.v. raw masterplan in eigen sectie ## Newly Discovered Sub-Topics.
```

### 4.1 Verify Phase 2

```bash
test -f "docs/research/vooronderzoek-${TECH}.md" && \
  wc -w "docs/research/vooronderzoek-${TECH}.md" | awk '$1<2000{exit 1}' && \
  grep -q "Last-Verified" SOURCES.md && \
  grep -q "Newly Discovered Sub-Topics" "docs/research/vooronderzoek-${TECH}.md"

git add docs/research/ SOURCES.md
git commit -m "feat(phase-2): deep research ${TECH} (vooronderzoek + sources)"
git push
```

Niet door zonder commit + push.

---

## 5. Phase 3 — Masterplan refinement (met user-checkpoint)

Doel: raw masterplan → executable masterplan met expliciete batches, dependencies, decisions tabel en complete agent-prompts per skill.

### 5.1 Decisions-tabel (verplicht)

In `docs/masterplan/{TECH}-masterplan.md` boven de batch-planning:

```markdown
## Refinement Decisions

| ID | Decision | Reden | Bron |
|----|----------|-------|------|
| D-01 | MERGE skills X+Y → Z | Research toonde 80% overlap | vooronderzoek §3.2 |
| D-02 | DROP skill Q | API te dun voor standalone skill | vooronderzoek §4.1 |
| D-03 | ADD skill R (nieuw) | Nieuwe sub-topic ontdekt | vooronderzoek §6.5 |
| D-04 | SPLIT skill S → S1+S2 | Verschillende audiences | vooronderzoek §5 |
```

Niet door zonder min 1 MERGE/DROP/SPLIT — research zonder consequenties is niet grondig.

### 5.2 Batch-planning

```markdown
## Execution Plan — Batches

| Batch | Skills | Count | Dependencies | Geschatte duur |
|-------|--------|-------|--------------|----------------|
| 1 | {prefix}-core-architecture, {prefix}-core-api, {prefix}-syntax-base | 3 | geen | 15 min |
| 2 | {prefix}-syntax-{a}, {prefix}-syntax-{b}, {prefix}-syntax-{c} | 3 | batch 1 | 15 min |
| ... | ... | ... | ... | ... |
| N | {prefix}-agents-{x}, {prefix}-agents-{y} | 2 | ALL | 15 min |
```

Regels:
- Batch-size = 3 (Claude Code Agent tool optimum, ook tmux-orchestration default)
- Dependency-chain: `core → syntax → impl → errors → agents` (cross-tech-aware bij multi-tech)
- File-scope per batch: GEEN twee skills op zelfde file
- Bij pkg >60 skills: extra `testing/` + `ops/` categorieen (Frappe-pattern)

### 5.3 Agent-prompts per skill

Per skill in masterplan, complete prompt-block:

```markdown
### Skill: {prefix}-{cat}-{topic}

**Prompt** (tmux-worker krijgt deze):
```
Workspace: /home/freek/GitHub/{REPO_NAME}/
Output dir: skills/source/{cat}/{prefix}-{cat}-{topic}/
Files te maken:
  - SKILL.md (max 500 lines, YAML folded scalar `>`, "Use when..." opener, Keywords-regel met symptom-based termen)
  - references/methods.md
  - references/examples.md
  - references/anti-patterns.md

Research input: docs/research/vooronderzoek-{TECH}.md secties [3.2, 4.1]
Topic research (Phase 4): docs/research/topic-research/{prefix}-{cat}-{topic}-research.md

Scope:
  - {bullet 1}
  - {bullet 2}
  ...

Quality rules:
  - English-only, deterministic (ALWAYS/NEVER, geen "you might want to")
  - License: MIT in frontmatter
  - compatibility: "Designed for Claude Code. Requires {Tech} {versions}."
  - Geen em-dashes in section headings (gebruik :)
  - Verify alle code-examples via WebFetch tegen officiele docs
  - SOURCES.md goedgekeurde URLs only

Quality gate na completie: validate-frontmatter.js + validate-language.js + validate-line-count.js + validate-structure.js → exit 0.
```

### 5.4 User-checkpoint

In main-sessie: toon batch-tabel + decisions-tabel + 1 voorbeeld-agent-prompt aan user. Vraag: akkoord, of MERGE/DROP/SPLIT aanpassingen? Wacht op `ja` of `fix: ...`. Zonder akkoord: GEEN Phase 4/5.

### 5.5 Verify Phase 3

```bash
test -f "docs/masterplan/${TECH}-masterplan.md" && \
  grep -q "## Refinement Decisions" "docs/masterplan/${TECH}-masterplan.md" && \
  grep -q "## Execution Plan" "docs/masterplan/${TECH}-masterplan.md" && \
  grep -c "^### Skill:" "docs/masterplan/${TECH}-masterplan.md"  # moet >= 5

git add docs/masterplan/ DECISIONS.md ROADMAP.md
git commit -m "feat(phase-3): masterplan refinement (decisions + batches + agent prompts)"
git push
```

---

## 6. Phase 4+5 — Topic research + skill creation via tmux-orchestration

**Hard requirement**: deze fase draait via `tmux-orchestration` skill, niet als losse Agent-calls. Reden: persistent orchestrator met file-scope-isolation + quality-gate-loop is bewezen schaalbaar (Blender-Bonsai 73 skills, Frappe 61 skills).

### 6.1 Activeer tmux-orchestration

In main-sessie (=orchestrator):

```
Invoke Skill tool met skill="tmux-orchestration"
```

Doorloop 8 phases van die skill. Antwoorden voor skill-pkg context:

| Question | Antwoord |
|----------|----------|
| Workers count | **3** (één per batch-slot, parallelle skill-creation) |
| Spawn target | **VS Code panels** (Freek werkt altijd in VS Code) |
| Skill-hints scan | **Yes** |
| QG cadence | **Every worker reply** (niet sync-points — quality is harde eis) |
| Reply language | **Nederlands** |
| Roles per worker | 3x **`skill-builder`** custom role (zie 6.2) |

Stage C free-text:
```
worker-1: file-scope=skills/source/core/{prefix}-core-*/**, workspace={WS}, initial-task=batch 1 skill A volgens masterplan §Batch1
worker-2: file-scope=skills/source/core/{prefix}-core-*/**, workspace={WS}, initial-task=batch 1 skill B
worker-3: file-scope=skills/source/syntax/{prefix}-syntax-*/**, workspace={WS}, initial-task=batch 1 skill C
Comm-mode: jsonl+tmux-direct
```

Belangrijk: file-scope per worker is PRE-batch. Bij volgende batch update file-scope via re-instruct (niet re-spawn — sessie behouden voor context).

### 6.2 Role definition: skill-builder

Custom role wordt aangemaakt door tmux-orchestration Phase 4. Inhoud:

```markdown
# skill-builder (skill package context)

## Verantwoordelijkheid
Eén SKILL.md + 3 reference files per batch-slot, volledig conform masterplan agent-prompt.

## ALWAYS
- Lees masterplan-prompt VOLLEDIG voor schrijven
- WebFetch alle code-snippets tegen SOURCES.md URLs
- YAML frontmatter: folded scalar `>`, "Use when..." opener, license:MIT, compatibility, metadata.author/version, Keywords-regel met technische + symptom-based + plain-language termen
- 3 reference files: methods.md, examples.md, anti-patterns.md
- Section headings met `:` (geen em-dash)
- Deterministische taal: ALWAYS X / NEVER Y (geen "you might want to")
- Commit per skill: `feat(skill): {prefix}-{cat}-{topic}`
- `tmo task update T-<id> status in_progress` aan start
- `tmo task done T-<id> --output "<sha>"` aan eind

## NEVER
- README.md schrijven IN skill folder (L-010 QGIS — verboden)
- Quoted YAML description (L-006 Docker — anti-pattern)
- Imports in Frappe Server Scripts (sandbox-blocked) bij Frappe-pkg
- Skill > 500 regels (overflow naar references/)
- File-scope-violation: schrijven buiten toegewezen pad
- Stilstaan zonder `tmo send orchestrator blocked '{...}'`

## Quality self-check voor done
- `node {TEMPLATE}/scripts/validate-frontmatter.js <skill-pad>` exit 0
- `node {TEMPLATE}/scripts/validate-language.js <skill-pad>` exit 0
- `wc -l SKILL.md` < 500
- Alle 3 reference files bestaan
```

Schrijf naar `${CLAUDE_PLUGIN_ROOT}/roles/skill-builder.md` via tmux-orchestration Phase 4.

### 6.3 Phase 4 topic-research workflow (interleaved met 5)

Per batch dispatch je eerst topic-research-agent (opus, in-process Agent — geen tmux), die `docs/research/topic-research/{prefix}-{cat}-{topic}-research.md` schrijft voor alle skills in die batch. Pas dan stuur je de batch-prompts naar de 3 tmux-workers.

**Skip-criteria** (Docker L-001): bij vooronderzoek >40 doc-pages + helder onderbouwd: skip Phase 4 voor die batch, ga direct naar tmux-worker met vooronderzoek-referentie. Documenteer keuze in DECISIONS.md.

### 6.4 Batch-loop (orchestrator)

Pseudocode voor de orchestrator-runbook:

```
voor elke batch B in masterplan:
  1. Per skill in B: spawn in-process opus agent voor topic-research (parallel) → wacht alle klaar
  2. Verify topic-research files bestaan (test -f)
  3. Per skill in B (3 skills): tmo task add → bundle injection naar worker-1/2/3
  4. Quality-gate loop:
     elke 30s: capture-pane per worker, evalueer:
       - APPROVE → tmo send status approved, tmo task approve
       - RE-INSTRUCT → correctie-prompt via load-buffer + paste-buffer + Enter
       - REPLACE (na 2 RE-INSTRUCT) → kill-session + re-spawn met verbeterde context
  5. Wacht tot alle 3 workers status=done
  6. Run validate-* scripts op batch-output → exit 0 verplicht
  7. Commit batch: `feat(phase-5): batch-{N} skills [A,B,C]`
  8. Push
  9. Update ROADMAP.md (% done, batch N completed)
  10. Reflection checkpoint (5 vragen uit WORKFLOW.md §Reflection)
```

### 6.5 No-stall guarantees

- Worker `blocked` event → orchestrator binnen 60s `reinstruct` met root-cause-fix (geen fallback)
- Worker stilte >5 min → orchestrator capture-pane, indien copy-mode hang: `tmux send-keys -X cancel`. Anders: REPLACE
- Tmux-orchestration `prompt-improver` enforcement: workers default-accept met `ja`
- Bij `2x REPLACE` op zelfde worker-name: STOP, escalate naar user
- **Worker context overflow protection (L-007 Tailwind 2026-05-19)**: claude REPL exits silently when token-budget is exhausted (each skill consumes ~30-50k tokens via mandatory reads + WebFetch + write; after ~5 skills per worker the limit hits). Mitigation : (a) include explicit `stay idle in REPL after done-signal, NEVER self-exit / self-quit / self-clear` in the skill-builder context bundle, OR (b) respawn workers between batches (`tmux kill-session -t worker-N` + re-spawn) for a guaranteed clean slate.

### 6.6 Verify Phase 5

```bash
# Alle skills bestaan
EXPECTED=$(grep -c "^### Skill:" "docs/masterplan/${TECH}-masterplan.md")
ACTUAL=$(find skills/source -name SKILL.md | wc -l)
test "$EXPECTED" -eq "$ACTUAL"

# Validators groen
node "$TEMPLATE/scripts/validate-frontmatter.js" .
node "$TEMPLATE/scripts/validate-line-count.js" .
node "$TEMPLATE/scripts/validate-structure.js" .
node "$TEMPLATE/scripts/validate-language.js" .
node "$TEMPLATE/scripts/validate-emdash.js" .

# Alle skills hebben 3 reference files
find skills/source -name SKILL.md | while read f; do
  d=$(dirname "$f")
  test -f "$d/references/methods.md" && \
  test -f "$d/references/examples.md" && \
  test -f "$d/references/anti-patterns.md" || { echo "MISSING refs: $d"; exit 1; }
done
```

Niet door zonder.

### 6.7 Cleanup tmux

Na Phase 5 done + verify groen:
```bash
tmux ls 2>/dev/null | grep -E "^worker-[1-3]:" | cut -d: -f1 | xargs -I{} tmux kill-session -t {}
```

Audit-log behouden in `state/messages.jsonl` (commit niet — staat in .gitignore via state/).

---

## 7. Phase 6 — Validation + audit

### 7.1 Automated validation suite

```bash
cd "$WS"
node "$TEMPLATE/scripts/validate-frontmatter.js" .
node "$TEMPLATE/scripts/validate-line-count.js" .
node "$TEMPLATE/scripts/validate-structure.js" .
node "$TEMPLATE/scripts/validate-language.js" .
node "$TEMPLATE/scripts/validate-emdash.js" .
node "$TEMPLATE/scripts/count-skills.js" .
node "$TEMPLATE/scripts/generate-audit-report.js" . > docs/validation/audit-report.md
```

### 7.2 Compliance audit (P-010)

Run prompt uit `templates/methodology-audit.md.template` in main-sessie. Output: score per fase.

- **>= 90%**: PASS, door naar 7
- **70-89%**: PARTIAL, auto-remediate (script biedt fixes), re-audit
- **< 70%**: FAIL, terug naar eerst-falende fase

### 7.3 Functional sample-test

Minimum 1 skill per categorie test in losse Claude conversatie. Verifieer:
- Skill triggert op realistisch user-prompt
- Generated code matcht skill-guidance
- Geen hallucinatie van API's

Log resultaten in `docs/validation/functional-test.md`.

### 7.4 Verify Phase 6

```bash
test -f docs/validation/audit-report.md && \
  grep -q "Score: 9[0-9]\|Score: 100" docs/validation/audit-report.md && \
  test -f docs/validation/functional-test.md

git add docs/validation/ ROADMAP.md
git commit -m "feat(phase-6): validation + audit (score >=90%)"
git push
```

---

## 8. Phase 6.5 — Discovery manifests + Keywords polish

### 8.1 Generate manifests

```bash
node "$TEMPLATE/scripts/generate-manifest.js" .
```

Dit script:
1. Inventariseert alle `skills/source/**/SKILL.md`
2. Bouwt `package.json` `agents.skills[]` array (per skill: `{name, path}`)
3. Bouwt `agents/openai.yaml` met juiste skills_directory + count
4. Update `package.json` version + skill-count in description

### 8.2 Generate INDEX

```bash
node "$TEMPLATE/scripts/generate-index.js" . > INDEX.md
```

Schrijft summary-tabel + per-categorie listing met description-kolom (uit frontmatter).

### 8.3 Keywords polish pass

In main-sessie via 1 opus-agent (geen tmux nodig, single-pass):

```
Doe een polish-pass over alle SKILL.md frontmatter. Per skill:
- Verifieer Keywords-regel bevat: technische termen + symptom-based zinnen ("slow page", "nothing shows") + plain-language synoniemen ("how do I", "what is")
- Voorbeeld goed (Frappe): "Keywords: Server Script, frappe, sandbox, import, validate, on_submit, server script example, import not allowed, sandbox rules"
- Voorbeeld slecht: "Keywords: serverscript, frappe"
- Indien dun: voeg 5-8 termen toe per skill, blijf binnen 1024 chars description-totaal

Output: aangepaste SKILL.md files. Geen content-changes buiten frontmatter description.
```

### 8.4 Em-dash sweep

```bash
node "$TEMPLATE/scripts/validate-emdash.js" --fix .
```

Vervangt em-dash door `:` in section headings.

### 8.5 Verify Phase 6.5

```bash
test -f package.json && jq -e '.agents.skills | length > 0' package.json && \
test -f agents/openai.yaml && grep -q "skills_directory" agents/openai.yaml && \
test -f INDEX.md && grep -q "| Skill |" INDEX.md && \
! grep -rE '^#{1,3}.*—' skills/source/ --include=SKILL.md

git add package.json agents/openai.yaml INDEX.md skills/
git commit -m "feat(phase-6.5): discovery manifests + keywords polish + em-dash sweep"
git push
```

---

## 9. Phase 7 — Publication

### 9.1 README finalize

`scripts/bootstrap-new-package.sh` heeft README skeleton uit `README.md.template` neergezet. Vul nu in:
- Banner image link (zie 9.2)
- Badges (License, Skills count, Tech version)
- Skill catalog tabel per categorie
- Companion Cross-Tech Skills sectie (link naar Cross-Tech-AEC pkg)

### 9.2 Social preview banner

```bash
# Render banner
node "$TEMPLATE/scripts/generate-banner-png.js" \
  --html docs/social-preview-banner.html \
  --out docs/social-preview.png

# Verify size
file docs/social-preview.png | grep -q "1280 x 640"
```

Upload PNG via GitHub web UI: `https://github.com/OpenAEC-Foundation/${REPO_NAME}/settings` → Social preview → Edit. **Geen API beschikbaar** voor dit (gemeld in GitHub docs).

### 9.3 CHANGELOG

Update CHANGELOG.md: `[Unreleased]` → `[1.0.0] - $(date +%Y-%m-%d)`. Format = Keep a Changelog v1.1.0.

### 9.4 ROADMAP naar 100%

Update ROADMAP.md: Status = `COMPLETE — v1.0.0 published`. Geen open items.

### 9.5 Release tag + GitHub release

```bash
SKILL_COUNT=$(find skills/source -name SKILL.md | wc -l)
git add CHANGELOG.md ROADMAP.md README.md
git commit -m "docs(phase-7): finalize v1.0.0 release"
git push

git tag -a v1.0.0 -m "v1.0.0: ${SKILL_COUNT} deterministic skills for ${TECH_FULL}"
git push origin v1.0.0

gh release create v1.0.0 \
  --title "v1.0.0 — ${TECH_FULL} Skill Package" \
  --notes "Initial release with ${SKILL_COUNT} deterministic Claude skills.

Categories: core, syntax, impl, errors, agents.
Compatible with ${TECH_FULL} ${VERSIONS}.
Discovery: package.json agents.skills[] manifest + agents/openai.yaml (OpenAI Codex compatible).
"
```

### 9.6 Final compliance audit

```bash
node "$TEMPLATE/scripts/generate-audit-report.js" . > docs/validation/audit-report-final.md
```

Score moet >= 90%. Bij lager: terug naar Phase 6 voor remediation. Geen v1.0.0 zonder >=90%.

### 9.7 Verify Phase 7

```bash
gh release view v1.0.0 -R "OpenAEC-Foundation/${REPO_NAME}" >/dev/null && \
gh repo view "OpenAEC-Foundation/${REPO_NAME}" --json topics --jq '.topics[]' | grep -q agentskills && \
test -f docs/social-preview.png && \
grep -q "Score: 9[0-9]\|Score: 100" docs/validation/audit-report-final.md && \
git tag -l v1.0.0 | grep -q v1.0.0
```

Niet door zonder.

---

## 10. Sessie-overdracht (HANDOFF)

Update HANDOFF.md met huidige staat. Doel: volgende sessie kan zonder context-verlies verder.

Format:
```markdown
# HANDOFF — ${REPO_NAME}

## Status: v1.0.0 PUBLISHED (date)

## Wat is af
- ${SKILL_COUNT} skills, alle 5 categorieen
- v1.0.0 GitHub release live
- Social preview geupload
- agentskills topic geset
- Compliance audit: 9X%

## Wat staat open
- (geen / lijst)

## Vervolgwerk-mogelijkheden
- Cross-Tech-AEC integratie (alleen indien dep-pkgs published)
- MCP-server toevoegen (Speckle-style)
- v1.1.x feedback round na 4 weken usage
```

Commit + push.

---

## 11. Troubleshooting matrix

| Symptoom | Root cause | Fix |
|----------|------------|-----|
| `gh repo create` faalt met "Name already exists" | Repo bestaat op org | Renamen lokaal + opnieuw OF kies andere repo-name + sync |
| `tmux-orchestration` skill faalt op `tmo init` | tmo niet op PATH | install tmo CLI eerst, anders STOP |
| Worker output bevat em-dash | skill-builder role niet correct gevolgd | RE-INSTRUCT met expliciete em-dash regel + run validate-emdash.js --fix |
| validate-frontmatter.js exit 1 op `description` | Quoted string ipv folded `>` | Edit naar `description: >` met indent + verify YAML parse |
| Skill > 500 lines | Overflow content niet naar references/ | Splits SKILL.md → references/methods.md, examples.md |
| Audit score < 90% | Eerst-falende fase = root cause | Identificeer fase via audit-report → terug naar die fase |
| File-scope conflict 2 workers zelfde file | Phase 2 Stage C input fout | STOP, herdefinieer file-scopes |
| Worker `blocked` met `need: <path>` | Skill heeft input buiten scope nodig | Orchestrator update masterplan: voeg dep-skill toe OF herverdeel scope |
| Social preview niet zichtbaar op GitHub | PNG niet geupload (geen API) | Web UI: repo settings > Social preview > Edit |
| `agentskills` topic ontbreekt | Phase 3.4 step skipped | `gh repo edit --add-topic agentskills` |

---

## 12. Single-command boot voor nieuwe sessie

Als je in een leeg `/home/freek/GitHub/${REPO_NAME}/` zit en een sessie start:

```
Lees BOOTSTRAP-RUNBOOK.md van /home/freek/GitHub/Skill-Package-Workflow-Template/ en bootstrap deze workspace. Inputs: tech={tech}, prefix={prefix}, versions={ver}, license=MIT. Ga door alle fases tot v1.0.0 published. Gebruik tmux-orchestration voor Phase 5. Bypass permissions ON. Geen stilvallen.
```

Of korter (als CLAUDE.md.template van Workflow-Template al gekopieerd is):

```
/bootstrap-skill-package tech={tech} prefix={prefix}
```

(custom slash command, zie `scripts/bootstrap-new-package.sh` voor implementatie).

---

## 13. Reference standaard (waar deze runbook tegen valideert)

Laatste OpenAEC-releases als ground-truth:
- **Frappe v3.2.0** (2026-05-15) — 61 skills, package.json+agents/openai.yaml+symptom-keywords, MIGRATION-AGENT-SKILLS-STANDARD.md
- **ThatOpen** (2026-05-18) — 18 skills, README 10-sectie standaard, INDEX dependency-graph
- **QGIS** (2026-05-17) — 19 skills, Keep-a-Changelog format
- **Blender-Bonsai** (2026-05-16) — 73 skills, multi-tech `skills/{tech}/{cat}/` tree, `skills/CLAUDE.md` runtime glue
- **n8n** (2026-05-12) — 21 skills, 7-batch reference masterplan
- **Docker** (2026-05-10) — 22 skills, Phase 4 skip-pattern L-001
- **Speckle** (2026-05-07) — 25 skills + MCP-server parallel-track (D-010)
- **Cross-Tech-AEC** (2026-04-14) — 15 skills, B0.5 Dependent-Package-Inventory L-016

Bij twijfel over patroon: kies wat de laatste 3 releases doen (convergentiepatroon).

---

## 14. Hard rules — geen uitzonderingen

1. Geen fallback-paden in worker-logica. Bug → root-cause-fix, niet workaround.
2. File-scope per worker is bindend. 2 workers op zelfde file = REFUSE.
3. Commits per fase + push. Werk dat niet gepusht is bestaat niet.
4. README in skill-folder = NEVER (L-010 QGIS).
5. Quoted YAML description = NEVER (L-006 Docker).
6. Em-dashes in user-facing text = NEVER (globale typografie-regel CLAUDE.md).
7. Bypass permissions ON of sessie kan niet headless draaien.
8. Compliance score < 90% = geen v1.0.0 release.
9. tmux-orchestration `prompt-improver` enforcement actief in alle workers.
10. HANDOFF.md update bij iedere fase-completion — voorkomt drift (Cross-Tech anti-pattern).
