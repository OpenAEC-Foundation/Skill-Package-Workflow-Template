# Handoff: OpenAEC Skill Package Ecosysteem

> Laatste update: 2026-03-20
> Dit document is de centrale overdracht voor alle openstaande werkpakketten.

---

## Status Overzicht

| # | Werkpakket | Repo | Status | Skills |
|---|-----------|------|--------|--------|
| ~~1~~ | ~~Draw.io afronden~~ | `Draw.io-Claude-Skill-Package` | **DONE** — 22 skills, README, GitHub live | 22/22 |
| 2 | CI/CD quality pipeline | `Skill-Package-Workflow-Template` (deze repo) | **TE BOUWEN** | n.v.t. |
| 3 | Workspace Builder MVP | `OpenAEC-Workspace-Composer` | **IN PROGRESS** — Tauri+SolidJS gestart | n.v.t. |
| 4 | Speckle skill package | `Speckle-Claude-Skill-Package` | **GEBOOTSTRAPT** — docs klaar, 0 skills | 0/22 |
| 5 | QGIS skill package | `QGIS-Claude-Skill-Package` | **GEBOOTSTRAPT** — docs klaar, 0 skills | 0/19 |
| 6 | Three.js skill package | `Three.js-Claude-Skill-Package` | **GEBOOTSTRAPT** — docs klaar, 0 skills | 0/19 |
| 7 | ThatOpen skill package | `ThatOpen-Claude-Skill-Package` | **GEBOOTSTRAPT** — docs klaar, 0 skills | 0/19 |
| 8 | Cross-Tech AEC package | `Cross-Tech-AEC-Claude-Skill-Package` | **GEBOOTSTRAPT** — docs klaar, 0 skills | 0/15 |

**Totaal openstaand: ~94 skills over 5 packages + CI/CD pipeline + Workspace Builder**

---

## Wat "GEBOOTSTRAPT" betekent

Elke package heeft al:
- `CLAUDE.md` — governance protocols (P-001 t/m P-009)
- `ROADMAP.md` — fase-overzicht, skill inventory
- `INDEX.md` — volledige skill catalogus met beschrijvingen en dependencies
- `WAY_OF_WORK.md` — 7-fase methodologie referentie
- `DECISIONS.md`, `LESSONS.md`, `SOURCES.md`, `REQUIREMENTS.md`
- `CHANGELOG.md`, `OPEN-QUESTIONS.md`
- `START-PROMPT.md` — startprompt voor Claude
- `.gitignore`, `.claude/`, lokaal git repo

Wat **ontbreekt** per package:
- `skills/` directory met daadwerkelijke SKILL.md bestanden
- `README.md` (behalve Draw.io en ThatOpen)
- `LICENSE` (MIT)
- GitHub remote op OpenAEC-Foundation
- Social preview banner

---

## Per-Package Handoff

