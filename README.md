# Rowan UI Core

Rowan is a plain-vanilla Web Component design system built with browser standards only:
Custom Elements, Shadow DOM, slots, CSS custom properties, and ElementInternals.

Package name: `@rowan-ui/core`

## Install

```bash
npm install @rowan-ui/core
```

## Use Rowan

### Register all Rowan elements

```js
import "@rowan-ui/core";
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";
```

### Register only what you need

```js
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/button";
import "@rowan-ui/core/card";
import "@rowan-ui/core/table";
```

### No-bundler local usage

```html
<link rel="stylesheet" href="./src/tokens/tokens.css" />
<link rel="stylesheet" href="./src/tokens/themes/light.css" />

<script type="module">
  import "./src/button/button.js";
</script>

<rowan-button>Save</rowan-button>
```

## TypeScript

Rowan publishes declarations with every ESM entry point. Import the registration module normally, then use the exported class or the global `HTMLElementTagNameMap` type:

```ts
import { RowanButton } from "@rowan-ui/core/button";
import { RowanTable, type RowanTableConfig } from "@rowan-ui/core/table";

const button: RowanButton = document.createElement("rowan-button");
const table: RowanTable = document.createElement("rowan-table");

const config: RowanTableConfig = {
  columns: [{ id: "name", header: "Name", sortable: true }],
  rows: [{ id: "1", name: "Ada" }],
};

button.disabled = true;
table.config = config;
```

## Theming

Rowan tokens are layered so teams can theme once and keep component APIs stable.

1. Primitive tokens, for example `--rowan-color-forest-700`, `--rowan-space-4`
2. Semantic tokens, for example `--rowan-color-bg`, `--rowan-color-fg`, `--rowan-color-accent`
3. Component tokens, for example `--rowan-button-bg`, `--rowan-field-border`

Tokens ship both as constructable stylesheets adopted by Rowan shadow roots and as CSS files you can import globally.

```css
:root {
  --rowan-color-bg: #f8f7f2;
  --rowan-color-fg: #1f2421;
  --rowan-color-accent: #1d432f;
  --rowan-button-bg: var(--rowan-color-accent);
}

[data-theme="dark"] {
  --rowan-color-bg: #111714;
  --rowan-color-fg: #ecf0e9;
  --rowan-color-accent: #7fc095;
  --rowan-button-fg: #10261c;
}
```

## Component Catalog

Implemented components currently include:

- Actions and status: `rowan-button`, `rowan-icon-button`, `rowan-link`, `rowan-badge`, `rowan-chip`, `rowan-avatar`, `rowan-alert`, `rowan-spinner`, `rowan-progress`, `rowan-skeleton`, `rowan-divider`, `rowan-empty-state`, `rowan-toast`, `rowan-toaster`, `rowan-file-item`
- Forms: `rowan-text-field`, `rowan-textarea`, `rowan-checkbox`, `rowan-switch`, `rowan-radio`, `rowan-radio-group`, `rowan-select`, `rowan-combobox`, `rowan-listbox`, `rowan-option`, `rowan-multi-select-combobox`, `rowan-segmented-control`, `rowan-date-picker`, `rowan-date-range-picker`, `rowan-time-picker`, `rowan-calendar`, `rowan-number-field`, `rowan-slider`, `rowan-form-field`, `rowan-form-layout`, `rowan-dropzone`, `rowan-file-upload`, `rowan-validation-summary`, `rowan-form-wizard`
- Surfaces and overlays: `rowan-card`, `rowan-dialog`, `rowan-command-palette`, `rowan-command-item`, `rowan-drawer`, `rowan-dropdown`, `rowan-popover`, `rowan-tooltip`
- Navigation: `rowan-menu`, `rowan-menu-item`, `rowan-tabs`, `rowan-tab`, `rowan-tab-panel`, `rowan-tree`, `rowan-tree-item`, `rowan-accordion`, `rowan-pagination`, `rowan-breadcrumb`, `rowan-stepper`
- Data display and operations: `rowan-virtual-list`, `rowan-table`, `rowan-table-toolbar`, `rowan-bulk-actions-bar`, `rowan-filter-builder`, `rowan-row-details-panel`

