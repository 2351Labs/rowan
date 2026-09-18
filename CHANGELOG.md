# Changelog

User-visible changes to `@rowan-ui/core`, `@rowan-ui/icons`, and `@rowan-ui/maplibre`.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Rowan versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Experimental `rowan-kpi-card`: labeled metric, signed delta, tone, and `chart` slot. `value` and `delta` are property-only.

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