### 4. Speckle-Claude-Skill-Package

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\Speckle-Claude-Skill-Package\`
**Skills gepland:** 22 (3 core, 4 syntax, 10 impl, 3 errors, 2 agents)
**Research basis:** `Speckle-widgets` repo (brainstorm docs)

**Startcommando in die workspace:**
```
Lees START-PROMPT.md en begin fase B1 (Raw Masterplan).
Gebruik Speckle-widgets/ als research input.
```

**Dependency-volgorde batches:**
1. B1: core (object-model, transport, api) — 3 skills
2. B2: syntax (base-objects, graphql, webhooks, automate) — 4 skills
3. B3: impl deel 1 (python-sdk, sharp-sdk, connectors, revit, rhino-grasshopper) — 5 skills
4. B4: impl deel 2 (blender, viewer, automate-functions, federation, versioning) — 5 skills
5. B5: errors (transport, conversion, auth) — 3 skills
6. B6: agents (model-coordinator, data-validator) — 2 skills

**Bijzonderheden:**
- Wereldwijd bestaan er GEEN Speckle Claude skills — dit is first-mover
- Speckle v3 API is significant anders dan v2, check `SOURCES.md` voor juiste docs
- MCP evaluatie is gepland als parallel track

---

### 5. QGIS-Claude-Skill-Package

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\QGIS-Claude-Skill-Package\`
**Skills gepland:** 19 (3 core, 4 syntax, 8 impl, 2 errors, 2 agents)
**Research basis:** Geen — from scratch

**Startcommando in die workspace:**
```
Lees START-PROMPT.md en begin fase B1 (Raw Masterplan).
Focus op PyQGIS API en QGIS Processing framework.
```

**Dependency-volgorde batches:**
1. B1: core (architecture, data-providers, coordinate-systems) — 3 skills
2. B2: syntax (pyqgis-api, expressions, processing-scripts, plugins) — 4 skills
3. B3: impl deel 1 (vector-analysis, raster-analysis, print-layouts, postgis) — 4 skills
4. B4: impl deel 2 (web-services, 3d-visualization, georeferencing, network-analysis) — 4 skills
5. B5: errors (projections, data-loading) — 2 skills
6. B6: agents (analysis-orchestrator, map-generator) — 2 skills

**Bijzonderheden:**
- QGIS 3.34+ LTR als target versie
- PyQGIS API verandert regelmatig — pin exacte versie in SOURCES.md
- GIS-BIM integratie (georeferencing) is ook relevant voor Cross-Tech package

---

### 6. Three.js-Claude-Skill-Package

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\Three.js-Claude-Skill-Package\`
**Skills gepland:** 19 (3 core, 4 syntax, 8 impl, 2 errors, 2 agents)
**Research basis:** `ThatOpenCompany` repo (threejs-bim skill)

**Startcommando in die workspace:**
```
Lees START-PROMPT.md en begin fase B1 (Raw Masterplan).
Kopieer threejs-bim skill uit ThatOpenCompany/ als startpunt voor impl/ifc-viewer.
```

**Dependency-volgorde batches:**
1. B1: core (scene-graph, renderer, math) — 3 skills
2. B2: syntax (geometries, materials, loaders, controls) — 4 skills
3. B3: impl deel 1 (lighting, shadows, post-processing, animation) — 4 skills
4. B4: impl deel 2 (physics, react-three-fiber, webgpu, ifc-viewer) — 4 skills
5. B5: errors (performance, rendering) — 2 skills
6. B6: agents (scene-builder, model-optimizer) — 2 skills

**Bijzonderheden:**
- Three.js r160+ als target (WebGPU renderer is stabiel)
- React Three Fiber 8.x als apart impl skill
- IFC viewer skill overlapt met ThatOpen package — zorg voor duidelijke afbakening

---

### 7. ThatOpen-Claude-Skill-Package

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\ThatOpen-Claude-Skill-Package\`
**Skills gepland:** 19 (3 core, 4 syntax, 8 impl, 2 errors, 2 agents)
**Research basis:** `ThatOpenCompany` repo (6 bestaande skills)

**Startcommando in die workspace:**
```
Lees START-PROMPT.md en begin fase B1 (Raw Masterplan).
Migreer relevante skills uit ThatOpenCompany/:
- thatopen-architecture → core/architecture
- web-ifc-api → core/web-ifc
- lit-bim-ui, flatbuffers-fragments, emscripten-wasm-vite, ifc-bim-standards → als research input
```

**Dependency-volgorde batches:**
1. B1: core (architecture, web-ifc, fragments) — 3 skills
2. B2: syntax (components, ifc-loading, properties, streaming) — 4 skills
3. B3: impl deel 1 (viewer, navigation, selection, clash-detection) — 4 skills
4. B4: impl deel 2 (measurements, plans-sections, bcf, federation) — 4 skills
5. B5: errors (loading, performance) — 2 skills
6. B6: agents (viewer-builder, model-analyzer) — 2 skills

**Bijzonderheden:**
- @thatopen/components 2.x is major rewrite — gebruik NIET v1 docs
- web-ifc 0.0.57+ voor IFC4X3 support
- Fragment format is proprietary — documenteer conversie pipeline

---

### 8. Cross-Tech-AEC-Claude-Skill-Package

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\Cross-Tech-AEC-Claude-Skill-Package\`
**Skills gepland:** 15 (2 core, 10 impl, 2 errors, 1 agent)
**Research basis:** Alle andere packages (afhankelijk!)

**Startcommando in die workspace:**
```
Lees START-PROMPT.md.
LET OP: Dit package moet LAATST gebouwd worden — het hangt af van
Speckle, QGIS, Three.js en ThatOpen packages.
Begin met core skills (ifc-schema-bridge, coordinate-systems) die
onafhankelijk te schrijven zijn.
```

**Dependency-volgorde batches:**
1. B1: core (ifc-schema-bridge, coordinate-systems) — 2 skills — **kan nu al**
2. B2: impl deel 1 (ifc-to-webifc, ifc-to-threejs, bim-web-viewer) — 3 skills — na ThatOpen+Three.js
3. B3: impl deel 2 (speckle-blender, speckle-revit, qgis-bim-georef) — 3 skills — na Speckle+QGIS
4. B4: impl deel 3 (ifc-erpnext-costing, freecad-ifc-bridge, n8n-aec-pipeline, docker-aec-stack) — 4 skills
5. B5: errors (conversion, coordinate-mismatch) — 2 skills
6. B6: agents (aec-orchestrator) — 1 skill — laatst, orkestreert alles

**Bijzonderheden:**
- Elke skill beschrijft EXACT ÉÉN technology boundary
- Moet BEIDE kanten van de grens documenteren
- Verwijs naar specifieke skills in de losse packages, niet dupliceren

---

## CI/CD Quality Pipeline (deze repo)

**Status:** Scripts map bestaat, nog niet uitgewerkt als reusable workflow.

**Te bouwen in `Skill-Package-Workflow-Template/`:**

```
.github/workflows/
└── skill-quality.yml          — Reusable workflow

