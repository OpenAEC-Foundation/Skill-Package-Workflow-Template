# Social Preview Banner - Volledig Geautomatiseerde Workflow

## Het Proces (3 stappen, volledig door Claude)

### Stap 1: Claude maakt de HTML template

Claude genereert `docs/social-preview-banner.html`. Wat per repo wordt aangepast:

| Element | Waar | Voorbeeld |
|---------|------|-----------|
| Skill count | `.number` div | `24` |
| Subtitle | `.subtitle` div | `for flawless React component development` |
| Badges | `.badges` div | Technology-specifieke badges met eigen kleuren |
| Versie info | `.versions` div | `React 18/19 | Next.js 14/15 | TypeScript 5.x` |
| Code voorbeeld | `.code-body` div | Representatief code snippet voor die technologie |
| Bestandsnaam | `.code-filename` span | `react_skills.tsx` |
| Branding | `.foundation` div | `OpenAEC Foundation` (of andere org) |
| Kleuren | Badge CSS classes | Per technologie eigen accent kleur |

### Stap 2: Claude rendert de PNG automatisch

```bash
node "C:/Users/Freek Heijting/Documents/GitHub/Skill-Package-Workflow-Template/scripts/generate-banner-png.js" /pad/naar/repo
```

Dit script:
- Opent de HTML in headless Chrome via Puppeteer
- Rendert op exact 1280x640 pixels
- Slaat op als `docs/social-preview.png`
- Geen handmatige stappen nodig

**Vereisten:** Node.js + Puppeteer (geinstalleerd in Skill-Package-Workflow-Template repo).

### Stap 3: Banner bovenaan README + commit + push

1. Voeg de banner toe bovenaan `README.md`, direct na de `# Titel` regel:
```html
<p align="center">
  <img src="docs/social-preview.png" alt="X Deterministic Skills for [Tech]" width="100%">
</p>
```
2. Commit `docs/social-preview.png` + `docs/social-preview-banner.html` + `README.md`
3. Push naar GitHub -- de banner is direct zichtbaar op de repo pagina

## Template Specificaties

- **Afmetingen:** 1280 x 640 pixels (GitHub social preview standaard)
- **Achtergrond:** `#2A2A32` (donker grijs)
- **Grid:** Subtiel blueprint grid (2% opacity)
- **Top strip:** 4px gradient in accent kleur
- **Layout:** 50/50 split - links tekst, rechts code window
- **Fonts:** Space Grotesk (titels), Inter (body), JetBrains Mono (code/versies)

## Prompt voor Claude in andere workspaces

Kopieer onderstaande prompt naar de Claude sessie in de betreffende repo.
De prompt bevat het volledige CSS framework + het render commando.

---

````
Maak een social preview banner voor deze repo. Volledig geautomatiseerd, geen handmatige stappen.

