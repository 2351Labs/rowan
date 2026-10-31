# Changelog

User-visible changes to `@rowan-ui/core`, `@rowan-ui/icons`, and `@rowan-ui/maplibre`.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Rowan versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- `rowan-table` column menu and multi-sort: each header opens a top-layer menu (mouse, keyboard, and screen reader) for sort ascending, sort descending, add to sort, clear, hide, pin start or end, autosize, and reset width. Shift+click adds a sort key and shows its priority. `sort` accepts one `{ id, dir }` or an ordered array. `rowan-sort-change` reports the full model. A `filterable` column updates `filters` and fires cancelable `rowan-column-filter`. Menu labels use `table.messages`. The menu loads on first open. Client sorts are stable across the ordered keys.
- `rowan-table` paste: Ctrl/Cmd+V and `pasteText(text)` paste TSV onto the focused editable cell. Blocks fill editable visible columns and following rows. A single value can fill the selected rows. Values pass `required`, `validate`, `rowan-edit-validate`, and `rowan-edit-commit`. Cancelable `rowan-paste`, then `rowan-paste-result`. Rejected cells keep the editor error. Server mode and paging only change loaded rows; extra rows are ignored. The paste module loads on first use.
- `rowan-table` clipboard and export: Ctrl/Cmd+C copies selected rows, or the focused cell, as TSV and an HTML table. `copyToClipboard`, `exportCsv`, and `exportExcel` honor visible column order, hidden columns, formatters, and header options. CSV escaping and formula-injection guards are on by default. Excel is a real `.xlsx` file and loads with the export module on first use. Cancelable `rowan-copy` and `rowan-export`. In server mode the loaded page is exported unless `getRows` supplies rows. Paste is deferred.
- `rowan-table` server data: `data-mode="server"` and `dataSource.getRows({ page, pageSize, sort, filters, signal })` return `{ rows, total }`. Paging, sorting, and debounced filters are requested from the source. Stale reads are aborted and ignored. Loading, empty, and error/retry states are announced and localizable. Cancelable `rowan-data-request`, plus `rowan-data-load` and `rowan-data-error`. Selection ids survive page changes; select-all applies to the current page. The fetch controller loads on first use.
- `rowan-table` inline editing validation (Phase 3): `column.required` and `column.validate(value, row)`. A cancelable `rowan-edit-validate` event fires before commit, separate from the commit events, so a rejected value never reaches a commit listener. Invalid cells stay in edit mode with `aria-invalid` and an `aria-describedby` error. Row mode does not commit until every cell is valid. Text, number, and the rest of the editing implementation load on first edit.
- `rowan-table` inline cell editing (Phase 2): adds select, date, checkbox, and custom editor types. Select editor requires `options: [{value, label}]`. Date editor uses `rowan-date-picker`. Checkbox editor for boolean values. Custom editor allows `editor.render(context)` returning an HTMLElement with `context.commit()` and `context.cancel()` methods. All editors are lazily loaded via dynamic import on first use, keeping base table bundle size unchanged.
- `rowan-table` row edit mode: when `edit-mode="row"`, Enter/F2 edits all editable cells in the row at once. Tab navigates between cells, Enter commits all changes (emits one `rowan-row-edit-commit` event with `values` and `oldValues`), Esc cancels the row (emits `rowan-row-edit-cancel`). Cell mode behavior unchanged.
- `rowan-table` inline cell editing (Phase 1): opt-in per-column with `column.editable` (boolean or function). Text and number editors included. Enter/F2 to edit, Esc to cancel, Enter/Tab to commit and move. Number editor supports `min`, `max`, `step` via `column.editor`. Emits cancelable `rowan-edit-start`, `rowan-edit-commit`, `rowan-edit-cancel` events for persistence/rollback. ARIA editing semantics, RTL support, works with virtualization/sorting/grouping/frozen columns/resize/reorder.
- `rowan-table` column resizing: opt-in `resizable-columns` attribute enables drag handles on header edges with mouse/touch interaction, keyboard resizing via Arrow keys (with Shift for larger increments), double-click to auto-fit column width, and min/max width constraints. Emits `rowan-column-resize` event. Integrated with `table-view-state` for persistence.
- `rowan-table` column reordering: opt-in `reorderable-columns` attribute enables drag-and-drop of headers and keyboard reordering via Alt+Arrow Left/Right. Respects frozen/pinned columns. Emits `rowan-column-reorder` event. Integrated with `table-view-state` for persistence.
- `table-view-state` now includes `columnWidths` (map of column ID to width string) and `columnOrder` (array of column IDs) for restoring user-customized table layouts.

