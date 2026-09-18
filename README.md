# Rowan UI Core

<p align="center">
  <img src="brand/rowan.png" alt="Rowan" width="160" height="160" />
</p>

Rowan is a plain-vanilla Web Component design system built with browser standards only:
Custom Elements, Shadow DOM, slots, CSS custom properties, and ElementInternals.

## Why Rowan

Rowan is named after the rowan tree (_Sorbus aucuparia_): small, hardy, and easy to
recognize without being loud. It grows at edges and in thin soil. The scarlet berries
are a detail on the tree, not the tree itself.

That is the brief for this library.

- **Vanilla first.** Custom Elements, Shadow DOM, slots, CSS tokens. No framework
  runtime in the box.
- **Composition over inheritance.** Public API is attributes, properties, slots,
  events, and parts. Components nest; they do not subclass each other.
- **Config where reuse matters.** Tables and similar surfaces take data and cell
  config so the same component can be a checkbox column in one app and a link
  column in another.
- **Quiet theming.** Primitive → semantic → component tokens. Dark mode is a token
  swap, not a fork.

The mark is an R with a single berry in the counter. The letter is the product.
The berry is the reminder: keep the accent small.

Package name: `@rowan-ui/core`. Version `0.7.0`. User-visible changes are in
[`CHANGELOG.md`](CHANGELOG.md).

**`0.7` surface.** Public API is attributes, properties, slots, events, tokens,
and CSS parts. Events fire only from user action, never because a parent set a
property. Form controls are form-associated. Constraint copy is English by
default; override it with [`@rowan-ui/core/validity-messages`](#constraint-messages).
Modals use native `<dialog>`. Dropdown, popover, tooltip, and context menus use
the top layer. Table virtualization, `rowan-rich-text-editor`,
`rowan-filter-builder`, `rowan-trend-chart`, `rowan-kpi-card`, `rowan-sparkline`,
`rowan-donut-chart`, and `rowan-bar-chart` are Stable. This is not `1.0`.

## Install

```bash
npm install @rowan-ui/core
```

Icons are a second package. Install them next to core when you need
`rowan-icon-button` names, slotted SVGs, or `<rowan-icon>`:

```bash
npm install @rowan-ui/core @rowan-ui/icons
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

## React

The custom element is the product. Generated wrappers in `@rowan-ui/core/react/<name>` are the React default. They load the element module, assign objects as properties, and map `onRowanClick` to `rowan-click`. `ref` is the host. Import them from a client component; they are not Server Components.

```tsx
import { useState } from "react";
import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanTable } from "@rowan-ui/core/react/table";

const config = {
  rowId: "id",
  selectable: "multiple",
  caption: "Members",
  columns: [{ id: "name", header: "Name" }],
  rows: [{ id: "1", name: "Ada" }],
};

export function MembersTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <RowanTable
        config={config}
        selected={selected}
        onRowanSelect={(event) => setSelected(event.detail.selected)}
      />
      <RowanButton onRowanClick={() => save()}>Save</RowanButton>
    </>
  );
}
```

Raw tags stay first-class for markup. Prefer wrappers for objects, arrays, and
`onRowan*` events. Storybook **Integrations / Using Rowan from React** shows
wrapper and tag side by side.

React 18 server rendering serializes a false custom-element boolean as a present
attribute such as `disabled="false"`. After the host upgrades, Rowan treats
`"false"` as unset and removes the attribute. Generated wrappers assign booleans
as properties, so `disabled={false}` never appears in markup.

For Next.js, import wrappers from a client component. Do not import them (or registration modules) from server-rendered code:

```tsx
"use client";

import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanTable } from "@rowan-ui/core/react/table";

export function RowanClientBoundary() {
  return <RowanButton onRowanClick={() => save()}>Save</RowanButton>;
}
```

## Theming

Rowan tokens are layered so teams can theme once and keep component APIs stable.

1. Primitive tokens, for example `--rowan-color-forest-700`, `--rowan-space-4`
2. Semantic tokens, for example `--rowan-color-bg`, `--rowan-color-fg`, `--rowan-color-accent`
3. Component tokens, for example `--rowan-button-bg`, `--rowan-field-border`

Component tokens derive from the semantic layer, so setting the semantic layer alone
produces a readable theme. `--rowan-color-surface` is the raised surface behind cards,
dialogs, and fields, and `--rowan-color-accent-contrast` is the text drawn on an accent
fill; both default to `--rowan-color-bg` when a theme does not set them.

Apply a theme at the same element that declares the tokens, normally `:root`. A custom
property that references another custom property resolves where it is declared, so a
theme scoped to a nested wrapper must also re-declare the component tokens it changes.
The shipped `light.css`, `dark.css`, `lagoon.css`, and `ember.css` do this for you.
Add another theme by copying one of those files, changing the semantic colors, and
importing it. Set `document.documentElement.dataset.theme` to the matching name.

Tokens ship both as constructable stylesheets adopted by Rowan shadow roots and as CSS files you can import globally.

```js
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";
import "@rowan-ui/core/tokens/lagoon";
import "@rowan-ui/core/tokens/ember";