**Stap 1:** Schrijf `docs/social-preview-banner.html` met EXACT dit CSS framework
(alleen de content-secties aanpassen voor deze repo):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Social Preview Banner</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #2A2A32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .banner {
    width: 1280px;
    height: 640px;
    background: #2A2A32;
    position: relative;
    overflow: hidden;
    display: flex;
  }

  .top-strip {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, ACCENT_PRIMARY 0%, ACCENT_SECONDARY 50%, ACCENT_PRIMARY 100%);
  }

  .banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(250,250,249,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(250,250,249,0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
  }

  .left {
    position: relative; z-index: 1;
    width: 50%;
    padding: 72px 40px 56px 72px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .number {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 140px; font-weight: 700;
    color: #FAFAF9; line-height: 0.85;
    letter-spacing: -0.02em; margin-bottom: 10px;
  }

  .title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 26px; font-weight: 700;
    color: ACCENT_PRIMARY;
    letter-spacing: 4px; text-transform: uppercase;
    margin-bottom: 22px;
  }

  .subtitle {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 17px; color: #A1A1AA;
    font-weight: 400; margin-bottom: 30px; line-height: 1.5;
  }

  .badges {
    display: flex; gap: 12px;
    margin-bottom: 32px; flex-wrap: wrap;
  }

  .badge {
    font-family: 'Inter', system-ui, sans-serif;
    padding: 8px 20px; border-radius: 8px;
    font-size: 13px; font-weight: 600;
    background: transparent; border: 2px solid;
  }

  .badge-1 { border-color: BADGE_COLOR_1; color: BADGE_COLOR_1; }
  .badge-2 { border-color: BADGE_COLOR_2; color: BADGE_COLOR_2; }
  .badge-3 { border-color: BADGE_COLOR_3; color: BADGE_COLOR_3; }
  .badge-4 { border-color: BADGE_COLOR_4; color: BADGE_COLOR_4; }

  .versions {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 500;
    color: #A1A1AA; letter-spacing: 0.05em;
    display: flex; gap: 10px; align-items: center;
  }
  .versions .sep { color: #36363E; }

  .right {
    position: relative; z-index: 1;
    width: 50%;
    padding: 56px 56px 56px 16px;
    display: flex; align-items: center;
  }

  .code-window {
    width: 100%;
    background: rgba(54, 54, 62, 0.8);
    border: 1px solid rgba(250,250,249,0.06);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
    max-height: 100%;
  }
  .code-window * { overflow: hidden; }

  .code-titlebar {
    background: rgba(42, 42, 50, 0.95);
    padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid rgba(250,250,249,0.04);
  }

  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red    { background: #DC2626; }
  .dot-yellow { background: #F59E0B; }
  .dot-green  { background: #16A34A; }

  .code-filename {
    color: #A1A1AA; font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500; margin-left: auto; margin-right: auto;
  }

  .code-body {
    padding: 20px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; line-height: 1.7; color: #FAFAF9;
  }

  .comment  { color: #A1A1AA; }
  .keyword  { color: ACCENT_SECONDARY; }
  .function { color: ACCENT_PRIMARY; }
  .string   { color: #34D399; }
  .operator { color: #2563EB; }
  .cursor {
    display: inline-block; width: 8px; height: 17px;
    background: ACCENT_PRIMARY; vertical-align: text-bottom;
  }

  .foundation {
    position: absolute; bottom: 28px; right: 44px;
    text-align: right; z-index: 1;
  }
  .foundation-name {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 18px; font-weight: 700; letter-spacing: 0.5px;
  }
  .foundation-name .open { color: #FAFAF9; }
  .foundation-name .aec  { color: ACCENT_PRIMARY; }
  .foundation-sub {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px; color: #A1A1AA;
    font-weight: 500; letter-spacing: 1px;
  }
</style>
</head>
<body>
  <div class="banner">
    <div class="top-strip"></div>
    <div class="left">
      <div class="number">SKILL_COUNT</div>
      <div class="title">Deterministic Skills</div>
      <div class="subtitle">SUBTITLE_TEXT</div>
      <div class="badges">
        <div class="badge badge-1">TECH_1</div>
        <div class="badge badge-2">TECH_2</div>
        <!-- voeg toe of verwijder badges naar behoefte -->
      </div>
      <div class="versions">
        VERSION_INFO
      </div>
    </div>
    <div class="right">
      <div class="code-window">
        <div class="code-titlebar">
          <div class="dot dot-red"></div>
          <div class="dot dot-yellow"></div>
          <div class="dot dot-green"></div>
          <span class="code-filename">FILENAME</span>
        </div>
        <div class="code-body">
          CODE_EXAMPLE
        </div>
      </div>
    </div>
    <div class="foundation">
      <div class="foundation-name"><span class="open">Open</span><span class="aec">AEC</span></div>
      <div class="foundation-sub">Foundation</div>
    </div>
  </div>
</body>
</html>
```

Wat je moet aanpassen (de UPPERCASE woorden in de HTML):
1. Tel het aantal SKILL.md bestanden -> SKILL_COUNT
2. SUBTITLE_TEXT: korte beschrijving "for flawless [technologie] development"
3. ACCENT_PRIMARY + ACCENT_SECONDARY: de twee hoofdkleuren van de technologie
4. BADGE_COLOR_1 t/m 4: kleur per technologie badge (ghost style, alleen border + tekst)
5. TECH_1 t/m 4: namen van de technologieen (verwijder overbodige badges)
6. VERSION_INFO: versie-info met <span class="sep">|</span> als scheidingsteken
7. FILENAME: bestandsnaam in het code window (bijv. skills.tsx)
8. CODE_EXAMPLE: representatief code voorbeeld met syntax highlighting spans
   Gebruik: <span class="keyword">, <span class="function">, <span class="string">,
   <span class="comment">, <span class="operator">, <span class="cursor"></span>
   Gebruik <br> voor regeleindes en &nbsp; voor inspringen

**Stap 2:** Render de PNG automatisch:
```bash
node "C:/Users/Freek Heijting/Documents/GitHub/Skill-Package-Workflow-Template/scripts/generate-banner-png.js" .
```

**Stap 3:** Commit en push beide bestanden.
````

---

## Repos die nog een banner nodig hebben (status 2026-03-19)

| Repo | Skills | Actie |
|------|--------|-------|
| n8n-Claude-Skill-Package | 21 | HTML + render nodig |
| React-Claude-Skill-Package | 24 | HTML + render nodig |
| pdf-lib-Claude-Skill-Package | 17 | HTML nodig (PNG bestaat al maar zonder bron-HTML) |
| PDFjs-Claude-Skill-Package | 13 | HTML + render nodig |
| SolidJS-Claude-Skill-Package | 6 | HTML + render nodig |

**Repos die AL klaar zijn:**
- Blender-Bonsai-ifcOpenshell-Sverchok (73 skills)
- Fluent-i18n-Claude-Skill-Package
- Nextcloud-Claude-Skill-Package
- Tauri-2-Claude-Skill-Package
- Vite-Claude-Skill-Package
- ERPNext (heeft PNG, ander template)

**Repos die nog NIET af zijn (geen banner nodig):**
- Docker-Claude-Skill-Package (0 skills, nog in opbouw)
- HomeAssistant-Claude-Skill-Package (leeg)
