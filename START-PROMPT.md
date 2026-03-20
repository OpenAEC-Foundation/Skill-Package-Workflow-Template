# Universele Start Prompt — Skill Package Development

## De prompt

```
Lees CLAUDE.md, ROADMAP.md, WAY_OF_WORK.md, LESSONS.md, DECISIONS.md, REQUIREMENTS.md en SOURCES.md.
Bepaal de huidige fase uit ROADMAP.md en ga autonoom verder met de volgende onafgeronde fase.
Volg de 7-fase methodologie. Gebruik 3-agent batches waar mogelijk.
Rapporteer wat je gaat doen voordat je begint.
```

## Wanneer gebruiken

- Bij elke nieuwe sessie op een bestaande skill package workspace
- Werkt voor elke technologie (Draw.io, Blender, ERPNext, Tauri, etc.)
- Vereist: CLAUDE.md met P-001 protocol + ROADMAP.md met fasestatus

## Waarom dit werkt

| Onderdeel | Wat het triggert |
|-----------|-----------------|
| "Lees CLAUDE.md" | Laadt identity, protocollen, skill categorieën, MCP config |
| "ROADMAP.md" | Bepaalt exact waar het project staat |
| "WAY_OF_WORK.md" | Kent de 7-fase methodologie |
| "LESSONS.md + DECISIONS.md" | Voorkomt herhaalde fouten, kent eerdere keuzes |
| "ga autonoom verder" | Geen handmatige sturing nodig |
| "Rapporteer wat je gaat doen" | Geeft je controle voordat werk begint |

## Verkorte versie

Als je haast hebt:

```
Lees de core files en ga verder waar we gebleven zijn.
```

Dit werkt omdat CLAUDE.md P-001 (Session Start) al definieert welke files gelezen moeten worden.
