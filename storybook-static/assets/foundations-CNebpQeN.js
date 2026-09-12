import{j as r,b as P}from"./index-BebESzrS.js";import{useMDXComponents as h}from"./index-CYfLRYco.js";import"./iframe-DnR8IcSx.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-C__6K5js.js";import"./index-Bhqu_tAV.js";const S=`:root,
:host {
  /* Primitive layer */
  --rowan-color-forest-900: #10261c;
  --rowan-color-forest-800: #153224;
  --rowan-color-forest-700: #1d432f;
  --rowan-color-forest-600: #24543c;
  --rowan-color-forest-500: #2f6a4d;
  --rowan-color-sand-50: #f8f7f2;
  --rowan-color-sand-100: #efede4;
  --rowan-color-ink-900: #1f2421;
  --rowan-color-ink-700: #424945;
  --rowan-color-danger-600: #b4392d;
  --rowan-color-danger-700: #972d22;

  --rowan-space-1: 0.25rem;
  --rowan-space-2: 0.5rem;
  --rowan-space-3: 0.75rem;
  --rowan-space-4: 1rem;
  --rowan-space-5: 1.25rem;
  --rowan-space-6: 1.5rem;
  --rowan-space-8: 2rem;

  --rowan-radius-sm: 0.375rem;
  --rowan-radius-md: 0.5rem;
  --rowan-radius-lg: 0.625rem;

  --rowan-font-family: "Avenir Next", "Segoe UI", "Noto Sans", sans-serif;
  --rowan-font-size-sm: 0.875rem;
  --rowan-font-size-md: 1rem;
  --rowan-font-size-lg: 1.125rem;
  --rowan-line-height: 1.4;

  --rowan-border-width: 1px;

  /* Semantic layer */
  --rowan-color-bg: var(--rowan-color-sand-50);
  --rowan-color-fg: var(--rowan-color-ink-900);
  --rowan-color-muted: var(--rowan-color-ink-700);
  --rowan-color-accent: var(--rowan-color-forest-700);
  --rowan-color-border: #d8dcd5;
  --rowan-color-danger: var(--rowan-color-danger-600);

  /* Component layer */
  --rowan-button-bg: var(--rowan-color-accent);
  --rowan-button-fg: #ffffff;
  --rowan-button-border: var(--rowan-button-bg);
  --rowan-button-border-width: var(--rowan-border-width);
  --rowan-button-hover-bg: color-mix(in srgb, var(--rowan-button-bg) 88%, black);
  --rowan-button-hover-fg: var(--rowan-button-fg);
  --rowan-button-hover-border: var(--rowan-button-hover-bg);
  --rowan-button-active-bg: color-mix(in srgb, var(--rowan-button-bg) 76%, black);
  --rowan-button-active-fg: var(--rowan-button-fg);
  --rowan-button-active-border: var(--rowan-button-active-bg);
  --rowan-button-shadow: inset 0 1px 0 rgb(255 255 255 / 16%), 0 1px 1px rgb(16 38 28 / 16%);
  --rowan-button-focus-ring: var(--rowan-focus-ring);
  --rowan-button-radius: var(--rowan-radius-md);
  --rowan-button-font-family: var(--rowan-font-family);
  --rowan-button-font-size: 0.9375rem;
  --rowan-button-font-weight: 600;
  --rowan-button-line-height: 1.2;
  --rowan-button-gap: var(--rowan-space-2);
  --rowan-button-min-block-size: 2.625rem;
  --rowan-button-padding-inline: 0.875rem;
  --rowan-button-transition: 140ms ease;
  --rowan-button-disabled-opacity: 0.48;
  --rowan-button-spinner-size: 0.9375rem;
  --rowan-button-spinner-border-width: 0.125rem;
  --rowan-button-secondary-bg: var(--rowan-color-bg);
  --rowan-button-secondary-fg: var(--rowan-color-fg);
  --rowan-button-secondary-border: var(--rowan-color-border);
  --rowan-button-secondary-hover-bg: color-mix(
    in srgb,
    var(--rowan-color-accent) 7%,
    var(--rowan-color-bg)
  );
  --rowan-button-secondary-hover-border: color-mix(
    in srgb,
    var(--rowan-color-accent) 36%,
    var(--rowan-color-border)
  );
  --rowan-button-secondary-active-bg: color-mix(
    in srgb,
    var(--rowan-color-accent) 13%,
    var(--rowan-color-bg)
  );
  --rowan-button-secondary-active-border: color-mix(
    in srgb,
    var(--rowan-color-accent) 52%,
    var(--rowan-color-border)
  );
  --rowan-button-secondary-shadow: inset 0 1px 0 rgb(255 255 255 / 72%);
  --rowan-button-ghost-bg: transparent;
  --rowan-button-ghost-fg: var(--rowan-color-accent);
  --rowan-button-ghost-border: transparent;
  --rowan-button-ghost-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 9%, transparent);
  --rowan-button-ghost-active-bg: color-mix(in srgb, var(--rowan-color-accent) 16%, transparent);
  --rowan-button-ghost-shadow: 0 0 0 transparent;
  --rowan-button-danger-bg: var(--rowan-color-danger);
  --rowan-button-danger-fg: var(--rowan-button-fg);
  --rowan-button-danger-border: var(--rowan-color-danger);
  --rowan-button-danger-hover-bg: color-mix(in srgb, var(--rowan-color-danger) 88%, black);
  --rowan-button-danger-hover-border: var(--rowan-button-danger-hover-bg);
  --rowan-button-danger-active-bg: color-mix(in srgb, var(--rowan-color-danger) 76%, black);
  --rowan-button-danger-active-border: var(--rowan-button-danger-active-bg);
  --rowan-button-danger-shadow: inset 0 1px 0 rgb(255 255 255 / 12%), 0 1px 1px rgb(90 29 23 / 18%);
  --rowan-button-sm-font-size: 0.8125rem;
  --rowan-button-sm-min-block-size: 2.25rem;
  --rowan-button-sm-padding-inline: var(--rowan-space-3);
  --rowan-button-lg-font-size: var(--rowan-font-size-md);
  --rowan-button-lg-min-block-size: 3rem;
  --rowan-button-lg-padding-inline: 1.125rem;
  --rowan-field-bg: #ffffff;
  --rowan-field-fg: var(--rowan-color-fg);
  --rowan-field-border: var(--rowan-color-border);
  --rowan-card-bg: #ffffff;
  --rowan-card-border: var(--rowan-color-border);
  --rowan-dialog-bg: #ffffff;
  --rowan-calendar-bg: var(--rowan-card-bg);
  --rowan-calendar-fg: var(--rowan-color-fg);
  --rowan-calendar-muted: var(--rowan-color-muted);
  --rowan-calendar-border: var(--rowan-color-border);
  --rowan-calendar-accent: var(--rowan-color-accent);
  --rowan-calendar-accent-contrast: #ffffff;
  --rowan-toast-bg: var(--rowan-card-bg);
  --rowan-toast-fg: var(--rowan-color-fg);
  --rowan-toast-border: var(--rowan-color-border);
  --rowan-toast-shadow: 0 10px 24px rgb(16 28 22 / 18%);
  --rowan-toaster-z-index: 1000;
  --rowan-form-wizard-fg: var(--rowan-color-fg);
  --rowan-form-wizard-border: var(--rowan-color-border);
  --rowan-form-wizard-gap: var(--rowan-space-5);
  --rowan-form-wizard-progress-padding: var(--rowan-space-4);
  --rowan-form-wizard-panel-bg: transparent;
  --rowan-form-wizard-actions-gap: var(--rowan-space-3);
  --rowan-form-wizard-actions-padding: var(--rowan-space-4);
  --rowan-form-wizard-next-bg: var(--rowan-color-accent);
  --rowan-form-wizard-next-border: var(--rowan-color-accent);
  --rowan-form-wizard-next-fg: #ffffff;
  --rowan-form-wizard-previous-bg: transparent;
  --rowan-form-wizard-previous-border: var(--rowan-color-border);
  --rowan-form-wizard-previous-fg: var(--rowan-color-fg);
  --rowan-form-wizard-button-radius: var(--rowan-radius-md);
  --rowan-form-wizard-button-min-height: 2.5rem;
  --rowan-form-wizard-button-padding: var(--rowan-space-4);
  --rowan-form-wizard-focus-ring: var(--rowan-focus-ring);
  --rowan-slider-fg: var(--rowan-color-fg);
  --rowan-slider-track-bg: var(--rowan-color-sand-100);
  --rowan-slider-range-bg: var(--rowan-color-accent);
  --rowan-slider-thumb-bg: #ffffff;
  --rowan-slider-thumb-border: var(--rowan-color-border);
  --rowan-slider-track-height: 0.375rem;
  --rowan-slider-track-radius: 999px;
  --rowan-slider-thumb-size: 1.125rem;
  --rowan-slider-control-height: 2.75rem;
  --rowan-slider-gap: var(--rowan-space-3);
  --rowan-slider-value-fg: var(--rowan-color-muted);
  --rowan-slider-value-font-size: var(--rowan-font-size-sm);
  --rowan-slider-focus-ring: var(--rowan-focus-ring);
  --rowan-form-field-fg: var(--rowan-color-fg);
  --rowan-form-field-gap: var(--rowan-space-2);
  --rowan-form-field-label-fg: var(--rowan-color-fg);
  --rowan-form-field-label-font-size: var(--rowan-font-size-sm);
  --rowan-form-field-label-gap: var(--rowan-space-2);
  --rowan-form-field-label-align: start;
  --rowan-form-field-required-fg: var(--rowan-color-danger);
  --rowan-form-field-required-font-size: 0.75rem;
  --rowan-form-field-hint-fg: var(--rowan-color-muted);
  --rowan-form-field-error-fg: var(--rowan-color-danger);
  --rowan-form-field-support-gap: var(--rowan-space-1);
  --rowan-form-field-support-font-size: 0.8125rem;
  --rowan-form-layout-gap: var(--rowan-space-5);
  --rowan-form-layout-min-column-width: 14rem;
  --rowan-form-layout-label-width: 10rem;
  --rowan-listbox-bg: var(--rowan-field-bg);
  --rowan-listbox-border: var(--rowan-color-border);
  --rowan-listbox-radius: var(--rowan-radius-md);
  --rowan-listbox-padding: var(--rowan-space-1);
  --rowan-listbox-disabled-opacity: 0.55;
  --rowan-option-bg: transparent;
  --rowan-option-fg: var(--rowan-color-fg);
  --rowan-option-muted-fg: var(--rowan-color-muted);
  --rowan-option-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-option-selected-bg: color-mix(in srgb, var(--rowan-color-accent) 14%, transparent);
  --rowan-option-selected-fg: var(--rowan-color-fg);
  --rowan-option-focus-ring: var(--rowan-focus-ring);
  --rowan-option-radius: var(--rowan-radius-sm);
  --rowan-option-font-family: var(--rowan-font-family);
  --rowan-option-font-size: var(--rowan-font-size-sm);
  --rowan-option-gap: var(--rowan-space-2);
  --rowan-option-min-block-size: 2.25rem;
  --rowan-option-padding: var(--rowan-space-2) var(--rowan-space-3);
  --rowan-multi-select-combobox-bg: var(--rowan-field-bg);
  --rowan-multi-select-combobox-fg: var(--rowan-color-fg);
  --rowan-multi-select-combobox-border: var(--rowan-color-border);
  --rowan-multi-select-combobox-focus-ring: var(--rowan-focus-ring);
  --rowan-multi-select-combobox-radius: var(--rowan-radius-md);
  --rowan-multi-select-combobox-font-family: var(--rowan-font-family);
  --rowan-multi-select-combobox-font-size: var(--rowan-font-size-sm);
  --rowan-multi-select-combobox-gap: var(--rowan-space-2);
  --rowan-multi-select-combobox-padding: var(--rowan-space-2) var(--rowan-space-3);
  --rowan-multi-select-combobox-chip-bg: color-mix(
    in srgb,
    var(--rowan-color-accent) 12%,
    transparent
  );
  --rowan-multi-select-combobox-chip-fg: var(--rowan-color-fg);
  --rowan-multi-select-combobox-panel-bg: var(--rowan-field-bg);
  --rowan-multi-select-combobox-panel-border: var(--rowan-color-border);
  --rowan-multi-select-combobox-panel-max-block-size: 16rem;
  --rowan-multi-select-combobox-empty-fg: var(--rowan-color-muted);
  --rowan-segmented-control-bg: var(--rowan-field-bg);
  --rowan-segmented-control-border: var(--rowan-color-border);
  --rowan-segmented-control-fg: var(--rowan-color-fg);
  --rowan-segmented-control-muted-fg: var(--rowan-color-muted);
  --rowan-segmented-control-active-bg: var(--rowan-color-accent);
  --rowan-segmented-control-active-fg: #ffffff;
  --rowan-segmented-control-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-segmented-control-focus-ring: var(--rowan-focus-ring);
  --rowan-segmented-control-radius: var(--rowan-radius-md);
  --rowan-segmented-control-font-family: var(--rowan-font-family);
  --rowan-segmented-control-font-size: var(--rowan-font-size-sm);
  --rowan-segmented-control-font-weight: 600;
  --rowan-segmented-control-gap: var(--rowan-space-1);
  --rowan-segmented-control-padding: var(--rowan-space-1);
  --rowan-segmented-control-button-padding: 0.4rem var(--rowan-space-3);
  --rowan-segmented-control-min-block-size: 2.25rem;
  --rowan-table-toolbar-bg: var(--rowan-color-bg);
  --rowan-table-toolbar-fg: var(--rowan-color-fg);
  --rowan-table-toolbar-border: var(--rowan-color-border);
  --rowan-table-toolbar-radius: var(--rowan-radius-md);
  --rowan-table-toolbar-gap: var(--rowan-space-3);
  --rowan-table-toolbar-padding: var(--rowan-space-3) var(--rowan-space-4);
  --rowan-table-toolbar-min-block-size: 3.25rem;
  --rowan-table-toolbar-control-gap: var(--rowan-space-2);
  --rowan-table-toolbar-selection-bg: color-mix(
    in srgb,
    var(--rowan-color-accent) 10%,
    transparent
  );
  --rowan-table-toolbar-selection-border: color-mix(
    in srgb,
    var(--rowan-color-accent) 42%,
    var(--rowan-color-border)
  );
  --rowan-table-toolbar-selection-fg: var(--rowan-color-fg);
  --rowan-table-toolbar-selection-radius: var(--rowan-radius-sm);
  --rowan-table-toolbar-selection-font-size: var(--rowan-font-size-sm);
  --rowan-table-toolbar-selection-padding: var(--rowan-space-1) var(--rowan-space-2);
  --rowan-bulk-actions-bar-bg: var(--rowan-color-bg);
  --rowan-bulk-actions-bar-fg: var(--rowan-color-fg);
  --rowan-bulk-actions-bar-border: var(--rowan-color-border);
  --rowan-bulk-actions-bar-radius: var(--rowan-radius-md);
  --rowan-bulk-actions-bar-gap: var(--rowan-space-3);
  --rowan-bulk-actions-bar-padding: var(--rowan-space-3) var(--rowan-space-4);
  --rowan-bulk-actions-bar-control-gap: var(--rowan-space-2);
  --rowan-bulk-actions-bar-selection-bg: color-mix(
    in srgb,
    var(--rowan-color-accent) 10%,
    transparent
  );
  --rowan-bulk-actions-bar-selection-border: color-mix(
    in srgb,
    var(--rowan-color-accent) 42%,
    var(--rowan-color-border)
  );
  --rowan-bulk-actions-bar-selection-fg: var(--rowan-color-fg);
  --rowan-bulk-actions-bar-selection-radius: var(--rowan-radius-sm);
  --rowan-bulk-actions-bar-selection-font-size: var(--rowan-font-size-sm);
  --rowan-bulk-actions-bar-selection-padding: var(--rowan-space-1) var(--rowan-space-2);
  --rowan-bulk-actions-bar-clear-bg: transparent;
  --rowan-bulk-actions-bar-clear-border: transparent;
  --rowan-bulk-actions-bar-clear-fg: var(--rowan-color-accent);
  --rowan-filter-builder-bg: var(--rowan-color-bg);
  --rowan-filter-builder-border: var(--rowan-color-border);
  --rowan-filter-builder-fg: var(--rowan-color-fg);
  --rowan-filter-builder-muted-fg: var(--rowan-color-muted);
  --rowan-filter-builder-control-bg: var(--rowan-color-bg);
  --rowan-filter-builder-control-border: var(--rowan-color-border);
  --rowan-filter-builder-control-focus: var(--rowan-color-accent);
  --rowan-filter-builder-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-filter-builder-action-fg: var(--rowan-color-accent);
  --rowan-filter-builder-radius-sm: var(--rowan-radius-sm);
  --rowan-filter-builder-radius: var(--rowan-radius-md);
  --rowan-filter-builder-gap: var(--rowan-space-3);
  --rowan-filter-builder-control-gap: var(--rowan-space-2);
  --rowan-filter-builder-padding: var(--rowan-space-4);
  --rowan-filter-builder-font-size: var(--rowan-font-size-sm);
  --rowan-row-details-panel-bg: var(--rowan-color-bg);
  --rowan-row-details-panel-fg: var(--rowan-color-fg);
  --rowan-row-details-panel-muted-fg: var(--rowan-color-muted);
  --rowan-row-details-panel-border: var(--rowan-color-border);
  --rowan-row-details-panel-backdrop: var(--rowan-overlay-backdrop);
  --rowan-row-details-panel-shadow: 0 10px 28px rgb(16 38 28 / 18%);
  --rowan-row-details-panel-width: 30rem;
  --rowan-row-details-panel-radius: var(--rowan-radius-lg);
  --rowan-row-details-panel-padding: var(--rowan-space-5);
  --rowan-row-details-panel-gap: var(--rowan-space-4);
  --rowan-row-details-panel-field-gap: var(--rowan-space-1);
  --rowan-row-details-panel-field-padding: var(--rowan-space-3) 0;
  --rowan-row-details-panel-focus: var(--rowan-color-accent);
  --rowan-row-details-panel-z-index: 100;
  --rowan-tree-fg: var(--rowan-color-fg);
  --rowan-tree-font-family: var(--rowan-font-family);
  --rowan-tree-item-fg: var(--rowan-color-fg);
  --rowan-tree-item-muted-fg: var(--rowan-color-muted);
  --rowan-tree-item-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-tree-item-selected-bg: color-mix(in srgb, var(--rowan-color-accent) 14%, transparent);
  --rowan-tree-item-selected-fg: var(--rowan-color-fg);
  --rowan-tree-item-children-border: var(--rowan-color-border);
  --rowan-tree-item-focus-ring: var(--rowan-focus-ring);
  --rowan-tree-item-radius: var(--rowan-radius-sm);
  --rowan-tree-item-font-family: var(--rowan-font-family);
  --rowan-tree-item-font-size: var(--rowan-font-size-sm);
  --rowan-tree-item-gap: var(--rowan-space-2);
  --rowan-tree-item-min-block-size: 2rem;
  --rowan-tree-item-padding: 0.35rem var(--rowan-space-2);
  --rowan-tree-item-children-indent: 0.85rem;
  --rowan-tree-item-children-padding: var(--rowan-space-2);
  --rowan-command-item-fg: var(--rowan-color-fg);
  --rowan-command-item-muted-fg: var(--rowan-color-muted);
  --rowan-command-item-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-command-item-active-bg: color-mix(in srgb, var(--rowan-color-accent) 14%, transparent);
  --rowan-command-item-active-fg: var(--rowan-color-fg);
  --rowan-command-item-shortcut-bg: var(--rowan-color-bg);
  --rowan-command-item-shortcut-border: var(--rowan-color-border);
  --rowan-command-item-shortcut-radius: var(--rowan-radius-sm);
  --rowan-command-item-focus-ring: var(--rowan-focus-ring);
  --rowan-command-item-radius: var(--rowan-radius-sm);
  --rowan-command-item-font-family: var(--rowan-font-family);
  --rowan-command-item-font-size: var(--rowan-font-size-sm);
  --rowan-command-item-muted-font-size: 0.75rem;
  --rowan-command-item-shortcut-font-size: 0.7rem;
  --rowan-command-item-line-height: var(--rowan-line-height);
  --rowan-command-item-border-width: var(--rowan-border-width);
  --rowan-command-item-gap: var(--rowan-space-3);
  --rowan-command-item-meta-gap: var(--rowan-space-2);
  --rowan-command-item-content-gap: 0.1rem;
  --rowan-command-item-min-block-size: 2.75rem;
  --rowan-command-item-padding: var(--rowan-space-2) var(--rowan-space-3);
  --rowan-command-item-shortcut-line-height: 1;
  --rowan-command-item-shortcut-padding: 0.2rem 0.32rem;
  --rowan-command-palette-bg: var(--rowan-color-bg);
  --rowan-command-palette-fg: var(--rowan-color-fg);
  --rowan-command-palette-border: var(--rowan-color-border);
  --rowan-command-palette-backdrop: var(--rowan-overlay-backdrop);
  --rowan-command-palette-shadow: none;
  --rowan-command-palette-width: 38rem;
  --rowan-command-palette-radius: var(--rowan-radius-lg);
  --rowan-command-palette-font-family: var(--rowan-font-family);
  --rowan-command-palette-font-size: var(--rowan-font-size-md);
  --rowan-command-palette-close-font-size: 1.25rem;
  --rowan-command-palette-close-radius: var(--rowan-radius-sm);
  --rowan-command-palette-close-size: 2rem;
  --rowan-command-palette-close-line-height: 1;
  --rowan-command-palette-line-height: var(--rowan-line-height);
  --rowan-command-palette-border-width: var(--rowan-border-width);
  --rowan-command-palette-gap: var(--rowan-space-3);
  --rowan-command-palette-padding: var(--rowan-space-3);
  --rowan-command-palette-overlay-padding-block: var(--rowan-space-6);
  --rowan-command-palette-overlay-padding-inline: var(--rowan-space-4);
  --rowan-command-palette-mobile-overlay-padding-inline: var(--rowan-space-3);
  --rowan-command-palette-input-bg: var(--rowan-field-bg);
  --rowan-command-palette-input-fg: var(--rowan-field-fg);
  --rowan-command-palette-input-border: var(--rowan-field-border);
  --rowan-command-palette-input-focus: var(--rowan-focus-ring);
  --rowan-command-palette-input-placeholder: var(--rowan-color-muted);
  --rowan-command-palette-input-radius: var(--rowan-radius-md);
  --rowan-command-palette-input-min-block-size: 2.75rem;
  --rowan-command-palette-input-padding-inline: var(--rowan-space-3);
  --rowan-command-palette-list-gap: var(--rowan-space-1);
  --rowan-command-palette-list-max-block-size: 22rem;
  --rowan-command-palette-empty-fg: var(--rowan-color-muted);
  --rowan-command-palette-empty-padding: var(--rowan-space-4) var(--rowan-space-3);
  --rowan-command-palette-z-index: 1000;
  --rowan-overlay-backdrop: rgb(16 28 22 / 48%);
  --rowan-focus-ring: 0 0 0 2px rgb(47 106 77 / 32%);
}
`,C=`[data-theme="dark"] {
  --rowan-color-bg: #111714;
  --rowan-color-fg: #ecf0e9;
  --rowan-color-muted: #bec7bc;
  --rowan-color-accent: #7fc095;
  --rowan-color-border: #2f3d35;
  --rowan-color-danger: #e37f74;

  --rowan-button-bg: var(--rowan-color-accent);
  --rowan-button-fg: #10261c;
  --rowan-field-bg: #1a221d;
  --rowan-field-fg: var(--rowan-color-fg);
  --rowan-field-border: var(--rowan-color-border);
  --rowan-card-bg: #1a221d;
  --rowan-card-border: var(--rowan-color-border);
  --rowan-dialog-bg: #1a221d;
  --rowan-calendar-bg: var(--rowan-card-bg);
  --rowan-calendar-fg: var(--rowan-color-fg);
  --rowan-calendar-muted: var(--rowan-color-muted);
  --rowan-calendar-border: var(--rowan-color-border);
  --rowan-calendar-accent: var(--rowan-color-accent);
  --rowan-calendar-accent-contrast: #10261c;
  --rowan-segmented-control-active-fg: #10261c;
  --rowan-toast-bg: var(--rowan-card-bg);
  --rowan-toast-fg: var(--rowan-color-fg);
  --rowan-toast-border: var(--rowan-color-border);
  --rowan-toast-shadow: 0 12px 30px rgb(0 0 0 / 46%);
  --rowan-toaster-z-index: 1000;
  --rowan-overlay-backdrop: rgb(0 0 0 / 62%);
  --rowan-focus-ring: 0 0 0 2px rgb(127 192 149 / 35%);
}
`,M=`:root,
[data-theme="light"] {
  --rowan-color-bg: var(--rowan-color-sand-50);
  --rowan-color-fg: var(--rowan-color-ink-900);
  --rowan-color-muted: var(--rowan-color-ink-700);
  --rowan-color-accent: var(--rowan-color-forest-700);
  --rowan-color-border: #d8dcd5;
  --rowan-color-danger: var(--rowan-color-danger-600);

  --rowan-button-bg: var(--rowan-color-accent);
  --rowan-button-fg: #ffffff;
  --rowan-field-bg: #ffffff;
  --rowan-card-bg: #ffffff;
  --rowan-dialog-bg: #ffffff;
  --rowan-calendar-bg: var(--rowan-card-bg);
  --rowan-calendar-fg: var(--rowan-color-fg);
  --rowan-calendar-muted: var(--rowan-color-muted);
  --rowan-calendar-border: var(--rowan-color-border);
  --rowan-calendar-accent: var(--rowan-color-accent);
  --rowan-calendar-accent-contrast: #ffffff;
  --rowan-toast-bg: var(--rowan-card-bg);
  --rowan-toast-fg: var(--rowan-color-fg);
  --rowan-toast-border: var(--rowan-color-border);
  --rowan-toast-shadow: 0 10px 24px rgb(16 28 22 / 18%);
  --rowan-toaster-z-index: 1000;
  --rowan-overlay-backdrop: rgb(16 28 22 / 48%);
}
`,x=/^\s*(--rowan-[\w-]+)\s*:\s*([^;]+);/;function k(o){return o.trim().replace(/\s+/g," ")}function V(o){const n={primitive:[],semantic:[],component:[]};let a=null;for(const e of o.split(`
`)){const s=e.trim();if(s.startsWith("/*")){s.includes("Primitive layer")?a="primitive":s.includes("Semantic layer")?a="semantic":s.includes("Component layer")&&(a="component");continue}const l=e.match(x);if(!l||!a)continue;const[,N,T]=l;n[a].push({name:N,value:k(T)})}return n}function j(o){const n=new Map;for(const a of o.split(`
`)){const e=a.match(x);if(!e)continue;const[,s,l]=e;n.set(s,k(l))}return n}function t(o,n){return o.name.localeCompare(n.name,void 0,{numeric:!0})}function i(o,n){return o.filter(a=>a.name.startsWith(n))}function R(o,n){return o.filter(a=>n.some(e=>a.name.startsWith(e)))}const w=V(S),y=j(M),z=j(C),c=[...w.primitive],d=i(c,"--rowan-color-").sort(t),m=i(c,"--rowan-space-").sort(t),b=i(c,"--rowan-radius-").sort(t),g=R(c,["--rowan-font-","--rowan-line-height"]).sort(t),f=i(c,"--rowan-border-").sort(t),v=[...w.semantic].sort(t),p=[...w.component].sort(t),A=[...new Set([...y.keys(),...z.keys()])].sort((o,n)=>o.localeCompare(n,void 0,{numeric:!0})),D=A.map(o=>({name:o,light:y.get(o)||"-",dark:z.get(o)||"-"})),L=["src/tokens/tokens.css","src/tokens/themes/light.css","src/tokens/themes/dark.css"];function u(o){const n={h1:"h1",h2:"h2",p:"p",span:"span",td:"td",tr:"tr",...h(),...o.components};return r.jsxs(r.Fragment,{children:[r.jsx(P,{title:"Foundations/Tokens"}),`
`,r.jsx(n.h1,{id:"rowan-tokens",children:"Rowan Tokens"}),`
`,r.jsxs("div",{className:"tokens-page",children:[r.jsx("p",{className:"tokens-intro",children:r.jsx(n.p,{children:`Rowan token APIs are layered and stable. Primitives define scales, semantic tokens represent intent,
and component tokens bind component defaults to semantic meaning.`})}),r.jsxs("div",{className:"tokens-layer-grid",children:[r.jsxs("article",{className:"tokens-layer-card",children:[r.jsx("h3",{children:"Primitive layer"}),r.jsx("p",{children:"Raw design values: palette ramps, spacing, radius, typography, and structural constants."}),r.jsxs("span",{className:"tokens-layer-count",children:[d.length+m.length+b.length+g.length+f.length," tokens"]})]}),r.jsxs("article",{className:"tokens-layer-card",children:[r.jsx("h3",{children:"Semantic layer"}),r.jsx("p",{children:"Theme-level meaning used by components: background, foreground, accent, border, danger."}),r.jsxs("span",{className:"tokens-layer-count",children:[v.length," tokens"]})]}),r.jsxs("article",{className:"tokens-layer-card",children:[r.jsx("h3",{children:"Component layer"}),r.jsx("p",{children:"Default component hooks that map to semantic values and support local overrides."}),r.jsxs("span",{className:"tokens-layer-count",children:[p.length," tokens"]})]})]}),r.jsxs("p",{className:"tokens-note",children:[r.jsx(n.p,{children:"Source of truth:"})," ",L.join(", ")]}),r.jsx("p",{className:"tokens-theme-hint",children:r.jsx(n.p,{children:"Use the Storybook toolbar Theme toggle to inspect token behavior across light and dark modes."})})]}),`
`,r.jsx(n.h2,{id:"primitive-color",children:"Primitive: Color"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:d.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:r.jsx(n.span,{className:"tokens-preview-color",style:{background:`var(${a.name})`}})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"primitive-space",children:"Primitive: Space"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:m.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:r.jsx(n.span,{className:"tokens-preview-space",style:{width:`var(${a.name})`}})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"primitive-radius",children:"Primitive: Radius"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:b.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:r.jsx(n.span,{className:"tokens-preview-radius",style:{borderRadius:`var(${a.name})`}})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"primitive-typography-and-structural",children:"Primitive: Typography and Structural"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:[...g,...f].map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:r.jsx(n.span,{className:"tokens-preview-font",children:"Ag"})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"semantic-tokens",children:"Semantic Tokens"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:v.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:a.name.includes("color")?r.jsx(n.span,{className:"tokens-preview-color",style:{background:`var(${a.name})`}}):r.jsx(n.span,{className:"tokens-preview-font",children:"Ag"})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"component-tokens",children:"Component Tokens"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Value"}),r.jsx("th",{children:"Preview"})]})}),r.jsx("tbody",{children:p.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.value}),r.jsx(n.td,{children:r.jsx(n.span,{className:"tokens-preview",children:a.name.includes("color")||a.name.endsWith("-bg")||a.name.endsWith("-border")?r.jsx(n.span,{className:"tokens-preview-color",style:{background:`var(${a.name})`}}):r.jsx(n.span,{className:"tokens-preview-font",children:"Ag"})})})]},a.name))})]})}),`
`,r.jsx(n.h2,{id:"theme-comparison",children:"Theme Comparison"}),`
`,r.jsx("div",{className:"tokens-table-wrap",children:r.jsxs("table",{className:"tokens-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Token"}),r.jsx("th",{children:"Light"}),r.jsx("th",{children:"Dark"})]})}),r.jsx("tbody",{children:D.map(a=>r.jsxs(n.tr,{children:[r.jsx(n.td,{className:"tokens-name",children:a.name}),r.jsx(n.td,{className:"tokens-value",children:a.light}),r.jsx(n.td,{className:"tokens-value",children:a.dark})]},a.name))})]})})]})}function _(o={}){const{wrapper:n}={...h(),...o.components};return n?r.jsx(n,{...o,children:r.jsx(u,{...o})}):u(o)}export{_ as default};
