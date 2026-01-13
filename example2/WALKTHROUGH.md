# HSIS Workflow Walkthrough: Task Management Feature

This document explains the complete HSIS (Hierarchical Specialized Intelligence Swarm) workflow using a real example.

---

## Overview: The Three Roles

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR REQUIREMENT                              │
│         "I need a task management feature"                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: PM (Gemini CLI)                                        │
│  Role: Product Manager                                           │
│  Input: Your requirement (.swarm/intake/)                        │
│  Output: PRD with numbered requirements                          │
│  Constraint File: GEMINI.md                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ PM Gate ✓
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: ARCHITECT (Codex CLI)                                  │
│  Role: Software Architect                                        │
│  Input: Approved PRD                                             │
│  Output: Architecture, Implementation Plan, ADRs                 │
│  Constraint File: AGENTS.md                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Architect Gate ✓
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: DEVELOPER (Claude CLI)                                 │
│  Role: Senior Developer                                          │
│  Input: Architecture + Implementation Plan                       │
│  Output: Working code, tests, documentation                      │
│  Constraint File: CLAUDE.md                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Developer Gate ✓
                            ▼
                    ✅ FEATURE COMPLETE!
```

---

## Detailed Step-by-Step Process

### STEP 1: You Write the Requirement

**File**: `.swarm/intake/task-management.md`

This is what YOU write - a simple description of what you need:

```markdown
# Task Management Feature Request

## What We Need
We need a task management system. Users should be able to create 
and track their tasks.

## Requirements
1. Create tasks
2. View tasks
3. Mark complete
4. Delete tasks

## Constraints
- Use our existing Node.js/React stack
- Integrate with existing auth
```

**Key Points**:
- Write in plain language
- Include business context
- List high-level requirements
- Note any constraints
- Don't worry about technical details

---

### STEP 2: Run PM Phase (Gemini CLI)

**Command**:
```bash
cd example2

# Option A: Use orchestrator script
../scripts/swarm-orchestrator.sh pm

# Option B: Run Gemini directly
gemini "Read ../GEMINI.md for your role. Create a PRD based on .swarm/intake/task-management.md. Output to docs/PRD.md"
```

**What PM (Gemini) Does**:
1. Reads your intake requirement
2. Follows GEMINI.md constraints (no architecture decisions!)
3. Creates formal PRD with:
   - Numbered requirements (FR-001, FR-002...)
   - Non-functional requirements (NFR-001...)
   - Acceptance criteria for each
   - Success metrics
   - Release plan

**Output**: `docs/PRD.md`

**PM Gate Checklist** (must pass before next phase):
- [ ] Every requirement has ID (FR-###, NFR-###)
- [ ] Every requirement is testable
- [ ] Acceptance criteria defined
- [ ] No contradictions
- [ ] Open questions tagged

---

### STEP 3: Run Architect Phase (Codex CLI)

**Command**:
```bash
# Option A: Use orchestrator script
../scripts/swarm-orchestrator.sh architect

# Option B: Run Codex directly
codex "Read ../AGENTS.md for your role. Create architecture based on docs/PRD.md. Output ARCHITECTURE.md and IMPLEMENTATION_PLAN.md"
```

**What Architect (Codex) Does**:
1. Reads the approved PRD
2. Follows AGENTS.md constraints (no code implementation!)
3. Creates:
   - **ARCHITECTURE.md**: System design, data models, API contracts
   - **IMPLEMENTATION_PLAN.md**: Task breakdown, dependencies
   - **ADRs**: Documents key technical decisions

**Outputs**:
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `adrs/ADR-001.md` (and more as needed)

**Architect Gate Checklist**:
- [ ] Every FR maps to design element
- [ ] Every NFR maps to design element
- [ ] API contracts complete
- [ ] Tests specified for each requirement
- [ ] Definition of Done clear

---

### STEP 4: Run Developer Phase (Claude CLI)

**Command**:
```bash
# Option A: Use orchestrator script
../scripts/swarm-orchestrator.sh developer