## Rowan Selection Controls

`rowan-listbox` composes light-DOM `rowan-option` children for accessible single or multiple selection. Its scalar `value` reflects for declarative single-selection bindings; its `selected` array is property-only for multiple values. User selection emits `rowan-change` with the activated value, selected values, and option reference. Form-associated listboxes submit one value per selected option in multiple mode.

`rowan-multi-select-combobox` uses property-only `options` and `selected` arrays. It filters available choices, preserves selections outside the active query, provides removable chips, and emits one outer `rowan-change` event for user additions or removals. Its FACE value is a repeated form entry under `name`.

`rowan-segmented-control` is a compact, property-configured radio-group for mutually exclusive modes. Set its `options` array and reflected `value`; user click and Arrow-key changes emit `rowan-change`, while parent-assigned values remain silent.

```html
<rowan-listbox id="team-list" name="team" label="Teams" selection="multiple">
  <rowan-option value="design">Design</rowan-option>
  <rowan-option value="engineering">Engineering</rowan-option>
</rowan-listbox>

<rowan-multi-select-combobox
  id="teams"
  name="assigned-team"
  label="Assigned teams"
></rowan-multi-select-combobox>
<rowan-segmented-control id="view-mode" name="view" label="View mode"></rowan-segmented-control>

<script type="module">
  import "@rowan-ui/core/listbox";
  import "@rowan-ui/core/multi-select-combobox";
  import "@rowan-ui/core/segmented-control";

  const listbox = document.querySelector("#team-list");
  listbox.selected = ["design"];

  const teams = document.querySelector("#teams");
  teams.options = [
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
  ];
  teams.selected = ["design"];

  const viewMode = document.querySelector("#view-mode");
  viewMode.options = [
    { value: "board", label: "Board" },
    { value: "list", label: "List" },
  ];
  viewMode.value = "board";
</script>
```

## Rowan Command Palette

`rowan-command-palette` composes slotted `rowan-command-item` actions into a filtered modal command surface. Items accept either default slot content or a `label` attribute, plus optional `description`, `keywords`, `group`, and `shortcut` metadata. Disabled commands remain discoverable but are skipped by keyboard activation.

Use `show()`, `hide()`, or `toggle()` for parent-driven state. An optional `hotkey`, such as `mod+k`, opens the palette with Command on macOS and Control on other platforms. User activation emits `rowan-command` with `{ value, item, query }`; Escape, backdrop, and close-control dismissal emit `rowan-close`. Parent-driven changes remain silent.

```html
<rowan-button id="open-commands">Open commands</rowan-button>
<rowan-command-palette id="workspace-commands" label="Workspace commands" hotkey="mod+k">
  <rowan-command-item
    value="open-settings"
    label="Open settings"
    description="Update workspace preferences"
    keywords="workspace preferences account"
    shortcut="G S"
  ></rowan-command-item>
  <rowan-command-item value="invite-member" label="Invite member" shortcut="I"></rowan-command-item>
</rowan-command-palette>

<script type="module">
  import "@rowan-ui/core/button";
  import "@rowan-ui/core/command-palette";

  const palette = document.querySelector("#workspace-commands");
  document.querySelector("#open-commands").addEventListener("rowan-click", () => palette.show());

  palette.addEventListener("rowan-command", (event) => {
    console.log(event.detail.value);
  });
</script>
```

## Rowan Tree

`rowan-tree` composes light-DOM `rowan-tree-item` nodes. Nest child items through the parent item’s `children` slot. The tree supplies roving focus and Arrow, Home, and End keyboard navigation; use `ArrowRight` and `ArrowLeft` to expand, collapse, or move into and out of a branch.

`selection` accepts `none`, `single`, or `multiple` and defaults to `single`. The selected values are property-only, so parent-driven changes remain silent while user changes emit `rowan-change`; user disclosure changes emit `rowan-toggle`.

