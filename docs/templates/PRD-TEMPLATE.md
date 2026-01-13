# Product Requirements Document

## Document Information
| Field | Value |
|-------|-------|
| Title | [Project Name] |
| Date | [YYYY-MM-DD] |
| Version | 1.0 |
| Owner | [PM Name] |
| Status | Draft / Review / Approved |

---

## 1. Problem Statement

[One clear paragraph describing the problem this product/feature solves. Focus on the user pain point, not the solution.]

---

## 2. Target Users

### Primary User Persona
- **Name**: [Persona name]
- **Role**: [Job title/role]
- **Goals**: [What they want to achieve]
- **Pain Points**: [Current frustrations]

### Secondary User Personas
- [Persona 2]: [Brief description]
- [Persona 3]: [Brief description]

### Top 3 Use Cases
1. **UC-001**: [User wants to... so that...]
2. **UC-002**: [User wants to... so that...]
3. **UC-003**: [User wants to... so that...]

---

## 3. Scope

### In-Scope
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Out-of-Scope
- [Explicitly excluded item 1]
- [Explicitly excluded item 2]
- [Explicitly excluded item 3]

### Future Considerations
- [Potential future feature 1]
- [Potential future feature 2]

---

## 4. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | [Testable requirement statement] | Must Have | AC-001, AC-002 |
| FR-002 | [Testable requirement statement] | Must Have | AC-003 |
| FR-003 | [Testable requirement statement] | Should Have | AC-004, AC-005 |
| FR-004 | [Testable requirement statement] | Could Have | AC-006 |

### FR-001: [Requirement Title]
**Description**: [Detailed description of the requirement]
**Rationale**: [Why this is needed]
**Acceptance**: AC-001, AC-002

### FR-002: [Requirement Title]
**Description**: [Detailed description]
**Rationale**: [Why this is needed]
**Acceptance**: AC-003

[Continue for all FRs...]

---

## 5. Non-Functional Requirements

| ID | Category | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| NFR-001 | Performance | [Measurable requirement] | AC-010 |
| NFR-002 | Security | [Specific requirement] | AC-011 |
| NFR-003 | Availability | [Measurable requirement] | AC-012 |
| NFR-004 | Scalability | [Measurable requirement] | AC-013 |

### NFR-001: Performance
**Requirement**: [e.g., API response time shall be ≤200ms at P95]
**Measurement**: [How it will be verified]
**Acceptance**: AC-010

### NFR-002: Security
**Requirement**: [e.g., All data in transit must use TLS 1.3]
**Measurement**: [How it will be verified]
**Acceptance**: AC-011

[Continue for all NFRs...]

---

## 6. Acceptance Criteria

| ID | Criteria | Linked Requirements | Verification Method |
|----|----------|---------------------|---------------------|
| AC-001 | [Specific, testable condition] | FR-001 | Test |
| AC-002 | [Specific, testable condition] | FR-001 | Test |
| AC-003 | [Specific, testable condition] | FR-002 | Test |
| AC-010 | [Performance threshold met] | NFR-001 | Load Test |
| AC-011 | [Security requirement verified] | NFR-002 | Security Scan |

---

## 7. Success Metrics

| Metric | Definition | Target | Current Baseline | Measurement Method |
|--------|------------|--------|------------------|-------------------|
| [Metric 1] | [What it measures] | [Target value] | [Current value] | [How measured] |
| [Metric 2] | [What it measures] | [Target value] | [Current value] | [How measured] |
| [Metric 3] | [What it measures] | [Target value] | [Current value] | [How measured] |

### Key Performance Indicators (KPIs)
1. **[KPI Name]**: [Description and target]
2. **[KPI Name]**: [Description and target]

### Telemetry Signals
- [Event/metric to track]
- [Event/metric to track]

---

## 8. Risks & Assumptions

### Risks
| ID | Risk | Probability | Impact | Mitigation Strategy |
|----|------|-------------|--------|---------------------|
| R-001 | [Risk description] | High/Med/Low | High/Med/Low | [Strategy] |
| R-002 | [Risk description] | High/Med/Low | High/Med/Low | [Strategy] |
| R-003 | [Risk description] | High/Med/Low | High/Med/Low | [Strategy] |

### Assumptions
| ID | Assumption | Impact if False |
|----|------------|-----------------|
| A-001 | [Assumption that must hold true] | [What happens if wrong] |
| A-002 | [Assumption that must hold true] | [What happens if wrong] |

### Dependencies
| ID | Dependency | Owner | Status |
|----|------------|-------|--------|
| D-001 | [External dependency] | [Team/Person] | [Status] |
| D-002 | [External dependency] | [Team/Person] | [Status] |

---

## 9. Open Questions

| ID | Question | Tag | Owner | Due Date | Resolution |
|----|----------|-----|-------|----------|------------|
| OQ-001 | [Question needing answer] | BLOCKER | [Name] | [Date] | [Answer when resolved] |
| OQ-002 | [Question needing answer] | NON-BLOCKER | [Name] | [Date] | [Answer when resolved] |

**Note**: BLOCKER questions must be resolved before proceeding to Architecture phase.

---

## 10. Release Plan

### MVP (Minimum Viable Product)
**Target**: [Date/Sprint]
**Scope**: 
- FR-001: [Brief description]
- FR-002: [Brief description]
- FR-003: [Brief description]

**Success Criteria**: [What defines MVP success]

### V1.0
**Target**: [Date/Sprint]
**Scope**: 
- MVP features +
- FR-004: [Brief description]
- FR-005: [Brief description]

### V2.0 (Future)
**Target**: [Date/Sprint]
**Scope**:
- V1.0 features +
- FR-006: [Brief description]
- FR-007: [Brief description]

---

## Appendix

### A. Glossary
| Term | Definition |
|------|------------|
| [Term 1] | [Definition] |
| [Term 2] | [Definition] |

### B. References
- [Reference document 1]
- [Reference document 2]

### C. Change History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial version |

---

## PM Gate Checklist

Before handoff to Architect, verify:

- [ ] Every requirement has unique ID (FR-### or NFR-###)
- [ ] Every requirement is testable (measurable outcome)
- [ ] Every FR has at least one acceptance criterion
- [ ] Every NFR has at least one acceptance criterion
- [ ] Acceptance criteria are specific and verifiable
- [ ] No contradictions between scope and requirements
- [ ] All open questions tagged (BLOCKER/NON-BLOCKER)
- [ ] All BLOCKER questions resolved or have owners/dates
- [ ] Release plan covers all FRs
- [ ] Success metrics are measurable

**Gate Status**: [ ] PASS / [ ] FAIL
