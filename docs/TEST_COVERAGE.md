# Test coverage

Line, statement, function, and branch coverage for `src/`, measured with Chromium V8 coverage while the unit tests run.

- Collect it with `npm run coverage`.
- The test runner writes `coverage/coverage-summary.json` (gitignored).
- This file is regenerated from that summary.
- CI fails when any metric drops below the floor in `scripts/coverage-floors.json`.

Firefox and WebKit still run the same tests in the browser-compatibility job. V8 coverage is collected from the Chromium unit run only.

Gap score is `weight × (uncovered lines + uncovered branches)`. Form controls and overlays weigh 3, navigation 2.5, data display 2, support code 1.5, other code 1, tables 0.5, and charts 0.4. Tables and charts stay lower priority while they are under active development.

## Overall

| Metric     | Covered |  Total | Coverage |  Floor |
| ---------- | ------: | -----: | -------: | -----: |
| lines      |  50,702 | 52,853 |   95.93% | 95.05% |
| statements |  50,702 | 52,853 |   95.93% | 95.05% |
| functions  |   3,660 |  3,963 |   92.35% | 91.31% |
| branches   |  11,186 | 12,434 |   89.96% | 88.89% |

## Largest gaps

Ranked by gap score. Use this list to choose the next behavior tests.

| Component               | Category     | Gap score |                  Lines |               Branches | Functions |
| ----------------------- | ------------ | --------: | ---------------------: | ---------------------: | --------: |
| `rich-text-editor`      | Form         |     384.0 |  95.99% (56 uncovered) |  80.59% (72 uncovered) |    97.83% |
| `filter-builder`        | Form         |     231.0 |  95.41% (68 uncovered) |   98.00% (9 uncovered) |    98.92% |
| `table`                 | Table        |     206.0 | 93.77% (306 uncovered) | 92.68% (106 uncovered) |    93.77% |
| `context-menu`          | Overlay      |     195.0 |  93.53% (33 uncovered) |  77.62% (32 uncovered) |   100.00% |
| `row-details-panel`     | Data display |     186.0 |  93.09% (59 uncovered) |  82.47% (34 uncovered) |    81.43% |
| `slider`                | Form         |     171.0 |  95.86% (28 uncovered) |  82.63% (29 uncovered) |    95.65% |
| `listbox`               | Form         |     165.0 |  95.44% (26 uncovered) |  84.07% (29 uncovered) |   100.00% |
| `date-range-picker`     | Form         |     162.0 |  94.40% (32 uncovered) |  83.58% (22 uncovered) |    97.87% |
| `multi-select-combobox` | Form         |     159.0 |  97.32% (18 uncovered) |  80.34% (35 uncovered) |    98.15% |
| `calendar`              | Form         |     156.0 |  96.50% (36 uncovered) |  94.59% (16 uncovered) |   100.00% |
| `lib`                   | Support      |     150.0 |  95.93% (76 uncovered) |  96.46% (24 uncovered) |    98.01% |
| `combobox`              | Form         |     132.0 |  95.74% (23 uncovered) |  84.67% (21 uncovered) |    97.73% |
| `popover`               | Overlay      |     117.0 |  92.35% (39 uncovered) |  100.00% (0 uncovered) |   100.00% |
| `color-picker`          | Form         |     114.0 |  97.78% (13 uncovered) |  82.64% (25 uncovered) |    97.87% |
| `file-upload`           | Form         |     111.0 |   98.91% (6 uncovered) |  76.69% (31 uncovered) |    97.78% |
| `number-field`          | Form         |     111.0 |  97.26% (16 uncovered) |  85.00% (21 uncovered) |   100.00% |
| `segmented-control`     | Form         |     111.0 |  96.70% (12 uncovered) |  78.26% (25 uncovered) |   100.00% |
| `textarea`              | Form         |     105.0 |  91.50% (29 uncovered) |   90.63% (6 uncovered) |    84.85% |
| `rating`                | Form         |     102.0 |  97.97% (12 uncovered) |  85.33% (22 uncovered) |    98.21% |
| `tree`                  | Navigation   |      97.5 |  96.87% (14 uncovered) |  83.77% (25 uncovered) |   100.00% |
| `form-wizard`           | Form         |      96.0 |  97.27% (21 uncovered) |  94.66% (11 uncovered) |   100.00% |
| `split-pane`            | Navigation   |      95.0 |  96.06% (15 uncovered) |  74.16% (23 uncovered) |    88.89% |
| `command-palette`       | Overlay      |      93.0 |   98.71% (8 uncovered) |  84.46% (23 uncovered) |    96.00% |
| `toaster`               | Overlay      |      93.0 |  97.22% (13 uncovered) |  85.94% (18 uncovered) |   100.00% |
| `date-picker`           | Form         |      90.0 |  92.04% (27 uncovered) |   96.25% (3 uncovered) |    87.50% |

