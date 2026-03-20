# Skill Package Workflow Template

> Geconsolideerde 7-fase methodologie voor het bouwen van deterministic Claude skill packages.
> Bewezen in 10+ productiepakketten met 311+ skills. Inclusief CI/CD quality pipeline.

## Wat is dit?

Dit is het **template-repository** van de OpenAEC Foundation voor het ontwikkelen van Claude skill packages. Het bevat:

- **WORKFLOW.md** — De complete 7-fase research-first methodologie
- **templates/** — Template-versies van alle core bestanden (CLAUDE.md, SKILL.md, ROADMAP.md, etc.)
- **scripts/** — CI/CD validatiescripts (frontmatter, line count, structuur, taal)
- **.github/workflows/** — Reusable GitHub Actions workflow voor automatische kwaliteitsvalidatie
- **HANDOFF-ECOSYSTEEM.md** — Centrale overdracht voor alle openstaande werkpakketten

## De 7-Fase Methodologie

```
Phase 1          Phase 2          Phase 3          Phase 4+5         Phase 6      Phase 7
BOOTSTRAP &      DEEP             MASTERPLAN       TOPIC RESEARCH    VALIDATION   PUBLICATION
RAW MASTERPLAN   RESEARCH         REFINEMENT       + SKILL CREATION  + AUDIT      + RELEASE

Gather input     Investigate      Finalize plan    Build in batches  Test         Ship
→ Topics         → Sub-topics     → Dependencies   → 3 agents ||    → CI/CD      → README
→ Workspace      → Anti-patterns  → Agent prompts  → Quality gate   → Audit      → Banner
→ Raw plan       → Research docs  → Parallelization → Repeat        → Fix        → GitHub
```

**Kernprincipes:**
- **Bypass Permissions ON** — de workflow draait headless met agent teams
- **Sessies kunnen uren duren** — grote packages (50+ skills) draaien autonoom
- **Maximale parallelisatie** — agent batches draaien parallel waar dependencies het toelaten
- **Alles wordt getest** — geen fase wordt overgeslagen, geen output gaat ongevalideerd door

## Hoe te gebruiken

### Stap 1: Repository bootstrappen

```bash
mkdir {Tech}-Claude-Skill-Package
cd {Tech}-Claude-Skill-Package
git init
```

### Stap 2: Core bestanden kopiëren

Kopieer de templates uit `templates/` en vervang `{{TECH_*}}` placeholders:

1. `CLAUDE.md` — Governance protocols (P-000a t/m P-010)
2. `ROADMAP.md` — Status tracking
3. `REQUIREMENTS.md` — Kwaliteitseisen
4. `DECISIONS.md` — Architectuurbeslissingen
5. `SOURCES.md` — Goedgekeurde documentatie URLs
6. `WAY_OF_WORK.md` — Methodologie referentie
7. Overige: LESSONS.md, CHANGELOG.md, .gitignore

### Stap 3: Start Claude Code

```bash
cd {Tech}-Claude-Skill-Package
claude
# Typ: "Lees START-PROMPT.md" of "Lees CLAUDE.md en begin"
```

Claude leest automatisch `CLAUDE.md` en weet welke fase actief is, welke protocollen gelden, en hoe skills gebouwd moeten worden.

### Stap 4: Doorloop de 7 fases

| Fase | Wat er gebeurt | Jouw rol |
|------|---------------|----------|
| **1. Bootstrap & Raw Masterplan** | Input verzamelen, topics identificeren, workspace opzetten, raw plan | Review topics |
| **2. Deep Research** | Alle topics onderzoeken, sub-topics ontdekken | Wacht af |
| **3. Masterplan Refinement** | Plan verfijnen, batches definiëren, agent prompts schrijven | Review finale plan |
| **4. Topic Research** | Per-batch focused onderzoek | Optioneel |
| **5. Skill Creation** | Agent teams bouwen skills (3 parallel, quality gate per batch) | Monitor |
| **6. Validation & Audit** | CI/CD pipeline, compliance audit, functionele tests | Check rapport |
| **7. Publication** | README, INDEX, banner, GitHub release, compliance audit ≥ 90% | Approve push |

## CI/CD Quality Pipeline

Automatische validatie bij elke push/PR. Andere repos gebruiken deze workflow via:

```yaml
# .github/workflows/quality.yml
name: Skill Quality
on: [push, pull_request]
jobs:
  quality:
    uses: OpenAEC-Foundation/Skill-Package-Workflow-Template/.github/workflows/skill-quality.yml@main
```

**Wat het valideert:**
- YAML frontmatter (required fields, folded scalar `>`, "Use when..." triggers)
- Line count (SKILL.md < 500 regels)
- Directory structuur conventie
- English-only content
- Compliance score (≥ 90% = pass)

**Lokaal testen:**
```bash
node scripts/validate-frontmatter.js /pad/naar/package
node scripts/generate-audit-report.js /pad/naar/package
```

## Complete Stack (OpenAEC Foundation)

### Afgerond — 311 skills gepubliceerd

| Package | Technologie | Skills | GitHub |
|---------|------------|--------|--------|
| Blender-Bonsai | Blender, IfcOpenShell, Bonsai, Sverchok | 73 | [Link](https://github.com/OpenAEC-Foundation/Blender-Bonsai-ifcOpenshell-Sverchok-Claude-Skill-Package) |
| ERPNext | ERPNext/Frappe ERP | 28 | [Link](https://github.com/OpenAEC-Foundation/ERPNext_Anthropic_Claude_Development_Skill_Package) |
| Tauri 2 | Tauri 2.x desktop/mobile | 27 | [Link](https://github.com/OpenAEC-Foundation/Tauri-2-Claude-Skill-Package) |
| Nextcloud | Cloud platform / WebDAV | 24 | [Link](https://github.com/OpenAEC-Foundation/Nextcloud-Claude-Skill-Package) |
| React | React 18/19 UI library | 24 | [Link](https://github.com/OpenAEC-Foundation/React-Claude-Skill-Package) |
| Draw.io | Diagramming / diagrams.net | 22 | [Link](https://github.com/OpenAEC-Foundation/Draw.io-Claude-Skill-Package) |
| Vite | Frontend build tool | 22 | [Link](https://github.com/OpenAEC-Foundation/Vite-Claude-Skill-Package) |
| Docker | Containerization | 22 | [Link](https://github.com/OpenAEC-Foundation/Docker-Claude-Skill-Package) |
| n8n | Workflow automation | 21 | [Link](https://github.com/OpenAEC-Foundation/n8n-Claude-Skill-Package) |
| pdf-lib | PDF creation library | 17 | [Link](https://github.com/OpenAEC-Foundation/pdf-lib-Claude-Skill-Package) |
| Fluent-i18n | Mozilla i18n system | 16 | [Link](https://github.com/OpenAEC-Foundation/Fluent-i18n-Claude-Skill-Package) |
| PDFjs | PDF viewer library | 15 | [Link](https://github.com/OpenAEC-Foundation/PDFjs-Claude-Skill-Package) |

### In ontwikkeling — 94 skills gepland

| Package | Technologie | Skills gepland | Status |
|---------|------------|---------------|--------|
| Speckle | Speckle data platform | 22 | Gebootstrapt |
| QGIS | GIS / PyQGIS | 19 | Gebootstrapt |
| Three.js | 3D web development | 19 | Gebootstrapt |
| ThatOpen | @thatopen/components / web-ifc | 19 | Gebootstrapt |
| Cross-Tech-AEC | AEC technology boundaries | 15 | Gebootstrapt |

### Gedeeltelijk afgerond

| Package | Status |
|---------|--------|
| SolidJS | 6 skills geschreven, impl/errors/agents nog te doen |
| Docker | 8 skills geschreven, impl/errors/agents nog te doen |

## Templates

| Template | Doel |
|----------|------|
| `CLAUDE.md.template` | Governance protocols (P-000a t/m P-010) |
| `SKILL.md.template` | YAML frontmatter + skill structuur |
| `masterplan.md.template` | Uitvoeringsplan met agent prompts |
| `methodology-audit.md.template` | Compliance audit + auto-remediation |
| `ROADMAP.md.template` | Status tracking |
| + 7 meer | REQUIREMENTS, DECISIONS, SOURCES, LESSONS, WAY_OF_WORK, CHANGELOG, social-preview |

## Referenties

- [WORKFLOW.md](WORKFLOW.md) — De complete 7-fase methodologie
- [HANDOFF-ECOSYSTEEM.md](HANDOFF-ECOSYSTEEM.md) — Overdracht voor alle openstaande werkpakketten
- [REPO-STATUS-AUDIT.md](REPO-STATUS-AUDIT.md) — Status van alle skill package repos

## Licentie

MIT — OpenAEC Foundation
