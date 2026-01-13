#!/usr/bin/env bash
#===============================================================================
# swarm-orchestrator.sh - Main HSIS Orchestration Script
# Hierarchical Specialized Intelligence Swarm
#
# Orchestrates the full workflow: PM → Architect → Developer
# with quality gates and escalation handling
#===============================================================================

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"

# Configuration
TIMEOUT_PM="${TIMEOUT_PM:-3600}"           # 1 hour for PM phase
TIMEOUT_ARCHITECT="${TIMEOUT_ARCHITECT:-3600}"  # 1 hour for Architect phase
TIMEOUT_DEVELOPER="${TIMEOUT_DEVELOPER:-7200}"  # 2 hours for Developer phase
MAX_RETRIES="${MAX_RETRIES:-3}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Status file
STATUS_FILE="${PROJECT_DIR}/.swarm/status/workflow.json"
LOG_DIR="${PROJECT_DIR}/.swarm/logs"

#-------------------------------------------------------------------------------
# Logging
#-------------------------------------------------------------------------------
log_info() { echo -e "${BLUE}[INFO]${NC} $(date '+%H:%M:%S') $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $(date '+%H:%M:%S') $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $(date '+%H:%M:%S') $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $1"; }
log_phase() { echo -e "${MAGENTA}[PHASE]${NC} $(date '+%H:%M:%S') $1"; }

#-------------------------------------------------------------------------------
# Status management
#-------------------------------------------------------------------------------
update_status() {
    local phase="$1"
    local field="$2"
    local value="$3"
    
    if command -v jq &> /dev/null; then
        local tmp=$(mktemp)
        jq ".phases.${phase}.${field} = ${value}" "$STATUS_FILE" > "$tmp" && mv "$tmp" "$STATUS_FILE"
    fi
}

set_current_phase() {
    local phase="$1"
    if command -v jq &> /dev/null; then
        local tmp=$(mktemp)
        jq ".current_phase = \"${phase}\"" "$STATUS_FILE" > "$tmp" && mv "$tmp" "$STATUS_FILE"
    fi
}

#-------------------------------------------------------------------------------
# Pre-flight checks
#-------------------------------------------------------------------------------
preflight_check() {
    log_info "Running pre-flight checks..."
    
    local errors=0
    
    # Check for required directories
    if [[ ! -d "${PROJECT_DIR}/.swarm" ]]; then
        log_error ".swarm directory not found. Run init-swarm.sh first."
        ((errors++))
    fi
    
    # Check for intake requirements
    local intake_count=$(find "${PROJECT_DIR}/.swarm/intake" -type f -name "*.md" 2>/dev/null | wc -l)
    if [[ "$intake_count" -eq 0 ]]; then
        log_warn "No intake requirements found in .swarm/intake/"
        log_warn "Add your requirements before running the swarm."
    fi
    
    # Check for CLI tools
    if ! command -v gemini &> /dev/null; then
        log_warn "Gemini CLI not found. PM phase may fail."
    fi
    
    if ! command -v codex &> /dev/null; then
        log_warn "Codex CLI not found. Architect phase may fail."
    fi
    
    if ! command -v claude &> /dev/null; then
        log_warn "Claude CLI not found. Developer phase may fail."
    fi
    
    # Check for API keys
    if [[ -z "${GOOGLE_AI_API_KEY:-}" ]] && [[ -z "${GEMINI_API_KEY:-}" ]]; then
        log_warn "No Gemini API key found in environment."
    fi
    
    if [[ -z "${OPENAI_API_KEY:-}" ]]; then
        log_warn "No OpenAI API key found in environment."
    fi
    
    if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
        log_warn "No Anthropic API key found in environment."
    fi
    
    if [[ "$errors" -gt 0 ]]; then
        log_error "Pre-flight check failed with $errors errors."
        return 1
    fi
    
    log_success "Pre-flight checks passed."
    return 0
}