document.documentElement.dataset.theme = "lagoon";
```

## Locale-Aware Formatting

Locale formatting is a pure utility, not a display-only custom element. Import it from
`@rowan-ui/core/format`, keep locale and time-zone policy in application state, then
assign the returned string with `textContent`. Structured `Intl` options remain ordinary
JavaScript objects and are never serialized to attributes.

```js
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@rowan-ui/core/format";

const total = formatCurrency(1234.56, {
  currency: "EUR",
  locale: "de-DE",
  options: { currencyDisplay: "code" },
});
const deploymentDate = formatDate("2026-09-13T14:30:00Z", {
  locale: "en-GB",
  timeZone: "UTC",
  options: { dateStyle: "long", timeStyle: "short" },
});
const yesterday = formatRelativeTime(-1, { locale: "en-US", unit: "day" });
const unavailable = formatNumber("unknown", { fallback: "Not available" });
```

`formatNumber`, `formatCurrency`, `formatDate`, and `formatRelativeTime` return the
caller-provided `fallback` for invalid input, locale, time zone, currency, or `Intl`
options; the default fallback is an empty string. Run a formatter again whenever the
application's locale or time zone changes. Table columns can use the same utility through
their existing `format` callback:

```js
{
  id: "total",
  header: "Total",
  type: "number",
  format: (value) => formatCurrency(value, { currency: "USD", locale: "en-US" }),
}
```

## Constraint Messages

Rowan form controls ship English constraint strings. Locale policy stays in the
application, the same way formatters do. Import `@rowan-ui/core/validity-messages`,
replace keys or install a resolver **before** mounting controls, and keep
`setCustomValidity` for per-control errors.

```js
import {
  ROWAN_VALIDITY_MESSAGES,
  setValidityMessageResolver,
  setValidityMessages,
} from "@rowan-ui/core/validity-messages";

setValidityMessages({
  "valueMissing.checkbox": "Cochez cette case.",
});

