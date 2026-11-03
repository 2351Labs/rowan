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
| lines      |  53,595 | 55,745 |   96.14% | 95.05% |
| statements |  53,595 | 55,745 |   96.14% | 95.05% |
| functions  |   3,868 |  4,158 |   93.02% | 91.31% |
| branches   |  12,272 | 13,564 |   90.47% | 88.89% |

## Largest gaps

Ranked by gap score. Use this list to choose the next behavior tests.

| Component               | Category     | Gap score |                  Lines |               Branches | Functions |
| ----------------------- | ------------ | --------: | ---------------------: | ---------------------: | --------: |
| `rich-text-editor`      | Form         |     384.0 |  96.00% (56 uncovered) |  80.65% (72 uncovered) |    97.83% |
| `table`                 | Table        |     275.5 | 94.24% (373 uncovered) | 91.32% (178 uncovered) |    95.54% |
| `filter-builder`        | Form         |     231.0 |  95.53% (68 uncovered) |   98.09% (9 uncovered) |    98.95% |
| `lib`                   | Support      |     222.0 | 93.90% (124 uncovered) |  96.62% (24 uncovered) |    96.32% |
| `context-menu`          | Overlay      |     219.0 |  92.62% (38 uncovered) |  73.88% (35 uncovered) |   100.00% |
| `row-details-panel`     | Data display |     186.0 |  93.12% (59 uncovered) |  82.56% (34 uncovered) |    81.43% |
| `slider`                | Form         |     171.0 |  95.89% (28 uncovered) |  82.74% (29 uncovered) |    95.65% |
| `listbox`               | Form         |     165.0 |  95.48% (26 uncovered) |  84.15% (29 uncovered) |   100.00% |
| `date-range-picker`     | Form         |     162.0 |  94.43% (32 uncovered) |  83.70% (22 uncovered) |    97.87% |
| `multi-select-combobox` | Form         |     159.0 |  97.34% (18 uncovered) |  80.45% (35 uncovered) |    98.15% |
| `calendar`              | Form         |     156.0 |  96.51% (36 uncovered) |  94.61% (16 uncovered) |   100.00% |
| `combobox`              | Form         |     132.0 |  95.76% (23 uncovered) |  84.78% (21 uncovered) |    97.73% |
| `popover`               | Overlay      |     132.0 |  91.42% (44 uncovered) |  100.00% (0 uncovered) |   100.00% |
| `color-picker`          | Form         |     114.0 |  97.80% (13 uncovered) |  82.76% (25 uncovered) |    97.87% |
| `file-upload`           | Form         |     111.0 |   98.92% (6 uncovered) |  76.87% (31 uncovered) |    97.78% |
| `number-field`          | Form         |     111.0 |  97.28% (16 uncovered) |  85.11% (21 uncovered) |   100.00% |
| `segmented-control`     | Form         |     111.0 |  96.75% (12 uncovered) |  78.45% (25 uncovered) |   100.00% |
| `textarea`              | Form         |     105.0 |  91.57% (29 uncovered) |   90.77% (6 uncovered) |    84.85% |
| `rating`                | Form         |     102.0 |  97.98% (12 uncovered) |  85.43% (22 uncovered) |    98.21% |
| `tree`                  | Navigation   |      97.5 |  96.89% (14 uncovered) |  83.87% (25 uncovered) |   100.00% |
| `form-wizard`           | Form         |      96.0 |  97.28% (21 uncovered) |  94.69% (11 uncovered) |   100.00% |
| `split-pane`            | Navigation   |      95.0 |  96.11% (15 uncovered) |  74.44% (23 uncovered) |    88.89% |
| `command-palette`       | Overlay      |      93.0 |   98.72% (8 uncovered) |  84.56% (23 uncovered) |    96.00% |
| `toaster`               | Overlay      |      93.0 |  97.24% (13 uncovered) |  86.05% (18 uncovered) |   100.00% |
| `date-picker`           | Form         |      90.0 |  92.11% (27 uncovered) |   96.30% (3 uncovered) |    87.50% |

## Per component

