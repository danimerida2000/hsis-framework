#!/usr/bin/env bash
#===============================================================================
# run-developer.sh - Execute Developer Phase with Claude Code CLI
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

log_info() { echo -e "${BLUE}[DEVELOPER]${NC} $1"; }
log_success() { echo -e "${GREEN}[DEVELOPER]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[DEVELOPER]${NC} $1"; }
log_error() { echo -e "${RED}[DEVELOPER]${NC} $1"; }

#-------------------------------------------------------------------------------
# Build prompt for Developer
#-------------------------------------------------------------------------------
build_developer_prompt() {
    local arch_file="${PROJECT_DIR}/docs/ARCHITECTURE.md"
    local plan_file="${PROJECT_DIR}/docs/IMPLEMENTATION_PLAN.md"
    
    if [[ ! -f "$arch_file" ]]; then
        log_error "ARCHITECTURE.md not found. Run Architect phase first."
        return 1
    fi
    
    if [[ ! -f "$plan_file" ]]; then
        log_error "IMPLEMENTATION_PLAN.md not found. Run Architect phase first."
        return 1
    fi
    
    # Collect ADRs
    local adrs=""
    for adr in "${PROJECT_DIR}"/adrs/ADR-*.md; do
        if [[ -f "$adr" ]]; then
            adrs+="--- $(basename "$adr") ---\n"
            adrs+="$(cat "$adr")\n\n"
        fi
    done
    
    cat << EOF
You are the Senior Developer in a Hierarchical Specialized Intelligence Swarm (HSIS).
Your role is defined in CLAUDE.md. Read it carefully before proceeding.

Your task is to implement the system according to the approved architecture.

=== ROLE CONSTRAINTS ===
- You MUST follow CLAUDE.md strictly
- You MUST implement according to ARCHITECTURE.md exactly
- You MUST follow the task order in IMPLEMENTATION_PLAN.md
- You MUST NOT modify requirements or architecture
- You MUST write tests for all code
- You MUST escalate if specifications are unclear

=== ARCHITECTURE SPECIFICATION ===
$(cat "$arch_file")

=== IMPLEMENTATION PLAN ===
$(cat "$plan_file")

=== ARCHITECTURE DECISION RECORDS ===
$(echo -e "$adrs")

=== INSTRUCTIONS ===
1. Read CLAUDE.md for your role constraints
2. Study ARCHITECTURE.md and IMPLEMENTATION_PLAN.md thoroughly
3. Set up the project structure according to the architecture
4. Implement components in the order specified in the WBS:
   - Follow dependencies
   - Write tests alongside code
   - Run tests after each component
5. Ensure all quality checks pass:
   - Linting
   - Type checking (if applicable)
   - Unit tests
   - Integration tests
6. Create docs/IMPLEMENTATION_REPORT.md with:
   - Summary of delivered scope
   - Traceability matrix
   - Test results
   - Known issues (if any)
7. Update CHANGELOG.md
8. Update README.md with setup instructions

=== OUTPUT STRUCTURE ===
src/
  [implementation files]
tests/
  unit/
  integration/
  e2e/
docs/
  IMPLEMENTATION_REPORT.md
CHANGELOG.md (updated)
README.md (updated)

=== QUALITY REQUIREMENTS ===
- All tests must pass
- Code coverage must be ≥80%
- No lint errors
- No type errors
- No high-severity security issues
EOF
}

#-------------------------------------------------------------------------------
# Main execution
#-------------------------------------------------------------------------------
main() {
    log_info "Starting Developer Phase..."
    log_info "Project directory: ${PROJECT_DIR}"
    
    # Check prerequisites
    if [[ ! -f "${PROJECT_DIR}/docs/ARCHITECTURE.md" ]]; then
        log_error "ARCHITECTURE.md not found. Complete Architect phase first."
        exit 1
    fi
    
    if [[ ! -f "${PROJECT_DIR}/docs/IMPLEMENTATION_PLAN.md" ]]; then
        log_error "IMPLEMENTATION_PLAN.md not found. Complete Architect phase first."
        exit 1
    fi
    
    # Check for Claude CLI
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code CLI not found."
        log_info "Install with: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    
    # Build prompt
    local prompt
    prompt=$(build_developer_prompt) || exit 1
    
    # Create temp file for prompt
    local prompt_file=$(mktemp)
    echo "$prompt" > "$prompt_file"
    
    log_info "Executing Claude Code CLI..."
    
    cd "${PROJECT_DIR}"
    
    # Run Claude Code CLI
    # Using --dangerously-skip-permissions for automated execution
    # In production, use proper permission configuration
    claude --print \
           --dangerously-skip-permissions \
           "$(cat "$prompt_file")" \
           2>&1 || {
        log_warn "Claude CLI initial execution completed."
        log_info "Review outputs and continue if needed."
    }
    
    # Cleanup
    rm -f "$prompt_file"
    
    # Verify outputs
    log_info "Verifying outputs..."
    
    # Check for source files
    local src_count=$(find "${PROJECT_DIR}/src" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) 2>/dev/null | wc -l)
    if [[ "$src_count" -gt 0 ]]; then
        log_success "Found $src_count source file(s) in src/"
    else
        log_warn "No source files found in src/"
    fi
    
    # Check for test files
    local test_count=$(find "${PROJECT_DIR}/tests" -type f 2>/dev/null | wc -l)
    if [[ "$test_count" -gt 0 ]]; then
        log_success "Found $test_count test file(s) in tests/"
    else
        log_warn "No test files found in tests/"
    fi
    
    # Check for implementation report
    if [[ -f "${PROJECT_DIR}/docs/IMPLEMENTATION_REPORT.md" ]]; then
        log_success "IMPLEMENTATION_REPORT.md created"
    else
        log_warn "IMPLEMENTATION_REPORT.md not found"
    fi
    
    # Run tests if available
    if [[ -f "${PROJECT_DIR}/Makefile" ]]; then
        log_info "Running tests..."
        if make -C "${PROJECT_DIR}" test 2>/dev/null; then
            log_success "Tests passed"
        else
            log_warn "Tests failed or not configured"
        fi
    fi
    
    log_success "Developer Phase completed"
    log_info "Review the implementation and run final verification"
}

main "$@"