setValidityMessageResolver((key, fallback) => {
  return translate(`rowan.${key}`, fallback);
});
```

`ROWAN_VALIDITY_MESSAGES` is the English catalog. Unknown keys resolve to an empty
string. Empty resolver/override values fall through to the default. Text fields still
prefer the browser's native `validationMessage` when the engine provides one.

## Component Catalog

Implemented components currently include:

- Actions and status: `rowan-button`, `rowan-icon-button`, `rowan-link`, `rowan-badge`, `rowan-chip`, `rowan-avatar`, `rowan-alert`, `rowan-status-indicator`, `rowan-spinner`, `rowan-progress`, `rowan-skeleton`, `rowan-divider`, `rowan-empty-state`, `rowan-toast`, `rowan-toaster`, `rowan-file-item`
- Forms: `rowan-text-field`, `rowan-textarea`, `rowan-checkbox`, `rowan-switch`, `rowan-radio`, `rowan-radio-group`, `rowan-rating`, `rowan-rich-text-editor`, `rowan-select`, `rowan-combobox`, `rowan-listbox`, `rowan-option`, `rowan-multi-select-combobox`, `rowan-segmented-control`, `rowan-date-picker`, `rowan-date-range-picker`, `rowan-time-picker`, `rowan-color-picker`, `rowan-calendar`, `rowan-number-field`, `rowan-slider`, `rowan-form-field`, `rowan-form-layout`, `rowan-dropzone`, `rowan-file-upload`, `rowan-validation-summary`, `rowan-form-wizard`
- Surfaces and overlays: `rowan-card`, `rowan-dialog`, `rowan-confirm-dialog`, `rowan-command-palette`, `rowan-command-item`, `rowan-context-menu`, `rowan-drawer`, `rowan-dropdown`, `rowan-popover`, `rowan-tooltip`
- Navigation and workspaces: `rowan-menu`, `rowan-menu-item`, `rowan-tabs`, `rowan-tab`, `rowan-tab-panel`, `rowan-tree`, `rowan-tree-item`, `rowan-side-nav`, `rowan-side-nav-item`, `rowan-side-nav-section`, `rowan-app-layout`, `rowan-split-pane`, `rowan-accordion`, `rowan-pagination`, `rowan-breadcrumb`, `rowan-stepper`, `rowan-carousel`
- Data display and operations: `rowan-trend-chart`, `rowan-area-chart`, `rowan-bar-chart`, `rowan-stacked-bar-chart`, `rowan-donut-chart`, `rowan-sparkline`, `rowan-kpi-card`, `rowan-image`, `rowan-virtual-list`, `rowan-table`, `rowan-table-toolbar`, `rowan-bulk-actions-bar`, `rowan-filter-builder`, `rowan-row-details-panel`

### API stability

Everything in the catalog above is usable. Surfaces marked Experimental below
are **out of `0.7`** until they are marked Stable. The listed dashboard hosts
are frozen; pin the version if you depend on them.

| Surface                         | Status       | Notes                                                                                                                                                                                  |
| ------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives, forms, overlays     | Stable       | Attributes, properties, slots, events, and parts are settled.                                                                                                                          |
| `rowan-table` config and events | Stable       | `columns`, `rows`, selection, sorting, and paging are settled.                                                                                                                         |
| Table virtualization            | Stable       | `virtualized`, `virtualItemSize`, `virtualOverscan`, and `--rowan-table-virtual-height` will not be renamed.                                                                           |
| `rowan-rich-text-editor`        | Stable       | Blocks are paragraph, heading (1–3), unordered-list, and ordered-list. Runs are bold, italic, underline, and allowlisted `href`. HTML is never a value. Images are not document nodes. |
| `rowan-filter-builder`          | Stable       | Flat AND list of `{ id, field, operator, value }`. No nested groups. Unknown types and operators coerce.                                                                               |
| `rowan-trend-chart`             | Stable       | Small multi-series line chart. `series`, `labels`, `config`, and `valueFormatter` are frozen. Other geometries are separate hosts.                                                     |
| `rowan-kpi-card`                | Stable       | `label`, `tone`, `delta-label`, `loading`; property-only `value` and `delta`. Chart slot is for `rowan-sparkline`.                                                                     |
| `rowan-sparkline`               | Stable       | One series, property-only `values` / `labels`. Null is a gap. Not a density of `rowan-trend-chart`.                                                                                    |
| `rowan-donut-chart`             | Stable       | First series only. Negative values are no-data and omitted from the total.                                                                                                             |
| `rowan-bar-chart`               | Stable       | Small categorical bars. `series` / `labels` / `config` / `valueFormatter`. Null is no-data.                                                                                            |
| `rowan-area-chart`              | Experimental | Filled multi-series. Same property-only `series` / `labels` / `config` / `valueFormatter` as the line chart. Null breaks the fill.                                                     |
| `rowan-stacked-bar-chart`       | Experimental | Positive values stack from zero. Null and negatives are no-data.                                                                                                                       |

## Rowan Carousel

`rowan-carousel` presents a bounded sequence of directly slotted panels. Its scalar
`active-index` is zero-based and reflected; setting `activeIndex` or calling `goTo()`,
`previous()`, or `next()` is silent application control. Only user use of the controls
or Arrow, Page, Home, and End keys emits the composed `rowan-change` event. Rowan does
not autoplay or serialize panel data.

```html
<rowan-carousel id="release-highlights" label="Release highlights" active-index="1">
  <article>
    <h3>Release readiness</h3>
    <p>Rollback coverage is in place for the deployment window.</p>
  </article>
  <article>
    <h3>Service coverage</h3>
    <p>Confirm the weekend handoff before the window opens.</p>
  </article>
</rowan-carousel>

<script type="module">
  import "@rowan-ui/core/carousel";

  const carousel = document.querySelector("#release-highlights");
  carousel.addEventListener("rowan-change", (event) => {
    console.log(event.detail.activeIndex, event.detail.previousIndex);
  });
