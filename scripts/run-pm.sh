#!/usr/bin/env bash
#===============================================================================
# run-pm.sh - Execute PM Phase with Gemini CLI
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

log_info() { echo -e "${BLUE}[PM]${NC} $1"; }
log_success() { echo -e "${GREEN}[PM]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[PM]${NC} $1"; }
log_error() { echo -e "${RED}[PM]${NC} $1"; }

#-------------------------------------------------------------------------------
# Build prompt from intake requirements
#-------------------------------------------------------------------------------
build_pm_prompt() {
    local intake_dir="${PROJECT_DIR}/.swarm/intake"
    local prompt=""
    
    # Read all intake files
    if [[ -d "$intake_dir" ]]; then
        for file in "$intake_dir"/*.md; do
            if [[ -f "$file" ]]; then
                prompt+="--- $(basename "$file") ---\n"
                prompt+="$(cat "$file")\n\n"
            fi
        done
    fi
    
    if [[ -z "$prompt" ]]; then
        log_error "No intake requirements found in .swarm/intake/"
        return 1
    fi
    
    cat << EOF
You are the Product Manager in a Hierarchical Specialized Intelligence Swarm (HSIS).
Your role is defined in GEMINI.md. Read it carefully before proceeding.

Your task is to create a comprehensive Product Requirements Document (PRD) based on
the intake requirements below.

=== ROLE CONSTRAINTS ===
- You MUST follow the PRD schema in GEMINI.md
- You MUST NOT make architecture decisions
- You MUST NOT choose technology stacks
- Every requirement MUST be numbered (FR-### or NFR-###)
- Every requirement MUST be testable
- Every requirement MUST have acceptance criteria

=== INTAKE REQUIREMENTS ===
$(echo -e "$prompt")

=== INSTRUCTIONS ===
1. Read GEMINI.md for your role constraints
2. Analyze the intake requirements
3. Create docs/PRD.md following the schema exactly
4. Include all required sections:
   - Problem statement
   - Target users
   - Scope (in/out)
   - Functional Requirements (FR-###)
   - Non-Functional Requirements (NFR-###)
   - Acceptance Criteria
   - Success metrics
   - Risks and assumptions
   - Open questions (tagged BLOCKER/NON-BLOCKER)
   - Release plan

5. Run the PM Gate Checklist before completing
6. Create a handoff document for the Architect

Output the PRD to: docs/PRD.md
EOF
}

#-------------------------------------------------------------------------------
# Main execution
#-------------------------------------------------------------------------------
main() {
    log_info "Starting PM Phase..."
    log_info "Project directory: ${PROJECT_DIR}"
    
    # Check for Gemini CLI
    if ! command -v gemini &> /dev/null; then
        log_error "Gemini CLI not found. Install with: npm install -g @anthropic-ai/gemini-cli"
        exit 1
    fi
    
    # Check for intake requirements
    local intake_dir="${PROJECT_DIR}/.swarm/intake"
    if [[ ! -d "$intake_dir" ]] || [[ -z "$(ls -A "$intake_dir" 2>/dev/null)" ]]; then
        log_error "No intake requirements found in .swarm/intake/"
        log_info "Add your requirements as .md files to .swarm/intake/ first."
        exit 1
    fi
    
    # Build prompt
    local prompt
    prompt=$(build_pm_prompt) || exit 1
    
    # Create temp file for prompt
    local prompt_file=$(mktemp)
    echo "$prompt" > "$prompt_file"
    
    log_info "Executing Gemini CLI..."
    
    # Run Gemini CLI
    # Note: Adjust this command based on actual Gemini CLI syntax
    cd "${PROJECT_DIR}"
    
    if command -v gemini &> /dev/null; then
        # Option 1: Direct prompt
        gemini --prompt "$(cat "$prompt_file")" \
               --model "gemini-2.5-pro" \
               --sandbox \
               2>&1 || {
            log_warn "Gemini CLI execution failed. Trying alternative approach..."
            
            # Option 2: Interactive mode with file input
            gemini < "$prompt_file" 2>&1 || {
                log_error "Gemini CLI failed. Check your API key and configuration."
                rm -f "$prompt_file"
                exit 1
            }
        }
    else
        log_error "Gemini CLI not available"
        rm -f "$prompt_file"
        exit 1
    fi
    
    # Cleanup
    rm -f "$prompt_file"
    
    # Verify output
    if [[ -f "${PROJECT_DIR}/docs/PRD.md" ]]; then
        log_success "PRD.md created successfully"
        log_info "Location: ${PROJECT_DIR}/docs/PRD.md"
    else
        log_warn "PRD.md not found after execution"
        log_info "You may need to manually run the PM phase"
    fi
    
    log_success "PM Phase completed"
}

main "$@"
