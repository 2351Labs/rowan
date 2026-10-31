# Bundle Size Guide

Rowan is designed to be lean and tree-shakeable for production builds. This guide explains bundle sizes, import patterns, and optimization strategies.

## Quick Reference

### Production Bundle Sizes (minified + gzip)

**Common components:**

- Button: 6.8 KB
- Checkbox: 6.7 KB
- Switch: 6.7 KB
- Text Field: 7.4 KB
- Select: 7.0 KB
- Alert: 6.0 KB
- Badge: 5.6 KB

**Charts:**

- Sparkline: 9.5 KB
- Trend Chart: 12.4 KB
- Bar Chart: 12.0 KB

**Complex components:**

- Table: 34.5 KB (includes virtualization, sorting, filtering, selection)
- Dropdown: 9.0 KB
- Dialog: 7.2 KB

**Common scenarios:**

- Button + Checkbox + Switch: **8.4 KB**
- Form controls (Button + TextField + Checkbox + Select + Textarea): **10.7 KB**

All sizes are **minified + gzip** initial graphs. A component's own token defaults are in that graph. The full token catalog and the legacy CSS fallback are separate chunks.

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

- The barrel import registers ALL 109 components (side effect)
- Each component file calls `define()` to register itself
- Bundlers cannot tree-shake auto-registering components
- Results in the full component set instead of about 8 KB for three controls
- This is correct behavior, not a bug - the import does exactly what it's supposed to do

**When it's OK:**

- Prototyping and development
- Internal tools where bundle size isn't critical
- Applications that use most/all Rowan components

## Benchmark vs Production Sizes

The benchmark in `benchmarks/RESULTS.md` measures **unminified ESM** transfer over a local Vite dev server. This is useful for comparing component loading and registration overhead, but doesn't reflect production bundle sizes.

| Scenario            |             Dev transfer before |       Dev transfer after | Production gzip before | Production gzip after |
| ------------------- | ------------------------------: | -----------------------: | ---------------------: | --------------------: |
| 3 controls          |            819 KB (31.9 ms p50) | **327 KB (28.2 ms p50)** |                15.4 KB |            **8.4 KB** |
| Table initial graph | n/a (dev figure is incremental) |                      n/a |                41.0 KB |           **34.5 KB** |

The dev numbers are from one Linux host, 15 samples, the same harness as `npm run benchmark`. The older checked-in 703 KB / 11.6 ms row was a different machine and an older tree. Web Awesome's three controls transferred 263 KB on this host; Lit transferred 80 KB.

Production builds use:

- **Minification** (esbuild, Terser, or similar)
- **Gzip or Brotli** compression
- **Tree-shaking** to remove unused code

Always measure your production build, not dev server transfer sizes.

## Token System

Primitive and semantic tokens (color, space, type) register through `CSS.registerProperty` from a small shared module. Each component then ships only its own component-token declarations.

The full token stylesheet (`legacy-sheet.js`) loads only when `CSS.registerProperty` is unavailable. Importing `@rowan-ui/core/button` does not download every component's tokens or that legacy stylesheet.

Direct imports stay synchronous: `rowan-button` imports `tokens/parts/button.js` and applies those defaults on first paint. Components that do not declare `componentTokenPrefixes` do not pay for a token part.

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
// ✅ Good: about 8 KB gzip for button + text field shared runtime
import "@rowan-ui/core/button";
import "@rowan-ui/core/text-field";

// ❌ Bad: registers every component
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

- For simple badges: `rowan-badge` (5.6 KB)
- For removable tags: `rowan-chip` (5.9 KB)
- For progress: `rowan-progress` (6.5 KB)
- For loading: `rowan-spinner` (5.9 KB)

### 4. Build with modern targets

Rowan uses modern JavaScript (ES2020). Configure your bundler to target modern browsers:

```javascript
// vite.config.js
export default {
  build: {
    target: "es2020",
  },
};
```

### 5. Enable Brotli compression

Brotli compresses 15-20% better than gzip for Rowan bundles:

- 3 controls: 8.4 KB gzip, and Brotli is smaller still
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

- Rowan 3 controls: 8.4 KB
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
