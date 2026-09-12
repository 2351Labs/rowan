# Rowan Sprint History

Last updated: 2026-09-11

## Current Product Snapshot

- Package: `@rowan-ui/core`
- Architecture: vanilla Web Components (Custom Elements, Shadow DOM, slots, ElementInternals)
- Current implemented catalog includes 63 components

## Completed Sprints

### Sprint 1: Feedback Workflows

Status: Completed

Delivered:

- `rowan-toast`
- `rowan-toaster`
- Queueing and auto-dismiss behavior
- User-driven dismiss and show event contracts
- Storybook stories, docs routes, CEM coverage, and contract tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 2: Date/Time Foundation

Status: Completed

Delivered:

- `rowan-date-picker`
- `rowan-time-picker`
- `rowan-calendar`
- FACE behavior for form value and validity
- Date/time range validation and keyboard interaction coverage
- Storybook stories, docs routes, exports, typings, tokens, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 3: Reporting Filters and Numeric Entry

Status: Completed

Delivered:

- `rowan-number-field`
- `rowan-date-range-picker`
- Min/max/step and ordered-range validation behavior
- User-only change event semantics
- Storybook report-filter usage scenarios
- Exports, typings, docs routing, README catalog updates, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 4: Document and Attachment Workflows

Status: Completed

Delivered:

- `rowan-file-upload`
- `rowan-dropzone`
- `rowan-file-item`
- Drag-and-drop plus click-to-picker file intake
- Upload queue states: queued, uploading, success, failed
- Event contracts for file add/remove/retry/cancel flows
- Storybook stories, docs routes, exports, typings, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 5: Guided Process Primitives

Status: Completed

Delivered:

- `rowan-stepper`
- `rowan-validation-summary`
- Step progression methods (`next`, `previous`, `goTo`) and `current-step` reflection contract
- Step activation event contract: `rowan-step-change` (user-triggered only)
- Form error aggregation support via `collectFromForm()` and jump event contract (`rowan-jump`)
- Storybook stories, docs routes, exports, typings, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 6: High-Level Workflow Component

Status: Completed

Delivered:

- `rowan-form-wizard`
- Configurable `steps` property plus declarative label fallback
- Named light-DOM step panels and one-step default-slot fallback
- Reflected `current-step` state with `next()`, `previous()`, `goTo()`, `complete()`, and `validateCurrentStep()` methods
- Scoped current-panel validity checks with `rowan-validation-summary` recovery
- User-only `rowan-step-change`, `rowan-invalid`, and `rowan-complete` event contracts
- Storybook stories, documentation route, CEM coverage, public exports, typings, tokens, README usage, and contract tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`
- Browser smoke test of the documentation workflow at desktop and mobile widths

### Sprint 7: Table Operations Layer (Part 1)

Status: Completed

Delivered:

- `rowan-table-toolbar`
- `rowan-bulk-actions-bar`
- Adjacent, `for-table`, and property-based table association without changing `rowan-table`'s public event contract
- Selection state synchronization for user interaction and parent-driven table state updates
- Property-only bulk action configuration plus slotted custom action controls
- User-only `rowan-bulk-action` and `rowan-clear-selection` event contracts
- Storybook composition stories, documentation routes, CEM coverage, public exports, typings, tokens, README usage, and contract tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`
- Browser smoke tests for table selection, bulk actions, clearing, and responsive desktop/mobile layouts

### Sprint 8: Table Operations Layer (Part 2)

Status: Completed

Delivered:

- `rowan-filter-builder`
- `rowan-row-details-panel`
- Property-only filter field and filter-state configuration with optional table-column inference
- User-only `rowan-filter-change` event contract without implicit table row mutation
- Read-only row details bound to `rowan-row-activate`, controlled row properties, and user-only `rowan-close`
- Accessible side-panel focus handling, Escape/backdrop dismissal, component tokens, Storybook stories, documentation routes, CEM coverage, exports, typings, README guidance, and contract tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`
- Browser smoke tests for table filtering, row details, user dismissal, and responsive desktop/mobile layouts

## Roadmap

### Sprint 9: Lifecycle and Interaction Reliability

Status: Completed

Delivered:

- Reconnect-safe listener lifecycle semantics in `BaseElement`, including state synchronization after detached attribute updates
- Opt-in observer restoration for observers that provide a reconnect callback
- Idempotent connected-callback bindings for accordion, drawer, menu, pagination, radio group, and tabs
- Restored user controls and document-level focus traps when active dialogs or row-details panels are disconnected and reconnected
- Regression coverage for action, form, navigation, overlay, and observer behavior across remove/reappend cycles
- Serial Web Test Runner execution so document-level modal focus tests run in isolated browser pages

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`
- Focused browser tests for BaseElement, button, text field, menu, dialog, and row-details panel reconnect behavior
- Full suite: 54 test files and 197 tests passed with no browser test-finish timeouts

### Sprint 10: Table Runtime and Contract Hardening

Status: Completed

Delivered:

- Keyed row reconciliation by row ID so selection, sort, and paging updates retain unchanged row DOM
- Selection-only updates synchronize selection controls without rearranging body rows
- Stable event delegation for table header, row, cell-action, and selection interactions
- Development warnings and safe fallbacks for duplicate or missing column IDs, duplicate row IDs, invalid cell types, and invalid row ID accessors
- Documented complete config replacement versus flattened partial-property update semantics in source API docs, the README, and static documentation
- Table regression coverage for DOM reuse, selection, sorting, pagination, custom cells, keyboard ownership, and invalid configuration handling

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`
- Browser checks with representative 100-, 1,000-, and 5,000-row configurations, including row identity across selection, paging, and sort updates

### Sprint 11: Distribution, Compatibility, and Benchmarking

Status: Locally complete; remote CI pending

Deliver:

- Published TypeScript declaration entry points with explicit export conditions and `HTMLElementTagNameMap` discovery for root and every current component subpath
- MIT license text and a documented semantic-versioning, generated-artifact, package-inspection, and publish process
- CI workflow for clean installation, lint, generated types, type contracts, CEM generation, generated-file consistency, serial component tests, Storybook, package inspection, and Chromium/Firefox/WebKit contracts
- A documented Playwright engine-family baseline for Chromium, Firefox, and WebKit without claiming unmeasured historic-version or Safari-specific support
- Deterministic CEM source-module creation so consecutive manifest generations are byte-stable
- Repeatable browser benchmark harness for import/definition, first render, reconnect, and public Rowan table selection, sorting, and paging APIs
- Checked-in 15-sample Chromium baseline for Rowan, Lit, FAST Element, and Web Awesome shared controls, with p50/p95 duration, internal DOM reuse, transfer size, best-effort heap growth, exact package versions, and explicit table-comparison limits

Verification completed locally:

- `npm ci`
- `npm run types`
- `npm run typecheck`, including a packed external ESM consumer
- `npm run lint`
- `npm test` (54 files, 205 passing contracts)
- `npm run analyze`
- `npm run build-storybook`
- Two consecutive types/CEM generations produced byte-identical artifacts
- `npm pack --dry-run --json` contains the source ESM, types, CEM, README, and license without benchmark or development tooling
- Chromium, Firefox, and WebKit each passed 54 files and 205 public contracts
- Benchmark methodology and results are checked into `benchmarks/README.md`, `benchmarks/RESULTS.md`, and `benchmarks/results/latest.json`

Pending external verification:

- Push the changes and require the new CI workflow to pass on GitHub before calling Sprint 11 fully complete.

### Sprint 12: Hierarchical Navigation

Status: Completed

Delivered:

- `rowan-tree` and `rowan-tree-item`
- Nested light-DOM tree composition through the `children` slot with primitive reflected node state
- Roving tab stops, standard Arrow/Home/End keyboard traversal, disclosure controls, disabled-node skipping, and focus-state cleanup when nodes move between trees
- Default tree and treeitem semantics through ElementInternals, including levels, disclosure and selection state, and controller-derived sibling position metadata without replacing author-provided ARIA
- Property-only `selected` values, `selectedItems` and `clearSelection()` APIs, and silent parent-driven selection/disclosure updates
- User-only, bubbling and composed `rowan-change` and `rowan-toggle` event contracts
- Component tokens, Storybook composition stories, a static documentation route, CEM coverage, root and subpath exports, declarations, global tag mapping, README guidance, and contract tests

Verification completed at sprint close:

- `npm run types`
- `npm run typecheck`
- `npm run lint`
- `npm test` (56 files, 220 passing contracts)
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm run build-storybook`
- `npm pack --dry-run --json` includes tree source, declaration wrappers, generated types, and CEM
- Chromium, Firefox, and WebKit each passed 56 files and 220 public contracts