#-------------------------------------------------------------------------------
# Phase execution
#-------------------------------------------------------------------------------
run_pm_phase() {
    log_phase "═══════════════════════════════════════════════════════════"
    log_phase "  PHASE 1: Product Manager (Gemini CLI)"
    log_phase "═══════════════════════════════════════════════════════════"
    
    update_status "pm" "status" '"in_progress"'
    update_status "pm" "started" "\"$(date -Iseconds)\""
    set_current_phase "pm"
    
    local log_file="${LOG_DIR}/pm-$(date +%Y%m%d-%H%M%S).log"
    
    if [[ -x "${SCRIPT_DIR}/run-pm.sh" ]]; then
        if timeout "$TIMEOUT_PM" "${SCRIPT_DIR}/run-pm.sh" 2>&1 | tee "$log_file"; then
            log_success "PM phase completed"
            update_status "pm" "status" '"completed"'
            update_status "pm" "completed" "\"$(date -Iseconds)\""
            return 0
        else
            log_error "PM phase failed"
            update_status "pm" "status" '"failed"'
            return 1
        fi
    else
        log_error "run-pm.sh not found or not executable"
        return 1
    fi
}

run_architect_phase() {
    log_phase "═══════════════════════════════════════════════════════════"
    log_phase "  PHASE 2: Software Architect (Codex CLI)"
    log_phase "═══════════════════════════════════════════════════════════"
    
    # Verify PM gate passed
    if ! verify_pm_gate; then
        log_error "PM gate not passed. Cannot proceed to Architect phase."
        return 1
    fi
    
    update_status "architect" "status" '"in_progress"'
    update_status "architect" "started" "\"$(date -Iseconds)\""
    set_current_phase "architect"
    
    local log_file="${LOG_DIR}/architect-$(date +%Y%m%d-%H%M%S).log"
    
    if [[ -x "${SCRIPT_DIR}/run-architect.sh" ]]; then
        if timeout "$TIMEOUT_ARCHITECT" "${SCRIPT_DIR}/run-architect.sh" 2>&1 | tee "$log_file"; then
            log_success "Architect phase completed"
            update_status "architect" "status" '"completed"'
            update_status "architect" "completed" "\"$(date -Iseconds)\""
            return 0
        else
            log_error "Architect phase failed"
            update_status "architect" "status" '"failed"'
            return 1
        fi
    else
        log_error "run-architect.sh not found or not executable"
        return 1
    fi
}

