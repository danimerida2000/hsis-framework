# Hierarchical Specialized Intelligence Swarm: Configuration & Operational Workflow (Gemini PM → Codex Architect → Claude Developer)

## Core Principles
- Artifact-driven progression: downstream work cannot start until upstream artifacts pass their gate.
- Explicit I/O contracts: each role declares inputs, outputs, and acceptance criteria.
- Quality gates with remediation: every phase ends in pass/fail; failures loop back with fixes before continuing.
- Traceability: every requirement maps to design elements and to tests with stored evidence.
- Safety/security: no secrets in logs or docs; enforce redaction and secure configuration patterns.

## Role Definitions & Boundaries
### Gemini CLI 3.0 Pro — PM (Project & Product Manager)
- **Purpose**: Convert ambiguous goals + market/user input into a precise, testable PRD only.
- **Inputs**: Intake brief, stakeholder constraints, user research.
- **Outputs**: PRD (and optional research appendix) with numbered requirements.
- **Forbidden**: Architecture decisions, code-level design, library/stack choices unless mandated by constraints.
- **PM Gate Checklist (Pass/Fail)**
  - [ ] Every requirement is numbered and testable (`FR-###`, `NFR-###`).
  - [ ] Acceptance criteria exist for every FR and NFR.
  - [ ] No contradictions across scope, FRs, NFRs, acceptance criteria.
  - [ ] Open questions listed; BLOCKER/NON-BLOCKER tags applied.

### OpenAI Codex CLI (GPT-5.2-xhigh) — Architect
- **Purpose**: Translate the approved PRD into architecture, implementation plan, test strategy, ADRs.
- **Inputs**: Approved PRD only.
- **Outputs**: `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, test strategy, ADRs.
- **Forbidden**: Application code beyond interfaces/pseudocode; altering requirements without PM approval.
- **Architect Gate Checklist (Pass/Fail)**
  - [ ] Every FR/NFR maps to ≥1 design element and ≥1 test.
  - [ ] Interfaces/contracts fully specified (no TBDs for core flows).
  - [ ] Risks have mitigations or justified deferrals.
  - [ ] Definition of Done is clear for Developer.

### Claude Code CLI (Opus 4.5) — Developer
- **Purpose**: Implement architecture precisely, produce code/tests/docs, run checks.
- **Inputs**: Approved `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, ADRs.
- **Outputs**: Code in `/src`, tests in `/tests`, docs, final Implementation Report.
- **Forbidden**: Changing requirements/architecture without escalation; silent scope changes.
- **Developer Gate Checklist (Pass/Fail)**
  - [ ] All tests pass; lint/type checks (if applicable) pass.
  - [ ] Acceptance criteria satisfied with evidence.
  - [ ] No unresolved high-severity issues or BLOCKERs.
  - [ ] Implementation Report delivered and traceability verified.

## Artifact Specifications (Schemas + Required Sections)
### PRD (`docs/PRD.md`)
- **Schema**:
  1. Title + date + version + owner.
  2. Problem statement (1 paragraph).
  3. Target users + top 3 use cases.
  4. Scope: In-scope / Out-of-scope.
  5. Functional Requirements (numbered `FR-###`).
  6. Non-Functional Requirements (numbered `NFR-###`: latency, availability, security, compliance, cost, etc.).
  7. Acceptance Criteria (map each FR/NFR → criteria IDs).
  8. Success metrics + telemetry signals.
  9. Risks, assumptions, open questions (each numbered; tag BLOCKER/NON-BLOCKER).
  10. Release plan (MVP → V1 → V2).
- **Acceptance Mapping**: For each FR/NFR, include `Acceptance: {criteria IDs}`.

### Architecture Spec (`docs/ARCHITECTURE.md`)
- **Schema**:
  1. System Overview.
  2. Architecture Diagram (text-based; ASCII or Mermaid).
  3. Component Responsibilities.
  4. Data models/schemas.
  5. API contracts (request/response, status codes, error model).
  6. Concurrency & scaling strategy.
  7. Security model (authn/authz, secrets handling, threat considerations).
  8. Observability (logs/metrics/traces; required events).
  9. Performance budget per NFR.
  10. Migration/rollout plan (if relevant).
  11. Definition of Done for implementation.
  12. Mapping table: `Requirement ID → Design Element(s) → Test(s)`.

### Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`)
- **Schema**:
  1. Work breakdown structure (WBS) by component.
  2. Sequencing with dependencies; explicit artifact prerequisites.
  3. Owner/agent per task.
  4. Test plan linkage per task.
  5. Risks and mitigations.
  6. Exit criteria to Developer Gate.

