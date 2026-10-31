# Agent Rules & Contributing Guide

This document defines the development workflow and quality standards for both human contributors and AI coding agents working on Rowan.

## Pre-PR Checks: Local CI

**Before every push to a PR branch**, you must:

1. **Run the full local CI suite** and get it green:
   ```bash
   npm run ci:local
   ```
   
2. **Only push commits that pass all checks.** Never push failing code and fix it with follow-up commits.

3. **Create branches fresh from the latest `origin/main`:**
   ```bash
   git fetch origin main
   git checkout -b your-branch-name origin/main
   ```
   Never carry commits that are already merged into main.

4. **Open PRs only after the full local run passes.** Your PR description should include the local CI summary showing all checks passed.

### Quick Iteration Mode

During development, use the quick mode for fast feedback:

```bash
npm run ci:local -- --quick
```

This runs lint, types, typecheck, analyze, the generated-artifacts check, unit tests, and size:check only. Use this for rapid iteration, but **always run the full suite before pushing**.

### Local CI Options

```bash
# Full run (all browsers, all checks)
npm run ci:local

# Quick mode (fast iteration)
npm run ci:local -- --quick

# Single browser (faster browser tests)
npm run ci:local -- --browser=chromium

# Continue on errors (see all failures)
npm run ci:local -- --keep-going

# Clean install first
npm run ci:local -- --clean
```

### What CI Checks

The local CI runner (`npm run ci:local`) mirrors `.github/workflows/ci.yml` exactly:

**Quality checks:**
- Linting (ESLint)
- Type generation and type checking (TypeScript)
- Custom Elements Manifest analysis
- React wrapper generation
- Generated artifacts verification (git status check)
- Unit tests (Web Test Runner)
- Package registration tests
- Bundle size budget checks
- Icon package lint, types, tests

**Browser compatibility tests** (Chromium, Firefox, WebKit):
- Browser-based Web Test Runner tests
- Icon package browser tests

**Documentation and build verification:**
- Documentation site build
- Storybook build
- Documentation version consistency
- Component API coverage
- npm pack dry-run (core, icons, maplibre)
- Pages assembly verification

### Generated Artifacts

When you change public APIs (components, properties, methods, events), regenerate artifacts:

```bash
npm run analyze
```

This updates:
- `custom-elements.json` (Custom Elements Manifest)
- `types/` (TypeScript declarations)
- `src/react/generated/` (React wrappers)
- Same for `packages/icons/` and `packages/maplibre/`

**Commit these changes with your code changes.** The CI fails if generated artifacts are out of sync.

### Size Budgets

Component bundle sizes are tracked in `scripts/size-budgets.json`. If your change breaks the budget:

1. **First, try to reduce the size.** Every kilobyte matters for web components.
2. If the increase is unavoidable, **document the reason in your PR description** before adjusting the budget.
3. **Never silently increase budgets without explanation.**

## Git Hooks (Optional)

Optionally install a pre-push hook that runs `npm run ci:local -- --quick` automatically:

```bash
npm run hooks:install
```

This catches issues before you push, but it's opt-in. You can skip it:

```bash
ROWAN_SKIP_HOOKS=1 git push
```

Uninstall hooks by resetting git's hooks path:

```bash
git config --unset core.hooksPath
```

## Standards for All Contributors

### Never Skip or Disable Checks

- **Do not add `eslint-disable` comments** without strong justification.
- **Do not skip tests** with `.skip()` or `xit()`.
- **Do not mark tests as `.only()`** in committed code.
- **Do not bypass CI checks** in GitHub (no "Skip CI" commits).

If a check is blocking you unfairly, discuss it in the PR or issue first.

### Branch Management

1. **Always base new branches on the latest `origin/main`:**
   ```bash
   git fetch origin main
   git checkout -b feature-name origin/main
   ```

2. **Never include commits already merged to main.** If you branched from old main, rebase onto latest main before opening the PR.

3. **Keep PRs focused.** One logical change per PR. Split large changes into stacked PRs if needed.

