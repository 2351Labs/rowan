// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.
// Per-prefix chunks. Basic controls import only the prefixes they declare.
const partLoaders = [
  ["--rowan-multi-select-combobox-", () => import("./parts/multi-select-combobox.js")],
  ["--rowan-segmented-control-", () => import("./parts/segmented-control.js")],
  ["--rowan-rich-text-editor-", () => import("./parts/rich-text-editor.js")],
  ["--rowan-side-nav-section-", () => import("./parts/side-nav-section.js")],
  ["--rowan-status-indicator-", () => import("./parts/status-indicator.js")],
  ["--rowan-confirm-dialog-", () => import("./parts/confirm-dialog.js")],
  ["--rowan-side-nav-item-", () => import("./parts/side-nav-item.js")],
  ["--rowan-color-picker-", () => import("./parts/color-picker.js")],
  ["--rowan-context-menu-", () => import("./parts/context-menu.js")],
  ["--rowan-virtual-list-", () => import("./parts/virtual-list.js")],
  ["--rowan-form-layout-", () => import("./parts/form-layout.js")],
  ["--rowan-trend-chart-", () => import("./parts/trend-chart.js")],
  ["--rowan-app-layout-", () => import("./parts/app-layout.js")],
  ["--rowan-form-field-", () => import("./parts/form-field.js")],
  ["--rowan-split-pane-", () => import("./parts/split-pane.js")],
  ["--rowan-carousel-", () => import("./parts/carousel.js")],
  ["--rowan-side-nav-", () => import("./parts/side-nav.js")],
  ["--rowan-skeleton-", () => import("./parts/skeleton.js")],
  ["--rowan-listbox-", () => import("./parts/listbox.js")],
  ["--rowan-button-", () => import("./parts/button.js")],
  ["--rowan-option-", () => import("./parts/option.js")],
  ["--rowan-rating-", () => import("./parts/rating.js")],
  ["--rowan-slider-", () => import("./parts/slider.js")],
  ["--rowan-image-", () => import("./parts/image.js")],
  ["--rowan-table-", () => import("./parts/table.js")],
  ["--rowan-chip-", () => import("./parts/chip.js")],
];

const resolvedStyles = new Map();
const pendingStyles = new Map();

function cacheKey(prefixes) {
  return prefixes.join("\0");
}

function cssForDeclarations(declarations) {
  if (declarations.length === 0) return "";
  const body = declarations.map(([name, value]) => "  " + name + ": " + value + ";").join("\n");
  return ":host {\n" + body + "\n}";
}

function styleFromModules(modules, prefixes) {
  const declarations = modules
    .flatMap((part) => part.declarations)
    .filter(([name]) => prefixes.some((prefix) => name.startsWith(prefix)));
  return {
    names: declarations.map(([name]) => name),
    cssText: cssForDeclarations(declarations),
  };
}

export function componentTokensFromDeclarations(declarations, prefixes) {
  const matched = declarations.filter(([name]) =>
    prefixes.some((prefix) => name.startsWith(prefix)),
  );
  return {
    names: matched.map(([name]) => name),
    cssText: cssForDeclarations(matched),
  };
}

export function peekComponentTokens(prefixes) {
  return resolvedStyles.get(cacheKey(prefixes)) ?? null;
}

export function loadComponentTokens(prefixes) {
  const key = cacheKey(prefixes);
  const resolved = resolvedStyles.get(key);
  if (resolved) return Promise.resolve(resolved);

  const pending = pendingStyles.get(key);
  if (pending) return pending;

  const loaders = partLoaders.filter(([partPrefix]) =>
    prefixes.some((prefix) => partPrefix.startsWith(prefix)),
  );
  const promise = Promise.all(loaders.map(([, load]) => load())).then((modules) => {
    const style = styleFromModules(modules, prefixes);
    resolvedStyles.set(key, style);
    pendingStyles.delete(key);
    return style;
  });
  pendingStyles.set(key, promise);
  return promise;
}
