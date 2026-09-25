# Stabilize experimental four + dashboard primitives

**Goal.** Freeze the four `0.5` experimental surfaces so they can enter `1.0`, then add dashboard primitives that stay **experimental**: KPI cards, compact charts, and additional chart types.

**Default DX.** Same as the rest of Rowan: vanilla hosts, property-only objects/arrays, `rowan-*` events on user action, CEM as the contract, generated React wrappers. Charts stay native SVG with a semantic table. No charting runtime.

**Non-negotiables.**

- Do not add a charting library.
- Do not accept HTML as a rich-text value.
- Do not nest filter groups (AND/OR trees) in the freeze. The frozen predicate is a flat list.
- Do not rename table virtualization keys (`virtualized`, `virtualItemSize`, `virtualOverscan`) to match `rowan-virtual-list`. The names are already public.
- New KPI and chart hosts ship **experimental**. They do not block marking the original four Stable.
- Objects stay property-only. Series, filters, documents, and KPI numeric payloads never round-trip through attributes.

**Status.** Sprint 10 done. KPI, sparkline, bar, and donut are Stable. Area and stacked bar are experimental. Rich-text headings and links shipped. Wrappers track remains in `sprints.md`.

---

## Sprint 1 — Table virtualization freeze

**Status:** done

`rowan-table` config, selection, sort, and paging are already Stable. Only the virtualization fields are experimental. Freeze them as the way to window large local row sets inside a real `<table>`.

Current contract to keep:

- `virtualized`, `virtualItemSize`, `virtualOverscan` on the host and in `config`
- `--rowan-table-virtual-height` for the viewport
- Mounted rows stay semantic `<tr>`; selection, sort, activation, and cell events do not change
- Duplicate row IDs keep the full-render safety fallback
- When rows are omitted, `aria-rowcount` / `aria-rowindex` describe the full set

### Done when

- [x] README marks table virtualization **Stable**. Notes say the three fields and the CSS variable will not be renamed.
- [x] Tests pin: bounded `<tr>` window, events still fire on mounted rows, duplicate-id fallback, `aria-rowcount` for virtualized and paged tables.
- [x] CEM / types export `virtualized`, `virtualItemSize`, `virtualOverscan` on `RowanTableConfig` without “may change” language.
- [x] No new virtualization API (`rowHeight`, `item-size`, window callbacks). Variable-height measurement stays inside `VirtualCollection`.

### Out of scope

Server-side paging protocols, infinite scroll, column virtualization, renaming to `item-size`.

---

## Sprint 2 — Rich-text document freeze

**Status:** done

The experimental note was “the document model may gain node types.” Freeze the model as the `1.0` document. Headings, links, images, and mentions are a later major, not a silent extension.

Frozen document:

- Blocks: `paragraph` | `unordered-list` | `ordered-list`
- Runs: `{ text, bold?, italic?, underline? }`
- `value` is that object (property-only). `text` is the plain-text convenience.
- `mode`: `rich` | `plain`
- FACE: `name`, `required`, `disabled`, `invalid`; user edits emit `rowan-change`
- Clipboard pastes as plain text. HTML is never an input or output of the public API.

### Done when

- [x] README marks `rowan-rich-text-editor` **Stable** and states the block/mark set is closed.
- [x] Round-trip tests: normalize → serialize → parse → equal for paragraphs, both list types, marks, empty docs, and plain-text mode.
- [x] Tests pin: HTML strings assigned to `value` are ignored or emptied, not interpreted; `rowan-change` is user-only.
- [x] Types (`RowanRichTextDocument` and friends) are exported from the public entry and CEM.

### Out of scope

Collaboration, markdown import, images, a sanitizing HTML setter. Headings and links shipped later as a document expansion.

---

## Sprint 3 — Filter-builder predicate freeze

**Status:** done

The experimental note was “predicate shape may change.” Freeze a **flat** list. Conjunction is implicit AND. Nested groups and OR would be a new experimental surface later.

Frozen predicate:

- `fields[]`: `{ id, label, type, operators?, options? }`
- `type`: `text` | `number` | `date` | `boolean` | `select`
- `filters[]`: `{ id, field, operator, value }`
- Operator sets stay the current per-type defaults (`contains`, `equals`, comparisons, `is-empty` / `is-not-empty`, …)
- `for-table` / `table` still infer fields from table columns
- User add/update/remove/clear emit `rowan-filter-change` with `{ filter, filters }` (and the existing detail fields)

The host does not evaluate predicates against rows. Applications (or a documented helper, if one already exists) apply `filters`.

### Done when

- [x] README marks `rowan-filter-builder` **Stable** and states: flat AND list, no groups.
- [x] Tests pin field types, valueless operators clearing `value`, table-inferred fields, and `rowan-filter-change` payloads.
- [x] Types for fields, filters, and operators are public. Unknown operators/types are dropped or coerced the same way they are today — that behavior is documented, not redesigned.
- [x] CEM lists `fields` and `filters` as property-only.

### Out of scope

Query languages, OR groups, saved-view persistence, running the filter inside the table.

---

## Sprint 4 — Trend-chart line freeze

**Status:** done

Freeze `rowan-trend-chart` as the **small multi-series line** chart. Other geometries wait for Sprint 7 and stay experimental.

Frozen contract:

- Property-only: `series`, `labels`, `config`, `valueFormatter`
- `series[].values` may be numbers, `null` (gap / “No data”), or `{ value, label? }`
- `interactive` + `rowan-point-activate`; parent assignment is silent
- Native SVG, no animation
- The same values always exist in a semantic table
- Scoped to small local data sets (no thousands-of-points claim)

### Done when

- [x] README marks `rowan-trend-chart` **Stable**. Config keys above are the line-chart API.
- [x] Tests pin: null gaps break the line, table matches series, `valueFormatter` `tick` context, interactive keyboard activation.
- [x] Shared normalization (`src/trend-chart/model.js`) is documented as the line-chart model. Extracting a generic `src/chart/` module may start here if Sprint 6–7 need it; the public `rowan-trend-chart` API must not change.
- [x] README **API stability** table: the original four are Stable. Catalog copy on Home / docs / CHANGELOG matches.

### Out of scope

Bar, donut, sparkline, density attribute, stacked series, axes as a public config object.

---

## Sprint 5 — KPI card (experimental)

**Status:** done

Admin dashboards need a stat tile, not a restyled `rowan-card`. New host, experimental.

Proposed tag: `rowan-kpi-card`.

### Shape (may still change)

- Attributes: `label`, `tone` (`neutral` | `success` | `warning` | `danger` | `info`), `delta-label`
- Properties: `value` (number or formatted string, property-only if not a safe scalar), `delta` (number | null)
- Slots: default extra/description, `icon`, `chart` (sparkline or compact chart)
- Visible value + label without color alone. Delta text includes a sign and is not color-only.
- Not FACE. No `rowan-change` unless we add a control later (don’t).

Compose tokens with card/status. Do not fork a dashboard layout system.

### Done when

- [x] Host, CSS parts, tokens, CEM, generated React wrapper, Storybook, tests.
- [x] README **API stability** lists `rowan-kpi-card` as Experimental.
- [x] Tests: tone without text still has a label; delta `0` / `null` / negative; slotted chart does not break the label/value reading order.
- [x] Empty/loading: `value` null shows an empty or skeleton treatment that stays accessible.

### Out of scope

Grid dashboards, sparklines (Sprint 6), fetching, comparison date pickers.

---

## Sprint 6 — Compact charts (experimental)

**Status:** done

KPI tiles need a sparkline-scale chart. Do **not** silently shrink `rowan-trend-chart` and hide its table. Add an experimental compact surface.

### Shape (may still change)

- `rowan-sparkline` **or** `rowan-trend-chart` `density="compact"` — pick one in the sprint and pin it. Prefer a **separate host** so the Stable line chart does not re-open.
- One series, small `values` array, optional `delta` coloring via tokens.
- No legend. No interactive point grid unless it can be reached from the KPI label.
- Accessible name from `label`. Values available to AT (visually hidden table or `aria-valuetext` summary). Do not drop the data for screen readers.
- Fits the `chart` slot of `rowan-kpi-card`.

