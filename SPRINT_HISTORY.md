# Rowan Sprint History

Last updated: 2026-09-14

## Current Product Snapshot

- Package: `@rowan-ui/core`
- Architecture: vanilla Web Components (Custom Elements, Shadow DOM, slots, ElementInternals)
- Current implemented catalog includes 75 components
- Optional integration: `@rowan-ui/maplibre` with `rowan-maplibre-map`

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

Status: Completed

Delivered:

- `rowan-virtual-list` with property-only item data, stable string or callback keys, render callbacks, estimated item sizing, overscan, `scrollToIndex()`, and native `ResizeObserver` row measurement
- Shared keyed `VirtualCollection` layout infrastructure for bounded DOM windows, measured variable-height items, and stable key reconciliation
- Opt-in `rowan-table` virtualized body mode through `virtualized`, `virtualItemSize`, and `virtualOverscan`, including equivalent configuration fields and declarative attributes
- Semantic table virtualization with mounted `<tr>` rows between accessible spacer rows, a bounded scroll viewport, native row measurement, and unchanged selection, sorting, paging, row activation, and cell-event contracts
- Safe full-body fallback for duplicate row IDs, retaining existing validation and reconciliation guarantees
- Component and table viewport token hooks, Storybook large-collection stories, static documentation demos, responsive docs navigation, README guidance, public subpath/root exports, declarations, global tag mapping, CEM coverage, and contract tests

Verification completed at sprint close:

- Focused virtual-list and table contracts: 23 passing
- `npm run tokens:sync` and `npm run tokens:check`
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm test` (66 files, 276 passing contracts)
- `npm run build-storybook` (Vite chunk-size advisory only)
- `npm pack --dry-run --json` includes source ESM, declarations, tokens, and CEM without documentation or development artifacts
- Chromium, Firefox, and WebKit each passed 66 files and 276 public contracts
- Static documentation checks at desktop and 390px mobile widths confirmed bounded 500-item and 500-row windows, programmatic list navigation, semantic table rows, independently scrollable mobile navigation, and no horizontal overflow
- `git diff --check` passed; the repository-wide Prettier check still reports 66 pre-existing, unrelated files outside the Sprint 17 surface

### Sprint 18: Application Workspaces

Status: Completed

Delivered:

- `rowan-split-pane` with start/end slots, horizontal and vertical modes, percentage constraints, property-only snap points, pointer resizing, and keyboard-operable separator controls
- `rowan-app-layout` as a responsive header, navigation, and default-content shell with compact off-canvas navigation, inert closed-state protection, and user-only navigation state events
- `rowan-side-nav` and `rowan-side-nav-item` for flat application navigation with roving Arrow, Home, End, Enter, and Space interaction without overloading tree hierarchy semantics
- Safe link handling, active destination state, prefix/suffix composition, native landmark semantics, guarded definitions, visual hidden states, and component-token layers
- Storybook stories, static documentation routes and live event demos, README workspace guidance, root and subpath exports, declaration bridges, global tag mappings, CEM entries, and public contract coverage

Verification completed at sprint close:

- Focused workspace contracts: 8 passing
- `npm run tokens:sync` and `npm run tokens:check`
- `npm run lint`
- `npm run types`
- `npm run typecheck`
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm test` (70 files, 284 passing contracts)
- Chromium, Firefox, and WebKit each passed 70 files and 284 public contracts
- `npm run build-storybook`
- `npm pack --dry-run --json` includes the ESM source and declarations without documentation artifacts
- Desktop and 390px static documentation checks confirmed semantic application landmarks, compact navigation state, keyboard split-pane resizing, event logging, and no horizontal overflow
- Scoped Prettier validation of all authored Sprint 18 files and `git diff --check` passed

### Sprint 19: Contextual Actions

Status: Completed

Delivered:

- `rowan-confirm-dialog`, composed from `rowan-dialog` for consequential decisions with reflected state, configurable labels and confirm variant, and explicit user-only confirm, cancel, and passive-dismiss events
- `rowan-context-menu`, composed from Rowan menu primitives with `for` and property target binding, native context-click and keyboard invocation, Arrow/Home/End focus movement, selection handling, outside/Escape dismissal, and focus return
- Roving-focus hooks on `rowan-menu-item` so contextual composition uses supported element behavior instead of component shadow-root reach-through
- `rowan-status-indicator` for concise persistent semantic status with neutral, info, success, warning, and danger tones; label fallback or slot content; size; restrained optional pulse; and default status accessibility
- Component token layers, guarded definitions, visual hidden states, CSS parts, Storybook stories, static documentation routes and live event demos, README guidance, root and subpath exports, declaration bridges, global tag mapping, CEM entries, and public contract coverage

Verification completed at sprint close:

- Focused contextual-action contracts: 14 passing
- `npm run tokens:sync` and `npm run tokens:check`
- `npm run types` and `npm run typecheck`
- `npm run lint`
- `npm test` (73 files, 297 passing contracts)
- Two consecutive `npm run analyze` runs produced byte-identical manifests
- `npm run build-storybook`
- `npm pack --dry-run --json` includes source ESM, declarations, generated tokens, and CEM without documentation artifacts
- Chromium, Firefox, and WebKit public-contract runs passed
- Static documentation checks at desktop and 390px widths confirmed confirmation outcomes, contextual selection and keyboard movement, semantic status variants, viewport-safe overlays, and no horizontal overflow
- Scoped Prettier validation and `git diff --check` passed

### Sprint 20: React Interoperability

Status: Completed

Delivered:

- An opt-in `@rowan-ui/core/react` facade with no effect on the framework-neutral root runtime, an optional React peer dependency, and development-only React 18 and React 19 test baselines
- `useRowanElement(ref, { properties, events })` for direct property assignment, native custom-event subscription cleanup, React host replacement, and client-only registration patterns without component wrappers or synthetic event props
- JSX declarations derived from the existing global Rowan tag map, preserving typed refs and scalar attributes across all 71 public tags, plus a separately typed `useRowanElement` property surface for structured values, render callbacks, and the public `for` exception
- Separate React 18 and React 19 TSX fixtures that verify all Rowan tags are represented, real table property binding is typed, invalid property values are rejected, and both JSX namespace conventions work
- Browser contracts for complex table data assignment, stale listener replacement and unmount cleanup, host replacement through a stable React ref, and hydration-safe client registration
- README and static documentation guidance for JSX scalars, ref-bound structured data, native `rowan-change` and `rowan-click` listeners, per-component client registration, and Next.js server-rendering boundaries

Verification completed at sprint close:

- Focused React facade browser contracts: 3 passing
- `npm run lint`, `npm run types`, and `npm run typecheck`
- `npm test` (74 files, 300 passing contracts)
- Two consecutive `npm run analyze` runs produced byte-identical manifests with 71 unique Rowan tags
- `npm run build-storybook`
- `npm pack --dry-run --json`: 616 files and 2,979,295 unpacked bytes; includes React facade source and declarations while excluding documentation and Storybook output
- Chromium, Firefox, and WebKit each passed 74 files and 300 public contracts
- Static React documentation checks at desktop and 390px mobile widths, including route rendering, navigation, and no page-level horizontal overflow
- Scoped Prettier validation and `git diff --check`

#### DS-09: Typed React JSX and Native Event Interop

**User story:** As a React and TypeScript team, I want official, SSR-safe guidance, typed Rowan JSX tags, and a small binding helper so I can use Rowan Web Components confidently without adopting a parallel React component library.

**Scope:** Add a concise Framework Usage / React section to the README and static documentation covering client-only element registration, scalar JSX attributes, property-only values through refs, native custom-event listeners, and Next.js SSR boundaries. Publish an opt-in `@rowan-ui/core/react` facade with JSX declarations for all public `rowan-*` tags and a small `useRowanElement()` helper for property assignment and native-event subscription cleanup.

**Acceptance bar:**

- Core elements, tags, events, and data contracts remain framework-neutral; no React wrappers, alternate component APIs, or React runtime import may enter the root `@rowan-ui/core` entry point.
- `@rowan-ui/core/react` augments React's `JSX.IntrinsicElements` for every public Rowan tag, supports typed refs and documented scalar attributes, and types property-only values such as `config`, `columns`, `rows`, `options`, `selected`, `items`, and render callbacks without serializing them to attributes.
- `useRowanElement(ref, { properties, events })` assigns properties after the host exists, attaches native `addEventListener()` listeners, cleans up stale listeners on dependency changes and unmount, and does not translate Rowan custom events into synthetic React event props.
- The helper facade is SSR-safe to import and has React only as an optional peer for its hook entry point; registration modules remain explicitly browser-only through a client effect or equivalent client-only boundary.
- Documentation includes a client-only per-component registration example, a ref-driven `rowan-table` example, native `rowan-change` / `rowan-click` listener cleanup, and a Next.js example that avoids registering custom elements during server rendering.
- Type fixtures compile representative React 18 and React 19 TSX usage, and browser coverage verifies registration, complex property assignment, event cleanup, and hydration-safe client activation without claiming support beyond the tested baselines.

Deferred unless a product use case requires them:

- Rich-text editing, charting, maps, carousels, bundled iconography, and display-only `Intl` formatter elements

### Sprint 21: Semantic Color Selection

Status: Completed

Delivered:

- `rowan-color-picker` as a form-associated semantic color control with a reflected, normalized lowercase `#rrggbb` or alpha-bearing `#rrggbbaa` value
- An approved default palette based on Rowan forest, sand, ink, and danger primitives, plus property-only `palette` configuration for custom approved sets
- Keyboard-operable radio swatches, disabled-option skipping, native custom color and opacity entry, preserved author labels and descriptions, and user-only `rowan-change` details
- FACE form value, required validity, reset, and state-restoration behavior using ElementInternals defaults without overwriting author ARIA
- Component token hooks, guarded registration, visual hidden states, Storybook stories, static documentation with a live event demo, README guidance, root and subpath exports, declaration bridges, generated type definitions, global tag mappings, CEM coverage, and contract tests
- Deterministic Firefox button stylesheet readiness coverage for the existing document-level semantic-token contract

Verification completed at sprint close:

- Focused color-picker contracts: 6 passing
- Focused Firefox button token contracts: 9 passing
- `npm run tokens:sync`, `npm run tokens:check`, `npm run lint`, `npm run types`, and `npm run typecheck`
- `npm test`
- Two consecutive `npm run analyze` runs produced byte-identical manifests with 72 unique Rowan tags
- `npm run build-storybook`
- `npm pack --dry-run --json` includes color-picker source and declarations without documentation or build artifacts
- Chromium, Firefox, and WebKit each passed 75 files and 306 public contracts
- Static color-picker documentation checks at 1440px and 390px confirmed custom-palette rendering, dark-theme legibility, user-originated alpha changes, and no horizontal overflow
- Scoped Prettier validation and `git diff --check`

### Sprint 22: Structured Rating Input

Status: Completed

Delivered:

- `rowan-rating` as a form-associated whole-star rating input with scalar `min`, `max`, `step`, and `value` APIs; the default scale is one through five
- A clearable no-rating state represented by an empty `value`, with parent-driven assignments remaining silent and user-only `rowan-change` events for star selection or clearing
- Keyboard-operable radio stars using Arrow, Home, End, Enter, and Space behavior, including correct zero-based scale focus handling and visible current-value text
- FACE form value, required validity, reset, and state-restoration support with ElementInternals defaults that preserve author-provided ARIA
- Component tokens, guarded registration, visual hidden states, CSS parts, Storybook stories, static documentation with a live event demo, README guidance, root and subpath exports, declarations, generated type definitions, global tag mapping, CEM coverage, and public contract tests
- Strict root and subpath type fixtures for the clearable `number | ""` value API

Verification completed at sprint close:

- Focused rating contracts: 7 passing
- `npm run tokens:sync`, `npm run types`, `npm run typecheck`, `npm run lint`, and `npm run analyze`
- `npm test` (76 files, 313 passing contracts)
- Two consecutive `npm run analyze` runs produced byte-identical manifests with 73 unique Rowan tags
- `npm run build-storybook`
- `npm pack --dry-run --json`: 632 files and 3,106,710 unpacked bytes; includes rating source, stylesheet, subpath declaration, and generated types
- Chromium, Firefox, and WebKit each passed 76 files and 313 public contracts
- Static rating documentation checks at 1440px and 390px confirmed five accessible star radios, selection and clearing event details, dark-theme legibility, and no horizontal overflow
- Scoped Prettier validation and `git diff --check`

### Sprint 23: Safe Rich-Text Authoring

Status: Completed

Delivered:

- `rowan-rich-text-editor` as a form-associated, constrained authoring control for operational guidance
- A property-only `value` document model with paragraph, ordered-list, and unordered-list blocks plus bold, italic, and underline runs; a `text` convenience property; and no HTML or document-data attributes
- Native rich editing, selection, and undo behavior with semantic toolbar buttons, including a private projected editing surface for WebKit compatibility
- Plain-text-only paste and drop handling, safe DOM-node rendering, normalized event payloads, and documented application-owned persistence, rendering, authorization, collaboration, and merge boundaries
- A `mode="plain"` textarea fallback that retains the same normalized document event and form contract
- FACE JSON submission, required validity, default-value reset, state restoration, default ElementInternals ARIA, and preserved author ARIA
- Component tokens, guarded registration, visual hidden states, CSS parts, Storybook stories, static documentation with a live event demo, README security guidance, root and subpath exports, declaration bridges, generated types, global tag mapping, CEM coverage, React JSX propagation, and contract tests

Verification completed at sprint close:

- Focused rich-text editor contracts: 5 passing in Chromium, Firefox, and WebKit
- `npm run tokens:sync`, `npm run tokens:check`, `npm run lint`, `npm run types`, and `npm run typecheck`
- `npm test` (77 files, 318 passing contracts)
- Two consecutive `npm run analyze` runs produced byte-identical manifests with 74 unique Rowan tags
- `npm run build-storybook`
- `npm pack --dry-run --json`: 642 files and 3,205,686 unpacked bytes; includes rich-text source, stylesheet, declaration bridge, document helper, and generated types
- Chromium, Firefox, and WebKit each passed 77 files and 318 public contracts
- Static rich-text documentation checks at 1440px and 390px confirmed keyboard formatting, normalized event payloads, dark-theme legibility, and no horizontal overflow
- Scoped Prettier validation and `git diff --check`

### Sprint 24: Accessible Data Visualization

Status: Completed

Delivered:

- `rowan-trend-chart` as a compact, multi-series operational trend visualization for comparisons that are cumbersome to scan in a table alone
- Property-only `series`, `labels`, `config`, and `valueFormatter` APIs, with normalized finite numeric input, intentional null gaps, safe constrained series colors, and no structured-data attributes
- Native SVG geometry built through DOM nodes, paired with a visible text-and-swatch legend and an always-available semantic data table containing the same values
- Optional keyboard-discoverable data points with Arrow, Home, End, Enter, and Space interaction; user-only composed `rowan-point-activate` details; and a live detail announcement
- Responsive HTML chart axes that remain readable at narrow widths, complete chart/table access without motion-dependent information, and theme-aware default series colors
- Component tokens, guarded registration, visual hidden state, CSS parts, Storybook stories and event trace support, static documentation with a live event demo, README guidance, root and subpath exports, declaration bridge, generated types, global tag mapping, CEM coverage, React JSX propagation, and public contract tests

Verification completed at sprint close:

- Focused trend-chart contracts: 5 passing in Chromium, Firefox, and WebKit
- `npm run tokens:sync`, `npm run tokens:check`, `npm run lint`, `npm run types`, and `npm run typecheck`
- `npm test` (78 files, 323 passing contracts)
- Chromium, Firefox, and WebKit each passed 78 files and 323 public contracts
- Two consecutive `npm run analyze` runs produced byte-identical manifests with 75 unique Rowan tags and SHA-256 `6e03cccd4df5ba5c125d3ca43335043f09a3ecdd62bd70f8b1bcbe5161179b5d`
- `npm run build-storybook`
- `npm pack --dry-run --json`: 652 files and 3,297,188 unpacked bytes; includes trend-chart source, stylesheet, declaration bridge, generated types, and CEM while excluding documentation artifacts
- Static trend-chart documentation checks at 1440px and 390px confirmed visible SVG and text legend, equivalent table data, keyboard point activation payloads, dark-theme contrast, responsive axis labels, and no page-level horizontal overflow
- Scoped Prettier validation and `git diff --check`

### Sprint 25: Provider-Aware Maps

Status: Completed

Delivered:

- A separately publishable `@rowan-ui/maplibre` workspace package with `rowan-maplibre-map`, leaving MapLibre out of the `@rowan-ui/core` export and runtime dependency surface
- Application-owned, property-only `locations`, marker `layers`, `mapStyle`, and provider `attribution` inputs, with finite coordinate normalization, deterministic duplicate IDs, detached style/data snapshots, and no structured-data attributes
- A MapLibre peer boundary with dynamic provider loading or an injected adapter, no default tile endpoint, credential, or geocoding path, and provider startup gated on application-supplied style plus visible attribution
- Safe visible HTTP(S) attribution links, focusable custom map markers, keyboard-operable location-list controls, and a matching semantic location table that remain usable when the provider is absent or fails
- User-only composed `rowan-location-activate` details from marker/list/table activation and `rowan-layer-change` details from marker-layer visibility controls, with parent-driven updates remaining silent
- Package-local CEM, generated declarations, type contracts, release guidance, Storybook integration/fallback stories, root documentation using a tile-free application-owned style, CI package inspection, and README guidance for provider, privacy, offline, and coordinate-only boundaries

