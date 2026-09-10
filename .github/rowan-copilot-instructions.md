# Rowan — GitHub Copilot build brief

You are implementing **Rowan**, a plain-vanilla Web Component design system.
No Lit, Stencil, FAST, React, Vue, Svelte, Angular, Tailwind, or CSS-in-JS.
Browser standards only: Custom Elements, Shadow DOM, `<slot>`, ES modules,
CSS custom properties, `::part()`, `adoptedStyleSheets`, ElementInternals.

If a request would add a framework or Tailwind to shipped component CSS, refuse
and do the vanilla equivalent instead.

## Product intent

Simple, clean, modern, minimalist. Outdoorsy quiet — not playful, not Material,
not neo-brutalist. Light-first with a real dark theme. Composition over
inheritance. Config-driven where reuse matters (especially data display).

Package name: `@rowan-ui/core`
Tag prefix: `rowan-`
CSS tokens: `--rowan-*`
Events: `rowan-<verb>` (example: `rowan-change`)
Shadow mode: **open**
License: MIT

## Non-negotiables

1. Publish unbundled ESM. Building is the consuming app’s job.
2. One component per folder. Colocate `*.js`, `*.css`, `*.stories.js`, `*.test.js`.
3. A tiny internal `BaseElement` is allowed. Consumers never extend it.
4. Public API = attributes + properties + slots + events + tokens + CSS parts.
   No class inheritance as a product feature.
5. Primitive data reflects attribute ↔ property. Objects/arrays are properties
   only — never JSON-stringified onto attributes unless a documented escape
   hatch (`columns-json` is allowed for static HTML demos only).
6. Events: `bubbles: true`, `composed: true`. Do not fire events because a
   parent set a property.
7. Form controls use `static formAssociated = true` + `attachInternals()`.
   Implement `setFormValue`, `setValidity`, `formResetCallback`,
   `formStateRestoreCallback`. Shadow roots that contain a focusable control
   use `{ mode: "open", delegatesFocus: true }`.
8. Default ARIA goes on ElementInternals (`this.#internals.role = "button"`),
   never stamped over an author-supplied `role` / `tabindex`.
9. `:host { display: ... }` and `:host([hidden]) { display: none }` on every
   visual component.
10. Guard `customElements.define` so HMR / double-import does not throw.
11. No Tailwind in `dist/`. No utility-class public API.
12. Custom Elements Manifest is the source of truth for docs and Storybook.

## Repo layout (create this)

```
rowan/
  package.json
  custom-elements-manifest.config.js
  custom-elements.json          (generated)
  README.md
  .github/copilot-instructions.md
  .storybook/main.js
  .storybook/preview.js
  src/
    tokens/
      tokens.css                /* primitives + semantic + component hooks */
      themes/light.css
      themes/dark.css
    lib/
      base-element.js
      reflect.js
      events.js
      keys.js
      debounce.js
      define.js
    button/button.js
    icon-button/icon-button.js
    link/link.js
    card/card.js
    text-field/text-field.js
    textarea/textarea.js
    checkbox/checkbox.js
    radio/radio.js
    radio-group/radio-group.js
    switch/switch.js
    select/select.js
    combobox/combobox.js
    badge/badge.js
    avatar/avatar.js
    chip/chip.js
    alert/alert.js
    tooltip/tooltip.js
    popover/popover.js
    dropdown/dropdown.js
    menu/menu.js
    menu-item/menu-item.js
    tabs/tabs.js
    tab/tab.js
    tab-panel/tab-panel.js
    accordion/accordion.js
    dialog/dialog.js
    drawer/drawer.js
    pagination/pagination.js
    breadcrumb/breadcrumb.js
    skeleton/skeleton.js
    spinner/spinner.js
    progress/progress.js
    divider/divider.js
    empty-state/empty-state.js
    table/table.js
    table.css
    table.stories.js
    table.test.js
  stories/foundations.mdx
```

Start with `lib/` + tokens + button + text-field + checkbox + dialog + card +
table. Then fill the rest. Do not scaffold empty stubs that do not render.

## package.json rules

- `"type": "module"`
- `"main"` / `"module"` / `"exports"` point at ESM entry files
- `"customElements": "custom-elements.json"`
- Per-component export paths: `"./button": "./src/button/button.js"`
- `sideEffects` lists only modules that call `customElements.define`
- Scripts: `analyze` (cem), `storybook`, `build-storybook`, `test`, `lint`
- Dev deps only: Vite, Storybook web-components-vite, CEM analyzer,
  @wc-toolkit/storybook-helpers (or equivalent), web-test-runner or Playwright,
  eslint + prettier. No runtime deps.

