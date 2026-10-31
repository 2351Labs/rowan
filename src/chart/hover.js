/**
 * @param {string[]} lines
 * @returns {string}
 */
export function formatHoverLines(lines) {
  return lines.filter((line) => Boolean(line && String(line).trim())).join("\n");
}

export function createChartHoverBubble() {
  const bubble = document.createElement("div");
  bubble.className = "hover";
  bubble.setAttribute("part", "hover");
  bubble.setAttribute("role", "tooltip");
  bubble.hidden = true;
  return bubble;
}


export function readHiddenSeries(host) {
  return String(host.getAttribute("hidden-series") || "")
    .split(/[\s,]+/)
    .map((id) => id.trim())
    .filter(Boolean);
}

export function writeHiddenSeries(host, value) {
  const ids = Array.isArray(value)
    ? value.map((id) => String(id ?? "").trim()).filter(Boolean)
    : String(value ?? "")
        .split(/[\s,]+/)
        .map((id) => id.trim())
        .filter(Boolean);
  const next = ids.join(" ");
  if ((host.getAttribute("hidden-series") || "") === next) return;
  if (next) host.setAttribute("hidden-series", next);
  else host.removeAttribute("hidden-series");
}

const tooltipFormatters = new WeakMap();

export function readTooltipFormatter(host) {
  return tooltipFormatters.get(host) || null;
}

export function writeTooltipFormatter(host, value) {
  if (typeof value === "function") tooltipFormatters.set(host, value);
  else tooltipFormatters.delete(host);
}

export function hideChartHover(bubble) {
  if (!bubble) return;

  bubble.textContent = "";
  bubble.hidden = true;
  if (typeof bubble.hidePopover !== "function") return;

  try {
    if (bubble.matches(":popover-open")) bubble.hidePopover();
  } catch {
    return;
  }
}

export function showChartHover(bubble, text, clientX, clientY) {
  if (!bubble) return;

  const content = String(text ?? "").trim();
  if (!content) {
    hideChartHover(bubble);
    return;
  }

  bubble.textContent = content;
  bubble.hidden = false;
  bubble.style.top = `${Math.round(clientY + 12)}px`;
  bubble.style.left = `${Math.round(clientX)}px`;

  if (typeof bubble.showPopover !== "function") return;

  if (bubble.getAttribute("popover") !== "manual") {
    bubble.setAttribute("popover", "manual");
  }

  try {
    if (!bubble.matches(":popover-open")) bubble.showPopover();
  } catch {
    bubble.hidden = false;
  }
}

/**
 * @param {import("../lib/base-element.js").BaseElement} element
 * @param {{
 *   target: EventTarget,
 *   bubble: HTMLElement,
 *   textForEvent: (event: PointerEvent) => string,
 * }} options
 */
function tooltipText(element, event, textForEvent) {
  const fallback = String(textForEvent(event) ?? "");
  const formatter = tooltipFormatters.get(element);
  if (formatter) {
    const next = formatter({ text: fallback, event, host: element });
    if (next != null && next !== false) return String(next);
  }
  const slot = element.querySelector?.('[slot="tooltip"]');
  const slotted = slot?.textContent?.trim();
  return slotted || fallback;
}

export function bindChartHover(element, { target, bubble, textForEvent }) {
  const show = (event) => {
    const node = event.type === "focusin" && event.target instanceof Element ? event.target : null;
    const box = node?.getBoundingClientRect();
    const x = box ? box.left + box.width / 2 : event.clientX;
    const y = box ? box.top : event.clientY;
    showChartHover(bubble, tooltipText(element, event, textForEvent), x, y);
  };
  const hide = () => hideChartHover(bubble);
  element.listen(target, "pointermove", show);
  element.listen(target, "pointerleave", hide);
  element.listen(target, "pointercancel", hide);
  element.listen(target, "focusin", show);
  element.listen(target, "focusout", hide);
  element.addCleanup(hide, { persist: true });
}

export function hoverKeyFromEvent(event) {
  const node = event.target;
  if (!(node instanceof Element)) return "";
  return node.closest("[data-point-key]")?.getAttribute("data-point-key") || "";
}

export function seriesHoverText(entries, event) {
  const key = hoverKeyFromEvent(event);
  const entry = entries.find((item) => item.key === key);
  if (!entry) return "";
  return `${entry.series.label}, ${entry.label}: ${entry.formattedValue}`;
}

export function referenceLineHoverText(event, fallbackLabel = "Reference") {
  const node = event.target;
  if (!(node instanceof Element)) return "";
  const hit = node.closest("[data-ref-line]");
  if (!hit) return "";
  return formatHoverLines([
    hit.getAttribute("data-ref-label") || fallbackLabel,
    hit.getAttribute("data-ref-value"),
  ]);
}

/**
 * @template {{ x: number }} T
 * @param {SVGSVGElement} svg
 * @param {T[]} points
 * @param {number} clientX
 * @returns {T | null}
 */
export function nearestPointByClientX(svg, points, clientX) {
  if (!points.length) return null;

  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const width = viewBox && viewBox.width ? viewBox.width : 100;
  const x =
    rect.width > 0 ? ((clientX - rect.left) / rect.width) * width : points[points.length - 1].x;

  let best = points[0];
  let bestDist = Math.abs(points[0].x - x);
  for (const point of points) {
    const dist = Math.abs(point.x - x);
    if (dist < bestDist) {
      best = point;
      bestDist = dist;
    }
  }
  return best;
}
