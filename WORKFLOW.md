# Skill Package Development Workflow

## Overview

This document defines the **7-phase research-first methodology** for building deterministic Claude skill packages. Proven across 10+ production packages:

| Package | Skills | Technologies | Timeline |
|---------|--------|-------------|----------|
| Blender-Bonsai | 73 | 4 (Blender, IfcOpenShell, Bonsai, Sverchok) | 2 days |
| ERPNext | 28 | 1 (ERPNext/Frappe) | Multi-session |
| Tauri 2 | 27 | 1 (Tauri 2.x) | 1 day |
| Nextcloud | 24 | 1 (Nextcloud/WebDAV) | 1 session |
| React | 24 | 1 (React 18/19) | 1 session |
| Draw.io | 22 | 1 (Draw.io/diagrams.net) | 1 session |
| Vite | 22 | 1 (Vite 6/7/8) | 1 session |
| Docker | 22 | 1 (Docker/Compose) | 1 session |
| n8n | 21 | 1 (n8n workflow automation) | 1 session |
| + 3 more | 48 | Various | Various |
| **Totaal** | **311** | | |

**Core principle**: You cannot create deterministic skills for something you don't deeply understand.

**Why skill packages matter**: Even when LLMs "know" a technology, deterministic skills prevent hallucination, enforce best practices, and ensure consistent code generation. Critical for open-source LLMs with weaker training coverage.

---

## How It Works — The Big Picture

```
Phase 1          Phase 2          Phase 3          Phase 4+5         Phase 6      Phase 7
BOOTSTRAP &      DEEP             MASTERPLAN       TOPIC RESEARCH    VALIDATION   PUBLICATION
RAW MASTERPLAN   RESEARCH         REFINEMENT       + SKILL CREATION  + AUDIT      + RELEASE

Gather input     Investigate      Finalize plan    Build in batches  Test         Ship
→ Topics         → Sub-topics     → Sub-phases     → 3 agents ||    → Structural → README
→ Associations   → Anti-patterns  → Dependencies   → Quality gate   → Content    → Banner
→ Scope          → Version diffs  → Agent prompts  → Repeat         → Functional → GitHub
→ Raw plan       → Research docs  → Parallelization                 → CI/CD      → Release
```

**Key design decisions:**
- **Bypass Permissions ON** — the entire workflow runs headless with agent teams
- **Sessions can take hours** — large packages (50+ skills) run autonomously
- **Maximize parallelization** — agent batches run in parallel where dependencies allow
- **Sequential where necessary** — research before creation, validation after creation
- **Everything is tested** — no phase is skipped, no output goes unvalidated

---

## The 7 Phases

### Phase 1: Bootstrap & Raw Masterplan

**Goal**: Gather all input, bootstrap a dedicated workspace, identify all topics, and produce a raw masterplan.

**What happens in this phase:**
You start with a subject — a framework, a software stack, a technology — and you build a dedicated workspace around it. From the subject, all kinds of topics emerge: API areas, configuration patterns, error handling, integrations, deployment, version differences. These topics become the associations you will investigate. The raw masterplan captures ALL of these topics before any deep research begins.

**Steps**:
1. **Configure workspace for autonomous operation**:
   - Enable **Bypass Permissions** in project settings (`.claude/settings.json`)
   - This is REQUIRED — the workflow uses agent teams that must run without manual approval
   - Add to `.claude/settings.json`:
     ```json
     { "permissions": { "allow": ["Bash(*)", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch", "WebSearch", "Agent"] } }
     ```
2. **Define technology scope** (name, versions, programming languages, ecosystem)
3. **Identify all topics** — brainstorm every area worth investigating:
   - Core architecture and design philosophy
   - API modules, classes, functions
   - Configuration and setup patterns
   - Common workflows and use cases
   - Integration points with other technologies
   - Error patterns and known pitfalls
   - Version-specific differences
4. **Create preliminary skill inventory** (rough estimate — refined in Phase 3)
5. **Bootstrap repository** with all governance infrastructure:
   - CLAUDE.md with all protocols (P-000a through P-010)
   - ROADMAP.md, REQUIREMENTS.md, DECISIONS.md, SOURCES.md
   - WAY_OF_WORK.md, LESSONS.md, CHANGELOG.md
   - Directory structure: `skills/source/`, `docs/masterplan/`, `docs/research/`
