# Contributing to HSIS

Thank you for your interest in contributing to the Hierarchical Specialized Intelligence Swarm framework!

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Dog-Fooding: Use HSIS to Build HSIS](#dog-fooding-use-hsis-to-build-hsis)
3. [Contribution Types](#contribution-types)
4. [Development Setup](#development-setup)
5. [Commit Convention](#commit-convention)
6. [Pull Request Process](#pull-request-process)
7. [Quality Gates](#quality-gates)
8. [Getting Help](#getting-help)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and considerate
- Focus on constructive feedback
- Welcome newcomers and help them learn
- Report unacceptable behavior to maintainers

---

## Dog-Fooding: Use HSIS to Build HSIS

The best way to contribute to HSIS is to **use HSIS itself**. This demonstrates the framework's capabilities and ensures contributions follow our structured workflow.

### Step 1: Write Your Intake

Create a requirement document in `.swarm/intake/`:

```markdown
# .swarm/intake/my-contribution.md

## Feature Request: [Your Feature Name]

### What We Need
[Describe the feature or fix in plain language]

### Requirements
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

### Constraints
- Must integrate with existing framework
- Must include tests
- Must follow existing patterns

### Success Criteria
- [ ] Feature works as described
- [ ] All tests pass
- [ ] Documentation updated
```

### Step 2: Run the PM Phase (Gemini)

```bash
# Generate a formal PRD from your intake
./scripts/swarm-orchestrator.sh pm

# Or run Gemini directly
gemini "Read GEMINI.md. Create PRD from .swarm/intake/my-contribution.md"
```

**Output:** `docs/PRD.md` with numbered requirements

### Step 3: Run the Architect Phase (Codex)

```bash
# Generate architecture and implementation plan
./scripts/swarm-orchestrator.sh architect

# Or run Codex directly
codex "Read AGENTS.md. Create architecture from docs/PRD.md"
```

**Outputs:**
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `adrs/ADR-###.md` (if needed)

### Step 4: Run the Developer Phase (Claude)

```bash
# Implement the feature
./scripts/swarm-orchestrator.sh developer

# Or run Claude directly
claude "Read CLAUDE.md. Implement from docs/ARCHITECTURE.md"
```

**Outputs:**
- Source code in `src/`
- Tests in `tests/`
- `docs/IMPLEMENTATION_REPORT.md`

### Step 5: Submit Your PR

Include all generated artifacts in your PR:

```bash
git add .swarm/intake/my-contribution.md
git add docs/PRD.md docs/ARCHITECTURE.md docs/IMPLEMENTATION_PLAN.md
git add adrs/
git add src/ tests/
git add docs/IMPLEMENTATION_REPORT.md
git commit -m "feat: add [feature name] using HSIS workflow"
git push origin feature/my-contribution
```

---

## Contribution Types

### Documentation Improvements

Even documentation changes can use HSIS:

1. Write intake describing the documentation gap
2. PM phase produces scope and acceptance criteria
3. Architect phase designs document structure
4. Developer phase writes the content

Or for small fixes:

```bash
git checkout -b docs/fix-typo
# Make your changes
git commit -m "docs: fix typo in README"
```

### Bug Fixes

1. Create intake describing the bug and expected behavior
2. Run full HSIS workflow
3. Include test that reproduces the bug
4. Submit PR with fix and tests

### New Features

1. Create detailed intake with requirements
2. Run full HSIS workflow
3. Include comprehensive tests
4. Update relevant documentation

### Framework Enhancements

For changes to HSIS itself:

1. Create intake in `.swarm/intake/hsis-enhancement-[name].md`
2. Run workflow (meta-dogfooding!)
3. Ensure backward compatibility
4. Update constraint files if needed (GEMINI.md, AGENTS.md, CLAUDE.md)

---

## Development Setup

### Prerequisites

- Node.js v20+
- Python 3.11+ (optional, for some scripts)
- API Keys configured (see [CONFIGURATION.md](CONFIGURATION.md))

### Clone and Configure

```bash
# Clone the repository
git clone https://github.com/yourusername/hsis-framework.git
cd hsis-framework

# Initialize the swarm
./scripts/init-swarm.sh

# Verify configuration
./scripts/verify-gates.sh
```

### Running Tests

```bash
# Run all quality checks
make lint
make test

# Run specific test suites
npm run test:unit
npm run test:integration
```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no code change |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(pm): add validation for requirement IDs
fix(architect): correct ADR template path resolution
docs(readme): add quick start guide
test(developer): add integration tests for gate validation
```

### Co-authorship

When using AI assistance, include co-authorship:

```bash
git commit -m "feat: implement task filtering

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Pull Request Process

### Before Submitting

1. Ensure all tests pass locally
2. Run linting and formatting
3. Update documentation if needed
4. Include HSIS artifacts (if applicable)

### PR Template

```markdown
## Summary
[Brief description of changes]

## HSIS Artifacts (if applicable)
- [ ] Intake document in `.swarm/intake/`
- [ ] PRD generated by PM phase
- [ ] Architecture generated by Architect phase
- [ ] Implementation Report generated by Developer phase

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Framework enhancement

## Testing
- [ ] All existing tests pass
- [ ] New tests added for changes
- [ ] Manual testing completed

## Checklist
- [ ] Commit messages follow convention
- [ ] Documentation updated
- [ ] No breaking changes (or documented in PR)
```

### Review Process

1. Automated checks run (lint, test, coverage)
2. Maintainer reviews code and artifacts
3. Address feedback and update PR
4. Maintainer approves and merges

---

## Quality Gates

All contributions must pass the same gates as HSIS workflow:

### Documentation Changes

- [ ] Markdown renders correctly
- [ ] Links are valid
- [ ] Examples are accurate
- [ ] No spelling/grammar errors

### Code Changes

- [ ] All tests pass
- [ ] Lint checks pass
- [ ] Coverage threshold met (>80%)
- [ ] No security vulnerabilities
- [ ] Backward compatible (or documented breaking change)

### Framework Changes

- [ ] Constraint files updated if needed
- [ ] Templates updated if needed
- [ ] Scripts updated if needed
- [ ] Example projects still work

---

## Getting Help

### Questions

- Check existing [documentation](../README.md)
- Search [existing issues](https://github.com/yourusername/hsis-framework/issues)
- Open a new issue with the `question` label

### Bug Reports

Open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, versions)

### Feature Requests

Open an issue with:
- Description of the feature
- Use case / motivation
- Proposed implementation (optional)

### Discussion

Join discussions in the repository's Discussions tab for:
- General questions
- Ideas and feedback
- Community showcase

---

## Recognition

Contributors are recognized in:
- `CHANGELOG.md` entries
- GitHub release notes
- Contributors list in README

Thank you for helping improve HSIS!