Related density: `rowan-progress` `part="meta"` is always on. If compact tiles need a bar without the percent caption, add an experimental way to hide meta (`meta` boolean or `size`) without breaking the progressbar name.

### Done when

- [x] Compact chart host (or frozen `density` on a new experimental path) documented as Experimental.
- [x] Story: KPI card + sparkline. Story: progress with meta hidden.
- [x] Tests: AT still gets a name and values; reduced-motion unchanged (no animation).
- [x] Does not change Stable `rowan-trend-chart` rendering.

### Out of scope

Live streaming, 1px canvas charts, theming beyond Rowan tokens.

---

## Sprint 7 — Additional chart types (experimental)

**Status:** done

New hosts, same data discipline as the line chart. Experimental until a later freeze.

### Types in this sprint

| Host                | Use                          | Notes                                                    |
| ------------------- | ---------------------------- | -------------------------------------------------------- |
| `rowan-bar-chart`   | Small categorical comparison | Vertical bars, shared `labels` + `series`                |
| `rowan-donut-chart` | Parts of a whole             | One series of labeled slices; total in the hole or table |

Shared rules:

- Property-only `series` / `labels` / `valueFormatter` / `config`
- `null` is no-data, not zero
- Semantic table of the same values
- Native SVG, no animation, no charting library
- Interactive slices/bars optional (`rowan-point-activate` or a type-specific event — pick one name and use it on all chart hosts)

Extract shared normalize/table helpers if Sprint 4 did not.

### Done when

- [x] Both hosts + wrappers + Storybook + tests + CEM.
- [x] README experimental table lists them. Copy says small local data only.
- [x] Shared event and formatter types. Line chart API stays untouched.
- [x] Donut rejects or flattens negative values in a documented way.

### Out of scope

Stacked/100% bar, scatter, heatmap, time-series brushes, MapLibre charts, CSS-only pie hacks.

---

## Sprint 8 — Catalog and release notes

**Status:** done

Close the loop so `0.5` docs match the freeze and the new experimental set.

### Done when

- [x] README API stability table:

  | Surface                                | Status       |
  | -------------------------------------- | ------------ |
  | Table virtualization                   | Stable       |
  | `rowan-rich-text-editor`               | Stable       |
  | `rowan-filter-builder`                 | Stable       |
  | `rowan-trend-chart`                    | Stable       |
  | `rowan-kpi-card`                       | Experimental |
  | Compact sparkline (name from Sprint 6) | Experimental |
  | `rowan-bar-chart`, `rowan-donut-chart` | Experimental |

- [x] Home, docs site, CHANGELOG Unreleased: four promoted; three new experimental hosts.
- [x] `npm run analyze` + generated wrappers committed. CI generated-artifacts green.
- [x] Package version: **do not** call this `1.0`. Promoting the four is a minor (`0.6.0` or `0.5.1` per how breaking the freezes were — prefer `0.6.0` if any frozen shape was narrowed). Experimental hosts may change without a major.

### Out of scope

npm publish (separate release cut), Vue/Svelte, MapLibre changes.

---

## Sprint 9 — Area and stacked bar (experimental)

**Status:** done

Admin dashboards need filled series and stacked categories. Keep the frozen line and grouped-bar APIs unchanged: new geometries are separate hosts.

### Types in this sprint

| Host                      | Use                         | Notes                                                                |
| ------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `rowan-area-chart`        | Filled multi-series         | Same property-only contract as the line chart. Null breaks the fill. |
| `rowan-stacked-bar-chart` | Categorical stack from zero | Positives stack. Null and negatives are no-data.                     |

Shared rules stay the same: property-only data, matching table, native SVG, `rowan-point-activate`.

### Done when

- [x] Both hosts + wrappers + Storybook + tests + CEM.
- [x] README marks them Experimental. Frozen line and grouped-bar APIs unchanged.
- [x] Null gaps the area fill. Stacked bars skip null and negatives.

### Out of scope

100% stacked bar, stacked area, scatter, heatmap, time-series brushes.

---

## Sprint 10 — Rich-text headings and links

**Status:** done

Expand the Stable document without accepting HTML or images.