6. **Record initial architectural decisions** in DECISIONS.md
7. **Write raw masterplan** in `docs/masterplan/{tech}-masterplan.md`
   - List all identified topics grouped by category
   - Estimate skill count per category
   - Note open questions for Phase 2 research

**Output**: Repository with complete infrastructure, raw masterplan with all identified topics
**Exit Criteria**: All core files created, raw masterplan lists all topics to investigate, ROADMAP.md shows Phase 1 complete

---

### Phase 2: Deep Research (Vooronderzoek)

**Goal**: Systematically investigate every topic from the raw masterplan. Discover sub-topics, anti-patterns, and version differences that weren't visible during Phase 1.

**What happens in this phase:**
You take all the topics from your raw masterplan and research them deeply. During this research, you discover MORE topics — sub-topics, edge cases, integration quirks, version-specific gotchas. These discoveries feed back into the masterplan. This is the phase where understanding deepens from "I know this technology exists" to "I understand exactly how it works and where it fails."

**Steps**:
1. Read SOURCES.md for approved documentation URLs
2. Research EVERY topic from the raw masterplan systematically:
   - Architecture and design philosophy
   - Complete API surface (all modules, classes, methods)
   - Version matrix (breaking changes across versions)
   - Configuration and setup patterns
   - Security model and permissions
   - Common workflows and use cases
   - Error patterns and debugging approaches
   - Anti-patterns from real GitHub issues
   - Build and deployment considerations
3. Use WebFetch to verify against latest official documentation
4. **Capture new sub-topics** discovered during research — these feed Phase 3
5. Minimum 2000 words, aim for comprehensive coverage
6. Update SOURCES.md with verification dates

**Output**: `docs/research/vooronderzoek-{tech}.md`
**Exit Criteria**: All major API areas documented, version differences mapped, anti-patterns identified, newly discovered sub-topics noted for Phase 3

---

### Phase 3: Masterplan Refinement

**Goal**: Transform the raw plan into a precise, executable masterplan. Define sub-phases, dependencies, parallelization strategy, and complete agent prompts. After this phase, the masterplan is the blueprint — execution is mechanical.

**What happens in this phase:**
The research from Phase 2 revealed new sub-topics and changed your understanding of the technology. Now you incorporate everything into a refined masterplan. You decide which skills to merge, add, or remove. You define the exact execution order: which skills can be built in parallel (same batch), which must be sequential (dependency chain). You write complete agent prompts so that Phase 5 can run autonomously for hours without human intervention.

**Steps**:
1. Review vooronderzoek against Phase 1 skill inventory
2. **Incorporate discoveries**: Add skills for new sub-topics found in Phase 2
3. Merge redundant skills (research reveals overlaps)
4. Remove unnecessary skills (API too thin for standalone skill)
5. **Define dependency graph**: Which skills depend on which? (foundation → syntax → impl → errors → agents)
6. **Organize into parallel batches** (3 agents per batch):
   - Group independent skills into the same batch (parallelizable)
   - Mark sequential dependencies between batches
   - Estimate total batches and runtime
7. **Write complete agent prompts** for EVERY skill:
   - Output directory path
   - Files to create (SKILL.md + references/)
   - YAML frontmatter with description
   - Scope bullets
   - Research section references
   - Quality rules
8. Record new decisions in DECISIONS.md

**Output**: Updated `docs/masterplan/{tech}-masterplan.md` (definitive, executable)
**Exit Criteria**: Final skill count, batch plan with dependency graph, ALL agent prompts ready to execute headlessly

---

### Phase 4: Topic-Specific Research

**Goal**: Deep-dive research per skill or skill group, ensuring every detail is verified before building.

**What happens in this phase:**
The refined masterplan identifies exactly which skills to build. Some skills cover complex areas that need additional focused research beyond what Phase 2 provided. This phase runs concurrently with Phase 5: research a batch, build those skills, research the next batch.

**Steps**:
1. For each skill (or batch): create focused research document
2. Cover ONLY what that specific skill needs
3. Verify code examples via WebFetch against official docs
4. Identify anti-patterns from real issues
5. Cross-reference with related skills

