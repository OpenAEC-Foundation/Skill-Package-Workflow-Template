# Gebruikersinstructies — Skill Package Workflow

## Overzicht

Je hebt nu een compleet ecosysteem van skill package repositories klaarstaan. Elk repo is geïnitialiseerd met alle core bestanden en governance protocollen. Claude weet in elke repo precies wat te doen.

## Jouw stappenplan per skill package

### Stap 1: Open de repo in je IDE

```bash
cd "C:\Users\Freek Heijting\Documents\GitHub\{Tech}-Claude-Skill-Package"
```

### Stap 2: Start een Claude Code sessie

```bash
claude
```

Claude leest automatisch `CLAUDE.md` en volgt Protocol P-001 (Session Start):
- Leest ROADMAP.md → ziet dat Phase 1 infrastructure klaar is
- Weet welke fase volgende is (raw masterplan of deep research)
- Vraagt jou om bevestiging voordat het begint

### Stap 3: Laat Claude het werk doen

Geef Claude de opdracht om door te gaan met de volgende fase. Voorbeeldprompts:

**Voor Phase 1 (Raw Masterplan):**
> "Maak een raw masterplan voor dit skill package. Definieer een preliminary skill inventory op basis van de technologie."

**Voor Phase 2 (Deep Research):**
> "Start de deep research fase. Gebruik WebFetch om de officiële documentatie te onderzoeken. Maak een vooronderzoek document."

**Voor Phase 3-7:**
> "Ga door met de volgende fase volgens ROADMAP.md."

### Stap 4: Quality Gates

Na elke batch/fase controleert Claude automatisch:
- YAML frontmatter geldig?
- SKILL.md < 500 regels?
- Engelse content alleen?
- Deterministische taal (ALWAYS/NEVER)?
- Reference files aanwezig?

Jij hoeft alleen steekproefsgewijs te controleren en te bevestigen.

### Stap 5: Publicatie (Phase 7)

Claude doet dit automatisch als onderdeel van Phase 7:
1. GitHub remote aanmaken onder OpenAEC Foundation
2. Social preview banner genereren
3. README updaten met skill tabel
4. Release tag aanmaken
5. Pushen naar GitHub

---

## Volgorde van aanpak (aanbevolen)

### Prioriteit 1: Foundation packages
Deze zijn het meest herbruikbaar en vormen de basis:

| # | Package | Waarom eerst |
|---|---------|-------------|
| 1 | **Docker** | Basis voor alle deployment |
| 2 | **Vite** | Build tool voor alle frontend |
| 3 | **React** | Meest gebruikte UI framework |

### Prioriteit 2: Specifieke tools
| # | Package | Waarom |
|---|---------|--------|
| 4 | **SolidJS** | Alternatief voor React, fine-grained reactivity |
| 5 | **n8n** | Workflow automation |
| 6 | **Nextcloud** | Cloud platform |

### Prioriteit 3: Libraries
| # | Package | Waarom |
|---|---------|--------|
| 7 | **pdf-lib** | PDF creation |
| 8 | **PDF.js** | PDF viewing |
| 9 | **Fluent-i18n** | Internationalization |

### Prioriteit 4: Cross-platform
| # | Package | Waarom |
|---|---------|--------|
| 10 | **ThatOpenCompany** | BIM/3D (bestaand project, assessment nodig) |
| 11 | **Cross-Platform Design** | Frontend design patterns, style system |
| 12 | **Design System** | Interactieve stijlgids met presets |

---

## Tips voor maximale efficiëntie

### Doe meerdere repos tegelijk
Je kunt meerdere Claude Code sessies tegelijk draaien in verschillende terminals:
```bash
# Terminal 1
cd Docker-Claude-Skill-Package && claude

# Terminal 2
cd Vite-Claude-Skill-Package && claude

# Terminal 3
cd React-Claude-Skill-Package && claude
```

### Eén sessie per fase
- Kleine packages (pdf-lib, Fluent): Alle 7 fases in één sessie
- Middelgrote packages (React, Docker): 2-3 sessies
- Grote packages (n8n, Nextcloud): 3-5 sessies

### Startprompt template
Kopieer dit als eerste prompt in elke nieuwe sessie:

> "Lees ROADMAP.md en ga door waar we gebleven zijn. Volg de 7-fase methodologie uit CLAUDE.md. Delegeer zoveel mogelijk naar agents. Ik wil dat je het complete pakket bouwt tot aan publicatie op GitHub onder OpenAEC Foundation, inclusief social preview banner en release tags."

### Als een sessie crasht of stopt
Claude leest bij de volgende sessie automatisch ROADMAP.md en weet precies waar het was. Geen context gaat verloren zolang ROADMAP.md up-to-date is (Protocol P-006 en P-007 zorgen hiervoor).

---

## Wat is er al klaar?

### Template Repository
`Skill-Package-Workflow-Template/` bevat:
- `WORKFLOW.md` — De complete 7-fase methodologie
- `README.md` — Overzicht en instructies
- `templates/` — Template versies van alle core bestanden
- `GEBRUIKERSINSTRUCTIES.md` — Dit document

### Geïnitialiseerde Repositories (Phase 1 Infrastructure)
Elk van deze repos heeft:
- `CLAUDE.md` met alle 9 protocollen
- `ROADMAP.md` op Phase 1 (50% - infrastructure klaar, masterplan pending)
- `REQUIREMENTS.md` met technologie-specifieke kwaliteitseisen
- `DECISIONS.md` met 7 basis architectuur-beslissingen
- `SOURCES.md` met goedgekeurde documentatie URLs
- `WAY_OF_WORK.md` met methodologie referentie
- `LESSONS.md` en `CHANGELOG.md` (klaar voor gebruik)
- `README.md` als GitHub landing page
- Complete directory structuur: `skills/source/{prefix}-{category}/`, `docs/masterplan/`, `docs/research/`
- Git geïnitialiseerd met initial commit

### Voltooide Packages (referentie)
- ERPNext (28 skills) — https://github.com/OpenAEC-Foundation/ERPNext_Anthropic_Claude_Development_Skill_Package
- Blender-Bonsai (73 skills) — https://github.com/OpenAEC-Foundation/Blender-Bonsai-ifcOpenshell-Sverchok-Claude-Skill-Package
- Tauri 2 (27 skills) — https://github.com/OpenAEC-Foundation/Tauri-2-Claude-Skill-Package

---

## Veelgestelde vragen

**Q: Moet ik alle fases handmatig starten?**
A: Nee. Geef Claude de startprompt en het doorloopt alle fases autonoom. Je hoeft alleen te bevestigen bij quality gates.

**Q: Kan Claude zelf GitHub remotes aanmaken?**
A: Ja, als `gh` (GitHub CLI) geïnstalleerd en ingelogd is. Claude doet dit in Phase 7 via Protocol P-009.

**Q: Wat als Claude een fout maakt in een skill?**
A: Het validator-before-apply patroon vangt dit op. Als validatie faalt, spawnt Claude een fix-agent met specifieke correcties.

**Q: Hoeveel skills kan ik verwachten per package?**
A: Hangt af van de technologie:
- Kleine libraries (pdf-lib, Fluent): 10-15 skills
- Middelgrote frameworks (Vite, SolidJS): 15-25 skills
- Grote platforms (React, Docker, Nextcloud, n8n): 25-40 skills

**Q: Kan ik de social preview banner aanpassen?**
A: Ja, Claude genereert een HTML bestand (`docs/social-preview-banner.html`) met de technologie-specifieke kleuren en code voorbeelden. Je kunt dit handmatig aanpassen en opnieuw renderen.