run_developer_phase() {
    log_phase "═══════════════════════════════════════════════════════════"
    log_phase "  PHASE 3: Senior Developer (Claude Code CLI)"
    log_phase "═══════════════════════════════════════════════════════════"
    
    # Verify Architect gate passed
    if ! verify_architect_gate; then
        log_error "Architect gate not passed. Cannot proceed to Developer phase."
        return 1
    fi
    
    update_status "developer" "status" '"in_progress"'
    update_status "developer" "started" "\"$(date -Iseconds)\""
    set_current_phase "developer"
    
    local log_file="${LOG_DIR}/developer-$(date +%Y%m%d-%H%M%S).log"
    
    if [[ -x "${SCRIPT_DIR}/run-developer.sh" ]]; then
        if timeout "$TIMEOUT_DEVELOPER" "${SCRIPT_DIR}/run-developer.sh" 2>&1 | tee "$log_file"; then
            log_success "Developer phase completed"
            update_status "developer" "status" '"completed"'
            update_status "developer" "completed" "\"$(date -Iseconds)\""
            return 0
        else
            log_error "Developer phase failed"
            update_status "developer" "status" '"failed"'
            return 1
        fi
    else
        log_error "run-developer.sh not found or not executable"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# Gate verification
#-------------------------------------------------------------------------------
verify_pm_gate() {
    log_info "Verifying PM Gate..."
    
    # Check PRD exists
    if [[ ! -f "${PROJECT_DIR}/docs/PRD.md" ]]; then
        log_error "PRD.md not found"
        return 1
    fi
    
    # Check PRD has required sections
    local prd="${PROJECT_DIR}/docs/PRD.md"
    local missing=0
    
    for section in "Functional Requirements" "Non-Functional Requirements" "Acceptance Criteria"; do
        if ! grep -q "$section" "$prd"; then
            log_error "PRD missing section: $section"
            ((missing++))
        fi
    done
    
    # Check for FR-### pattern
    if ! grep -qE "FR-[0-9]{3}" "$prd"; then
        log_warn "No FR-### requirements found in PRD"
    fi
    
    if [[ "$missing" -gt 0 ]]; then
        log_error "PM Gate FAILED - $missing missing sections"
        return 1
    fi
    
    log_success "PM Gate PASSED"
    update_status "pm" "gate_passed" "true"
    return 0
}

verify_architect_gate() {
    log_info "Verifying Architect Gate..."
    
    local errors=0
    
    # Check ARCHITECTURE.md exists
    if [[ ! -f "${PROJECT_DIR}/docs/ARCHITECTURE.md" ]]; then
        log_error "ARCHITECTURE.md not found"
        ((errors++))
    fi
    
    # Check IMPLEMENTATION_PLAN.md exists
    if [[ ! -f "${PROJECT_DIR}/docs/IMPLEMENTATION_PLAN.md" ]]; then
        log_error "IMPLEMENTATION_PLAN.md not found"
        ((errors++))
    fi
    
    # Check for required sections in ARCHITECTURE.md
    if [[ -f "${PROJECT_DIR}/docs/ARCHITECTURE.md" ]]; then
        local arch="${PROJECT_DIR}/docs/ARCHITECTURE.md"
        for section in "System Overview" "Component" "API" "Security" "Definition of Done"; do
            if ! grep -qi "$section" "$arch"; then
                log_warn "ARCHITECTURE.md may be missing: $section"
            fi
        done
    fi
    
    if [[ "$errors" -gt 0 ]]; then
        log_error "Architect Gate FAILED - $errors errors"
        return 1
    fi
    
    log_success "Architect Gate PASSED"
    update_status "architect" "gate_passed" "true"
    return 0
}

verify_developer_gate() {
    log_info "Verifying Developer Gate..."
    
    local errors=0
    
    # Check for source code
    local src_count=$(find "${PROJECT_DIR}/src" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) 2>/dev/null | wc -l)
    if [[ "$src_count" -eq 0 ]]; then
        log_warn "No source files found in src/"
    fi
    
    # Check for tests
    local test_count=$(find "${PROJECT_DIR}/tests" -type f -name "*.test.*" -o -name "*_test.*" -o -name "test_*" 2>/dev/null | wc -l)
    if [[ "$test_count" -eq 0 ]]; then
        log_warn "No test files found in tests/"
    fi
    
    # Check for implementation report
    if [[ ! -f "${PROJECT_DIR}/docs/IMPLEMENTATION_REPORT.md" ]]; then
        log_error "IMPLEMENTATION_REPORT.md not found"
        ((errors++))
    fi
    
    # Run tests if Makefile exists
    if [[ -f "${PROJECT_DIR}/Makefile" ]]; then
        log_info "Running tests..."
        if ! make -C "${PROJECT_DIR}" test 2>/dev/null; then
            log_warn "Tests failed or test target not configured"
        fi
    fi
    
    if [[ "$errors" -gt 0 ]]; then
        log_error "Developer Gate FAILED - $errors errors"
        return 1
    fi
    
    log_success "Developer Gate PASSED"
    update_status "developer" "gate_passed" "true"
    return 0
}

#-------------------------------------------------------------------------------
# Escalation handling
#-------------------------------------------------------------------------------
check_escalations() {
    local escalation_dir="${PROJECT_DIR}/.swarm/escalations"
    local blockers=$(find "$escalation_dir" -name "*.md" -exec grep -l "BLOCKER" {} \; 2>/dev/null | wc -l)
    
    if [[ "$blockers" -gt 0 ]]; then
        log_warn "Found $blockers BLOCKER escalations"
        log_warn "Review escalations in .swarm/escalations/ before proceeding"
        return 1
    fi
    
    return 0
}