**Output**: `docs/research/topic-research/{skill-name}-research.md`
**Exit Criteria**: Research sufficient for deterministic skill creation

**Note**: This phase runs concurrently with Phase 5. Research a batch → build those skills → research next batch → build → repeat.

---

### Phase 5: Skill Creation

**Goal**: Build all skills using parallel agent teams. This is the production phase — the masterplan is the blueprint, agents execute it.

**What happens in this phase:**
This is where the actual building happens. The masterplan from Phase 3 contains complete agent prompts for every skill. You spawn agent teams (3 agents per batch), each agent builds one skill autonomously. After every batch, a quality gate validates the output. If something fails, a fix-agent corrects it. This phase can run for hours without human intervention — that's why bypass permissions and complete agent prompts are essential.

**Execution model:**
```
Batch 1: [Agent A: core-skill-1] [Agent B: core-skill-2] [Agent C: core-skill-3]
          ↓ quality gate ↓
Batch 2: [Agent A: syntax-skill-1] [Agent B: syntax-skill-2] [Agent C: syntax-skill-3]
          ↓ quality gate ↓
Batch 3: [Agent A: impl-skill-1] [Agent B: impl-skill-2] [Agent C: impl-skill-3]
          ↓ quality gate ↓
...repeat until all skills built...
```

**Steps**:
1. Execute in batches of 3 agents (optimal parallelism for Claude Code Agent tool)
2. Each agent receives the complete prompt from the masterplan:
   - Research document (Phase 4 output)
   - REQUIREMENTS.md quality criteria
   - SOURCES.md approved URLs
   - Skill structure from WAY_OF_WORK.md
   - Reference to similar completed skill (format consistency)
3. Quality gate AFTER every batch (see Quality Gate Checklist below)
4. If validation fails: spawn fix-agent with specific corrections, re-validate
5. NEVER accept below REQUIREMENTS.md quality bar
6. Commit after every batch — work that isn't committed doesn't exist

**Output**: `skills/source/{prefix}-{category}/{skill-name}/`
**Exit Criteria**: All skills created and validated per batch

---

### Phase 6: Validation & Audit

**Goal**: Structural, content, and functional testing of everything that was built. Nothing ships without being tested.

**What happens in this phase:**
Everything that was built in Phase 5 gets systematically tested. The CI/CD pipeline runs automated checks (frontmatter, line count, structure, language). A compliance audit checks all 7 phases for methodology adherence. Functional testing verifies that skills actually work when Claude uses them. Issues are fixed and re-validated until the quality bar is met.

**Steps**:
1. **Automated CI/CD validation** (run locally or via GitHub Actions):
   ```bash
   node scripts/validate-frontmatter.js /path/to/package
   node scripts/validate-line-count.js /path/to/package
   node scripts/validate-structure.js /path/to/package
   node scripts/validate-language.js /path/to/package
   node scripts/generate-audit-report.js /path/to/package
   ```
2. **Structural validation**:
   - YAML frontmatter valid (name, description with trigger words)
   - SKILL.md < 500 lines
   - Reference files present (methods.md, examples.md, anti-patterns.md)
   - File paths correct
3. **Content validation**:
   - English-only
   - Deterministic language (ALWAYS/NEVER, no "you might consider")
   - No hallucinated APIs
   - Version-explicit code examples
4. **Cross-reference validation**:
   - Skills reference each other correctly
   - No broken links
5. **Functional validation**:
   - Test skills by asking Claude realistic questions
   - Verify generated code matches skill guidance
6. **Compliance audit** (P-010):
   - Run the methodology audit from `templates/methodology-audit.md.template`
   - Target: ≥ 90% compliance score
   - Auto-remediate fixable issues

**Output**: Validation report, audit report, all issues resolved
**Exit Criteria**: Zero blocking issues, compliance score ≥ 90%

---

### Phase 7: Publication + Compliance Audit

**Goal**: Finalize package for public release AND verify methodology compliance.

**Steps**:
1. Create INDEX.md (complete skill catalog with descriptions and trigger scenarios)
2. Update README.md:
   - Skill count table by category
   - Installation instructions
   - Version compatibility matrix
   - Technology badges
   - OpenAEC Foundation branding
