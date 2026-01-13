#!/usr/bin/env bash
#===============================================================================
# run-architect.sh - Execute Architect Phase with Codex CLI
# Hierarchical Specialized Intelligence Swarm
#===============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Accept project directory as argument or use current directory
if [[ -n "${1:-}" ]]; then
    # If argument is provided, check if it's an absolute path
    if [[ "$1" = /* ]]; then
        PROJECT_DIR="$1"
    else
        # Relative path - resolve from current directory
        PROJECT_DIR="$(cd "$(pwd)/$1" 2>/dev/null && pwd)" || PROJECT_DIR="$(pwd)/$1"
    fi
else
    PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
fi

# Remove trailing slash if present
PROJECT_DIR="${PROJECT_DIR%/}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[ARCHITECT]${NC} $1"; }
log_success() { echo -e "${GREEN}[ARCHITECT]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[ARCHITECT]${NC} $1"; }
log_error() { echo -e "${RED}[ARCHITECT]${NC} $1"; }

#-------------------------------------------------------------------------------
# Build prompt for Architect
#-------------------------------------------------------------------------------
build_architect_prompt() {
    local prd_file="${PROJECT_DIR}/docs/PRD.md"
    
    if [[ ! -f "$prd_file" ]]; then
        log_error "PRD.md not found. Run PM phase first."
        return 1
    fi
    
    cat << EOF
You are the Software Architect in a Hierarchical Specialized Intelligence Swarm (HSIS).
Your role is defined in AGENTS.md. Read it carefully before proceeding.

Your task is to create comprehensive architecture documentation based on the approved PRD.

=== ROLE CONSTRAINTS ===
- You MUST follow the schemas in AGENTS.md
- You MUST NOT write application code (only interfaces/pseudocode)
- You MUST NOT modify requirements without escalation
- Every requirement MUST map to design elements
- Every requirement MUST map to tests

=== APPROVED PRD ===
$(cat "$prd_file")

=== INSTRUCTIONS ===
1. Read AGENTS.md for your role constraints
2. Analyze the PRD thoroughly
3. Create the following artifacts:

   a) docs/ARCHITECTURE.md with ALL sections:
      - System Overview
      - Architecture Diagram (ASCII or Mermaid)
      - Component Responsibilities
      - Data Models
      - API Contracts (request/response/errors)
      - Concurrency & Scaling Strategy
      - Security Model
      - Observability (logs/metrics/traces)
      - Performance Budget per NFR
      - Definition of Done
      - Requirement Mapping Table

   b) docs/IMPLEMENTATION_PLAN.md with:
      - Work Breakdown Structure (WBS)
      - Task dependencies
      - Test plan linkage
      - Risks and mitigations
      - Exit criteria

   c) Architecture Decision Records (ADRs) for key decisions:
      - Save to adrs/ADR-001.md, ADR-002.md, etc.
      - Follow the ADR template in AGENTS.md

4. Run the Architect Gate Checklist
5. Create a handoff document for the Developer

=== OUTPUT FILES ===
- docs/ARCHITECTURE.md
- docs/IMPLEMENTATION_PLAN.md
- adrs/ADR-###.md (as needed)
EOF
}

#-------------------------------------------------------------------------------
# Main execution
#-------------------------------------------------------------------------------
main() {
    log_info "Starting Architect Phase..."
    log_info "Project directory: ${PROJECT_DIR}"
    
    # Check prerequisites
    if [[ ! -f "${PROJECT_DIR}/docs/PRD.md" ]]; then
        log_error "PRD.md not found. Complete PM phase first."
        exit 1
    fi
    
    # Check for Codex CLI
    if ! command -v codex &> /dev/null; then
        log_warn "Codex CLI not found."
        log_info "Install with: npm install -g @openai/codex-cli"
        log_info "Attempting alternative execution..."
    fi
    
    # Build prompt
    local prompt
    prompt=$(build_architect_prompt) || exit 1
    
    # Create temp file for prompt
    local prompt_file=$(mktemp)
    echo "$prompt" > "$prompt_file"
    
    log_info "Executing Architect phase..."
    
    cd "${PROJECT_DIR}"
    
    if command -v codex &> /dev/null; then
        # Run Codex CLI
        # Note: Adjust based on actual Codex CLI syntax
        codex --prompt "$(cat "$prompt_file")" \
              --model "gpt-5.2-xhigh" \
              --approval-mode auto-edit \
              2>&1 || {
            log_warn "Codex CLI execution failed. Trying alternative..."
            
            # Alternative: Use OpenAI API directly via curl
            if [[ -n "${OPENAI_API_KEY:-}" ]]; then
                log_info "Falling back to direct API call..."
                # This would need a more sophisticated implementation
            fi
            
            log_error "Codex execution failed"
            rm -f "$prompt_file"
            exit 1
        }
    else
        log_warn "Codex CLI not available"
        log_info "Manual execution required. Prompt saved to: $prompt_file"
        
        # Provide manual instructions
        echo ""
        echo "=== MANUAL EXECUTION REQUIRED ==="
        echo "Copy the prompt from $prompt_file"
        echo "Run it with your preferred AI tool"
        echo "Create the output files manually"
        echo "=================================="
        
        # Don't delete prompt file in this case
        exit 1
    fi
    
    # Cleanup
    rm -f "$prompt_file"
    
    # Verify outputs
    local outputs_found=0
    
    if [[ -f "${PROJECT_DIR}/docs/ARCHITECTURE.md" ]]; then
        log_success "ARCHITECTURE.md created"
        ((outputs_found++))
    else
        log_warn "ARCHITECTURE.md not found"
    fi
    
    if [[ -f "${PROJECT_DIR}/docs/IMPLEMENTATION_PLAN.md" ]]; then
        log_success "IMPLEMENTATION_PLAN.md created"
        ((outputs_found++))
    else
        log_warn "IMPLEMENTATION_PLAN.md not found"
    fi
    
    local adr_count=$(find "${PROJECT_DIR}/adrs" -name "ADR-*.md" 2>/dev/null | wc -l)
    if [[ "$adr_count" -gt 0 ]]; then
        log_success "Created $adr_count ADR(s)"
        ((outputs_found++))
    fi
    
    if [[ "$outputs_found" -ge 2 ]]; then
        log_success "Architect Phase completed successfully"
    else
        log_warn "Architect Phase completed with warnings"
        log_info "Some expected outputs may be missing"
    fi
}

main "$@"