- Heading blocks: `{ type: "heading", level: 1|2|3, children }`
- Link mark: optional allowlisted `href` on a run
- Images stay out of the document

### Done when

- [x] Normalize, round-trip, and surface parse keep headings and allowlisted hrefs.
- [x] `javascript:` and unknown schemes are dropped. Images and HTML strings still empty.
- [x] Toolbar heading toggle and link popover. Events stay user-only.

---

## Sprint 12 — Bullet chart (experimental)

**Status:** done

Admin KPIs need actual versus target in qualitative bands. Separate host so sparkline and bar stay frozen.

### Done when

- [x] `rowan-bullet-chart` with property-only `ranges`, `value`, and `target`.
- [x] Null actual/target is no-data. Invalid ranges dropped. Matching table.
- [x] README Experimental. KPI `chart` slot example.

---

## Sprint 13 — Gauge chart (experimental)

**Status:** done

Admin KPIs need a speedometer: ranges, min/max, needle, optional target. Separate host from bullet and donut.

### Done when

- [x] `rowan-gauge-chart` with `min`/`max` attributes and property-only `ranges`, `value`, `target`.
- [x] Null actual/target is no-data. Matching table. README Experimental.

---

## Dashboard authoring track

**Goal.** Ops-dashboard primitives without thawing frozen hosts or becoming a BI runtime. Events stay user-action only. Icons stay import-registered (no string registry in core). KPI `tone` / `delta` / `delta-label` stay the KPI vocabulary.

Pulse RFC items that are **out of this track:** KPI `thresholdState` / `trendDirection` / `freshnessTimestamp` (duplicates frozen KPI fields), filled Lucide catalog, React-style filter context, hover-driven `hoverLink` buses.

---

## Sprint 14 — Side-nav item tone and count

**Status:** done

Exception cues on `rowan-side-nav-item` without custom suffix markup. Reuse KPI/badge `tone`. Do not add `statusIcon` strings.

- `tone`: `none` (default) | `info` | `success` | `warning` | `danger`
- `count`: optional number. Hidden when null or ≤ 0. When count is set without tone, color as `danger`
- `count-label`: optional accessible phrase (`alerts`). Defaults from tone
- Slotted `suffix` wins; built-in status hides
- Dot when tone is set and there is no count; count chip otherwise
- Accessible name includes label, count, and count-label

### Done when

- [x] Attributes and properties on the host, CEM, types, React wrapper
- [x] Tests: dot, count, suffix slot wins, aria-label includes count-label, count ≤ 0 hides
- [x] Story: several tones and a slotted suffix
- [x] Colors follow success/warning/danger/info tokens (light, dark, ember)

### Out of scope

Custom status icons, command-palette parity, changing `rowan-side-nav` selection API.

---

## Sprint 15 — Data-state wrapper

**Status:** done

One experimental host for page/widget async chrome. Do not add `state=` to frozen charts or KPI.

`rowan-data-state`:

- `state`: `ready` | `loading` | `empty` | `error` (stale/partial as optional flags later, not equal states)
- Slots: default (ready), `loading`, `empty`, `error`, `actions` (retry)
- Keyboard: retry control in the error slot is the author’s button; wrapper does not invent a second focus system
- Table/KPI keep their own `loading`; this wraps a region

### Done when

- [x] Host hides inactive slots (`hidden` + display)
- [x] Tests for each state, slot fallback copy, and `ready` showing children
- [x] README experimental. Story with retry

### Out of scope

Data fetching, caching, per-chart state machines, `stale` as a fifth equal state.

---

## Sprint 16 — Icon tone

**Status:** done

`rowan-icon` `tone` sets `color` from the same tokens as badge/KPI (`currentColor` on the SVG). `stroke-width` stays. No filled catalog.

### Done when

- [x] `tone` attr on `rowan-icon`; default currentColor / inherit
- [x] Contrast: danger/warning/success/info on light and dark surfaces
- [x] Tests + icon stories

### Out of scope

`variant: filled` for 2,098 Lucide icons. A tiny filled alert set would be a later icons sprint.

---

## Sprint 17 — Table pinned columns

