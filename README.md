# Hierarchical Specialized Intelligence Swarm (HSIS)

**HSIS** is an autonomous agentic framework that orchestrates specialized AI agents to autonomously plan, architect, and implement software projects.

## 🤖 The Swarm

The system coordinates three specialized CLI agents:

1. **Gemini (Product Manager)**: Requirements analysis & PRD generation.
2. **Codex (Architect)**: System design & implementation planning.
3. **Claude (Developer)**: Code implementation & testing.

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- Python 3.11+
- Docker (optional, for sandboxing)
- API Keys: OpenAI, Google AI, Anthropic

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/hsis-framework.git
    cd hsis-framework
    ```

2. Run the initialization script:

    ```bash
    ./scripts/init-swarm.sh
    ```

3. Configure your environment keys (see `docs/CONFIGURATION.md`).

## 🛠️ Usage

To start a new development cycle:

```bash
# Full autonomous loop
./scripts/swarm-orchestrator.sh full

# Or run individual phases
make swarm-pm        # Phase 1: Requirements
make swarm-architect # Phase 2: Architecture
make swarm-developer # Phase 3: Implementation
```

## 📂 Project Structure

- `scripts/`: Orchestration and utility scripts.
- `docs/`: Core documentation and templates.
- `AGENTS.md`: Agent role definitions and prompts.
- `HSIS_IMPLEMENTATION_GUIDE.md`: Detailed system specification.

## 📄 License

MIT