## BaseElement

`src/lib/base-element.js` (~100–150 lines):

- `constructor`: `super()`, attach open shadow, optional internals hook,
  adopt shared token sheet + component sheet
- Attribute reflection helpers from `reflect.js` (bool / string / number)
- Microtask render batching; first render in `connectedCallback`
- Handle properties set before upgrade
- Disconnect observers and listeners in `disconnectedCallback`
- Do not put variants, layout, or product UI on the base class

`src/lib/define.js`:

```js
export function define(tag, Class) {
  if (!customElements.get(tag)) customElements.define(tag, Class);
}
```

## Theming

Three token layers in CSS, no JS theme runtime required.

1. Primitives: `--rowan-color-forest-700`, `--rowan-space-4`, `--rowan-radius-md`
2. Semantic: `--rowan-color-bg`, `--rowan-color-fg`, `--rowan-color-accent`,
   `--rowan-color-border`, `--rowan-color-danger`
3. Component: `--rowan-button-bg: var(--rowan-color-accent)`

Components only read layer 3 (falling back to 2). Consumers theme by setting
layer 2 on `:root` or `[data-theme="dark"]`.

Ship `tokens.css` as a constructable stylesheet adopted by every shadow root
AND as a file consumers can import into the document so tokens inherit.

Public styling API:

- CSS custom properties (preferred)
- `::part()` sparingly (document every part in JSDoc)
- slots for content
- `::slotted()` only for direct assigned nodes; do not style slotted descendants

Visual language: generous whitespace, 1px borders, soft radius (6–10px),
no drop-shadow circus, system font stack with a clean sans, accent is a
deep forest green — not neon.

## JSDoc — required on every element

CEM must pick this up:

```js
/**
 * Primary action control.
 * @tag rowan-button
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @slot - Label
 * @slot prefix
 * @slot suffix
 * @csspart button
 * @cssprop --rowan-button-bg
 * @event rowan-click - Fired on activation (not when disabled)
 */
```

Also augment `HTMLElementTagNameMap`.

## Storybook

- Framework: `@storybook/web-components-vite`
- Load CEM with `setCustomElementsManifest`
- Autodocs on
- Global toolbars: theme (light/dark), direction (ltr/rtl), density
- Stories render real custom elements, not innerHTML soup when avoidable
- Include composition stories (button in dialog, checkbox cells in table)
- addon-a11y always on

## Testing

Public contract only: attributes, properties, slots, events, keyboard,
form value / validity, and table config rendering. Prefer Playwright or
web-test-runner against the real element.

## Component API conventions

Variants via attributes, not subclasses.
Sizes: `sm | md | lg`. Default `md`.
Boolean attributes: presence = true (`disabled`, `open`, `loading`).
Slots: default + named. Never require inner markup the component could
provide a default for.

### Primitives (implement all)

- `rowan-button` — variant, size, type, disabled, loading; slots prefix/suffix
- `rowan-icon-button` — accessible name required (attribute `label`)
- `rowan-link` — href, external
- `rowan-card` — slots: media, header, title, default, footer, actions
- `rowan-badge`, `rowan-avatar`, `rowan-chip`, `rowan-divider`
- `rowan-alert` — tone: info | success | warning | danger; dismissible
- `rowan-skeleton`, `rowan-spinner`, `rowan-progress`
- `rowan-empty-state` — slots: icon, title, default, actions

### Forms

- `rowan-text-field`, `rowan-textarea`, `rowan-checkbox`, `rowan-switch`
- `rowan-radio` + `rowan-radio-group`
- `rowan-select` (listbox pattern), `rowan-combobox` (filterable)
- All FACE where they represent a value
- `name`, `value`, `disabled`, `required`, `invalid` where applicable
- Associate labels via `<label for>` using the host id, plus an internal
  visually-hidden label fallback from `label` attribute

### Overlays / navigation

- `rowan-dialog` — modal, focus trap, Esc, return focus, `open` attr
- `rowan-drawer` — side: start | end
- `rowan-tooltip`, `rowan-popover`, `rowan-dropdown`
- `rowan-menu` + `rowan-menu-item` (roving tabindex)
- `rowan-tabs` + `rowan-tab` + `rowan-tab-panel`
- `rowan-accordion`
- `rowan-pagination`, `rowan-breadcrumb`