| Component               | Category     | Files |                  Lines |             Statements |             Functions |               Branches |
| ----------------------- | ------------ | ----: | ---------------------: | ---------------------: | --------------------: | ---------------------: |
| `accordion`             | Navigation   |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `alert`                 | Data display |     2 |   96.72% (4 uncovered) |   96.72% (4 uncovered) |  81.82% (2 uncovered) |   96.00% (1 uncovered) |
| `app-layout`            | Navigation   |     2 |   98.30% (3 uncovered) |   98.30% (3 uncovered) |  92.86% (1 uncovered) |   92.86% (2 uncovered) |
| `area-chart`            | Chart        |     2 |  97.10% (26 uncovered) |  97.10% (26 uncovered) |  88.89% (7 uncovered) |   94.74% (8 uncovered) |
| `avatar`                | Data display |     2 |   96.57% (6 uncovered) |   96.57% (6 uncovered) |  88.89% (2 uncovered) |  100.00% (0 uncovered) |
| `badge`                 | Data display |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `bar-chart`             | Chart        |     2 |  98.42% (11 uncovered) |  98.42% (11 uncovered) |  92.86% (4 uncovered) |   97.20% (3 uncovered) |
| `box-plot-chart`        | Chart        |     3 |  98.24% (18 uncovered) |  98.24% (18 uncovered) |  91.18% (6 uncovered) |  89.19% (20 uncovered) |
| `breadcrumb`            | Navigation   |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `bulk-actions-bar`      | Data display |     2 |  93.55% (28 uncovered) |  93.55% (28 uncovered) |  86.49% (5 uncovered) |  89.47% (10 uncovered) |
| `bullet-chart`          | Chart        |     2 |  96.61% (19 uncovered) |  96.61% (19 uncovered) |  86.96% (6 uncovered) |  86.61% (15 uncovered) |
| `button`                | Form         |     2 |   97.70% (4 uncovered) |   97.70% (4 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `calendar`              | Form         |     2 |  96.51% (36 uncovered) |  96.51% (36 uncovered) | 100.00% (0 uncovered) |  94.61% (16 uncovered) |
| `card`                  | Data display |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   80.00% (1 uncovered) |
| `carousel`              | Navigation   |     2 |   97.44% (9 uncovered) |   97.44% (9 uncovered) | 100.00% (0 uncovered) |  82.09% (12 uncovered) |
| `chart`                 | Chart        |     8 | 92.65% (145 uncovered) | 92.65% (145 uncovered) |  97.37% (3 uncovered) |  96.26% (25 uncovered) |
| `checkbox`              | Form         |     2 |  94.34% (15 uncovered) |  94.34% (15 uncovered) |  92.59% (2 uncovered) |  100.00% (0 uncovered) |
| `chip`                  | Data display |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `color-picker`          | Form         |     2 |  97.80% (13 uncovered) |  97.80% (13 uncovered) |  97.87% (1 uncovered) |  82.76% (25 uncovered) |
| `column-sparkline`      | Chart        |     2 |  96.45% (21 uncovered) |  96.45% (21 uncovered) |  84.00% (8 uncovered) |  91.20% (11 uncovered) |
| `combo-chart`           | Chart        |     4 |  98.17% (17 uncovered) |  98.17% (17 uncovered) |  89.23% (7 uncovered) |  89.50% (21 uncovered) |
| `combobox`              | Form         |     2 |  95.76% (23 uncovered) |  95.76% (23 uncovered) |  97.73% (1 uncovered) |  84.78% (21 uncovered) |
| `command-item`          | Overlay      |     2 |   97.55% (7 uncovered) |   97.55% (7 uncovered) |  95.83% (1 uncovered) |   96.43% (2 uncovered) |
| `command-palette`       | Overlay      |     2 |   98.72% (8 uncovered) |   98.72% (8 uncovered) |  96.00% (2 uncovered) |  84.56% (23 uncovered) |
| `confirm-dialog`        | Overlay      |     2 |  91.91% (19 uncovered) |  91.91% (19 uncovered) |  75.00% (6 uncovered) |   87.50% (4 uncovered) |
| `context-menu`          | Overlay      |     2 |  92.62% (38 uncovered) |  92.62% (38 uncovered) | 100.00% (0 uncovered) |  73.88% (35 uncovered) |
| `dashboard-filters`     | Data display |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   87.50% (4 uncovered) |
| `data-state`            | Data display |     2 |   98.57% (2 uncovered) |   98.57% (2 uncovered) |  88.89% (1 uncovered) |   90.91% (2 uncovered) |
| `date-picker`           | Form         |     2 |  92.11% (27 uncovered) |  92.11% (27 uncovered) |  87.50% (4 uncovered) |   96.30% (3 uncovered) |
| `date-range-picker`     | Form         |     2 |  94.43% (32 uncovered) |  94.43% (32 uncovered) |  97.87% (1 uncovered) |  83.70% (22 uncovered) |
| `dialog`                | Overlay      |     2 |   97.19% (8 uncovered) |   97.19% (8 uncovered) |  86.36% (3 uncovered) |   96.10% (3 uncovered) |
| `divider`               | Data display |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   95.83% (1 uncovered) |
| `donut-chart`           | Chart        |     2 |  95.85% (27 uncovered) |  95.85% (27 uncovered) |  84.91% (8 uncovered) |  91.07% (10 uncovered) |
| `drawer`                | Overlay      |     2 |   98.82% (3 uncovered) |   98.82% (3 uncovered) |  95.00% (1 uncovered) |   89.09% (6 uncovered) |
| `dropdown`              | Overlay      |     2 |  95.71% (16 uncovered) |  95.71% (16 uncovered) | 100.00% (0 uncovered) |   95.97% (5 uncovered) |
| `dropzone`              | Form         |     2 |  94.46% (15 uncovered) |  94.46% (15 uncovered) |  90.91% (2 uncovered) |   92.45% (4 uncovered) |
| `empty-state`           | Data display |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `file-item`             | Form         |     2 |  96.20% (13 uncovered) |  96.20% (13 uncovered) |  96.15% (1 uncovered) |  80.65% (12 uncovered) |
| `file-upload`           | Form         |     2 |   98.92% (6 uncovered) |   98.92% (6 uncovered) |  97.78% (1 uncovered) |  76.87% (31 uncovered) |
| `filter-builder`        | Form         |     3 |  95.53% (68 uncovered) |  95.53% (68 uncovered) |  98.95% (1 uncovered) |   98.09% (9 uncovered) |
| `form-field`            | Form         |     2 |  97.83% (12 uncovered) |  97.83% (12 uncovered) | 100.00% (0 uncovered) |   94.41% (8 uncovered) |
| `form-layout`           | Form         |     2 |   97.64% (9 uncovered) |   97.64% (9 uncovered) | 100.00% (0 uncovered) |  83.93% (18 uncovered) |
| `form-wizard`           | Form         |     2 |  97.28% (21 uncovered) |  97.28% (21 uncovered) | 100.00% (0 uncovered) |  94.69% (11 uncovered) |
| `funnel-chart`          | Chart        |     3 |  96.45% (25 uncovered) |  96.45% (25 uncovered) |  86.21% (8 uncovered) |  91.20% (11 uncovered) |
| `gauge-chart`           | Chart        |     2 |  97.86% (12 uncovered) |  97.86% (12 uncovered) |  86.05% (6 uncovered) |   96.55% (3 uncovered) |
| `heatmap-chart`         | Chart        |     3 |  98.57% (13 uncovered) |  98.57% (13 uncovered) |  91.55% (6 uncovered) |  94.50% (11 uncovered) |
| `histogram`             | Chart        |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   73.33% (8 uncovered) |
| `icon-button`           | Form         |     2 |   96.74% (6 uncovered) |   96.74% (6 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `image`                 | Data display |     2 |  94.57% (14 uncovered) |  94.57% (14 uncovered) |  86.96% (3 uncovered) |  76.92% (12 uncovered) |
| `kpi-card`              | Data display |     2 |  93.58% (24 uncovered) |  93.58% (24 uncovered) | 66.67% (11 uncovered) |   89.29% (9 uncovered) |
| `lib`                   | Support      |    20 | 93.90% (124 uncovered) | 93.90% (124 uncovered) |  96.32% (6 uncovered) |  96.62% (24 uncovered) |
| `link`                  | Navigation   |     2 |   93.94% (6 uncovered) |   93.94% (6 uncovered) |  90.91% (1 uncovered) |   90.00% (2 uncovered) |
| `listbox`               | Form         |     2 |  95.48% (26 uncovered) |  95.48% (26 uncovered) | 100.00% (0 uncovered) |  84.15% (29 uncovered) |
| `menu`                  | Overlay      |     2 |  94.39% (11 uncovered) |  94.39% (11 uncovered) | 100.00% (0 uncovered) |  81.67% (11 uncovered) |
| `menu-item`             | Overlay      |     2 |   97.85% (2 uncovered) |   97.85% (2 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `multi-select-combobox` | Form         |     2 |  97.34% (18 uncovered) |  97.34% (18 uncovered) |  98.15% (1 uncovered) |  80.45% (35 uncovered) |
| `number-field`          | Form         |     2 |  97.28% (16 uncovered) |  97.28% (16 uncovered) | 100.00% (0 uncovered) |  85.11% (21 uncovered) |
| `option`                | Form         |     2 |   98.33% (3 uncovered) |   98.33% (3 uncovered) | 100.00% (0 uncovered) |   98.39% (1 uncovered) |
| `package`               | Other        |     0 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `pagination`            | Navigation   |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   89.29% (3 uncovered) |
| `popover`               | Overlay      |     2 |  91.42% (44 uncovered) |  91.42% (44 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `progress`              | Data display |     2 |   97.62% (4 uncovered) |   97.62% (4 uncovered) |  86.67% (2 uncovered) |  100.00% (0 uncovered) |
| `radar-chart`           | Chart        |     3 |  97.12% (25 uncovered) |  97.12% (25 uncovered) |  87.50% (8 uncovered) |   94.08% (9 uncovered) |
| `radio`                 | Form         |     2 |  95.31% (15 uncovered) |  95.31% (15 uncovered) |  93.75% (2 uncovered) |   96.88% (3 uncovered) |
| `radio-group`           | Form         |     2 |  94.35% (14 uncovered) |  94.35% (14 uncovered) |  92.00% (2 uncovered) |   90.00% (7 uncovered) |
| `range-chart`           | Chart        |     3 |  96.86% (31 uncovered) |  96.86% (31 uncovered) |  91.43% (6 uncovered) |  86.34% (25 uncovered) |
| `rating`                | Form         |     2 |  97.98% (12 uncovered) |  97.98% (12 uncovered) |  98.21% (1 uncovered) |  85.43% (22 uncovered) |
| `react`                 | Support      |     0 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `rich-text-editor`      | Form         |     3 |  96.00% (56 uncovered) |  96.00% (56 uncovered) |  97.83% (2 uncovered) |  80.65% (72 uncovered) |
| `row-details-panel`     | Data display |     2 |  93.12% (59 uncovered) |  93.12% (59 uncovered) | 81.43% (13 uncovered) |  82.56% (34 uncovered) |
| `scatter-chart`         | Chart        |     3 |  98.12% (16 uncovered) |  98.12% (16 uncovered) |  90.63% (6 uncovered) |  87.20% (21 uncovered) |
| `segmented-control`     | Form         |     2 |  96.75% (12 uncovered) |  96.75% (12 uncovered) | 100.00% (0 uncovered) |  78.45% (25 uncovered) |
| `select`                | Form         |     2 |  93.81% (21 uncovered) |  93.81% (21 uncovered) |  90.63% (3 uncovered) |   92.59% (6 uncovered) |
| `side-nav`              | Navigation   |     2 |  93.10% (22 uncovered) |  93.10% (22 uncovered) | 100.00% (0 uncovered) |   98.28% (2 uncovered) |
| `side-nav-item`         | Navigation   |     2 |  95.98% (14 uncovered) |  95.98% (14 uncovered) |  96.97% (1 uncovered) |  89.83% (12 uncovered) |
| `side-nav-section`      | Navigation   |     2 |   98.82% (2 uncovered) |   98.82% (2 uncovered) |  92.86% (1 uncovered) |   85.71% (5 uncovered) |
| `skeleton`              | Data display |     2 |   94.44% (5 uncovered) |   94.44% (5 uncovered) |  83.33% (2 uncovered) |   89.47% (2 uncovered) |
| `slider`                | Form         |     2 |  95.89% (28 uncovered) |  95.89% (28 uncovered) |  95.65% (3 uncovered) |  82.74% (29 uncovered) |
| `source-meta`           | Data display |     2 |   98.39% (2 uncovered) |   98.39% (2 uncovered) |  91.67% (1 uncovered) |   96.00% (1 uncovered) |
| `sparkline`             | Chart        |     2 |  97.30% (19 uncovered) |  97.30% (19 uncovered) |  87.50% (7 uncovered) |   95.83% (6 uncovered) |
| `spinner`               | Data display |     2 |   98.23% (2 uncovered) |   98.23% (2 uncovered) |  91.67% (1 uncovered) |   88.46% (3 uncovered) |
| `split-pane`            | Navigation   |     2 |  96.11% (15 uncovered) |  96.11% (15 uncovered) |  88.89% (4 uncovered) |  74.44% (23 uncovered) |
| `stacked-area-chart`    | Chart        |     2 |  96.45% (28 uncovered) |  96.45% (28 uncovered) |  84.75% (9 uncovered) |  89.66% (12 uncovered) |
| `stacked-bar-chart`     | Chart        |     2 |  94.60% (44 uncovered) |  94.60% (44 uncovered) |  85.00% (9 uncovered) |  91.87% (10 uncovered) |
| `status-indicator`      | Data display |     2 |   97.87% (3 uncovered) |   97.87% (3 uncovered) |  93.75% (1 uncovered) |   94.87% (2 uncovered) |
| `stepper`               | Navigation   |     2 |  96.87% (11 uncovered) |  96.87% (11 uncovered) | 100.00% (0 uncovered) |   91.49% (8 uncovered) |
| `switch`                | Form         |     2 |  91.63% (20 uncovered) |  91.63% (20 uncovered) |  88.00% (3 uncovered) |  100.00% (0 uncovered) |
| `tab`                   | Navigation   |     2 |   98.35% (2 uncovered) |   98.35% (2 uncovered) | 100.00% (0 uncovered) |  100.00% (0 uncovered) |
| `tab-panel`             | Navigation   |     2 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   96.88% (1 uncovered) |
| `table`                 | Table        |    10 | 94.24% (373 uncovered) | 94.24% (373 uncovered) | 95.54% (19 uncovered) | 91.32% (178 uncovered) |
| `table-csv`             | Table        |     1 |  89.90% (10 uncovered) |  89.90% (10 uncovered) | 100.00% (0 uncovered) |  74.00% (13 uncovered) |
| `table-quick-find`      | Table        |     1 |  100.00% (0 uncovered) |  100.00% (0 uncovered) | 100.00% (0 uncovered) |   94.59% (2 uncovered) |
| `table-toolbar`         | Table        |     2 |  95.51% (20 uncovered) |  95.51% (20 uncovered) |  88.57% (4 uncovered) |   94.59% (6 uncovered) |
| `table-view-state`      | Table        |     1 |  95.52% (12 uncovered) |  95.52% (12 uncovered) | 100.00% (0 uncovered) |  85.86% (14 uncovered) |
| `tabs`                  | Navigation   |     2 |   98.53% (4 uncovered) |   98.53% (4 uncovered) | 100.00% (0 uncovered) |  84.42% (12 uncovered) |
| `text-field`            | Form         |     2 |  97.09% (14 uncovered) |  97.09% (14 uncovered) |  93.02% (3 uncovered) |   96.55% (4 uncovered) |
| `textarea`              | Form         |     2 |  91.57% (29 uncovered) |  91.57% (29 uncovered) |  84.85% (5 uncovered) |   90.77% (6 uncovered) |
| `time-picker`           | Form         |     2 |  96.63% (13 uncovered) |  96.63% (13 uncovered) | 100.00% (0 uncovered) |  87.25% (13 uncovered) |
| `toast`                 | Overlay      |     2 |   96.36% (6 uncovered) |   96.36% (6 uncovered) |  85.71% (2 uncovered) |   83.87% (5 uncovered) |
| `toaster`               | Overlay      |     2 |  97.24% (13 uncovered) |  97.24% (13 uncovered) | 100.00% (0 uncovered) |  86.05% (18 uncovered) |
| `tokens`                | Support      |    32 |   99.76% (6 uncovered) |   99.76% (6 uncovered) | 26.47% (25 uncovered) |   94.44% (4 uncovered) |
| `tooltip`               | Overlay      |     2 |  95.26% (10 uncovered) |  95.26% (10 uncovered) | 100.00% (0 uncovered) |  81.67% (11 uncovered) |
| `tree`                  | Navigation   |     2 |  96.89% (14 uncovered) |  96.89% (14 uncovered) | 100.00% (0 uncovered) |  83.87% (25 uncovered) |
| `tree-item`             | Navigation   |     2 |   99.05% (2 uncovered) |   99.05% (2 uncovered) | 100.00% (0 uncovered) |   98.61% (1 uncovered) |
| `trend-chart`           | Chart        |     3 |  97.83% (18 uncovered) |  97.83% (18 uncovered) |  88.33% (7 uncovered) |  92.91% (10 uncovered) |
| `validation-summary`    | Form         |     2 |  94.99% (18 uncovered) |  94.99% (18 uncovered) |  96.00% (1 uncovered) |   97.62% (2 uncovered) |
| `virtual-list`          | Data display |     2 |  94.75% (20 uncovered) |  94.75% (20 uncovered) |  92.86% (2 uncovered) |  76.74% (20 uncovered) |
| `waterfall-chart`       | Chart        |     3 |  98.53% (13 uncovered) |  98.53% (13 uncovered) |  91.04% (6 uncovered) |  87.23% (24 uncovered) |

## Source files not loaded

Every component and library module under `src/` was loaded during the unit test run.

207 unloaded files are expected: package and component `index.js` barrels, generated React wrappers, the React wrapper modules (covered through the bundled React test), and `src/tokens/token-data.js` (documentation data).
