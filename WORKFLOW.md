# Skill Package Development Workflow

## Overview

This document defines the **7-phase research-first methodology** for building deterministic Claude skill packages. Proven across three production packages:

| Package | Skills | Technologies | Timeline |
|---------|--------|-------------|----------|
| ERPNext | 28 | 1 (ERPNext/Frappe) | Multi-session |
| Blender-Bonsai | 73 | 4 (Blender, IfcOpenShell, Bonsai, Sverchok) | 2 days |
| Tauri 2 | 27 | 1 (Tauri 2.x) | 1 day |
| Vite | 22 | 1 (Vite 6/7/8) | 1 session |

**Core principle**: You cannot create deterministic skills for something you don't deeply understand.

**Why skill packages matter**: Even when LLMs "know" a technology, deterministic skills prevent hallucination, enforce best practices, and ensure consistent code generation. Critical for open-source LLMs with weaker training coverage.

---

## The 7 Phases

### Phase 1: Raw Masterplan (Setup)

**Goal**: Define scope, create infrastructure, establish governance.

**Steps**:
1. Configure Claude Code workspace permissions:
   - Enable **Bypass Permissions** in project settings (`.claude/settings.json`)
   - This allows autonomous agent execution without manual approval per tool call
   - Run: `claude config set bypassPermissions true` or add to `.claude/settings.json`:
     ```json
     { "permissions": { "allow": ["Bash(*)", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch", "WebSearch", "Agent"] } }
     ```
2. Define technology scope (name, versions, programming languages involved)
3. Create preliminary skill inventory (estimate — refined in Phase 3)
4. Set up repository structure (see Repository Structure below)
5. Write CLAUDE.md with all 8 governance protocols
6. Create initial core files (ROADMAP.md, REQUIREMENTS.md, DECISIONS.md, SOURCES.md, etc.)
7. Record initial architectural decisions in DECISIONS.md
8. Create raw masterplan in `docs/masterplan/{tech}-masterplan.md`

**Output**: Repository with complete infrastructure, raw masterplan
**Exit Criteria**: All core files created, ROADMAP.md shows Phase 1 complete

---

### Phase 2: Deep Research (Vooronderzoek)

**Goal**: Comprehensive technology investigation before any skill planning.

**Steps**:
1. Read SOURCES.md for approved documentation URLs
2. Research technology systematically:
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
4. Minimum 2000 words, aim for comprehensive coverage
5. Update SOURCES.md with verification dates

**Output**: `docs/research/vooronderzoek-{tech}.md`
**Exit Criteria**: All major API areas documented, version differences mapped, anti-patterns identified

---

### Phase 3: Masterplan Refinement

**Goal**: Transform raw plan into executable skill inventory based on research findings.

**Steps**:
1. Review vooronderzoek against Phase 1 skill inventory
2. Merge redundant skills (research reveals overlaps)
3. Add missing skills (research reveals gaps)
4. Remove unnecessary skills (API too thin for standalone skill)
5. Define skill dependencies and execution order
6. Organize into batches (3 skills per batch, dependency-aware)
7. Write ready-to-execute agent prompts for each skill
8. Record new decisions in DECISIONS.md

**Output**: Updated `docs/masterplan/{tech}-masterplan.md` (definitive)
**Exit Criteria**: Final skill count, batch plan with dependencies, all agent prompts ready

---

### Phase 4: Topic-Specific Research

**Goal**: Focused research per skill, concurrent with Phase 5.

**Steps**:
1. For each skill (or batch): create focused research document
2. Cover ONLY what that specific skill needs
3. Verify code examples via WebFetch against official docs
4. Identify anti-patterns from real issues
5. Cross-reference with related skills

**Output**: `docs/research/topic-research/{skill-name}-research.md`
**Exit Criteria**: Research sufficient for deterministic skill creation

**Note**: This phase runs concurrently with Phase 5. Research a batch, create the skills, research next batch.

---

### Phase 5: Skill Creation

**Goal**: Transform research into deterministic skills using parallel agents.

**Steps**:
1. Execute in batches of 3 agents (optimal parallelism for Claude Code Agent tool)
2. Each agent receives:
   - Research document (Phase 4 output)
   - REQUIREMENTS.md quality criteria
   - SOURCES.md approved URLs
   - Skill structure from WAY_OF_WORK.md
   - Reference to similar completed skill (format consistency)
3. Quality gate AFTER every batch (see Quality Gate Checklist below)
4. If validation fails: spawn fix-agent with specific corrections, re-validate
5. NEVER accept below REQUIREMENTS.md quality bar

**Output**: `skills/source/{prefix}-{category}/{skill-name}/`
**Exit Criteria**: All skills created and validated per batch

---

### Phase 6: Validation

**Goal**: Comprehensive quality assurance across all skills.

**Steps**:
1. **Structural validation**:
   - YAML frontmatter valid (name, description with trigger words)
   - SKILL.md < 500 lines
   - Reference files present (methods.md, examples.md, anti-patterns.md)
   - File paths correct
2. **Content validation**:
   - English-only
   - Deterministic language (ALWAYS/NEVER, no "you might consider")
   - No hallucinated APIs
   - Version-explicit code examples
3. **Cross-reference validation**:
   - Skills reference each other correctly
   - No broken links
4. **Functional validation**:
   - Test skills by asking Claude realistic questions
   - Verify generated code matches skill guidance

**Output**: Validation report, all issues resolved
**Exit Criteria**: Zero blocking issues

---

### Phase 7: Publication

**Goal**: Finalize package for public release on GitHub.

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
6. Update CHANGELOG.md (v1.0.0 entry)
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

**Output**: Published GitHub repository with social preview, release tag, complete README
**Exit Criteria**: Repository public, discoverable, installable

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
license: MIT
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

### Meta-Orchestrator Pattern
The Claude Code session + human user = **BRAIN** (thinks, plans, validates)
Agents = **HANDS** (research, write, validate — the actual work)

### What the orchestrator does:
- **THINK**: Analyze problems, design solutions
- **STRATEGIZE**: Plan batches, define task decomposition
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

### Batch Strategy:
- 3 agents per batch (optimal for Claude Code Agent tool)
- Separated file scopes (NEVER two agents on same file)
- Quality gate after every batch
- Dependency-aware ordering (foundation skills first)

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

---

## Reference Implementations

- **ERPNext** (28 skills): https://github.com/OpenAEC-Foundation/ERPNext_Anthropic_Claude_Development_Skill_Package
- **Blender-Bonsai** (73 skills): https://github.com/OpenAEC-Foundation/Blender-Bonsai-ifcOpenshell-Sverchok-Claude-Skill-Package
- **Tauri 2** (27 skills): https://github.com/OpenAEC-Foundation/Tauri-2-Claude-Skill-Package
