const groups = new Map();

export function plot(host) {
  return host.renderRoot?.querySelector("svg.plot");
}

export function openHover(bubble) {
  if (!bubble) return;
  bubble.hidden = false;
  try {
    if (typeof bubble.showPopover !== "function") return;
    if (bubble.getAttribute("popover") !== "manual") bubble.setAttribute("popover", "manual");
    if (!bubble.matches(":popover-open")) bubble.showPopover();
  } catch {
    bubble.hidden = false;
  }
}

export function closeHover(bubble) {
  if (!bubble) return;
  bubble.hidden = true;
  try {
    if (typeof bubble.hidePopover === "function" && bubble.matches(":popover-open")) bubble.hidePopover();
  } catch {
    /* Popover is optional. */
  }
}

export function marks(host) {
  return [...(plot(host)?.querySelectorAll("[data-point-key]") || [])];
}

export function indexOf(mark) {
  const key = mark?.dataset?.pointKey || "";
  const cut = key.lastIndexOf("::");
  return cut < 0 ? "" : key.slice(cut + 2);
}

export function labelOf(host, index) {
  const button = [...host.renderRoot.querySelectorAll("button[data-point-key]")].find((item) =>
    (item.dataset.pointKey || "").endsWith(`::${index}`),
  );
  return button?.getAttribute("aria-label") || String(index);
}

function emit(host, type, detail) {
  host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export function broadcast(host, index) {
  const name = host.getAttribute("sync-group");
  const set = members(host);
  if (!name || !set || host.__syncing) return;
  const detail = {
    group: name,
    index: Number(index),
    label: host.__labelsRef?.[index] || labelOf(host, index),
  };
  for (const other of [...set]) {
    other.__syncing = 1;
    if (other !== host) other.__showIndex?.(index);
    emit(other, "rowan-sync", detail);
    other.__syncing = 0;
  }
}

export function members(host) {
  const name = host.getAttribute("sync-group");
  for (const [key, set] of groups) if (key !== name) set.delete(host);
  if (!name) return null;
  let set = groups.get(name);
  if (!set) groups.set(name, (set = new Set()));
  set.add(host);
  return set;
}

function pageStatus(table) {
  const noun = table.dataset.pageMode === "rows" ? "Rows" : "Columns";
  return `${noun} ${Number(table.dataset.pageStart) + 1}–${table.dataset.pageEnd} of ${table.dataset.pageTotal}`;
}

function paginateTable(host) {
  const table = host.renderRoot?.querySelector("table");
  if (!table) return;
  const total = Number(table.dataset.pageTotal || 0);
  const existing = table.parentElement?.querySelector(":scope > .table-pager");
  if (total <= 80) {
    existing?.remove();
    delete table.dataset.pager;
    return;
  }
  if (table.dataset.pager && existing) {
    const status = existing.querySelector("span");
    if (status) status.textContent = pageStatus(table);
    const [previous, , next] = existing.querySelectorAll("button");
    if (previous) previous.disabled = (table.__from || 0) <= 0;
    if (next) next.disabled = Number(table.dataset.pageEnd || 0) >= total;
    return;
  }
  existing?.remove();
  table.dataset.pager = "1";
  const pager = document.createElement("div");
  pager.className = "table-pager";
  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "Previous";
  const status = document.createElement("span");
  status.setAttribute("aria-live", "polite");
  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "Next";
  pager.append(previous, status, next);
  table.after(pager);
  const turn = (delta) => {
    const start = Math.max(0, (table.__from || 0) + delta);
    table.__from = start;
    host.requestRender?.();
  };
  previous.addEventListener("click", () => turn(-40));
  next.addEventListener("click", () => turn(40));
  status.textContent = pageStatus(table);
  previous.disabled = (table.__from || 0) <= 0;
  next.disabled = Number(table.dataset.pageEnd || 0) >= total;
}

function brushRange(host, x1, x2) {
  const svg = plot(host);
  const box = svg?.getBoundingClientRect();
  if (!svg || !box || box.width < 1) return null;
  const left = Math.min(x1, x2);
  const right = Math.max(x1, x2);
  const chosen = marks(host).filter((mark) => {
    const markBox = mark.getBoundingClientRect();
    const center = markBox.left + markBox.width / 2;
    return center >= left && center <= right;
  });
  const indexes = [...new Set(chosen.map((mark) => Number(indexOf(mark))).filter((index) => Number.isFinite(index)))].sort(
    (a, b) => a - b,
  );
  if (!indexes.length) return null;
  return {
    startIndex: indexes[0],
    endIndex: indexes.at(-1),
    startLabel: labelOf(host, indexes[0]),
    endLabel: labelOf(host, indexes.at(-1)),
  };
}

function mountBrush(host) {
  const svg = plot(host);
  if (!svg || svg.dataset.brushBound) return;
  svg.dataset.brushBound = "true";
  let drag = null;
  const clear = () => {
    svg.querySelector(":scope > .range-brush")?.remove();
    emit(host, "rowan-brush", { cleared: true });
  };
  svg.addEventListener("pointerdown", (event) => {
    if (!host.hasAttribute("brush") || host.hasAttribute("zoom") || event.shiftKey) return;
    drag = { x: event.clientX, y: event.clientY };
    try {
      svg.setPointerCapture(event.pointerId);
    } catch {
      /* Synthetic events have no pointer to capture. */
    }
  });
  svg.addEventListener("pointermove", (event) => {
    if (!drag || !host.hasAttribute("brush")) return;
    let rect = svg.querySelector(":scope > .range-brush");
    if (!rect) {
      rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "range-brush");
      svg.append(rect);
    }
    const box = svg.getBoundingClientRect();
    const view = svg.viewBox.baseVal;
    const scale = view.width / box.width;
    const x1 = view.x + ((drag.x - box.left) / box.width) * view.width;
    const x2 = view.x + ((event.clientX - box.left) / box.width) * scale;
    rect.setAttribute("x", String(Math.min(x1, x2)));
    rect.setAttribute("y", String(view.y));
    rect.setAttribute("width", String(Math.abs(x2 - x1)));
    rect.setAttribute("height", String(view.height));
  });
  svg.addEventListener("pointerup", (event) => {
    if (!drag) return;
    const range = brushRange(host, drag.x, event.clientX);
    drag = null;
    if (!range) return;
    emit(host, "rowan-brush", range);
    if (host.hasAttribute("zoom")) host.syncHover?.(range.startIndex);
  });
  host.addEventListener("keydown", (event) => {
    if (!host.hasAttribute("brush")) return;
    if (event.key === "Escape") {
      clear();
      return;
    }
    if (!event.shiftKey || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) return;
    const current = marks(host).find((mark) => mark.dataset.pointKey === host.shadowRoot?.activeElement?.dataset?.pointKey);
    const index = Number(indexOf(current));
    if (!Number.isFinite(index)) return;
    const next = event.key === "ArrowRight" ? index + 1 : Math.max(0, index - 1);
    event.preventDefault();
    emit(host, "rowan-brush", {
      startIndex: Math.min(index, next),
      endIndex: Math.max(index, next),
      startLabel: labelOf(host, Math.min(index, next)),
      endLabel: labelOf(host, Math.max(index, next)),
    });
  });
}

