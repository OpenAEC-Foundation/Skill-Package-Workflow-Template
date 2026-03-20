# Plan: OpenAEC Skill Package Ecosysteem — Complete Pipeline

## Context

Freek heeft met OpenAEC Foundation een ecosysteem van **548+ SKILL.md bestanden** gebouwd verdeeld over 14+ skill packages. De productie-kant is bewezen (7-fase methodologie). Wat ontbreekt:

1. **Een Workspace Builder applicatie** — UI om VS Code workspaces samen te stellen met skill packages, presets, en GitHub-selectie
2. **Cross-tech boundary skills** — de lijm tussen losse packages (Open PDF Studio stack)
3. **CI/CD quality pipeline** — automatische validatie van skill packages
4. **Ontbrekende skill packages** — Speckle, QGIS, ThreeJS
5. **Bundeling** — presets die losse packages groeperen per werkcontext

Alles wordt uitgewerkt in `C:\Users\Freek Heijting\Documents\GitHub\` als losse mappen/repos.

---

## Wat al bestaat (niet opnieuw bouwen)

| Repo | Wat het doet | Hergebruiken |
|---|---|---|
| `VSCode_ClaudeCode_Workspace_Composer_App` | Module registry (28 modules), preset-systeem, concept UI | Module format, dependency metadata, presets |
| `Open-VSCode-Controller` | HTTP bridge voor VS Code control (TypeScript monorepo) | Extension architectuur, handler pattern, port config |
| `Skill-Package-Workflow-Template` | 7-fase methodologie, compliance audit template, banner generator | Audit template, workflow, scripts |
| `ThatOpenCompany` | 7 skills: web-ifc, Three.js BIM, That Open Engine, Lit UI | Basis voor ThreeJS/web-ifc package |
| `Speckle-widgets` | Brainstorm docs (AnyWidget, OAuth, viewer) | Research input voor Speckle package |

---

## Stap 1: Workspace Builder App — Tauri + SolidJS (dogfooding)

**Besluit:** Tauri + SolidJS — dogfooding van eigen skill packages.

**Doel:** Een desktop applicatie met UI waarin je:
- Werkmappen selecteert (via native file picker via Tauri)
- Skill packages van GitHub kiest (checkbox-lijst met zoek)
- Presets selecteert zoals `[OPEN-PDF-STUDIO]`, `[BIM-DEVELOPMENT]`, `[ERPNEXT-FULLSTACK]`
- Een `.code-workspace` + `.claude/skills/` configuratie genereert en VS Code opent

**Repo:** `C:\Users\Freek Heijting\Documents\GitHub\VSCode_ClaudeCode_Workspace_Composer_App\` — refactoren naar Tauri+SolidJS
- Module registry (28 modules, JSON) is herbruikbaar
- Preset definities zijn herbruikbaar
- UI en installer moeten (her)gebouwd worden

**Integratie:** `Open-VSCode-Controller` voor programmatisch VS Code openen na workspace generatie

**Presets te definiëren:**

| Preset | Skill Packages | Werkmappen |
|---|---|---|
| `OPEN-PDF-STUDIO` | Tauri-2, SolidJS, PDFjs, pdf-lib, Fluent-i18n, Vite, Cross-Tech | open-pdf-studio/ |
| `BIM-DEVELOPMENT` | Blender-Bonsai-IfcOpenShell-Sverchok, ThatOpen, Docker | project map |
| `ERPNEXT-FULLSTACK` | ERPNext, Nextcloud, Docker, n8n, React | erpnext project map |
| `AEC-GIS-BIM` | Blender-Bonsai, Speckle, QGIS, ThreeJS | gis/bim project map |

**MVP scope:**
1. Tauri 2 + SolidJS + Vite project scaffolden
2. GitHub API: lijst skill packages ophalen van OpenAEC-Foundation org
3. UI: preset selectie → skill package selectie → werkmap selectie
4. Generator: `.code-workspace` + `~/.claude/skills/` installatie
5. Launcher: VS Code openen met gegenereerde workspace

---

## Stap 2: Cross-tech Boundary Skills — Nieuw centraal package

**Besluit:** Nieuw `Cross-Tech-Claude-Skill-Package` als centrale plek voor alle boundary rules.

**Repo:** `C:\Users\Freek Heijting\Documents\GitHub\Cross-Tech-Claude-Skill-Package\` (nieuw)

**Te bouwen cross-tech skills:**

| Skill | Boundary | Package(s) |
|---|---|---|
| `cross-tech-tauri-solidjs-ipc` | Rust ↔ SolidJS invoke/command contract | Tauri + SolidJS |
| `cross-tech-pdfjs-pdflib-sync` | PDF.js rendering ↔ pdf-lib mutatie | PDFjs + pdf-lib |
| `cross-tech-annotation-pipeline` | User action → state → render → save | Alle PDF packages |
| `cross-tech-fluent-solidjs-i18n` | Fluent keys ↔ SolidJS components | Fluent + SolidJS |
| `cross-tech-ifc-web-viewer` | IfcOpenShell → web-ifc/Three.js | Blender-Bonsai + ThatOpen |
| `cross-tech-erpnext-nextcloud` | Frappe ORM ↔ Nextcloud API | ERPNext + Nextcloud |
| `cross-tech-n8n-erpnext-pipeline` | n8n workflow ↔ ERPNext webhooks | n8n + ERPNext |
| `cross-tech-qgis-ifc-georef` | CRS transformatie ↔ IfcMapConversion | QGIS + Blender-Bonsai |

---

## Stap 3: CI/CD Quality Pipeline

**Doel:** Automatische validatie bij elke push/PR op skill package repos.

**Repo:** `C:\Users\Freek Heijting\Documents\GitHub\Skill-Package-Workflow-Template\`

**Te bouwen (als reusable GitHub Actions workflow):**

```
.github/workflows/skill-quality.yml
scripts/
├── validate-frontmatter.js    — YAML parsing, required fields check
├── validate-line-count.js     — SKILL.md < 500 regels
├── validate-references.js     — Broken link detection
├── validate-language.js       — English-only check op body
├── validate-structure.js      — Directory conventie check
├── generate-audit-report.js   — Compliance score berekening
└── count-skills.js            — Skill count vs ROADMAP sync
```

**Uitrol:** Reusable workflow die elk package importeert via:
```yaml
jobs:
  quality:
    uses: OpenAEC-Foundation/Skill-Package-Workflow-Template/.github/workflows/skill-quality.yml@main
