const hoverStyleUrl = new URL("./hover.css", import.meta.url).href;

/**
 * @param {string[]} lines
 * @returns {string}
 */
export function formatHoverLines(lines) {
  return lines.filter((line) => Boolean(line && String(line).trim())).join("\n");
}

export function ensureChartHoverStyles(root) {
  if (!root || root.querySelector("link[data-rowan-chart-hover]")) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = hoverStyleUrl;
  link.dataset.rowanChartHover = "";
  root.append(link);
}

export function createChartHoverBubble() {
  const bubble = document.createElement("div");
  bubble.className = "hover";
  bubble.setAttribute("part", "hover");
  bubble.setAttribute("role", "tooltip");
  bubble.setAttribute("popover", "manual");
  bubble.hidden = true;
  bubble.style.position = "fixed";
  bubble.style.inset = "auto";
  bubble.style.margin = "0";
  bubble.style.border = "var(--rowan-border-width, 1px) solid var(--rowan-color-border, #d8dcd5)";
  return bubble;
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

function positionChartHover(bubble, clientX, anchor) {
  const bounds =
    anchor instanceof Element
      ? anchor.getBoundingClientRect()
      : { left: clientX, right: clientX, top: 0, bottom: 0, height: 0 };
  const left = Math.round(
    Math.min(Math.max(clientX, bounds.left + 12), Math.max(bounds.left + 12, bounds.right - 12)),
  );
  const gap = 8;
  const below = bounds.bottom + gap;
  const bubbleHeight = bubble.offsetHeight || 48;
  const top =
    below + bubbleHeight > window.innerHeight - 8
      ? Math.max(8, bounds.top - gap - bubbleHeight)
      : below;

  bubble.style.top = `${Math.round(top)}px`;
  bubble.style.left = `${left}px`;
}

export function showChartHover(bubble, text, event, anchor) {
  if (!bubble) return;

  const content = String(text ?? "").trim();
  if (!content) {
    hideChartHover(bubble);
    return;
  }

  const clientX = event?.clientX ?? 0;
  bubble.textContent = content;
  bubble.hidden = false;

  if (typeof bubble.showPopover === "function") {
    if (bubble.getAttribute("popover") !== "manual") {
      bubble.setAttribute("popover", "manual");
    }

    try {
      if (!bubble.matches(":popover-open")) bubble.showPopover();
    } catch {
      bubble.hidden = false;
    }
  }

  positionChartHover(bubble, clientX, anchor);
}

/**
 * @param {import("../lib/base-element.js").BaseElement} element
 * @param {{
 *   target: EventTarget,
 *   bubble: HTMLElement,
 *   textForEvent: (event: PointerEvent) => string,
 *   anchor?: Element,
 * }} options
 */
export function bindChartHover(element, { target, bubble, textForEvent, anchor }) {
  ensureChartHoverStyles(element.shadowRoot);

  const show = (event) => {
    showChartHover(bubble, textForEvent(event), event, anchor ?? target);
  };
  const hide = () => hideChartHover(bubble);

  element.listen(target, "pointermove", show);
  element.listen(target, "pointerleave", hide);
  element.listen(target, "pointercancel", hide);
  element.addCleanup(hide);
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