</script>
```

## List Control Keyboard Model

Rowan uses one rule for every control that presents a collection, so behaviour is
predictable across components:

- **Input with a popup list** keeps DOM focus in the input and reports the
  highlighted option with `aria-activedescendant`. This is `rowan-combobox`,
  `rowan-multi-select-combobox`, and `rowan-command-palette`, and it follows the
  APG combobox pattern.
- **Standalone collection** moves DOM focus between items with a roving tab index.
  This is `rowan-listbox`, `rowan-menu`, `rowan-tabs`, and `rowan-tree`.

`rowan-select` stays a thin wrapper over the native `<select>`, so the platform
provides its popup and keyboard behaviour.

`rowan-combobox` supports Arrow Up and Down to open and move the highlight, Home
and End to jump, Enter to commit the highlighted option, Escape to close without
committing, and Tab to close. Typing filters the list. It accepts free text, so
the committed value does not have to match an option.

`rowan-multi-select-combobox` uses the same movement keys. Enter toggles the
highlighted option and keeps the popup open, Backspace on an empty query removes
the last chip, and selected values stay property-only.

## Optional Integrations

`@rowan-ui/icons` is published next to core. It provides 2,098 individually
importable SVG icon modules without adding icon assets or an all-icons name
registry to `@rowan-ui/core`. For declarative HTML, an individual
`@rowan-ui/icons/elements/calendar-days` import registers `icon="calendar-days"`
for `rowan-icon-button` and `<rowan-icon name="calendar-days">` for other
component slots. Icons are decorative by default and become meaningful only when
callers pass an explicit accessible label. React:
`import { RowanIcon } from "@rowan-ui/icons/react/icon"` after a per-icon
`@rowan-ui/icons/elements/<name>` import. The wrapper optionally peers on
`@rowan-ui/core`; SVG and HTML usage stay core-free. See the package README.

`@rowan-ui/maplibre` provides `rowan-maplibre-map` without adding a map runtime to
`@rowan-ui/core`. Install it with `maplibre-gl` only in applications that need map
rendering. Applications own the style or permitted tiles, provider attribution,
credentials, cost and privacy decisions, and offline policy. The adapter accepts
coordinates only; it does not geocode or look up addresses. Locations and marker
layers are property-only, and accessible list and table alternatives remain
available when map rendering cannot start. React:
`import { RowanMapLibreMap } from "@rowan-ui/maplibre/react/map"`. See the
package README for the application-owned setup contract.

## Rowan Selection Controls

`rowan-listbox` composes light-DOM `rowan-option` children for accessible single or multiple selection. Its scalar `value` reflects for declarative single-selection bindings; its `selected` array is property-only for multiple values. User selection emits `rowan-change` with the activated value, selected values, and option reference. Form-associated listboxes submit one value per selected option in multiple mode.

`rowan-multi-select-combobox` uses property-only `options` and `selected` arrays. It filters available choices, preserves selections outside the active query, provides removable chips, and emits one outer `rowan-change` event for user additions or removals. Its FACE value is a repeated form entry under `name`.

`rowan-radio-group` is form-associated. A `name` submits the selected child value once; `required` is `valueMissing` until a radio is selected; form reset restores the value present at connect. Child radios keep their own validity, but they do not also submit when the group has a `name`.

`rowan-file-upload` is form-associated. A `name` submits queued `File` objects; `required` is `valueMissing` until at least one file is queued; form reset clears the queue without emitting.

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

## Rowan Color Picker

`rowan-color-picker` is a form-associated semantic color control. Its default approved palette uses Rowan's existing forest, sand, ink, and danger primitive values. The reflected `value` normalizes to lowercase `#rrggbb` for opaque colors or `#rrggbbaa` when opacity is below 100%.

Assign application-approved swatches with the property-only `palette` array. Users can also choose an arbitrary RGB color and opacity through the native fallback controls. Parent-assigned values stay silent; user selection emits `rowan-change` with `value`, `color`, `alpha`, `option`, and `source`.

```html
<rowan-color-picker
  id="project-color"
  name="projectColor"
  label="Project color"
  value="#1d432f"
></rowan-color-picker>

<script type="module">
  import "@rowan-ui/core/color-picker";

  const picker = document.querySelector("#project-color");
  picker.palette = [
    { value: "#1d432f", label: "Forest" },
    { value: "#24543c", label: "Canopy" },
    { value: "#b4392d", label: "Signal" },
  ];

  picker.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>
```

## Rowan Rating

`rowan-rating` is a form-associated whole-star rating control. Its scalar `value` is an empty string for no rating or an integer normalized within `min`, `max`, and `step`; the default scale is one through five. When `required` is present, an unset value is invalid. User input through stars, Arrow keys, Home, End, or the clear control emits one `rowan-change` event; parent-assigned values remain silent.

```html
<rowan-rating
  id="service-quality"
  name="serviceQuality"
  label="Service quality"
  value="4"
  required
></rowan-rating>

<script type="module">
  import "@rowan-ui/core/rating";

  const rating = document.querySelector("#service-quality");
  rating.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>
```