Verification completed at sprint close:

- Focused optional MapLibre contracts: 7 passing in Chromium
- `npm run lint`, `npm run types`, and `npm run typecheck`
- `npm test` (80 files, 330 passing contracts)
- Chromium, Firefox, and WebKit each passed 80 files and 330 public contracts
- Two consecutive CEM generations produced byte-identical manifests: core SHA-256 `6e03cccd4df5ba5c125d3ca43335043f09a3ecdd62bd70f8b1bcbe5161179b5d`; MapLibre SHA-256 `7e7b641febf07c58b0ee653e3e40b778a9c2d1c2a953ea364dfd21eeab98abe0` with exactly one `rowan-maplibre-map` tag
- `npm run build-storybook`, root package dry run, and optional MapLibre package dry run; core excludes the optional integration and the adapter includes source, generated types, CEM, README, and LICENSE
- Static MapLibre documentation checks at desktop and 390px confirmed visible local-style markers, visible attribution, fallback list/table data, keyboard activation payloads, dark-theme contrast, and no page-level horizontal overflow
- Scoped Prettier validation, CI workflow YAML validation, and `git diff --check`

### Sprint 26: Optional Icon Package

Status: Completed

Delivered:

- A separately publishable `@rowan-ui/icons` workspace package with no dependency on `@rowan-ui/core`, no custom-element registration, and no runtime name-to-icon registry
- 2,098 Lucide Static 1.45.0 icon modules generated as individually importable ESM files, plus an explicit barrel export for editor discovery and convenience imports
- A small DOM SVG factory with `currentColor` styling, configurable size and stroke width, decorative-by-default output, and explicit labeled `role="img"` output for meaningful icons
- Direct module-path package exports and matching generated declarations, allowing narrow imports such as `@rowan-ui/icons/icons/arrow-right` without importing the full catalog
- Package README guidance for icon-button slot composition, decorative versus meaningful accessibility use, styling, source attribution, and direct imports
- MIT license coverage for Rowan package code plus bundled ISC source attribution and license text for Lucide icon geometry
- Storybook composition examples, static documentation with desktop/mobile coverage, catalog integrity validation, package release inspection, and CI quality/browser-matrix integration

Verification completed at sprint close:

- Generated catalog verification: 2,098 icon modules and 2,098 barrel exports
- Focused public contracts: 4 passing in Chromium, Firefox, and WebKit
- Package lint, Prettier, declaration generation, and public type checks
- Root documentation Prettier validation and CI workflow YAML validation
- `npm run build-storybook`
- Optional package dry run: 4,206 files and 2,311,698 unpacked bytes; includes source, declarations, LICENSE, NOTICE, and README while excluding tests, stories, and generator tooling
- Static icon documentation checks at 1440px and 390px confirmed direct module rendering, decorative and meaningful accessibility states, responsive gallery layout, and no page-level horizontal overflow
- `git diff --check`

### Sprint 27: Locale-Aware Display Formatting

Status: Completed

Delivered:

- A small, side-effect-free `@rowan-ui/core/format` utility rather than a display-only custom element, keeping locale and time-zone policy in application code
- Typed `formatNumber`, `formatCurrency`, `formatDate`, and `formatRelativeTime` functions available from the formatter subpath and the browser-oriented core entry
- Explicit locale, date time-zone, and native `Intl` options objects with no attribute serialization, no HTML rendering path, and caller-owned `textContent` placement
- Finite numeric and date normalization, ISO currency validation, supported-locale checks, and a consistent caller-provided fallback for invalid values, locale tags, time zones, currencies, or option sets
- README and static documentation guidance, including a live text-only locale preview, table `format` callback composition, fallback policy, and responsive dark-theme coverage

Verification completed at sprint close:

- Focused formatter contracts: 4 passing in Chromium, Firefox, and WebKit
- `npm run types` and `npm run typecheck`
- `npm run tokens:check` and scoped ESLint for formatter source
- Two consecutive `npm run analyze` runs produced byte-identical core manifests with 76 Rowan tags and SHA-256 `fa06db1532d0b72536cb4fc23fc82e69a9a5cb0e9208176e1390346e3c86113a`; no `rowan-format` tag was added
- `npm run build-storybook` and root package dry run, including the formatter source and declarations
- Static locale-formatting documentation checks at 1440px and 390px confirmed localized text output, dark-theme legibility, navigation, and no page-level horizontal overflow
- Scoped Prettier validation

### Sprint 28: Controlled Content Carousel

Status: Completed

Delivered:

- `rowan-carousel` as a controlled default-slot panel sequence with a reflected, zero-based `active-index` and silent `goTo`, `previous`, and `next` application APIs
- Explicit previous and next controls, boundary-disabled states, viewport Arrow, Page, Home, and End keyboard movement, and a polite live status announcement of the active position
- User-only composed `rowan-change` details containing `activeIndex` and `previousIndex`, with no serialized panel data and no automatic progression
- Reduced-motion-safe panel entrance styling, component token hooks, guarded registration, open delegated-focus shadow root, documented CSS parts, and restoration of host panel state on release
- Root and subpath exports, declaration bridge, global element mapping, explicit registration side effect metadata, Storybook composition and boundary stories, README usage, and a live documentation route with event tracing

Verification completed at sprint close:

- Focused carousel contracts: 5 passing in Chromium, Firefox, and WebKit
- `npm run types`, `npm run typecheck`, `npm run tokens:sync`, and `npm run tokens:check`
- Two consecutive `npm run analyze` runs produced a byte-identical core manifest containing `rowan-carousel`
- `npm run build-storybook` and static documentation checks at desktop and 390px, including dark-theme legibility, keyboard activation, event output, no autoplay, and no page-level horizontal overflow
- Scoped Prettier validation and `git diff --check`

## Review Remediation Roadmap

