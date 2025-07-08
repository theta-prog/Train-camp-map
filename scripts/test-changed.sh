#!/bin/bash
# Test script for running tests related to changed files

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Smart Test Runner${NC}"
echo "Running tests for changed files..."

# Function to get changed files
get_changed_files() {
    case "$1" in
        "staged")
            git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true
            ;;
        "uncommitted")
            git diff --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true
            ;;
        "since-commit")
            git diff ${2:-HEAD~1} --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true
            ;;
        *)
            echo -e "${RED}Error: Unknown option $1${NC}"
            echo "Usage: $0 [staged|uncommitted|since-commit] [commit-ref]"
            exit 1
            ;;
    esac
}

# Function to run tests for specific files
run_tests_for_files() {
    local files="$1"
    
    if [ -z "$files" ]; then
        echo -e "${YELLOW}⚠️  No changed files found${NC}"
        return 0
    fi
    
    echo -e "${GREEN}📁 Changed files:${NC}"
    echo "$files" | sed 's/^/  /'
    echo
    
    # Convert newlines to spaces for jest command
    local files_space_separated=$(echo "$files" | tr '\n' ' ')
    
    echo -e "${BLUE}🔍 Finding and running related tests...${NC}"
    npm run test -- --findRelatedTests $files_space_separated --coverage --verbose
}

# Function to show test coverage summary
show_coverage_summary() {
    if [ -f "coverage/coverage-summary.json" ]; then
        echo -e "${GREEN}📊 Coverage Summary:${NC}"
        node -e "
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
            const total = coverage.total;
            console.log(\`  Statements: \${total.statements.pct}%\`);
            console.log(\`  Branches: \${total.branches.pct}%\`);
            console.log(\`  Functions: \${total.functions.pct}%\`);
            console.log(\`  Lines: \${total.lines.pct}%\`);
        "
    fi
}

# Main execution
MODE=${1:-"uncommitted"}
COMMIT_REF=${2:-"HEAD~1"}

echo -e "${BLUE}Mode: $MODE${NC}"
if [ "$MODE" = "since-commit" ]; then
    echo -e "${BLUE}Comparing with: $COMMIT_REF${NC}"
fi
echo

changed_files=$(get_changed_files "$MODE" "$COMMIT_REF")
run_tests_for_files "$changed_files"

echo
show_coverage_summary

echo -e "${GREEN}✅ Test execution completed${NC}"
