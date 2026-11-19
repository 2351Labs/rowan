import { broadcast, indexOf, marks, openHover, plot } from "./ix-more.js";

function pointValue(point) {
  if (typeof point === "number") return Number.isFinite(point) ? point : null;
  if (point == null || typeof point !== "object") return null;
  const value = point.value ?? point.y;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatValue(host, value, series, index, label) {
  if (typeof host.valueFormatter === "function") {
    try {
      return String(host.valueFormatter(value, { series, index, label }));
    } catch {
      /* Fall through to the raw value. */
    }
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  try {
    return new Intl.NumberFormat(host.locale || undefined).format(value);
  } catch {
    return String(value);
  }
}

export function realTip(host, index) {
  const series = host.__seriesRef;
  if (!Array.isArray(series) || !Number.isFinite(index)) return "";
  if (typeof series[0] === "number" || series[0] == null) {
    const value = pointValue(series[index]);
    if (value == null) return "";
    const label = host.__labelsRef?.[index] || String(index + 1);
    return `${label}\n${formatValue(host, value, null, index, label)}`;
  }
  const label = Array.isArray(host.__labelsRef) ? host.__labelsRef[index] || "" : "";
  const lines = [];
  for (const item of series) {
    const values = item?.values || item?.points;
    if (!Array.isArray(values)) continue;
    const value = pointValue(values[index]);
    if (value == null) continue;
    const text = formatValue(host, value, item, index, label);
    lines.push(item.label ? `${item.label}: ${text}` : text);
  }
  if (!lines.length) return "";
  return label ? `${label}\n${lines.join("\n")}` : lines.join("\n");
}

function markCenter(svg, mark) {
  const view = svg.viewBox?.baseVal;
  const box = svg.getBoundingClientRect();
  const markBox = mark.getBoundingClientRect();
  if (view?.width && box.width >= 1 && (markBox.width > 0 || markBox.height > 0)) {
    return {
      x: view.x + ((markBox.left + markBox.width / 2 - box.left) / box.width) * view.width,
      y: view.y + ((markBox.top + markBox.height / 2 - box.top) / Math.max(box.height, 1)) * view.height,
    };
  }
  const rawX = Number(mark.getAttribute("cx") ?? mark.getAttribute("x"));
  const rawY = Number(mark.getAttribute("cy") ?? mark.getAttribute("y"));
  const span = Number(mark.getAttribute("width") || 0);
  const height = Number(mark.getAttribute("height") || 0);
  return { x: rawX + span / 2, y: rawY + height / 2 };
}

function positionFor(host, index) {
  const svg = plot(host);
  if (!svg) return null;
  const horizontal = host.getAttribute("orientation") === "horizontal";
  const exact = [...svg.querySelectorAll("[data-point-key]")].find(
    (mark) => indexOf(mark) === String(index),
  );
  if (exact) return { ...markCenter(svg, exact), horizontal };
  const map = host.__xMapFull;
  if (!map || map.i1 === map.i0 || horizontal) return null;
  return {
    x: map.x0 + ((Number(index) - map.i0) / (map.i1 - map.i0)) * (map.x1 - map.x0),
    y: svg.viewBox?.baseVal?.y || 0,
    horizontal: false,
  };
}

function indexAtClient(host, event) {
  const svg = plot(host);
  const map = host.__xMapFull;
  const view = svg?.viewBox?.baseVal;
  const box = svg?.getBoundingClientRect();
  if (!map || map.i1 === map.i0 || !view?.width || !box?.width || event.clientX == null) return null;
  const viewX = view.x + ((event.clientX - box.left) / box.width) * view.width;
  const index = Math.round(map.i0 + ((viewX - map.x0) / (map.x1 - map.x0)) * (map.i1 - map.i0));
  const count = host.__n || map.i1 + 1;
  if (!Number.isFinite(index)) return null;
  return Math.max(0, Math.min(count - 1, index));
}

function indexFromEvent(host, event) {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  const node =
    path.find((item) => item instanceof Element && item.hasAttribute?.("data-point-key")) ||
    (event.target instanceof Element ? event.target.closest("[data-point-key]") : null);
  if (node) {
    const key = node.dataset.pointKey || "";
    const cut = key.lastIndexOf("::");
    if (cut >= 0) {
      const index = Number(key.slice(cut + 2));
      if (Number.isFinite(index)) return index;
    }
  }
  if (event.type === "pointermove" || event.type === "pointerenter") return indexAtClient(host, event);
  return null;
}

export function describePointer(host, event) {
  const index = indexFromEvent(host, event);
  if (index == null) return null;
  const spot = positionFor(host, index);
  const buttons = [...host.renderRoot.querySelectorAll("button[data-point-key]")].filter((item) =>
    (item.dataset.pointKey || "").endsWith(`::${index}`),
  );
  const fromButtons = buttons.map((item) => item.getAttribute("aria-label")).filter(Boolean).join("\n");
  const text = realTip(host, index) || fromButtons;
  if (!text && !Number.isFinite(spot?.x)) return null;
  return {
    x: spot?.x,
    y: spot?.y,
    horizontal: Boolean(spot?.horizontal),
    index,
    text,
  };
}

export function showIndex(host, index) {
  const svg = plot(host);
  const view = svg?.viewBox?.baseVal;
  const spot = positionFor(host, index);
  if (!svg || !view?.width || !spot || !Number.isFinite(spot.x)) return;
  let line = svg.querySelector(":scope > .axis-pointer");
  if (!line) {
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "axis-pointer is-shown");
    svg.append(line);
  }
  line.classList.add("is-shown");
  if (spot.horizontal) {
    line.setAttribute("x1", String(view.x));
    line.setAttribute("x2", String(view.x + view.width));
    line.setAttribute("y1", String(spot.y));
    line.setAttribute("y2", String(spot.y));
  } else {
    line.setAttribute("x1", String(spot.x));
    line.setAttribute("x2", String(spot.x));
    line.setAttribute("y1", String(view.y));
    line.setAttribute("y2", String(view.y + view.height));
  }
  const bubble = host.renderRoot.querySelector(".hover");
  if (!bubble) return;
  const text = realTip(host, Number(index));
  if (text) bubble.textContent = text;
  openHover(bubble);
  bubble.setAttribute("aria-hidden", "true");
}


export function learnXMap(host) {
  if (host.localName === "rowan-scatter-chart") return;
  const count = host.__n || 0;
  if (host.__xMapFull && host.__xMapFull.n === count && count > 1) return;
  host.__xMapFull = null;
  if ((host.__z0 || 0) > 0) return;
  if (host.__z1 != null && count && host.__z1 < count - 1) return;
  const svg = plot(host);
  if (!svg) return;
  let low = null;
  let high = null;
  for (const mark of marks(host)) {
    const index = Number(indexOf(mark));
    if (!Number.isFinite(index)) continue;
    const center = markCenter(svg, mark);
    if (!Number.isFinite(center.x)) continue;
    if (!low || index < low.index) low = { index, x: center.x };
    if (!high || index > high.index) high = { index, x: center.x };
  }
  if (low && high && high.index > low.index) {
    host.__xMapFull = { i0: low.index, x0: low.x, i1: high.index, x1: high.x, n: count };
  }
}

export function bindFollow(host) {
  if (host.__follow) return;
  host.__follow = 1;
  const follow = (event) => {
    if (!host.getAttribute("sync-group") || host.__syncing) return;
    const index = indexFromEvent(host, event);
    if (index == null || host.__syncIndex === index) return;
    host.__syncIndex = index;
    broadcast(host, index);
  };
  host.renderRoot.addEventListener("pointermove", follow);
  host.renderRoot.addEventListener("focusin", follow);
  host.addEventListener("focusin", follow);
  host.addEventListener("pointerleave", () => {
    host.__syncIndex = null;
  });
}