```html
<rowan-tree id="docs-tree" label="Documentation">
  <rowan-tree-item value="guides" expanded>
    Guides
    <rowan-tree-item slot="children" value="getting-started"> Getting started </rowan-tree-item>
  </rowan-tree-item>
  <rowan-tree-item value="reference">Reference</rowan-tree-item>
</rowan-tree>

<script type="module">
  import "@rowan-ui/core/tree";

  const tree = document.querySelector("#docs-tree");
  tree.selected = ["getting-started"];

  tree.addEventListener("rowan-change", (event) => {
    console.log(event.detail.selected);
  });
</script>
```

## Rowan Virtual List

`rowan-virtual-list` renders a bounded, keyed window from property-only item data. Set `items`, `itemKey`, and `renderItem` in application code; `item-size` is the initial estimate, while visible items are measured with `ResizeObserver`. Use `scrollToIndex(index, { align })` to reveal an item programmatically.

```html
<rowan-virtual-list id="members" item-size="44" overscan="4"></rowan-virtual-list>

<script type="module">
  import "@rowan-ui/core/virtual-list";

  const members = document.querySelector("#members");
  members.items = Array.from({ length: 500 }, (_value, index) => ({
    id: `member-${index + 1}`,
    name: `Member ${index + 1}`,
  }));
  members.itemKey = "id";
  members.renderItem = (member) => {
    const row = document.createElement("div");
    row.textContent = member.name;
    return row;
  };
</script>
```

## Rowan Table

`rowan-table` supports:

- Config mode through `.config`, `.columns`, and `.rows`
- Selection: `none | single | multiple`
- Sorting: `rowan-sort` event and `.sortBy(id, dir)`
- Pagination model with `rowan-page-change`
- Optional virtualized body mode that retains real table markup and existing selection, sort, activation, and cell-event contracts
- Cell composition for `text`, `number`, `date`, `badge`, `link`, `checkbox`, `switch`, `button`, `icon-button`, `avatar`, `chip`, `progress`, `custom`

### Configuration updates

Assigning `.config` replaces the complete table state. Omitted values reset to their defaults: empty columns and rows, `rowId: "id"`, no selection, no sort or page, `selectable: "none"`, `density: "md"`, no caption, and disabled sticky/loading states.

Use flattened properties for partial updates that retain the rest of the current configuration:

```js
table.rows = nextRows;
table.selected = selectedIds;
table.sort = { id: "name", dir: "asc" };
```

In local development, Rowan warns when column IDs are missing or repeated, when a cell type is unsupported, or when row IDs are invalid or duplicated. Invalid and later duplicate columns are omitted; unsupported cell types render as text; duplicate row IDs render safely without keyed reuse.

### Virtualized body

Set `virtualized` for large local row collections. `virtualItemSize` is the initial row-height estimate, `virtualOverscan` adds rows around the visible viewport, and `--rowan-table-virtual-height` controls the viewport height. The table remains a real semantic `<table>` with mounted `<tr>` rows, so the existing cell, selection, sort, and row-activation APIs do not change. Tables with duplicate row IDs retain Rowan's full-render safety fallback.

```js
table.config = {
  rowId: "id",
  selectable: "multiple",
  virtualized: true,
  virtualItemSize: 40,
  virtualOverscan: 4,
  columns: [
    { id: "name", header: "Member", sortable: true },
    { id: "team", header: "Team", type: "badge" },
  ],
  rows: members,
};
```

### Exact config example

```html
<rowan-table id="user-table"></rowan-table>

<script type="module">
  import "@rowan-ui/core";
  import "@rowan-ui/core/tokens";
  import "@rowan-ui/core/tokens/light";
  import "@rowan-ui/core/tokens/dark";

  const table = document.getElementById("user-table");

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

  table.addEventListener("rowan-cell-change", (event) => {
    const { rowId, columnId, value } = event.detail;
    console.log("persist", rowId, columnId, value);
  });

  table.addEventListener("rowan-cell-action", (event) => {
    const { rowId, columnId, action } = event.detail;
    console.log("navigate", rowId, columnId, action);
  });
</script>
```

### Slot-based custom cell example

