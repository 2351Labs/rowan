export function parseDocumentationRoute(hash, pageIds, fallbackPageId) {
  const value = String(hash ?? "")
    .replace(/^#/, "")
    .trim();
  const separatorIndex = value.indexOf(":");
  const requestedPageId = (separatorIndex >= 0 ? value.slice(0, separatorIndex) : value).trim();
  const requestedSectionId = separatorIndex >= 0 ? value.slice(separatorIndex + 1).trim() : "";

  if (!pageIds.has(requestedPageId)) {
    return { pageId: fallbackPageId, sectionId: "" };
  }

  return { pageId: requestedPageId, sectionId: requestedSectionId };
}

export function formatDocumentationRoute(pageId, sectionId = "") {
  const normalizedPageId = String(pageId ?? "").trim();
  const normalizedSectionId = String(sectionId ?? "").trim();
  return `#${normalizedPageId}${normalizedSectionId ? `:${normalizedSectionId}` : ""}`;
}