**Status:** done

Additive on frozen `rowan-table` config. The public field is existing `sticky: "start" | "end"` (not a second `pinned` name). Virtualization already Stable — do not rename or replace it.

- Sticky cells in the virtualized and non-virtualized body
- Leading start-run and trailing end-run get stacked offsets
- Selection column is sticky-start when selectable
- Selection/sort/cell events unchanged; column DOM order unchanged

### Done when

- [x] Config type + tests: pin start, pin end, virtualized + pin, DOM order preserved
- [x] README notes `sticky` as additive on the frozen column shape
- [x] No second table host

### Out of scope

Grouped rows and subtotals (sprint 17b if this lands). Column virtualization.

---

## Sprint 18 — Table grouped rows

**Status:** done

Additive `groupBy` on frozen `rowan-table` config.

- `groupBy`: column id string or `{ id, subtotals?, collapsed? }`
- Group header row; optional number subtotals
- User expand/collapse emits `rowan-group-toggle`
- Paging still slices data rows; group headers appear for groups on the page

### Done when

- [x] Config + tests: headers, collapse event, subtotals
- [x] README
- [x] No nested groups

### Out of scope

Tree grids, nested groups of groups, Excel-style pivot.

---

## Sprint 19 — Chart reference lines (experimental hosts)

**Status:** done

Overlays on **experimental** charts only. Frozen trend/bar/donut/sparkline stay as they are.

- Property-only `referenceLines: { value, label?, tone? }[]` on area and stacked-bar (gauge/bullet already have target)
- Token-aware stroke; hover readout includes the line label
- Matching table row

### Done when

- [x] Lines render, expand the value domain, stay off frozen trend/bar
- [x] Hover + matching table
- [x] Tests and stories

### Out of scope

Confidence intervals, event annotations, brushing, adding overlays to frozen trend/bar.

---

## Sprint 20 — Source meta + filter session module

**Status:** done

Two small pieces, not a provider.

1. `rowan-source-meta`: `source` and `as-of` text. Drop into KPI description, chart description, or table caption. No new props on frozen hosts.
2. `createDashboardFilters()` in `@rowan-ui/core/dashboard-filters` (name TBD): subscribe/set/clear. Apps wire `rowan-point-activate` / `rowan-change` / `rowan-select` themselves. Components do not auto-subscribe.

### Done when

- [x] Source-meta host + tests + story
- [x] Filter session unit tests: set, clear, subscribe, snapshot for deep links
- [x] Cookbook snippet in app-shell or a dashboard MDX — no implicit chart coupling

### Out of scope

Context provider, hover-link bus, `drillTo`, persisting to URL (app concern; session can serialize).

---

## Sprint 21 — Bullet table cell

**Status:** done

Additive `type: "bullet"` on frozen `rowan-table`, same pattern as sparkline. Mounts experimental `rowan-bullet-chart`. No custom Node hook. Details stay `rowan-row-details-panel`.

- Row value `{ value, target?, ranges? }` or a number
- Column `cell.ranges` / `cell.label` overlay when set. Do not use `cell.target` (that is the link window target).
- Virtualized body keeps a real `<td>` + host
- Unknown types still fall back to text

### Done when

- [x] Cell type + tests (payload, column ranges, virtualized window)
- [x] README + story
- [x] No thaw of table config names; no KPI fields

### Out of scope

Interactive-cell contract, popover trigger modes, hierarchical side-nav.

---

## Sprint 22 — Table interactive-cell contract

**Status:** done

Additive on frozen `rowan-table`. Default row activation stays double-click on the row and Enter when the row is focused.

- Built-in `link` / `checkbox` / `switch` / `button` / `icon-button` cells suppress `rowan-row-activate`
- `cell.interactive: true` marks a custom cell as a hit target; `false` opts a built-in type out
- Native controls in the composed path also suppress (no `stopPropagation` in app code)
- `rowActivate: "dblclick" | "none"` (default `dblclick`). Omitted `.config` resets to `dblclick`

### Done when

- [x] Tests: control dblclick does not activate; row dblclick still does; custom interactive; `none`; config reset
- [x] README
- [x] Default activation unchanged