### ADRs (`/adrs/ADR-###.md`)
- **Template**:
  - Title, Date, Status (Proposed/Accepted/Deprecated/Superseded), Deciders.
  - Context.
  - Decision.
  - Consequences (Positive/Negative).
  - Alternatives Considered (with rationale).
  - Links: PRD IDs, tests, related ADRs.

### Error Model Template (for APIs/services)
```
Error Object:
{
  "code": "ERR_CODE",           // stable, machine-readable
  "message": "Human-readable summary",
  "detail": "Optional diagnostic, no secrets/PII",
  "trace_id": "UUID for correlation"
}
HTTP Status Conventions:
- 400: Validation error (cite FR/NFR mapping)
- 401/403: Auth/authz failures
- 404: Missing resource
- 409: Conflict/invariant violation
- 429: Throttling
- 5xx: Server faults (include retry guidance)
Logging: redact per redaction rule; include trace_id; no secrets.
```

### Implementation Report (`docs/IMPLEMENTATION_REPORT.md`)
- **Template**:
  1. Summary of delivered scope.
  2. Traceability Matrix: `Requirement ID → Component(s) → Test(s) → Status`.
  3. Test Results: commands run, date, environment, outcomes (pass/fail with logs hash/path).
  4. Lint/type check results.
  5. Known issues (severity, owner, ETA).
  6. Deployment/readiness notes.
  7. Sign-off checklist (Developer → Architect → PM).

## End-to-End Workflow (Step-by-Step with Gates)
1. **Intake**
   - Collect goals, constraints, user inputs, compliance context.
   - Entry Criteria: requester provides goal + constraints; secrets stripped.
2. **PM Phase → Produce PRD**
   - Output: `docs/PRD.md` (+ optional `docs/appendix/research.md`).
   - Gate: PM Gate Checklist; if fail → remediate PRD and re-run gate.
3. **Architecture Phase → Produce Architecture Spec + Implementation Plan + ADRs**
   - Inputs: approved PRD only.
   - Outputs: `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`, `/adrs/ADR-###.md`, test strategy embedded.
   - Gate: Architect Gate Checklist; if fail → remediate specs or escalate to PM.
4. **Implementation Phase → Code & Tests**
   - Inputs: approved architecture artifacts.
   - Outputs: `/src`, `/tests`, updated docs, `docs/IMPLEMENTATION_REPORT.md`, `CHANGELOG.md`.
   - Gate: Developer Gate Checklist; if fail → fix defects; if spec unclear → escalate to Architect.
5. **Release Readiness Review**
   - Inputs: passing Developer Gate outputs.
   - Outputs: Final sign-off note appended to Implementation Report.
   - Gate Checklist:
     - [ ] All gates previously passed with evidence stored.
     - [ ] Deployment/runbook validated.
     - [ ] Outstanding issues are low severity with owners/ETAs.
   - Fail → route to relevant role for remediation.

## Communication Protocol (Handoff Format + Escalation Rules)
- **Mandatory Handoff Format** (all roles):
  - Summary.
  - Artifacts Provided (file paths).
  - Checklist (explicit pass/fail items).
  - Open Questions (BLOCKER / NON-BLOCKER).
  - Next Role Instruction (single, unambiguous paragraph).
- **Escalation Note** (when blockers/contradictions found):
  - Issue (1 sentence).
  - Evidence (quote requirement IDs/sections).
  - Options (2–3).
  - Recommendation (1).
  - Required decision-maker (PM or Architect).
  - Routing: send upstream; halt downstream work on affected scope.
- **Response SLAs**: PM/Architect respond to BLOCKER within 1 business day; NON-BLOCKER within 3.
- **No silent assumptions** for BLOCKER items; document all decisions in ADR or PRD addendum.

## Repository & File Layout (Required)
```
/docs/
  PRD.md
  ARCHITECTURE.md
  IMPLEMENTATION_PLAN.md
  IMPLEMENTATION_REPORT.md
/adrs/
  ADR-###.md
/src/               # implementation
/tests/             # automated tests
README.md
CHANGELOG.md
RUNBOOK.md
```
- Naming: Use zero-padded numerals for ADRs and requirements (e.g., `ADR-001`, `FR-001`).
- Traceability: All files reference requirement IDs where applicable.

## Runbook (Commands, Expected Outputs, Troubleshooting)
- **Setup** (example; adjust per stack):
  - `make deps` or stack-specific install; expected: dependencies installed without errors.
