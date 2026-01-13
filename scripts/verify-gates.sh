#!/usr/bin/env bash
#===============================================================================
# verify-gates.sh - Verify All HSIS Quality Gates
# Hierarchical Specialized Intelligence Swarm
#===============================================================================

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

#-------------------------------------------------------------------------------
# Logging
#-------------------------------------------------------------------------------
log_pass() { echo -e "  ${GREEN}✓${NC} $1"; ((PASS_COUNT++)); }
log_fail() { echo -e "  ${RED}✗${NC} $1"; ((FAIL_COUNT++)); }
log_warn() { echo -e "  ${YELLOW}!${NC} $1"; ((WARN_COUNT++)); }
log_header() { echo -e "\n${BLUE}═══ $1 ═══${NC}"; }

#-------------------------------------------------------------------------------
# PM Gate Verification
#-------------------------------------------------------------------------------
verify_pm_gate() {
    log_header "PM Gate Checklist"
    
    local prd="${PROJECT_DIR}/docs/PRD.md"
    
    # Check PRD exists
    if [[ -f "$prd" ]]; then
        log_pass "PRD.md exists"
    else
        log_fail "PRD.md not found"
        return 1
    fi
    
    # Check for numbered requirements
    if grep -qE "FR-[0-9]{3}" "$prd"; then
        local fr_count=$(grep -cE "FR-[0-9]{3}" "$prd" || echo 0)
        log_pass "Functional Requirements found ($fr_count FR-### entries)"
    else
        log_fail "No FR-### numbered requirements found"
    fi
    
    if grep -qE "NFR-[0-9]{3}" "$prd"; then
        local nfr_count=$(grep -cE "NFR-[0-9]{3}" "$prd" || echo 0)
        log_pass "Non-Functional Requirements found ($nfr_count NFR-### entries)"
    else
        log_warn "No NFR-### numbered requirements found"
    fi
    
    # Check for acceptance criteria
    if grep -qi "acceptance criteria" "$prd"; then
        log_pass "Acceptance Criteria section found"
    else
        log_fail "Acceptance Criteria section missing"
    fi
    
    # Check for required sections
    local sections=("Problem Statement" "Target Users" "Scope" "Success Metrics" "Risks")
    for section in "${sections[@]}"; do
        if grep -qi "$section" "$prd"; then
            log_pass "$section section found"
        else
            log_warn "$section section may be missing"
        fi
    done
    
    # Check for open questions tagging
    if grep -qi "BLOCKER\|NON-BLOCKER" "$prd"; then
        log_pass "Open questions are tagged"
    else
        log_warn "Open questions may not be properly tagged"
    fi
    
    # Check for contradictions (basic heuristic)
    local in_scope=$(grep -A20 "In-Scope\|In Scope" "$prd" 2>/dev/null | head -20)
    local out_scope=$(grep -A20 "Out-of-Scope\|Out of Scope" "$prd" 2>/dev/null | head -20)
    if [[ -n "$in_scope" ]] && [[ -n "$out_scope" ]]; then
        log_pass "Scope boundaries defined"
    else
        log_warn "Scope boundaries may be unclear"
    fi
}

#-------------------------------------------------------------------------------
# Architect Gate Verification
#-------------------------------------------------------------------------------
verify_architect_gate() {
    log_header "Architect Gate Checklist"
    
    local arch="${PROJECT_DIR}/docs/ARCHITECTURE.md"
    local plan="${PROJECT_DIR}/docs/IMPLEMENTATION_PLAN.md"
    
    # Check ARCHITECTURE.md exists
    if [[ -f "$arch" ]]; then
        log_pass "ARCHITECTURE.md exists"
    else
        log_fail "ARCHITECTURE.md not found"
        return 1
    fi
    
    # Check IMPLEMENTATION_PLAN.md exists
    if [[ -f "$plan" ]]; then
        log_pass "IMPLEMENTATION_PLAN.md exists"
    else
        log_fail "IMPLEMENTATION_PLAN.md not found"
    fi
    
    # Check for required architecture sections
    local arch_sections=(
        "System Overview"
        "Component"
        "Data Model"
        "API"
        "Security"
        "Observability"
        "Definition of Done"
    )
    
    for section in "${arch_sections[@]}"; do
        if grep -qi "$section" "$arch"; then
            log_pass "Architecture: $section section found"
        else
            log_warn "Architecture: $section section may be missing"
        fi
    done
    
    # Check for requirement mapping
    if grep -qE "FR-[0-9]{3}|NFR-[0-9]{3}" "$arch"; then
        log_pass "Requirements mapped in architecture"
    else
        log_fail "No requirement IDs found in architecture"
    fi
    
    # Check for test mapping
    if grep -qi "test" "$arch"; then
        log_pass "Test references found in architecture"
    else
        log_warn "Test mapping may be missing"
    fi
    
    # Check implementation plan structure
    if [[ -f "$plan" ]]; then
        if grep -qi "WBS\|Work Breakdown\|Task" "$plan"; then
            log_pass "Implementation Plan: WBS found"
        else
            log_warn "Implementation Plan: WBS may be missing"
        fi
        
        if grep -qi "depend" "$plan"; then
            log_pass "Implementation Plan: Dependencies documented"
        else
            log_warn "Implementation Plan: Dependencies may be missing"
        fi
    fi
    
    # Check for ADRs
    local adr_count=$(find "${PROJECT_DIR}/adrs" -name "ADR-*.md" 2>/dev/null | wc -l)
    if [[ "$adr_count" -gt 0 ]]; then
        log_pass "Found $adr_count ADR(s)"
    else
        log_warn "No ADRs found"
    fi
}

