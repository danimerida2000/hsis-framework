# Hierarchical Specialized Intelligence Swarm (HSIS)
## Complete Implementation Guide for Linux

**Document Version:** 1.0.0
**Target Platform:** Linux (Ubuntu 22.04+, Debian 12+, Fedora 38+)
**Last Updated:** 2026-01-13

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Configuration Architecture](#3-configuration-architecture)
4. [MCP Integration Layer](#4-mcp-integration-layer)
5. [Project Folder Structure](#5-project-folder-structure)
6. [Shell Orchestration System](#6-shell-orchestration-system)
7. [Artifact Templates](#7-artifact-templates)
8. [Gate Automation](#8-gate-automation)
9. [Communication Protocols](#9-communication-protocols)
10. [Quality Assurance Integration](#10-quality-assurance-integration)
11. [Operational Runbook](#11-operational-runbook)
12. [Full-Stack Web App Example](#12-full-stack-web-app-example)
13. [Advanced Topics](#13-advanced-topics)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Executive Summary

### 1.1 What is HSIS?

The **Hierarchical Specialized Intelligence Swarm (HSIS)** is a deterministic, artifact-driven workflow system that orchestrates three specialized AI agents to convert ambiguous product requirements into tested, deployable code.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HIERARCHICAL SWARM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│   │   GEMINI     │      │    CODEX     │      │    CLAUDE    │          │
│   │   CLI 3.0    │ ───► │    CLI       │ ───► │    CODE      │          │
│   │              │      │              │      │              │          │
│   │  Product     │      │  Software    │      │   Senior     │          │
│   │  Manager     │      │  Architect   │      │  Developer   │          │
│   └──────┬───────┘      └──────┬───────┘      └──────┬───────┘          │
│          │                     │                     │                   │
│          ▼                     ▼                     ▼                   │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│   │     PRD      │      │ ARCHITECTURE │      │    CODE      │          │
│   │  Document    │      │    SPEC      │      │   + TESTS    │          │
│   └──────────────┘      └──────────────┘      └──────────────┘          │
│                                                                          │
│   ════════════════      ════════════════      ════════════════          │
│      PM GATE              ARCH GATE             DEV GATE                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 The Three Agents

| Role | Agent | Model | Primary Function |
|------|-------|-------|------------------|
| **Product Manager (PM)** | Gemini CLI 3.0 Pro | gemini-2.5-pro | Requirements → PRD |
| **Software Architect** | OpenAI Codex CLI | GPT-5.2-xhigh | PRD → Technical Specification |
| **Senior Developer** | Claude Code CLI | Opus 4.5 | Specification → Implementation |

### 1.3 Core Principles

1. **Artifact-Driven Progression**: No downstream role proceeds without upstream artifact passing its gate
2. **Explicit Contracts**: All I/O is structured, versioned, and machine-checkable
3. **Traceability**: Every requirement maps to design decisions and test cases
4. **Auditability**: All decisions are logged with rationale
5. **Fail-Safe Escalation**: Blockers halt progression and route to decision-maker

### 1.4 Role Boundaries Summary

| Capability | PM (Gemini) | Architect (Codex) | Developer (Claude) |
|------------|:-----------:|:-----------------:|:------------------:|
| Define requirements | ✓ | ✗ | ✗ |
| Prioritize scope | ✓ | ✗ | ✗ |
| Design architecture | ✗ | ✓ | ✗ |
| Choose technologies | ✗ | ✓ | ✗ |
| Write ADRs | ✗ | ✓ | ✗ |
| Write code | ✗ | ✗ | ✓ |
| Write tests | ✗ | ✗ | ✓ |
| Define test strategy | ✗ | ✓ | ✗ |

---

## 2. Prerequisites & Installation

### 2.1 System Requirements

```bash
# Minimum System Requirements
# - OS: Linux (Ubuntu 22.04+, Debian 12+, Fedora 38+, Arch)
# - RAM: 8GB minimum, 16GB recommended
# - Disk: 10GB free space
# - Network: Stable internet connection for API calls

# Check your system
uname -a
cat /etc/os-release
free -h
df -h
```

### 2.2 Install Core Dependencies

#### Node.js (v20 LTS or later)

```bash
# Option 1: Using nvm (Recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# Option 2: Using NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Option 3: Using dnf (Fedora)
sudo dnf install nodejs

# Verify installation
node --version  # Expected: v20.x.x
npm --version   # Expected: 10.x.x
```

#### Python (v3.11 or later)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip

# Verify installation
python3 --version  # Expected: 3.11.x or later
pip3 --version
```

#### Docker (Optional but recommended)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (logout/login required)
sudo usermod -aG docker $USER

# Verify
docker --version
docker compose version
```

#### Git

```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify
git --version
```

#### jq (JSON processor)

```bash
# Ubuntu/Debian
sudo apt install jq

# Fedora
sudo dnf install jq

# Verify
jq --version
```

### 2.3 API Key Acquisition

You need API keys from three providers:

#### Anthropic (Claude)

1. Visit https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new key
5. Copy and save securely

#### Google AI (Gemini)

1. Visit https://aistudio.google.com/
2. Sign in with Google account
3. Navigate to "Get API Key"
4. Create API key
5. Copy and save securely

#### OpenAI (Codex)

1. Visit https://platform.openai.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Create new secret key
5. Copy and save securely

### 2.4 Secure Credential Storage

**CRITICAL**: Never commit API keys to version control.

```bash
# Create secure credentials file
mkdir -p ~/.config/hsis
chmod 700 ~/.config/hsis

cat > ~/.config/hsis/credentials << 'EOF'
# HSIS API Credentials
# Source this file: source ~/.config/hsis/credentials

export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
export GOOGLE_AI_API_KEY="AIza-your-key-here"
export OPENAI_API_KEY="sk-your-key-here"
export BRAVE_API_KEY="BSA-your-key-here"  # Optional: for web search
export GITHUB_TOKEN="ghp_your-token-here"  # Optional: for GitHub MCP
EOF

# Set restrictive permissions
chmod 600 ~/.config/hsis/credentials

# Add to shell profile for automatic loading
echo 'source ~/.config/hsis/credentials' >> ~/.bashrc
# Or for zsh:
# echo 'source ~/.config/hsis/credentials' >> ~/.zshrc

# Reload shell
source ~/.bashrc
```

### 2.5 Install CLI Tools

#### Claude Code CLI

```bash
# Install globally via npm
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Initial setup (interactive)
claude

# Expected output:
# Claude Code CLI v1.x.x
# Authenticating with Anthropic API...
# ✓ Authentication successful
```

#### Gemini CLI

```bash
# Install globally via npm
npm install -g @google/gemini-cli

# Verify installation
gemini --version

# Initial setup
gemini auth login

# Expected output:
# Gemini CLI v3.x.x
# Opening browser for authentication...
# ✓ Authentication successful
```

#### OpenAI Codex CLI

```bash
# Install globally via npm
npm install -g @openai/codex

# Verify installation
codex --version

# Set API key (already in environment from credentials file)
# The CLI will use OPENAI_API_KEY automatically

# Expected output:
# Codex CLI v1.x.x
```

### 2.6 Verify All Installations

```bash
#!/bin/bash
# verify-installations.sh

echo "=== HSIS Installation Verification ==="
echo ""

# Check Node.js
echo -n "Node.js: "
node --version 2>/dev/null || echo "NOT INSTALLED"

# Check npm
echo -n "npm: "
npm --version 2>/dev/null || echo "NOT INSTALLED"

# Check Python
echo -n "Python: "
python3 --version 2>/dev/null || echo "NOT INSTALLED"

# Check Docker
echo -n "Docker: "
docker --version 2>/dev/null || echo "NOT INSTALLED (optional)"

# Check Git
echo -n "Git: "
git --version 2>/dev/null || echo "NOT INSTALLED"

# Check jq
echo -n "jq: "
jq --version 2>/dev/null || echo "NOT INSTALLED"

echo ""
echo "=== CLI Tools ==="

# Check Claude
echo -n "Claude Code CLI: "
claude --version 2>/dev/null || echo "NOT INSTALLED"

# Check Gemini
echo -n "Gemini CLI: "
gemini --version 2>/dev/null || echo "NOT INSTALLED"

# Check Codex
echo -n "Codex CLI: "
codex --version 2>/dev/null || echo "NOT INSTALLED"

echo ""
echo "=== API Keys ==="

# Check API keys (just presence, not validity)
[[ -n "$ANTHROPIC_API_KEY" ]] && echo "ANTHROPIC_API_KEY: ✓ Set" || echo "ANTHROPIC_API_KEY: ✗ Missing"
[[ -n "$GOOGLE_AI_API_KEY" ]] && echo "GOOGLE_AI_API_KEY: ✓ Set" || echo "GOOGLE_AI_API_KEY: ✗ Missing"
[[ -n "$OPENAI_API_KEY" ]] && echo "OPENAI_API_KEY: ✓ Set" || echo "OPENAI_API_KEY: ✗ Missing"
[[ -n "$BRAVE_API_KEY" ]] && echo "BRAVE_API_KEY: ✓ Set (optional)" || echo "BRAVE_API_KEY: ✗ Missing (optional)"
[[ -n "$GITHUB_TOKEN" ]] && echo "GITHUB_TOKEN: ✓ Set (optional)" || echo "GITHUB_TOKEN: ✗ Missing (optional)"

echo ""
echo "=== Verification Complete ==="
```

---

## 3. Configuration Architecture

This section provides complete, production-ready configurations for each CLI tool.

### 3.1 Claude Code CLI Configuration (Developer Role)

Claude Code serves as the **Senior Developer** in the HSIS hierarchy. Its configuration enforces coding responsibilities while preventing architectural decisions.

#### 3.1.1 Settings File

**Location:** `~/.claude/settings.json` (global) or `.claude/settings.json` (project)

```json
{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(npm test:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(make:*)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(mkdir:*)",
      "Read",
      "Write(src/**)",
      "Write(tests/**)",
      "Write(package.json)",
      "Write(tsconfig.json)",
      "Write(.swarm/artifacts/**)",
      "Write(docs/IMPLEMENTATION_REPORT.md)",
      "Edit(src/**)",
      "Edit(tests/**)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Bash(git push:*)",
      "Bash(git checkout main)",
      "Bash(git merge:*)",
      "Write(docs/PRD.md)",
      "Write(docs/ARCHITECTURE.md)",
      "Write(.swarm/specs/**)",
      "Edit(docs/PRD.md)",
      "Edit(docs/ARCHITECTURE.md)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.ts)",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      },
      {
        "matcher": "Write(*.tsx)",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  },
  "context": {
    "maxTokens": 100000,
    "includeGitHistory": false
  }
}
```

#### 3.1.2 CLAUDE.md (Developer Role Constraints)

**Location:** Project root `CLAUDE.md`

```markdown
# Developer Agent Configuration — Claude Code CLI

## Identity

You are the **DEVELOPER** in a Hierarchical Specialized Intelligence Swarm (HSIS).
You are a Senior Software Engineer responsible for implementing code according to
approved specifications.

## Role Boundaries

### You ARE responsible for:
- Implementing features exactly as specified in `.swarm/specs/current-task.json`
- Writing comprehensive test suites (unit, integration, e2e)
- Following coding standards and architectural patterns from `docs/ARCHITECTURE.md`
- Running quality checks (lint, type-check, test)
- Documenting implementation decisions in `docs/IMPLEMENTATION_REPORT.md`
- Reporting completion status to `.swarm/artifacts/dev-complete.json`

### You are NOT allowed to:
- Modify requirements (escalate to Architect if unclear)
- Change architectural decisions (escalate to Architect)
- Add features not in the specification (scope creep)
- Skip tests specified in the implementation plan
- Hardcode secrets or credentials
- Push code directly to main branch

## Input Artifacts

Before starting work, you MUST read and understand:

1. **Task Specification**: `.swarm/specs/current-task.json`
2. **Architecture Spec**: `docs/ARCHITECTURE.md`
3. **Implementation Plan**: `docs/IMPLEMENTATION_PLAN.md`
4. **ADRs**: `docs/adrs/ADR-*.md` (all relevant decisions)

## Workflow Protocol

### Step 1: Task Ingestion
```bash
# Read and parse the current task
cat .swarm/specs/current-task.json
```

### Step 2: Implementation
For each component in the task:
1. Read the interface definition from Architecture spec
2. Implement the component in `src/`
3. Write unit tests in `tests/unit/`
4. Run tests: `npm run test:unit`
5. Fix any failures

### Step 3: Integration
1. Implement integration points
2. Write integration tests in `tests/integration/`
3. Run: `npm run test:integration`

### Step 4: Quality Verification
```bash
npm run lint        # Must pass with 0 errors
npm run type-check  # Must pass with 0 errors
npm run test        # All tests must pass
npm run coverage    # Must meet threshold (default: 80%)
```

### Step 5: Completion Artifact
Create `.swarm/artifacts/dev-complete.json`:
```json
{
  "status": "complete",
  "task_id": "[from current-task.json]",
  "timestamp": "[ISO8601]",
  "files_created": ["src/...", "tests/..."],
  "files_modified": ["..."],
  "test_results": {
    "unit": { "total": N, "passed": N, "failed": 0 },
    "integration": { "total": N, "passed": N, "failed": 0 },
    "coverage": "XX%"
  },
  "quality_checks": {
    "lint": "pass",
    "type_check": "pass",
    "security_scan": "pass"
  },
  "deviations": [],
  "notes": ""
}
```

## Escalation Protocol

If you encounter any of the following, STOP and create an escalation note:

1. **Specification Unclear**: Missing details needed for implementation
2. **Specification Incorrect**: Logical errors or contradictions
3. **Architecture Infeasible**: Cannot implement as designed
4. **Security Concern**: Potential vulnerability in the design

Escalation file: `.swarm/escalations/ESC-DEV-[timestamp].md`

## Code Quality Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Strict mode enabled
- No `any` types without justification
- All functions must have return types
- Use async/await over raw promises

### Testing
- Unit tests: Cover all public functions
- Integration tests: Cover all API endpoints
- E2E tests: Cover all user journeys from PRD
- Mock external dependencies

### Security
- Never hardcode credentials
- Use environment variables for configuration
- Validate all inputs at boundaries
- Follow OWASP Top 10 guidelines

### Documentation
- JSDoc comments for public APIs
- README updates for new features
- Inline comments for complex logic only
```

### 3.2 Gemini CLI Configuration (PM Role)

Gemini CLI serves as the **Product Manager** in the HSIS hierarchy.

#### 3.2.1 Settings File

**Location:** `~/.gemini/settings.json`

```json
{
  "model": {
    "name": "gemini-2.5-pro",
    "temperature": 0.3,
    "maxOutputTokens": 8192
  },
  "context": {
    "fileName": ["GEMINI.md"],
    "includeDirectories": [
      ".swarm/intake",
      ".swarm/artifacts",
      "docs"
    ],
    "fileFiltering": {
      "respectGitIgnore": true,
      "excludePatterns": ["node_modules/**", "*.log", ".env*"]
    }
  },
  "tools": {
    "sandbox": "docker",
    "allowed": [
      "read_file",
      "write_file(.swarm/specs/**)",
      "write_file(docs/PRD.md)",
      "list_directory"
    ],
    "exclude": [
      "run_shell_command",
      "write_file(src/**)",
      "write_file(tests/**)"
    ]
  },
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "$BRAVE_API_KEY"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "."],
      "trust": true
    }
  },
  "safety": {
    "trust": {
      "domains": ["brave.com", "github.com"]
    }
  }
}
```

#### 3.2.2 GEMINI.md (PM Role Constraints)

**Location:** Project root `GEMINI.md`

```markdown
# Product Manager Agent Configuration — Gemini CLI

## Identity

You are the **PRODUCT MANAGER (PM)** in a Hierarchical Specialized Intelligence Swarm.
Your role is to convert ambiguous goals, market signals, and user input into a
high-quality Product Requirements Document (PRD) that is complete, consistent,
and testable.

## Role Boundaries

### You ARE responsible for:
- Analyzing stakeholder requirements from `.swarm/intake/`
- Conducting research using web search when needed
- Producing comprehensive PRDs following the specification
- Defining acceptance criteria for each requirement
- Prioritizing features using MoSCoW method
- Identifying risks, assumptions, and open questions
- Reviewing Developer completion artifacts
- Approving or requesting revisions to deliverables

### You are NOT allowed to:
- Make architecture decisions (Architect responsibility)
- Select technologies or libraries (Architect responsibility)
- Write implementation code (Developer responsibility)
- Define specific performance budgets (Architect responsibility)
- Design database schemas (Architect responsibility)
- Modify files in `src/` or `tests/` directories

## Input Sources

1. **Stakeholder Requests**: `.swarm/intake/*.md`
2. **User Research Data**: `.swarm/intake/research/`
3. **Market Analysis**: `.swarm/intake/market/`
4. **Existing Documentation**: `docs/`
5. **Escalation Notes from Architect**: `.swarm/escalations/ESC-ARCH-*.md`

## Output Artifacts

### Primary: Product Requirements Document
**Location**: `docs/PRD.md`

Required sections:
1. Title, Version, Date, Owner
2. Problem Statement (single paragraph)
3. Target Users (table with personas)
4. Use Cases (minimum 3, full flow definitions)
5. Scope (In-Scope / Out-of-Scope with rationale)
6. Functional Requirements (FR-### format with acceptance criteria)
7. Non-Functional Requirements (NFR-### format with measurement method)
8. Risks, Assumptions, Open Questions (tagged BLOCKER/NON-BLOCKER)
9. Success Metrics with telemetry signals
10. Release Plan (MVP → V1 → V2)

### Secondary: Research Appendix (optional)
**Location**: `docs/appendix/research.md`

### Handoff Document
**Location**: `.swarm/specs/HANDOFF-PM-ARCH.md`

## PM Gate Checklist

Before submitting PRD, verify:

- [ ] Problem statement is specific and measurable
- [ ] At least 3 use cases with full flow definitions
- [ ] All functional requirements have IDs (FR-###)
- [ ] All non-functional requirements have IDs (NFR-###)
- [ ] Every FR has acceptance criteria
- [ ] Every NFR has a measurement method
- [ ] No contradictory requirements
- [ ] Scope boundaries are clear
- [ ] Priorities are assigned (MoSCoW)
- [ ] All acceptance criteria are objectively verifiable
- [ ] Success metrics have defined telemetry signals
- [ ] All BLOCKER open questions have owners and due dates
- [ ] Risks have mitigation strategies

## Workflow Protocol

### Phase 1: Intake Analysis
1. Read all files in `.swarm/intake/`
2. Identify stakeholder, goals, constraints
3. Note any ambiguities requiring clarification

### Phase 2: Research (if needed)
1. Use web search for market context
2. Research competitive solutions
3. Validate technical feasibility at high level

### Phase 3: PRD Drafting
1. Create `docs/PRD.md` following template
2. Ensure all required sections are complete
3. Cross-reference requirements for consistency

### Phase 4: Self-Review
1. Run through PM Gate Checklist
2. Fix any identified gaps
3. Mark BLOCKER items for human input

### Phase 5: Handoff
1. Update PRD status to REVIEW
2. Create handoff document at `.swarm/specs/HANDOFF-PM-ARCH.md`
3. Signal completion: `touch .swarm/status/pm-ready`

## Review Protocol (Post-Implementation)

When reviewing Developer completion:

1. Read `.swarm/artifacts/dev-complete.json`
2. Compare against acceptance criteria in PRD
3. Verify all FR acceptance criteria are met
4. Output decision to `.swarm/status/review-result.txt`:
   - `APPROVED` - Ready for release
   - `REVISIONS_NEEDED` - With feedback in `.swarm/escalations/revision-request.md`

## Escalation Handling

When receiving escalations from Architect:

1. Read `.swarm/escalations/ESC-ARCH-*.md`
2. Analyze the options presented
3. Make decision based on product priorities
4. Document in `.swarm/escalations/ESC-ARCH-*-RESPONSE.md`
5. Update PRD if requirements change
```

### 3.3 Codex CLI Configuration (Architect Role)

Codex CLI serves as the **Software Architect** in the HSIS hierarchy.

#### 3.3.1 Settings File

**Location:** `~/.codex/config.toml`

```toml
# Codex CLI Configuration for Architect Role
# HSIS - Hierarchical Specialized Intelligence Swarm

[model]
default = "gpt-5-codex"
reasoning_effort = "high"

[sandbox]
default_mode = "workspace-write"
permissions = ["disk-read-access", "disk-write-access"]
writable_paths = [
    "docs/**",
    ".swarm/specs/**",
    ".swarm/escalations/**",
    ".swarm/status/**"
]
readonly_paths = [
    "src/**",
    "tests/**"
]

[shell_environment_policy]
inherit = "core"
include = ["PATH", "HOME", "USER"]
exclude = ["AWS_*", "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "*_SECRET*", "*_TOKEN*"]

[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@anthropic-ai/mcp-server-filesystem", "."]

[mcp_servers.github]
command = "npx"
args = ["-y", "@anthropic-ai/mcp-server-github"]
env_vars = ["GITHUB_TOKEN"]

[features]
skills = true
parallel = false
auto_approve = false

[output]
format = "json"
verbose = true

[context]
files = ["AGENTS.md"]
include_patterns = ["docs/**/*.md", ".swarm/**/*.json", ".swarm/**/*.md"]
exclude_patterns = ["node_modules/**", "*.log", ".env*"]
```

#### 3.3.2 AGENTS.md (Architect Role Constraints)

**Location:** Project root `AGENTS.md`

```markdown
# Software Architect Agent Configuration — Codex CLI

## Identity

You are the **SOFTWARE ARCHITECT** in a Hierarchical Specialized Intelligence Swarm.
Your role is to translate approved PRDs into rigorous technical specifications and
architecture that minimize technical debt and enable deterministic implementation.

## Role Boundaries

### You ARE responsible for:
- Analyzing approved PRDs for technical feasibility
- Designing system architecture and component breakdown
- Selecting appropriate technology stack
- Defining API contracts (OpenAPI, GraphQL, Proto)
- Creating data models and database schemas
- Documenting decisions in Architecture Decision Records (ADRs)
- Creating implementation plans with clear sequencing
- Defining test strategy and coverage requirements
- Creating task specifications for Developer

### You are NOT allowed to:
- Write application code (Developer responsibility)
- Change requirements without PM approval (escalate instead)
- Make product decisions (PM responsibility)
- Deploy infrastructure (out of scope)
- Modify files in `src/` or `tests/` directories

## Input Artifacts

**Required**: Approved PRD at `docs/PRD.md` with status = APPROVED

Also reference:
- Existing system architecture (if any)
- Technical constraints documentation
- Escalation Notes from Developer: `.swarm/escalations/ESC-DEV-*.md`

## Output Artifacts

### 1. Architecture Specification
**Location**: `docs/ARCHITECTURE.md`

Required sections:
1. System Overview (2-3 paragraphs)
2. Architecture Diagram (ASCII or Mermaid)
3. Component Responsibilities Table
4. Requirement Traceability Matrix
5. Data Model (entities, relationships, state machines)
6. API Contracts (endpoints, schemas, error model)
7. Concurrency & Scaling Strategy
8. Security Model (authn, authz, secrets, threats)
9. Observability (logging, metrics, tracing)
10. Performance Budget (NFR targets)
11. Migration/Rollout Plan

### 2. Implementation Plan
**Location**: `docs/IMPLEMENTATION_PLAN.md`

Required sections:
1. Implementation Sequence with dependencies
2. Component Specifications (interfaces, files, test requirements)
3. Dependency Map
4. Definition of Done per component
5. Known Constraints

### 3. Architecture Decision Records
**Location**: `docs/adrs/ADR-###.md`

One ADR per significant decision covering:
- Context and requirement references
- Decision statement
- Consequences (positive, negative, neutral)
- Alternatives considered with rejection reasons

### 4. Task Specification for Developer
**Location**: `.swarm/specs/current-task.json`

```json
{
  "task_id": "TASK-###",
  "prd_version": "X.Y.Z",
  "arch_version": "X.Y.Z",
  "title": "Descriptive title",
  "description": "What needs to be implemented",
  "requirements": ["FR-001", "FR-002"],
  "components": [
    {
      "name": "ComponentName",
      "files_to_create": ["src/path/file.ts"],
      "files_to_modify": ["src/path/existing.ts"],
      "interface": "Reference to ARCHITECTURE.md section",
      "tests_required": ["unit", "integration"]
    }
  ],
  "api_endpoints": [
    {
      "method": "POST",
      "path": "/api/v1/resource",
      "request_schema": "schemas/request.json",
      "response_schema": "schemas/response.json"
    }
  ],
  "acceptance_tests": [
    "Description of what must pass"
  ],
  "dependencies": [],
  "definition_of_done": [
    "All tests passing",
    "Coverage >= 80%",
    "Zero lint errors"
  ]
}
```

### 5. Handoff Document
**Location**: `.swarm/specs/HANDOFF-ARCH-DEV.md`

## Architect Gate Checklist

Before submitting specifications:

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

## Workflow Protocol

### Phase 1: PRD Analysis
1. Read `docs/PRD.md` thoroughly
2. Extract all FR and NFR requirements
3. Note any ambiguities or concerns
4. Create initial requirement analysis notes

### Phase 2: Architecture Design
1. Design high-level system architecture
2. Break down into components with single responsibilities
3. Define interfaces between components
4. Create architecture diagram

### Phase 3: Technical Decisions
1. Select technology stack based on requirements
2. Document each significant decision as ADR
3. Consider alternatives and document rejections

### Phase 4: Detailed Specification
1. Define API contracts with full schemas
2. Design data models and state machines
3. Specify security controls
4. Plan observability requirements

### Phase 5: Implementation Planning
1. Sequence components by dependencies
2. Create task specifications
3. Define test strategy per component
4. Establish Definition of Done

### Phase 6: Self-Review
1. Run through Architect Gate Checklist
2. Verify complete traceability
3. Fix any gaps

### Phase 7: Handoff
1. Update document statuses to REVIEW
2. Create handoff document
3. Create task specification JSON
4. Signal completion: `touch .swarm/status/architect-ready`

## Escalation Protocol

### Escalating to PM
When you encounter:
- Unclear requirements
- Contradictory requirements
- Missing requirements
- Scope ambiguity

Create: `.swarm/escalations/ESC-ARCH-[timestamp].md`

### Responding to Developer Escalations
1. Read `.swarm/escalations/ESC-DEV-*.md`
2. Analyze the technical issue
3. Determine if spec change needed
4. If yes, update specs and create ADR
5. If PM decision needed, escalate upstream
6. Document response in `.swarm/escalations/ESC-DEV-*-RESPONSE.md`
```

---

## 4. MCP Integration Layer

The Model Context Protocol (MCP) provides standardized tool connectivity across all three CLI agents.

### 4.1 MCP Server Directory Structure

```bash
# Create unified MCP server directory
mkdir -p ~/AiTools/mcp-servers
cd ~/AiTools/mcp-servers

# Initialize npm for global MCP servers
npm init -y
```

### 4.2 Core MCP Servers Installation

```bash
cd ~/AiTools/mcp-servers

# Filesystem Server (all agents)
npm install @anthropic-ai/mcp-server-filesystem

# Brave Search Server (PM research)
npm install @anthropic-ai/mcp-server-brave-search

# GitHub Server (all agents)
npm install @anthropic-ai/mcp-server-github
```

### 4.3 MCP Configuration for Claude Code

**Location:** `~/.claude/settings.json` (add to existing)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "."],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      }
    }
  }
}
```

### 4.4 MCP Configuration for Gemini CLI

Already included in the `~/.gemini/settings.json` above. Key servers:
- `brave-search` for web research
- `filesystem` for file operations

### 4.5 MCP Configuration for Codex CLI

Already included in `~/.codex/config.toml` above. Key servers:
- `filesystem` for document access
- `github` for repository context

### 4.6 Verifying MCP Connections

```bash
# Claude Code MCP verification
claude --mcp-debug
# Look for: "MCP servers connected: filesystem, github"

# Gemini CLI MCP verification
gemini mcp list
# Expected: List of connected servers with status

# Codex CLI MCP verification
codex mcp list
# Expected: Connected servers list
```

---

## 5. Project Folder Structure

### 5.1 Canonical Layout

```
project-root/
│
├── .swarm/                        # Orchestration directory
│   ├── intake/                    # Raw requirements input
│   │   └── feature-request.md     # Initial stakeholder request
│   ├── specs/                     # Specifications (PRD → Architecture → Tasks)
│   │   ├── current-task.json      # Active task for Developer
│   │   ├── HANDOFF-PM-ARCH.md     # PM → Architect handoff
│   │   └── HANDOFF-ARCH-DEV.md    # Architect → Developer handoff
│   ├── artifacts/                 # Agent outputs
│   │   ├── pm-complete.json       # PM completion status
│   │   ├── architect-complete.json
│   │   └── dev-complete.json
│   ├── status/                    # Gate markers (empty files)
│   │   ├── pm-ready               # PM phase complete
│   │   ├── architect-ready        # Architect phase complete
│   │   └── dev-ready              # Developer phase complete
│   ├── logs/                      # Execution logs
│   │   ├── pm.json
│   │   ├── architect.json
│   │   └── developer.json
│   └── escalations/               # Cross-role questions
│       ├── ESC-ARCH-001.md
│       └── ESC-ARCH-001-RESPONSE.md
│
├── docs/                          # Documentation
│   ├── PRD.md                     # Product Requirements Document
│   ├── ARCHITECTURE.md            # Architecture Specification
│   ├── IMPLEMENTATION_PLAN.md     # Implementation sequencing
│   ├── IMPLEMENTATION_REPORT.md   # Final delivery report
│   ├── RUNBOOK.md                 # Operational runbook
│   ├── adrs/                      # Architecture Decision Records
│   │   ├── ADR-001.md
│   │   └── template.md
│   └── templates/                 # Document templates
│       ├── PRD-TEMPLATE.md
│       └── ...
│
├── src/                           # Source code
│   ├── components/                # Feature components
│   ├── shared/                    # Shared utilities
│   ├── config/                    # Configuration
│   └── index.ts                   # Entry point
│
├── tests/                         # Test suites
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
│
├── scripts/                       # Build/utility scripts
│   ├── swarm-orchestrator.sh      # Main orchestrator
│   ├── init-swarm.sh              # Initialize project
│   ├── run-pm.sh                  # PM phase
│   ├── run-architect.sh           # Architect phase
│   ├── run-developer.sh           # Developer phase
│   └── verify-gates.sh            # Gate validation
│
├── .github/                       # CI/CD configuration
│   └── workflows/
│       └── ci.yml
│
├── .claude/                       # Claude Code config
│   └── settings.json
├── .gemini/                       # Gemini CLI config
│   └── settings.json
├── .codex/                        # Codex CLI config
│   └── config.toml
│
├── CLAUDE.md                      # Developer instructions
├── GEMINI.md                      # PM instructions
├── AGENTS.md                      # Architect instructions
├── README.md                      # Project overview
├── CHANGELOG.md                   # Version history
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript config
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
└── Makefile                       # Build automation
```

### 5.2 Initialization Script

```bash
#!/bin/bash
# init-swarm.sh - Initialize HSIS project structure

set -euo pipefail

PROJECT_NAME="${1:-hsis-project}"
echo "Initializing HSIS project: $PROJECT_NAME"

# Create directory structure
mkdir -p "$PROJECT_NAME"/{.swarm/{intake,specs,artifacts,status,logs,escalations},docs/{adrs,templates},src/{components,shared,config},tests/{unit,integration,e2e},scripts,.github/workflows,.claude,.gemini,.codex}

cd "$PROJECT_NAME"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.js.map

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# HSIS
.swarm/logs/
.swarm/status/
*.tmp

# Credentials
.claude/credentials
.gemini/credentials
EOF

# Create .env.example
cat > .env.example << 'EOF'
# API Keys (DO NOT commit actual values)
ANTHROPIC_API_KEY=sk-ant-api03-xxx
GOOGLE_AI_API_KEY=AIza-xxx
OPENAI_API_KEY=sk-xxx
BRAVE_API_KEY=BSA-xxx
GITHUB_TOKEN=ghp_xxx

# Application Configuration
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "hsis-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "swarm:init": "./scripts/init-swarm.sh",
    "swarm:run": "./scripts/swarm-orchestrator.sh run",
    "swarm:pm": "./scripts/swarm-orchestrator.sh pm",
    "swarm:arch": "./scripts/swarm-orchestrator.sh arch",
    "swarm:dev": "./scripts/swarm-orchestrator.sh dev"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "jest": "^29.0.0",
    "@playwright/test": "^1.40.0"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules"]
}
EOF

# Create README.md
cat > README.md << 'EOF'
# HSIS Project

This project uses the Hierarchical Specialized Intelligence Swarm (HSIS) workflow.

## Agents

- **PM (Gemini CLI)**: Requirements → PRD
- **Architect (Codex CLI)**: PRD → Technical Specification
- **Developer (Claude Code CLI)**: Specification → Implementation

## Quick Start

```bash
# Initialize swarm directories
npm run swarm:init

# Add requirements to .swarm/intake/
# Then run the full workflow
npm run swarm:run

# Or run individual phases
npm run swarm:pm
npm run swarm:arch
npm run swarm:dev
```

## Documentation

- [PRD](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
EOF

echo "✓ HSIS project initialized: $PROJECT_NAME"
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  npm install"
echo "  # Add requirements to .swarm/intake/"
echo "  npm run swarm:run"
```

---

## 6. Shell Orchestration System

### 6.1 Main Orchestrator Script

```bash
#!/bin/bash
# swarm-orchestrator.sh - Main HSIS orchestration script

set -euo pipefail

# Configuration
SWARM_DIR=".swarm"
TIMEOUT_SECONDS=1800  # 30 minutes per agent
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() { echo -e "${GREEN}[SWARM]${NC} $(date '+%H:%M:%S') $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $(date '+%H:%M:%S') $1"; }
error() { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $1"; exit 1; }
info() { echo -e "${BLUE}[INFO]${NC} $(date '+%H:%M:%S') $1"; }

# Initialize swarm directory structure
init_swarm() {
    log "Initializing swarm workspace..."
    mkdir -p "$SWARM_DIR"/{intake,specs,artifacts,status,logs,escalations}
    rm -f "$SWARM_DIR"/status/*  # Clear previous run markers
    log "Swarm workspace initialized ✓"
}

# Gate check: verify required artifacts exist and are valid
check_gate() {
    local gate_name=$1
    shift
    local artifacts=("$@")

    log "Checking gate: $gate_name"
    local failed=0

    for artifact in "${artifacts[@]}"; do
        if [[ ! -f "$artifact" ]]; then
            warn "Gate '$gate_name' missing artifact: $artifact"
            failed=1
        elif [[ ! -s "$artifact" ]]; then
            warn "Gate '$gate_name' artifact is empty: $artifact"
            failed=1
        fi
    done

    if [[ $failed -eq 1 ]]; then
        error "Gate '$gate_name' FAILED - missing required artifacts"
    fi

    log "Gate '$gate_name' PASSED ✓"
}

# Validate JSON artifact
validate_json() {
    local file=$1
    local schema_name=$2

    if ! jq empty "$file" 2>/dev/null; then
        error "Invalid JSON in $file"
    fi

    # Additional schema validation could go here
    log "JSON validation passed: $file"
}

# Run PM Agent (Gemini CLI)
run_pm() {
    log "═══════════════════════════════════════"
    log "Starting PM Phase (Gemini CLI)"
    log "═══════════════════════════════════════"

    # Check for intake
    if [[ ! -d "$SWARM_DIR/intake" ]] || [[ -z "$(ls -A $SWARM_DIR/intake 2>/dev/null)" ]]; then
        error "No requirements found in $SWARM_DIR/intake/"
    fi

    local intake_files=$(ls -1 "$SWARM_DIR/intake/"*.md 2>/dev/null | wc -l)
    info "Found $intake_files intake file(s)"

    # Execute Gemini CLI
    log "Executing Gemini CLI..."

    local pm_prompt="You are the Product Manager. Read all requirements from .swarm/intake/ and produce:
1. A comprehensive PRD at docs/PRD.md following the GEMINI.md specification
2. Update status when complete

Start by reading the intake files, then create the PRD with all required sections.
When finished, confirm completion with a summary of what was created."

    timeout "$TIMEOUT_SECONDS" gemini -p "$pm_prompt" \
        --output-format json \
        > "$SWARM_DIR/logs/pm.json" 2>&1 || {
            local exit_code=$?
            if [[ $exit_code -eq 124 ]]; then
                error "PM Agent timed out after ${TIMEOUT_SECONDS}s"
            else
                error "PM Agent failed with exit code $exit_code"
            fi
        }

    # Validate PM output
    check_gate "pm-complete" "docs/PRD.md"

    # Create completion artifact
    cat > "$SWARM_DIR/artifacts/pm-complete.json" << EOF
{
    "status": "complete",
    "timestamp": "$(date -Iseconds)",
    "artifacts": ["docs/PRD.md"],
    "agent": "gemini-cli"
}
EOF

    touch "$SWARM_DIR/status/pm-ready"
    log "PM Phase COMPLETE ✓"
    log ""
}

# Run Architect Agent (Codex CLI)
run_architect() {
    log "═══════════════════════════════════════"
    log "Starting Architect Phase (Codex CLI)"
    log "═══════════════════════════════════════"

    # Check PM gate
    if [[ ! -f "$SWARM_DIR/status/pm-ready" ]]; then
        error "PM gate not passed - run PM phase first"
    fi

    check_gate "pm-gate" "docs/PRD.md"

    # Execute Codex CLI
    log "Executing Codex CLI..."

    local arch_prompt="You are the Software Architect. Read the approved PRD at docs/PRD.md and produce:
1. Architecture Specification at docs/ARCHITECTURE.md
2. Implementation Plan at docs/IMPLEMENTATION_PLAN.md
3. ADRs in docs/adrs/ for significant decisions
4. Task specification at .swarm/specs/current-task.json

Follow the AGENTS.md specification exactly. Ensure complete requirement traceability.
When finished, confirm completion with a summary."

    timeout "$TIMEOUT_SECONDS" codex exec "$arch_prompt" \
        --full-auto \
        --sandbox workspace-write \
        --json \
        > "$SWARM_DIR/logs/architect.json" 2>&1 || {
            local exit_code=$?
            if [[ $exit_code -eq 124 ]]; then
                error "Architect Agent timed out after ${TIMEOUT_SECONDS}s"
            else
                error "Architect Agent failed with exit code $exit_code"
            fi
        }

    # Validate Architect output
    check_gate "architect-complete" \
        "docs/ARCHITECTURE.md" \
        "docs/IMPLEMENTATION_PLAN.md" \
        "$SWARM_DIR/specs/current-task.json"

    validate_json "$SWARM_DIR/specs/current-task.json" "task-spec"

    # Create completion artifact
    cat > "$SWARM_DIR/artifacts/architect-complete.json" << EOF
{
    "status": "complete",
    "timestamp": "$(date -Iseconds)",
    "artifacts": [
        "docs/ARCHITECTURE.md",
        "docs/IMPLEMENTATION_PLAN.md",
        ".swarm/specs/current-task.json"
    ],
    "agent": "codex-cli"
}
EOF

    touch "$SWARM_DIR/status/architect-ready"
    log "Architect Phase COMPLETE ✓"
    log ""
}

# Run Developer Agent (Claude Code CLI)
run_developer() {
    log "═══════════════════════════════════════"
    log "Starting Developer Phase (Claude Code CLI)"
    log "═══════════════════════════════════════"

    # Check Architect gate
    if [[ ! -f "$SWARM_DIR/status/architect-ready" ]]; then
        error "Architect gate not passed - run Architect phase first"
    fi

    check_gate "architect-gate" \
        "docs/ARCHITECTURE.md" \
        "docs/IMPLEMENTATION_PLAN.md" \
        "$SWARM_DIR/specs/current-task.json"

    # Execute Claude Code CLI
    log "Executing Claude Code CLI..."

    local dev_prompt="You are the Senior Developer. Execute the task in .swarm/specs/current-task.json.

Follow the architecture in docs/ARCHITECTURE.md exactly.
Implement code in src/ and tests in tests/.
Run all quality checks (lint, type-check, test).
Create completion report at .swarm/artifacts/dev-complete.json.

Start by reading the task specification, then implement systematically."

    timeout "$TIMEOUT_SECONDS" claude -p "$dev_prompt" \
        --output-format json \
        --allowedTools "Bash(npm run:*),Bash(npx:*),Read,Write,Edit" \
        > "$SWARM_DIR/logs/developer.json" 2>&1 || {
            local exit_code=$?
            if [[ $exit_code -eq 124 ]]; then
                error "Developer Agent timed out after ${TIMEOUT_SECONDS}s"
            else
                error "Developer Agent failed with exit code $exit_code"
            fi
        }

    # Validate Developer output
    check_gate "developer-complete" "$SWARM_DIR/artifacts/dev-complete.json"
    validate_json "$SWARM_DIR/artifacts/dev-complete.json" "dev-complete"

    touch "$SWARM_DIR/status/dev-ready"
    log "Developer Phase COMPLETE ✓"
    log ""
}

# Review cycle: PM reviews developer output
run_review() {
    log "═══════════════════════════════════════"
    log "Starting Review Phase"
    log "═══════════════════════════════════════"

    # Check Developer gate
    if [[ ! -f "$SWARM_DIR/status/dev-ready" ]]; then
        error "Developer gate not passed - run Developer phase first"
    fi

    check_gate "developer-gate" "$SWARM_DIR/artifacts/dev-complete.json"

    # Execute review with Gemini
    log "PM reviewing implementation..."

    local review_prompt="Review the developer's work:
- Completion report: .swarm/artifacts/dev-complete.json
- Acceptance criteria: docs/PRD.md (Section 5: Functional Requirements)

Verify all acceptance criteria are met. Check test evidence.

Output your decision to .swarm/status/review-result.txt:
- Write 'APPROVED' if all criteria met
- Write 'REVISIONS_NEEDED' if changes required

If revisions needed, also write feedback to .swarm/escalations/revision-request.md"

    timeout 600 gemini -p "$review_prompt" \
        --output-format json \
        > "$SWARM_DIR/logs/review.json" 2>&1 || {
            warn "Review phase had issues - check logs"
        }

    # Check review result
    if [[ -f "$SWARM_DIR/status/review-result.txt" ]]; then
        local result=$(cat "$SWARM_DIR/status/review-result.txt" | tr -d '[:space:]')
        if [[ "$result" == "APPROVED" ]]; then
            log "═══════════════════════════════════════"
            log "✓ FEATURE APPROVED - Ready for Release"
            log "═══════════════════════════════════════"
            touch "$SWARM_DIR/status/approved"
        else
            warn "Revisions requested - check .swarm/escalations/revision-request.md"
        fi
    else
        warn "Review result file not created - manual review needed"
    fi
}

# Show status
show_status() {
    echo ""
    echo "═══════════════════════════════════════"
    echo "         HSIS Workflow Status          "
    echo "═══════════════════════════════════════"
    echo ""

    # Check each gate
    local pm_status="⏳ Pending"
    local arch_status="⏳ Pending"
    local dev_status="⏳ Pending"
    local review_status="⏳ Pending"

    [[ -f "$SWARM_DIR/status/pm-ready" ]] && pm_status="✓ Complete"
    [[ -f "$SWARM_DIR/status/architect-ready" ]] && arch_status="✓ Complete"
    [[ -f "$SWARM_DIR/status/dev-ready" ]] && dev_status="✓ Complete"
    [[ -f "$SWARM_DIR/status/approved" ]] && review_status="✓ Approved"

    echo "  PM Phase:        $pm_status"
    echo "  Architect Phase: $arch_status"
    echo "  Developer Phase: $dev_status"
    echo "  Review Phase:    $review_status"
    echo ""

    # Show artifacts
    echo "Artifacts:"
    [[ -f "docs/PRD.md" ]] && echo "  ✓ docs/PRD.md"
    [[ -f "docs/ARCHITECTURE.md" ]] && echo "  ✓ docs/ARCHITECTURE.md"
    [[ -f "docs/IMPLEMENTATION_PLAN.md" ]] && echo "  ✓ docs/IMPLEMENTATION_PLAN.md"
    [[ -f "$SWARM_DIR/specs/current-task.json" ]] && echo "  ✓ .swarm/specs/current-task.json"
    [[ -f "$SWARM_DIR/artifacts/dev-complete.json" ]] && echo "  ✓ .swarm/artifacts/dev-complete.json"
    echo ""
}

# Main workflow
main() {
    echo ""
    log "═══════════════════════════════════════"
    log "  HIERARCHICAL SPECIALIZED INTELLIGENCE"
    log "              SWARM (HSIS)             "
    log "═══════════════════════════════════════"
    log ""
    log "PM: Gemini CLI | Architect: Codex CLI | Developer: Claude Code CLI"
    log ""

    init_swarm

    # Check for intake
    if [[ ! -d "$SWARM_DIR/intake" ]] || [[ -z "$(ls -A $SWARM_DIR/intake 2>/dev/null)" ]]; then
        error "No requirements found in $SWARM_DIR/intake/"
    fi

    # Sequential execution with gates
    run_pm
    run_architect
    run_developer
    run_review

    log ""
    log "═══════════════════════════════════════"
    log "       Swarm Workflow Complete!        "
    log "═══════════════════════════════════════"
    log ""
    log "Logs available in: $SWARM_DIR/logs/"
    log "Artifacts in: $SWARM_DIR/artifacts/"
    show_status
}

# Handle arguments
case "${1:-run}" in
    init)    init_swarm ;;
    pm)      run_pm ;;
    arch)    run_architect ;;
    dev)     run_developer ;;
    review)  run_review ;;
    status)  show_status ;;
    run)     main ;;
    help|--help|-h)
        echo "HSIS Swarm Orchestrator"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  init    - Initialize swarm directory structure"
        echo "  pm      - Run PM phase only (Gemini CLI)"
        echo "  arch    - Run Architect phase only (Codex CLI)"
        echo "  dev     - Run Developer phase only (Claude Code CLI)"
        echo "  review  - Run Review phase only"
        echo "  status  - Show current workflow status"
        echo "  run     - Run complete workflow (default)"
        echo "  help    - Show this help message"
        ;;
    *)
        error "Unknown command: $1. Use '$0 help' for usage."
        ;;
esac
```

Save this as `scripts/swarm-orchestrator.sh` and make executable:

```bash
chmod +x scripts/swarm-orchestrator.sh
```

---

---

## 7. Artifact Templates

### 7.1 PRD Template

```markdown
# Product Requirements Document
## [PROJECT_NAME] — Version [X.Y.Z]

**Document Status:** [DRAFT | REVIEW | APPROVED]
**Owner:** [PM Agent / Stakeholder Name]
**Created:** [YYYY-MM-DD]
**Last Updated:** [YYYY-MM-DD]

---

### 1. Problem Statement

[Single paragraph: What problem exists? Who has it? Why does it matter now?]

### 2. Target Users

| User Persona | Description | Primary Need | Pain Points |
|--------------|-------------|--------------|-------------|
| [Persona 1] | [Demographics, role] | [Main goal] | [Current frustrations] |
| [Persona 2] | [...] | [...] | [...] |

### 3. Use Cases

#### UC-001: [Title]
- **Actor:** [User persona]
- **Precondition:** [System state before]
- **Trigger:** [What initiates this use case]
- **Flow:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Postcondition:** [System state after]
- **Acceptance Criteria:**
  - [ ] [Testable statement 1]
  - [ ] [Testable statement 2]

#### UC-002: [Title]
[Same structure...]

#### UC-003: [Title]
[Same structure...]

### 4. Scope

#### 4.1 In-Scope
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

#### 4.2 Out-of-Scope
| Item | Rationale | Future Consideration |
|------|-----------|---------------------|
| [Feature] | [Why excluded] | [MVP+1 / Never / TBD] |

### 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | [Testable statement] | Must | [Measurable criteria] |
| FR-002 | [Testable statement] | Must | [Measurable criteria] |
| FR-003 | [Testable statement] | Should | [Measurable criteria] |
| FR-004 | [Testable statement] | Could | [Measurable criteria] |

### 6. Non-Functional Requirements

| ID | Category | Requirement | Target | Measurement Method |
|----|----------|-------------|--------|-------------------|
| NFR-001 | Performance | [Statement] | [Value] | [How to verify] |
| NFR-002 | Security | [Statement] | [Standard] | [Audit method] |
| NFR-003 | Availability | [Statement] | [SLA %] | [Monitoring] |
| NFR-004 | Scalability | [Statement] | [Metric] | [Load test] |

### 7. Risks, Assumptions, Open Questions

#### 7.1 Risks
| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-001 | [Description] | H/M/L | H/M/L | [Strategy] |

#### 7.2 Assumptions
| ID | Assumption | Validation Method | Risk if Invalid |
|----|------------|-------------------|-----------------|
| A-001 | [Statement] | [How to verify] | [Impact] |

#### 7.3 Open Questions
| ID | Question | Status | Owner | Due Date |
|----|----------|--------|-------|----------|
| OQ-001 | [Question] | BLOCKER | [Role] | [Date] |
| OQ-002 | [Question] | NON-BLOCKER | [Role] | [Date] |

### 8. Success Metrics

| Metric | Baseline | Target | Telemetry Signal |
|--------|----------|--------|------------------|
| [KPI Name] | [Current value] | [Goal] | [Event/Log to track] |

### 9. Release Plan

| Phase | Scope | Success Criteria | Target Date |
|-------|-------|------------------|-------------|
| MVP | FR-001, FR-002 | [Criteria] | [Date] |
| V1 | FR-003, FR-004 | [Criteria] | [Date] |
| V2 | [Future FRs] | [Criteria] | [Date] |

### 10. Appendices

- [Link to user research]
- [Link to competitive analysis]
- [Link to technical constraints]

---

**Approval:**
- [ ] Stakeholder Sign-off: _________________ Date: _______
- [ ] PM Sign-off: _________________ Date: _______
```

### 7.2 Architecture Specification Template

```markdown
# Architecture Specification
## [PROJECT_NAME] — Version [X.Y.Z]

**Document Status:** [DRAFT | REVIEW | APPROVED]
**PRD Version:** [X.Y.Z]
**Architect:** [Codex CLI / Architect Name]
**Created:** [YYYY-MM-DD]

---

### 1. System Overview

[2-3 paragraphs describing the system at a high level: purpose, main components,
key interactions, and how it fulfills the PRD requirements.]

### 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      [SYSTEM NAME]                          │
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

| Component | Single Responsibility | Owns | Depends On |
|-----------|----------------------|------|------------|
| [Name] | [One clear purpose] | [Data/Process] | [Other components] |

### 4. Requirement Traceability Matrix

| Requirement ID | Design Element | Component | Test Type |
|----------------|----------------|-----------|-----------|
| FR-001 | [API endpoint/Class/Module] | [Component] | Unit/Integration/E2E |
| FR-002 | [API endpoint/Class/Module] | [Component] | Unit/Integration/E2E |
| NFR-001 | [Pattern/Configuration] | [Component] | Performance/Security |

### 5. Data Model

#### 5.1 Entity Definitions

```
Entity: User
├── id: UUID (PK)
├── email: string (unique, indexed)
├── password_hash: string
├── created_at: timestamp
└── updated_at: timestamp

Entity: [EntityName]
├── ...
└── ...

Relationships:
- User 1:N Order via user_id
- Order N:1 Product via product_id
```

#### 5.2 State Machines

```
Order States:
CREATED → PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED
                         ↘ CANCELLED ↗         ↘ RETURNED ↗
```

### 6. API Contracts

#### 6.1 Endpoint Summary

| Method | Path | Request | Response | Auth | Rate Limit |
|--------|------|---------|----------|------|------------|
| POST | /api/v1/users | CreateUserRequest | User | None | 10/min |
| GET | /api/v1/users/:id | - | User | Bearer | 100/min |

#### 6.2 Request/Response Schemas

```json
// POST /api/v1/users - CreateUserRequest
{
  "email": "string (required, email format)",
  "password": "string (required, min 8 chars)",
  "name": "string (optional, max 100 chars)"
}

// Response: User
{
  "id": "uuid",
  "email": "string",
  "name": "string | null",
  "created_at": "ISO8601 timestamp"
}
```

#### 6.3 Error Model

| Code | HTTP Status | Message Template | Retry |
|------|-------------|------------------|-------|
| E-VAL-001 | 400 | "Invalid {field}: {reason}" | No |
| E-AUTH-001 | 401 | "Authentication required" | No |
| E-AUTH-002 | 403 | "Insufficient permissions" | No |
| E-RES-001 | 404 | "Resource not found: {type}/{id}" | No |
| E-RES-002 | 409 | "Conflict: {reason}" | Maybe |
| E-SYS-001 | 500 | "Internal error (ref: {correlation_id})" | Yes |

### 7. Security Model

#### 7.1 Authentication
- **Method:** JWT Bearer tokens
- **Token Lifetime:** Access: 15min, Refresh: 7 days
- **Algorithm:** RS256

#### 7.2 Authorization
| Resource | Action | Required Permission |
|----------|--------|---------------------|
| /users | CREATE | public |
| /users/:id | READ | user:read (own) or admin |
| /users/:id | UPDATE | user:write (own) or admin |

#### 7.3 Secrets Management
- **Storage:** Environment variables (dev), AWS Secrets Manager (prod)
- **Rotation:** 90-day policy
- **Access:** Least privilege, audited

### 8. Observability

#### 8.1 Logging
| Event | Level | Required Fields | Retention |
|-------|-------|-----------------|-----------|
| Request received | INFO | trace_id, method, path | 30 days |
| Request completed | INFO | trace_id, status, duration_ms | 30 days |
| Error occurred | ERROR | trace_id, error_code, stack | 90 days |

#### 8.2 Metrics
| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|-----------------|
| http_requests_total | Counter | method, path, status | N/A |
| http_request_duration_ms | Histogram | method, path | p99 > 500ms |

### 9. Performance Budget

| NFR ID | Metric | Target | Measurement |
|--------|--------|--------|-------------|
| NFR-001 | API p99 latency | < 200ms | Load test at 1000 RPS |
| NFR-002 | Throughput | > 1000 RPS | Sustained 5 minutes |

### 10. Test Strategy

| Test Type | Scope | Tool | Coverage Target |
|-----------|-------|------|-----------------|
| Unit | Functions, classes | Jest | >= 80% lines |
| Integration | API endpoints | Supertest | All endpoints |
| E2E | User journeys | Playwright | All use cases |
| Performance | NFR validation | k6 | All NFR-perf |

### 11. Definition of Done

- [ ] All code compiles without errors
- [ ] All unit tests pass (>= 80% coverage)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Zero lint errors
- [ ] Zero type errors
- [ ] Security scan passes (0 critical/high)
- [ ] Documentation updated

---

**Approval:**
- [ ] Architect Sign-off: _________________ Date: _______
```

### 7.3 ADR Template

```markdown
# ADR-[###]: [Decision Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-###]
**Date:** [YYYY-MM-DD]
**Deciders:** [Architect, with PM input if product-impacting]

## Context

[What is the issue? Why does it need a decision?]

**Related Requirements:**
- FR-###: [Brief description]
- NFR-###: [Brief description]

## Decision

[What is the change being proposed/adopted? Be specific.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Tradeoff 1]
- [Tradeoff 2]

### Neutral
- [Side effect that is neither positive nor negative]

## Alternatives Considered

### Alternative 1: [Name]
- **Description:** [Brief explanation]
- **Pros:** [List]
- **Cons:** [List]
- **Rejection Reason:** [Why not chosen]

### Alternative 2: [Name]
- **Description:** [Brief explanation]
- **Pros:** [List]
- **Cons:** [List]
- **Rejection Reason:** [Why not chosen]

## References

- [Link to relevant documentation]
- [Link to PRD section]
- [Link to related ADRs]
```

### 7.4 Handoff Document Template

```markdown
# Handoff: [Source Role] → [Target Role]
## [PROJECT_NAME] — [YYYY-MM-DD]

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
| OQ-001 | [Question] | BLOCKER/NON-BLOCKER | [Role] | [Description] |

### 5. Next Role Instructions

[Single paragraph with explicit, unambiguous instructions for what the receiving
role should do. Include specific artifact paths to consume and expected outputs.]

---

**Handoff Issued By:** [Role]
**Handoff Date:** [YYYY-MM-DD HH:MM UTC]
**Handoff ID:** [HO-PM-ARCH-001]
```

### 7.5 Escalation Note Template

```markdown
# Escalation Note
## From: [Source Role] → To: [Target Role]
## [YYYY-MM-DD] — Priority: [BLOCKER | HIGH | MEDIUM]

### 1. Issue Statement

[Single sentence describing the blocking issue]

### 2. Evidence

**Requirement Reference(s):**
- FR-###: [Description]
- Section: [Document:Section reference]

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

### 4. Recommendation

[Single sentence: Which option is recommended and why]

### 5. Required Decision-Maker

[PM | Architect | Human Stakeholder]

### 6. Response Deadline

[Date/Time if BLOCKER, otherwise "At convenience"]

---

**Escalation ID:** ESC-[ROLE]-[###]
**Created:** [Timestamp]
**Status:** [OPEN | RESOLVED | SUPERSEDED]
```

---

## 8. Gate Automation

### 8.1 PM Gate Validator Script

```bash
#!/bin/bash
# verify-pm-gate.sh - Validate PM phase completion

set -euo pipefail

PRD_FILE="docs/PRD.md"
GATE_RESULT=0

echo "═══════════════════════════════════════"
echo "      PM Gate Validation              "
echo "═══════════════════════════════════════"

# Check PRD exists
if [[ ! -f "$PRD_FILE" ]]; then
    echo "✗ PRD file missing: $PRD_FILE"
    exit 1
fi

echo "Checking PRD: $PRD_FILE"
echo ""

# Check required sections
check_section() {
    local pattern="$1"
    local name="$2"
    if grep -q "$pattern" "$PRD_FILE"; then
        echo "✓ $name"
    else
        echo "✗ $name - MISSING"
        GATE_RESULT=1
    fi
}

echo "Required Sections:"
check_section "## 1\. Problem Statement\|### 1\. Problem Statement" "Problem Statement"
check_section "## 2\. Target Users\|### 2\. Target Users" "Target Users"
check_section "UC-001\|#### UC-001" "Use Case UC-001"
check_section "UC-002\|#### UC-002" "Use Case UC-002"
check_section "UC-003\|#### UC-003" "Use Case UC-003"
check_section "## 4\. Scope\|### 4\. Scope" "Scope"
check_section "In-Scope\|#### 4.1 In-Scope" "In-Scope"
check_section "Out-of-Scope\|#### 4.2 Out-of-Scope" "Out-of-Scope"
check_section "## 5\. Functional Requirements\|### 5\. Functional Requirements" "Functional Requirements"
check_section "## 6\. Non-Functional Requirements\|### 6\. Non-Functional Requirements" "Non-Functional Requirements"
check_section "## 7\. Risks\|### 7\. Risks" "Risks Section"
check_section "## 8\. Success Metrics\|### 8\. Success Metrics" "Success Metrics"
check_section "## 9\. Release Plan\|### 9\. Release Plan" "Release Plan"

echo ""
echo "Requirement IDs:"

# Check for FR-### pattern
fr_count=$(grep -oE 'FR-[0-9]{3}' "$PRD_FILE" | sort -u | wc -l)
if [[ $fr_count -ge 1 ]]; then
    echo "✓ Functional Requirements: $fr_count found"
else
    echo "✗ No FR-### IDs found"
    GATE_RESULT=1
fi

# Check for NFR-### pattern
nfr_count=$(grep -oE 'NFR-[0-9]{3}' "$PRD_FILE" | sort -u | wc -l)
if [[ $nfr_count -ge 1 ]]; then
    echo "✓ Non-Functional Requirements: $nfr_count found"
else
    echo "✗ No NFR-### IDs found"
    GATE_RESULT=1
fi

echo ""
echo "Acceptance Criteria:"
# Check that acceptance criteria exist
ac_count=$(grep -ic "acceptance" "$PRD_FILE" || true)
if [[ $ac_count -ge 3 ]]; then
    echo "✓ Acceptance criteria references: $ac_count found"
else
    echo "⚠ Limited acceptance criteria references: $ac_count found"
fi

echo ""
echo "═══════════════════════════════════════"
if [[ $GATE_RESULT -eq 0 ]]; then
    echo "        PM GATE: PASSED ✓             "
else
    echo "        PM GATE: FAILED ✗             "
fi
echo "═══════════════════════════════════════"

exit $GATE_RESULT
```

### 8.2 Architect Gate Validator Script

```bash
#!/bin/bash
# verify-architect-gate.sh - Validate Architect phase completion

set -euo pipefail

ARCH_FILE="docs/ARCHITECTURE.md"
IMPL_FILE="docs/IMPLEMENTATION_PLAN.md"
TASK_FILE=".swarm/specs/current-task.json"
PRD_FILE="docs/PRD.md"
GATE_RESULT=0

echo "═══════════════════════════════════════"
echo "    Architect Gate Validation          "
echo "═══════════════════════════════════════"

# Check required files exist
check_file() {
    if [[ -f "$1" ]]; then
        echo "✓ File exists: $1"
    else
        echo "✗ File missing: $1"
        GATE_RESULT=1
    fi
}

echo "Required Files:"
check_file "$ARCH_FILE"
check_file "$IMPL_FILE"
check_file "$TASK_FILE"

echo ""
echo "Architecture Specification:"

if [[ -f "$ARCH_FILE" ]]; then
    # Check sections
    check_section() {
        if grep -q "$1" "$ARCH_FILE"; then
            echo "✓ $2"
        else
            echo "✗ $2 - MISSING"
            GATE_RESULT=1
        fi
    }

    check_section "System Overview\|## 1\." "System Overview"
    check_section "Architecture Diagram\|## 2\." "Architecture Diagram"
    check_section "Component\|## 3\." "Component Responsibilities"
    check_section "Traceability\|## 4\." "Traceability Matrix"
    check_section "Data Model\|## 5\." "Data Model"
    check_section "API\|## 6\." "API Contracts"
    check_section "Security\|## 7\." "Security Model"
fi

echo ""
echo "Traceability Check:"

if [[ -f "$PRD_FILE" ]] && [[ -f "$ARCH_FILE" ]]; then
    # Extract FR IDs from PRD
    prd_frs=$(grep -oE 'FR-[0-9]{3}' "$PRD_FILE" | sort -u)

    # Check each FR is in Architecture
    missing_count=0
    for fr in $prd_frs; do
        if ! grep -q "$fr" "$ARCH_FILE"; then
            echo "✗ $fr not traced in Architecture"
            missing_count=$((missing_count + 1))
            GATE_RESULT=1
        fi
    done

    if [[ $missing_count -eq 0 ]]; then
        echo "✓ All FRs traced to architecture"
    fi
fi

echo ""
echo "Task Specification:"

if [[ -f "$TASK_FILE" ]]; then
    # Validate JSON
    if jq empty "$TASK_FILE" 2>/dev/null; then
        echo "✓ Valid JSON"

        # Check required fields
        for field in task_id title requirements components; do
            if jq -e ".$field" "$TASK_FILE" > /dev/null 2>&1; then
                echo "✓ Field: $field"
            else
                echo "✗ Missing field: $field"
                GATE_RESULT=1
            fi
        done
    else
        echo "✗ Invalid JSON in task specification"
        GATE_RESULT=1
    fi
fi

echo ""
echo "═══════════════════════════════════════"
if [[ $GATE_RESULT -eq 0 ]]; then
    echo "     Architect GATE: PASSED ✓         "
else
    echo "     Architect GATE: FAILED ✗         "
fi
echo "═══════════════════════════════════════"

exit $GATE_RESULT
```

### 8.3 Developer Gate Validator Script

```bash
#!/bin/bash
# verify-developer-gate.sh - Validate Developer phase completion

set -euo pipefail

DEV_COMPLETE=".swarm/artifacts/dev-complete.json"
GATE_RESULT=0

echo "═══════════════════════════════════════"
echo "     Developer Gate Validation         "
echo "═══════════════════════════════════════"

# Check completion artifact exists
if [[ ! -f "$DEV_COMPLETE" ]]; then
    echo "✗ Completion artifact missing: $DEV_COMPLETE"
    exit 1
fi

echo "Completion Artifact: $DEV_COMPLETE"
echo ""

# Validate JSON
if ! jq empty "$DEV_COMPLETE" 2>/dev/null; then
    echo "✗ Invalid JSON"
    exit 1
fi

echo "✓ Valid JSON"

# Check status
status=$(jq -r '.status' "$DEV_COMPLETE")
if [[ "$status" == "complete" ]]; then
    echo "✓ Status: complete"
else
    echo "✗ Status: $status (expected: complete)"
    GATE_RESULT=1
fi

# Check test results
echo ""
echo "Test Results:"

unit_passed=$(jq -r '.test_results.unit.passed // 0' "$DEV_COMPLETE")
unit_failed=$(jq -r '.test_results.unit.failed // 0' "$DEV_COMPLETE")
int_passed=$(jq -r '.test_results.integration.passed // 0' "$DEV_COMPLETE")
int_failed=$(jq -r '.test_results.integration.failed // 0' "$DEV_COMPLETE")
coverage=$(jq -r '.test_results.coverage // "0%"' "$DEV_COMPLETE")

echo "  Unit Tests: $unit_passed passed, $unit_failed failed"
echo "  Integration Tests: $int_passed passed, $int_failed failed"
echo "  Coverage: $coverage"

if [[ $unit_failed -gt 0 ]] || [[ $int_failed -gt 0 ]]; then
    echo "✗ Test failures detected"
    GATE_RESULT=1
else
    echo "✓ All tests passing"
fi

# Check coverage threshold
coverage_num=${coverage%\%}
if [[ $coverage_num -ge 80 ]]; then
    echo "✓ Coverage meets threshold (>= 80%)"
else
    echo "✗ Coverage below threshold: $coverage (need >= 80%)"
    GATE_RESULT=1
fi

# Check quality checks
echo ""
echo "Quality Checks:"

lint=$(jq -r '.quality_checks.lint // "unknown"' "$DEV_COMPLETE")
typecheck=$(jq -r '.quality_checks.type_check // "unknown"' "$DEV_COMPLETE")
security=$(jq -r '.quality_checks.security_scan // "unknown"' "$DEV_COMPLETE")

[[ "$lint" == "pass" ]] && echo "✓ Lint: pass" || { echo "✗ Lint: $lint"; GATE_RESULT=1; }
[[ "$typecheck" == "pass" ]] && echo "✓ Type Check: pass" || { echo "✗ Type Check: $typecheck"; GATE_RESULT=1; }
[[ "$security" == "pass" ]] && echo "✓ Security Scan: pass" || { echo "⚠ Security Scan: $security"; }

# Check for deviations
echo ""
deviations=$(jq -r '.deviations | length' "$DEV_COMPLETE")
if [[ $deviations -eq 0 ]]; then
    echo "✓ No deviations from specification"
else
    echo "⚠ Deviations reported: $deviations"
    jq -r '.deviations[]' "$DEV_COMPLETE"
fi

echo ""
echo "═══════════════════════════════════════"
if [[ $GATE_RESULT -eq 0 ]]; then
    echo "     Developer GATE: PASSED ✓         "
else
    echo "     Developer GATE: FAILED ✗         "
fi
echo "═══════════════════════════════════════"

exit $GATE_RESULT
```

---

## 9. Communication Protocols

### 9.1 Escalation Routing Rules

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

### 9.2 Escalation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESCALATION PROTOCOL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Developer ──────────────────────► Architect                   │
│       │                                  │                       │
│       │ (Spec issues)                    │ (Req issues)         │
│       │                                  ▼                       │
│       │                              ┌──────┐                   │
│       │                              │  PM  │                   │
│       │                              └──┬───┘                   │
│       │                                 │                        │
│       │  (Security/Resource)            │ (Policy decisions)    │
│       │         │                       │                        │
│       └─────────┼───────────────────────┘                       │
│                 ▼                                                │
│         ┌────────────────┐                                      │
│         │ Human Decision │                                      │
│         │    Maker       │                                      │
│         └────────────────┘                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Quality Assurance Integration

### 10.1 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: HSIS CI Pipeline

on:
  push:
    branches: [main, develop, 'feature/**']
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint
        # Must pass with 0 errors

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript Check
        run: npm run type-check
        # Must pass with 0 errors

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:unit -- --coverage

      - name: Check Coverage Threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage below 80% threshold"
            exit 1
          fi

      - name: Upload Coverage Report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  integration-tests:
    runs-on: ubuntu-latest
    needs: [lint, type-check, unit-tests]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Integration Tests
        run: npm run test:integration

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Dependency Audit
        run: npm audit --audit-level=high
        # Fails on high/critical vulnerabilities

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [integration-tests]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E Tests
        run: npm run test:e2e

      - name: Upload E2E Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  gate-validation:
    runs-on: ubuntu-latest
    needs: [e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4

      - name: Validate Developer Gate
        run: |
          if [[ -f ".swarm/artifacts/dev-complete.json" ]]; then
            ./scripts/verify-developer-gate.sh
          else
            echo "No completion artifact - skipping gate"
          fi
```

---

## 11. Operational Runbook

### 11.1 Starting a New Project

```bash
# 1. Create project directory
mkdir my-hsis-project && cd my-hsis-project

# 2. Initialize HSIS structure
./scripts/init-swarm.sh

# 3. Add your requirement to intake
cat > .swarm/intake/feature-request.md << 'EOF'
# Feature Request: [Your Feature Name]

## Background
[Context and motivation]

## Requirements
[What needs to be built]

## Constraints
[Technical or business constraints]

## Success Criteria
[How we know it's done]
EOF

# 4. Run the swarm
./scripts/swarm-orchestrator.sh run
```

### 11.2 Running Individual Phases

```bash
# PM Phase only
./scripts/swarm-orchestrator.sh pm

# Review PM output
cat docs/PRD.md

# Architect Phase only (requires PM gate passed)
./scripts/swarm-orchestrator.sh arch

# Review Architect output
cat docs/ARCHITECTURE.md
cat docs/IMPLEMENTATION_PLAN.md

# Developer Phase only (requires Architect gate passed)
./scripts/swarm-orchestrator.sh dev

# Review Developer output
cat .swarm/artifacts/dev-complete.json
```

### 11.3 Handling Gate Failures

```bash
# Check which gate failed
./scripts/swarm-orchestrator.sh status

# View logs for the failed phase
cat .swarm/logs/pm.json      # PM phase logs
cat .swarm/logs/architect.json # Architect phase logs
cat .swarm/logs/developer.json # Developer phase logs

# Run specific gate validator
./scripts/verify-pm-gate.sh
./scripts/verify-architect-gate.sh
./scripts/verify-developer-gate.sh

# After fixing issues, re-run the phase
./scripts/swarm-orchestrator.sh [pm|arch|dev]
```

### 11.4 Handling Escalations

```bash
# Check for pending escalations
ls .swarm/escalations/

# View escalation details
cat .swarm/escalations/ESC-*.md

# After decision is made, create response
cat > .swarm/escalations/ESC-001-RESPONSE.md << 'EOF'
# Escalation Response
## Re: ESC-001

### Decision
[Clear statement of decision]

### Rationale
[Why this decision]

### Required Actions
1. [Action for originating role]

### Document Updates
- [ ] [Document]: [Change needed]
EOF

# Re-run the blocked phase
./scripts/swarm-orchestrator.sh [phase]
```

---

## 12. Full-Stack Web App Example

### 12.1 Sample Intake Requirement

```markdown
<!-- .swarm/intake/ecommerce-cart.md -->

# Feature Request: Shopping Cart for E-Commerce Platform

## Background
We are building an e-commerce platform using Next.js 15 and need a fully
functional shopping cart system. Users should be able to add products,
modify quantities, and proceed to checkout.

## Target Users
- Online shoppers browsing our product catalog
- Returning customers with saved preferences

## Requirements

### Functional
1. Add products to cart from product listing or detail page
2. View cart contents with product details, quantities, prices
3. Modify quantity of items in cart (increase, decrease, remove)
4. Calculate subtotal, taxes, and total automatically
5. Persist cart across sessions for logged-in users
6. Support guest checkout (cart stored in local storage)
7. Apply discount/promo codes

### Non-Functional
1. Cart operations should complete in < 200ms
2. Cart state should sync across browser tabs
3. Support 10,000 concurrent cart operations
4. Zero data loss on cart operations

## Constraints
- Must use existing Supabase backend
- Must integrate with existing authentication system
- Must follow existing design system (Tailwind + Framer Motion)
- Must be accessible (WCAG 2.1 AA)

## Success Criteria
- User can complete a full add → modify → checkout flow
- Cart persists correctly for logged-in users
- Guest cart converts to user cart on login
- All acceptance criteria pass automated tests
```

### 12.2 Sample PRD Output (Abbreviated)

```markdown
# Product Requirements Document
## Shopping Cart System — Version 1.0.0

**Status:** APPROVED
**Owner:** PM Agent (Gemini CLI)
**Date:** 2026-01-13

---

### 1. Problem Statement

Online shoppers need a reliable way to collect products before purchase.
Currently, users cannot save items for later or review their selections,
leading to abandoned sessions and lost sales.

### 2. Target Users

| Persona | Description | Primary Need |
|---------|-------------|--------------|
| Casual Shopper | First-time visitor browsing products | Quick add-to-cart from any page |
| Returning Customer | Logged-in user with history | Persistent cart across sessions |
| Power Buyer | High-volume purchaser | Bulk quantity management |

### 3. Use Cases

#### UC-001: Add Product to Cart
- **Actor:** Shopper
- **Precondition:** Product exists and is in stock
- **Flow:**
  1. User views product (listing or detail)
  2. User clicks "Add to Cart"
  3. System adds product with quantity 1
  4. System displays confirmation
  5. Cart icon updates with count
- **Acceptance Criteria:**
  - [ ] Product appears in cart within 200ms
  - [ ] Cart count increments correctly
  - [ ] Confirmation toast displays

[... additional use cases ...]

### 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | User can add product to cart | Must | Product in cart, count updated |
| FR-002 | User can view cart contents | Must | All items visible with details |
| FR-003 | User can modify item quantity | Must | Quantity updates, total recalculates |
| FR-004 | User can remove item from cart | Must | Item removed, total recalculates |
| FR-005 | System calculates totals | Must | Subtotal, tax, total accurate |
| FR-006 | Cart persists for logged-in users | Must | Cart survives logout/login |
| FR-007 | Guest cart uses local storage | Should | Cart persists in same browser |
| FR-008 | User can apply promo code | Should | Discount applies correctly |

### 6. Non-Functional Requirements

| ID | Category | Requirement | Target | Measurement |
|----|----------|-------------|--------|-------------|
| NFR-001 | Performance | Cart operations | < 200ms p99 | Load test |
| NFR-002 | Reliability | No data loss | 0 lost carts | Error monitoring |
| NFR-003 | Scalability | Concurrent ops | 10,000 | Load test |
| NFR-004 | Accessibility | WCAG compliance | 2.1 AA | Automated audit |

[... rest of PRD ...]
```

### 12.3 Sample Architecture Output (Abbreviated)

```markdown
# Architecture Specification
## Shopping Cart System — Version 1.0.0

### 1. System Overview

The Shopping Cart System provides a state management layer for e-commerce
product selection. It integrates with the existing Next.js 15 application
using Zustand for client-side state, with Supabase as the persistence layer
for authenticated users.

### 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├──────────────────────┬──────────────────────────────────────┤
│     Cart UI          │          Cart Store (Zustand)        │
│  - CartDrawer        │   - items[], totals                  │
│  - CartItem          │   - addItem(), removeItem()          │
│  - CartSummary       │   - updateQuantity()                 │
└──────────┬───────────┴────────────────┬─────────────────────┘
           │                            │
           │  React Components          │  State Management
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│   Cart API Routes    │    │      Cart Sync Service           │
│  /api/cart/*         │◄───│  - syncToSupabase()              │
│  - GET, POST, PATCH  │    │  - loadFromSupabase()            │
└──────────┬───────────┘    │  - mergeGuestCart()              │
           │                └──────────────────────────────────┘
           ▼                            │
┌──────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  - carts table                                               │
│  - cart_items table                                          │
│  - Row Level Security                                        │
└──────────────────────────────────────────────────────────────┘
```

### 4. Requirement Traceability Matrix

| Req ID | Design Element | Component | Test Type |
|--------|---------------|-----------|-----------|
| FR-001 | addItem() + CartStore | Cart Store | Unit, Integration |
| FR-002 | CartDrawer + CartItem | Cart UI | Unit, E2E |
| FR-003 | updateQuantity() | Cart Store | Unit |
| FR-004 | removeItem() | Cart Store | Unit |
| FR-005 | calculateTotals() | Cart Store | Unit |
| FR-006 | Cart Sync Service | API + Supabase | Integration |
| FR-007 | localStorage adapter | Cart Store | Unit |
| NFR-001 | Optimistic updates | Cart Store | Performance |

[... rest of architecture ...]
```

### 12.4 Sample Task Specification

```json
{
  "task_id": "CART-001",
  "prd_version": "1.0.0",
  "arch_version": "1.0.0",
  "title": "Implement Shopping Cart Core Functionality",
  "description": "Implement the cart store, UI components, and sync service",
  "requirements": ["FR-001", "FR-002", "FR-003", "FR-004", "FR-005"],
  "components": [
    {
      "name": "CartStore",
      "files_to_create": [
        "src/stores/cart-store.ts",
        "src/stores/cart-types.ts"
      ],
      "interface": "See ARCHITECTURE.md Section 6",
      "tests_required": ["unit"]
    },
    {
      "name": "CartUI",
      "files_to_create": [
        "src/components/cart/CartDrawer.tsx",
        "src/components/cart/CartItem.tsx",
        "src/components/cart/CartSummary.tsx"
      ],
      "tests_required": ["unit", "e2e"]
    },
    {
      "name": "CartAPI",
      "files_to_create": [
        "src/app/api/cart/route.ts",
        "src/app/api/cart/[itemId]/route.ts"
      ],
      "tests_required": ["integration"]
    }
  ],
  "acceptance_tests": [
    "User can add product and see it in cart",
    "User can modify quantity",
    "User can remove item",
    "Totals calculate correctly"
  ],
  "definition_of_done": [
    "All tests passing",
    "Coverage >= 80%",
    "Zero lint errors",
    "Zero type errors"
  ]
}
```

---

## 13. Advanced Topics

### 13.1 Parallel Development with Git Worktrees

```bash
#!/bin/bash
# parallel-dev.sh - Enable parallel agent work

FEATURE_BRANCH="feature/$(date +%Y%m%d-%H%M%S)"

# Create isolated worktrees
setup_worktrees() {
    git worktree add .trees/architect -b "$FEATURE_BRANCH-arch" 2>/dev/null
    git worktree add .trees/developer -b "$FEATURE_BRANCH-dev" 2>/dev/null
}

# Run in parallel after PM completes
run_parallel() {
    # Architect works on design refinement
    (
        cd .trees/architect
        codex exec "Refine API design" --full-auto &
    )

    # Developer sets up scaffolding
    (
        cd .trees/developer
        claude -p "Set up project structure" &
    )

    wait
}

# Merge results
merge_work() {
    git checkout "$FEATURE_BRANCH"
    git merge "$FEATURE_BRANCH-arch" --no-edit
    git merge "$FEATURE_BRANCH-dev" --no-edit
    git worktree remove .trees/architect
    git worktree remove .trees/developer
}
```

### 13.2 Makefile-Based Orchestration

```makefile
# Makefile - Declarative HSIS orchestration

.PHONY: all pm architect developer review clean status

SWARM := .swarm
SPECS := $(SWARM)/specs
ARTIFACTS := $(SWARM)/artifacts
LOGS := $(SWARM)/logs

all: review

# PM produces PRD from intake
docs/PRD.md: $(SWARM)/intake/*
	@echo "═══ Running PM Phase ═══"
	@mkdir -p $(SPECS) $(LOGS)
	@gemini -p "Create PRD from .swarm/intake/" --output-format json > $(LOGS)/pm.json
	@test -f $@ || (echo "PM failed" && exit 1)
	@touch $(SWARM)/status/pm-ready

pm: docs/PRD.md

# Architect produces specs from PRD
$(SPECS)/current-task.json: docs/PRD.md
	@echo "═══ Running Architect Phase ═══"
	@codex exec "Create tech spec" --full-auto --json > $(LOGS)/architect.json
	@test -f $@ || (echo "Architect failed" && exit 1)
	@touch $(SWARM)/status/architect-ready

architect: $(SPECS)/current-task.json

# Developer produces code from specs
$(ARTIFACTS)/dev-complete.json: $(SPECS)/current-task.json
	@echo "═══ Running Developer Phase ═══"
	@claude -p "Implement task" --output-format json > $(LOGS)/developer.json
	@test -f $@ || (echo "Developer failed" && exit 1)
	@touch $(SWARM)/status/dev-ready

developer: $(ARTIFACTS)/dev-complete.json

# PM reviews output
review: $(ARTIFACTS)/dev-complete.json
	@echo "═══ Running Review Phase ═══"
	@gemini -p "Review completion" --output-format json > $(LOGS)/review.json

status:
	@./scripts/swarm-orchestrator.sh status

clean:
	rm -rf $(SWARM)/status/* $(SWARM)/logs/* $(SWARM)/artifacts/*
```

---

## 14. Troubleshooting

### 14.1 Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| API key not found | "Authentication failed" | Check `~/.config/hsis/credentials`, ensure sourced |
| MCP server not connecting | Tools unavailable | Run `claude --mcp-debug`, check server config |
| Context overflow | Garbled output | Clear session, use `/compact` in Codex |
| Gate validator fails | Missing sections | Check artifact against template |
| Agent timeout | Process killed | Increase `TIMEOUT_SECONDS`, split task |

### 14.2 Debug Commands

```bash
# Claude Code debugging
claude --mcp-debug
DEBUG=claude* claude -p "test"

# Gemini debugging
gemini mcp list
gemini --verbose

# Codex debugging
DEBUG=true codex exec "test"
codex mcp list

# View detailed logs
cat .swarm/logs/pm.json | jq .
cat .swarm/logs/architect.json | jq .
cat .swarm/logs/developer.json | jq .
```

### 14.3 Recovery Procedures

```bash
# Reset swarm state (keep artifacts)
rm -rf .swarm/status/*

# Full reset (lose all progress)
rm -rf .swarm/{status,logs,artifacts}/*

# Re-run from specific phase
./scripts/swarm-orchestrator.sh pm    # Start over from PM
./scripts/swarm-orchestrator.sh arch  # Re-run Architect
./scripts/swarm-orchestrator.sh dev   # Re-run Developer
```

---

## Appendix A: Quick Reference

### Agent Commands

```bash
# PM (Gemini)
gemini -p "prompt" --output-format json

# Architect (Codex)
codex exec "prompt" --full-auto --sandbox workspace-write --json

# Developer (Claude)
claude -p "prompt" --output-format json --allowedTools "..."
```

### File Locations

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Developer constraints |
| `GEMINI.md` | PM constraints |
| `AGENTS.md` | Architect constraints |
| `docs/PRD.md` | Product requirements |
| `docs/ARCHITECTURE.md` | Technical design |
| `.swarm/specs/current-task.json` | Developer task |
| `.swarm/artifacts/dev-complete.json` | Completion status |

### Gate Summary

| Gate | Validator | Key Criteria |
|------|-----------|--------------|
| PM | `verify-pm-gate.sh` | PRD complete, FRs/NFRs defined |
| Architect | `verify-architect-gate.sh` | Full traceability, specs complete |
| Developer | `verify-developer-gate.sh` | Tests pass, coverage met |

---

**END OF GUIDE**

*Document Version: 1.0.0*
*Generated: 2026-01-13*
