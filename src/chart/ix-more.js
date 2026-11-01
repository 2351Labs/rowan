const groups = new Map();

function plot(host) {
  return host.renderRoot?.querySelector("svg.plot");
}

function marks(host) {
  return [...(plot(host)?.querySelectorAll("[data-point-key]") || [])];
}

function indexOf(mark) {
  const key = mark?.dataset?.pointKey || "";
  const cut = key.lastIndexOf("::");
  return cut < 0 ? "" : key.slice(cut + 2);
}

function labelOf(host, index) {
  const button = [...host.renderRoot.querySelectorAll("button[data-point-key]")].find((item) =>
    (item.dataset.pointKey || "").endsWith(`::${index}`),
  );
  return button?.getAttribute("aria-label") || String(index);
}

function emit(host, type, detail) {
  host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

function showIndex(host, index) {
  const svg = plot(host);
  const mark = marks(host).find((item) => indexOf(item) === String(index));
  if (!svg || !mark) return;
  const view = svg.viewBox?.baseVal;
  if (!view?.width) return;
  const box = svg.getBoundingClientRect();
  const markBox = mark.getBoundingClientRect();
  const raw = Number(mark.getAttribute("x") ?? mark.getAttribute("cx"));
  const span = Number(mark.getAttribute("width") || 0);
  const x =
    box.width >= 1
      ? view.x + ((markBox.left + markBox.width / 2 - box.left) / box.width) * view.width
      : raw + span / 2;
  if (!Number.isFinite(x)) return;
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
  const bubble = host.renderRoot.querySelector(".hover");
  if (bubble) {
    bubble.hidden = false;
    bubble.textContent = labelOf(host, index);
  }
}

function broadcast(host, index) {
  const name = host.getAttribute("sync-group");
  const set = members(host);
  if (!name || !set || host.__syncing) return;
  const detail = { group: name, index: Number(index), label: labelOf(host, index) };
  for (const other of [...set]) {
    other.__syncing = 1;
    if (other !== host) showIndex(other, index);
    emit(other, "rowan-sync", detail);
    other.__syncing = 0;
  }
}

function members(host) {
  const name = host.getAttribute("sync-group");
  for (const [key, set] of groups) if (key !== name) set.delete(host);
  if (!name) return null;
  let set = groups.get(name);
  if (!set) groups.set(name, (set = new Set()));
  set.add(host);
  return set;
}

function lttb(points, threshold) {
  if (points.length <= threshold) return points;
  const sampled = [points[0]];
  const bucket = (points.length - 2) / (threshold - 2);
  let previous = 0;
  for (let i = 0; i < threshold - 2; i += 1) {
    const start = Math.floor((i + 1) * bucket) + 1;
    const end = Math.min(points.length - 1, Math.floor((i + 2) * bucket) + 1);
    let avgX = 0;
    let avgY = 0;
    for (let j = start; j < end; j += 1) {
      avgX += points[j].x;
      avgY += points[j].y;
    }
    const span = Math.max(1, end - start);
    avgX /= span;
    avgY /= span;
    const from = Math.floor(i * bucket) + 1;
    const to = Math.floor((i + 1) * bucket) + 1;
    let best = from;
    let area = -1;
    for (let j = from; j < to && j < points.length; j += 1) {
      const score = Math.abs(
        (points[previous].x - avgX) * (points[j].y - points[previous].y) -
          (points[previous].x - points[j].x) * (avgY - points[previous].y),
      );
      if (score > area) {
        area = score;
        best = j;
      }
    }
    sampled.push(points[best]);
    previous = best;
  }
  sampled.push(points.at(-1));
  return sampled;
}

function simplify(host) {
  if (!host.hasAttribute("large-series")) return;
  const threshold = Number(host.getAttribute("large-series")) || 500;
  const nodes = marks(host);
  if (nodes.length <= threshold) return;
  const groupsBySeries = new Map();
  for (const mark of nodes) {
    const key = mark.dataset.pointKey || "";
    const series = key.includes("::") ? key.slice(0, key.lastIndexOf("::")) : key;
    if (!groupsBySeries.has(series)) groupsBySeries.set(series, []);
    const box = mark.getBBox?.() || { x: 0, y: 0 };
    groupsBySeries.get(series).push({ mark, x: box.x, y: box.y });
  }
  const perSeries = Math.max(2, Math.floor(threshold / groupsBySeries.size));
  for (const points of groupsBySeries.values()) {
    const keep = new Set(lttb(points, perSeries).map((point) => point.mark));
    for (const point of points) if (!keep.has(point.mark)) point.mark.remove();
  }
  for (const path of host.renderRoot.querySelectorAll("path.series-line, path.series-area, path.line")) {
    const commands = [...path.getAttribute("d")?.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g) || []];
    if (commands.length <= perSeries) continue;
    const points = commands.map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
    const sampled = lttb(points, perSeries);
    path.setAttribute("d", sampled.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" "));
  }
}

function pagerFor(table, total, paint) {
  table.parentElement?.querySelector(":scope > .table-pager")?.remove();
  const pager = document.createElement("div");
  pager.className = "table-pager";
  const status = document.createElement("span");
  status.setAttribute("aria-live", "polite");
  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "Previous";
  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "Next";
  pager.append(previous, status, next);
  table.after(pager);
  let page = 0;
  const size = 40;
  const draw = () => {
    const start = page * size;
    status.textContent = paint(start, Math.min(total, start + size), total);
    previous.disabled = page === 0;
    next.disabled = start + size >= total;
  };
  previous.addEventListener("click", () => {
    page -= 1;
    draw();
  });
  next.addEventListener("click", () => {
    page += 1;
    draw();
  });
  draw();
}

function paginateTable(host) {
  const table = host.renderRoot?.querySelector("table");
  const body = table?.tBodies?.[0];
  const head = table?.tHead?.rows?.[0];
  if (!body || !head) return;
  const labels = [...head.cells].slice(1);
  if (labels.length > 80) {
    const rows = [...body.rows].map((row) => ({
      label: row.cells[0],
      cells: [...row.cells].slice(1),
    }));
    pagerFor(table, labels.length, (start, end, total) => {
      head.replaceChildren(head.cells[0], ...labels.slice(start, end));
      for (const row of rows) row.label.parentElement.replaceChildren(row.label, ...row.cells.slice(start, end));
      return `Columns ${start + 1}–${end} of ${total}`;
    });
    return;
  }
  if (body.rows.length <= 80) return;
  const all = [...body.rows];
  pagerFor(table, all.length, (start, end, total) => {
    body.replaceChildren(...all.slice(start, end));
    return `Rows ${start + 1}–${end} of ${total}`;
  });
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

function mountSync(host) {
  host.syncHover = (index) => {
    showIndex(host, index);
    broadcast(host, index);
  };
  members(host);
  host.renderRoot.addEventListener("pointermove", (event) => {
    if (!host.getAttribute("sync-group") || host.__syncing) return;
    const mark = event.target instanceof Element ? event.target.closest("[data-point-key]") : null;
    const index = indexOf(mark);
    if (index) broadcast(host, index);
  });
}

export function installChartExtras(host) {
  mountSync(host);
  host.__onZoomBrush = (x1, x2) => {
    const range = brushRange(host, x1, x2);
    if (range) emit(host, "rowan-brush", range);
  };
  mountBrush(host);
  simplify(host);
  paginateTable(host);
  if (host.__ixWrapped) return;
  host.__ixWrapped = 1;
  const original = host.requestRender.bind(host);
  host.requestRender = () => {
    original();
    queueMicrotask(() => {
      simplify(host);
      paginateTable(host);
    });
  };
}