### Commit Hygiene

- **Write clear commit messages.** Explain *what* and *why*, not just *what*.
- **Commit generated artifacts with code changes.** Don't separate them into "Regenerate types" commits.
- **Push only green commits.** Run `npm run ci:local` before pushing.

### PR Descriptions

Your PR description should include:

1. **What changed** (high-level summary)
2. **Why it changed** (motivation, issue link)
3. **Local CI summary** (copy the `npm run ci:local` output showing all checks passed)
4. **Size budget adjustments** (if any, with justification)
5. **Breaking changes** (if any, with migration guide)

Example:

```
## Summary

Add `rowan-data-grid` component for displaying tabular data with sorting, filtering, and virtualization.

Fixes #123

## Local CI

```
✅ All CI local checks PASSED

Total: 45 checks, 45 passed, 0 failed
Duration: 8m 32s
```

## Size Impact

- Core bundle: +12.3 KB (within budget)
- New `data-grid` chunk: 45.2 KB

## Breaking Changes

None.
```

## For AI Coding Agents

AI agents working on Rowan must follow these additional guidelines:

### Always Run CI Before Opening PRs

1. After completing changes, run the full CI suite:
   ```bash
   npm run ci:local
   ```

2. If it fails, fix the issues. Do not open a PR with failing checks.

3. Include the CI summary in the PR description.

### Regenerate Artifacts

If you change component APIs:

1. Run `npm run analyze` to regenerate Custom Elements Manifest, types, and React wrappers.
2. Commit the generated files with your changes.
3. Verify the generated artifacts check passes in `npm run ci:local`.

### Never Suppress Checks

- Do not add `eslint-disable` comments to bypass lint errors. Fix the error.
- Do not add `@ts-ignore` or `@ts-expect-error` to bypass type errors. Fix the type.
- Do not mark failing tests as `.skip()`. Fix or remove the test.

### Branch Naming

Use descriptive branch names:
- `fix/button-focus-ring`
- `feature/data-grid`
- `refactor/chart-rendering`

### Testing Your Changes

After running `npm run ci:local` successfully:

1. Manually test your changes in Storybook or the documentation site.
2. Test in all supported browsers (Chromium, Firefox, WebKit) if your change affects rendering.
3. Test with keyboard navigation and screen readers if your change affects accessibility.

### Size Budgets

If `npm run size:check` fails:

1. Check `scripts/size-budgets.json` to see which component exceeded the budget.
2. Try to reduce the size (e.g., tree-shake unused code, defer imports).
3. If unavoidable, document the reason in the PR description before adjusting the budget.

## Contributing Workflow

### For First-Time Contributors

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Install dependencies: `npm ci`
4. Create a branch: `git checkout -b your-feature-name`
5. Make your changes.
6. Run `npm run ci:local` and fix any failures.
7. Push to your fork.
8. Open a PR against `2351Labs/rowan` main branch.

### For Repeat Contributors

If you have write access:

1. Clone the repository (no fork needed).
2. Create a branch from latest main: `git checkout -b your-feature-name origin/main`
3. Make your changes.
4. Run `npm run ci:local` and fix any failures.
5. Push to origin: `git push -u origin your-feature-name`
6. Open a PR against main.

### Development Commands

```bash
# Install dependencies
npm ci

# Run Storybook (component playground)
npm run storybook

# Run documentation site (component docs)
npm run documentation

# Run tests
npm test

# Run browser tests
npm run test:browser

# Lint
npm run lint

# Type check
npm run typecheck

# Generate types
npm run types

# Analyze and generate manifests
npm run analyze

# Check size budgets
npm run size:check

# Full local CI
npm run ci:local

# Quick CI (fast iteration)
npm run ci:local -- --quick
```

## Questions?

- Open an issue for bugs or feature requests.
- Start a discussion for questions or design proposals.
- Read the documentation at https://2351labs.github.io/rowan/

---

**Remember:** Quality is non-negotiable. Run `npm run ci:local` before every push. Keep PRs green. Ship only production-ready code.