```html
<rowan-table id="orders-table">
  <template slot="status-pill">
    <rowan-chip tone="info">Status</rowan-chip>
  </template>
</rowan-table>

<script type="module">
  import "@rowan-ui/core";

  const ordersTable = document.getElementById("orders-table");

  ordersTable.config = {
    rowId: "id",
    columns: [
      { id: "order", header: "Order", type: "text" },
      {
        id: "status",
        header: "Status",
        type: "custom",
        cell: { slot: "status-pill" },
      },
    ],
    rows: [
      { id: "o-100", order: "#100", status: "Shipped" },
      { id: "o-101", order: "#101", status: "Pending" },
    ],
  };
</script>
```

## Table Operations

Use `rowan-table-toolbar` for selection-aware table context and light-DOM controls. Use `rowan-bulk-actions-bar` when users need explicit actions on selected rows. `rowan-filter-builder` owns a property-only filter model and emits it for the application to apply to rows. `rowan-row-details-panel` opens from `rowan-row-activate` and renders a read-only row record. All table-operation components bind to a containing table through its `toolbar` slot, a property reference, or `for-table` where applicable.

```html
<rowan-table id="members-table">
  <rowan-bulk-actions-bar id="member-actions" slot="toolbar"></rowan-bulk-actions-bar>
</rowan-table>

<script type="module">
  import "@rowan-ui/core/table";
  import "@rowan-ui/core/bulk-actions-bar";

  const table = document.querySelector("#members-table");
  const actions = document.querySelector("#member-actions");

  table.config = {
    selectable: "multiple",
    rowId: "id",
    columns: [{ id: "name", header: "Name" }],
    rows: [{ id: "1", name: "Ada" }],
  };

  actions.actions = [
    { id: "archive", label: "Archive", variant: "secondary" },
    { id: "remove", label: "Remove", variant: "danger" },
  ];

  actions.addEventListener("rowan-bulk-action", (event) => {
    console.log(event.detail.action, event.detail.selectedRows);
  });
</script>
```

### Filtering and row details

Keep the source rows in application state. The filter builder reports user changes but does not mutate `table.rows`; the application applies those filters and assigns the derived rows. The details panel listens to user row activation and does not modify the row record.

```html
<rowan-table id="members-table">
  <rowan-filter-builder id="member-filters" slot="toolbar"></rowan-filter-builder>
</rowan-table>
<rowan-row-details-panel for-table="members-table"></rowan-row-details-panel>

<script type="module">
  import "@rowan-ui/core/table";
  import "@rowan-ui/core/filter-builder";
  import "@rowan-ui/core/row-details-panel";

  const rows = [
    { id: "1", name: "Ada", role: "Admin" },
    { id: "2", name: "Alan", role: "Editor" },
  ];
  const table = document.querySelector("#members-table");
  const filters = document.querySelector("#member-filters");

  table.config = {
    rowId: "id",
    columns: [
      { id: "name", header: "Name" },
      { id: "role", header: "Role" },
    ],
    rows,
  };

  filters.fields = [
    { id: "name", label: "Name", operators: ["contains"] },
    { id: "role", label: "Role", options: ["Admin", "Editor"], operators: ["equals"] },
  ];

  filters.addEventListener("rowan-filter-change", (event) => {
    const activeFilters = event.detail.filters;
    table.rows = rows.filter((row) =>
      activeFilters.every((filter) => {
        const value = String(row[filter.field] ?? "").toLowerCase();
        const expected = filter.value.toLowerCase();
        return filter.operator === "equals" ? value === expected : value.includes(expected);
      }),
    );
  });
</script>
```

## Rowan Form Wizard

`rowan-form-wizard` composes named light-DOM panels with `rowan-stepper` progress and a local validation summary. Forward user navigation validates controls in the current panel only. Parent-driven state changes through `currentStep`, `goTo()`, `next()`, and `previous()` stay silent; user actions emit `rowan-step-change`, `rowan-invalid`, or `rowan-complete`.

```html
<rowan-form-wizard id="onboarding-wizard">
  <section slot="step-account" data-step-label="Account">
    <rowan-text-field name="organization" label="Organization" required></rowan-text-field>
  </section>
  <section slot="step-review" data-step-label="Review">
    Confirm the account details before completing setup.
  </section>
</rowan-form-wizard>

<script type="module">
  import "@rowan-ui/core/form-wizard";
  import "@rowan-ui/core/text-field";

  const wizard = document.querySelector("#onboarding-wizard");
  wizard.steps = [
    { id: "account", label: "Account" },
    { id: "review", label: "Review" },
  ];

  wizard.addEventListener("rowan-invalid", (event) => {
    console.log(event.detail.errors);
  });

  wizard.addEventListener("rowan-complete", () => {
    console.log("Persist the completed workflow.");
  });
</script>
```

