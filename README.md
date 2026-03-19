# Skill Package Workflow Template

> Geconsolideerde workflow voor het bouwen van deterministic Claude skill packages.
> Bewezen in 3 productiepakketten: ERPNext (28 skills), Blender-Bonsai (73 skills), Tauri 2 (27 skills).

## Wat is dit?

Dit is het **template-repository** van de OpenAEC Foundation voor het ontwikkelen van Claude skill packages. Het bevat:

- **WORKFLOW.md** — De complete 7-fase methodologie
- **templates/** — Template-versies van alle core bestanden
- Referenties naar voltooide pakketten als voorbeeld

## Hoe te gebruiken

### Stap 1: Repository klaarzetten

Gebruik het `init-repo.md` script of maak handmatig:

```bash
mkdir {Tech}-Claude-Skill-Package
cd {Tech}-Claude-Skill-Package
git init
```

### Stap 2: Core bestanden kopiëren

Kopieer de templates uit `templates/` en pas aan voor jouw technologie:

1. `CLAUDE.md` — Vervang `{{TECH_*}}` placeholders
2. `ROADMAP.md` — Stel Phase 1 status in
3. `REQUIREMENTS.md` — Definieer kwaliteitseisen
4. `DECISIONS.md` — Noteer eerste beslissingen
5. `SOURCES.md` — Voeg officiële documentatie URLs toe
6. `WAY_OF_WORK.md` — Referentie naar WORKFLOW.md
7. Overige bestanden

### Stap 3: Start een Claude Code sessie

Open de repository in je IDE/terminal en start Claude Code:

```bash
cd {Tech}-Claude-Skill-Package
claude
```

Claude leest automatisch `CLAUDE.md` en weet:
- Welke fase actief is (uit ROADMAP.md)
- Welke protocollen gelden
- Hoe skills gebouwd moeten worden
- Waar bronnen te vinden zijn

### Stap 4: Doorloop de 7 fases

Claude volgt de protocollen uit CLAUDE.md:

| Fase | Wat Claude doet | Jouw rol |
|------|-----------------|----------|
| **1. Raw Masterplan** | Maakt skill inventory, stelt structuur op | Review en goedkeuring |
| **2. Deep Research** | Onderzoekt technologie via WebFetch | Wacht af, check resultaat |
| **3. Masterplan Refinement** | Verfijnt skills, definieert batches | Review finale lijst |
| **4. Topic Research** | Per-skill onderzoek | Optioneel meekijken |
| **5. Skill Creation** | Maakt skills via parallel agents | Quality gate per batch |
| **6. Validation** | Valideert alle skills | Check steekproef |
| **7. Publication** | README, INDEX, banner, GitHub push | Approve final push |

### Stap 5: Publicatie

Na fase 7 heb je:
- Een publieke GitHub repo onder OpenAEC Foundation
- Social preview banner
- Release tag (v1.0.0)
- Compleet README met installatie-instructies

## Tips voor efficiënt werken

1. **Laat Claude delegeren** — De meta-orchestrator delegeert al het werk naar agents
2. **Vertrouw de kwaliteitspoorten** — Na elke batch wordt gevalideerd
3. **Eén sessie per fase** — Grote pakketten: splits over meerdere sessies
4. **ROADMAP.md is heilig** — Claude leest dit bij elke sessie-start
5. **Push na elke fase** — Werk dat niet gepusht is, bestaat niet

## Complete Stack (OpenAEC Foundation)

| Package | Technologie | Status |
|---------|------------|--------|
| ERPNext | ERPNext/Frappe ERP | ✅ Compleet (28 skills) |
| Blender-Bonsai | Blender, IfcOpenShell, Bonsai, Sverchok | ✅ Compleet (73 skills) |
| Tauri 2 | Tauri 2.x desktop/mobile framework | ✅ Compleet (27 skills) |
| n8n | Workflow automation | ⏳ Klaar voor start |
| Docker | Containerization | ⏳ Klaar voor start |
| Nextcloud | Cloud platform | ⏳ Klaar voor start |
| React | UI component library | ⏳ Klaar voor start |
| Vite | Frontend build tool | ✅ Compleet (22 skills) |
| SolidJS | Reactive UI framework | ⏳ Klaar voor start |
| Fluent-i18n | Mozilla i18n system | ⏳ Klaar voor start |
| pdf-lib | PDF creation library | ⏳ Klaar voor start |
| PDF.js | PDF viewer library | ⏳ Klaar voor start |
| ThatOpenCompany | BIM/3D ecosystem | ⏳ Assessment |
| Cross-Platform | Design, integration patterns | ⏳ Gepland |

## Referenties

- [WORKFLOW.md](WORKFLOW.md) — De complete 7-fase methodologie
- [ERPNext Package](https://github.com/OpenAEC-Foundation/ERPNext_Anthropic_Claude_Development_Skill_Package)
- [Blender-Bonsai Package](https://github.com/OpenAEC-Foundation/Blender-Bonsai-ifcOpenshell-Sverchok-Claude-Skill-Package)
- [Tauri 2 Package](https://github.com/OpenAEC-Foundation/Tauri-2-Claude-Skill-Package)

## Licentie

MIT — OpenAEC Foundation
