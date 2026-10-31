const KEY = "rowan-admin-settings";

export const DEFAULT_SETTINGS = Object.freeze({
  workspace: "Lumen Goods",
  supportEmail: "ops@lumen.example",
  timezone: "America/Los_Angeles",
  currency: "USD",
  weekStart: "monday",
  digest: true,
  desktopAlerts: true,
  lowStock: true,
  includeArchived: false,
  density: "md",
  stockThreshold: 24,
  warehouse: "seattle",
});

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? { ...DEFAULT_SETTINGS, ...parsed }
      : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(next) {
  const value = { ...DEFAULT_SETTINGS, ...next };
  localStorage.setItem(KEY, JSON.stringify(value));
  return value;
}

export function clearSettings() {
  localStorage.removeItem(KEY);
}