3. Create social preview banner:
   - Create `docs/social-preview-banner.html` (1280x640px)
   - Technology branding (colors, fonts, code samples)
   - Skill count prominently displayed
   - OpenAEC Foundation logo
   - Render to `docs/social-preview.png`
4. GitHub repository setup:
   ```bash
   # Create remote under OpenAEC Foundation
   gh repo create OpenAEC-Foundation/{Tech}-Claude-Skill-Package --public --description "Deterministic Claude skills for {Technology}"
   git remote add origin https://github.com/OpenAEC-Foundation/{repo-name}.git
   git push -u origin main

   # Set repository topics
   gh repo edit --add-topic claude,skills,{tech},ai,deterministic

   # Social preview: PNG is auto-generated via Chrome headless from HTML template.
   # Upload requires GitHub web UI (no public API exists):
   # → https://github.com/OpenAEC-Foundation/{repo}/settings → Social preview → Edit
   ```
5. Update ROADMAP.md to 100%
6. Update CHANGELOG.md (v1.0.0 entry: `[Unreleased]` → `[1.0.0] - YYYY-MM-DD`)
7. Create release tag:
   ```bash
   git tag -a v1.0.0 -m "v1.0.0: {X} deterministic skills for {Technology}"
   git push origin v1.0.0
   gh release create v1.0.0 --title "v1.0.0 — {Technology} Skill Package" \
     --notes "Initial release with {X} deterministic skills across {N} categories."
   ```
8. Verify GitHub page:
   - README renders correctly
   - Social preview shows on link shares
   - Topics are set
   - License is visible

9. **MANDATORY: Run Compliance Audit** (see Compliance Audit section below)
   - Spawn audit agent to check ALL 7 phases
   - If audit score < 90%: auto-remediate all fixable issues
   - Re-audit after remediation to confirm fixes
   - Commit remediation: `audit: remediate methodology gaps`
   - Push final state

**Output**: Published GitHub repository with social preview, release tag, complete README, passing compliance audit
**Exit Criteria**: Repository public, discoverable, installable, audit score ≥ 90%

---

## Repository Structure

Every skill package follows this directory layout:

```
{Tech}-Claude-Skill-Package/
├── CLAUDE.md                    # Governance protocols (P-001 to P-008)
├── ROADMAP.md                   # Single source of truth for status
├── REQUIREMENTS.md              # Quality guarantees
├── DECISIONS.md                 # Architectural decisions (D-XXX, immutable)
├── SOURCES.md                   # Approved documentation URLs
├── WAY_OF_WORK.md               # Methodology reference
├── LESSONS.md                   # Discoveries (L-XXX)
├── CHANGELOG.md                 # Version history (Keep a Changelog)
├── README.md                    # GitHub landing page
├── INDEX.md                     # Skill catalog (Phase 7)
├── LICENSE                      # MIT
├── .gitignore
│
├── docs/
│   ├── masterplan/              # Execution plans
│   │   └── {tech}-masterplan.md
│   ├── research/                # Research documents
│   │   ├── vooronderzoek-{tech}.md
│   │   ├── topic-research/      # Per-skill research
│   │   └── fragments/           # Supporting fragments
│   └── social-preview-banner.html
│
└── skills/
    └── source/
        ├── {prefix}-syntax/     # API syntax, code patterns
        ├── {prefix}-impl/       # Development workflows
        ├── {prefix}-errors/     # Error handling, debugging
        ├── {prefix}-core/       # Architecture, cross-cutting concerns
        └── {prefix}-agents/     # Validation, code generation agents
```

---

## Core Files Reference

| File | Domain | Purpose | Update Frequency |
|------|--------|---------|------------------|
| **ROADMAP.md** | Status | Single source of truth for progress | After EVERY phase/batch |
| **CLAUDE.md** | Governance | 8 protocols for session behavior | Once (Phase 1) |
| **REQUIREMENTS.md** | Quality | What skills must achieve | Once (Phase 1/3) |
| **DECISIONS.md** | Architecture | Numbered decisions (D-XXX), immutable | When decisions made |
| **SOURCES.md** | References | Approved documentation URLs | When researching |
| **WAY_OF_WORK.md** | Methodology | 7-phase process, skill standards | Once (Phase 1) |
| **LESSONS.md** | Knowledge | Numbered discoveries (L-XXX) | When learned |
| **CHANGELOG.md** | History | Version history (Keep a Changelog) | After milestones |
| **README.md** | Public | GitHub landing page | After phase milestones |
| **INDEX.md** | Catalog | Complete skill listing | Phase 7 |

