# Rowan Sprint History

Last updated: 2026-09-12

## Current Product Snapshot

- Package: `@rowan-ui/core`
- Architecture: vanilla Web Components (Custom Elements, Shadow DOM, slots, ElementInternals)
- Current implemented catalog includes 74 components

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

### Deferred Backlog Stories

Status: Unscheduled. These are planning stories only; they do not add tags, exports, CEM declarations, or placeholder Storybook entries until a product use case selects them.

#### DS-04: Accessible Data Visualization

**User story:** As an operations analyst, I want to compare a small set of metrics visually so I can spot trends that are cumbersome to scan in a table alone.

**Ready when:** A product surface demonstrates that Rowan table, progress, and status primitives cannot satisfy the comparison task, and an accessible rendering strategy is selected.

**Acceptance bar:** Any charting work must keep configuration and data property-only, expose an equivalent textual or tabular summary, make series and data points keyboard discoverable where interactive, respect reduced motion, avoid a mandatory core runtime dependency without an explicit package decision, and include deterministic visual and interaction coverage.

#### DS-05: Provider-Aware Maps

**User story:** As a dispatcher, I want to inspect location-based work items on a map so I can make routing and coverage decisions in context.

**Ready when:** A product owner selects a map provider, approves cost, attribution, privacy, offline, and geocoding policies, and defines the fallback when provider access fails.

**Acceptance bar:** Any map integration must keep locations and layers property-only, render accessible list or table alternatives, preserve provider attribution, support keyboard navigation to mapped records, avoid shipping provider credentials in Rowan, and live in an optional integration package rather than the core component bundle unless that boundary is deliberately revised.

#### DS-06: Controlled Content Carousel

**User story:** As a user reviewing a bounded sequence of related items, I want to move between panels predictably so I can compare them without losing context.

**Ready when:** A product workflow establishes that tabs, pagination, or virtual-list navigation cannot communicate the sequence more clearly.

**Acceptance bar:** A future carousel must use named or default slots for panels, expose a reflected scalar active index, provide previous and next controls with keyboard support, never auto-advance by default, respect reduced motion, announce the active position, and emit a user-only change event without serializing panel data.

#### DS-07: Optional Icon Package

**User story:** As a product team, I want a coherent, licensed icon set so I can compose familiar controls without maintaining ad hoc SVG assets in every application.

**Ready when:** Licensing, visual ownership, icon naming, and distribution boundaries are approved, including whether icons belong in a separately versioned package.

**Acceptance bar:** Iconography must remain optional to `@rowan-ui/core`, tree-shake at individual-icon granularity, provide accessible-name guidance for decorative and meaningful icons, avoid a stringly typed runtime icon registry in core components, and include license and source attribution in the package documentation.

#### DS-08: Locale-Aware Display Formatting

**User story:** As an international user, I want dates, numbers, currencies, and relative values presented in my locale so I can understand dashboard data without manual conversion.

**Ready when:** A product surface needs reusable declarative formatting beyond application-level native `Intl` calls, and locale/time-zone ownership is defined.

**Acceptance bar:** Formatter candidates must first justify a custom element over a small documented utility. If adopted, values and structured `Intl` options stay property-only where non-scalar, rendered output uses `textContent`, locale/time-zone changes update predictably, and the component documents fallback behavior for unsupported locales and invalid values.

## Notes

- Sprint history is tracked in-repo alongside Git history.
- `custom-elements.json` remains the API documentation source of truth and should be regenerated after each sprint increment.