Use popover/anchor positioning where Baseline-available; fall back to
absolute positioning without adding a library.

## Advanced: `rowan-table` (priority component)

A config-driven, composable data table / grid. This is a product centerpiece.
Do not implement it as a dumb HTML wrapper. Do not require the consumer to
hand-write `<td>` trees for common cases.

### Design

Two complementary modes, both first-class:

**A. Config mode (default, reusable)**
Pass `columns` + `rows` as properties. The table renders cells from column
config. Cell UI is chosen by `cell.type` and composed from Rowan primitives.

**B. Light-DOM / slot mode (escape hatch)**
Named slots and a default slot allow fully custom header / body markup for
odd cases. Config mode must still allow per-cell slot overrides.

Do not use inheritance (`class ProductTable extends RowanTable`). Reuse is
100% config + events + slots.

### Properties

```ts
type CellType =
  | "text"
  | "number"
  | "date"
  | "badge"
  | "link"
  | "checkbox"
  | "switch"
  | "button"
  | "icon-button"
  | "avatar"
  | "chip"
  | "progress"
  | "custom";

interface Column {
  id: string; // required, maps to row field
  header: string;
  type?: CellType; // default "text"
  width?: string; // e.g. "12rem", "20%"
  minWidth?: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  sortDir?: "asc" | "desc" | null;
  sticky?: "start" | "end";
  hidden?: boolean;
  accessor?: string | ((row, rowIndex) => unknown);
  format?: (value, row, rowIndex) => string;
  cell?: CellConfig; // type-specific options
  headerCell?: { tooltip?: string };
}

interface CellConfig {
  type?: CellType;
  href?: string | ((value, row) => string);
  target?: string;
  label?: string | ((value, row) => string);
  variant?: string;
  tone?: string;
  disabled?: boolean | ((value, row) => boolean);
  checked?: boolean | ((value, row) => boolean);
  indeterminate?: boolean | ((value, row) => boolean);
  title?: string | ((value, row) => string);
  icon?: string;
  // custom cells:
  slot?: string; // project light-DOM template into this cell
  render?: (ctx: {
    value: unknown;
    row: Record<string, unknown>;
    rowIndex: number;
    column: Column;
    cellEl: HTMLElement;
  }) => Node | string | void;
}

interface TableConfig {
  columns: Column[];
  rows: Record<string, unknown>[];
  rowId?: string | ((row, index) => string);
  selectable?: "none" | "single" | "multiple";
  selected?: string[]; // row ids
  sort?: { id: string; dir: "asc" | "desc" } | null;
  caption?: string;
  density?: "sm" | "md" | "lg";
  stickyHeader?: boolean;
  empty?: { title?: string; description?: string };
  loading?: boolean;
  page?: { index: number; size: number; total?: number };
}
```

Element API:

- `get config()` / `set config(TableConfig)`
- Also accept flattened props: `.columns`, `.rows`, `.selectable`, `.selected`
  so callers can bind piecemeal
- `get selectedRows()`
- Methods: `selectAll()`, `clearSelection()`, `sortBy(id, dir)`

Attributes for declarative demos only: `selectable`, `density`, `sticky-header`,
`loading`, `caption`. Data always comes in as properties.

### Events (composed, detailed)

- `rowan-sort` — `{ id, dir }`
- `rowan-select` — `{ selected: string[], row, selectedRows }`
- `rowan-cell-change` — `{ rowId, columnId, value, row }` (checkbox/switch)
- `rowan-cell-action` — `{ rowId, columnId, action, row }` (button/link click)
- `rowan-page-change` — `{ index, size }`
- `rowan-row-activate` — `{ rowId, row }` (enter / double-click)

Do not invent extra events.

### Cell composition rules

- `checkbox` / `switch` cells render `<rowan-checkbox>` / `<rowan-switch>`
  inside the cell. Changes emit `rowan-cell-change` and do not silently
  mutate the consumer’s row object; the consumer owns data.
- `link` cells render `<rowan-link>` (or `<a part="link">` if that is leaner)
  using `cell.href`.
