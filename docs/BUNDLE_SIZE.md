# Bundle Size Guide

Rowan is designed to be lean and tree-shakeable for production builds. This guide explains bundle sizes, import patterns, and optimization strategies.

## Quick Reference

### Production Bundle Sizes (minified + gzip)

**Common components:**
- Button: 13.8 KB
- Checkbox: 14.4 KB
- Switch: 14.4 KB
- Text Field: 15.1 KB
- Select: 14.8 KB
- Alert: 13.8 KB
- Badge: 13.3 KB

**Charts:**
- Sparkline: 17.0 KB
- Trend Chart: 18.6 KB
- Bar Chart: 19.1 KB

**Complex components:**
- Table: 35.9 KB (includes virtualization, sorting, filtering, selection)
- Dropdown: 16.1 KB
- Dialog: 15.0 KB

**Common scenarios:**
- Button + Checkbox + Switch: **15.4 KB**
- Form controls (Button + TextField + Checkbox + Select + Textarea): **17.7 KB**

All sizes are **minified + gzip** and include the shared Rowan runtime (base components, token system, utilities).

## Import Patterns

### ✅ Recommended: Direct Component Imports

Import only the components you need:

```javascript
import "@rowan-ui/core/button";
import "@rowan-ui/core/checkbox";
import "@rowan-ui/core/switch";
```

**Benefits:**
- Optimal tree-shaking
- Smallest possible bundles
- Automatic component registration

### ⚠️ Not Recommended: Barrel Imports

Avoid importing from the main package entry:

```javascript
// ❌ DON'T DO THIS in production apps
import { RowanButton, RowanCheckbox, RowanSwitch } from "@rowan-ui/core";
```

**Why to avoid:**
- Each component file registers itself (side effect)
- Bundlers cannot tree-shake side-effectful modules
- Results in ~175 KB (all 109 components) instead of 15 KB

**When it's OK:**
- Prototyping and development
- Internal tools where bundle size isn't critical
- Applications that use most/all Rowan components

## Benchmark vs Production Sizes

The benchmark in `benchmarks/RESULTS.md` measures **unminified ESM** transfer over a local Vite dev server. This is useful for comparing component loading and registration overhead, but doesn't reflect production bundle sizes.

| Scenario | Dev (unminified) | Production (min+gzip) | Reduction |
|----------|-----------------|----------------------|-----------|
| 3 controls | 703 KB | 15.4 KB | **97.8%** |
| Table | 792 KB | 35.9 KB | **95.5%** |

Production builds use:
- **Minification** (esbuild, Terser, or similar)
- **Gzip or Brotli** compression
- **Tree-shaking** to remove unused code

Always measure your production build, not dev server transfer sizes.

## Token System

Rowan includes a comprehensive design token system (~100 KB source, ~10 KB gzipped in bundles). The token sheet defines all CSS custom properties and is shared across components.

**Token loading is optimized:**
- Loaded once per app
- Shared across all components
- Falls back to browser-native CSS @property when available
- Compressed efficiently (high redundancy)

The first component pulls in the token sheet; additional components add minimal overhead.

## Size Budget CI

Rowan enforces size budgets in CI to prevent regressions. If a PR exceeds the budget for any component, the build fails.

Run locally:

```bash
npm run size:check
```

Current budgets are in `scripts/check-size-budgets.mjs`.

## Optimization Tips

### 1. Import only what you need

```javascript
// ✅ Good: 15 KB
import "@rowan-ui/core/button";
import "@rowan-ui/core/text-field";

// ❌ Bad: 175 KB
import "@rowan-ui/core";
```

### 2. Lazy-load heavy components

For charts, tables, and other large components, use dynamic imports:

```javascript
// Load table only when needed
async function showDataView() {
  await import("@rowan-ui/core/table");
  const table = document.createElement("rowan-table");
  // ...
}
```

### 3. Use the right component

- For simple badges: `rowan-badge` (13 KB)
- For removable tags: `rowan-chip` (13 KB)
- For progress: `rowan-progress` (14 KB)
- For loading: `rowan-spinner` (14 KB)

### 4. Build with modern targets

Rowan uses modern JavaScript (ES2020). Configure your bundler to target modern browsers:

```javascript
// vite.config.js
export default {
  build: {
    target: 'es2020'
  }
}
```

### 5. Enable Brotli compression

Brotli compresses 15-20% better than gzip for Rowan bundles:

- 3 controls: 15.4 KB gzip → 12.6 KB brotli
- Table: 35.9 KB gzip → 30.4 KB brotli

Configure your CDN or server to serve `.br` files when available.

## Analyzing Your Bundle

### Using the analysis script

Generate a detailed report:

```bash
npm run size
```

This creates `.bundle-analysis/REPORT.md` with:
- Per-component sizes
- Common import scenarios
- Tree-shaking effectiveness
- Top 10 largest source files

### Using bundler tools

**Rollup:**
```bash
rollup --config --bundleConfigAsCjs --visualizer
```

**Webpack:**
```bash
webpack --json > stats.json
webpack-bundle-analyzer stats.json
```

**Vite:**
```bash
vite-bundle-visualizer
```

## FAQ

**Q: Why is my bundle larger than expected?**

A: Common causes:
1. Importing from `@rowan-ui/core` instead of `@rowan-ui/core/component`
2. Not enabling minification in your build
3. Including dev dependencies (Storybook, tests)
4. Using an old bundler that doesn't tree-shake well

**Q: Should I use Rowan in a performance-critical app?**

A: Yes! Rowan's production sizes are competitive with other web component libraries:
- Rowan 3 controls: 15.4 KB
- Lit 3 controls: ~10 KB (runtime only, no components)
- Shoelace equivalent: ~40-60 KB (with deps)
- Web Awesome equivalent: ~30-45 KB

The token system adds ~10 KB but is shared across all components.

**Q: Can I reduce the token overhead?**

A: The token sheet is generated from `src/tokens/tokens.css`. For specialized builds, you can:
1. Create a minimal token subset
2. Use CSS @property (modern browsers skip the fallback)
3. Load tokens from an external stylesheet

However, the ~10 KB overhead is minimal and worth the theming flexibility for most apps.

**Q: Why do charts have larger bundles?**

A: Charts include SVG rendering, axis generation, data transformation, and interactive features. Even so:
- Sparkline: 17 KB (minimal chart)
- Trend/Bar charts: 19 KB (full featured)
- Table: 36 KB (includes virtualization)

These are reasonable for their feature sets.

## Resources

- [Benchmark Methodology](../benchmarks/README.md)
- [Benchmark Results](../benchmarks/RESULTS.md)
- [Bundle Analysis Script](../scripts/analyze-bundle-size.mjs)
- [Size Budget Check](../scripts/check-size-budgets.mjs)

---

**Last updated:** October 31, 2026  
**Rowan version:** 0.22.0