These planned sprints address the production findings from the 2026-09-14 full code review. They are remediation work only; no new component catalog work is included. Sprint 29 is release-blocking. Sprints 30 through 35 can proceed independently after its package-security work is complete, and Sprint 36 closes the program.

### Sprint 29: Security and Package Import Integrity

Status: Completed; repository-wide lint gate remains deferred to Sprint 36

Delivered:

- Parser-based URL normalization for Link, Side Nav, and Table navigation sinks, with safe relative, hash, HTTP(S), mail, and phone links plus rejection of parser-normalized script protocols
- A fail-closed icon factory restricted to the Lucide catalog's geometry element and attribute vocabulary, preventing unsupported SVG elements and executable attributes
- Explicit root-entry `sideEffects` metadata for core and MapLibre plus a packed external-consumer esbuild registration guard that evaluates both bare imports
- A private React 18 runtime fixture that verifies false boolean server markup, custom-element upgrade semantics, client-side property correction, and the safe conditional-omission pattern
- React documentation that reserves JSX for string and number scalar attributes, describes the React 18 SSR boolean boundary, and demonstrates client-side property binding
- Removal of the internal `BaseElement` from root and subpath package exports, with positive and negative public type assertions

Acceptance outcomes:

- Hostile URL and icon-definition regressions pass in Chromium, Firefox, and WebKit without executable script attributes or protocols entering the rendered output
- Packed external-consumer esbuild checks prove bare root imports define `rowan-button` and `rowan-maplibre-map`
- The React 18 fixture verifies the documented false-boolean upgrade and property-binding hydration outcome
- README, static documentation, package metadata, type fixtures, and release guidance describe the supported import and React paths accurately

Verification completed:

- Focused security, package-entry, and React browser contracts: 41 passing in each of Chromium, Firefox, and WebKit
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, and `npm run test:package`
- `npm test`: 84 test files and 352 passing contracts
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `533bf3c3f5c5a344c8c51d47db6558950c4969c09e26dfdc329d8d455f6aa380`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- `npm run build-storybook`, static documentation Vite build, root and MapLibre `npm pack --dry-run --json` inspections, scoped Prettier/ESLint, and `git diff --check`

Deferred release condition:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint and formatting baseline

### Sprint 30: Theme and Base Rendering Reliability

Status: Completed; repository-wide lint baseline remains deferred to Sprint 36

Delivered:

- Scoped `BaseElement` fallback tokens to each component's declared prefix family, preventing one component's standalone aliases from masking document or nested component theme values
- Adopted inline `static styles` and runtime `setComponentStyles()` constructable sheets alongside Rowan token sheets, with a browser-tested `<style>` fallback path
- Restored document-level light/dark component token cascade behavior for Card, Date Picker, Calendar, Dialog, and other components without a local token prefix
- Replaced Chip's hard-coded light surfaces with component tokens and shipped light/dark values for info, success, warning, and danger tones
- Added tokenized Skeleton shimmer surfaces, an overridable duration, and a reduced-motion rule that disables animation
- Made token-sheet generation run Prettier using the repository configuration so `tokens:sync`, `tokens:check`, and formatting checks share one canonical output
- Documented the repaired Card, Dialog, Date Picker, Chip, and Skeleton public CSS properties through JSDoc and CEM

Acceptance outcomes:

- Dark Chip tones, Card, Date Picker, Calendar, and Dialog receive tokenized surfaces with AA text contrast; the live documentation specimen measured Chip at $11.62:1$ and Card, Date Picker, and Dialog at $14.11:1$
- Inline static and runtime component styles render in both constructable-sheet and forced legacy `<style>` branches
- Host overrides take precedence over wrapper values, wrapper values over `:root`, and nested light wrappers reset dark Chip and Skeleton aliases deterministically
- Live documentation checks confirmed reduced-motion Skeleton rendering has no active animation and the dark specimen has no horizontal overflow at 390px

Verification completed:

- Focused BaseElement, token, Chip, Date Picker, Dialog, Card, and Skeleton contracts: 29 passing in each of Chromium, Firefox, and WebKit
- `npm run tokens:sync`, `npm run tokens:check`, `npm run types`, `npm run typecheck`, `npm test`, and `npm run test:package`
- `npm test`: 85 test files and 365 passing contracts
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `effe906d96bd9d074e15e204e85e0235d5f730cbf89bc2b1b42c8a5d35995eb2`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- `npm run build-storybook`, static documentation Vite build, root and MapLibre `npm pack --dry-run --json` inspections, scoped Prettier/ESLint, `npm ci --dry-run`, and `git diff --check`

Deferred release condition:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint and formatting baseline

### Sprint 31: Form Association and Input Correctness

Status: Completed; repository-wide lint baseline remains deferred to Sprint 36

Delivered:

- Mirrored native email, URL, and pattern validation through Text Field's `ElementInternals`, including deterministic fallback messages for engines that omit a native message
- Added Text Field's reflected `pattern` public API and verified range and step validity flags for Number Field, Date Picker, and Time Picker; Time Picker now preserves `stepMismatch`
- Added inherited `formDisabledCallback()` handling in `BaseElement`, making every FACE host inert under `fieldset[disabled]`, disabling native shadow controls, suppressing user interaction events, and restoring its local rendered state when re-enabled
- Aligned Radio peer reconciliation with matching tree scope, form owner, and name; Radio Group now reconciles late-added slotted radios
- Replaced Form Field's cross-shadow IDREF defaults with verified `ElementInternals` element references where supported and managed `aria-label` / `aria-description` fallbacks where WebKit cannot retain those references
- Routed Button and Icon Button `submit` and `reset` activation to their nearest or explicitly referenced light-DOM form without double-submitting the shadow button
- Added reconnect-safe light-DOM option observation to Select, enforced single-file emissions in standalone Dropzone, and gave Validation Summary a private stable target map for identifier-less invalid controls

Acceptance outcomes:

- Rowan hosts reject invalid email, URL, pattern, date, time, number, required, range, and step values while exposing the expected validity flags through FACE
- All 19 FACE declarations were smoke-tested in a disabled fieldset: each matches `:disabled`, has an inert shadow interaction surface, and disables every native shadow control
- Radio ownership, dynamic Radio Group children, Select mutations, Dropzone single-file drops, Form Field accessible naming/description, Validation Summary focus jumps, and Button/Icon Button submit/reset are covered as public contracts
- Programmatic value and configuration updates remain silent; controls do not mutate consumer-owned option or row data

Verification completed:

- Focused FACE, form-data, accessibility, keyboard, and dynamic-light-DOM suite: 176 passing contracts in each of Chromium, Firefox, and WebKit
- `npm test`: 85 test files and 378 passing contracts
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, `npm run analyze`, `npm run test:package`, `npm run build-storybook`, static documentation Vite build, root and MapLibre `npm pack --dry-run --json` inspections, and `npm ci --dry-run`
- Scoped Prettier and ESLint, editor diagnostics, and `git diff --check`
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `264489d8ab7c723277df6f4bcb6e4f36b9af6bd3fbba7bcec602370690817736`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`

Deferred release condition:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint and formatting baseline

### Sprint 32: Overlay and Keyboard Accessibility

Status: Completed; repository-wide lint and generated-output whitespace baselines remain deferred to Sprint 36

Delivered:

- Named, rendered Dialog, Drawer, and Command Palette modal semantics with inert closed hosts, hidden panels, Escape/backdrop dismissal, focus containment, and focus return
- Standalone Menu and Tabs controllers with roving focus, Arrow/Home/End/Enter/Space interaction, dynamic-child reconciliation, and clean relationship release; Context Menu now supports reprojected Menu items without duplicate keyboard activation
- Popover, Dropdown, and Tooltip trigger/dismissal behavior with author-owned ARIA protection; Rowan Button forwards popup state to its exposed native control without an invalid cross-shadow IDREF
- Calendar focus retention, disabled month navigation, week-boundary Home/End keys, and labelled grid, row, columnheader, and gridcell semantics
- Popover Storybook controls for its `label` API and user-driven `rowan-change` event tracing

Acceptance outcomes:

- Open overlays are named, keyboard-dismissible where appropriate, and contain focus; closed Dialog, Drawer, Command Palette, and Popover surfaces are absent from the browser accessibility tree
- Tabs, menus, Context Menu, and Calendar handle their declared Arrow/Home/End/Enter/Space behavior with dynamic children covered by browser contracts
- Browser snapshots confirm named modal dialogs, menu/menuitem, tablist/tab/tabpanel, tooltip, repaired expanded Dropdown trigger, and Calendar grid semantics

Verification completed:

- Focused Sprint 32 suite: 13 files and 65 passing contracts; Chromium, Firefox, and WebKit each pass all 65
- `npm test`: 85 test files and 402 passing contracts
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, and `npm run test:package`
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `33ba2590718a52634a63805605d2132a06f7a86ffb117b8711630cdaacc01312`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- `npm run build-storybook` and static documentation Vite build; Vite reported only its existing chunk-size advisory
- Documentation browser checks at 1440px and 390px with no horizontal overflow, plus browser accessibility snapshots for open and closed overlay states
- Root and MapLibre `npm pack --dry-run --json` inspections and `npm ci --dry-run`
- Scoped Prettier/ESLint, editor diagnostics, and Sprint 32/public-artifact `git diff --check`

Deferred release conditions:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint baseline
- Repository-wide `git diff --check` remains blocked by trailing whitespace in regenerated `storybook-static/assets/maplibre-gl-CI-yoIxS.js`; the scoped Sprint 32/public-artifact check passes, and Sprint 36 owns the generated-output formatting baseline

### Sprint 33: Table and Virtual Collection Contract Recovery

Status: Completed; repository-wide lint and generated-output whitespace baselines remain deferred to Sprint 36

Delivered:

- Reconciled virtual Table rows using `VirtualCollection` entry keys while preserving public row IDs for selection and events; ResizeObserver measurements now remain owned by generated virtual keys
- Made duplicate virtual keys collision-proof when consumer IDs resemble generated suffixes, with distinct measured sizes retained for every generated key
- Normalized stored Table page state after out-of-range input and retained selection and selected-row records across page changes
- Rendered documented header tooltips, cell titles, checkbox indeterminate state, and one `rowan-cell-bind` event for each newly cloned custom slot cell; added a public contract for `cell.render` text and Node results
- Aligned Row Details row-ID resolution with Table, including valid falsy and meaningful whitespace IDs, and refreshed table-owned detail records after controlled row replacement
- Added bounded declarative `for-table` retry binding for Table Toolbar, Bulk Actions, Filter Builder, and Row Details, including retargeting before a table enters the document and releasing unresolved observers when references clear
- Normalized Boolean Filter Builder defaults to the stored value displayed by its Boolean control
- Documented normalized paging, custom-cell metadata and binding behavior in README and static docs, and made `rowan-cell-bind` observable in the Table custom-slot Storybook event trace

Acceptance bar:

- Virtualized 100-, 1,000-, and 5,000-row Tables retain unique public row IDs, bounded semantic DOM, and stable overlapping row identity through selection-only and repeated scroll renders
- Selection, sorting, paging, custom cells, Row Details, Toolbar, Bulk Actions, and Filter Builder preserve documented controlled-data behavior
- Custom slots emit `rowan-cell-bind` exactly once per cloned cell, and header tooltip, cell title, checkbox indeterminate, and custom renderer configuration paths have public behavior coverage
- Duplicate or missing row IDs retain safe fallback behavior without corrupting the visible Table

Verification at sprint close:

- Focused virtual collection, Table, Table Toolbar, Bulk Actions, Filter Builder, and Row Details suite: 7 files and 49 passing contracts in Chromium, Firefox, and WebKit
- `npm test`: 86 test files and 414 passing contracts
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, and `npm run test:package`
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `87c913dd9b0810c7ff1744d7086b8e5d0ba599c0142c306f66b08feda98d3d1a`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`; generated core CEM includes `rowan-cell-bind`
- Static documentation Vite build and Storybook build; Vite reported only its existing chunk-size advisory
- Documentation browser checks at 1440px and 390px: the 500-row virtual Table kept 15 and 14 mounted semantic rows respectively, all row IDs were unique, the custom-cell documentation section rendered, and neither viewport overflowed horizontally
- Root and MapLibre `npm pack --dry-run --json` inspections and `npm ci --dry-run`: core packed 670 files; MapLibre packed 21 files; no package warnings
- Scoped Prettier/ESLint, editor diagnostics, and Sprint 33/public-artifact `git diff --check`

