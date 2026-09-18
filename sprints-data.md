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

**Status.** Sprint 7 done. Next: Sprint 8 (catalog and release notes). Wrappers track remains in `sprints.md`.

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

Collaboration, markdown import, headings/links/images, a sanitizing HTML setter.

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

**Status:** pending

Close the loop so `0.5` docs match the freeze and the new experimental set.

### Done when

- [ ] README API stability table:

  | Surface                                | Status       |
  | -------------------------------------- | ------------ |
  | Table virtualization                   | Stable       |
  | `rowan-rich-text-editor`               | Stable       |
  | `rowan-filter-builder`                 | Stable       |
  | `rowan-trend-chart`                    | Stable       |
  | `rowan-kpi-card`                       | Experimental |
  | Compact sparkline (name from Sprint 6) | Experimental |
  | `rowan-bar-chart`, `rowan-donut-chart` | Experimental |

- [ ] Home, docs site, CHANGELOG Unreleased: four promoted; three new experimental hosts.
- [ ] `npm run analyze` + generated wrappers committed. CI generated-artifacts green.
- [ ] Package version: **do not** call this `1.0`. Promoting the four is a minor (`0.6.0` or `0.5.1` per how breaking the freezes were — prefer `0.6.0` if any frozen shape was narrowed). Experimental hosts may change without a major.

### Out of scope

npm publish (separate release cut), Vue/Svelte, MapLibre changes.

---

## Later / not this track

- Nested filter groups / OR.
- Rich-text headings, links, images.
- Table column virtualization.
- More geometries (area-as-separate-host, stacked bar).
- Dropping `useRowanElement`.
- Vue/Svelte wrappers.