## Rowan Rich Text Editor

`rowan-rich-text-editor` is a form-associated authoring control for concise operational guidance. Its property-only `value` is a document object: paragraph, heading (levels 1–3), ordered-list, and unordered-list blocks plus bold, italic, underline, and optional allowlisted `href` runs. Images are not document nodes. It never accepts an HTML value or reflects document data to an attribute. Import `RowanRichTextDocument` from `@rowan-ui/core/rich-text-editor`. Link hrefs are `http:`, `https:`, `mailto:`, in-app paths starting with `/`, or fragments starting with `#`. Other schemes are dropped.

Rich mode uses the browser editing surface and native undo behavior. Rich clipboard data is inserted as literal plain text, not interpreted as markup. Use `mode="plain"` when the workflow must use a textarea fallback; it still emits the same document object. The submitted FACE value is the JSON serialization of that document.

```html
<rowan-rich-text-editor
  id="incident-guidance"
  name="incidentGuidance"
  label="Incident guidance"
  placeholder="Describe the response steps"
></rowan-rich-text-editor>

<script type="module">
  import "@rowan-ui/core/rich-text-editor";

  const editor = document.querySelector("#incident-guidance");
  editor.value = {
    blocks: [
      { type: "heading", level: 2, children: [{ text: "Escalation" }] },
      {
        type: "paragraph",
        children: [
          { text: "Escalate to the incident lead.", bold: true },
          { text: " Open the record", href: "/incidents/12" },
        ],
      },
      {
        type: "unordered-list",
        items: [[{ text: "Open the incident record" }], [{ text: "Notify the on-call team" }]],
      },
    ],
  };

  editor.addEventListener("rowan-change", (event) => {
    persistGuidance(event.detail.value);
  });
</script>
```

This component's security boundary ends at its normalized document value: applications own authorization, persistence, rendering outside the component, and any collaboration or merge model. Do not turn event data into HTML; render its text runs through DOM text nodes or an application-owned trusted renderer.

## Rowan Image

`rowan-image` is an experimental display host for a still. `src` and `alt` are
attributes. Optional `href` is a real link around the image only, using the
same navigation sanitizer as `rowan-link`. Overlay actions stay outside that
link. A caption slot renders as `figcaption`. Missing or failed images show
the fallback slot. It is not a rich-text document node and not a lightbox;
compose a dialog if you need one.

```html
<rowan-image src="/stills/north-yard.jpg" alt="North yard camera" href="/cameras/north-yard">
  <rowan-badge slot="overlay" tone="warning">Needs review</rowan-badge>
  <span slot="caption">North yard · live still</span>
</rowan-image>
```

## Rowan KPI Card

`rowan-kpi-card` is a frozen dashboard stat tile. `label`, `tone`, and
`delta-label` are attributes. `value` and `delta` are property-only. Tone never
replaces the label. Delta text includes a sign so change is not color-only. A
null `value` shows `No data`; `loading` replaces the value with a skeleton.
The `chart` slot is for `rowan-sparkline` and follows the label and value in
reading order.

```html
<rowan-kpi-card label="Open incidents" tone="warning" delta-label="vs last week"></rowan-kpi-card>

<script type="module">
  import "@rowan-ui/core/kpi-card";

  const card = document.querySelector("rowan-kpi-card");
  card.value = 19;
  card.delta = -4;
</script>
```

## Rowan Bar Chart

`rowan-bar-chart` is a frozen small categorical comparison. Property-only
`series`, `labels`, `config`, and `valueFormatter`. `null` is no-data, not zero.
Interactive bars emit `rowan-point-activate` with the same detail shape as
`rowan-trend-chart`. Native SVG, no animation, matching data table.

## Rowan Area Chart

`rowan-area-chart` is an experimental filled multi-series chart. It uses the
same property-only `series`, `labels`, `config`, and `valueFormatter` as
`rowan-trend-chart`. Series are independent fills, not stacked. A `null` value
breaks both the line and the fill and appears as `No data` in the table.
Interactive points emit `rowan-point-activate`. Native SVG, no animation.

## Rowan Stacked Bar Chart

`rowan-stacked-bar-chart` is an experimental categorical stack. Positive values
stack from zero in series order. `null` and negatives are no-data: they do not
contribute height and appear as `No data` in the table. Interactive segments
emit `rowan-point-activate`. Native SVG, no animation. Grouped bars stay on
`rowan-bar-chart`.

## Rowan Donut Chart

