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
- Forms: `rowan-text-field`, `rowan-textarea`, `rowan-checkbox`, `rowan-switch`, `rowan-radio`, `rowan-radio-group`, `rowan-select`, `rowan-combobox`, `rowan-date-picker`, `rowan-date-range-picker`, `rowan-time-picker`, `rowan-calendar`, `rowan-number-field`, `rowan-dropzone`, `rowan-file-upload`, `rowan-validation-summary`
- Surfaces and overlays: `rowan-card`, `rowan-dialog`, `rowan-drawer`, `rowan-dropdown`, `rowan-popover`, `rowan-tooltip`
- Navigation: `rowan-menu`, `rowan-menu-item`, `rowan-tabs`, `rowan-tab`, `rowan-tab-panel`, `rowan-accordion`, `rowan-pagination`, `rowan-breadcrumb`, `rowan-stepper`
- Data display: `rowan-table`

## Rowan Table

`rowan-table` supports:

- Config mode through `.config`, `.columns`, and `.rows`
- Selection: `none | single | multiple`
- Sorting: `rowan-sort` event and `.sortBy(id, dir)`
- Pagination model with `rowan-page-change`
- Cell composition for `text`, `number`, `date`, `badge`, `link`, `checkbox`, `switch`, `button`, `icon-button`, `avatar`, `chip`, `progress`, `custom`

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

## Development

```bash
npm install
npm run lint
npm run test
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
- `npm run lint` runs ESLint on source files
- `npm run format` formats JS, CSS, JSON, MD, and MDX via Prettier
- `npm run format:check` verifies formatting

## Documentation Source Of Truth

`custom-elements.json` is generated by the Custom Elements Manifest analyzer and loaded into Storybook via `setCustomElementsManifest(...)`. Keep JSDoc on each component current, then run:

```bash
npm run analyze
```

License: MIT