scripts/
├── validate-frontmatter.js    — YAML parsing, required fields
├── validate-line-count.js     — SKILL.md < 500 regels
├── validate-references.js     — Broken link detection
├── validate-language.js       — English-only body check
├── validate-structure.js      — Directory conventie check
├── generate-audit-report.js   — Compliance score berekening
└── count-skills.js            — Skill count vs ROADMAP sync
```

**Uitrol per package:**
```yaml
# In elke skill package repo: .github/workflows/quality.yml
name: Skill Quality
on: [push, pull_request]
jobs:
  quality:
    uses: OpenAEC-Foundation/Skill-Package-Workflow-Template/.github/workflows/skill-quality.yml@main
```

**Prioriteit:** Quick wins eerst:
1. YAML frontmatter validatie (vangt 90% van issues)
2. Line count < 500
3. Required fields (name, description met "Use when...", license)
4. Skill count sync met ROADMAP.md

---

## Workspace Builder (referentie)

**Pad:** `C:\Users\Freek Heijting\Documents\GitHub\OpenAEC-Workspace-Composer\`
**Status:** Tauri 2 + SolidJS scaffold draait, basis UI en styling aanwezig.
**Volgende stap:** GitHub API integratie, preset definities, workspace generator.

De presets die gebouwd moeten worden refereren naar de skill packages hierboven:

| Preset | Packages nodig |
|--------|---------------|
| `AEC-GIS-BIM` | Blender-Bonsai, Speckle, QGIS, Three.js, ThatOpen, Cross-Tech-AEC |
| `BIM-DEVELOPMENT` | Blender-Bonsai, ThatOpen, Three.js, Docker |
| `OPEN-PDF-STUDIO` | Tauri-2, SolidJS, PDFjs, pdf-lib, Fluent-i18n, Vite |
| `ERPNEXT-FULLSTACK` | ERPNext, Nextcloud, Docker, n8n, React |

---

## Aanbevolen werkvolgorde

```
1. CI/CD pipeline bouwen          ← deze repo, schaalt alles
2. Speckle package uitwerken      ← first-mover, hoge prioriteit
3. QGIS package uitwerken         ← first-mover, hoge prioriteit
4. ThatOpen package uitwerken     ← 6 skills als basis
5. Three.js package uitwerken     ← 1 skill als basis
6. Cross-Tech-AEC core skills     ← kan parallel met 2-5
7. Cross-Tech-AEC impl skills     ← na 2-5 afgerond
8. Workspace Builder presets      ← na alle packages klaar
```

---

## Hoe te gebruiken

**Per package sessie starten:**
1. Open VS Code in de package map
2. Open Claude Code terminal
3. Typ: `Lees START-PROMPT.md` of plak de startprompt uit de sectie hierboven
4. Claude leest alle docs en begint met de juiste fase

**Handoff naar andere workspace:**
Elk package heeft nu ook een `HANDOFF.md` met dezelfde informatie als hierboven,
maar specifiek voor dat package. Open de map → Claude kan direct aan de slag.
