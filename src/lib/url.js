const ALLOWED_NAVIGATION_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function getBaseUrl() {
  const locationHref = globalThis.location?.href;
  return typeof locationHref === "string" && locationHref.length > 0
    ? locationHref
    : "https://rowan.invalid/";
}

export function sanitizeNavigationHref(value, fallback = "#") {
  const href = String(value ?? "").trim();
  if (!href) return fallback;

  try {
    const url = new URL(href, getBaseUrl());
    return ALLOWED_NAVIGATION_PROTOCOLS.has(url.protocol) ? href : fallback;
  } catch {
    return fallback;
  }
}