# Option B: Run Claude directly
claude "Read ../CLAUDE.md for your role. Implement based on docs/ARCHITECTURE.md and docs/IMPLEMENTATION_PLAN.md. Start with T-001."
```

**What Developer (Claude) Does**:
1. Reads Architecture and Implementation Plan
2. Follows CLAUDE.md constraints (no changing requirements!)
3. Implements:
   - Database migrations
   - Backend API
   - Frontend components
   - Tests
4. Creates Implementation Report

**Outputs**:
- `src/` - All source code
- `tests/` - All tests
- `docs/IMPLEMENTATION_REPORT.md`
- Updated `README.md` and `CHANGELOG.md`

**Developer Gate Checklist**:
- [ ] All tasks complete
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] No security issues
- [ ] Documentation updated

---

## File Structure Explanation

```
example2/
├── .swarm/                          # HSIS orchestration directory
│   ├── intake/                      # YOUR input goes here
│   │   └── task-management.md       # Your requirement
│   ├── specs/                       # Generated specifications
│   ├── artifacts/                   # Handoff documents
│   │   ├── pm-handoff.md           # PM → Architect
│   │   └── architect-handoff.md    # Architect → Developer
│   ├── status/
│   │   └── workflow.json           # Current workflow state
│   ├── logs/                        # Execution logs
│   └── escalations/                 # Questions between roles
│
├── docs/                            # Generated documentation
│   ├── PRD.md                       # PM output
│   ├── ARCHITECTURE.md              # Architect output
│   └── IMPLEMENTATION_PLAN.md       # Architect output
│
├── adrs/                            # Architecture decisions
│   └── ADR-001.md                   # Architect output
│
├── src/                             # Developer output (code)
└── tests/                           # Developer output (tests)
```

---

## How to Verify Each Phase

### Verify PM Gate
```bash
../scripts/verify-gates.sh pm
```
Checks:
- PRD.md exists
- Has FR-### requirements
- Has NFR-### requirements
- Has acceptance criteria

### Verify Architect Gate
```bash
../scripts/verify-gates.sh architect
```
Checks:
- ARCHITECTURE.md exists
- IMPLEMENTATION_PLAN.md exists
- Requirements mapped to design
- ADRs created

### Verify Developer Gate
```bash
../scripts/verify-gates.sh developer
```
Checks:
- Source code exists
- Tests exist and pass
- Implementation report exists
- Documentation updated

---

## Running the Complete Workflow

### Manual (Recommended for Learning)
```bash
cd example2

# 1. Review your requirement
cat .swarm/intake/task-management.md

# 2. Run PM phase
../scripts/swarm-orchestrator.sh pm
cat docs/PRD.md  # Review output

# 3. Run Architect phase
../scripts/swarm-orchestrator.sh architect
cat docs/ARCHITECTURE.md  # Review output

# 4. Run Developer phase
../scripts/swarm-orchestrator.sh developer
ls src/  # Check code was created
```

### Automated (Full Pipeline)
```bash
cd example2
../scripts/swarm-orchestrator.sh full
```

---

## What Happens If Something Goes Wrong?

### Scenario 1: PM Gate Fails
```
PM Gate FAILED - missing acceptance criteria
```
**Action**: PM must revise PRD before Architect can start

### Scenario 2: Architect Finds Requirement Unclear
**Action**: Architect creates escalation note:
```bash
# .swarm/escalations/ESC-001-unclear-priority.md
Issue: NFR-001 doesn't specify load conditions
Options: 1) Assume 100 users, 2) Ask PM
Recommendation: Option 1
```
Wait for PM response, then continue

### Scenario 3: Developer Can't Implement Design
**Action**: Developer creates escalation to Architect:
```bash
# .swarm/escalations/ESC-002-api-conflict.md
Issue: API contract conflicts with auth middleware
```
Wait for Architect to update architecture

---

## Summary: The Key Rules

### PM (Gemini) - GEMINI.md
- ✅ Define WHAT the system should do
- ✅ Create testable requirements
- ❌ NO architecture decisions
- ❌ NO technology choices

### Architect (Codex) - AGENTS.md
- ✅ Design HOW to build it
- ✅ Create interfaces and contracts
- ❌ NO application code
- ❌ NO changing requirements

### Developer (Claude) - CLAUDE.md
- ✅ Implement the design exactly
- ✅ Write code and tests
- ❌ NO changing architecture
- ❌ NO adding features not in spec

---

## Next Steps

1. **Try it yourself**: Modify `.swarm/intake/task-management.md`
2. **Run the workflow**: Use the orchestrator scripts
3. **Review outputs**: Read each generated document
4. **Verify gates**: Run the gate verification scripts

Happy building! 🚀