`rowan-donut-chart` is a frozen parts-of-a-whole chart. It draws the
**first** series. Negative values are treated as no-data: they are omitted from
slices and from the hole total, and appear as `No data` in the table.

## Rowan Sparkline

`rowan-sparkline` is a frozen compact one-series line for KPI tiles.
It is a separate host, not a density of `rowan-trend-chart`. `values` is
property-only (`number | null`; null is a gap). There is no legend, no
interactive points, and no animation. A visually hidden table exposes the same
values to assistive technology. `rowan-progress` `hide-meta` hides the percent
caption without dropping the progressbar name.

```html
<rowan-kpi-card label="Open incidents" tone="warning" delta-label="vs last week">
  <rowan-sparkline slot="chart" label="Open incidents this week"></rowan-sparkline>
</rowan-kpi-card>

<script type="module">
  import "@rowan-ui/core/kpi-card";
  import "@rowan-ui/core/sparkline";

  const card = document.querySelector("rowan-kpi-card");
  const chart = document.querySelector("rowan-sparkline");
  card.value = 11;
  card.delta = -7;
  chart.values = [18, 24, 12, 15, 9, 11];
</script>
```

## Rowan Trend Chart

`rowan-trend-chart` is a frozen small multi-series **line** chart for operational comparisons such as incoming versus resolved incidents. It is scoped to small local data sets. `series`, `labels`, `config`, and `valueFormatter` are property-only APIs; no data is serialized to attributes. Import `RowanTrendChartConfig` from `@rowan-ui/core/trend-chart`. Area, bar, stacked bar, donut, and sparkline charts are separate hosts, not extra `config` keys.

The component always provides the same values in a semantic table beneath the chart. A `null` value is an intentional no-data gap: it breaks the visual line, has no interactive point control, and appears as `No data` in the table. Set `interactive` to expose each available data point as a keyboard-focusable control; Arrow keys move between points, and Enter or Space emits `rowan-point-activate`. It uses native SVG and no charting runtime dependency. There is no animation, so reduced-motion users receive the same stable rendering.

```html
<rowan-trend-chart
  id="on-call-workload"
  label="On-call workload"
  description="Incoming and resolved incidents by day."
  interactive
></rowan-trend-chart>

<script type="module">
  import "@rowan-ui/core/trend-chart";

  const chart = document.querySelector("#on-call-workload");
  chart.config = {
    labels: ["Mon", "Tue", "Wed"],
    interactive: true,
    series: [
      { id: "incoming", label: "Incoming incidents", values: [18, null, 17] },
      { id: "resolved", label: "Resolved incidents", values: [13, 19, 20] },
    ],
    valueFormatter: (value, context) => (context.tick ? String(value) : `${value} incidents`),
  };

  chart.addEventListener("rowan-point-activate", (event) => {
    console.log(event.detail.seriesId, event.detail.label, event.detail.value);
  });
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

## Rowan Contextual Actions

`rowan-confirm-dialog` composes the modal behavior of `rowan-dialog` with explicit outcomes for consequential actions. Parent changes to `open` remain silent. A user selection emits `rowan-confirm` or `rowan-cancel`, while Escape, the dialog close control, and backdrop dismissal emit `rowan-close`.

`rowan-dropdown`, `rowan-popover`, and `rowan-tooltip` paint on the top layer
(Popover API), so `overflow: hidden` ancestors do not clip them. `rowan-dropdown`
keeps a default secondary trigger and accepts a `trigger` slot for an avatar or
icon-only control.

Required `rowan-text-field`, `rowan-textarea`, and `rowan-number-field` stay
visually valid until blur or `reportValidity()` (form submit). `checkValidity()`
still fails immediately.

`rowan-context-menu` binds to an element through its `for` attribute or `target` property. It intercepts the target's native context menu, also opens from `Shift+F10` or the Context Menu key, manages Arrow/Home/End menu focus, and emits `rowan-change` when a user selects a `rowan-menu-item`.

`rowan-status-indicator` is a compact persistent status marker. Use its `tone`, `size`, `label`, and optional `pulse` state; visible text comes from the default slot or `label` attribute.

```html
<rowan-button id="archive-project" variant="danger">Archive</rowan-button>
<rowan-confirm-dialog id="archive-dialog" confirm-label="Archive" confirm-variant="danger">
  <span slot="title">Archive this project?</span>
  Archived projects remain available to workspace administrators.
</rowan-confirm-dialog>

<button id="project-target" type="button">Trail map</button>
<rowan-context-menu for="project-target" label="Trail map actions">
  <rowan-menu-item value="rename">Rename</rowan-menu-item>
  <rowan-menu-item value="archive">Archive</rowan-menu-item>
