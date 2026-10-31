# Storybook coverage

Chart and KPI components are enforced by `scripts/check-story-coverage.mjs`.
Other categories are report-only until their story PRs land.

## Charts and data viz

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-area-chart` | 31% | 100% | — |
| `rowan-bar-chart` | 41% | 100% | — |
| `rowan-box-plot-chart` | 34% | 100% | — |
| `rowan-bullet-chart` | 56% | 100% | — |
| `rowan-column-sparkline` | 68% | 100% | — |
| `rowan-combo-chart` | 40% | 100% | — |
| `rowan-donut-chart` | 33% | 100% | — |
| `rowan-funnel-chart` | 48% | 100% | — |
| `rowan-gauge-chart` | 38% | 100% | — |
| `rowan-heatmap-chart` | 43% | 100% | — |
| `rowan-kpi-card` | 53% | 100% | — |
| `rowan-radar-chart` | 44% | 100% | — |
| `rowan-range-chart` | 45% | 100% | — |
| `rowan-scatter-chart` | 36% | 100% | — |
| `rowan-sparkline` | 67% | 100% | — |
| `rowan-stacked-area-chart` | 40% | 100% | — |
| `rowan-stacked-bar-chart` | 47% | 100% | — |
| `rowan-trend-chart` | 30% | 100% | — |
| `rowan-waterfall-chart` | 38% | 100% | — |

Before is the story file on `origin/main`, without shared fixture galleries.
After includes `stories/chart-galleries.js` plus the story file.
Allowlisted inherited fields: `internals`, `form`, `validity`, `validationMessage`, `willValidate`, `externalLabelText`, and form-associated `labels` where it is not the category `string[]`.
Charts do not ship a `loading` attribute except `rowan-kpi-card`. Failed loads use the error story (`Unable to load chart data`) and an empty data set.

## Other components (report only)

| Component | Public fields | Slots | Events |
| --- | ---: | ---: | ---: |
| `rowan-accordion` | 2 | 2 | 1 |
| `rowan-alert` | 3 | 1 | 1 |
| `rowan-app-layout` | 3 | 3 | 1 |
| `rowan-avatar` | 6 | 0 | 0 |
| `rowan-badge` | 2 | 1 | 0 |
| `rowan-breadcrumb` | 1 | 1 | 0 |
| `rowan-bulk-actions-bar` | 11 | 3 | 2 |
| `rowan-button` | 5 | 3 | 1 |
| `rowan-calendar` | 16 | 0 | 1 |
| `rowan-card` | 0 | 6 | 0 |
| `rowan-carousel` | 3 | 1 | 1 |
| `rowan-checkbox` | 7 | 1 | 1 |
| `rowan-chip` | 2 | 3 | 0 |
| `rowan-color-picker` | 9 | 2 | 1 |
| `rowan-combobox` | 10 | 0 | 1 |
| `rowan-command-item` | 8 | 4 | 0 |
| `rowan-command-palette` | 8 | 2 | 2 |
| `rowan-confirm-dialog` | 7 | 3 | 3 |
| `rowan-context-menu` | 5 | 1 | 2 |
| `rowan-data-state` | 2 | 5 | 0 |
| `rowan-date-picker` | 8 | 0 | 1 |
| `rowan-date-range-picker` | 13 | 0 | 1 |
| `rowan-dialog` | 3 | 3 | 1 |
| `rowan-divider` | 1 | 0 | 0 |
| `rowan-drawer` | 3 | 2 | 1 |
| `rowan-dropdown` | 2 | 2 | 1 |
| `rowan-dropzone` | 7 | 0 | 1 |
| `rowan-empty-state` | 0 | 4 | 0 |
| `rowan-file-item` | 8 | 0 | 3 |
| `rowan-file-upload` | 10 | 0 | 4 |
| `rowan-filter-builder` | 10 | 1 | 1 |
| `rowan-form-field` | 9 | 6 | 0 |
| `rowan-form-layout` | 5 | 1 | 0 |
| `rowan-form-wizard` | 9 | 2 | 3 |
| `rowan-icon-button` | 6 | 1 | 1 |
| `rowan-image` | 5 | 3 | 0 |
| `rowan-link` | 4 | 1 | 1 |
| `rowan-listbox` | 8 | 1 | 1 |
| `rowan-menu` | 0 | 1 | 1 |
| `rowan-menu-item` | 2 | 1 | 0 |
| `rowan-multi-select-combobox` | 12 | 0 | 1 |
| `rowan-number-field` | 11 | 0 | 1 |
| `rowan-option` | 4 | 3 | 0 |
| `rowan-pagination` | 3 | 1 | 1 |
| `rowan-popover` | 4 | 2 | 1 |
| `rowan-progress` | 6 | 0 | 0 |
| `rowan-radio` | 6 | 1 | 1 |
| `rowan-radio-group` | 4 | 1 | 1 |
| `rowan-rating` | 12 | 2 | 1 |
| `rowan-rich-text-editor` | 11 | 2 | 1 |
| `rowan-row-details-panel` | 13 | 5 | 2 |
| `rowan-segmented-control` | 8 | 0 | 1 |
| `rowan-select` | 7 | 0 | 1 |
| `rowan-side-nav` | 3 | 1 | 1 |
| `rowan-side-nav-item` | 10 | 3 | 0 |
| `rowan-side-nav-section` | 4 | 1 | 1 |
| `rowan-skeleton` | 4 | 0 | 0 |
| `rowan-slider` | 17 | 0 | 1 |
| `rowan-source-meta` | 3 | 2 | 0 |
| `rowan-spinner` | 3 | 0 | 0 |
| `rowan-split-pane` | 10 | 2 | 1 |
| `rowan-status-indicator` | 4 | 1 | 0 |
| `rowan-stepper` | 5 | 0 | 1 |
| `rowan-switch` | 6 | 1 | 1 |
| `rowan-tab` | 2 | 1 | 0 |
| `rowan-tab-panel` | 2 | 1 | 0 |
| `rowan-table` | 24 | 4 | 10 |
| `rowan-table-toolbar` | 9 | 4 | 0 |
| `rowan-tabs` | 1 | 1 | 1 |
| `rowan-text-field` | 10 | 0 | 1 |
| `rowan-textarea` | 8 | 0 | 1 |
| `rowan-time-picker` | 9 | 0 | 1 |
| `rowan-toast` | 3 | 3 | 1 |
| `rowan-toaster` | 3 | 0 | 2 |
| `rowan-tooltip` | 2 | 1 | 0 |
| `rowan-tree` | 4 | 1 | 2 |
| `rowan-tree-item` | 6 | 3 | 0 |
| `rowan-validation-summary` | 5 | 2 | 1 |
| `rowan-virtual-list` | 5 | 0 | 0 |
