const KEY = "rowan-starter-theme";
const CHARTS = "rowan-trend-chart, rowan-stacked-bar-chart, rowan-donut-chart";

export function getTheme() {
  const current = document.documentElement.dataset.theme;
  if (current === "dark" || current === "light") return current;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Private browsing can reject storage. The document theme still updates.
  }
  return next;
}

export function toggleTheme() {
  return applyTheme(getTheme() === "dark" ? "light" : "dark");
}

export function themeToggleLabel(theme) {
  return theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

export function themeToggleIcon(theme) {
  return theme === "dark" ? "sun" : "moon";
}

export function foldChartTables(root = document) {
  for (const chart of root.querySelectorAll(CHARTS)) {
    const details = chart.shadowRoot?.querySelector("details");
    if (details) details.open = false;
  }
}

export function markReady(root = document) {
  queueMicrotask(() => {
    foldChartTables(root);
    const app = root.querySelector?.("#app") ?? root;
    if (app instanceof HTMLElement) app.dataset.ready = "true";
  });
}