### Sprint 13: Power-User UX

Status: Completed

Delivered:

- `rowan-command-palette` and `rowan-command-item`
- Slotted command metadata with reflected labels, descriptions, values, groups, keywords, shortcuts, and disabled state
- Query filtering that preserves author-hidden items and reacts to live command metadata updates
- Keyboard-first traversal, active-descendant state, focus containment and return, and optional platform-aware hotkeys
- User-only, bubbling and composed `rowan-command` and `rowan-close` event contracts
- Component tokens, Storybook composition stories, static documentation route, README guidance, CEM coverage, root and subpath exports, declarations, global tag mapping, and contract tests

Verification completed at sprint close:

- Focused command contracts: 14 passing
- `npm test` (58 files, 234 passing contracts)
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm run build-storybook`
- `npm pack --dry-run --json` includes command source, CSS, declaration wrappers, generated types, and CEM
- Chromium, Firefox, and WebKit each passed 58 files and 234 public contracts
- Static documentation smoke checks at desktop and mobile widths, including filtering, activation, Escape dismissal, and dark-theme rendering

### Sprint 14: Button Visual Refinement

Status: Completed

Delivered:

- Refined `rowan-button` and `rowan-icon-button` with intentional primary, secondary, ghost, danger, hover, pressed, focus-visible, disabled, and reduced-motion states
- Added the complete button token layer for state surfaces, foregrounds, borders, sizing, spacing, typography, focus, loading, and component-owned border width
- Restored the internal button styling hook, exposed `prefix`, `suffix`, and `spinner` parts, and preserved loading accessibility with `aria-busy` plus disabled activation
- Synchronized `src/tokens/sheet.js` deterministically from `src/tokens/tokens.css`, with inheriting primitive/semantic defaults, dynamic component aliases, document-level token overrides, and standalone stylesheet fallback across shadow roots
- Added button and icon-button visual-state stories, refreshed static button documentation with state/token examples, and regenerated CEM and declaration artifacts
- Added focused regressions for the internal styling hook, document-level token inheritance, loading state, and disabled activation

Verification completed at sprint close:

- Focused button and icon-button contracts: 12 passing
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm test` (58 files, 239 passing contracts)
- `npm run build-storybook` (Vite chunk-size advisory only)
- `npm pack --dry-run --json` includes the generated token sheet, updated button sources, declarations, generated types, and CEM
- Chromium, Firefox, and WebKit each passed 58 files and 239 public contracts
- Static documentation checks confirmed intentional light/dark button surfaces, loading state, and no horizontal overflow at desktop and 390px mobile widths

### Sprint 15: Dense Forms

Status: Completed

Delivered:

- `rowan-slider` with reflected numeric state, single-value and ordered range modes, native range keyboard interaction, a property-only formatter, and `rowan-change` events only for user input
- FACE support for slider form values, validity, reset, and state restoration, including independent `name-start` and `name-end` range submission values
- `rowan-form-field` as a non-owning accessible wrapper for direct or externally associated controls, with label, hint, description, error, and action slots plus preserved author ARIA references
- `rowan-form-layout` responsive field grids with bounded columns, direct-child `span` support, start/top label coordination, inline custom-property restoration, and nested-shadow mobile stacking without horizontal overflow
- Dedicated component token layers, guarded element definitions, visual hidden states, CSS parts, Storybook composition stories, static documentation routes, and README usage guidance
- Root and subpath exports, declaration bridges, generated type definitions, global tag mappings, CEM entries, and regression coverage for slider endpoints, field support text, spans, and responsive layout behavior