**Critical rule**: ROADMAP.md is the ONLY place for project status. Never duplicate status elsewhere.

---

## Skill Structure

### Directory Layout (every skill)
```
skill-name/
├── SKILL.md              # Main file, MUST be < 500 lines
└── references/
    ├── methods.md        # Complete API signatures
    ├── examples.md       # Working code examples
    └── anti-patterns.md  # What NOT to do (with explanations)
```

### SKILL.md Format
```yaml
---
name: {prefix}-{category}-{topic}
description: >
  Use when [specific trigger scenario -- what the user is doing or asking].
  Prevents the [common mistake / anti-pattern this skill guards against].
  Covers [key topics, API areas, version differences].
  Keywords: [comma-separated technical terms users might type in their prompt].
license: {{LICENSE}}
compatibility: "Designed for Claude Code. Requires {Technology} {versions}."
metadata:
  author: OpenAEC-Foundation
  version: "1.0"
---

# {Skill Title}

## Quick Reference
[Critical warnings, decision trees, API overview tables]

## Essential Patterns
[Code examples with version annotations]

## Common Operations
[Practical code snippets for typical use cases]

## Reference Links
- [Complete API Reference](references/methods.md)
- [Working Examples](references/examples.md)
- [Anti-Patterns](references/anti-patterns.md)
```

### Description Field (trigger-optimized format)

The `description` is the most important field -- Claude uses it to decide whether to load a skill. Every description MUST follow this structure:

1. **"Use when..."** -- tells Claude exactly when to activate (action-oriented, not "Documents..." or "Covers...")
2. **Anti-pattern warning** -- the specific mistake this skill prevents ("Prevents the common mistake of...", "Avoids the #1 pitfall:")
3. **Scope summary** -- what the skill covers (brief)
4. **Keywords** -- technical terms that match user prompts (function names, error messages, library names)

**Use YAML folded block scalar (`>`)** for multi-line descriptions. This is more readable than quoted strings.

**Good example:**
```yaml
description: >
  Use when writing IfcOpenShell Python code that creates, modifies, or deletes
  IFC entities. Prevents the #1 AI mistake: using create_entity() directly
  instead of ifcopenshell.api.run(). Covers all 30+ API modules, parameter
  conventions, and version differences.
  Keywords: IFC, BIM, ifcopenshell, api.run, create_entity, IfcWall, IfcSlab.
```

**Bad example (passive, no triggers):**
```yaml
description: "Documents the ifcopenshell.api module system with all 30+ API modules and invocation patterns."
```

### Naming Convention
- Format: `{prefix}-{category}-{topic}`
- Single-tech packages: one prefix (e.g., `tauri-`, `react-`, `docker-`)
- Multi-tech packages: prefix per technology (e.g., `blender-`, `ifcos-`, `bonsai-`)

### Skill Categories (5 standard)