### Out of scope

Single-click row activate. Popover trigger modes. Hierarchical side-nav.

---

## Sprint 24 — Storybook: data-display Playground controls

**Status:** done

Playgrounds that should have Controls but currently hardcode `render: () =>`. Follow Button: `component`, `argTypes`, `args`, `render(args)`.

- KPI: `label`, `value`, `delta`, `deltaLabel`, `tone`, `loading`
- Sparkline: `label`, `tone`
- Bullet / gauge: `label`, `value`, `target` (gauge also `min` / `max`)
- Area / bar / donut / stacked-bar: `label`, `description`, `interactive`
- Source meta: `source`, `asOf` argTypes
- Image: `alt`, `href`, `fit`
- Empty state: title / body / action label as slot args
- Status indicator: add Playground with `tone`, `size`, `pulse`, `label`

### Done when

- [x] Named Playground on each host above binds Controls
- [x] Variant stories keep working (call a shared factory, not `Playground.render()` with no args)

### Out of scope

Table leftover stories, app-shell, FACE axe false positives.

---

## Sprint 25 — Storybook: Event Trace and Actions completeness

**Status:** done

`.storybook/preview.js` `ROWAN_EVENT_HANDLES` misses confirm, group-toggle, filter-change, files-*, command, bulk-action, and others. Event Trace wraps stories in an unnamed `<section>` landmark.

- Expand the listen list to every `rowan-*` user event
- Replace the unnamed `<section>` with a non-landmark or `aria-label="Event Trace"`

### Done when

- [x] Confirm / group-toggle / filter-change / files-* / command appear in Actions and Event Trace
- [x] Event Trace is not an extra unlabeled landmark

---

## Sprint 26 — Storybook: table and layout leftover knobs

**Status:** done

- Table `GroupedRows`, `InteractiveCells`, `BulletCells`, `PinnedColumns`: at least `density` / `selectable`
- Tabs Playground: initial `value`
- Calendar: `tags: ["autodocs"]` and a Playground alias (argTypes already exist)
- Card / breadcrumb / menu: skipped (no meaningful host attrs; slot-only composition)

### Out of scope

App-shell cookbook, command palette internals.

---

## Sprint 27 — Storybook a11y leftovers

**Status:** done

- FACE inner `<input>` unlabeled: axe false positive vs host `ElementInternals`. Document or suppress in the Storybook a11y config, do not thaw FACE.
- Chart Playgrounds that document keyboard must keep `interactive: true` (sprint 24).
- Breadcrumb remains a slot demo, not a `<nav>` wrapper.

### Done when

- [x] Storybook a11y disables rule `label`; README and docs explain FACE vs inner input
- [x] Chart Playgrounds keep `interactive: true` by default (sprint 24)
- [x] Breadcrumb Playground is still slotted items only

### Out of scope

Changing FACE internals, wrapping breadcrumb in a second `<nav>`.

---

## Sprint 28 — Hierarchical side-nav groups

**Status:** done

Collapsible `rowan-side-nav-section`, not a second selection model. One `value` on `rowan-side-nav`.

- `collapsible` opt-in; without it the group stays always-open
- `collapsed` defaults false (open). Controlled by the attribute/property
- User toggle emits `rowan-toggle` on the section (`{ collapsed, expanded }`)
- Arrow Left collapses the containing group; Arrow Down from the control focuses the first item
- Setting nav `value` to a child expands ancestor groups (silent)

### Done when

- [x] Default unlabeled/always-open groups unchanged
- [x] Tests: toggle does not emit nav `rowan-change`; value match expands; collapsed hides items
- [x] Story + README

### Out of scope

Stealing `rowan-tree` into the rail. Per-item open state. P2 config nav.

---

## Rowan vs admin/dashboard libraries (0.13 planning)

Position: ops dashboard design system (vanilla WC). Not a CRUD scaffold (Ant Pro / Refine) and not a spreadsheet grid (AG Grid / MUI X Premium). Closest neighbors: **Carbon** (ops chrome, multi-framework) plus a small **Tremor-like** chart/KPI kit.