### Changed

- Server `dataSource.getRows({ sort })` receives an ordered array of `{ id, dir }`, or null when nothing is sorted. The `sort` property still returns a single `{ id, dir }` when only one key is active. Saved table views keep that same shape: one key stays an object, and two or more keys stay an ordered array.

### Fixed

- `rowan-context-menu` re-clamps the panel when the stylesheet loads or the panel size changes while open. No placement attribute.
- `rowan-table-toolbar` now has `role="toolbar"` with `aria-label` for proper screen reader navigation.

## 0.22.0 - 2026-10-20

### Changed

- Getting-started docs pin `@rowan-ui/core@0.22.0`. First screen stays `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.
- Promote `rowan-column-sparkline` to Stable. Nested filter groups and table-view-state version `2` stay experimental. This is not `1.0`.

### Fixed

- `rowan-dropdown` and `rowan-popover` re-clamp the panel when the stylesheet loads or the panel size changes while open. No placement attribute.
- `rowan-column-sparkline` keeps columns and nearest-column hover in time order (LTR) inside an RTL host. Nested theme and vibrant fills follow the nested surface.

## 0.21.1 - 2026-10-19

### Changed

- Getting-started docs pin `@rowan-ui/core@0.21.1`. First screen stays `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.

### Fixed

- `rowan-popover` flips the panel to the trigger end when it would overflow the viewport, matching `rowan-dropdown`. No placement attribute.

## 0.21.0 - 2026-10-19

### Added

- `rowan-sparkline` additive `variant="area"` fills under the stroke. With `target`, the fill splits at the target like the stroke. Default `line` is omitted. Not a density of `rowan-area-chart`.
- Experimental `rowan-column-sparkline`: compact one-series columns for KPI tiles. Property-only `values` / `labels` / `target`. Null is a gap. Not a density of `rowan-bar-chart` and not a `variant` of `rowan-sparkline`. Not frozen.

### Changed

- Getting-started docs pin `@rowan-ui/core@0.21.0`. First screen stays `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.
- KPI Card Compact charts story adds experimental `rowan-column-sparkline` next to sparkline, sparkline versus target, bullet, and gauge. Not a KPI type menu.
- Workflows/Dashboard overview KPI row composes area sparkline, column sparkline, bullet, and gauge. Orders is counts by period, not sparkline versus plan.
- `rowan-kpi-card` places a slotted `rowan-gauge-chart` immediately beside the metrics except below 10rem. Sparkline, column sparkline, and bullet stay under the value. Does not change chart kind.

### Fixed

- `rowan-sparkline` hover mark and target dashes stay CSS pixels when the plot scales, matching the stroke. The hover mark is not a viewBox circle.

## 0.20.0 - 2026-10-18

### Added

- `rowan-sparkline` property-only `target`. When set, the stroke uses `above-tone` / `below-tone` (default `warning` / `success`) on each side of a dashed target line. The domain includes the target. Hover and the matching table include the target value. Not an overlay and not a density of `rowan-trend-chart`.

### Changed

- Getting-started docs pin `@rowan-ui/core@0.20.0`. First screen stays `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.
- Promote `rowan-combo-chart`, `rowan-scatter-chart`, `rowan-heatmap-chart`, `rowan-funnel-chart`, `rowan-waterfall-chart`, `rowan-range-chart`, `rowan-box-plot-chart`, and `rowan-radar-chart` to Stable. Nested filter groups and table-view-state version `2` stay experimental. This is not `1.0`.
- `rowan-kpi-card` is an inline-size container. Compact below 10rem, roomy from 22rem: padding, value `clamp`, and slotted sparkline/bullet/gauge height. Default `min-inline-size` is `8rem`. Does not change chart kind or reformat the value. `--rowan-kpi-card-value-size` and `--rowan-kpi-card-chart-height` still pin a fixed scale. Without an icon, the body fills the tile so slotted charts stretch instead of sitting in the leftover auto column.
- `rowan-sparkline` and `rowan-bullet-chart` plots fill their box (`preserveAspectRatio="none"`). Gauge keeps aspect ratio. Stroke width stays CSS pixels.
- Workflows/Dashboard overview KPI row composes sparkline, sparkline versus target, bullet, and gauge. Not a KPI type menu.