| Category | Purpose | Naming |
|----------|---------|--------|
| **syntax/** | API syntax, code patterns, signatures | `{prefix}-syntax-{topic}` |
| **impl/** | Step-by-step development workflows | `{prefix}-impl-{topic}` |
| **errors/** | Error handling, debugging, anti-patterns | `{prefix}-errors-{topic}` |
| **core/** | Architecture, cross-cutting concerns | `{prefix}-core-{topic}` |
| **agents/** | Validation, code generation, orchestration | `{prefix}-agents-{topic}` |

---

## Content Standards

### MUST DO:
- English ONLY (skills are instructions for Claude, not end users)
- Deterministic language: "ALWAYS use X when Y" / "NEVER do X because Y"
- Verify ALL code against official documentation (WebFetch)
- Version-explicit code examples (annotate which versions apply)
- Document anti-patterns with "WHY this fails" explanations
- Decision trees for common architectural choices
- SKILL.md under 500 lines (heavy content in references/)

### MUST NOT DO:
- Vague language: "you might consider", "it's often good practice"
- Assumptions about API behavior without verification
- Stale or outdated code from previous versions
- Speculative features or unreleased APIs
- Non-English content
- Training data without WebFetch verification

---

## Orchestration Model

### Headless Agent Teams

This workflow is designed for **autonomous, headless operation**. A complete skill package (20-70 skills) can take 1-8 hours to build. The user provides direction, the system executes.

**Prerequisites for headless operation:**
- **Bypass Permissions: ON** — agents must run without per-tool approval
- **Complete agent prompts** — every skill has a ready-to-execute prompt in the masterplan
- **Quality gates are automated** — no human judgment needed between batches
- **Commits after every batch** — recovery is always possible

### Meta-Orchestrator Pattern
The Claude Code session + human user = **BRAIN** (thinks, plans, validates)
Agents = **HANDS** (research, write, validate — the actual work)

### What the orchestrator does:
- **THINK**: Analyze problems, design solutions
- **STRATEGIZE**: Plan batches, define task decomposition, maximize parallelization
- **COMPOSE**: Write agent prompts with core file references
- **VALIDATE**: Assess output against REQUIREMENTS.md
- **DECIDE**: Accept or respawn with corrections

### What agents do:
- **EXECUTE**: Create skills based on research
- **SELF-VALIDATE**: Check against requirements before returning
- **REPORT**: Deliver output to orchestrator

### Agent Prompt Template (5 required elements):
1. **Absolute file paths** for input AND output
2. **Explicit scope** with bullet points
3. **Reference files** for format consistency
4. **Quality rules** inline (English-only, <500 lines, deterministic)
5. **Source URLs** from SOURCES.md

### Parallelization Strategy:
- 3 agents per batch (optimal for Claude Code Agent tool)
- Separated file scopes (NEVER two agents on same file)
- Quality gate after every batch
- Dependency-aware ordering (foundation skills first)
- **Parallel**: Independent skills in the same batch (e.g., 3 syntax skills)
- **Sequential**: Dependent skills in different batches (e.g., core before impl)
- **Concurrent phases**: Phase 4 research runs interleaved with Phase 5 creation

---

## Quality Gate Checklist

Applied after EVERY batch during Phase 5:

1. File exists and is complete
2. YAML frontmatter valid (name, description with trigger words)
3. Line count < 500 (SKILL.md only)
4. English-only (no other languages)
5. Deterministic language (ALWAYS/NEVER, not suggestions)
6. All reference files present and linked from SKILL.md
7. Sources traceable to SOURCES.md approved URLs
8. Code examples verified against official docs

### Correction Flow:
1. Document what failed
2. Spawn fix-agent with specific correction instructions
3. Re-validate after fix
4. NEVER accept below quality bar

---

## Reflection Checkpoint (after every phase/batch)

**MANDATORY**: After completing each phase or batch, PAUSE and ask these questions before proceeding:

1. **Research sufficiency**: Did this phase reveal gaps in our understanding? Do we need additional research before continuing?
2. **Scope reassessment**: Should we add, merge, or remove skills based on what we learned?
3. **Plan revision**: Does our masterplan still make sense? Should batch ordering or dependencies change?
4. **Quality reflection**: Are we meeting our quality bar? Is deterministic language consistent? Are anti-patterns being captured?
5. **New discoveries**: Did we learn something that should become a LESSONS.md entry or a DECISIONS.md decision?

**Decision**: If any answer is "yes", update the relevant core files BEFORE continuing to the next phase. If research needs expanding, return to Phase 2 or 4 for targeted deep-dives.

**This prevents**: Building on incomplete understanding. The Tauri 2 package was completed in one session precisely because reflection checkpoints caught gaps early and expanded research where needed.

---

## Document Sync Protocol

After EVERY completed phase/batch:

1. **REFLECTION CHECKPOINT** — Answer the 5 questions above (MANDATORY)
2. **ROADMAP.md** — Update status, percentage, next steps (MANDATORY)
3. **LESSONS.md** — Log new patterns or discoveries (if any)
4. **DECISIONS.md** — Record new architectural decisions (if any)
5. **SOURCES.md** — Update verification dates (if researching)
6. **CHANGELOG.md** — Add entry (if milestone reached)
7. **Git commit** with message: `Phase X.Y: [action] [subject]`
8. **README.md** — Update if skill count changed or milestone reached

Timing: IMMEDIATE after completion, not deferred.

---

## Version Control Discipline

- Commit after EVERY completed phase/batch
- Message format: `Phase X.Y: [action] [subject]`
- Push to GitHub after every phase (work that isn't pushed doesn't exist)
- ROADMAP.md updated with EVERY commit
- Use conventional commit prefixes where appropriate: `feat:`, `fix:`, `docs:`, `refactor:`

---

## Completeness Levels

| Level | Name | What's Done |
|-------|------|-------------|
| 1 | Structural | All skills exist, correct directories, frontmatter valid |
| 2 | Content | No factual errors, version markers present, deterministic language |
| 3 | Technical | Validation passes, all references linked |
| 4 | Functional | Skills load, triggers work, code generation tested |
| 5 | Production | Real-world projects validated, user feedback incorporated |

---

## Compliance Audit (mandatory at end of Phase 7)

Every skill package MUST pass a compliance audit before it is considered complete. The audit checks all 7 phases and auto-remediates fixable issues.

### How to run

Use the prompt from `templates/methodology-audit.md.template`. Copy the prompt section and run it in Claude Code from within the target skill package repo.

### What it checks

The audit covers 50+ checks across all 7 phases:

| Area | Key Checks |
|------|-----------|
| **Phase 1** | Core files exist, DECISIONS.md populated, masterplan exists |
| **Phase 2** | Vooronderzoek exists AND is committed, SOURCES.md updated, separate commit |
| **Phase 3** | Masterplan skill count matches disk, refinement decisions in DECISIONS.md |
| **Phase 4** | Topic research exists OR documented decision to use inline WebFetch |
| **Phase 5** | All skills present, frontmatter uses `>` scalar, English-only, deterministic |
| **Phase 6** | Validation pass documented, cross-references valid, no broken links |
| **Phase 7** | INDEX.md, README.md, banner, CHANGELOG versioned, tag, release, topics |
| **Cross-cutting** | ROADMAP consistent with git, LESSONS.md multi-phase, SOURCES.md verified |

### YAML Frontmatter Standard

All SKILL.md descriptions MUST use YAML folded block scalar (`>`):

```yaml
# CORRECT — folded block scalar
description: >
  Use when [trigger scenario]. Prevents [anti-pattern].
  Covers [scope]. Keywords: [terms].

# WRONG — quoted string (legacy, must be migrated)
description: "Quoted string description..."
```

### Pass criteria

- **≥ 90%**: PASS — package is compliant
- **70-89%**: PARTIAL — auto-remediate, then re-audit
- **< 70%**: FAIL — significant rework needed, re-run phases from first failure point

### Auto-remediation

The audit prompt includes remediation logic that:
1. Identifies the first broken phase
2. Re-executes all phases from that point forward (using masterplan agent prompts)
3. Fixes governance file inconsistencies
4. Migrates YAML frontmatter to `>` format
5. Re-audits to confirm fixes
6. Commits and pushes all changes

---

## Cross-Platform Skills

For stacks that combine multiple technologies (e.g., Tauri + React + Vite), cross-platform skills address the integration points:

- Each technology package remains **standalone and independently installable**
- Cross-platform skills are triggered when Claude detects multiple technologies in use
- Cross-platform skills live in a separate repository: `Cross-Platform-Claude-Skills`
- Focus areas: frontend design patterns, API integration, build pipeline coordination, deployment orchestration

---

## Session Protocols (embedded in CLAUDE.md)

### P-001: Session Start
Read ROADMAP.md → LESSONS.md → DECISIONS.md → REQUIREMENTS.md → masterplan → Identify next action → Confirm with user

### P-002: Meta-Orchestrator
Delegate execution via agents. Thinking stays in main session. Validate before accepting.

### P-003: Quality Control
Validator-before-apply checklist. Sources from REQUIREMENTS.md and DECISIONS.md.

### P-004: Research
Use only SOURCES.md approved sources. WebFetch for latest docs. Update SOURCES.md after.

### P-005: Skill Standards
English-only, deterministic, <500 lines, YAML frontmatter, decision trees.

### P-006: Document Sync
Update ROADMAP.md + LESSONS.md + DECISIONS.md + CHANGELOG.md after every phase.

### P-007: Session End
Update ROADMAP.md next steps (CRITICAL for session recovery). Commit all changes.

### P-008: Inter-Agent
Agents spawned via Claude Code Agent tool. Results collected automatically.

### P-010: Self-Audit
Run compliance audit using `templates/methodology-audit.md.template`. CI/CD validates automatically on push.

---

## Cross-Technology Boundary Skills

For stacks that combine multiple technologies (e.g., IFC + Three.js, Speckle + Blender, QGIS + BIM), cross-tech skills address the integration boundaries:

- Each technology package remains **standalone and independently installable**
- Cross-tech skills describe EXACTLY ONE technology boundary (e.g., IFC ↔ web-ifc)
- Cross-tech skills document BOTH sides of the boundary
- Cross-tech skills live in: `Cross-Tech-AEC-Claude-Skill-Package`
- They reference skills in the source packages, never duplicate content
- Should be built LAST — they depend on the individual technology packages being complete

---

## Operational Lessons (Cross-Package)

Patterns discovered across multiple skill package projects. These are hard-won insights that prevent recurring mistakes.

### YAML Frontmatter Gotchas

The description field is the most error-prone part of SKILL.md. In the ERPNext package, 18 of 28 skills failed initial validation due to YAML issues.

| Issue | Symptom | Fix |
|-------|---------|-----|
| Colon in value | `mapping values not allowed` | Use folded scalar `>` or quote the string |
| Multi-line content | Truncated description | Use `>` (folded) or `|` (literal) block scalar |
| Special characters | Parse errors | Quote + escape |
| Embedded quotes | Nesting errors | Use opposite quote type |

**Best practice**: ALWAYS use YAML folded block scalar (`>`) for descriptions. This avoids all quoting issues and is more readable than quoted strings.

### Session Recovery Protocol

Claude's context resets between sessions. When resuming work:

1. **Scan repo state first** — `git log --oneline -10` + check ROADMAP.md
2. **Compare expected vs actual** — what exists in the repo vs what ROADMAP says should exist
3. **Identify the interruption point** — which files are complete, which are missing
4. **Confirm with user before continuing** — never assume, always verify

**Prevention**: Push after every batch. Update ROADMAP.md after every significant step. Atomic commits.

### Context Window Overflow Management

Large operations (batch validation of 20+ skills, large research documents) can overflow the context window mid-session.

**Prevention**:
- Push incrementally (after each file, not at the end)
- Monitor output size during batch operations
- Checkpoint commits between batches
- Maximum 5-10 files per conversation segment

**Recovery**: Same as session recovery — scan GitHub state, identify gaps, communicate and resume.

### Testing Is Not Optional

The ERPNext package was declared "100% complete" at structural level but had never been functionally tested. This led to a retrofit phase.

**Rule**: Build validation into the workflow, not as a final phase. After every batch:
1. Structural validation (YAML parsing, line counts)
2. At minimum: sample-test 1 skill per category in a real Claude conversation
3. Verify trigger activation and code generation quality

### Frontmatter Migration Pattern

When upgrading existing packages to a new standard (e.g., adding `license`, `compatibility`, `metadata` fields):

1. **Audit first** — document what's missing vs the target format
2. **Batch by category** — parallelize with agents (3 agents, separated file scopes)
3. **Verify after** — spot-check files across categories
4. **Commit atomically** — one commit for the entire migration, not per-file

### License Field in Frontmatter

The SKILL.md template defaults to MIT, but packages may use different licenses (ERPNext uses LGPL-3.0). Always match the frontmatter `license` field to the repository's actual LICENSE file.

---

## Reference Implementations

- **ERPNext** (28 skills): https://github.com/OpenAEC-Foundation/ERPNext_Anthropic_Claude_Development_Skill_Package
- **Blender-Bonsai** (73 skills): https://github.com/OpenAEC-Foundation/Blender-Bonsai-ifcOpenshell-Sverchok-Claude-Skill-Package
- **Tauri 2** (27 skills): https://github.com/OpenAEC-Foundation/Tauri-2-Claude-Skill-Package