## Per component

| Component               | Category     | Files |                  Lines |             Statements |             Functions |               Branches |
| ----------------------- | ------------ | ----: | ---------------------: | ---------------------: | --------------------: | ---------------------: |
| `accordion`             | Navigation   |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `alert`                 | Data display |     1 |   96.64% (4 uncovered) |   96.64% (4 uncovered) |  81.82% (2 uncovered) |   95.83% (1 uncovered) |
| `app-layout`            | Navigation   |     1 |   98.25% (3 uncovered) |   98.25% (3 uncovered) |  92.86% (1 uncovered) |   92.59% (2 uncovered) |
| `area-chart`            | Chart        |     1 |  96.29% (33 uncovered) |  96.29% (33 uncovered) |  85.71% (9 uncovered) |  93.06% (10 uncovered) |
| `avatar`                | Data display |     1 |   96.51% (6 uncovered) |   96.51% (6 uncovered) |  88.89% (2 uncovered) |  100.00% (0 uncovered) |
| `badge`                 | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `bar-chart`             | Chart        |     1 |  97.97% (14 uncovered) |  97.97% (14 uncovered) |  92.86% (4 uncovered) |   97.12% (3 uncovered) |
| `box-plot-chart`        | Chart        |     2 |  97.54% (25 uncovered) |  97.54% (25 uncovered) |  88.24% (8 uncovered) |  86.59% (24 uncovered) |
| `breadcrumb`            | Navigation   |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `bulk-actions-bar`      | Data display |     1 |  93.50% (28 uncovered) |  93.50% (28 uncovered) |  86.49% (5 uncovered) |  89.36% (10 uncovered) |
| `bullet-chart`          | Chart        |     1 |  96.24% (21 uncovered) |  96.24% (21 uncovered) |  84.78% (7 uncovered) |  100.00% (0 uncovered) |
| `button`                | Form         |     1 |   97.63% (4 uncovered) |   97.63% (4 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `calendar`              | Form         |     1 |  96.50% (36 uncovered) |  96.50% (36 uncovered) | 100.00% (0 uncovered) |  94.59% (16 uncovered) |
| `card`                  | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   75.00% (1 uncovered) |
| `carousel`              | Navigation   |     1 |   97.41% (9 uncovered) |   97.41% (9 uncovered) | 100.00% (0 uncovered) |  81.82% (12 uncovered) |
| `chart`                 | Chart        |     6 | 90.27% (155 uncovered) | 90.27% (155 uncovered) |  92.05% (7 uncovered) |  97.07% (13 uncovered) |
| `checkbox`              | Form         |     1 |  94.27% (15 uncovered) |  94.27% (15 uncovered) |  92.59% (2 uncovered) |  100.00% (0 uncovered) |
| `chip`                  | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `color-picker`          | Form         |     1 |  97.78% (13 uncovered) |  97.78% (13 uncovered) |  97.87% (1 uncovered) |  82.64% (25 uncovered) |
| `column-sparkline`      | Chart        |     1 |  93.65% (37 uncovered) |  93.65% (37 uncovered) | 78.00% (11 uncovered) |  90.68% (11 uncovered) |
| `combo-chart`           | Chart        |     3 |  97.40% (24 uncovered) |  97.40% (24 uncovered) |  86.15% (9 uncovered) |  77.25% (43 uncovered) |
| `combobox`              | Form         |     1 |  95.74% (23 uncovered) |  95.74% (23 uncovered) |  97.73% (1 uncovered) |  84.67% (21 uncovered) |
| `command-item`          | Overlay      |     1 |   97.53% (7 uncovered) |   97.53% (7 uncovered) |  95.83% (1 uncovered) |   96.36% (2 uncovered) |
| `command-palette`       | Overlay      |     1 |   98.71% (8 uncovered) |   98.71% (8 uncovered) |  96.00% (2 uncovered) |  84.46% (23 uncovered) |
| `confirm-dialog`        | Overlay      |     1 |  91.74% (19 uncovered) |  91.74% (19 uncovered) |  75.00% (6 uncovered) |   87.10% (4 uncovered) |
| `context-menu`          | Overlay      |     1 |  93.53% (33 uncovered) |  93.53% (33 uncovered) | 100.00% (0 uncovered) |  77.62% (32 uncovered) |
| `dashboard-filters`     | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   87.50% (4 uncovered) |
| `data-state`            | Data display |     1 |   98.54% (2 uncovered) |   98.54% (2 uncovered) |  88.89% (1 uncovered) |   90.48% (2 uncovered) |
| `date-picker`           | Form         |     1 |  92.04% (27 uncovered) |  92.04% (27 uncovered) |  87.50% (4 uncovered) |   96.25% (3 uncovered) |
| `date-range-picker`     | Form         |     1 |  94.40% (32 uncovered) |  94.40% (32 uncovered) |  97.87% (1 uncovered) |  83.58% (22 uncovered) |
| `dialog`                | Overlay      |     1 |   97.16% (8 uncovered) |   97.16% (8 uncovered) |  86.36% (3 uncovered) |   96.05% (3 uncovered) |
| `divider`               | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   95.65% (1 uncovered) |
| `donut-chart`           | Chart        |     1 |  94.36% (36 uncovered) |  94.36% (36 uncovered) | 79.63% (11 uncovered) |  85.58% (15 uncovered) |
| `drawer`                | Overlay      |     1 |   98.80% (3 uncovered) |   98.80% (3 uncovered) |  95.00% (1 uncovered) |   88.89% (6 uncovered) |
| `dropdown`              | Overlay      |     1 |  97.03% (11 uncovered) |  97.03% (11 uncovered) | 100.00% (0 uncovered) |   96.06% (5 uncovered) |
| `dropzone`              | Form         |     1 |  94.40% (15 uncovered) |  94.40% (15 uncovered) |  90.91% (2 uncovered) |   92.31% (4 uncovered) |
| `empty-state`           | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `file-item`             | Form         |     1 |  96.17% (13 uncovered) |  96.17% (13 uncovered) |  96.15% (1 uncovered) |  80.33% (12 uncovered) |
| `file-upload`           | Form         |     1 |   98.91% (6 uncovered) |   98.91% (6 uncovered) |  97.78% (1 uncovered) |  76.69% (31 uncovered) |
| `filter-builder`        | Form         |     2 |  95.41% (68 uncovered) |  95.41% (68 uncovered) |  98.92% (1 uncovered) |   98.00% (9 uncovered) |
| `form-field`            | Form         |     1 |  97.81% (12 uncovered) |  97.81% (12 uncovered) | 100.00% (0 uncovered) |   94.37% (8 uncovered) |
| `form-layout`           | Form         |     1 |   99.73% (1 uncovered) |   99.73% (1 uncovered) | 100.00% (0 uncovered) |  88.14% (14 uncovered) |
| `form-wizard`           | Form         |     1 |  97.27% (21 uncovered) |  97.27% (21 uncovered) | 100.00% (0 uncovered) |  94.66% (11 uncovered) |
| `funnel-chart`          | Chart        |     2 |  95.40% (32 uncovered) |  95.40% (32 uncovered) | 82.76% (10 uncovered) |  85.83% (17 uncovered) |
| `gauge-chart`           | Chart        |     1 |  94.92% (28 uncovered) |  94.92% (28 uncovered) | 74.42% (11 uncovered) |   96.10% (3 uncovered) |
| `heatmap-chart`         | Chart        |     2 |  97.78% (20 uncovered) |  97.78% (20 uncovered) |  88.73% (8 uncovered) |  91.28% (17 uncovered) |
| `histogram`             | Chart        |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   73.33% (8 uncovered) |
| `icon-button`           | Form         |     1 |   96.65% (6 uncovered) |   96.65% (6 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `image`                 | Data display |     1 |  94.47% (14 uncovered) |  94.47% (14 uncovered) |  86.96% (3 uncovered) |  76.47% (12 uncovered) |
| `kpi-card`              | Data display |     1 |  93.53% (24 uncovered) |  93.53% (24 uncovered) | 66.67% (11 uncovered) |   89.16% (9 uncovered) |
| `lib`                   | Support      |    20 |  95.93% (76 uncovered) |  95.93% (76 uncovered) |  98.01% (3 uncovered) |  96.46% (24 uncovered) |
| `link`                  | Navigation   |     1 |   93.75% (6 uncovered) |   93.75% (6 uncovered) |  90.91% (1 uncovered) |   89.47% (2 uncovered) |
| `listbox`               | Form         |     1 |  95.44% (26 uncovered) |  95.44% (26 uncovered) | 100.00% (0 uncovered) |  84.07% (29 uncovered) |
| `menu`                  | Overlay      |     1 |  94.30% (11 uncovered) |  94.30% (11 uncovered) | 100.00% (0 uncovered) |  81.36% (11 uncovered) |
| `menu-item`             | Overlay      |     1 |   97.78% (2 uncovered) |   97.78% (2 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `multi-select-combobox` | Form         |     1 |  97.32% (18 uncovered) |  97.32% (18 uncovered) |  98.15% (1 uncovered) |  80.34% (35 uncovered) |
| `number-field`          | Form         |     1 |  97.26% (16 uncovered) |  97.26% (16 uncovered) | 100.00% (0 uncovered) |  85.00% (21 uncovered) |
| `option`                | Form         |     1 |   98.29% (3 uncovered) |   98.29% (3 uncovered) | 100.00% (0 uncovered) |   98.36% (1 uncovered) |
| `package`               | Other        |     0 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `pagination`            | Navigation   |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   88.89% (3 uncovered) |
| `popover`               | Overlay      |     1 |  92.35% (39 uncovered) |  92.35% (39 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `progress`              | Data display |     1 |   97.58% (4 uncovered) |   97.58% (4 uncovered) |  86.67% (2 uncovered) |  100.00% (0 uncovered) |
| `radar-chart`           | Chart        |     2 |  96.27% (32 uncovered) |  96.27% (32 uncovered) | 84.38% (10 uncovered) |  91.03% (13 uncovered) |
| `radio`                 | Form         |     1 |  95.27% (15 uncovered) |  95.27% (15 uncovered) |  93.75% (2 uncovered) |   96.84% (3 uncovered) |
| `radio-group`           | Form         |     1 |  94.29% (14 uncovered) |  94.29% (14 uncovered) |  92.00% (2 uncovered) |   89.86% (7 uncovered) |
| `range-chart`           | Chart        |     2 |  96.11% (38 uncovered) |  96.11% (38 uncovered) |  88.57% (8 uncovered) |  83.71% (29 uncovered) |
| `rating`                | Form         |     1 |  97.97% (12 uncovered) |  97.97% (12 uncovered) |  98.21% (1 uncovered) |  85.33% (22 uncovered) |
| `react`                 | Support      |     0 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `rich-text-editor`      | Form         |     2 |  95.99% (56 uncovered) |  95.99% (56 uncovered) |  97.83% (2 uncovered) |  80.59% (72 uncovered) |
| `row-details-panel`     | Data display |     1 |  93.09% (59 uncovered) |  93.09% (59 uncovered) | 81.43% (13 uncovered) |  82.47% (34 uncovered) |
| `scatter-chart`         | Chart        |     2 |  97.27% (23 uncovered) |  97.27% (23 uncovered) |  87.50% (8 uncovered) |  84.08% (25 uncovered) |
| `segmented-control`     | Form         |     1 |  96.70% (12 uncovered) |  96.70% (12 uncovered) | 100.00% (0 uncovered) |  78.26% (25 uncovered) |
| `select`                | Form         |     1 |  93.75% (21 uncovered) |  93.75% (21 uncovered) |  90.63% (3 uncovered) |   92.50% (6 uncovered) |
| `side-nav`              | Navigation   |     1 |  92.99% (22 uncovered) |  92.99% (22 uncovered) | 100.00% (0 uncovered) |   98.26% (2 uncovered) |
| `side-nav-item`         | Navigation   |     1 |  95.92% (14 uncovered) |  95.92% (14 uncovered) |  96.97% (1 uncovered) |  89.74% (12 uncovered) |
| `side-nav-section`      | Navigation   |     1 |   98.79% (2 uncovered) |   98.79% (2 uncovered) |  92.86% (1 uncovered) |   85.29% (5 uncovered) |
| `skeleton`              | Data display |     1 |   94.12% (5 uncovered) |   94.12% (5 uncovered) |  83.33% (2 uncovered) |   88.89% (2 uncovered) |
| `slider`                | Form         |     1 |  95.86% (28 uncovered) |  95.86% (28 uncovered) |  95.65% (3 uncovered) |  82.63% (29 uncovered) |
| `source-meta`           | Data display |     1 |   98.35% (2 uncovered) |   98.35% (2 uncovered) |  91.67% (1 uncovered) |   95.83% (1 uncovered) |
| `sparkline`             | Chart        |     1 |  97.00% (21 uncovered) |  97.00% (21 uncovered) |  85.71% (8 uncovered) |  100.00% (0 uncovered) |
| `spinner`               | Data display |     1 |   98.18% (2 uncovered) |   98.18% (2 uncovered) |  91.67% (1 uncovered) |   88.00% (3 uncovered) |
| `split-pane`            | Navigation   |     1 |  96.06% (15 uncovered) |  96.06% (15 uncovered) |  88.89% (4 uncovered) |  74.16% (23 uncovered) |
| `stacked-area-chart`    | Chart        |     1 |  95.51% (35 uncovered) |  95.51% (35 uncovered) | 81.36% (11 uncovered) |  85.45% (16 uncovered) |
| `stacked-bar-chart`     | Chart        |     1 |  93.67% (51 uncovered) |  93.67% (51 uncovered) | 81.67% (11 uncovered) |  88.14% (14 uncovered) |
| `status-indicator`      | Data display |     1 |   97.79% (3 uncovered) |   97.79% (3 uncovered) |  93.75% (1 uncovered) |   94.74% (2 uncovered) |
| `stepper`               | Navigation   |     1 |  96.84% (11 uncovered) |  96.84% (11 uncovered) | 100.00% (0 uncovered) |   91.40% (8 uncovered) |
| `switch`                | Form         |     1 |  91.53% (20 uncovered) |  91.53% (20 uncovered) |  88.00% (3 uncovered) |  100.00% (0 uncovered) |
| `tab`                   | Navigation   |     1 |   98.31% (2 uncovered) |   98.31% (2 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `tab-panel`             | Navigation   |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   96.77% (1 uncovered) |
| `table`                 | Table        |     4 | 93.77% (306 uncovered) | 93.77% (306 uncovered) | 93.77% (19 uncovered) | 92.68% (106 uncovered) |
| `table-csv`             | Table        |     1 |  89.90% (10 uncovered) |  89.90% (10 uncovered) | 100.00% (0 uncovered) |  74.00% (13 uncovered) |
| `table-quick-find`      | Table        |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   94.59% (2 uncovered) |
| `table-toolbar`         | Table        |     1 |  95.40% (20 uncovered) |  95.40% (20 uncovered) |  88.57% (4 uncovered) |   94.44% (6 uncovered) |
| `table-view-state`      | Table        |     1 |  95.22% (12 uncovered) |  95.22% (12 uncovered) | 100.00% (0 uncovered) |  83.72% (14 uncovered) |
| `tabs`                  | Navigation   |     1 |   98.51% (4 uncovered) |   98.51% (4 uncovered) | 100.00% (0 uncovered) |  84.21% (12 uncovered) |
| `text-field`            | Form         |     1 |  97.07% (14 uncovered) |  97.07% (14 uncovered) |  93.02% (3 uncovered) |   96.55% (4 uncovered) |
| `textarea`              | Form         |     1 |  91.50% (29 uncovered) |  91.50% (29 uncovered) |  84.85% (5 uncovered) |   90.63% (6 uncovered) |
| `time-picker`           | Form         |     1 |  96.61% (13 uncovered) |  96.61% (13 uncovered) | 100.00% (0 uncovered) |  87.13% (13 uncovered) |
| `toast`                 | Overlay      |     1 |   96.30% (6 uncovered) |   96.30% (6 uncovered) |  85.71% (2 uncovered) |   83.33% (5 uncovered) |
| `toaster`               | Overlay      |     1 |  97.22% (13 uncovered) |  97.22% (13 uncovered) | 100.00% (0 uncovered) |  85.94% (18 uncovered) |
| `tokens`                | Support      |     1 |   99.73% (6 uncovered) |   99.73% (6 uncovered) | 100.00% (0 uncovered) |   75.00% (3 uncovered) |
| `tooltip`               | Overlay      |     1 |  95.19% (10 uncovered) |  95.19% (10 uncovered) | 100.00% (0 uncovered) |  81.36% (11 uncovered) |
| `tree`                  | Navigation   |     1 |  96.87% (14 uncovered) |  96.87% (14 uncovered) | 100.00% (0 uncovered) |  83.77% (25 uncovered) |
| `tree-item`             | Navigation   |     1 |   99.03% (2 uncovered) |   99.03% (2 uncovered) | 100.00% (0 uncovered) |   98.59% (1 uncovered) |
| `trend-chart`           | Chart        |     2 |  97.36% (22 uncovered) |  97.36% (22 uncovered) |  85.00% (9 uncovered) |  91.11% (12 uncovered) |
| `validation-summary`    | Form         |     1 |  94.72% (18 uncovered) |  94.72% (18 uncovered) |  95.65% (1 uncovered) |   97.18% (2 uncovered) |
| `virtual-list`          | Data display |     1 |  94.68% (20 uncovered) |  94.68% (20 uncovered) |  92.86% (2 uncovered) |  79.07% (18 uncovered) |
| `waterfall-chart`       | Chart        |     2 |  97.72% (20 uncovered) |  97.72% (20 uncovered) |  88.06% (8 uncovered) |  84.36% (28 uncovered) |

## Source files not loaded

Every component and library module under `src/` was loaded during the unit test run.

207 unloaded files are expected: package and component `index.js` barrels, generated React wrappers, the React wrapper modules (covered through the bundled React test), and `src/tokens/token-data.js` (documentation data).