- **Quality Checks**:
  - `make lint` → exit 0; store log path in Implementation Report.
  - `make test` → exit 0; include summary (e.g., coverage %) in Implementation Report.
  - `make fmt` (if applicable) before commits.
- **Local Run**:
  - `make run` or service-specific command; expected: service starts, health endpoint 200.
- **CI Expectations**:
  - CI runs lint, tests, security scan (SAST/dep), coverage gate (threshold defined in Architecture Spec).
  - CI artifacts: test reports (JUnit), coverage report, build logs retained for audit.
- **Troubleshooting**:
  - If tests fail → identify linked requirement ID, open escalation if tied to spec ambiguity.
  - If dependency/security scan fails → raise ADR or patch with risk notes; no bypass without recorded decision.

## Quality Assurance (Test Strategy, CI, Definition of Done)
- **Test Strategy (Architect-owned, Dev-executed)**:
  - Unit tests: cover core logic; minimum coverage threshold defined per component.
  - Integration tests: validate API contracts and data models against spec.
  - E2E tests: critical user journeys mapped to FRs.
  - Non-functional tests: load/performance for NFR latency/throughput, security checks, resilience tests.
  - Observability verification: log/metric/trace events emitted as defined.
- **Definition of Done**:
  - All gate checklists satisfied.
  - Traceability matrix complete (requirements → design → tests → results).
  - Documentation updated (README, RUNBOOK, CHANGELOG).
  - No high/critical vulnerabilities; medium with documented mitigation/acceptance.
- **CI Expectations**:
  - Deterministic builds; pinned dependencies.
  - Reproducible test runs; store artifacts.
  - Redactions enforced in logs.

## Failure Modes & Recovery
- **Gate Failure**: Pause progression; remediate in owning role; re-run gate checklist.
- **Conflicting Requirements**: Issue Escalation Note; Architect/PM resolve; update PRD/ADR; re-validate mappings.
- **Architecture Mismatch during Dev**: Developer halts affected work; escalates to Architect with evidence; Architect may issue ADR or PRD change request.
- **Stalled Decisions**: If no response within SLA, escalate to governance lead; unblock only with documented interim decision recorded in ADR with expiry.
- **Defect Leakage**: If post-gate defect tied to missing test, add test + update test strategy; re-run gates as needed.

## Compliance Notes (Logging, Data Handling, Audit Trail)
- **Redaction Rule**: No secrets, tokens, PII, or proprietary data in logs, docs, or tickets. Replace sensitive values with `[REDACTED]`. Include trace IDs, not raw payloads.
- **Secure Configuration Pattern**:
  - Secrets in environment variables or secret manager; never in repo.
  - Config via parameterized files with checked-in defaults safe for non-prod only.
  - Use least privilege for service accounts; rotate credentials per policy.
  - Validate inputs; enforce auth/authz per Architecture Spec.
- **Auditability**:
  - Maintain change log (`CHANGELOG.md`) with requirement IDs.
  - Store gate checklists and evidence (log file paths, test reports) in docs or CI artifacts.
  - ADRs capture rationale for deviations/risks.
- **Data Handling**:
  - Follow retention rules defined in PRD/Architecture; log only necessary metadata.
  - Use trace IDs for correlation; avoid storing payloads unless required and approved.

## Concrete Examples
- **Requirement IDs**: `FR-001: User can submit job request via CLI.` `NFR-002: P99 latency ≤ 800ms for job submission under 500 RPS.`
- **ADR Example** (`/adrs/ADR-001.md`):
  - Context: Need message queue for decoupling ingestion.
  - Decision: Use managed queue with at-least-once delivery.
  - Consequences: Idempotent consumers required; increased cloud cost.
  - Alternatives: Direct HTTP fan-out (rejected: tight coupling), DB polling (rejected: latency).
- **Error Codes**: `ERR-VALIDATION-001`, `ERR-AUTH-002`, `ERR-CONFLICT-003`, `ERR-RATE-004`, `ERR-SERVER-005`.
- **Implementation Report Snippet**:
  - Traceability: `FR-001 → src/cli/submit_job.ts → tests/e2e/submit_job.test.ts → PASS`
  - Test Command: `make test` @ 2024-XX-XX 14:00 UTC → PASS; report: `artifacts/junit.xml`
  - Lint: `make lint` → PASS; log: `artifacts/lint.log`
  - Known Issues: `NFR-002 load test failing at 900ms P99 (Severity: Medium, Owner: Dev, ETA: 2d)`