#-------------------------------------------------------------------------------
# Main workflow
#-------------------------------------------------------------------------------
run_full_workflow() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║     Hierarchical Specialized Intelligence Swarm (HSIS)       ║"
    echo "║                    Full Workflow Execution                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    local start_time=$(date +%s)
    
    # Pre-flight checks
    if ! preflight_check; then
        log_error "Pre-flight checks failed. Aborting."
        exit 1
    fi
    
    # Phase 1: PM
    if ! run_pm_phase; then
        log_error "PM phase failed. Workflow stopped."
        exit 1
    fi
    
    # Verify PM gate
    if ! verify_pm_gate; then
        log_error "PM gate verification failed. Review and fix PRD."
        exit 1
    fi
    
    # Check for blockers
    if ! check_escalations; then
        log_warn "Resolve BLOCKER escalations before continuing."
        log_info "Run 'make swarm-architect' after resolving."
        exit 1
    fi
    
    # Phase 2: Architect
    if ! run_architect_phase; then
        log_error "Architect phase failed. Workflow stopped."
        exit 1
    fi
    
    # Verify Architect gate
    if ! verify_architect_gate; then
        log_error "Architect gate verification failed. Review and fix architecture."
        exit 1
    fi
    
    # Check for blockers
    if ! check_escalations; then
        log_warn "Resolve BLOCKER escalations before continuing."
        log_info "Run 'make swarm-developer' after resolving."
        exit 1
    fi
    
    # Phase 3: Developer
    if ! run_developer_phase; then
        log_error "Developer phase failed. Workflow stopped."
        exit 1
    fi
    
    # Verify Developer gate
    if ! verify_developer_gate; then
        log_error "Developer gate verification failed. Review implementation."
        exit 1
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    log_phase "═══════════════════════════════════════════════════════════"
    log_phase "  WORKFLOW COMPLETE"
    log_phase "═══════════════════════════════════════════════════════════"
    log_success "All phases completed successfully!"
    log_info "Total duration: $((duration / 60)) minutes $((duration % 60)) seconds"
    echo ""
    echo "Deliverables:"
    echo "  - docs/PRD.md"
    echo "  - docs/ARCHITECTURE.md"
    echo "  - docs/IMPLEMENTATION_PLAN.md"
    echo "  - docs/IMPLEMENTATION_REPORT.md"
    echo "  - src/ (implementation)"
    echo "  - tests/ (test suites)"
    echo ""
}

#-------------------------------------------------------------------------------
# Command handling
#-------------------------------------------------------------------------------
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  full        Run full workflow (PM → Architect → Developer)"
    echo "  pm          Run PM phase only"
    echo "  architect   Run Architect phase only"
    echo "  developer   Run Developer phase only"
    echo "  verify      Verify all gates"
    echo "  status      Show current workflow status"
    echo "  help        Show this help"
    echo ""
}

show_status() {
    if [[ -f "$STATUS_FILE" ]]; then
        echo "Current workflow status:"
        cat "$STATUS_FILE" | jq . 2>/dev/null || cat "$STATUS_FILE"
    else
        log_warn "No status file found. Run init-swarm.sh first."
    fi
}

#-------------------------------------------------------------------------------
# Main
#-------------------------------------------------------------------------------
main() {
    local command="${1:-full}"
    
    case "$command" in
        full)
            run_full_workflow
            ;;
        pm)
            run_pm_phase
            verify_pm_gate
            ;;
        architect)
            run_architect_phase
            verify_architect_gate
            ;;
        developer)
            run_developer_phase
            verify_developer_gate
            ;;
        verify)
            verify_pm_gate || true
            verify_architect_gate || true
            verify_developer_gate || true
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
