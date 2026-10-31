const KEY = "rowan-admin-theme";

export function getTheme() {
  const stored = localStorage.getItem(KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function initTheme() {
  apply(getTheme());
}

export function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  localStorage.setItem(KEY, next);
  apply(next);
  window.dispatchEvent(new CustomEvent("rowan-admin-theme", { detail: { theme: next } }));
  return next;
}

export function toggleTheme() {
  return setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function clearStoredTheme() {
  localStorage.removeItem(KEY);
  apply(getTheme());
  window.dispatchEvent(new CustomEvent("rowan-admin-theme", { detail: { theme: getTheme() } }));
}
