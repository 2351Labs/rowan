# Changelog

User-visible changes to `@rowan-ui/core`, `@rowan-ui/icons`, and `@rowan-ui/maplibre`.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Rowan versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
