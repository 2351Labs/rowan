import { bindSeriesLegend, syncSeriesLegend } from "./legend.js";
import { installChartExtras } from "./ix-more.js";

function bubbleOf(host) {
  return host.renderRoot?.querySelector(".hover");
}

function plotOf(host) {
  return host.renderRoot?.querySelector("svg.plot");
}

function clampBubble(bubble) {
  const rect = bubble.getBoundingClientRect();
  const margin = 8;
  const width = window.innerWidth || 0;
  const height = window.innerHeight || 0;
  if (!width || !height || rect.width < 1) return;
  const half = rect.width / 2;
  let left = Number.parseFloat(bubble.style.left);
  if (!Number.isFinite(left)) left = rect.left + half;
  let top = Number.parseFloat(bubble.style.top);
  if (!Number.isFinite(top)) top = rect.top;
  left = Math.min(Math.max(left, margin + half), width - margin - half);
  if (top + rect.height > height - margin) top = Math.max(margin, top - rect.height - 24);
  bubble.style.left = `${Math.round(left)}px`;
  bubble.style.top = `${Math.round(top)}px`;
}

function motionOff(host) {
  return (
    host.hasAttribute("no-motion") ||
    (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

function enhanceTooltip(host, event) {
  const bubble = bubbleOf(host);
  if (!bubble || bubble.hidden) return;
  clampBubble(bubble);
  if (typeof host.tooltipFormatter === "function") return;
  if (host.querySelector("[slot='tooltip']")?.textContent?.trim()) return;
  const svg = plotOf(host);
  if (!svg || event.clientX == null) return;
  const marks = [...svg.querySelectorAll("[data-point-key]")];
  if (!marks.length) return;
  let best = marks[0];
  let bestDist = Infinity;
  for (const mark of marks) {
    const box = mark.getBoundingClientRect();
    const dist = Math.abs(box.left + box.width / 2 - event.clientX);
    if (dist < bestDist) {
      best = mark;
      bestDist = dist;
    }
  }
  const key = best.dataset.pointKey || "";
  const index = key.slice(key.lastIndexOf("::") + 2);
  const aligned = marks.filter((mark) => (mark.dataset.pointKey || "").endsWith(`::${index}`));
  if (aligned.length > 1) {
    const buttons = [...host.renderRoot.querySelectorAll("button[data-point-key]")];
    bubble.textContent = aligned
      .map((mark) => {
        const button = buttons.find((item) => item.dataset.pointKey === mark.dataset.pointKey);
        return button?.getAttribute("aria-label") || mark.dataset.pointKey;
      })
      .join("\n");
  }
  const box = svg.getBoundingClientRect();
  const view = svg.viewBox?.baseVal;
  if (!view || box.width < 1) return;
  const markBox = best.getBoundingClientRect();
  const x = view.x + ((markBox.left + markBox.width / 2 - box.left) / box.width) * view.width;
  let line = svg.querySelector(":scope > .axis-pointer");
  if (!line) {
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "axis-pointer");
    svg.append(line);
  }
  line.setAttribute("x1", String(x));
  line.setAttribute("x2", String(x));
  line.setAttribute("y1", String(view.y));
  line.setAttribute("y2", String(view.y + view.height));
  clampBubble(bubble);
}

function parseViewBox(svg) {
  const view = svg.viewBox?.baseVal;
  if (view && view.width) return { x: view.x, y: view.y, width: view.width, height: view.height };
  const parts = (svg.getAttribute("viewBox") || "0 0 1000 400").split(/[\s,]+/).map(Number);
  return { x: parts[0] || 0, y: parts[1] || 0, width: parts[2] || 1000, height: parts[3] || 400 };
}

function emitZoom(host, view) {
  host.dispatchEvent(
    new CustomEvent("rowan-zoom", {
      detail: { x: view.x, y: view.y, width: view.width, height: view.height },
      bubbles: true,
      composed: true,
    }),
  );
}

function mountZoom(host) {
  const svg = plotOf(host);
  if (!svg || svg.dataset.zoomBound) return;
  svg.dataset.zoomBound = "true";
  const origin = parseViewBox(svg);
  let view = { ...origin };
  const bothAxes = host.localName === "rowan-scatter-chart";
  const chart = host.renderRoot.querySelector(".chart");
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "zoom-reset";
  reset.textContent = "Reset zoom";
  reset.hidden = true;
  chart?.append(reset);

  const apply = (next) => {
    view = next;
    svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.width} ${view.height}`);
    const changed = view.x !== origin.x || view.y !== origin.y || view.width !== origin.width || view.height !== origin.height;
    reset.hidden = !changed;
    emitZoom(host, view);
  };

  const zoomAt = (clientX, clientY, factor) => {
    const box = svg.getBoundingClientRect();
    if (box.width < 1) return;
    const px = Math.min(Math.max((clientX - box.left) / box.width, 0), 1);
    const py = Math.min(Math.max((clientY - box.top) / box.height, 0), 1);
    const width = Math.min(origin.width, Math.max(origin.width / 40, view.width * factor));
    const height = bothAxes ? Math.min(origin.height, Math.max(origin.height / 40, view.height * factor)) : origin.height;
    let x = view.x + px * view.width - px * width;
    let y = bothAxes ? view.y + py * view.height - py * height : origin.y;
    x = Math.min(Math.max(x, origin.x), origin.x + origin.width - width);
    y = Math.min(Math.max(y, origin.y), origin.y + origin.height - height);
    apply({ x, y, width, height });
  };

  reset.addEventListener("click", () => apply({ ...origin }));
  svg.addEventListener("wheel", (event) => {
    if (!host.hasAttribute("zoom")) return;
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, event.deltaY > 0 ? 1.12 : 0.88);
  }, { passive: false });

  const pointers = new Map();
  let drag = null;
  svg.addEventListener("pointerdown", (event) => {
    if (!host.hasAttribute("zoom")) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      drag = { x: event.clientX, y: event.clientY, pan: event.shiftKey, view: { ...view } };
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        /* Synthetic events have no pointer to capture. */
      }
    }
  });
  svg.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      if (!svg.dataset.pinch) svg.dataset.pinch = String(dist);
      const start = Number(svg.dataset.pinch) || dist;
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, start / dist);
      svg.dataset.pinch = String(dist);
      return;
    }
    if (!drag) return;
    const box = svg.getBoundingClientRect();
    if (drag.pan) {
      const dx = ((event.clientX - drag.x) / box.width) * drag.view.width;
      const dy = bothAxes ? ((event.clientY - drag.y) / box.height) * drag.view.height : 0;
      let x = drag.view.x - dx;
      let y = drag.view.y - dy;
      x = Math.min(Math.max(x, origin.x), origin.x + origin.width - view.width);
      y = Math.min(Math.max(y, origin.y), origin.y + origin.height - view.height);
      apply({ ...view, x, y });
      return;
    }
    let brush = svg.querySelector(":scope > .zoom-brush");
    if (!brush) {
      brush = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      brush.setAttribute("class", "zoom-brush");
      svg.append(brush);
    }
    const scaleX = view.width / box.width;
    const x1 = drag.view.x + ((drag.x - box.left) / box.width) * view.width;
    const x2 = view.x + ((event.clientX - box.left) / box.width) * scaleX;
    brush.setAttribute("x", String(Math.min(x1, x2)));
    brush.setAttribute("y", String(view.y));
    brush.setAttribute("width", String(Math.abs(x2 - x1)));
    brush.setAttribute("height", String(view.height));
  });
  const endDrag = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) delete svg.dataset.pinch;
    const brush = svg.querySelector(":scope > .zoom-brush");
    if (drag && !drag.pan && brush) {
      const width = Number(brush.getAttribute("width")) || 0;
      if (width > view.width / 40) {
        apply({
          x: Number(brush.getAttribute("x")),
          y: bothAxes ? Number(brush.getAttribute("y")) : origin.y,
          width,
          height: bothAxes ? Number(brush.getAttribute("height")) : origin.height,
        });
      }
    }
    if (drag) host.__onZoomBrush?.(drag.x, event.clientX);
    brush?.remove();
    if (pointers.size === 0) drag = null;
  };
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
}

function mountResize(host) {
  if (typeof ResizeObserver === "undefined" || host.__rowanResize) return;
  host.__rowanResize = 1;
  let width = Math.round(host.getBoundingClientRect().width);
  const observer = new ResizeObserver((records) => {
    const next = Math.round(records[0]?.contentRect?.width || 0);
    if (Math.abs(next - width) < 1) return;
    width = next;
    host.requestRender?.();
  });
  if (typeof host.observe === "function") host.observe(observer, () => observer.observe(host));
  observer.observe(host);
}

function replay(host, event, toggle) {
  const type = event?.type;
  if (type === "click" && toggle) {
    const node = event.composedPath?.()[0];
    const legend = host.renderRoot.querySelector(".legend");
    const id =
      node instanceof Element && legend?.contains(node) ? node.closest("[data-series-id]")?.dataset.seriesId : "";
    if (id) toggle(id);
  }
  if (type === "wheel") {
    plotOf(host)?.dispatchEvent(
      new WheelEvent("wheel", {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaY: event.deltaY,
        bubbles: true,
        cancelable: true,
      }),
    );
  }
  if (type === "pointermove" || type === "pointerenter" || type === "focusin") enhanceTooltip(host, event);
}

export function run(host, queued = []) {
  const pending = Array.isArray(queued) ? queued : queued ? [queued] : [];
  if (!host?.renderRoot?.querySelector("svg")) {
    if (!host.__ixWait) {
      host.__ixWait = 1;
      queueMicrotask(() => run(host, pending));
    }
    return;
  }
  if (host.__rowanIxMounted) return;
  host.__rowanIxMounted = 1;
  const legend = host.renderRoot.querySelector(".legend");
  syncSeriesLegend(host, legend);
  const toggle = legend ? bindSeriesLegend(host, legend) : null;
  if (legend) {
    const observer = new MutationObserver(() => syncSeriesLegend(host, legend));
    observer.observe(legend, { childList: true });
  }
  host.renderRoot.addEventListener("pointermove", (event) => enhanceTooltip(host, event));
  host.renderRoot.addEventListener("focusin", (event) => enhanceTooltip(host, event));
  mountResize(host);
  mountZoom(host);
  if (!motionOff(host)) host.renderRoot.querySelector(".chart")?.setAttribute("data-animate", "");
  installChartExtras(host);
  for (const event of pending) replay(host, event, toggle);
}

export { bindSeriesLegend, syncSeriesLegend };
