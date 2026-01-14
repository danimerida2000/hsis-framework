# HSIS Configuration Guide

This guide covers all configuration aspects of the Hierarchical Specialized Intelligence Swarm framework.

---

## Table of Contents

1. [Overview](#overview)
2. [API Keys](#api-keys)
3. [Security Model](#security-model)
4. [Per-Agent Configuration](#per-agent-configuration)
5. [MCP Server Configuration](#mcp-server-configuration)
6. [Project-Level Configuration](#project-level-configuration)
7. [Environment-Specific Settings](#environment-specific-settings)

---

## Overview

HSIS uses a layered configuration architecture:

```
Global (~/.config/hsis/)     # Shared across all projects
  |
Project (.claude/, .codex/)  # Project-specific overrides
  |
Environment (.env)           # Runtime secrets (never committed)
```

Each agent has its own configuration format and location, but all share common patterns for credential handling and MCP server integration.

---

## API Keys

### Required Keys

| Variable | Provider | Purpose | Required |
|----------|----------|---------|:--------:|
| `ANTHROPIC_API_KEY` | [Anthropic](https://console.anthropic.com/) | Claude CLI (Developer) | Yes |
| `GOOGLE_AI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) | Gemini CLI (PM) | Yes |
| `OPENAI_API_KEY` | [OpenAI](https://platform.openai.com/) | Codex CLI (Architect) | Yes |

### Optional Keys

| Variable | Provider | Purpose | Required |
|----------|----------|---------|:--------:|
| `BRAVE_API_KEY` | [Brave Search](https://brave.com/search/api/) | Web search MCP server | No |
| `GITHUB_TOKEN` | [GitHub](https://github.com/settings/tokens) | GitHub MCP server | No |

### Obtaining API Keys

<details>
<summary><strong>Anthropic API Key</strong></summary>

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy and store securely

</details>

<details>
<summary><strong>Google AI API Key</strong></summary>

1. Visit [aistudio.google.com](https://aistudio.google.com/)
2. Sign in with Google account
3. Click **Get API Key** in the sidebar
4. Create a new key or use existing
5. Copy and store securely

</details>

<details>
<summary><strong>OpenAI API Key</strong></summary>

1. Visit [platform.openai.com](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create new secret key**
5. Copy immediately (shown only once)

</details>

### Storage Options

**Option A: Environment File (Recommended for Development)**

Create `~/.config/hsis/credentials` (not in project):

```bash
# Create directory with restricted permissions
mkdir -p ~/.config/hsis
chmod 700 ~/.config/hsis

# Create credentials file
cat > ~/.config/hsis/credentials << 'EOF'
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_AI_API_KEY="AIza..."
export OPENAI_API_KEY="sk-..."
export BRAVE_API_KEY="BSA..."        # Optional
export GITHUB_TOKEN="ghp_..."        # Optional
EOF

# Restrict permissions
chmod 600 ~/.config/hsis/credentials
```

Source in your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
# HSIS Credentials
[ -f ~/.config/hsis/credentials ] && source ~/.config/hsis/credentials
```

**Option B: Project .env (For CI/CD)**

Create `.env` in project root (gitignored):

```bash
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...
OPENAI_API_KEY=sk-...
```

---

## Security Model

### Golden Rules

1. **Never commit credentials** - All `.env*` files are gitignored
2. **Use restrictive permissions** - `chmod 600` for credential files
3. **Environment variables take precedence** - Over config files
4. **Audit key usage** - Check provider dashboards regularly

### File Permissions

```bash
# Credential files: owner read/write only
chmod 600 ~/.config/hsis/credentials
chmod 600 .env

# Config directories: owner access only
chmod 700 ~/.config/hsis
chmod 700 ~/.claude
chmod 700 ~/.codex
chmod 700 ~/.gemini
```

### Gitignore Patterns

Ensure your `.gitignore` includes:

```gitignore
# Secrets
.env
.env.*
!.env.example
credentials
secrets/
*.key
*.pem

# Agent configs with potential secrets
.claude/settings.local.json
```

### Environment Variable Precedence

```
1. Shell environment (highest priority)
2. Project .env file
3. Global credentials file
4. Config file defaults (lowest priority)
```

---

## Per-Agent Configuration

### Claude Code CLI (Developer)

**Config Locations:**
- Global: `~/.claude/settings.json`
- Project: `.claude/settings.json`
- Local overrides: `.claude/settings.local.json`

<details>
<summary><strong>Example settings.json</strong></summary>

```json
{
  "$schema": "https://claude.ai/schemas/settings.json",
  "permissions": {
    "allow": [
      "Read(*)",
      "Edit(*)",
      "Write(src/**)",
      "Write(tests/**)",
      "Bash(npm:*)",
      "Bash(make:*)",
      "Bash(git:*)"
    ],
    "deny": [
      "Bash(sudo:*)",
      "Bash(rm -rf:*)",
      "Write(docs/ARCHITECTURE.md)"
    ]
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "."]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  },
  "env": {
    "SWARM_ROLE": "developer",
    "SWARM_PHASE": "implementation"
  },
  "preferences": {
    "autoApprove": false,
    "verboseLogging": true,
    "maxTurns": 100
  }
}
```

</details>

**Key Settings:**
- `permissions.allow/deny` - Control what Claude can do
- `mcpServers` - External tool integrations
- `env` - Environment variables passed to session

---

### Gemini CLI (Product Manager)

**Config Location:** `~/.gemini/settings.json`

<details>
<summary><strong>Example settings.json</strong></summary>

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
    }
  }
}
```

</details>

**Key Settings:**
- `model.temperature` - Lower = more deterministic (0.3 recommended)
- `tools.allowed/exclude` - Enforce PM role boundaries
- `context.fileName` - Auto-load constraint file

---

### Codex CLI (Architect)

**Config Location:** `~/.codex/config.toml`

<details>
<summary><strong>Example config.toml</strong></summary>

```toml
# Codex CLI Configuration for Architect Role

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
    ".swarm/status/**",
    "adrs/**"
]
readonly_paths = [
    "src/**",
    "tests/**"
]

[shell_environment_policy]
inherit = "core"
include = ["PATH", "HOME", "USER"]
exclude = ["AWS_*", "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "*_SECRET*"]

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

[context]
files = ["AGENTS.md"]
include_patterns = ["docs/**/*.md", ".swarm/**/*.json"]
exclude_patterns = ["node_modules/**", "*.log", ".env*"]
```

</details>

**Key Settings:**
- `sandbox.writable_paths` - Only design artifacts, not code
- `sandbox.readonly_paths` - Can read code but not modify
- `context.files` - Auto-load constraint file

---

## MCP Server Configuration

MCP (Model Context Protocol) servers extend agent capabilities.

### Available Servers

| Server | Package | Purpose |
|--------|---------|---------|
| `filesystem` | `@anthropic-ai/mcp-server-filesystem` | File read/write operations |
| `github` | `@anthropic-ai/mcp-server-github` | GitHub API integration |
| `brave-search` | `@anthropic-ai/mcp-server-brave-search` | Web search capabilities |
| `git` | `@anthropic-ai/mcp-server-git` | Git operations |
| `memory` | `@anthropic-ai/mcp-server-memory` | Knowledge graph persistence |

### Configuration Example

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/project"],
      "trust": true
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Debugging MCP Servers

```bash
# Claude Code
claude --mcp-debug
DEBUG=claude* claude -p "test"

# Check server status
npx @anthropic-ai/mcp-server-filesystem --version
```

---

## Project-Level Configuration

### The .swarm Directory

```
.swarm/
├── intake/              # User requirements (input)
│   └── feature-name.md
├── artifacts/           # Generated handoffs
│   ├── pm-handoff.md
│   └── architect-handoff.md
├── specs/               # Technical specifications
├── escalations/         # Blocker notes
├── status/              # Workflow state
│   └── workflow.json
└── logs/                # Execution logs
```

### Workflow State (workflow.json)

```json
{
  "project": "my-feature",
  "phases": {
    "pm": { "status": "completed", "gate_passed": true },
    "architect": { "status": "completed", "gate_passed": true },
    "developer": { "status": "in_progress", "gate_passed": false }
  },
  "current_phase": "developer",
  "blockers": [],
  "escalations": []
}
```

---

## Environment-Specific Settings

### Development

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
SWARM_AUTO_APPROVE=false
```

### CI/CD

```yaml
# GitHub Actions example
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  SWARM_AUTO_APPROVE: true
  LOG_LEVEL: info
```

### Production

```bash
# Use secrets manager
export ANTHROPIC_API_KEY=$(aws secretsmanager get-secret-value --secret-id hsis/anthropic --query SecretString --output text)
```

---

## Quick Reference

| Agent | Config File | Format | Constraint File |
|-------|-------------|--------|-----------------|
| Claude | `.claude/settings.json` | JSON | `CLAUDE.md` |
| Gemini | `~/.gemini/settings.json` | JSON | `GEMINI.md` |
| Codex | `~/.codex/config.toml` | TOML | `AGENTS.md` |

| Directory | Purpose |
|-----------|---------|
| `~/.config/hsis/` | Global HSIS settings and credentials |
| `.swarm/` | Project-specific workflow state |
| `docs/` | Generated artifacts (PRD, Architecture) |
| `adrs/` | Architecture Decision Records |

---

## Next Steps

- [Implementation Guide](../HSIS_IMPLEMENTATION_GUIDE.md) - Complete setup instructions
- [Contributing](CONTRIBUTING.md) - How to contribute to HSIS
- [Example Walkthrough](../example2/WALKTHROUGH.md) - Step-by-step example
