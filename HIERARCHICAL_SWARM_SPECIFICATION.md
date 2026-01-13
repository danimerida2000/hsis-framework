# Hierarchical Specialized Intelligence Swarm
## Configuration & Operational Workflow
### Gemini PM → Codex Architect → Claude Developer

**Document Version:** 1.0.0
**Classification:** Enterprise Workflow Specification
**Last Updated:** 2026-01-13

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Role Definitions & Boundaries](#2-role-definitions--boundaries)
3. [Artifact Specifications](#3-artifact-specifications)
4. [End-to-End Workflow](#4-end-to-end-workflow)
5. [Communication Protocol](#5-communication-protocol)
6. [Repository & File Layout](#6-repository--file-layout)
7. [Runbook](#7-runbook)
8. [Quality Assurance](#8-quality-assurance)
9. [Failure Modes & Recovery](#9-failure-modes--recovery)
10. [Compliance Notes](#10-compliance-notes)
11. [Templates & Examples](#11-templates--examples)

---

## 1. Executive Summary

This document defines a **deterministic, artifact-driven workflow** for converting ambiguous product intent into tested, working code using three specialized CLI agents operating in strict sequence:

| Role | Agent | Primary Function |
|------|-------|------------------|
| **Project & Product Manager (PM)** | Google Gemini CLI 3.0 Pro | Requirements elicitation → PRD |
| **Software Architect** | OpenAI Codex CLI (GPT-5.2-xhigh) | PRD → Technical specification |
| **Senior Software Developer** | Claude Code CLI (Opus 4.5) | Specification → Implementation |

### Core Principles

1. **Artifact-Driven Progression**: No downstream role proceeds without upstream artifact passing its gate
2. **Explicit Contracts**: All I/O is structured, versioned, and machine-checkable
3. **Traceability**: Every requirement maps to design decisions and test cases
4. **Auditability**: All decisions are logged with rationale
5. **Fail-Safe Escalation**: Blockers halt progression and route to decision-maker

---

## 2. Role Definitions & Boundaries

### 2.1 Gemini CLI 3.0 Pro — Project & Product Manager (PM)

#### Purpose
Convert vague goals, market signals, and user input into a high-quality Product Requirements Document (PRD) that is complete, consistent, and testable.

#### Allowed Outputs
- PRD (primary artifact)
- Research Appendix (optional, for market/competitive context)
- Clarification Requests (to human stakeholders)

#### Forbidden Actions
| Action | Reason |
|--------|--------|
| Architecture decisions | Violates separation of concerns |
| Technology/library selection | Architect responsibility |
| Code-level design | Developer responsibility |
| Performance budgets (specific values) | Architect responsibility (PM may specify constraints as NFRs) |
| Database schema design | Architect responsibility |

#### Input Sources
- Human stakeholder requests
- User research data
- Market analysis
- Existing system documentation
- Escalation Notes from Architect

#### Decision Authority
- Requirement prioritization (MoSCoW)
- Scope boundaries (in/out)
- Success criteria definition
- Risk classification (BLOCKER/NON-BLOCKER)
- Release phasing (MVP/V1/V2)

---

### 2.2 Codex CLI (GPT-5.2-xhigh) — Software Architect

#### Purpose
Translate approved PRD into rigorous technical specification and architecture that minimizes technical debt and enables deterministic implementation.

#### Allowed Outputs
- Architecture Specification Document
- Implementation Plan
- Test Strategy Document
- Architecture Decision Records (ADRs)
- Interface Definitions (OpenAPI, Proto, GraphQL schemas)
- Escalation Notes (to PM)

#### Forbidden Actions
| Action | Reason |
|--------|--------|
| Writing application code | Developer responsibility |
| Changing requirements | PM responsibility |
| Making product decisions | PM responsibility |
| Deploying infrastructure | Out of scope for design phase |
| Choosing specific library versions | Implementation detail (may recommend) |

#### Input Sources
- Approved PRD (mandatory)
- Technical constraints documentation
- Existing system architecture
- Escalation Notes from Developer

#### Decision Authority
- System decomposition
- Technology stack selection
- API contract design
- Data modeling
- Security architecture
- Scaling strategy
- Observability requirements

---

### 2.3 Claude Code CLI (Opus 4.5) — Senior Software Developer

#### Purpose
Implement the architecture precisely according to specification, write comprehensive tests, and produce deployable artifacts.

#### Allowed Outputs
- Source code
- Test suites (unit, integration, e2e)
- Build configurations
- Local development setup
- CI/CD pipeline definitions
- Implementation Report
- Escalation Notes (to Architect)

#### Forbidden Actions
| Action | Reason |
|--------|--------|
| Changing requirements | PM responsibility |
| Altering architecture | Architect responsibility |
| Adding unspecified features | Scope creep |
| Skipping specified tests | Quality violation |
| Hardcoding secrets | Security violation |

#### Input Sources
- Approved Architecture Specification (mandatory)
- Approved Implementation Plan (mandatory)
- Test Strategy Document (mandatory)
- Escalation responses from Architect

#### Decision Authority
- Code organization within component boundaries
- Variable/function naming (per conventions)
- Implementation patterns (within architectural constraints)
- Test data design
- Error message wording (within error model)

---

## 3. Artifact Specifications

### 3.1 Product Requirements Document (PRD)

**Owner:** PM (Gemini CLI 3.0 Pro)
**Format:** Markdown
**Location:** `/docs/PRD.md`

#### Required Sections

```markdown
# Product Requirements Document
## [PROJECT_NAME] — Version [X.Y.Z]

### 1. Problem Statement
[Single paragraph: What problem exists? Who has it? Why does it matter?]

### 2. Target Users
| User Persona | Description | Primary Need |
|--------------|-------------|--------------|
| [Persona 1]  | [...]       | [...]        |

### 3. Use Cases (Top 3 Minimum)
#### UC-001: [Title]
- **Actor:** [User persona]
- **Precondition:** [State before]
- **Flow:** [Numbered steps]
- **Postcondition:** [State after]
- **Acceptance Criteria:** [Testable statements]

### 4. Scope
#### 4.1 In-Scope
- [Explicit list]

#### 4.2 Out-of-Scope
- [Explicit list with rationale]

### 5. Functional Requirements
| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | [Testable statement] | Must/Should/Could/Won't | [Measurable criteria] |

### 6. Non-Functional Requirements
| ID | Category | Requirement | Target | Measurement Method |
|----|----------|-------------|--------|-------------------|
| NFR-001 | Performance | [Statement] | [Value] | [How to verify] |
| NFR-002 | Security | [Statement] | [Standard] | [Audit method] |
| NFR-003 | Availability | [Statement] | [SLA] | [Monitoring] |

### 7. Risks, Assumptions, Open Questions

#### 7.1 Risks
| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-001 | [...] | H/M/L | H/M/L | [...] |

#### 7.2 Assumptions
| ID | Assumption | Validation Method |
|----|------------|-------------------|
| A-001 | [...] | [...] |

#### 7.3 Open Questions
| ID | Question | Status | Owner | Due Date |
|----|----------|--------|-------|----------|
| OQ-001 | [...] | BLOCKER/NON-BLOCKER | [Role] | [Date] |

### 8. Success Metrics
| Metric | Baseline | Target | Telemetry Signal |
|--------|----------|--------|------------------|
| [Name] | [Current] | [Goal] | [Event/Log] |

### 9. Release Plan
| Phase | Scope | Success Criteria | Dependencies |
|-------|-------|------------------|--------------|
| MVP | [FR-IDs] | [...] | [...] |
| V1 | [FR-IDs] | [...] | [...] |
| V2 | [FR-IDs] | [...] | [...] |

### 10. Appendices
- [Research data, competitive analysis, etc.]

---
**Document Status:** [DRAFT | REVIEW | APPROVED]
**Approval Date:** [Date]
**Approved By:** [Stakeholder]
```

#### PM Gate Checklist

```markdown
## PM Gate — PRD Approval Checklist

### Completeness
- [ ] Problem statement is specific and measurable
- [ ] At least 3 use cases with full flow definitions
- [ ] All functional requirements have IDs (FR-###)
- [ ] All non-functional requirements have IDs (NFR-###)
- [ ] Every FR has acceptance criteria
- [ ] Every NFR has a measurement method

### Consistency
- [ ] No contradictory requirements
- [ ] Scope boundaries are clear
- [ ] Priorities are assigned (MoSCoW)

### Testability
- [ ] All acceptance criteria are objectively verifiable
- [ ] Success metrics have defined telemetry signals

### Risk Management
- [ ] All BLOCKER open questions have owners and due dates
- [ ] Risks have mitigation strategies

### Gate Result
- [ ] **PASS** — Proceed to Architecture phase
- [ ] **FAIL** — Return to PM for revision

**Failure Reason (if applicable):** [Description]
**Required Revisions:** [List]
```

---

### 3.2 Architecture Specification Document

**Owner:** Architect (Codex CLI GPT-5.2-xhigh)
**Format:** Markdown
**Location:** `/docs/ARCHITECTURE.md`

#### Required Sections

```markdown
# Architecture Specification
## [PROJECT_NAME] — Version [X.Y.Z]

### 1. System Overview
[2-3 paragraphs: High-level description of the system]

### 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        [System Name]                         │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Component  │  Component  │  Component  │    Component     │
│      A      │      B      │      C      │        D         │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       ▼             ▼             ▼               ▼
  [External]    [Database]    [Message]      [External]
   Service                      Queue          Service
```

### 3. Component Responsibilities

| Component | Responsibility | Owns | Depends On |
|-----------|----------------|------|------------|
| [Name] | [Single responsibility] | [Data/Process] | [Components] |

### 4. Requirement Traceability Matrix

| Requirement ID | Design Element | Component | Test Type |
|----------------|----------------|-----------|-----------|
| FR-001 | [API endpoint/Class/Module] | [Component] | Unit/Integration/E2E |
| NFR-001 | [Pattern/Configuration] | [Component] | Performance/Security |

### 5. Data Model

#### 5.1 Entity Definitions
```
Entity: [Name]
├── id: UUID (PK)
├── field_1: Type [constraints]
├── field_2: Type [constraints]
└── timestamps: created_at, updated_at

Relationships:
- [Entity A] 1:N [Entity B] via [foreign_key]
```

#### 5.2 State Machines (if applicable)
```
[Entity] States:
CREATED → PENDING → ACTIVE → COMPLETED
                  ↘ FAILED ↗
```

### 6. API Contracts

#### 6.1 Endpoint Definitions

| Method | Path | Request | Response | Errors |
|--------|------|---------|----------|--------|
| POST | /api/v1/resource | `CreateRequest` | `Resource` | E-001, E-002 |

#### 6.2 Request/Response Schemas
```json
// CreateRequest
{
  "field_1": "string (required, max 255)",
  "field_2": "integer (optional, default: 0)"
}

// Resource (Response)
{
  "id": "uuid",
  "field_1": "string",
  "field_2": "integer",
  "created_at": "ISO8601 timestamp"
}
```

#### 6.3 Error Model
| Code | HTTP Status | Message Template | Retry |
|------|-------------|------------------|-------|
| E-001 | 400 | "Invalid {field}: {reason}" | No |
| E-002 | 409 | "Resource {id} already exists" | No |
| E-003 | 500 | "Internal error: {correlation_id}" | Yes |

### 7. Concurrency & Scaling Strategy

| Component | Scaling Model | Constraints | Bottleneck Mitigation |
|-----------|---------------|-------------|----------------------|
| [Name] | Horizontal/Vertical | [Limits] | [Strategy] |

### 8. Security Model

#### 8.1 Authentication
- Method: [JWT/OAuth2/API Key]
- Token lifetime: [Duration]
- Refresh strategy: [Description]

#### 8.2 Authorization
| Resource | Action | Required Role/Permission |
|----------|--------|--------------------------|
| [Resource] | [CRUD] | [Role] |

#### 8.3 Secrets Management
- Storage: [Vault/ENV/SecretManager]
- Rotation policy: [Frequency]
- Access pattern: [Description]

#### 8.4 Threat Considerations
| Threat | Mitigation | Residual Risk |
|--------|------------|---------------|
| [OWASP category] | [Control] | [Accepted/Monitored] |

### 9. Observability

#### 9.1 Logging
| Event | Level | Required Fields | Retention |
|-------|-------|-----------------|-----------|
| [Event name] | INFO/WARN/ERROR | [field list] | [Duration] |

#### 9.2 Metrics
| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|-----------------|
| [name] | Counter/Gauge/Histogram | [labels] | [condition] |

#### 9.3 Tracing
- Propagation: [W3C TraceContext/B3]
- Sampling: [Rate/Strategy]
- Required spans: [List]

### 10. Performance Budget

| NFR ID | Metric | Target | Measurement Point |
|--------|--------|--------|-------------------|
| NFR-001 | p99 latency | <200ms | API gateway |
| NFR-002 | Throughput | >1000 RPS | Load balancer |

### 11. Migration/Rollout Plan
| Phase | Action | Rollback Trigger | Rollback Steps |
|-------|--------|------------------|----------------|
| 1 | [Description] | [Condition] | [Steps] |

---
**Document Status:** [DRAFT | REVIEW | APPROVED]
**PRD Version:** [X.Y.Z]
**Approval Date:** [Date]
```

---

### 3.3 Implementation Plan

**Owner:** Architect (Codex CLI GPT-5.2-xhigh)
**Format:** Markdown
**Location:** `/docs/IMPLEMENTATION_PLAN.md`

#### Required Sections

```markdown
# Implementation Plan
## [PROJECT_NAME] — Version [X.Y.Z]

### 1. Implementation Sequence

| Order | Component | Dependencies | Deliverables |
|-------|-----------|--------------|--------------|
| 1 | [Component A] | None | [Files/Modules] |
| 2 | [Component B] | Component A | [Files/Modules] |

### 2. Component Specifications

#### 2.1 [Component Name]

**Purpose:** [Single sentence]

**Files to Create:**
- `src/[path]/[file].[ext]` — [Description]

**Interfaces:**
```typescript
interface IComponentName {
  method(param: Type): ReturnType;
}
```

**Implementation Notes:**
- [Constraint 1]
- [Pattern to use]

**Test Requirements:**
- Unit: [Coverage target, specific cases]
- Integration: [Scenarios]

### 3. Dependency Map

```
Component A
    │
    ├──► Component B
    │        │
    │        └──► Component D
    │
    └──► Component C
             │
             └──► Component D (shared)
```

### 4. Definition of Done

#### Per-Component DoD
- [ ] All specified files created
- [ ] All interfaces implemented
- [ ] Unit tests passing (≥[X]% coverage)
- [ ] Integration tests passing
- [ ] No lint/type errors
- [ ] Documentation updated

#### Project DoD
- [ ] All components complete per Component DoD
- [ ] E2E tests passing
- [ ] All FR acceptance criteria verified
- [ ] All NFR targets met
- [ ] Implementation Report complete

### 5. Known Constraints

| Constraint | Impact | Workaround |
|------------|--------|------------|
| [Technical limitation] | [Effect] | [Approach] |
```

---

### 3.4 Architecture Decision Record (ADR)

**Owner:** Architect (Codex CLI GPT-5.2-xhigh)
**Format:** Markdown
**Location:** `/docs/adrs/ADR-###.md`

#### Template

```markdown
# ADR-###: [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-###]
**Date:** [YYYY-MM-DD]
**Deciders:** [Architect, with PM input if product-impacting]

## Context

[What is the issue? Why does it need a decision? Include relevant requirements (FR/NFR IDs).]

## Decision

[What is the change being proposed/adopted?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Tradeoff 1]
- [Tradeoff 2]

### Neutral
- [Side effect]

## Alternatives Considered

### Alternative 1: [Name]
- **Description:** [Brief]
- **Pros:** [List]
- **Cons:** [List]
- **Rejection Reason:** [Why not chosen]

### Alternative 2: [Name]
- **Description:** [Brief]
- **Pros:** [List]
- **Cons:** [List]
- **Rejection Reason:** [Why not chosen]

## References

- [Link to relevant documentation]
- [FR/NFR IDs addressed]
```

---

### 3.5 Implementation Report

**Owner:** Developer (Claude Code CLI Opus 4.5)
**Format:** Markdown
**Location:** `/docs/IMPLEMENTATION_REPORT.md`

#### Template

```markdown
# Implementation Report
## [PROJECT_NAME] — Version [X.Y.Z]

**Implementation Date:** [YYYY-MM-DD]
**Developer Agent:** Claude Code CLI (Opus 4.5)
**Architecture Version:** [X.Y.Z]

### 1. Deliverable Summary

| Deliverable | Status | Location |
|-------------|--------|----------|
| Source code | Complete/Partial | `/src/...` |
| Unit tests | Complete/Partial | `/tests/unit/...` |
| Integration tests | Complete/Partial | `/tests/integration/...` |
| E2E tests | Complete/Partial | `/tests/e2e/...` |

### 2. Requirement Verification Matrix

| Requirement ID | Implementation | Test Evidence | Status |
|----------------|----------------|---------------|--------|
| FR-001 | `src/module/file.ts:L42` | `tests/unit/file.test.ts` | PASS |
| FR-002 | `src/api/handler.ts:L15` | `tests/integration/api.test.ts` | PASS |
| NFR-001 | Configuration + Load test | `tests/perf/latency.test.ts` | PASS |

### 3. Test Results Summary

| Suite | Total | Passed | Failed | Skipped | Coverage |
|-------|-------|--------|--------|---------|----------|
| Unit | [N] | [N] | [N] | [N] | [X]% |
| Integration | [N] | [N] | [N] | [N] | N/A |
| E2E | [N] | [N] | [N] | [N] | N/A |

### 4. Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Unit test coverage | ≥80% | [X]% | PASS/FAIL |
| Lint errors | 0 | [N] | PASS/FAIL |
| Type errors | 0 | [N] | PASS/FAIL |
| Security vulnerabilities | 0 Critical/High | [N] | PASS/FAIL |

### 5. Deviations from Specification

| Item | Specified | Implemented | Justification | Escalated |
|------|-----------|-------------|---------------|-----------|
| [None or list] | | | | Yes/No |

### 6. Known Issues

| ID | Severity | Description | Workaround | Blocking |
|----|----------|-------------|------------|----------|
| [ISS-001] | [H/M/L] | [...] | [...] | Yes/No |

### 7. Run Instructions

```bash
# Install dependencies
[command]

# Run tests
[command]

# Start application
[command]
```

### 8. CI/CD Readiness

- [ ] Build script verified
- [ ] Test commands documented
- [ ] Environment variables documented (without values)
- [ ] Docker/container configuration (if applicable)

---
**Report Status:** [COMPLETE | PARTIAL - reason]
**Gate Recommendation:** [PASS | FAIL - reason]
```

---

### 3.6 Architect Gate Checklist

```markdown
## Architect Gate — Architecture Approval Checklist

### Traceability
- [ ] Every FR from PRD maps to at least one design element
- [ ] Every NFR from PRD maps to at least one design element
- [ ] Every design element maps to at least one test type

### Completeness
- [ ] All API contracts fully specified (no TBD for core flows)
- [ ] Error model complete with all error codes
- [ ] Data model complete with all entities and relationships
- [ ] Security model addresses authentication, authorization, secrets

### Implementability
- [ ] Implementation Plan provides clear sequence
- [ ] Component interfaces are sufficient for implementation
- [ ] Definition of Done is explicit and measurable

### Risk Management
- [ ] All architectural risks have mitigations or explicit deferrals
- [ ] Rollback plan exists for deployment

### ADR Coverage
- [ ] All significant decisions documented as ADRs
- [ ] Alternatives considered and rejection reasons documented

### Gate Result
- [ ] **PASS** — Proceed to Implementation phase
- [ ] **FAIL** — Return to Architect for revision or escalate to PM

**Failure Reason (if applicable):** [Description]
**Required Revisions:** [List]
```

---

### 3.7 Developer Gate Checklist

```markdown
## Developer Gate — Implementation Approval Checklist

### Functional Completeness
- [ ] All components from Implementation Plan delivered
- [ ] All interfaces implemented as specified
- [ ] All FR acceptance criteria demonstrably satisfied

### Test Coverage
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Coverage meets specified targets

### Code Quality
- [ ] Zero lint errors
- [ ] Zero type errors (if applicable)
- [ ] No hardcoded secrets
- [ ] No security vulnerabilities (Critical/High)

### Documentation
- [ ] Implementation Report complete
- [ ] Run instructions verified
- [ ] CI commands documented

### NFR Verification
- [ ] Performance targets met (with evidence)
- [ ] Security requirements verified

### Gate Result
- [ ] **PASS** — Proceed to Release Readiness Review
- [ ] **FAIL** — Return to Developer for fixes or escalate to Architect

**Failure Reason (if applicable):** [Description]
**Required Fixes:** [List]
```

---

## 4. End-to-End Workflow

### 4.1 Workflow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          WORKFLOW OVERVIEW                                │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ INTAKE  │────────►│   PM    │────────►│ARCHITECT│────────►│DEVELOPER│
    │         │         │  PHASE  │         │  PHASE  │         │  PHASE  │
    └─────────┘         └────┬────┘         └────┬────┘         └────┬────┘
                             │                   │                   │
                             ▼                   ▼                   ▼
                        ┌─────────┐         ┌─────────┐         ┌─────────┐
                        │ PM GATE │         │ARCH GATE│         │ DEV GATE│
                        └────┬────┘         └────┬────┘         └────┬────┘
                             │                   │                   │
                    ┌────────┴────────┐ ┌────────┴────────┐ ┌────────┴────────┐
                    │                 │ │                 │ │                 │
                    ▼                 ▼ ▼                 ▼ ▼                 ▼
                  PASS              FAIL               PASS              FAIL
                    │                 │                 │                 │
                    ▼                 │                 ▼                 │
              [Next Phase]◄───────────┘           [Next Phase]◄───────────┘
                                Revise                            Revise/
                                                                 Escalate

                                        │
                                        ▼
                               ┌─────────────────┐
                               │    RELEASE      │
                               │   READINESS     │
                               │    REVIEW       │
                               └────────┬────────┘
                                        │
                                        ▼
                                   [COMPLETE]
```

### 4.2 Phase Definitions

#### PHASE 0: Intake

**Trigger:** Human stakeholder submits request
**Owner:** Human (with PM assistance)
**Duration:** Variable

**Actions:**
1. Stakeholder provides initial request (freeform)
2. PM (Gemini) conducts clarifying dialogue
3. PM produces initial requirements outline
4. Stakeholder validates understanding

**Exit Criteria:**
- Stakeholder confirms PM understands intent
- No BLOCKER questions remain unanswered

---

#### PHASE 1: PM Phase — Requirements Definition

**Trigger:** Intake complete
**Owner:** PM (Gemini CLI 3.0 Pro)

**Step 1.1: Research & Analysis**
```
PM Action: Analyze request, conduct research if needed
Output: Research notes (internal)
```

**Step 1.2: PRD Drafting**
```
PM Action: Draft PRD per specification
Output: /docs/PRD.md (DRAFT status)
```

**Step 1.3: Self-Review**
```
PM Action: Verify PRD against PM Gate Checklist
Output: Annotated checklist with findings
```

**Step 1.4: Revision (if needed)**
```
PM Action: Address self-identified gaps
Output: Updated /docs/PRD.md
```

**Step 1.5: Gate Submission**
```
PM Action: Submit PRD for PM Gate
Output: PRD with status = REVIEW
```

---

#### GATE 1: PM Gate

**Evaluator:** Automated checklist + Human stakeholder (optional)

**Pass Criteria:**
- [ ] All PM Gate Checklist items satisfied
- [ ] No unresolved BLOCKER items
- [ ] Stakeholder approval (if required)

**On PASS:**
```
Action: Update PRD status to APPROVED
Action: Generate Handoff Document to Architect
Next: PHASE 2
```

**On FAIL:**
```
Action: Document failure reasons
Action: Return to PM with required revisions
Next: PHASE 1 (Step 1.4)
```

---

#### PHASE 2: Architect Phase — Technical Design

**Trigger:** PM Gate PASS
**Owner:** Architect (Codex CLI GPT-5.2-xhigh)
**Input:** Approved PRD

**Step 2.1: PRD Analysis**
```
Architect Action: Deep analysis of all requirements
Output: Requirement analysis notes (internal)
```

**Step 2.2: Architecture Design**
```
Architect Action: Design system architecture
Output: /docs/ARCHITECTURE.md (DRAFT)
```

**Step 2.3: ADR Creation**
```
Architect Action: Document significant decisions
Output: /docs/adrs/ADR-001.md, ADR-002.md, ...
```

**Step 2.4: Implementation Planning**
```
Architect Action: Create implementation sequence
Output: /docs/IMPLEMENTATION_PLAN.md
```

**Step 2.5: Test Strategy**
```
Architect Action: Define test approach
Output: Test Strategy section in ARCHITECTURE.md
```

**Step 2.6: Self-Review**
```
Architect Action: Verify against Architect Gate Checklist
Output: Annotated checklist with findings
```

**Step 2.7: Revision/Escalation (if needed)**
```
If self-identified gap is resolvable:
  Architect Action: Revise documents
  Output: Updated documents

If gap requires PM clarification:
  Architect Action: Create Escalation Note
  Output: Escalation Note to PM
  Next: Wait for PM response, then resume Step 2.7
```

**Step 2.8: Gate Submission**
```
Architect Action: Submit for Architect Gate
Output: All documents with status = REVIEW
```

---

#### GATE 2: Architect Gate

**Evaluator:** Automated checklist + Architect self-certification

**Pass Criteria:**
- [ ] All Architect Gate Checklist items satisfied
- [ ] All PRD requirements traced to design
- [ ] No unresolved BLOCKER escalations

**On PASS:**
```
Action: Update document statuses to APPROVED
Action: Generate Handoff Document to Developer
Next: PHASE 3
```

**On FAIL:**
```
If architectural issue:
  Action: Return to Architect (Step 2.7)

If requirements issue:
  Action: Escalate to PM
  Next: PHASE 1 (revision cycle)
```

---

#### PHASE 3: Developer Phase — Implementation

**Trigger:** Architect Gate PASS
**Owner:** Developer (Claude Code CLI Opus 4.5)
**Input:** Approved Architecture Spec + Implementation Plan

**Step 3.1: Repository Setup**
```
Developer Action: Create directory structure per layout
Output: Scaffolded repository
```

**Step 3.2: Component Implementation**
```
For each component in Implementation Plan order:
  Developer Action: Implement component
  Developer Action: Write unit tests
  Developer Action: Verify component DoD
  Output: Component code + tests
```

**Step 3.3: Integration Implementation**
```
Developer Action: Implement integrations between components
Developer Action: Write integration tests
Output: Integration code + tests
```

**Step 3.4: E2E Test Implementation**
```
Developer Action: Implement end-to-end tests
Output: E2E test suite
```

**Step 3.5: Quality Verification**
```
Developer Action: Run all tests
Developer Action: Run linter
Developer Action: Run type checker
Developer Action: Run security scanner
Output: Quality reports
```

**Step 3.6: Implementation Report**
```
Developer Action: Complete Implementation Report
Output: /docs/IMPLEMENTATION_REPORT.md
```

**Step 3.7: Escalation (if needed)**
```
If specification unclear or incorrect:
  Developer Action: Create Escalation Note
  Output: Escalation Note to Architect
  Next: Wait for Architect response, then resume
```

**Step 3.8: Gate Submission**
```
Developer Action: Submit for Developer Gate
Output: Complete codebase + Implementation Report
```

---

#### GATE 3: Developer Gate

**Evaluator:** Automated checks + Developer self-certification

**Pass Criteria:**
- [ ] All Developer Gate Checklist items satisfied
- [ ] All tests passing
- [ ] All quality metrics met
- [ ] Implementation Report complete

**On PASS:**
```
Action: Mark implementation complete
Next: PHASE 4
```

**On FAIL:**
```
If code/test issue:
  Action: Return to Developer (Step 3.2-3.5)

If specification issue:
  Action: Escalate to Architect
  Next: PHASE 2 (revision cycle)
```

---

#### PHASE 4: Release Readiness Review

**Trigger:** Developer Gate PASS
**Owner:** All roles + Human stakeholder

**Actions:**
1. Review Implementation Report
2. Verify requirement traceability
3. Confirm all gates passed
4. Execute final acceptance tests
5. Sign off on release

**Exit Criteria:**
- All stakeholders approve
- No blocking issues
- Deployment plan confirmed

---

## 5. Communication Protocol

### 5.1 Handoff Document Format

All inter-role handoffs MUST use this exact structure:

```markdown
# Handoff: [Source Role] → [Target Role]
## [PROJECT_NAME] — [Date]

### 1. Summary
[2-3 sentences: What was done, what is being handed off, what is expected next]

### 2. Artifacts Provided

| Artifact | Path | Version | Status |
|----------|------|---------|--------|
| [Name] | [/path/to/file] | [X.Y.Z] | [APPROVED/REVIEW] |

### 3. Acceptance Checklist

The following items have been verified:

- [x] [Completed item 1]
- [x] [Completed item 2]
- [ ] [Item for next role to verify]

### 4. Open Questions

| ID | Question | Status | Owner | Impact |
|----|----------|--------|-------|--------|
| OQ-001 | [Question text] | BLOCKER/NON-BLOCKER | [Role] | [Description] |

### 5. Next Role Instructions

[Single paragraph with explicit, unambiguous instructions for what the receiving role should do. Include specific artifact paths to consume and expected outputs.]

---
**Handoff Issued By:** [Role]
**Handoff Date:** [YYYY-MM-DD HH:MM UTC]
**Handoff ID:** [UUID or sequential ID for traceability]
```

### 5.2 Escalation Note Format

```markdown
# Escalation Note
## From: [Source Role] → To: [Target Role]
## [Date] — Priority: [BLOCKER/HIGH/MEDIUM]

### 1. Issue Statement
[Single sentence describing the blocking issue]

### 2. Evidence

**Requirement Reference(s):**
- [FR-### / NFR-### / Section reference]

**Document Reference(s):**
- [File path and line/section]

**Observation:**
[Specific quote or description of the conflicting/unclear content]

### 3. Options

#### Option A: [Name]
- **Description:** [Brief]
- **Pros:** [List]
- **Cons:** [List]
- **Effort Impact:** [Low/Medium/High]

#### Option B: [Name]
- **Description:** [Brief]
- **Pros:** [List]
- **Cons:** [List]
- **Effort Impact:** [Low/Medium/High]

#### Option C: [Name] (if applicable)
- **Description:** [Brief]
- **Pros:** [List]
- **Cons:** [List]
- **Effort Impact:** [Low/Medium/High]

### 4. Recommendation
[Single sentence: Which option is recommended and why]

### 5. Required Decision-Maker
[PM | Architect | Human Stakeholder]

### 6. Response Deadline
[Date/Time if BLOCKER, otherwise "At convenience"]

---
**Escalation ID:** [ESC-###]
**Created:** [Timestamp]
**Status:** [OPEN | RESOLVED | SUPERSEDED]
```

### 5.3 Escalation Routing Rules

| Issue Type | Source | Route To | Response SLA |
|------------|--------|----------|--------------|
| Unclear requirement | Architect | PM | BLOCKER: 24h |
| Contradictory requirements | Architect | PM | BLOCKER: 24h |
| Missing requirement | Architect | PM | Severity-based |
| Specification unclear | Developer | Architect | BLOCKER: 12h |
| Specification incorrect | Developer | Architect | BLOCKER: 12h |
| Architecture infeasible | Developer | Architect | BLOCKER: 24h |
| Security concern | Any | PM + Architect | BLOCKER: 4h |
| Resource constraint | Any | Human Stakeholder | BLOCKER: 24h |

### 5.4 Response Format

```markdown
# Escalation Response
## Re: [ESC-###]
## From: [Responding Role]

### Decision
[Clear statement of the decision made]

### Rationale
[Brief explanation]

### Required Actions
1. [Action for source role]
2. [Action for other roles, if any]

### Document Updates Required
- [ ] [Document path]: [Change description]

---
**Response Date:** [Timestamp]
**Status:** RESOLVED
```

---

## 6. Repository & File Layout

### 6.1 Canonical Structure

```
project-root/
│
├── docs/
│   ├── PRD.md                      # Product Requirements Document
│   ├── ARCHITECTURE.md             # Architecture Specification
│   ├── IMPLEMENTATION_PLAN.md      # Implementation sequencing
│   ├── IMPLEMENTATION_REPORT.md    # Final delivery report
│   ├── RUNBOOK.md                  # Operational runbook
│   ├── HANDOFFS/                   # Handoff documents
│   │   ├── HANDOFF-PM-ARCH-001.md
│   │   └── HANDOFF-ARCH-DEV-001.md
│   ├── ESCALATIONS/                # Escalation notes and responses
│   │   ├── ESC-001.md
│   │   └── ESC-001-RESPONSE.md
│   └── adrs/                       # Architecture Decision Records
│       ├── ADR-001.md
│       ├── ADR-002.md
│       └── template.md
│
├── src/                            # Source code
│   ├── components/                 # Feature components
│   │   ├── component-a/
│   │   └── component-b/
│   ├── shared/                     # Shared utilities
│   ├── config/                     # Configuration
│   └── index.[ext]                 # Entry point
│
├── tests/
│   ├── unit/                       # Unit tests
│   │   └── [mirrors src structure]
│   ├── integration/                # Integration tests
│   └── e2e/                        # End-to-end tests
│
├── scripts/                        # Build/utility scripts
│   ├── build.sh
│   ├── test.sh
│   └── lint.sh
│
├── .github/                        # CI/CD configuration
│   └── workflows/
│       └── ci.yml
│
├── README.md                       # Project overview
├── CHANGELOG.md                    # Version history
├── .env.example                    # Environment template (NO secrets)
└── .gitignore
```

### 6.2 File Naming Conventions

| Category | Convention | Example |
|----------|------------|---------|
| Documentation | UPPERCASE.md | PRD.md, ARCHITECTURE.md |
| ADRs | ADR-###.md | ADR-001.md |
| Handoffs | HANDOFF-[FROM]-[TO]-###.md | HANDOFF-PM-ARCH-001.md |
| Escalations | ESC-###.md | ESC-001.md |
| Source files | kebab-case or camelCase per language | user-service.ts |
| Test files | [source].test.[ext] or [source]_test.[ext] | user-service.test.ts |
| Config files | lowercase, standard names | config.json, .env |

### 6.3 Version Control Rules

1. **Branching Strategy:**
   - `main` — production-ready code only
   - `develop` — integration branch
   - `feature/[description]` — feature work
   - `fix/[description]` — bug fixes

2. **Commit Message Format:**
   ```
   [TYPE]: Brief description (50 chars max)

   Detailed explanation if needed.

   Refs: FR-001, FR-002
   ```

   Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

3. **Documentation Commits:**
   - PRD changes: `docs(prd): [description]`
   - Architecture changes: `docs(arch): [description]`
   - ADRs: `docs(adr): Add ADR-### [title]`

---

## 7. Runbook

### 7.1 Environment Setup

```bash
# Prerequisites
# - Gemini CLI 3.0 Pro installed and authenticated
# - OpenAI Codex CLI (GPT-5.2-xhigh) installed and authenticated
# - Claude Code CLI (Opus 4.5) installed and authenticated
# - Git installed
# - Project-specific toolchain installed

# Verify installations
gemini --version      # Expected: 3.0.x
codex --version       # Expected: Compatible with GPT-5.2-xhigh
claude --version      # Expected: Compatible with Opus 4.5

# Initialize project repository
mkdir project-name && cd project-name
git init

# Create directory structure
mkdir -p docs/{adrs,HANDOFFS,ESCALATIONS}
mkdir -p src/{components,shared,config}
mkdir -p tests/{unit,integration,e2e}
mkdir -p scripts
mkdir -p .github/workflows
```

### 7.2 Phase Execution Commands

#### Phase 1: PM Execution

```bash
# Start PM session
gemini chat --context "You are the Product Manager for [PROJECT].
Your role is to produce a PRD following the specification in /docs/templates/PRD-TEMPLATE.md.
Input: [Paste or reference initial request]
Output: Write to /docs/PRD.md"

# Validate PRD structure
gemini validate --schema prd-schema.json --file docs/PRD.md

# Expected output on success:
# ✓ PRD structure valid
# ✓ All required sections present
# ✓ Requirement IDs formatted correctly

# Self-review command
gemini review --checklist pm-gate-checklist.md --file docs/PRD.md

# Generate handoff
gemini handoff --to architect --artifacts docs/PRD.md
# Output: docs/HANDOFFS/HANDOFF-PM-ARCH-001.md
```

#### Phase 2: Architect Execution

```bash
# Start Architect session
codex chat --context "You are the Software Architect.
Input: docs/PRD.md (APPROVED)
Output:
  - docs/ARCHITECTURE.md
  - docs/IMPLEMENTATION_PLAN.md
  - docs/adrs/ADR-*.md
Follow the specification templates exactly."

# Validate architecture traceability
codex trace --prd docs/PRD.md --arch docs/ARCHITECTURE.md

# Expected output:
# Traceability Report:
# FR-001 → [component, test type] ✓
# FR-002 → [component, test type] ✓
# NFR-001 → [design element, test type] ✓
# ...
# Coverage: 100%

# Self-review command
codex review --checklist architect-gate-checklist.md

# Generate handoff
codex handoff --to developer --artifacts docs/ARCHITECTURE.md,docs/IMPLEMENTATION_PLAN.md
# Output: docs/HANDOFFS/HANDOFF-ARCH-DEV-001.md
```

#### Phase 3: Developer Execution

```bash
# Start Developer session
claude chat --context "You are the Senior Developer.
Inputs:
  - docs/ARCHITECTURE.md (APPROVED)
  - docs/IMPLEMENTATION_PLAN.md (APPROVED)
Execute implementation following the plan exactly.
Run tests and quality checks."

# Implementation commands (executed by Claude)
# [Language-specific commands as per Implementation Plan]

# Example for Node.js/TypeScript project:
npm install
npm run build
npm run lint
npm run test:unit
npm run test:integration
npm run test:e2e

# Verify quality metrics
npm run coverage
# Expected: Coverage report showing ≥80% (or target)

npm audit
# Expected: 0 critical/high vulnerabilities

# Generate Implementation Report
claude report --template implementation-report.md --output docs/IMPLEMENTATION_REPORT.md

# Verify developer gate
claude review --checklist developer-gate-checklist.md
```

### 7.3 Escalation Commands

```bash
# Create escalation (any role)
[agent] escalate --from [role] --to [target-role] \
  --issue "Brief issue description" \
  --refs "FR-001,ARCHITECTURE.md:Section3" \
  --priority BLOCKER

# Output: docs/ESCALATIONS/ESC-###.md

# Respond to escalation
[agent] escalate-respond --id ESC-### \
  --decision "Decision statement" \
  --actions "Action 1; Action 2"

# Output: docs/ESCALATIONS/ESC-###-RESPONSE.md
```

### 7.4 Gate Verification Commands

```bash
# PM Gate
gemini gate --phase pm --checklist pm-gate-checklist.md
# Output: PASS or FAIL with reasons

# Architect Gate
codex gate --phase architect --checklist architect-gate-checklist.md
# Output: PASS or FAIL with reasons

# Developer Gate
claude gate --phase developer --checklist developer-gate-checklist.md
# Output: PASS or FAIL with reasons
```

### 7.5 Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| PM generates architecture decisions | Prompt contamination | Re-initialize PM with strict role constraints |
| Architect cannot trace all requirements | PRD incomplete | Escalate to PM with specific missing items |
| Tests fail on implementation | Spec mismatch or bug | Debug; if spec issue, escalate to Architect |
| Gate validation fails | Checklist items incomplete | Review specific failures, address each |
| Escalation not routed | Incorrect escalation format | Verify format matches template |
| Agent produces off-spec output | Context window overflow | Split session, re-inject constraints |

### 7.6 Recovery Procedures

#### Stalled PM Phase
```bash
# Reset PM context
gemini reset --preserve-artifacts

# Resume with explicit state
gemini resume --phase pm --step 1.4 \
  --context "Resume PRD revision. Address: [specific issues]"
```

#### Stalled Architect Phase
```bash
# Check for pending escalations
ls docs/ESCALATIONS/ESC-*

# If pending, ensure response exists
cat docs/ESCALATIONS/ESC-###-RESPONSE.md

# Resume
codex resume --phase architect --step 2.7 \
  --context "Continue with escalation resolution"
```

#### Stalled Developer Phase
```bash
# Verify test state
npm run test 2>&1 | tee test-output.log

# If specification issue, escalate
claude escalate --from developer --to architect \
  --issue "Spec unclear for [component]" \
  --refs "[specific section]"
```

---

## 8. Quality Assurance

### 8.1 Test Strategy

#### Test Pyramid

```
          ┌─────────┐
          │  E2E    │  ← Few, critical user journeys
          │ (5-10%) │
         ─┴─────────┴─
        ┌─────────────┐
        │ Integration │  ← Component interactions
        │  (15-25%)   │
       ─┴─────────────┴─
      ┌─────────────────┐
      │      Unit       │  ← All logic, edge cases
      │   (65-80%)      │
      └─────────────────┘
```

#### Test Categories

| Category | Scope | Responsibility | Coverage Target |
|----------|-------|----------------|-----------------|
| Unit | Single function/class | Developer | ≥80% line coverage |
| Integration | Component interfaces | Developer | All API contracts |
| E2E | User journeys | Developer | All use cases |
| Performance | NFR validation | Developer | All NFR-perf items |
| Security | Vulnerability scan | Developer + Tooling | 0 Critical/High |

### 8.2 Coverage Requirements

| Metric | Minimum | Target | Blocking |
|--------|---------|--------|----------|
| Line coverage | 70% | 80% | Yes if <70% |
| Branch coverage | 60% | 75% | No |
| Function coverage | 80% | 90% | Yes if <80% |
| E2E scenario coverage | 100% of use cases | 100% | Yes |

### 8.3 CI Pipeline Expectations

```yaml
# .github/workflows/ci.yml structure
name: CI Pipeline

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: npm run lint
        # Must pass: 0 errors

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Type Check
        run: npm run type-check
        # Must pass: 0 errors

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Unit Tests
        run: npm run test:unit -- --coverage
      - name: Check Coverage
        run: npm run coverage:check
        # Must pass: ≥70% line coverage

  integration-tests:
    runs-on: ubuntu-latest
    needs: [lint, type-check, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - name: Integration Tests
        run: npm run test:integration

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Audit
        run: npm audit --audit-level=high
        # Must pass: 0 high/critical

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [integration-tests]
    steps:
      - uses: actions/checkout@v4
      - name: E2E Tests
        run: npm run test:e2e
```

### 8.4 Definition of Done (Master)

#### Requirement Level
- [ ] Requirement has unique ID
- [ ] Requirement is testable
- [ ] Acceptance criteria defined
- [ ] Requirement traced to design element
- [ ] Requirement traced to test case

#### Design Level
- [ ] Component responsibility defined
- [ ] Interfaces specified
- [ ] Error model complete
- [ ] ADR exists for significant decisions
- [ ] Security considerations documented

#### Implementation Level
- [ ] Code complete per specification
- [ ] Unit tests passing (≥80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing for use cases
- [ ] Zero lint errors
- [ ] Zero type errors
- [ ] Zero critical/high vulnerabilities
- [ ] Documentation updated
- [ ] Peer review complete (if applicable)

#### Release Level
- [ ] All gates passed
- [ ] Implementation Report complete
- [ ] Stakeholder sign-off obtained
- [ ] Deployment plan verified
- [ ] Rollback procedure documented

---

## 9. Failure Modes & Recovery

### 9.1 Failure Mode Catalog

| ID | Failure Mode | Phase | Symptoms | Impact | Recovery |
|----|--------------|-------|----------|--------|----------|
| FM-01 | Incomplete PRD | PM | Architect escalates missing requirements | Blocked | PM revision cycle |
| FM-02 | Contradictory requirements | PM/Arch | Architect detects conflicts | Blocked | PM clarification |
| FM-03 | Unimplementable architecture | Arch/Dev | Developer cannot implement | Blocked | Architect revision or PM escalation |
| FM-04 | Specification ambiguity | Dev | Developer makes assumptions | Risk of defects | Escalation to Architect |
| FM-05 | Test failures | Dev | Tests fail, unclear cause | Delayed | Debug → Fix or Escalate |
| FM-06 | Scope creep | Any | Unspecified features requested | Risk | PM re-scoping |
| FM-07 | Context overflow | Any | Agent produces garbled/incomplete output | Data loss | Session reset with state save |
| FM-08 | Circular escalation | Any | Escalation loops without resolution | Blocked | Human intervention |
| FM-09 | Security violation | Dev | Hardcoded secrets, vulnerabilities | Release blocked | Immediate fix |
| FM-10 | Gate deadlock | Any | Gate fails repeatedly | Blocked | Root cause analysis + intervention |

### 9.2 Recovery Procedures

#### FM-01/FM-02: PRD Issues

```
1. Architect produces Escalation Note (ESC-###)
2. PM receives escalation
3. PM clarifies/revises PRD
4. PM issues updated PRD with change log
5. Architect resumes from Step 2.1
```

#### FM-03/FM-04: Architecture Issues

```
If resolvable by Architect:
  1. Architect revises specification
  2. Issue ADR for decision change
  3. Update Implementation Plan
  4. Developer resumes

If requires PM input:
  1. Architect produces Escalation Note
  2. PM provides decision
  3. Architect updates specification
  4. Developer resumes
```

#### FM-05: Test Failures

```
1. Analyze failure: code bug vs. spec issue
2. If code bug:
   - Developer fixes code
   - Re-run tests
3. If spec issue:
   - Create Escalation Note to Architect
   - Await resolution
   - Implement fix
```

#### FM-07: Context Overflow

```
1. Save current session state to file
2. Reset agent session
3. Reload with:
   - Role constraints
   - Approved upstream artifacts
   - Current phase/step
   - Saved session state summary
4. Resume from last checkpoint
```

#### FM-08: Circular Escalation

```
1. Detect: Same issue escalated ≥2 times without resolution
2. Halt automated workflow
3. Compile escalation history
4. Route to Human Stakeholder for decision
5. Human provides binding decision
6. Document in ADR
7. Resume workflow
```

### 9.3 Deadlock Prevention

**Maximum Iteration Limits:**
| Phase | Max Revision Cycles | Action on Exceed |
|-------|---------------------|------------------|
| PM | 3 | Human escalation |
| Architect | 3 | Human escalation |
| Developer | 5 | Human escalation |

**Escalation Timeout:**
- BLOCKER escalations unresolved after 48h → Auto-escalate to Human

---

## 10. Compliance Notes

### 10.1 Logging Requirements

#### What to Log

| Event | Required Fields | Retention |
|-------|-----------------|-----------|
| Phase start | timestamp, phase, role, input_artifacts | 90 days |
| Phase end | timestamp, phase, role, output_artifacts, status | 90 days |
| Gate evaluation | timestamp, gate, checklist_results, pass_fail | 1 year |
| Escalation created | timestamp, escalation_id, from, to, priority | 1 year |
| Escalation resolved | timestamp, escalation_id, resolution, decision_maker | 1 year |
| Artifact created | timestamp, artifact_path, version, creator_role | 1 year |
| Artifact modified | timestamp, artifact_path, version, modifier_role, change_summary | 1 year |

#### What NOT to Log

- Secrets (API keys, passwords, tokens)
- PII unless explicitly required and consented
- Raw agent conversation logs (summarize instead)
- Internal agent reasoning traces

### 10.2 Secret Management

#### Redaction Rules

```
# Patterns to redact in all logs and documents:
- API keys: [A-Za-z0-9]{32,}
- Passwords: password\s*[:=]\s*\S+
- Tokens: (bearer|token|auth)\s*[:=]\s*\S+
- Connection strings: (mongodb|postgres|mysql|redis):\/\/[^\s]+
- AWS keys: AKIA[0-9A-Z]{16}
- Private keys: -----BEGIN.*PRIVATE KEY-----

# Replacement: [REDACTED:type]
```

#### Secure Configuration Pattern

```
# Environment variables (never in code or docs):
DATABASE_URL=           # Set in environment
API_SECRET_KEY=         # Set in environment
THIRD_PARTY_TOKEN=      # Set in environment

# .env.example (template only, no real values):
DATABASE_URL=postgresql://user:password@host:5432/db
API_SECRET_KEY=your-secret-key-here
THIRD_PARTY_TOKEN=your-token-here

# Runtime loading:
- Use dotenv or equivalent for local development
- Use secret manager (Vault, AWS Secrets Manager) for production
- Never log environment variables
```

### 10.3 Audit Trail

#### Traceability Matrix

Every release must include:

```markdown
# Traceability Matrix — [Release Version]

| Requirement | Design Element | Implementation | Test | Evidence |
|-------------|----------------|----------------|------|----------|
| FR-001 | ARCH:Section3.2 | src/module.ts:L42 | tests/unit/module.test.ts | Pass [link] |
```

#### Change Log

```markdown
# CHANGELOG.md

## [Version] — YYYY-MM-DD

### Added
- FR-001: [Description] (Commit: abc123)

### Changed
- FR-002: [Description] (Commit: def456, ADR-003)

### Fixed
- Bug: [Description] (Commit: ghi789)

### Security
- [Description] (Commit: jkl012)
```

### 10.4 Data Handling

| Data Type | Handling Rule | Storage | Access |
|-----------|---------------|---------|--------|
| PRD content | Internal only | Repository | Team |
| Architecture specs | Internal only | Repository | Team |
| Source code | Version controlled | Repository | Team |
| Test data | Synthetic/anonymized | Repository | Team |
| User data | Never in artifacts | N/A | N/A |
| Credentials | Environment/Vault only | Secure store | Minimal |

---

## 11. Templates & Examples

### 11.1 Example Requirement IDs

```markdown
# Functional Requirements
FR-001: User can create an account with email and password
FR-002: User can log in with valid credentials
FR-003: System sends password reset email within 30 seconds
FR-004: User can update profile information
FR-005: Admin can view all user accounts

# Non-Functional Requirements
NFR-001: API response time < 200ms at p99 for read operations
NFR-002: System availability ≥ 99.9% monthly
NFR-003: All data in transit encrypted via TLS 1.3
NFR-004: Password stored using bcrypt with cost factor ≥ 12
NFR-005: System supports 10,000 concurrent users
```

### 11.2 Example ADR

```markdown
# ADR-001: Use PostgreSQL for Primary Data Store

**Status:** Accepted
**Date:** 2026-01-13
**Deciders:** Architect

## Context

The system requires persistent storage for user data, transactions, and audit logs.
Requirements FR-001 through FR-010 require ACID transactions. NFR-002 requires 99.9%
availability. NFR-005 requires support for 10,000 concurrent users.

## Decision

Use PostgreSQL 16 as the primary relational database with the following configuration:
- Primary-replica setup for availability
- Connection pooling via PgBouncer
- Row-level security for multi-tenancy

## Consequences

### Positive
- Strong ACID guarantees satisfy FR transaction requirements
- Mature ecosystem with extensive tooling
- Native JSON support for flexible schemas where needed
- Proven scalability to required user counts

### Negative
- Operational complexity for replica management
- Requires connection pooling to handle concurrent connections
- Schema migrations require careful planning

### Neutral
- Team has existing PostgreSQL expertise

## Alternatives Considered

### Alternative 1: MySQL 8
- **Description:** MySQL with InnoDB
- **Pros:** Widely used, good performance
- **Cons:** JSON support less mature than PostgreSQL
- **Rejection Reason:** PostgreSQL JSON features needed for FR-007

### Alternative 2: MongoDB
- **Description:** Document database
- **Pros:** Flexible schema, horizontal scaling
- **Cons:** Weaker transaction support (improved but not equal)
- **Rejection Reason:** ACID requirements for FR-001 to FR-010 critical

## References

- FR-001 through FR-010 (transaction requirements)
- NFR-002 (availability)
- NFR-005 (concurrency)
```

### 11.3 Example Error Model

```markdown
# Error Code Reference

## Format
Errors follow the pattern: `E-[CATEGORY]-[NUMBER]`

Categories:
- VAL: Validation errors (client error)
- AUTH: Authentication/Authorization errors
- RES: Resource errors (not found, conflict)
- SYS: System errors (server error)

## Error Definitions

| Code | HTTP Status | Message Template | Retry | User Action |
|------|-------------|------------------|-------|-------------|
| E-VAL-001 | 400 | "Field '{field}' is required" | No | Fix input |
| E-VAL-002 | 400 | "Field '{field}' must be {constraint}" | No | Fix input |
| E-VAL-003 | 400 | "Invalid format for '{field}': {reason}" | No | Fix input |
| E-AUTH-001 | 401 | "Authentication required" | No | Log in |
| E-AUTH-002 | 401 | "Invalid credentials" | No | Check credentials |
| E-AUTH-003 | 403 | "Insufficient permissions for {action}" | No | Contact admin |
| E-RES-001 | 404 | "Resource '{type}' with id '{id}' not found" | No | Check ID |
| E-RES-002 | 409 | "Resource '{type}' already exists" | No | Use existing |
| E-RES-003 | 409 | "Resource '{type}' state conflict: {reason}" | Maybe | Refresh and retry |
| E-SYS-001 | 500 | "Internal error (ref: {correlation_id})" | Yes | Report with ID |
| E-SYS-002 | 503 | "Service temporarily unavailable" | Yes | Wait and retry |

## Error Response Format

```json
{
  "error": {
    "code": "E-VAL-001",
    "message": "Field 'email' is required",
    "details": {
      "field": "email",
      "constraint": "required"
    },
    "correlation_id": "abc-123-def",
    "timestamp": "2026-01-13T10:30:00Z"
  }
}
```

## Retry Policy

| Error Category | Retry | Backoff | Max Attempts |
|----------------|-------|---------|--------------|
| E-VAL-* | No | N/A | N/A |
| E-AUTH-* | No | N/A | N/A |
| E-RES-001, E-RES-002 | No | N/A | N/A |
| E-RES-003 | Conditional | 1s, 2s, 4s | 3 |
| E-SYS-001 | Yes | 1s, 2s, 4s, 8s | 4 |
| E-SYS-002 | Yes | 5s, 10s, 30s | 5 |
```

### 11.4 Complete Implementation Report Example

```markdown
# Implementation Report
## TaskManager API — Version 1.0.0

**Implementation Date:** 2026-01-13
**Developer Agent:** Claude Code CLI (Opus 4.5)
**Architecture Version:** 1.0.0
**PRD Version:** 1.0.0

---

### 1. Deliverable Summary

| Deliverable | Status | Location |
|-------------|--------|----------|
| Source code | Complete | `/src/` |
| Unit tests | Complete | `/tests/unit/` |
| Integration tests | Complete | `/tests/integration/` |
| E2E tests | Complete | `/tests/e2e/` |
| API documentation | Complete | `/docs/api/` |

---

### 2. Requirement Verification Matrix

| Requirement ID | Implementation | Test Evidence | Status |
|----------------|----------------|---------------|--------|
| FR-001 | `src/auth/register.ts:L15-45` | `tests/unit/auth/register.test.ts` | PASS |
| FR-002 | `src/auth/login.ts:L10-38` | `tests/unit/auth/login.test.ts`, `tests/integration/auth.test.ts` | PASS |
| FR-003 | `src/auth/password-reset.ts:L20-55` | `tests/unit/auth/password-reset.test.ts`, `tests/e2e/password-reset.test.ts` | PASS |
| FR-004 | `src/user/profile.ts:L12-40` | `tests/unit/user/profile.test.ts` | PASS |
| FR-005 | `src/admin/users.ts:L8-35` | `tests/integration/admin.test.ts` | PASS |
| NFR-001 | PgBouncer config + index optimization | `tests/perf/api-latency.test.ts` | PASS (p99: 142ms) |
| NFR-002 | Health checks + replica config | Infrastructure config | PASS (monitoring active) |
| NFR-003 | TLS configuration | `tests/security/tls.test.ts` | PASS |
| NFR-004 | bcrypt implementation | `tests/unit/auth/password.test.ts` | PASS (cost: 12) |
| NFR-005 | Load test verification | `tests/perf/load.test.ts` | PASS (10,247 concurrent) |

---

### 3. Test Results Summary

| Suite | Total | Passed | Failed | Skipped | Coverage |
|-------|-------|--------|--------|---------|----------|
| Unit | 127 | 127 | 0 | 0 | 84.2% |
| Integration | 42 | 42 | 0 | 0 | N/A |
| E2E | 15 | 15 | 0 | 0 | N/A |
| Performance | 8 | 8 | 0 | 0 | N/A |
| Security | 12 | 12 | 0 | 0 | N/A |

**Total:** 204 tests, 204 passed, 0 failed

---

### 4. Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Unit test coverage | ≥80% | 84.2% | PASS |
| Branch coverage | ≥60% | 72.1% | PASS |
| Lint errors | 0 | 0 | PASS |
| Type errors | 0 | 0 | PASS |
| Critical vulnerabilities | 0 | 0 | PASS |
| High vulnerabilities | 0 | 0 | PASS |
| Medium vulnerabilities | ≤5 | 2 | PASS |

---

### 5. Deviations from Specification

| Item | Specified | Implemented | Justification | Escalated |
|------|-----------|-------------|---------------|-----------|
| None | — | — | — | — |

---

### 6. Known Issues

| ID | Severity | Description | Workaround | Blocking |
|----|----------|-------------|------------|----------|
| ISS-001 | Low | Password reset email may be delayed under high load | None needed; within SLA | No |

---

### 7. Run Instructions

```bash
# Prerequisites
- Node.js 20.x
- PostgreSQL 16.x
- Redis 7.x (for sessions)

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values (see docs/RUNBOOK.md for details)

# Run database migrations
npm run db:migrate

# Run all tests
npm run test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Start development server
npm run dev

# Start production server
npm run build && npm run start
```

---

### 8. CI/CD Readiness

- [x] Build script verified (`npm run build` succeeds)
- [x] Test commands documented and working
- [x] Environment variables documented in `.env.example`
- [x] Docker configuration complete (`Dockerfile`, `docker-compose.yml`)
- [x] CI workflow defined (`.github/workflows/ci.yml`)
- [x] Health check endpoint implemented (`/health`)

---

### 9. Artifacts

| Artifact | Version | Checksum (SHA-256) |
|----------|---------|-------------------|
| Source bundle | 1.0.0 | `abc123...` |
| Test report | 1.0.0 | `def456...` |
| Coverage report | 1.0.0 | `ghi789...` |

---

**Report Status:** COMPLETE
**Gate Recommendation:** PASS
**Prepared By:** Claude Code CLI (Opus 4.5)
**Date:** 2026-01-13T15:30:00Z
```

---

## Appendix A: Quick Reference Card

### Role Boundaries Summary

| | PM (Gemini) | Architect (Codex) | Developer (Claude) |
|---|:---:|:---:|:---:|
| Define requirements | ✓ | ✗ | ✗ |
| Prioritize scope | ✓ | ✗ | ✗ |
| Design architecture | ✗ | ✓ | ✗ |
| Choose technologies | ✗ | ✓ | ✗ |
| Write ADRs | ✗ | ✓ | ✗ |
| Write code | ✗ | ✗ | ✓ |
| Write tests | ✗ | ✗ | ✓ |
| Define test strategy | ✗ | ✓ | ✗ |

### Gate Summary

| Gate | Key Criteria | Blocker if Failed |
|------|--------------|-------------------|
| PM Gate | All FRs testable, no contradictions, no BLOCKER OQs | Architect cannot start |
| Architect Gate | 100% requirement traceability, all interfaces defined | Developer cannot start |
| Developer Gate | All tests pass, coverage met, no Critical/High vulns | Cannot release |

### Escalation Quick Reference

```
Developer → Architect: Specification issues
Architect → PM: Requirement issues
Any → Human: Circular escalation, resource constraints, security
```

---

## Appendix B: Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-13 | System Architect | Initial specification |

---

**END OF DOCUMENT**