#-------------------------------------------------------------------------------
# Developer Gate Verification
#-------------------------------------------------------------------------------
verify_developer_gate() {
    log_header "Developer Gate Checklist"
    
    local report="${PROJECT_DIR}/docs/IMPLEMENTATION_REPORT.md"
    
    # Check for source code
    local src_count=$(find "${PROJECT_DIR}/src" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.java" \) 2>/dev/null | wc -l)
    if [[ "$src_count" -gt 0 ]]; then
        log_pass "Source code found ($src_count files)"
    else
        log_fail "No source code found in src/"
    fi
    
    # Check for tests
    local test_count=$(find "${PROJECT_DIR}/tests" -type f \( -name "*.test.*" -o -name "*_test.*" -o -name "test_*.*" -o -name "*Test.*" \) 2>/dev/null | wc -l)
    if [[ "$test_count" -gt 0 ]]; then
        log_pass "Test files found ($test_count files)"
    else
        log_warn "No test files found"
    fi
    
    # Check for implementation report
    if [[ -f "$report" ]]; then
        log_pass "IMPLEMENTATION_REPORT.md exists"
        
        # Check report sections
        if grep -qi "traceability" "$report"; then
            log_pass "Traceability matrix found in report"
        else
            log_warn "Traceability matrix may be missing"
        fi
        
        if grep -qi "test result" "$report"; then
            log_pass "Test results documented"
        else
            log_warn "Test results may be missing"
        fi
    else
        log_fail "IMPLEMENTATION_REPORT.md not found"
    fi
    
    # Check for updated CHANGELOG
    if [[ -f "${PROJECT_DIR}/CHANGELOG.md" ]]; then
        local recent=$(head -50 "${PROJECT_DIR}/CHANGELOG.md" | grep -c "###\|Added\|Changed\|Fixed" || echo 0)
        if [[ "$recent" -gt 2 ]]; then
            log_pass "CHANGELOG.md appears updated"
        else
            log_warn "CHANGELOG.md may need updates"
        fi
    else
        log_warn "CHANGELOG.md not found"
    fi
    
    # Check for README
    if [[ -f "${PROJECT_DIR}/README.md" ]]; then
        log_pass "README.md exists"
    else
        log_warn "README.md not found"
    fi
    
    # Run tests if Makefile exists
    if [[ -f "${PROJECT_DIR}/Makefile" ]]; then
        echo ""
        echo "  Running automated tests..."
        if make -C "${PROJECT_DIR}" test 2>/dev/null; then
            log_pass "Automated tests pass"
        else
            log_warn "Automated tests failed or not configured"
        fi
        
        # Try lint
        if make -C "${PROJECT_DIR}" lint 2>/dev/null; then
            log_pass "Lint checks pass"
        else
            log_warn "Lint checks failed or not configured"
        fi
    fi
}

#-------------------------------------------------------------------------------
# Summary
#-------------------------------------------------------------------------------
print_summary() {
    echo ""
    log_header "Gate Verification Summary"
    echo ""
    echo -e "  ${GREEN}Passed:${NC}  $PASS_COUNT"
    echo -e "  ${RED}Failed:${NC}  $FAIL_COUNT"
    echo -e "  ${YELLOW}Warnings:${NC} $WARN_COUNT"
    echo ""
    
    if [[ "$FAIL_COUNT" -eq 0 ]]; then
        echo -e "${GREEN}All gates PASSED${NC}"
        return 0
    else
        echo -e "${RED}Gates FAILED - $FAIL_COUNT critical items need attention${NC}"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# Main
#-------------------------------------------------------------------------------
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           HSIS Quality Gate Verification                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    
    local gate="${1:-all}"
    
    case "$gate" in
        pm)
            verify_pm_gate
            ;;
        architect)
            verify_architect_gate
            ;;
        developer)
            verify_developer_gate
            ;;
        all)
            verify_pm_gate || true
            verify_architect_gate || true
            verify_developer_gate || true
            ;;
        *)
            echo "Usage: $0 [pm|architect|developer|all]"
            exit 1
            ;;
    esac
    
    print_summary
}

main "$@"