| Capability                        | Rowan                                                               | Ant Design Pro                                        | MUI X                                        | Carbon                         |
| --------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------- | ------------------------------ |
| Stack                             | Vanilla WC + React wrappers                                         | React (Vue via ant-design-vue)                        | React                                        | React / Vue / Svelte / vanilla |
| App shell + side nav              | `app-layout`, collapsible sections, tone/count                      | ProLayout                                             | Drawer + AppBar (compose)                    | UI Shell                       |
| KPI + sparkline                   | Frozen hosts                                                        | ChartCard / Statistic                                 | Compose Charts                               | Compose Carbon Charts          |
| Ops charts                        | Native SVG trend/bar/area/donut/stacked/bullet/gauge                | G2 / BizCharts suite                                  | MUI Charts (some paid)                       | ~26 chart types                |
| Matching data table on charts     | Yes                                                                 | Unusual                                               | Unusual                                      | Unusual                        |
| Provenance                        | `source-meta`                                                       | Copy                                                  | DIY                                          | DIY                            |
| Operational table                 | Sort, page, select, sticky, groupBy, virtualize, bulk, bullet cells | **ProTable** (`request`, search form, column manager) | Community grid; grouping/virtualize **paid** | Toolbar, batch, expand         |
| Filters                           | Flat AND builder + `applyFilters` + session module                  | QueryFilter / in ProTable                             | Column filters                               | Toolbar filter                 |
| Hosts fetch data                  | **No**                                                              | ProTable `request`                                    | Partial / Pro                                | No                             |
| Excel / CSV                       | CSV module (app download); no Excel                                 | Common                                                | CSV free; Excel Premium                      | App                            |
| Pivot / tree table / range select | **No**                                                              | Tree in Table                                         | Pro / Premium                                | Not a pivot                    |
| Chart↔grid brushing               | Session module only                                                 | App                                                   | Premium integration                          | App                            |
| FACE forms                        | Strong                                                              | ProForm                                               | Strong                                       | Strong                         |
| Auth / CRUD pages                 | Out of library                                                      | Pro scaffold                                          | Templates                                    | IBM Cloud patterns             |
| Maps                              | `@rowan-ui/maplibre`                                                | Often AntV L7                                         | DIY                                          | Carbon maps                    |

**Do not chase:** ProTable `request`, Excel, pivot, Chart.js type catalogs, hover-link bus. Those blow freeze and “hosts do not fetch.”

---

## 0.13 in / out

### In

- **CSV as a module** (same shape as `applyFilters`): `createTableCsv(columns, rows)` in `@rowan-ui/core/table-csv` or similar. App triggers download. No new table events, no fetch, no Excel.
- **Column visibility**, additive on frozen table: `column.hidden` (and optional toolbar control on `rowan-table-toolbar`). Unknown keys stay ignored.
- **Column-visibility helper** optional: `visibleColumns(columns, hiddenIds)` if toolbar needs a pure function.

### Out (this track)

- ProTable-style `request` / built-in data source
- Excel `.xlsx`, clipboard range, fill handle, pivot
- Tree table, nested filter OR groups
- Hover-link bus / chart–grid brushing as a host
- KPI `thresholdState` / `trendDirection` / `freshnessTimestamp` (use `tone`, `delta`, `source-meta`)
- Filled Lucide catalog
- Filter session as a custom-element provider
- Heatmap / funnel / scatter (combo/Pareto shipped as experimental `rowan-combo-chart`)
- Vue/Svelte wrappers, table column virtualization, rich-text images-in-document

### 0.13 done when

- [x] CSV module + tests + README (app owns the `<a download>`)
- [x] `column.hidden` + toolbar show/hide; omitted `.config` resets hidden
- [x] No thaw of table `columns` / `rows` names; no new fetch API

---

## Later / not this track

- Nested filter groups / OR.
- Rich-text images (not document nodes). Image display host with overlay/caption/link.
- Table column virtualization.
- Vue/Svelte wrappers.
- KPI `thresholdState` / `trendDirection` (use `tone` and `delta`).
- Filled Lucide catalog.
- Cross-filter as a custom-element provider.
- Excel, pivot, tree table, ProTable `request`, hover-link bus.
