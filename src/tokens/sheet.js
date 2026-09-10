export const tokenCssText = `
:root,
:host {
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

  --rowan-color-bg: var(--rowan-color-sand-50);
  --rowan-color-fg: var(--rowan-color-ink-900);
  --rowan-color-muted: var(--rowan-color-ink-700);
  --rowan-color-accent: var(--rowan-color-forest-700);
  --rowan-color-border: #d8dcd5;
  --rowan-color-danger: var(--rowan-color-danger-600);

  --rowan-button-bg: var(--rowan-color-accent);
  --rowan-button-fg: #ffffff;
  --rowan-button-border: transparent;
  --rowan-field-bg: #ffffff;
  --rowan-field-fg: var(--rowan-color-fg);
  --rowan-field-border: var(--rowan-color-border);
  --rowan-card-bg: #ffffff;
  --rowan-card-border: var(--rowan-color-border);
  --rowan-dialog-bg: #ffffff;
  --rowan-overlay-backdrop: rgb(16 28 22 / 48%);
  --rowan-focus-ring: 0 0 0 2px rgb(47 106 77 / 32%);
}
`;

export const rowanTokenStyleSheet =
  typeof CSSStyleSheet === "undefined" ? null : new CSSStyleSheet();

if (rowanTokenStyleSheet) {
  rowanTokenStyleSheet.replaceSync(tokenCssText);
}
