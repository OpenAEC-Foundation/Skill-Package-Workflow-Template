# Audit & Fix Start Prompt

> Open Claude Code in de root van de skill package repo die je wilt auditen.
> Plak de prompt hieronder. Claude doet de rest — audit, plan, fix, hercontrole.

---

## Prompt (kopieer vanaf hier)

```
Audit en repareer dit skill package project volgens de 7-phase methodology.

## Wat je bent

Je bent de meta-orchestrator. Je DENKT en DELEGEERT — agents doen het werk.
Je leest wel bestanden om je strategie te bepalen, maar je schrijft zelf niets.

## Stap 1: Lees de standaarden

Lees deze bestanden uit de Workflow Template repo VOORDAT je iets anders doet:

1. C:\Users\Freek Heijting\Documents\GitHub\Skill-Package-Workflow-Template\WORKFLOW.md
   → De volledige 7-phase methodology met quality gates en content standards
2. C:\Users\Freek Heijting\Documents\GitHub\Skill-Package-Workflow-Template\templates\SKILL.md.template
   → Het verplichte YAML frontmatter format (description MOET `>` folded scalar gebruiken)
3. C:\Users\Freek Heijting\Documents\GitHub\Skill-Package-Workflow-Template\templates\methodology-audit.md.template
   → De volledige audit checklist en remediation instructies
4. C:\Users\Freek Heijting\Documents\GitHub\Skill-Package-Workflow-Template\REPO-STATUS-AUDIT.md
   → Bekende status van alle packages (kan hints bevatten)

En uit DIT project:
5. docs/masterplan/*-masterplan.md → het uitvoeringsplan met agent prompts
6. ROADMAP.md → claimed status
7. SOURCES.md → goedgekeurde bronnen
8. REQUIREMENTS.md → kwaliteitscriteria

## Stap 2: Spawn de audit agent

Spawn een agent (subagent_type: "general-purpose") die het project auditeert.
De volledige audit-checklist staat in het methodology-audit.md.template bestand
dat je in stap 1 hebt gelezen. Geef de agent die checklist mee.

De agent:
- Leest ALLEEN (Read, Glob, Grep, Bash met git log/wc/status)
- Schrijft NIETS
- Is eerlijk en kritisch
- Rapporteert per fase: PASS / PARTIAL / FAIL met bewijs
- Identificeert de "eerste gebroken fase"
- Lijst alle issues op met fix-instructies
- Checkt specifiek of YAML descriptions het `>` folded scalar format gebruiken

## Stap 3: Beoordeel het rapport en maak een plan

Lees het auditrapport. Bepaal:
- Eerste gebroken fase (startpunt voor remediation)
- Welke issues agents kunnen fixen (AUTO-FIX)
- Welke issues WebFetch research vereisen (RESEARCH-FIX)
- Welke issues menselijke input nodig hebben (SKIP)

Communiceer je plan aan mij:
- Audit score
- Eerste gebroken fase
- Welke fases je opnieuw gaat uitvoeren
- Hoeveel agents je verwacht te spawnen
- Welke issues je niet kunt fixen

WACHT OP MIJN BEVESTIGING voordat je doorgaat.

## Stap 4: Voer remediation uit

Na mijn bevestiging, voer alle gebroken fases opnieuw uit vanaf het startpunt.
De exacte instructies per fase staan in methodology-audit.md.template (stap 3).

Kernregels:
- Volg het MASTERPLAN van dit project (docs/masterplan/*-masterplan.md)
- Gebruik de agent prompts uit het masterplan voor skill creation
- Max 3 agents parallel, nooit twee op hetzelfde bestand
- Quality gate na elke batch (< 500 lines, YAML valid, English-only, deterministic)
- YAML descriptions: ALTIJD `>` folded scalar, NOOIT quoted strings
- Commit na elke fase: `audit: remediate Phase X (compliance audit)`
- Skills en docs in het ENGELS, communicatie met mij in het NEDERLANDS

### Cross-cutting fixes (ALTIJD uitvoeren, ongeacht welke fase gebroken is):
- ROADMAP.md consistent maken met git history
- LESSONS.md aanvullen als entries ontbreken
- SOURCES.md "Last Verified" bijwerken
- DECISIONS.md synchroniseren met masterplan decisions
- YAML frontmatter migreren naar `>` format waar nodig
- CHANGELOG.md: [Unreleased] → [1.0.0] met datum
- Git tag + release aanmaken als die ontbreken
- Push naar remote

## Stap 5: Hercontrole

Spawn een NIEUWE audit agent (zelfde checklist als stap 2).
Rapporteer aan mij:
- Score VOOR: X/Y (XX%)
- Score NA: X/Y (XX%)
- Resterende issues (indien van toepassing)
- Lijst van commits gemaakt
- Of er nog gepusht moet worden
```