```

**Quick wins (eerst):**
1. YAML frontmatter validatie (vangt 90% issues)
2. Line count check (< 500)
3. Required fields check (name, description met "Use when...", license)
4. Skill count sync met ROADMAP.md

---

## Stap 4: Ontbrekende Skill Packages

**Nieuwe repos aan te maken in `C:\Users\Freek Heijting\Documents\GitHub\`:**

| Package | Prioriteit | Basis | Skills (geschat) |
|---|---|---|---|
| `Speckle-Claude-Skill-Package` | Hoog | Speckle-widgets brainstorm | ~15 |
| `QGIS-Claude-Skill-Package` | Hoog | Geen basis, from scratch | ~18 |
| `ThreeJS-Claude-Skill-Package` | Medium | ThatOpenCompany threejs-bim skill als basis | ~20 |
| `ThatOpen-Engine-Claude-Skill-Package` | Medium | ThatOpenCompany (6 skills: architecture, web-ifc, lit-ui, flatbuffers, emscripten, ifc-standards) | ~15 |
| `Cross-Tech-Claude-Skill-Package` | Hoog | Nieuw, boundary rules | ~12 |

**Besluit:** Losse packages per technologie — consistent met huidige aanpak, meer flexibiliteit.

**Aanpak per package:** Volg bewezen 7-fase workflow vanuit `Skill-Package-Workflow-Template`

**ThatOpenCompany split:** De 7 bestaande skills worden verdeeld:
- `ThreeJS-Claude-Skill-Package` ← threejs-bim skill + nieuwe Three.js general-purpose skills
- `ThatOpen-Engine-Claude-Skill-Package` ← thatopen-architecture, web-ifc-api, lit-bim-ui, flatbuffers-fragments, emscripten-wasm-vite, ifc-bim-standards

---

## Stap 5: Draw.io Package Afronden

**Repo:** `C:\Users\Freek Heijting\Documents\GitHub\Draw.io-Claude-Skill-Package\`
**Status:** 12 skills, geen README, geen remote
**Acties:**
1. README schrijven
2. GitHub remote aanmaken (OpenAEC-Foundation)
3. Compliance audit draaien
4. Publiceren

---

## Volgorde van uitvoering

| # | Wat | Repo/locatie | Waarom eerst |
|---|---|---|---|
| 1 | CI/CD quality pipeline | `Skill-Package-Workflow-Template` | Schaalt alles wat daarna komt |
| 2 | Draw.io afronden + publiceren | `Draw.io-Claude-Skill-Package` | Quick win, 90% klaar |
| 3 | Cross-Tech package (nieuw) | `Cross-Tech-Claude-Skill-Package` | Lost het "dingen breken" probleem op |
| 4 | Workspace Builder MVP (Tauri+SolidJS) | `VSCode_ClaudeCode_Workspace_Composer_App` | Maakt bundeling/presets mogelijk |
| 5 | Speckle package | `Speckle-Claude-Skill-Package` (nieuw) | Geen skills bestaan wereldwijd |
| 6 | QGIS package | `QGIS-Claude-Skill-Package` (nieuw) | Geen skills bestaan wereldwijd |
| 7 | ThatOpen Engine package | `ThatOpen-Engine-Claude-Skill-Package` (nieuw) | 6 skills als basis uit ThatOpenCompany |
| 8 | ThreeJS package | `ThreeJS-Claude-Skill-Package` (nieuw) | 1 skill als basis + general-purpose |

**Alle repos in:** `C:\Users\Freek Heijting\Documents\GitHub\`

---

## Verificatie

- **CI/CD pipeline:** Push een SKILL.md met opzettelijke fouten → workflow moet falen
- **Cross-tech skills:** Test in Open PDF Studio: wijzig Tauri command → check of skill waarschuwt over SolidJS impact
- **Workspace Builder:** Selecteer [OPEN-PDF-STUDIO] preset → `.code-workspace` moet correct genereren met alle 6 packages
- **Nieuwe packages:** Doorloop 7-fase methodologie, eindig met compliance audit ≥ 90%
