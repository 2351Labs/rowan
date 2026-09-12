var _=Object.defineProperty;var E=o=>{throw TypeError(o)};var $=(o,a,r)=>a in o?_(o,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[a]=r;var m=(o,a,r)=>$(o,typeof a!="symbol"?a+"":a,r),P=(o,a,r)=>a.has(o)||E("Cannot "+r);var e=(o,a,r)=>(P(o,a,"read from private field"),r?r.call(o):a.get(o)),l=(o,a,r)=>a.has(o)?E("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(o):a.set(o,r),c=(o,a,r,n)=>(P(o,a,"write to private field"),n?n.call(o,r):a.set(o,r),r),w=(o,a,r)=>(P(o,a,"access private method"),r);function B(o,a){return o.hasAttribute(a)}function rr(o,a,r){if(r){o.setAttribute(a,"");return}o.removeAttribute(a)}function or(o,a,r=""){return o.getAttribute(a)??r}function ar(o,a,r){if(r==null||r===""){o.removeAttribute(a);return}o.setAttribute(a,String(r))}function nr(o,a,r=0){const n=o.getAttribute(a);if(n==null)return r;const i=Number(n);return Number.isFinite(i)?i:r}function er(o,a,r){if(r==null||!Number.isFinite(r)){o.removeAttribute(a);return}o.setAttribute(a,String(r))}const F=`
:root,
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
  --rowan-virtual-list-bg: var(--rowan-color-bg);
  --rowan-virtual-list-fg: var(--rowan-color-fg);
  --rowan-virtual-list-border-color: var(--rowan-color-border);
  --rowan-virtual-list-radius: var(--rowan-radius-md);
  --rowan-virtual-list-height: 20rem;
  --rowan-split-pane-gap: 0;
  --rowan-split-pane-separator-size: 0.5rem;
  --rowan-split-pane-separator-color: var(--rowan-color-border);
  --rowan-split-pane-separator-active-color: var(--rowan-color-accent);
  --rowan-split-pane-focus-ring: var(--rowan-focus-ring);
  --rowan-split-pane-disabled-opacity: 0.55;
  --rowan-app-layout-bg: var(--rowan-color-bg);
  --rowan-app-layout-fg: var(--rowan-color-fg);
  --rowan-app-layout-header-bg: var(--rowan-color-bg);
  --rowan-app-layout-header-border: var(--rowan-color-border);
  --rowan-app-layout-navigation-bg: var(--rowan-color-bg);
  --rowan-app-layout-navigation-border: var(--rowan-color-border);
  --rowan-app-layout-navigation-width: 17rem;
  --rowan-app-layout-content-padding: var(--rowan-space-5);
  --rowan-app-layout-focus-ring: var(--rowan-focus-ring);
  --rowan-app-layout-backdrop: rgb(16 38 28 / 44%);
  --rowan-app-layout-min-block-size: 100dvh;
  --rowan-app-layout-header-min-block-size: 3.75rem;
  --rowan-app-layout-header-padding: var(--rowan-space-3) var(--rowan-space-5);
  --rowan-app-layout-navigation-padding: var(--rowan-space-4);
  --rowan-app-layout-mobile-navigation-width: 21rem;
  --rowan-app-layout-mobile-content-padding: var(--rowan-space-4);
  --rowan-side-nav-gap: var(--rowan-space-1);
  --rowan-side-nav-item-fg: var(--rowan-color-fg);
  --rowan-side-nav-item-muted-fg: var(--rowan-color-muted);
  --rowan-side-nav-item-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-side-nav-item-active-bg: color-mix(in srgb, var(--rowan-color-accent) 15%, transparent);
  --rowan-side-nav-item-active-fg: var(--rowan-color-fg);
  --rowan-side-nav-item-focus-ring: var(--rowan-focus-ring);
  --rowan-side-nav-item-radius: var(--rowan-radius-sm);
  --rowan-side-nav-item-font-family: var(--rowan-font-family);
  --rowan-side-nav-item-font-size: var(--rowan-font-size-sm);
  --rowan-side-nav-item-gap: var(--rowan-space-2);
  --rowan-side-nav-item-min-block-size: 2.5rem;
  --rowan-side-nav-item-padding: 0.45rem var(--rowan-space-3);
  --rowan-table-virtual-height: 32rem;
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

`,M=`
:host {
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
  --rowan-virtual-list-bg: var(--rowan-color-bg);
  --rowan-virtual-list-fg: var(--rowan-color-fg);
  --rowan-virtual-list-border-color: var(--rowan-color-border);
  --rowan-virtual-list-radius: var(--rowan-radius-md);
  --rowan-virtual-list-height: 20rem;
  --rowan-split-pane-gap: 0;
  --rowan-split-pane-separator-size: 0.5rem;
  --rowan-split-pane-separator-color: var(--rowan-color-border);
  --rowan-split-pane-separator-active-color: var(--rowan-color-accent);
  --rowan-split-pane-focus-ring: var(--rowan-focus-ring);
  --rowan-split-pane-disabled-opacity: 0.55;
  --rowan-app-layout-bg: var(--rowan-color-bg);
  --rowan-app-layout-fg: var(--rowan-color-fg);
  --rowan-app-layout-header-bg: var(--rowan-color-bg);
  --rowan-app-layout-header-border: var(--rowan-color-border);
  --rowan-app-layout-navigation-bg: var(--rowan-color-bg);
  --rowan-app-layout-navigation-border: var(--rowan-color-border);
  --rowan-app-layout-navigation-width: 17rem;
  --rowan-app-layout-content-padding: var(--rowan-space-5);
  --rowan-app-layout-focus-ring: var(--rowan-focus-ring);
  --rowan-app-layout-backdrop: rgb(16 38 28 / 44%);
  --rowan-app-layout-min-block-size: 100dvh;
  --rowan-app-layout-header-min-block-size: 3.75rem;
  --rowan-app-layout-header-padding: var(--rowan-space-3) var(--rowan-space-5);
  --rowan-app-layout-navigation-padding: var(--rowan-space-4);
  --rowan-app-layout-mobile-navigation-width: 21rem;
  --rowan-app-layout-mobile-content-padding: var(--rowan-space-4);
  --rowan-side-nav-gap: var(--rowan-space-1);
  --rowan-side-nav-item-fg: var(--rowan-color-fg);
  --rowan-side-nav-item-muted-fg: var(--rowan-color-muted);
  --rowan-side-nav-item-hover-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, transparent);
  --rowan-side-nav-item-active-bg: color-mix(in srgb, var(--rowan-color-accent) 15%, transparent);
  --rowan-side-nav-item-active-fg: var(--rowan-color-fg);
  --rowan-side-nav-item-focus-ring: var(--rowan-focus-ring);
  --rowan-side-nav-item-radius: var(--rowan-radius-sm);
  --rowan-side-nav-item-font-family: var(--rowan-font-family);
  --rowan-side-nav-item-font-size: var(--rowan-font-size-sm);
  --rowan-side-nav-item-gap: var(--rowan-space-2);
  --rowan-side-nav-item-min-block-size: 2.5rem;
  --rowan-side-nav-item-padding: 0.45rem var(--rowan-space-3);
  --rowan-table-virtual-height: 32rem;
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
`,tr=[{name:"--rowan-color-forest-900",syntax:"*",inherits:!0,initialValue:"#10261c"},{name:"--rowan-color-forest-800",syntax:"*",inherits:!0,initialValue:"#153224"},{name:"--rowan-color-forest-700",syntax:"*",inherits:!0,initialValue:"#1d432f"},{name:"--rowan-color-forest-600",syntax:"*",inherits:!0,initialValue:"#24543c"},{name:"--rowan-color-forest-500",syntax:"*",inherits:!0,initialValue:"#2f6a4d"},{name:"--rowan-color-sand-50",syntax:"*",inherits:!0,initialValue:"#f8f7f2"},{name:"--rowan-color-sand-100",syntax:"*",inherits:!0,initialValue:"#efede4"},{name:"--rowan-color-ink-900",syntax:"*",inherits:!0,initialValue:"#1f2421"},{name:"--rowan-color-ink-700",syntax:"*",inherits:!0,initialValue:"#424945"},{name:"--rowan-color-danger-600",syntax:"*",inherits:!0,initialValue:"#b4392d"},{name:"--rowan-color-danger-700",syntax:"*",inherits:!0,initialValue:"#972d22"},{name:"--rowan-space-1",syntax:"*",inherits:!0,initialValue:"0.25rem"},{name:"--rowan-space-2",syntax:"*",inherits:!0,initialValue:"0.5rem"},{name:"--rowan-space-3",syntax:"*",inherits:!0,initialValue:"0.75rem"},{name:"--rowan-space-4",syntax:"*",inherits:!0,initialValue:"1rem"},{name:"--rowan-space-5",syntax:"*",inherits:!0,initialValue:"1.25rem"},{name:"--rowan-space-6",syntax:"*",inherits:!0,initialValue:"1.5rem"},{name:"--rowan-space-8",syntax:"*",inherits:!0,initialValue:"2rem"},{name:"--rowan-radius-sm",syntax:"*",inherits:!0,initialValue:"0.375rem"},{name:"--rowan-radius-md",syntax:"*",inherits:!0,initialValue:"0.5rem"},{name:"--rowan-radius-lg",syntax:"*",inherits:!0,initialValue:"0.625rem"},{name:"--rowan-font-family",syntax:"*",inherits:!0,initialValue:'"Avenir Next", "Segoe UI", "Noto Sans", sans-serif'},{name:"--rowan-font-size-sm",syntax:"*",inherits:!0,initialValue:"0.875rem"},{name:"--rowan-font-size-md",syntax:"*",inherits:!0,initialValue:"1rem"},{name:"--rowan-font-size-lg",syntax:"*",inherits:!0,initialValue:"1.125rem"},{name:"--rowan-line-height",syntax:"*",inherits:!0,initialValue:"1.4"},{name:"--rowan-border-width",syntax:"*",inherits:!0,initialValue:"1px"},{name:"--rowan-color-bg",syntax:"*",inherits:!0,initialValue:"#f8f7f2"},{name:"--rowan-color-fg",syntax:"*",inherits:!0,initialValue:"#1f2421"},{name:"--rowan-color-muted",syntax:"*",inherits:!0,initialValue:"#424945"},{name:"--rowan-color-accent",syntax:"*",inherits:!0,initialValue:"#1d432f"},{name:"--rowan-color-border",syntax:"*",inherits:!0,initialValue:"#d8dcd5"},{name:"--rowan-color-danger",syntax:"*",inherits:!0,initialValue:"#b4392d"}],ir=["--rowan-button-bg","--rowan-button-fg","--rowan-button-border","--rowan-button-border-width","--rowan-button-hover-bg","--rowan-button-hover-fg","--rowan-button-hover-border","--rowan-button-active-bg","--rowan-button-active-fg","--rowan-button-active-border","--rowan-button-shadow","--rowan-button-focus-ring","--rowan-button-radius","--rowan-button-font-family","--rowan-button-font-size","--rowan-button-font-weight","--rowan-button-line-height","--rowan-button-gap","--rowan-button-min-block-size","--rowan-button-padding-inline","--rowan-button-transition","--rowan-button-disabled-opacity","--rowan-button-spinner-size","--rowan-button-spinner-border-width","--rowan-button-secondary-bg","--rowan-button-secondary-fg","--rowan-button-secondary-border","--rowan-button-secondary-hover-bg","--rowan-button-secondary-hover-border","--rowan-button-secondary-active-bg","--rowan-button-secondary-active-border","--rowan-button-secondary-shadow","--rowan-button-ghost-bg","--rowan-button-ghost-fg","--rowan-button-ghost-border","--rowan-button-ghost-hover-bg","--rowan-button-ghost-active-bg","--rowan-button-ghost-shadow","--rowan-button-danger-bg","--rowan-button-danger-fg","--rowan-button-danger-border","--rowan-button-danger-hover-bg","--rowan-button-danger-hover-border","--rowan-button-danger-active-bg","--rowan-button-danger-active-border","--rowan-button-danger-shadow","--rowan-button-sm-font-size","--rowan-button-sm-min-block-size","--rowan-button-sm-padding-inline","--rowan-button-lg-font-size","--rowan-button-lg-min-block-size","--rowan-button-lg-padding-inline","--rowan-field-bg","--rowan-field-fg","--rowan-field-border","--rowan-card-bg","--rowan-card-border","--rowan-dialog-bg","--rowan-calendar-bg","--rowan-calendar-fg","--rowan-calendar-muted","--rowan-calendar-border","--rowan-calendar-accent","--rowan-calendar-accent-contrast","--rowan-toast-bg","--rowan-toast-fg","--rowan-toast-border","--rowan-toast-shadow","--rowan-toaster-z-index","--rowan-form-wizard-fg","--rowan-form-wizard-border","--rowan-form-wizard-gap","--rowan-form-wizard-progress-padding","--rowan-form-wizard-panel-bg","--rowan-form-wizard-actions-gap","--rowan-form-wizard-actions-padding","--rowan-form-wizard-next-bg","--rowan-form-wizard-next-border","--rowan-form-wizard-next-fg","--rowan-form-wizard-previous-bg","--rowan-form-wizard-previous-border","--rowan-form-wizard-previous-fg","--rowan-form-wizard-button-radius","--rowan-form-wizard-button-min-height","--rowan-form-wizard-button-padding","--rowan-form-wizard-focus-ring","--rowan-slider-fg","--rowan-slider-track-bg","--rowan-slider-range-bg","--rowan-slider-thumb-bg","--rowan-slider-thumb-border","--rowan-slider-track-height","--rowan-slider-track-radius","--rowan-slider-thumb-size","--rowan-slider-control-height","--rowan-slider-gap","--rowan-slider-value-fg","--rowan-slider-value-font-size","--rowan-slider-focus-ring","--rowan-form-field-fg","--rowan-form-field-gap","--rowan-form-field-label-fg","--rowan-form-field-label-font-size","--rowan-form-field-label-gap","--rowan-form-field-label-align","--rowan-form-field-required-fg","--rowan-form-field-required-font-size","--rowan-form-field-hint-fg","--rowan-form-field-error-fg","--rowan-form-field-support-gap","--rowan-form-field-support-font-size","--rowan-form-layout-gap","--rowan-form-layout-min-column-width","--rowan-form-layout-label-width","--rowan-listbox-bg","--rowan-listbox-border","--rowan-listbox-radius","--rowan-listbox-padding","--rowan-listbox-disabled-opacity","--rowan-option-bg","--rowan-option-fg","--rowan-option-muted-fg","--rowan-option-hover-bg","--rowan-option-selected-bg","--rowan-option-selected-fg","--rowan-option-focus-ring","--rowan-option-radius","--rowan-option-font-family","--rowan-option-font-size","--rowan-option-gap","--rowan-option-min-block-size","--rowan-option-padding","--rowan-multi-select-combobox-bg","--rowan-multi-select-combobox-fg","--rowan-multi-select-combobox-border","--rowan-multi-select-combobox-focus-ring","--rowan-multi-select-combobox-radius","--rowan-multi-select-combobox-font-family","--rowan-multi-select-combobox-font-size","--rowan-multi-select-combobox-gap","--rowan-multi-select-combobox-padding","--rowan-multi-select-combobox-chip-bg","--rowan-multi-select-combobox-chip-fg","--rowan-multi-select-combobox-panel-bg","--rowan-multi-select-combobox-panel-border","--rowan-multi-select-combobox-panel-max-block-size","--rowan-multi-select-combobox-empty-fg","--rowan-segmented-control-bg","--rowan-segmented-control-border","--rowan-segmented-control-fg","--rowan-segmented-control-muted-fg","--rowan-segmented-control-active-bg","--rowan-segmented-control-active-fg","--rowan-segmented-control-hover-bg","--rowan-segmented-control-focus-ring","--rowan-segmented-control-radius","--rowan-segmented-control-font-family","--rowan-segmented-control-font-size","--rowan-segmented-control-font-weight","--rowan-segmented-control-gap","--rowan-segmented-control-padding","--rowan-segmented-control-button-padding","--rowan-segmented-control-min-block-size","--rowan-virtual-list-bg","--rowan-virtual-list-fg","--rowan-virtual-list-border-color","--rowan-virtual-list-radius","--rowan-virtual-list-height","--rowan-split-pane-gap","--rowan-split-pane-separator-size","--rowan-split-pane-separator-color","--rowan-split-pane-separator-active-color","--rowan-split-pane-focus-ring","--rowan-split-pane-disabled-opacity","--rowan-app-layout-bg","--rowan-app-layout-fg","--rowan-app-layout-header-bg","--rowan-app-layout-header-border","--rowan-app-layout-navigation-bg","--rowan-app-layout-navigation-border","--rowan-app-layout-navigation-width","--rowan-app-layout-content-padding","--rowan-app-layout-focus-ring","--rowan-app-layout-backdrop","--rowan-app-layout-min-block-size","--rowan-app-layout-header-min-block-size","--rowan-app-layout-header-padding","--rowan-app-layout-navigation-padding","--rowan-app-layout-mobile-navigation-width","--rowan-app-layout-mobile-content-padding","--rowan-side-nav-gap","--rowan-side-nav-item-fg","--rowan-side-nav-item-muted-fg","--rowan-side-nav-item-hover-bg","--rowan-side-nav-item-active-bg","--rowan-side-nav-item-active-fg","--rowan-side-nav-item-focus-ring","--rowan-side-nav-item-radius","--rowan-side-nav-item-font-family","--rowan-side-nav-item-font-size","--rowan-side-nav-item-gap","--rowan-side-nav-item-min-block-size","--rowan-side-nav-item-padding","--rowan-table-virtual-height","--rowan-table-toolbar-bg","--rowan-table-toolbar-fg","--rowan-table-toolbar-border","--rowan-table-toolbar-radius","--rowan-table-toolbar-gap","--rowan-table-toolbar-padding","--rowan-table-toolbar-min-block-size","--rowan-table-toolbar-control-gap","--rowan-table-toolbar-selection-bg","--rowan-table-toolbar-selection-border","--rowan-table-toolbar-selection-fg","--rowan-table-toolbar-selection-radius","--rowan-table-toolbar-selection-font-size","--rowan-table-toolbar-selection-padding","--rowan-bulk-actions-bar-bg","--rowan-bulk-actions-bar-fg","--rowan-bulk-actions-bar-border","--rowan-bulk-actions-bar-radius","--rowan-bulk-actions-bar-gap","--rowan-bulk-actions-bar-padding","--rowan-bulk-actions-bar-control-gap","--rowan-bulk-actions-bar-selection-bg","--rowan-bulk-actions-bar-selection-border","--rowan-bulk-actions-bar-selection-fg","--rowan-bulk-actions-bar-selection-radius","--rowan-bulk-actions-bar-selection-font-size","--rowan-bulk-actions-bar-selection-padding","--rowan-bulk-actions-bar-clear-bg","--rowan-bulk-actions-bar-clear-border","--rowan-bulk-actions-bar-clear-fg","--rowan-filter-builder-bg","--rowan-filter-builder-border","--rowan-filter-builder-fg","--rowan-filter-builder-muted-fg","--rowan-filter-builder-control-bg","--rowan-filter-builder-control-border","--rowan-filter-builder-control-focus","--rowan-filter-builder-hover-bg","--rowan-filter-builder-action-fg","--rowan-filter-builder-radius-sm","--rowan-filter-builder-radius","--rowan-filter-builder-gap","--rowan-filter-builder-control-gap","--rowan-filter-builder-padding","--rowan-filter-builder-font-size","--rowan-row-details-panel-bg","--rowan-row-details-panel-fg","--rowan-row-details-panel-muted-fg","--rowan-row-details-panel-border","--rowan-row-details-panel-backdrop","--rowan-row-details-panel-shadow","--rowan-row-details-panel-width","--rowan-row-details-panel-radius","--rowan-row-details-panel-padding","--rowan-row-details-panel-gap","--rowan-row-details-panel-field-gap","--rowan-row-details-panel-field-padding","--rowan-row-details-panel-focus","--rowan-row-details-panel-z-index","--rowan-tree-fg","--rowan-tree-font-family","--rowan-tree-item-fg","--rowan-tree-item-muted-fg","--rowan-tree-item-hover-bg","--rowan-tree-item-selected-bg","--rowan-tree-item-selected-fg","--rowan-tree-item-children-border","--rowan-tree-item-focus-ring","--rowan-tree-item-radius","--rowan-tree-item-font-family","--rowan-tree-item-font-size","--rowan-tree-item-gap","--rowan-tree-item-min-block-size","--rowan-tree-item-padding","--rowan-tree-item-children-indent","--rowan-tree-item-children-padding","--rowan-command-item-fg","--rowan-command-item-muted-fg","--rowan-command-item-hover-bg","--rowan-command-item-active-bg","--rowan-command-item-active-fg","--rowan-command-item-shortcut-bg","--rowan-command-item-shortcut-border","--rowan-command-item-shortcut-radius","--rowan-command-item-focus-ring","--rowan-command-item-radius","--rowan-command-item-font-family","--rowan-command-item-font-size","--rowan-command-item-muted-font-size","--rowan-command-item-shortcut-font-size","--rowan-command-item-line-height","--rowan-command-item-border-width","--rowan-command-item-gap","--rowan-command-item-meta-gap","--rowan-command-item-content-gap","--rowan-command-item-min-block-size","--rowan-command-item-padding","--rowan-command-item-shortcut-line-height","--rowan-command-item-shortcut-padding","--rowan-command-palette-bg","--rowan-command-palette-fg","--rowan-command-palette-border","--rowan-command-palette-backdrop","--rowan-command-palette-shadow","--rowan-command-palette-width","--rowan-command-palette-radius","--rowan-command-palette-font-family","--rowan-command-palette-font-size","--rowan-command-palette-close-font-size","--rowan-command-palette-close-radius","--rowan-command-palette-close-size","--rowan-command-palette-close-line-height","--rowan-command-palette-line-height","--rowan-command-palette-border-width","--rowan-command-palette-gap","--rowan-command-palette-padding","--rowan-command-palette-overlay-padding-block","--rowan-command-palette-overlay-padding-inline","--rowan-command-palette-mobile-overlay-padding-inline","--rowan-command-palette-input-bg","--rowan-command-palette-input-fg","--rowan-command-palette-input-border","--rowan-command-palette-input-focus","--rowan-command-palette-input-placeholder","--rowan-command-palette-input-radius","--rowan-command-palette-input-min-block-size","--rowan-command-palette-input-padding-inline","--rowan-command-palette-list-gap","--rowan-command-palette-list-max-block-size","--rowan-command-palette-empty-fg","--rowan-command-palette-empty-padding","--rowan-command-palette-z-index","--rowan-overlay-backdrop","--rowan-focus-ring"];function wr(){if(typeof CSS>"u"||typeof CSS.registerProperty!="function")return!1;for(const o of tr)try{CSS.registerProperty(o)}catch(a){if((a==null?void 0:a.name)!=="InvalidModificationError")return!1}return!0}const V=wr(),A=typeof CSSStyleSheet>"u"?null:new CSSStyleSheet;A&&A.replaceSync(F);const R=typeof CSSStyleSheet>"u"?null:new CSSStyleSheet;R&&R.replaceSync(M);const C=typeof CSSStyleSheet<"u"&&"adoptedStyleSheets"in Document.prototype;function O(o){if(typeof getComputedStyle!="function")return!1;const a=o.constructor.componentTokenPrefixes??[];if(a.length===0)return!1;const r=getComputedStyle(o);return ir.filter(n=>a.some(i=>n.startsWith(i))).some(n=>r.getPropertyValue(n).trim().length>0)}function D(){if(typeof document>"u"||typeof getComputedStyle!="function")return!1;const o=document.documentElement;return o?["--rowan-color-bg","--rowan-color-fg","--rowan-color-accent","--rowan-color-border","--rowan-font-family","--rowan-space-1"].some(a=>getComputedStyle(o).getPropertyValue(a).trim().length>0):!1}var S,u,v,f,x,T,k,h,y,p,d,z,t,j,H,q,I,Q,W,G,L,J,K,X;class g extends HTMLElement{constructor(){super();l(this,t);l(this,S,null);l(this,u,new Set);l(this,v,new Set);l(this,f,new Set);l(this,x,!1);l(this,T,!1);l(this,k,[]);l(this,h,C?new CSSStyleSheet:null);l(this,y,null);l(this,p,null);l(this,d,null);l(this,z,null);const r={mode:"open",...this.constructor.shadowRootOptions};this.attachShadow(r),w(this,t,K).call(this),(this.constructor.formAssociated||this.constructor.useElementInternals)&&typeof this.attachInternals=="function"&&c(this,S,this.attachInternals()),w(this,t,G).call(this),w(this,t,J).call(this)}connectedCallback(){w(this,t,L).call(this),w(this,t,X).call(this),w(this,t,j).call(this),w(this,t,Q).call(this),this.requestRender()}disconnectedCallback(){w(this,t,H).call(this),w(this,t,W).call(this);for(const r of e(this,u))r();e(this,u).clear()}attributeChangedCallback(r,n,i){n!==i&&this.requestRender()}get internals(){return e(this,S)}get renderRoot(){return e(this,z)}requestRender(){e(this,x)||(c(this,x,!0),queueMicrotask(()=>{c(this,x,!1),this.isConnected&&(this.render(),c(this,T,!0))}))}render(){}setComponentStyles(r){const n=r??"";if(C&&e(this,h)){e(this,h).replaceSync(n);return}e(this,d)||(c(this,d,document.createElement("style")),this.shadowRoot.append(e(this,d))),e(this,d).textContent=n}addCleanup(r){return e(this,u).add(r),()=>e(this,u).delete(r)}listen(r,n,i,b){const s={target:r,type:n,handler:i,options:b,connected:!1};return e(this,v).add(s),w(this,t,q).call(this,s),()=>{w(this,t,I).call(this,s),e(this,v).delete(s)}}observe(r,n){const i={observer:r,restore:typeof n=="function"?n:null};return e(this,f).add(i),()=>{r.disconnect(),e(this,f).delete(i)}}reflectBoolean(r,n){rr(this,r,n)}reflectString(r,n){ar(this,r,n)}reflectNumber(r,n){er(this,r,n)}readBoolean(r){return B(this,r)}readString(r,n=""){return or(this,r,n)}readNumber(r,n=0){return nr(this,r,n)}}S=new WeakMap,u=new WeakMap,v=new WeakMap,f=new WeakMap,x=new WeakMap,T=new WeakMap,k=new WeakMap,h=new WeakMap,y=new WeakMap,p=new WeakMap,d=new WeakMap,z=new WeakMap,t=new WeakSet,j=function(){for(const r of e(this,v))w(this,t,q).call(this,r)},H=function(){for(const r of e(this,v))w(this,t,I).call(this,r)},q=function(r){r.connected||(r.target.addEventListener(r.type,r.handler,r.options),r.connected=!0)},I=function(r){r.connected&&(r.target.removeEventListener(r.type,r.handler,r.options),r.connected=!1)},Q=function(){var r;for(const n of e(this,f))(r=n.restore)==null||r.call(n)},W=function(){for(const r of e(this,f))r.observer.disconnect(),r.restore||e(this,f).delete(r)},G=function(){const r=this.constructor.styleUrl,n=typeof r=="string"&&r.length>0,i=this.constructor.styles,b=Array.isArray(i)?i.join(`
`):i??"",s=!n&&b.length>0;C?s&&e(this,h)&&e(this,h).replaceSync(b):s&&(c(this,d,document.createElement("style")),e(this,d).textContent=b,this.shadowRoot.append(e(this,d))),w(this,t,L).call(this),n&&(c(this,y,document.createElement("link")),e(this,y).rel="stylesheet",e(this,y).href=r,this.shadowRoot.append(e(this,y)))},L=function(){var b;if(C){const s=this.shadowRoot.adoptedStyleSheets.filter(U=>U!==R&&U!==A);this.shadowRoot.adoptedStyleSheets=s;const Y=V&&!O(this),Z=!V&&!D(),N=Y?R:Z?A:null;this.shadowRoot.adoptedStyleSheets=N?[N,...s]:s;return}(b=e(this,p))==null||b.remove(),c(this,p,null);const r=V&&!O(this),n=!V&&!D(),i=r?M:n?F:"";i&&(c(this,p,document.createElement("style")),this.shadowRoot.prepend(e(this,p)),e(this,p).textContent=i)},J=function(){c(this,z,document.createElement("div")),e(this,z).setAttribute("data-rowan-render-root",""),this.shadowRoot.append(e(this,z))},K=function(){const r=this.constructor.upgradeProperties??[];c(this,k,r.filter(n=>Object.prototype.hasOwnProperty.call(this,n)))},X=function(){for(const r of e(this,k)){const n=this[r];delete this[r],this[r]=n}c(this,k,[])},m(g,"shadowRootOptions",{mode:"open"}),m(g,"styles",""),m(g,"styleUrl",""),m(g,"observedAttributes",[]),m(g,"formAssociated",!1),m(g,"useElementInternals",!1),m(g,"upgradeProperties",[]),m(g,"componentTokenPrefixes",[]);function cr(o,a){customElements.get(o)||customElements.define(o,a)}export{g as B,cr as d};
