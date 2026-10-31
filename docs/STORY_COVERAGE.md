# Storybook coverage

Charts, Forms & Input, and Data Display are enforced by `scripts/check-story-coverage.mjs`.
Other categories are report-only until their story PRs land.
The check fails for every category only once each one is at 100%.

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
| `rowan-accordion` | 80% | 80% | slot summary |
| `rowan-app-layout` | 83% | 83% | attribute navigation-label |
| `rowan-breadcrumb` | 100% | 100% | — |
| `rowan-carousel` | 100% | 100% | — |
| `rowan-divider` | 100% | 100% | — |
| `rowan-pagination` | 75% | 75% | slot default |
| `rowan-side-nav` | 100% | 100% | — |
| `rowan-side-nav-item` | 79% | 79% | attribute value, attribute target, attribute tabindex, slot prefix |
| `rowan-side-nav-section` | 100% | 100% | — |
| `rowan-split-pane` | 85% | 85% | attribute snap-threshold, attribute locale |
| `rowan-tab` | 60% | 60% | attribute aria-controls, attribute aria-selected |
| `rowan-tab-panel` | 60% | 60% | attribute aria-hidden, attribute aria-labelledby |
| `rowan-tabs` | 100% | 100% | — |
| `rowan-tree` | 100% | 100% | — |
| `rowan-tree-item` | 44% | 44% | attribute selected, attribute disabled, attribute level, attribute tabindex, slot prefix |

## Actions & Feedback

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-alert` | 100% | 100% | — |
| `rowan-badge` | 100% | 100% | — |
| `rowan-button` | 71% | 71% | attribute type, enum type=button, enum type=submit, enum type=reset, attribute aria-expanded, attribute aria-haspopup |
| `rowan-chip` | 83% | 83% | slot prefix, slot suffix |
| `rowan-data-state` | 100% | 100% | — |
| `rowan-empty-state` | 100% | 100% | — |
| `rowan-icon-button` | 67% | 67% | attribute type, enum type=button, enum type=submit, enum type=reset, attribute aria-expanded, attribute aria-haspopup, attribute aria-controls |
| `rowan-link` | 100% | 100% | — |
| `rowan-progress` | 80% | 80% | attribute locale |
| `rowan-skeleton` | 100% | 100% | — |
| `rowan-spinner` | 100% | 100% | — |
| `rowan-status-indicator` | 100% | 100% | — |
| `rowan-toast` | 100% | 100% | — |
| `rowan-toaster` | 100% | 100% | — |

## Data Display

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-avatar` | 88% | 100% | — |
| `rowan-bulk-actions-bar` | 60% | 100% | — |
| `rowan-card` | 67% | 100% | — |
| `rowan-filter-builder` | 50% | 100% | — |
| `rowan-image` | 75% | 100% | — |
| `rowan-row-details-panel` | 65% | 100% | — |
| `rowan-source-meta` | 50% | 100% | — |
| `rowan-table` | 78% | 100% | — |
| `rowan-table-toolbar` | 75% | 100% | — |
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
| `rowan-command-item` | 50% | 50% | attribute keywords, attribute tabindex, slot default, slot prefix, slot description, slot shortcut |
| `rowan-command-palette` | 64% | 64% | attribute hotkey, attribute query, attribute locale, slot empty |
| `rowan-confirm-dialog` | 79% | 79% | attribute cancel-label, attribute confirm-disabled, slot actions |
| `rowan-context-menu` | 83% | 83% | attribute open |
| `rowan-dialog` | 83% | 83% | attribute alert |
| `rowan-drawer` | 100% | 100% | — |
| `rowan-dropdown` | 100% | 100% | — |
| `rowan-menu` | 100% | 100% | — |
| `rowan-menu-item` | 75% | 75% | attribute tabindex |
| `rowan-popover` | 100% | 100% | — |
| `rowan-tooltip` | 67% | 67% | attribute open |

## Files & Uploads

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-dropzone` | 86% | 86% | attribute drag-active |
| `rowan-file-item` | 86% | 86% | attribute file-id, attribute locale |
| `rowan-file-upload` | 83% | 83% | attribute required, attribute locale |

## Other

| Component | Before | After | Missing |
| --- | ---: | ---: | --- |
| `rowan-stepper` | 86% | 86% | event rowan-step-change |

Non-chart scores count public attributes, enum values, slots, and events from `custom-elements.json`. Before is `origin/main`. After is the story file on this branch.