function trimMarks(host) {
  if (host.__drawSet) return;
  const cap = Number(host.getAttribute("large-series"));
  if (!(cap > 0)) return;
  const nodes = marks(host);
  if (nodes.length <= cap) return;
  const step = Math.ceil(nodes.length / cap);
  nodes.forEach((node, index) => {
    if (index % step && index !== nodes.length - 1) node.remove();
  });
}

function forget(host) {
  for (const set of groups.values()) set.delete(host);
  host.renderRoot?.querySelector("svg.plot > .axis-pointer")?.remove();
  const bubble = host.renderRoot?.querySelector(".hover");
  if (bubble) bubble.hidden = true;
}

function watchAttributes(host) {
  if (host.__ixWatch) return;
  const observer = new MutationObserver(() => {
    members(host);
    host.__drawToken = "";
    host.__refined = false;
    host.__xMapFull = null;
    host.requestRender?.();
  });
  observer.observe(host, { attributes: true, attributeFilter: ["sync-group", "large-series"] });
  host.__ixWatch = observer;
  if (host.__ixClean) return;
  host.__ixClean = 1;
  host.addCleanup?.(() => {
    forget(host);
    host.__ixWatch?.disconnect();
    host.__ixWatch = null;
  }, { persist: true });
}

export function clearSync(host) {
  const name = host.getAttribute?.("sync-group");
  const set = name ? groups.get(name) : null;
  for (const other of set ? [...set] : [host]) {
    other.renderRoot?.querySelector("svg.plot > .axis-pointer")?.remove();
    if (other === host) continue;
    const bubble = other.renderRoot?.querySelector(".hover");
    if (!bubble) continue;
    closeHover(bubble);
    bubble.removeAttribute("aria-hidden");
  }
}

function mountSync(host) {
  host.syncHover = (index) => {
    host.__showIndex?.(index);
    broadcast(host, index);
  };
  members(host);
}

export function installChartExtras(host) {
  watchAttributes(host);
  mountSync(host);
  host.__onZoomBrush = (x1, x2) => {
    const range = brushRange(host, x1, x2);
    if (range) emit(host, "rowan-brush", range);
  };
  mountBrush(host);
  paginateTable(host);
  host.__learnXMap?.();
  trimMarks(host);
  if (host.__ixWrapped) return;
  host.__ixWrapped = 1;
  const original = host.requestRender.bind(host);
  host.requestRender = () => {
    original();
    queueMicrotask(() => {
      if (!host.isConnected) return;
      members(host);
      host.__learnXMap?.();
      paginateTable(host);
      trimMarks(host);
      watchAttributes(host);
    });
  };
}