Verification completed at sprint close:

- Focused Dense Forms contracts: 17 passing
- `npm run tokens:sync` and `npm run tokens:check`
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm test` (61 files, 256 passing contracts)
- `npm run build-storybook` (Vite chunk-size advisory only)
- `npm pack --dry-run --json` excludes documentation and build artifacts
- Chromium, Firefox, and WebKit each passed 61 files and 256 public contracts
- Static documentation checks at desktop and 390px mobile widths confirmed spans, formatted slider output, field stacking, and no horizontal overflow

### Sprint 16: Structured Selection

Status: Completed

Delivered:

- `rowan-listbox` and `rowan-option` as reusable accessible single- and multi-selection primitives
- Light-DOM option composition with default, prefix, and suffix slots; primitive reflected option state; roving tab stops; keyboard selection; disabled-option skipping; and preserved author tab-index state
- FACE form values, required validity, reset, and state restoration for listbox selection, including repeated `FormData` entries in multiple mode
- `rowan-multi-select-combobox` with property-only `options` and `selected` arrays, query filtering, removable chips, keyboard removal, focus transfer, outside dismissal, repeated FACE form submission, and one user-only outer `rowan-change` event
- `rowan-segmented-control` for compact mutually exclusive application modes, with property-only options, reflected scalar values, radiogroup keyboard conventions, FACE form support, reset, restore, and user-only `rowan-change` events
- Reconnect-safe compound-control document listener ownership, component token layers, dark-theme active-state contrast, guarded definitions, visual hidden states, CSS parts, Storybook stories, static documentation routes, README guidance, root and subpath exports, declaration bridges, global tag mappings, CEM entries, and contract tests

Verification completed at sprint close:

- Focused Structured Selection contracts: 17 passing
- `npm run tokens:sync` and `npm run tokens:check`
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm test` (65 files, 273 passing contracts)
- `npm run build-storybook`
- `npm pack --dry-run --json` includes Sprint 16 source modules, declaration bridges, and CEM without documentation or development artifacts
- Chromium, Firefox, and WebKit each passed 65 files and 273 public contracts
- Static documentation checks at desktop and 390px mobile widths confirmed all four routes, property-driven demo data, user selection interactions, dark-theme active-state contrast, and no horizontal overflow

### Sprint 17: Large Collections

Status: Planned

Planned components and enhancements:

- `rowan-virtual-list` with property-only item data, stable item keys, render callbacks, and native `ResizeObserver` sizing
- A virtualized body mode for `rowan-table` that reuses the collection primitive without introducing a separate data-grid API

### Sprint 18: Application Workspaces

Status: Planned

Planned components:

- `rowan-split-pane` with start/end slots, a keyboard-operable separator, orientation, constraints, snap points, and a user-only resize event
- `rowan-app-layout` for responsive header, navigation, and content composition
- `rowan-side-nav` and `rowan-side-nav-item` for application navigation without overloading `rowan-tree`

### Sprint 19: Contextual Actions

Status: Planned

Planned components:

- `rowan-confirm-dialog`, composed from `rowan-dialog` for destructive and consequential decisions
- `rowan-context-menu`, composed from Rowan's menu and overlay primitives with pointer and keyboard invocation
- `rowan-status-indicator` for concise semantic status display

Deferred unless a product use case requires them:

- Color picker, rating, rich-text editing, charting, maps, carousels, bundled iconography, and display-only `Intl` formatter elements

## Notes

- Sprint history is tracked in-repo alongside Git history.
- `custom-elements.json` remains the API documentation source of truth and should be regenerated after each sprint increment.