### Fixed

- `rowan-kpi-card` slotted `display: block` does not override a chart with `hidden`.

## 0.19.0 - 2026-10-14

### Added

- `rowan-filter-builder` additive `appearance`: `panel` (default, always-open rows) or `toolbar` (chips on the bar, field/operator/value in `rowan-popover`). Frozen filters stay the top-level AND list. Chip remove is a user action and emits `rowan-filter-change`. Nested groups stay experimental and render as one chip. Recipes opt in; the table toolbar wraps only `panel` builders.
- `applyQuickFind(rows, query, keys?)` in `@rowan-ui/core/table-quick-find`. Host-owned text search; not a filter type and not table-view-state. Empty query returns a copy of rows. Case-insensitive contains on string, number, and boolean cells. Nested objects are skipped.

### Changed

- Getting-started docs pin `@rowan-ui/core@0.19.0`. First screen stays `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.
- Investigation queue and saved table view set `appearance="toolbar"` so filters sit as chips beside the view title. A `panel` builder in the toolbar default slot still wraps to a full second row.
- Table headers drop the 5% tint when a toolbar is present so the toolbar is the loud chrome. Standalone tables keep the tinted header band. Sticky headers still cover scrolling rows with the opaque table background.
- `rowan-table-toolbar` `column-picker` is a `rowan-dropdown` instead of native `details`.
- Investigation queue and saved table view add a `rowan-text-field type="search"` on the toolbar and compose `applyFilters(applyQuickFind(...), filters, fields)` in the host.

### Fixed

- Toolbar chip editor restores focus to the field, operator, or value that committed the change, instead of jumping back to the field selector.
- Toolbar chip trigger accessible name uses the full chip label, including operator and value.
- Internal `rowan-popover` `rowan-change` no longer leaks from `rowan-filter-builder`. Consumers still receive `rowan-filter-change`.
- `rowan-dropdown` with non-menu panel content (column-picker checkboxes) moves focus into the panel and tabs through it; menu content still closes on Tab. The panel flips to the trigger end when it would overflow the viewport. Column picker reuses checkbox rows so toggling a column does not steal focus.

## 0.18.0 - 2026-10-13

### Added

- Experimental nested filter groups: `{ id, join: "and" | "or", filters }` inside the frozen top-level AND list. Frozen leaves stay `{ id, field, operator, value }`. `applyFilters`, `cloneFilterNode`, and `isFilterGroup` walk the tree. Empty AND groups match all rows; empty OR groups match none.
- `table-view-state` round-trips groups as version `2`. Flat snapshots stay version `1`. The schema is not frozen beyond `version`.
- Nested `[data-theme]` re-declares every component token that aliases another Rowan token, generated by `npm run tokens:sync`. Theme files no longer need a hand-maintained alias copy for new component tokens.
- Generated `messages` key inventory on the localization docs page. Constraint copy stays on `@rowan-ui/core/validity-messages`.

### Changed

- Getting-started docs pin `@rowan-ui/core@0.18.0` and show a first screen of `rowan-app-layout`, `rowan-table`, `rowan-filter-builder`, and `rowan-data-state`. Hosts still do not fetch.
- Experimental `rowan-funnel-chart` uses the shared overlay keyboard, alignment, and reconnect fixture.
- Stable `rowan-trend-chart`, `rowan-area-chart`, `rowan-stacked-area-chart`, and `rowan-stacked-bar-chart` use the shared overlay keyboard, alignment, and reconnect fixture. `rowan-donut-chart` uses the shared keyboard and reconnect fixture; its button list is not a physical overlay.
- Graduation-gate reconnect coverage for table, forms, overlays, app-layout, sparkline, and related first-screen hosts.
- `rowan-sparkline` stroke uses `vector-effect: non-scaling-stroke`. `--rowan-sparkline-stroke-width` is CSS pixels at any plot size. `--rowan-sparkline-height` sizes the plot. Hover dots still scale with the viewBox.
- Table toolbar slot shares one chrome with the table: no gap, no nested radius, toolbar as the top edge. `rowan-filter-builder`, `rowan-table-toolbar`, and `rowan-bulk-actions-bar` in that slot drop their own card. Title and bulk actions share one row; “N selected” is status text, not a nested chip. A filter-builder in the toolbar default slot wraps to a full second row. When the toolbar names the view, set `caption-visually-hidden` so the caption stays for assistive technology without a second title.

### Fixed

- `rowan-popover` and `rowan-tooltip` keep `open` when reconnected. Disconnect-driven `focusout` and `mouseleave` no longer count as user dismiss.

## 0.17.0 - 2026-10-08

### Added

- Property-only `messages` maps on hosts that generate copy. Locale is `locale`, then inherited `lang`, then the browser locale, then `en-US`. The application owns translations. There is no global i18n provider.
- `@rowan-ui/core/tokens.json`: DTCG-shaped token artifact generated from `src/tokens/tokens.css`. CSS remains the runtime source of truth.
- `@rowan-ui/core/table-view-state`: `normalizeTableViewState`, `mergeTableViewState`, `serializeTableViewState`, and `restoreTableViewState` for sort, page, filters, visible columns, density, and groupBy. The application owns URL, storage, and fetch. Filters stay the frozen flat AND list.
- Documented workflow recipes (investigation queue, resource list, record editor, dashboard drill-down, saved table view). Compositions of existing hosts; not new tags.

### Changed

- Horizontal keyboard follows logical inline direction under `dir="rtl"`. Interactive chart overlays stay physical LTR (`direction: ltr` and `dir="ltr"` on `.point-controls`) so `--point-x` matches the SVG viewBox. Donut's button list is not an overlay and is unchanged.
- Experimental range, box-plot, and scatter `valueFormatter` callbacks receive host-specific series and point context instead of categorical `{ value, label }` points. Heatmap types accept `{ x, y, value }` and `{ row, column, value }`. Experimental scatter, heatmap, funnel, waterfall, range, box-plot, radar, and combo stay experimental.

### Fixed

- Nested shipped themes re-declare `rowan-status-indicator` color tokens so the label follows the nested foreground.
- Chart hover hide stays registered across reconnects (`addCleanup(fn, { persist: true })`). Overlay keyboard focus restores to the active point after a rerender when that control still exists.
- Chart numeric normalizers treat blank and whitespace-only strings as no-data. `"0"` stays zero. Histogram samples and explicit bin edges follow the same rule.
- Range points require `low <= high`. Box plots require `min <= q1 <= median <= q3 <= max`. Unordered summaries are no-data; bounds are not swapped.
- Generated chart labels keep provenance through `config` clones, so a translated fallback such as `Point 1` does not become authored copy. Later author edits stay authoritative.

## 0.16.0 - 2026-10-01

### Added

- `slate` and `midnight` themes (`@rowan-ui/core/tokens/slate`, `@rowan-ui/core/tokens/midnight`): zinc palettes, teal accent, flatter buttons, Inter stack, 0.75rem large radius. Nested `[data-theme]` still re-declares component tokens.
- Storybook Workflows/Dashboard composition: `rowan-app-layout`, sectioned `rowan-side-nav`, KPI row with sparklines, area + donut charts, and a recent-orders table. Follows the toolbar theme; the header control switches `slate` / `midnight`.

### Changed

- Benchmark results regenerated on 0.15.0 (was 0.5.0).

### Fixed

- `rowan-side-nav-section` hides the disclosure trigger when the group is not collapsible. `.trigger { display: flex }` was showing the control through `[hidden]`.
- Nested `dark` and `midnight` (and the other shipped themes) re-declare `rowan-app-layout`, `rowan-side-nav-item`, button, form-wizard, table-toolbar, bulk-actions, and chart plot tokens. Storybook's inner theme wrap no longer keeps light sand chrome with washed-out nav, wizard copy, toolbars, or white area/donut plots.
- Nested `slate` / `light` / `lagoon` restore the light vibrant chart palette when they sit inside a dark Storybook wrap.
- Storybook docs canvases inset component examples. Fullscreen stories (Dashboard, Playground) stay edge-to-edge.

## 0.15.0 - 2026-09-30

### Added

- Additive chart layout flags (defaults unchanged): `rowan-bar-chart` / `rowan-stacked-bar-chart` `orientation` (`vertical` default, or `horizontal`); `rowan-stacked-bar-chart` `stack-mode` (`absolute` default, or `normalized` 0–100); `rowan-donut-chart` `variant` (`donut` default, or `pie`). Property-only `series` / `labels` / `config` stay frozen. No new tags.
- `rowan-stacked-area-chart`: positive values stack from zero as filled bands. Additive `stack-mode` (`absolute` default, or `normalized` 0–100; the table still shows raw values). Null and negatives are no-data and break that series' fill. Frozen `rowan-area-chart` stays independent fills.
- Experimental `rowan-combo-chart` `geometry: "area"` (default stays `bar`; unknown values still fall back to `bar`). Areas draw behind bars, then lines. Combo stays experimental.
- Experimental `rowan-scatter-chart`: points `{ x, y, size?, label? }`. Null x or y is no-data. Present `size` encodes bubble radius; omitted size is a scatter. Own series model — not frozen categorical `series.values`.
- Experimental `rowan-heatmap-chart`: `{ rows, columns, values[][] }` or `{ x, y, value }` / `{ row, column, value }` points. Single-hue intensity (fill-opacity). Null is empty / `No data`.
- Experimental `rowan-funnel-chart`: first series of stages. `variant` is `funnel` (default), `cone`, or `pyramid`. Does not auto-sort. Null and negatives are no-data.
- Experimental `rowan-waterfall-chart`: category + signed delta. Totals are authored `{ type: "total" }` from zero; the host does not invent them. Null is no-data.
- Experimental `rowan-range-chart`: per-category `{ low, high }`. `variant` is `bar` (default) or `area`. Null low or high is no-data. Own series model — not frozen categorical `series.values`.
- Experimental `rowan-box-plot-chart`: `{ min, q1, median, q3, max, outliers? }`. The host does not compute quartiles. Null in the five-number summary is no-data.
- Experimental `rowan-radar-chart`: frozen categorical `series` on polar axes. `geometry` is `line` (default) or `area`. Null is no-data and breaks the ring. Nightingale and radial bars are not this host.
- `createHistogramData({ values, bins })` in `@rowan-ui/core/histogram` bins samples for `rowan-bar-chart`. Nulls are omitted. Not a host.

## 0.14.1 - 2026-09-26

### Changed

- `rowan-bullet-chart` follows Stephen Few: grayscale range intensities, measure bar at ⅓ track height, target tick at 72% height, quantitative scale ticks. Additive `scale` (default true), `intent` (`higher` | `lower`), and `encoding` (`ink` default, `accent` theme hue, `status` poor→good, `tone` per-range hues). `value` / `target` / `ranges` unchanged.

## 0.14.0 - 2026-09-25

### Added

- Experimental `rowan-combo-chart`: bars and lines on one category axis, optional secondary scale. `createParetoData()` sorts counts and builds a cumulative-% line. Frozen bar and trend APIs unchanged.
- `rowan-table` column `verticalAlign`: `"start"` | `"center"` | `"end"` (top / middle / bottom). Omitted stays middle. `align` remains inline.

### Changed

- Promote `rowan-bullet-chart`, `rowan-gauge-chart`, `rowan-area-chart`, `rowan-stacked-bar-chart`, `rowan-image`, `rowan-data-state`, and `rowan-source-meta` to Stable. `referenceLines` stay on area and stacked-bar only. `data-state` stays `ready` / `loading` / `empty` / `error`. Image stays a display host, not a rich-text node.

## 0.13.0 - 2026-09-25

### Added

- `createTableCsv()` and `visibleColumns()` in `@rowan-ui/core/table-csv`. App owns download. Hidden columns are omitted unless `includeHidden`.
- `rowan-table-toolbar` `column-picker` toggles additive `column.hidden`. At least one data column stays visible.

## 0.12.0 - 2026-09-24

### Added

- `rowan-side-nav-section` `collapsible` and `collapsed`. Opt-in disclosure; default groups stay always-open. User toggle emits `rowan-toggle`. The parent nav still has one `value`.

## 0.11.0 - 2026-09-24

### Added

- `rowan-table` column `type: "bullet"` mounts `rowan-bullet-chart` from `{ value, target?, ranges? }` or a number plus shared `cell.ranges`. Virtualized rows keep the host.
- `rowan-table` interactive-cell contract: built-in action cells (and `cell.interactive`) do not emit `rowan-row-activate`. `rowActivate: "none"` disables row activation. Default stays double-click / Enter on the row.
- `rowan-popover` `trigger` is `click` (default) or `manual`. Manual disables click-to-toggle; Escape and outside pointer still dismiss. Hover stays on `rowan-tooltip`.

### Changed

- Storybook data-display Playgrounds (KPI, charts, source-meta, image, empty-state, status-indicator) bind Controls. Event Trace listens for remaining `rowan-*` user events and is labeled instead of an unnamed landmark.
- Storybook table leftover stories expose `density` / `selectable`. Tabs Playground binds `value`. Calendar has autodocs and a Playground.
- Storybook a11y skips axe rule `label` for FACE inner inputs. Accessible name stays on the host; `npm test` still audits it.

## 0.10.0 - 2026-09-23

### Added

- Chart hover readouts: bullet and gauge show actual/target (and the matching range); sparkline shows the nearest point; bar, donut, and stacked bar show the hovered mark.
- `rowan-side-nav-item` `tone`, `count`, and `count-label` for exception cues. Slotted `suffix` still wins.
- Experimental `rowan-data-state`: `ready` / `loading` / `empty` / `error` region wrapper. Retry stays the author's `actions` slot.
- `rowan-icon` `tone` (`info` / `success` / `warning` / `danger`) maps to status tokens via `currentColor`.
- `rowan-table` column `sticky: "start" | "end"` pins leading or trailing columns. The selection column is pinned start when selectable.
- `rowan-table` `groupBy` groups local rows with expand/collapse (`rowan-group-toggle`) and optional number subtotals.
- Experimental area and stacked-bar charts accept property-only `referenceLines` (`{ value, label?, tone? }`). Hover and the matching table include the overlay.
- Experimental `rowan-source-meta`: `source` and `as-of` provenance for KPI description, chart description, or table caption.
- `createDashboardFilters()` in `@rowan-ui/core/dashboard-filters`: set, clear, subscribe, snapshot, and replace. Apps wire chart and table events; hosts do not auto-subscribe.

## 0.9.0 - 2026-09-23

### Added

- Experimental `rowan-bullet-chart`: qualitative ranges, actual value, and target. Property-only data. Null is no-data.
- Experimental `rowan-gauge-chart`: speedometer with `min` / `max`, qualitative ranges, actual needle, and optional target. Null is no-data.
- Opt-in vibrant chart palette (`@rowan-ui/core/tokens/charts-vibrant` + `data-rowan-charts="vibrant"`). KPI and chart tones only; UI chrome stays on the Rowan theme.
- Storybook **Workflows / App shell**: `rowan-app-layout`, sectioned side-nav, SPA `preventDefault` on `rowan-change`, and a command palette from one destination list.
- Storybook Playground: live HTML editor for Rowan custom elements.

### Changed

- `rowan-app-layout` paints the navigation rail the full host height beside the header.
- Storybook docs and canvas sit on a white page. The sidebar stays dark. The theme toolbar still paints the story.

## 0.8.1 - 2026-09-21

### Changed

- Brand mark is `brand/rowan_icon.svg` on README, Storybook, and docs.

## 0.8.0 - 2026-09-18

### Added

- Experimental `rowan-area-chart`: filled multi-series. Null breaks the line and the fill. Same property-only data contract as the line chart.
- Experimental `rowan-stacked-bar-chart`: positive values stack from zero. Null and negatives are no-data.
- Experimental `rowan-image`: display still with optional href, overlay, caption, and fallback. Not a rich-text node.
- `rowan-rich-text-editor` headings (levels 1–3) and allowlisted link hrefs. Images stay out of the document.

### Fixed

- `rowan-area-chart` does not set a default `ariaLabel` when the author provides `aria-labelledby`.
- `rowan-stacked-bar-chart` associates its description with the plot and documents the `detail` and `summary` parts.
- Chart keyboard focus looks up point controls by dataset instead of interpolating series ids into a selector.
- Rich-text hrefs reject backslash paths and C0 controls. Heading and link styles apply on the editing surface. The link popover is named as a dialog.
- `rowan-image` keeps one image node when href changes, drops the link while fallback is showing, and uses themed image tokens.

## 0.7.0 - 2026-09-18

### Removed

- Public `useRowanElement`. Use generated wrappers for objects, arrays, and `onRowan*` events. The helper remains internal to those wrappers.

### Changed

- `rowan-kpi-card`, `rowan-sparkline`, `rowan-donut-chart`, and `rowan-bar-chart` are Stable.

## 0.6.2 - 2026-09-18

### Added

- Storybook **Workflows / Bulk confirm**: table + bulk bar + `rowan-dialog` alert for Flag and Assign driver.

### Fixed

- Storybook manager and Docs chrome use the full dark theme (not only `base: "dark"`).

## 0.6.1 - 2026-09-18

### Added

- Shipped `lagoon` and `ember` themes (`@rowan-ui/core/tokens/lagoon`, `@rowan-ui/core/tokens/ember`). Set `data-theme` to swap.
- `rowan-row-details-panel` `rowIds` queue with previous/next, `size` (`sm` | `md` | `lg`), and `show(row, rowId)` as the documented open API.
- Table cell `type: "sparkline"` for a `number[]` value and optional `tone`.
- `applyFilters(rows, filters, fields)` from `@rowan-ui/core/filter-builder`.
- Table `caption-visually-hidden` keeps a caption for assistive technology without painting it.

### Changed

- React wrappers keep chart `labels` (`string[]`) instead of dropping FACE `labels`.
- React wrappers ignore `open={false}` until the parent has passed `open={true}`, so `show()` is not clobbered.
- `rowan-table-toolbar` hides its selection count when a `rowan-bulk-actions-bar` is on the same table.
- Storybook manager chrome is dark again. Foundations/Themes is a four-palette gallery.

### Fixed

- `rowan-row-details-panel` fills the viewport so the drawer is not ~0px tall inside a `fit-content` dialog.
- Table pagination no longer paints when `page` is unset (`hidden` wins over `display: inline-flex`).
- Compact `rowan-app-layout` closed navigation does not peek over content.
- Empty table caption no longer paints a padded bar above the header.

## 0.6.0 - 2026-09-17

Catalog freeze of the former experimental four. Dashboard charts stay experimental.
Not `1.0`.

### Added

- Experimental `rowan-kpi-card`: labeled metric, signed delta, tone, and `chart` slot. `value` and `delta` are property-only.
- Experimental `rowan-sparkline`: compact one-series line for KPI tiles, with a visually hidden data table. `rowan-progress` `hide-meta` hides the percent caption.
- Experimental `rowan-bar-chart` and `rowan-donut-chart`. Shared `rowan-point-activate` detail. Donut treats negative values as no-data.

### Changed

- Table virtualization is Stable: `virtualized`, `virtualItemSize`, `virtualOverscan`, and `--rowan-table-virtual-height` will not be renamed.
- `rowan-rich-text-editor` is Stable. The document is paragraphs, ordered/unordered lists, and bold/italic/underline runs. HTML is never a value.
- `rowan-filter-builder` is Stable. Filters are a flat AND list of `{ id, field, operator, value }`. There are no nested groups.
- `rowan-trend-chart` is Stable as a small multi-series line chart. `series`, `labels`, `config`, and `valueFormatter` are frozen. Other geometries are separate hosts.

## 0.5.0 - 2026-09-17

Catalog freeze short of `1.0`. Experimental surfaces in the README are **not**
part of `0.5` until they are marked Stable. First npm publish of
`@rowan-ui/core` and `@rowan-ui/icons`. `@rowan-ui/maplibre` stays unpublished
until its own cut.

### Added

- Generated React wrappers from the public Custom Elements Manifest: `import { RowanButton } from "@rowan-ui/core/react/button"`. `onRowan*` maps to `rowan-*`. Objects stay property-only. `@rowan-ui/core/react` remains the hook and JSX types.
- `@rowan-ui/icons` published next to core: 2,098 tree-shakable SVG modules, `rowan-icon`, and `@rowan-ui/icons/react/icon`.
- `@rowan-ui/maplibre/react/map` wrapper, generated with the same pipeline.
- `rowan-side-nav-section` for labeled groups in one rail. Empty `value` clears selection. In-app `href` navigation is blocked when `rowan-change` is cancelled.
- `rowan-dropdown` accepts a `trigger` slot. Required text, textarea, and number fields do not paint `invalid` until blur, `reportValidity()`, or native form validation (`invalid` event).
- `rowan-radio-group` is form-associated: it submits the selected value, owns `required` / `valueMissing`, and restores the default on reset. Named child radios do not also submit.
- `rowan-file-upload` is form-associated: `name`, `required`, `FormData` submission of `File` objects, reset, and `valueMissing`.
- Overlay stack: dismissible layers (popover, dropdown, context-menu) share `isTopmostOverlay` with modals.
- Published packages declare `engines.node` `>=20`.
- `npm test` runs an axe WCAG A/AA audit of representative form and status widgets.
- Form constraint strings are overridable through `@rowan-ui/core/validity-messages` (`setValidityMessages`, `setValidityMessageResolver`). `setCustomValidity` still wins per control.
- `rowan-dialog` `alert` mode for confirm dialogs (`alertdialog`, hidden close, initial focus on Cancel).
- `@rowan-ui/maplibre` re-exports `RowanMapLocation`, `RowanMapLayer`, and attribution types.

### Changed

- Table `rowan-page-change` and pagination share `detail.index` (0-based) and `detail.page` (1-based).
- Table link cells navigate unless `rowan-cell-action` is cancelled.
- Password `type` is canonicalized; `type="PASSWORD"` evicts the value attribute.
- Date-only `formatDate("YYYY-MM-DD")` formats that calendar day (no west-of-UTC shift).
- Toasts defer while a modal is open, then flush when it closes.
- Dropdown, popover, and tooltip panels use the Popover API (top layer) so `overflow: hidden` ancestors do not clip them.
- Documented enum attributes on button, icon-button, chip, toast, status-indicator, toaster, skeleton, drawer, and table canonicalize like badge (unsupported values become the default; `tone=" DANGER "` becomes `danger`).
- Checkbox and radio expose one widget: the inner input. Host `role` stays unset unless the author sets it.

### Fixed

- React wrapper props keep nullable function properties (`renderItem`, `formatValue`, `valueFormatter`).
- Boolean attributes whose value is `"false"` (React 18 SSR on raw tags) are treated as unset.
- Required radio groups stay valid after a later option is selected.
- Number, date, and time fields no longer wipe in-progress input.
- Dropzone `accept` applies to drops and picker change.
- Overlay scroll-lock leaks and reconnect skips on drawer / row-details.
- `css:check` runs on Node 20 (CI).
- `setCustomValidity` is synchronous.
- Nested overlay dismiss (popover/dropdown/context-menu inside a dialog).
- Fieldset-disabled FACE hosts are not overlay first-focus.
- Impossible dates such as `2026-02-31` are rejected.
- Multi-select combobox closes on Tab; Home/End move the caret in editable comboboxes.
- Closed row-details panels leave the accessibility tree.
- Generated Storybook/docs/tmp artifacts are gitignored; npm packs omit tests and stories.
- `useRowanElement` binds listeners when the host mounts late.
- External `<label for>` added after connect names the control.
- Nested dialog/tab/switch roles collapsed to one widget each.

## 0.1.0

Initial public catalog. See README API stability: primitives, forms, overlays, and
table config/events are settled for `0.1.x`; table virtualization, rich-text-editor,
filter-builder, and trend-chart remain experimental.