Deferred release conditions:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint baseline
- Repository-wide `git diff --check` remains blocked by trailing whitespace in regenerated `storybook-static/assets/maplibre-gl-CI-yoIxS.js`; the scoped Sprint 33/public-artifact check passes, and Sprint 36 owns the generated-output formatting baseline

### Sprint 34: Primitive State and Data Integrity

Status: Completed; repository-wide lint and formatting baselines remain deferred to Sprint 36

Delivered:

- Preserved Avatar initials fallback after an image failure through unrelated `alt` and `size` renders, with explicit hidden-state styling
- Gave Progress a default ElementInternals accessible name from `label`, without overriding author-provided `aria-label` or `aria-labelledby`
- Reconciled active Toaster records by ID so retained toast hosts and focused close controls survive queue updates; live `max-visible` reductions now return overflow to the queue in order and later increases promote it without synthetic events
- Restored Stepper focus to the corresponding rebuilt control after parent-driven updates and allowed horizontal controls to wrap in constrained layouts
- Retained explicit Trend Chart `null` values as no-data gaps across SVG path geometry, interactive point controls, and semantic table output
- Normalized standalone Pagination page state to its visible range before navigation so status, controls, property state, and `rowan-page-change` detail agree
- Added nullable Trend Chart and live Toaster-cap behavior to README/static documentation, plus a Storybook Missing Data scenario

Acceptance outcomes:

- Feedback primitives retain their fallback, accessibility, focus, and node-identity behavior through user actions and parent-driven renders
- Toaster preserves mounted notifications where possible, keeps focus usable, and enforces a changed visibility cap immediately without falsely reporting configuration as user activity
- Trend Chart `null` values break visual series segments, omit an unavailable interactive control, and render as `No data` in its equivalent table
- Stepper and Pagination interactions start from the visible normalized state rather than stale internal values

Verification completed:

- Focused Avatar, Progress, Toaster, Stepper, Pagination, and Trend Chart suite: 6 files and 28 passing contracts in the default runner and in Chromium, Firefox, and WebKit; the final responsive Stepper CSS also passes its 7 focused contracts in all three engines
- `npm test`: 86 test files and 421 passing contracts
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, and `npm run test:package`
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `e46b476552f97a532df5bd1886a3eb728995a0aeca9717b90a8a2934fb7aaf76`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- Static documentation Vite build and Storybook build; Vite reported only its existing chunk-size advisory
- Documentation browser checks at 1440px and 390px: live Toaster caps held, light and dark tokens rendered, Stepper and Trend Chart fit without horizontal overflow, and the nullable Trend Chart demo rendered one broken series segment, 11 available controls, and `No data` in its semantic table
- Root and MapLibre `npm pack --dry-run --json` inspections and `npm ci --dry-run`: core packed 670 files; MapLibre packed 21 files; no package warnings
- Scoped Prettier/ESLint, editor diagnostics, and Sprint 34/public-artifact `git diff --check`

Deferred release conditions:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint baseline
- Direct ESLint on `documentation/app.js` still reports the pre-existing `no-useless-escape` and unused `pageMatchesFilter` diagnostics outside Sprint 34's changed blocks
- Repository-wide `git diff --check` remains blocked by existing space-before-tab indentation in `stories/foundations.mdx` and trailing whitespace in `storybook-static/assets/maplibre-gl-CI-yoIxS.js`; the scoped Sprint 34/public-artifact check passes, and Sprint 36 owns the repository-wide formatting baseline

### Sprint 35: Documentation and Storybook Navigation Migration

Status: Completed; repository-wide lint and formatting baselines remain deferred to Sprint 36

Delivered:

- Added `STORYBOOK_URL_MIGRATION.md`, a versioned 0.1.0 migration note with verified legacy-to-current URL examples, category rules, and an explicit no-runtime-redirect policy
- Parsed static documentation hashes as independent page and optional section IDs, so copied table-of-contents links retain `#page:section` through reload and invalid sections canonicalize to their page-only hash
- Deferred section restoration until queued component renders settle, preventing compact layouts from scrolling against a stale document height
- Centralized static documentation category classification, explicit Other fallback, duplicate suppression, and search matching in `documentation/taxonomy.js`
- Limited component category navigation to manifest-backed element routes, so catalog pages do not appear twice and an uncategorized real element receives exactly one Other home
- Included category labels in navigation search and configured deterministic Storybook root and nested-category ordering with Storybook's serializable declarative sort format
- Added five documentation-navigation contracts for route parsing, fallback, Other coverage, category search, and taxonomy ordering; verified all 76 component story files use the shared category label convention

Acceptance outcomes:

- Current Storybook IDs resolve, while superseded IDs have a factual public migration path instead of speculative runtime aliases
- Static documentation preserves desktop and mobile deep links, TOC section targets, and canonical invalid-section fallbacks
- Category queries expose the expected navigation group, component catalog routes have no duplicate visible links, and Other remains available for future uncategorized element pages
- Storybook and static docs use the same category labels and deterministic component sequence

Verification completed:

- Focused documentation-navigation suite: 5 passing contracts in the default runner and in Chromium, Firefox, and WebKit
- Documentation browser checks at 1440px and 390px: TOC click/reload retained `#toaster:toaster-queue`; direct `#toaster:toaster-demo` resolved at both sizes; the mobile target remained visible after render with no horizontal overflow; invalid `#toaster:missing-section` canonicalized to `#toaster`; `data display` showed only the Data Display navigation group
- Storybook browser checks on a fresh server: current migration-note URLs all existed in `index.json`; the rendered tree ordered Foundations, Integrations, Components and Workflows, with component categories ordered `Actions & Feedback`, `Forms & Input`, `Files & Uploads`, `Overlays & Menus`, `Navigation & Layout`, and `Data Display`
- `npm test`: 87 test files and 426 passing contracts
- `npm run tokens:check`, `npm run types`, `npm run typecheck`, and `npm run test:package`
- Two consecutive `npm run analyze` runs produced byte-identical manifests: core SHA-256 `e46b476552f97a532df5bd1886a3eb728995a0aeca9717b90a8a2934fb7aaf76`; MapLibre SHA-256 `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- Static documentation Vite build and Storybook build, both with only their chunk-size advisories; the Storybook build restored `storybook-static/index.json`
- Root and MapLibre `npm pack --dry-run --json` inspections and `npm ci --dry-run`: core packed 670 files; MapLibre packed 21 files; no package warnings
- Scoped Prettier, editor diagnostics, taxonomy-to-story-title consistency check, and Sprint 35 `git diff --check`

Deferred release conditions:

- `npm run lint` remains blocked solely by the pre-existing `no-shadow-restricted-names` violation in `packages/icons/src/icons/infinity.js`; Sprint 36 owns the repository-wide lint baseline
- Direct ESLint on `documentation/app.js` still reports the pre-existing `no-useless-escape` and unused `pageMatchesFilter` diagnostics outside Sprint 35's changed blocks
- `npm run format:check` remains blocked by existing generated documentation artifacts under `documentation/documentation-static-check/assets/`; Sprint 36 owns the repository-wide formatting baseline
- Repository-wide `git diff --check` remains blocked by existing space-before-tab indentation in `stories/foundations.mdx` and trailing whitespace in `storybook-static/assets/maplibre-gl-CI-yoIxS.js`; the scoped Sprint 35 check passes
- The fresh Storybook server reports the existing `@storybook/addon-essentials` 8.6.14 and Storybook core 8.6.18 version advisory; Sprint 36 owns package-version alignment

### Sprint 36: Public Type and Release Gate Hardening

Status: Completed

Delivered:

- Replaced broad public declaration surfaces with literal unions for documented component variants, sizes, tones, orientations, selection modes, and Table density/selectable contracts; added structured option inputs for Combobox, Select, Multi-select Combobox, and Segmented Control
- Added public Table, Toaster, and option type aliases at their package subpaths; Toaster now exposes typed placement, input, `show`, `dismiss`, and `clear` contracts, including `show(): string | null`
- Enabled strict null declaration generation and preserved documented nullable setter inputs for Table configuration, Trend Chart configuration, Rating value, and Virtual List clearing; React property bindings now accept `RowanTable.config = null`
- Kept Context Menu target clearing explicit: `null` is the documented public unbind value, while defensive `undefined` normalization remains an implementation detail
- Added negative root and React type fixtures for literals, toast inputs, Table and Virtual List clearing, structured option inputs, and icon named/default imports; added runtime regressions for Table, Virtual List, and Toaster return behavior
- Repaired the generated `Infinity` icon export at its generator source, preserving the public name through a safe local implementation alias; regenerated and verified all 2,098 icon modules
- Established authored-source lint/format baselines while excluding generated static verification output, fixed the remaining authored diagnostics, and aligned all direct Storybook packages to `8.6.18`
- Disabled Storybook's generated telemetry `project.json`, which contains a timestamp and made otherwise identical static builds nondeterministic

Acceptance outcomes:

- Public TypeScript contracts reject invalid enum values and structured inputs while accepting each documented nullable clear operation; runtime normalization is not promoted to a public type without a documented contract
- Root lint and formatting gates pass without suppressing authored source violations
- Declarations, root and MapLibre CEM artifacts, token sheets, and isolated Storybook output are reproducible across consecutive generation
- A clean lockfile install, default and browser contract suites, package inspections, documentation production build, and Storybook production build all pass

Verification completed:

- `npm ci --no-audit --no-fund`, `npm run tokens:check`, `npm run lint`, `npm run format:check`, `npm run types`, `npm run typecheck`, `npm test`, `npm run test:package`, and `git diff --check` all pass; the default suite has 87 test files and 429 passing contracts
- Full browser matrix after the clean install: Chromium, Firefox, and WebKit each pass 85 test files and 421 contracts; the only reported network diagnostic is the expected `missing-avatar.png` 404 coverage path
- Root, MapLibre, and Icons dry-run tarballs contain 670, 21, and 4,206 files respectively, with no bundled dependencies, fixtures, generated sites, or secret-like paths; Icons generation, verification, types, typecheck, and five tests pass
- Two consecutive declaration generations produced combined SHA-256 `5f0c306ec5cf5fd59dff2b2475618c33f4cb5917b28ae1cb0279b67aac0878db`; root CEM matched at `8147a0b3e895a8899759c74c6b734a4d163839fba2359628aeda64c00418073d`, and MapLibre CEM matched at `a82c9ba468389c875cb7f607f3842f78581de87786ee390d3bcf24bf71c91739`
- Temporary documentation and Storybook production builds pass from the clean install; Storybook reports no package-version mismatch, and two post-config static outputs are byte-identical with no `project.json`
- `npm ls --depth=0` resolves `storybook`, `@storybook/addon-a11y`, `@storybook/addon-essentials`, `@storybook/web-components`, and `@storybook/web-components-vite` to `8.6.18`

### Deferred Backlog Stories

Status: Unscheduled. These are planning stories only; they do not add tags, exports, CEM declarations, or placeholder Storybook entries until a product use case selects them.

## Notes

- Sprint history is tracked in-repo alongside Git history.
- `custom-elements.json` remains the API documentation source of truth and should be regenerated after each sprint increment.
