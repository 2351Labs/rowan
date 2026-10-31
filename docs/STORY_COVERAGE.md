# Storybook coverage

Every category is enforced by `scripts/check-story-coverage.mjs`. A missing attribute, enum value, slot, or event fails CI.

## Charts and data viz

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-area-chart` | 41% | 100% | — |
| `rowan-bar-chart` | 50% | 100% | — |
| `rowan-box-plot-chart` | 45% | 100% | — |
| `rowan-bullet-chart` | 65% | 100% | — |
| `rowan-column-sparkline` | 75% | 100% | — |
| `rowan-combo-chart` | 50% | 100% | — |
| `rowan-donut-chart` | 45% | 100% | — |
| `rowan-funnel-chart` | 55% | 100% | — |
| `rowan-gauge-chart` | 45% | 100% | — |
| `rowan-heatmap-chart` | 50% | 100% | — |
| `rowan-kpi-card` | 58% | 100% | — |
| `rowan-radar-chart` | 50% | 100% | — |
| `rowan-range-chart` | 52% | 100% | — |
| `rowan-scatter-chart` | 44% | 100% | — |
| `rowan-sparkline` | 74% | 100% | — |
| `rowan-stacked-area-chart` | 45% | 100% | — |
| `rowan-stacked-bar-chart` | 51% | 100% | — |
| `rowan-trend-chart` | 42% | 100% | — |
| `rowan-waterfall-chart` | 46% | 100% | — |

Before is the story file on `origin/main`, without shared fixture galleries.
After includes `stories/chart-galleries.js` plus the story file.
Allowlisted inherited fields: `internals`, `form`, `validity`, `validationMessage`, `willValidate`, `externalLabelText`, and form-associated `labels` where it is not the category `string[]`.
Charts do not ship a `loading` attribute except `rowan-kpi-card`. Failed loads use the error story (`Unable to load chart data`) and an empty data set.

## Navigation & Layout

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-accordion` | 100% | 100% | — |
| `rowan-app-layout` | 100% | 100% | — |
| `rowan-breadcrumb` | 100% | 100% | — |
| `rowan-carousel` | 100% | 100% | — |
| `rowan-divider` | 100% | 100% | — |
| `rowan-pagination` | 100% | 100% | — |
| `rowan-side-nav` | 100% | 100% | — |
| `rowan-side-nav-item` | 100% | 100% | — |
| `rowan-side-nav-section` | 100% | 100% | — |
| `rowan-split-pane` | 100% | 100% | — |
| `rowan-tab` | 100% | 100% | — |
| `rowan-tab-panel` | 100% | 100% | — |
| `rowan-tabs` | 100% | 100% | — |
| `rowan-tree` | 100% | 100% | — |
| `rowan-tree-item` | 100% | 100% | — |

## Actions & Feedback

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-alert` | 100% | 100% | — |
| `rowan-badge` | 100% | 100% | — |
| `rowan-button` | 100% | 100% | — |
| `rowan-chip` | 100% | 100% | — |
| `rowan-data-state` | 100% | 100% | — |
| `rowan-empty-state` | 100% | 100% | — |
| `rowan-icon-button` | 100% | 100% | — |
| `rowan-link` | 100% | 100% | — |
| `rowan-progress` | 100% | 100% | — |
| `rowan-skeleton` | 100% | 100% | — |
| `rowan-spinner` | 100% | 100% | — |
| `rowan-status-indicator` | 100% | 100% | — |
| `rowan-toast` | 100% | 100% | — |
| `rowan-toaster` | 100% | 100% | — |

## Data Display

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-avatar` | 100% | 100% | — |
| `rowan-bulk-actions-bar` | 100% | 100% | — |
| `rowan-card` | 100% | 100% | — |
| `rowan-filter-builder` | 100% | 100% | — |
| `rowan-image` | 100% | 100% | — |
| `rowan-row-details-panel` | 100% | 100% | — |
| `rowan-source-meta` | 100% | 100% | — |
| `rowan-table` | 87% | 100% | — |
| `rowan-table-toolbar` | 100% | 100% | — |
| `rowan-virtual-list` | 100% | 100% | — |

## Forms & Input

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-calendar` | 100% | 100% | — |
| `rowan-checkbox` | 100% | 100% | — |
| `rowan-color-picker` | 100% | 100% | — |
| `rowan-combobox` | 100% | 100% | — |
| `rowan-date-picker` | 100% | 100% | — |
| `rowan-date-range-picker` | 100% | 100% | — |
| `rowan-form-field` | 100% | 100% | — |
| `rowan-form-layout` | 100% | 100% | — |
| `rowan-form-wizard` | 100% | 100% | — |
| `rowan-listbox` | 100% | 100% | — |
| `rowan-multi-select-combobox` | 100% | 100% | — |
| `rowan-number-field` | 100% | 100% | — |
| `rowan-option` | 100% | 100% | — |
| `rowan-radio` | 100% | 100% | — |
| `rowan-radio-group` | 100% | 100% | — |
| `rowan-rating` | 100% | 100% | — |
| `rowan-rich-text-editor` | 100% | 100% | — |
| `rowan-segmented-control` | 100% | 100% | — |
| `rowan-select` | 100% | 100% | — |
| `rowan-slider` | 100% | 100% | — |
| `rowan-switch` | 100% | 100% | — |
| `rowan-text-field` | 100% | 100% | — |
| `rowan-textarea` | 100% | 100% | — |
| `rowan-time-picker` | 100% | 100% | — |
| `rowan-validation-summary` | 100% | 100% | — |

## Overlays & Menus

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-command-item` | 100% | 100% | — |
| `rowan-command-palette` | 100% | 100% | — |
| `rowan-confirm-dialog` | 100% | 100% | — |
| `rowan-context-menu` | 100% | 100% | — |
| `rowan-dialog` | 100% | 100% | — |
| `rowan-drawer` | 100% | 100% | — |
| `rowan-dropdown` | 100% | 100% | — |
| `rowan-menu` | 100% | 100% | — |
| `rowan-menu-item` | 100% | 100% | — |
| `rowan-popover` | 100% | 100% | — |
| `rowan-tooltip` | 100% | 100% | — |

## Files & Uploads

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-dropzone` | 100% | 100% | — |
| `rowan-file-item` | 100% | 100% | — |
| `rowan-file-upload` | 100% | 100% | — |

## Other

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-stepper` | 100% | 100% | — |

Non-chart scores count public attributes, enum values, slots, and events from `custom-elements.json`. Before is `origin/main`. After is the story file on this branch.