## Dense Forms

Use `rowan-form-field` to compose a visible label, hint, description, and error message around a control without taking ownership of that control's value. It attaches managed accessible references while preserving author-provided `aria-labelledby` and `aria-describedby` values.

Use `rowan-form-layout` to arrange direct child fields into a responsive grid. Direct children can declare `span` to occupy multiple columns; `label-position="start"` coordinates start-aligned field labels across the layout.

```html
<rowan-form-layout columns="2" label-position="start" label-align="end">
  <rowan-form-field label="Workspace name" hint="Shown in navigation.">
    <rowan-text-field name="workspace"></rowan-text-field>
  </rowan-form-field>

  <rowan-form-field label="Monthly budget" span="2">
    <rowan-slider name="budget" min="0" max="500" step="25"></rowan-slider>
  </rowan-form-field>
</rowan-form-layout>

<script type="module">
  const slider = document.querySelector("rowan-slider");
  slider.formatValue = (value) => "$" + value;
</script>
```

`rowan-slider` is form-associated in both modes. Set `range` and pass `{ start, end }` to its `value` property for an ordered pair of handles. In range mode, a `name` produces `name-start` and `name-end` form entries by default.

```html
<rowan-slider name="price" range min="0" max="500" step="25"></rowan-slider>

<script type="module">
  const slider = document.querySelector("rowan-slider");
  slider.value = { start: 100, end: 300 };
  slider.formatValue = ({ start, end }) => "$" + start + " - $" + end;
</script>
```

## Development

```bash
npm install
npm run lint
npm run types
npm run typecheck
npm run test
npm run test:browser
npm run analyze
npm run documentation
npm run storybook
```

### Scripts

- `npm run analyze` generates `custom-elements.json`
- `npm run documentation` serves the standalone static docs website at `/documentation/index.html`
- `npm run storybook` starts Storybook on port 6006
- `npm run build-storybook` builds Storybook static assets
- `npm run test` runs web component tests with Web Test Runner
- `npm run test:browser` runs the same serial component contracts with Playwright; set `ROWAN_BROWSER` to `chromium`, `firefox`, or `webkit`
- `npm run types` regenerates publishable declaration files in `/types`
- `npm run typecheck` verifies root and per-component package imports, including `HTMLElementTagNameMap` discovery
- `npm run lint` runs ESLint on source files
- `npm run format` formats JS, CSS, JSON, MD, and MDX via Prettier
- `npm run format:check` verifies formatting

## Documentation Source Of Truth

`custom-elements.json` is generated by the Custom Elements Manifest analyzer and loaded into Storybook via `setCustomElementsManifest(...)`. Keep JSDoc on each component current, then run:

```bash
npm run analyze
```

## Browser Support

Rowan's automated compatibility baseline covers Chromium, Firefox, and WebKit supplied by the pinned Playwright release. Component contracts run in CI on each engine. This verifies current engine-family behavior, not a historical browser-version support window or Safari-specific integrations. Form-associated behavior uses `ElementInternals` when available; where the platform lacks it, controls retain their native internal-control fallback but cannot participate in host-level form association.

## Benchmarks

`npm run benchmark` measures module import/definition, first render, reconnect behavior, and Rowan table selection, sorting, and paging through real public APIs. The harness compares equivalent button, checkbox, and switch workloads for Rowan, Lit, FAST Element, and Web Awesome. Its methodology, scope limits, and options are in [benchmarks/README.md](benchmarks/README.md); the checked-in Chromium baseline is in [benchmarks/RESULTS.md](benchmarks/RESULTS.md), with raw samples in [benchmarks/results/latest.json](benchmarks/results/latest.json).

## Releases

See [RELEASING.md](RELEASING.md) for the versioning, generated-artifact, CI, package-inspection, and publish procedure.

## License

Rowan is available under the [MIT License](LICENSE).