</rowan-context-menu>

<rowan-status-indicator tone="success" label="Operational"></rowan-status-indicator>

<script type="module">
  import "@rowan-ui/core/button";
  import "@rowan-ui/core/confirm-dialog";
  import "@rowan-ui/core/context-menu";
  import "@rowan-ui/core/menu-item";
  import "@rowan-ui/core/status-indicator";

  const dialog = document.querySelector("#archive-dialog");
  document.querySelector("#archive-project").addEventListener("rowan-click", () => dialog.show());
  dialog.addEventListener("rowan-confirm", () => {
    // Persist the archive action.
  });

  document.querySelector("rowan-context-menu").addEventListener("rowan-change", (event) => {
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

## Rowan Application Workspaces

`rowan-app-layout` composes a responsive header, primary navigation, and default main-content slot. It keeps navigation state reflected through `navigation-open`; only user use of the compact toggle, backdrop, or Escape emits `rowan-change`. Compose `rowan-side-nav-item` children in `rowan-side-nav` for application destinations (Arrow, Home, End, Enter, Space). Wrap items in `rowan-side-nav-section` for labeled groups; the parent nav still has one `value`. An empty `value` means nothing is selected. Omit `href` and route from `rowan-change` for SPA destinations, or keep `href` and `preventDefault` on `rowan-change` to block full navigation.

`rowan-split-pane` provides a keyboard-operable separator for durable two-pane workspaces. Its reflected `position`, `min`, `max`, and `step` use percentage values; `snapPoints` is property-only. User drag or keyboard resizing emits `rowan-resize`, while parent assignments remain silent.

```html
<rowan-app-layout id="workspace-shell">
  <header slot="header">Northstar</header>
  <rowan-side-nav slot="navigation" label="Workspace navigation" value="overview">
    <rowan-side-nav-section label="Workspace">
      <rowan-side-nav-item value="overview">Overview</rowan-side-nav-item>
      <rowan-side-nav-item value="members">Members</rowan-side-nav-item>
    </rowan-side-nav-section>
  </rowan-side-nav>
  <rowan-split-pane position="32" min="20" max="80">
    <aside slot="start">Filters</aside>
    <main slot="end">Workspace content</main>
  </rowan-split-pane>
</rowan-app-layout>

<script type="module">
  import "@rowan-ui/core/app-layout";
  import "@rowan-ui/core/side-nav";
  import "@rowan-ui/core/side-nav-section";
  import "@rowan-ui/core/split-pane";

  const nav = document.querySelector("rowan-side-nav");
  nav.addEventListener("rowan-change", (event) => {
    event.preventDefault();
    console.log(event.detail.value);
  });

  const pane = document.querySelector("rowan-split-pane");
  pane.snapPoints = [25, 50, 75];

  pane.addEventListener("rowan-resize", (event) => {
    console.log(event.detail.value);
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
- Pagination model with `rowan-page-change` and normalized page indexes
- Optional virtualized body mode that retains real table markup and existing selection, sort, activation, and cell-event contracts
- Cell composition for `text`, `number`, `date`, `badge`, `link`, `checkbox`, `switch`, `button`, `icon-button`, `avatar`, `chip`, `progress`, `custom`

### Configuration updates

Assigning `.config` replaces the complete table state. Omitted values reset to their defaults: empty columns and rows, `rowId: "id"`, no selection, no sort or page, `selectable: "none"`, `density: "md"`, no caption, and disabled sticky/loading states.

Use flattened properties for partial updates that retain the rest of the current configuration:

```js
table.rows = nextRows;
table.selected = selectedIds;
table.sort = { id: "name", dir: "asc" };
table.page = { index: 0, size: 25, total: totalMembers };
```

In local development, Rowan warns when column IDs are missing or repeated, when a cell type is unsupported, or when row IDs are invalid or duplicated. Invalid and later duplicate columns are omitted; unsupported cell types render as text; duplicate row IDs render safely without keyed reuse.

An out-of-range `page.index` resolves to the last available page and updates the public `.page` value to match. Selection belongs to the full table data set, so selected row IDs and `.selectedRows` remain available when the visible page changes.

### Virtualized body

Set `virtualized` for large local row collections. `virtualItemSize` is the initial row-height estimate, `virtualOverscan` adds rows around the visible viewport, and `--rowan-table-virtual-height` controls the viewport height. Those three fields and the CSS variable are frozen names. The table remains a real semantic `<table>` with mounted `<tr>` rows, so the existing cell, selection, sort, and row-activation APIs do not change. Tables with duplicate row IDs retain Rowan's full-render safety fallback.

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

### Cell metadata and custom cells

Use `headerCell.tooltip` to provide a header description, `cell.title` for a per-cell description, and `cell.indeterminate` for checkbox cells. Each can be a static value or a row-aware callback where supported.

For `type: "custom"`, `cell.render` can return text or a `Node` directly. A `cell.slot` clones authored light-DOM markup per cell. Each newly cloned slot cell emits `rowan-cell-bind` with its `rowId`, `columnId`, row data, value, and mounted `cellEl`; selection-only updates retain existing clones and do not emit the event again.

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

  ordersTable.addEventListener("rowan-cell-bind", (event) => {
    const { rowId, columnId, row, cellEl } = event.detail;
    console.log("hydrate", rowId, columnId, row, cellEl);
  });
</script>
```

## Table Operations

Use `rowan-table-toolbar` for filters and density. Use `rowan-bulk-actions-bar` as the selection header when rows are selected. If both are slotted, the toolbar hides its “N selected” count so the bulk bar owns that chrome. `applyFilters(rows, filters, fields)` from `@rowan-ui/core/filter-builder` applies the frozen operator list. Set `caption-visually-hidden` when the caption should name the table for assistive technology without repeating a page heading. `rowan-filter-builder` owns a property-only filter model and emits it for the application to apply to rows. `rowan-row-details-panel` opens from `rowan-row-activate` and renders a read-only row record. All table-operation components bind to a containing table through its `toolbar` slot, a property reference, or `for-table` where applicable. Storybook **Workflows / Bulk confirm** shows Flag and Assign driver with `rowan-dialog` `alert`.

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

Keep the source rows in application state. The filter builder reports a frozen
flat AND list (`filters[]` of `{ id, field, operator, value }`) and does not
mutate `table.rows`. Import `applyFilters` from `@rowan-ui/core/filter-builder`
and assign the derived rows. There are no nested groups. Field `type` is `text`, `number`,
`date`, `boolean`, or `select`. Unknown types become `text`, or `select` when
`options` are present. Unknown operators on a filter become that field's first
operator. Import `RowanFilter` and `RowanFilterField` from
`@rowan-ui/core/filter-builder`. The details panel opens from
`panel.show(row, rowId)` or from `rowan-row-activate` when `for-table` is set.
Do not pass React `open={false}` unless you fully control `open`. Multi-select
activation fills `rowIds` and shows previous/next. `size` is `sm`, `md`, or `lg`.
The panel does not modify the row record. Table columns may use
`type: "sparkline"` with a `number[]` value.

```html
<rowan-table id="members-table">
  <rowan-filter-builder id="member-filters" slot="toolbar"></rowan-filter-builder>
</rowan-table>
<rowan-row-details-panel for-table="members-table"></rowan-row-details-panel>

<script type="module">
  import "@rowan-ui/core/table";
  import { applyFilters } from "@rowan-ui/core/filter-builder";
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
    table.rows = applyFilters(rows, event.detail.filters, filters.fields);
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

Pushes to `main` publish Storybook to GitHub Pages via
`.github/workflows/storybook-pages.yml`. One-time repo setting: **Settings →
Pages → Source: GitHub Actions**. The project site is
`https://<owner>.github.io/<repo>/` (for this repo,
[https://2351labs.github.io/rowan/](https://2351labs.github.io/rowan/)); the
**Home** docs page is the landing story. Local `npm run storybook` still serves
at `/`.

- `npm run test` runs web component tests with Web Test Runner, including an axe WCAG A/AA audit of representative widgets
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

Tooling (`analyze`, `types`, `css:check`, tests) requires Node 20 or later. Published packages declare `"engines": { "node": ">=20" }`.

## Benchmarks

`npm run benchmark` measures module import/definition, first render, reconnect behavior, and Rowan table selection, sorting, and paging through real public APIs. The harness compares equivalent button, checkbox, and switch workloads for Rowan, Lit, FAST Element, and Web Awesome. Its methodology, scope limits, and options are in [benchmarks/README.md](benchmarks/README.md); the checked-in Chromium baseline is in [benchmarks/RESULTS.md](benchmarks/RESULTS.md), with raw samples in [benchmarks/results/latest.json](benchmarks/results/latest.json).

## Releases

See [RELEASING.md](RELEASING.md) for the versioning, generated-artifact, CI, package-inspection, and publish procedure.

## License

Rowan is available under the [MIT License](LICENSE).