- `button` / `icon-button` emit `rowan-cell-action`.
- `badge` / `chip` / `avatar` / `progress` use the matching Rowan primitive.
- `custom` + `cell.slot="price"` looks for a `<template slot="price">` (or a
  node with `slot="price"`) and clones it per cell, exposing the row via
  `data-row-id` and a `rowan-cell-bind` event so the consumer can hydrate.
- `custom` + `cell.render` is the JS escape hatch. Called after the cell
  container exists. Must be cheap; table will not diff inner render output
  beyond replacing the cell container when row/column identity changes.

Header composition: a `header` slot and optional per-column
`<div slot="header-status">`. Selection column is auto-injected when
`selectable !== "none"` — do not make the consumer add it.

### Table UX / a11y

- Render a real `<table>` inside shadow DOM (not a div grid pretending to be
  a table), unless a measured reason appears — prefer semantic table.
- `role` / keyboard: sortable headers are buttons; selection follows
  grid/listbox expectations (space toggles, shift-range for multiple).
- Caption via `config.caption` or `<span slot="caption">`.
- Loading: skeleton rows, `aria-busy="true"`.
- Empty: `<rowan-empty-state>` in the body.
- Sticky header + optional sticky first/last column via tokens / parts.
- Parts: `table`, `thead`, `tbody`, `tr`, `th`, `td`, `caption`, `toolbar`.
- Slots: `toolbar`, `caption`, `empty`, `footer`, plus dynamic cell slots.

### Example the implementation must support

```js
table.config = {
  selectable: "multiple",
  stickyHeader: true,
  rowId: "id",
  columns: [
    {
      id: "name",
      header: "Name",
      type: "link",
      cell: { href: (v, row) => `/users/${row.id}` },
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      type: "badge",
      cell: { tone: (v) => (v === "Admin" ? "warning" : "info") },
    },
    { id: "active", header: "Active", type: "switch", align: "center" },
    { id: "quota", header: "Quota", type: "progress" },
    {
      id: "edit",
      header: "",
      type: "icon-button",
      cell: { label: "Edit", icon: "edit" },
      width: "3rem",
    },
  ],
  rows: [
    { id: "1", name: "Ada", role: "Admin", active: true, quota: 72 },
    { id: "2", name: "Alan", role: "Editor", active: false, quota: 18 },
  ],
};
table.addEventListener("rowan-cell-change", (e) => {
  /* persist */
});
table.addEventListener("rowan-cell-action", (e) => {
  /* navigate */
});
```

Also ship a Storybook story for this exact config, plus a custom-slot cell
story, plus a pagination story.

## Implementation order (do this in order, commit-sized)

1. Scaffold package.json, tokens, BaseElement, define(), Storybook, CEM.
2. `rowan-button`, `rowan-checkbox`, `rowan-text-field`, `rowan-badge`.
3. `rowan-card`, `rowan-alert`, `rowan-dialog`.
4. `rowan-table` with text/link/badge/checkbox/button cells.
5. Remaining cell types + selection + sort + pagination.
6. Rest of the primitive / overlay catalog.
7. README with install, theming, and table config examples.
8. Tests for reflection, FACE, and table events.

After each component: JSDoc, story, CEM refresh, `:host` + hidden, define()
guard.

## Coding style

- Modern JS (or TS if you set up tsc to emit ESM; prefer JS + JSDoc if
  simpler). Private fields (`#foo`).
- No innerHTML of untrusted row data. Text goes through `textContent`.
  `href` must be sanitized (block `javascript:`).
- Clone templates; do not rebuild the entire table shadow tree on every
  selection toggle. Diff by row id.
- Small files. No god objects. Table rendering helpers may live in
  `src/table/cells.js`.
- Keep comments scarce; JSDoc on public API only.

## Done looks like

- `npm run storybook` shows foundations + every component
- `npm run analyze` writes a complete custom-elements.json
- An HTML file with no bundler can import
  `./src/button/button.js` and use `<rowan-button>`
- Dark theme toolbar works via `[data-theme="dark"]` tokens
- Table demo is config-only — no hand-built `<td>` for the common case

## How to use this file with GitHub Copilot

1. Copy this file to `.github/copilot-instructions.md` in a new repo.
2. In Copilot Chat / Agent, start with:

   > Read `.github/copilot-instructions.md`. Scaffold Rowan step 1 only.
   > Do not skip ahead to the full catalog.

3. After each step:

   > Review against the non-negotiables. Then do step N.
