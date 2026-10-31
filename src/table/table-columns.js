import { emit } from "../lib/events.js";
import { resolveMessage } from "../lib/messages.js";
import { isTopmostOverlay, noteDismissibleClose, pushDismissible, removeDismissible } from "../lib/overlay-stack.js";
import { setColumnWidth } from "./column-widths.js";

const MENU_MESSAGES = Object.freeze({
  columnMenu: "{header} column menu",
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  addToSort: "Add to sort",
  clearSort: "Clear sort",
  hideColumn: "Hide column",
  pinStart: "Pin to start",
  pinEnd: "Pin to end",
  unpin: "Unpin",
  autosizeColumn: "Autosize",
  resetColumnWidth: "Reset width",
  filterColumn: "Filter",
  filterPlaceholder: "Contains…",
  hiddenColumns: "Hidden columns",
  showColumn: "Show {header}",
});

let current = null;

function text(table, key, params) {
  return resolveMessage(table.messages, MENU_MESSAGES, key, params);
}

function sortList(sort) {
  if (!sort) return [];
  const items = Array.isArray(sort) ? sort : [sort];
  return items.filter((item) => item?.id && item.dir).map((item) => ({ id: item.id, dir: item.dir }));
}

function commitSort(table, model, changed) {
  table.sort = model;
  const sort = sortList(table.sort);
  if (changed?.dir) emit(table, "rowan-sort", { id: changed.id, dir: changed.dir });
  emit(table, "rowan-sort-change", { sort });
}

export function addSort(table, id) {
  const currentSort = sortList(table.sort);
  const index = currentSort.findIndex((item) => item.id === id);
  const changed = { id, dir: index === -1 || currentSort[index].dir === "desc" ? "asc" : "desc" };
  const next = index === -1
    ? [...currentSort, changed]
    : currentSort.map((item, itemIndex) => (itemIndex === index ? changed : item));
  commitSort(table, next, changed);
}

function columnById(table, id) {
  return table.columns.find((column) => column.id === id) ?? null;
}

function moveColumn(table, id, place) {
  const columns = [...table.columns];
  const index = columns.findIndex((column) => column.id === id);
  if (index < 0) return;
  const [column] = columns.splice(index, 1);
  if (place === "start" || place === "end") column.sticky = place;
  else delete column.sticky;
  let at = columns.length;
  if (place === "start") {
    const firstUnpinned = columns.findIndex((item) => item.sticky !== "start");
    at = firstUnpinned < 0 ? columns.length : firstUnpinned;
  } else {
    const firstEnd = columns.findIndex((item) => item.sticky === "end");
    at = firstEnd < 0 ? columns.length : firstEnd;
  }
  columns.splice(at, 0, column);
  table.columns = columns;
}

function parsePixels(value) {
  if (typeof value === "number") return value;
  const match = String(value).match(/^(\d+(?:\.\d+)?)px$/);
  return match ? parseFloat(match[1]) : 0;
}

function writeWidth(table, columnId, width) {
  setColumnWidth(table, columnId, width);
}

function rememberWidth(table, columnId, width) {
  writeWidth(table, columnId, width);
  const header = table.renderRoot?.querySelector(`th[data-column-id="${CSS.escape(columnId)}"]`);
  if (header) header.style.width = width;
  emit(table, "rowan-column-resize", { columnId, width, columns: table.columns });
}

export function startResize(table, handle, clientX) {
  const th = handle.closest("th");
  const columnId = handle.dataset.resizeColumn;
  if (!th || !columnId) return;
  const column = columnById(table, columnId);
  const drag = {
    columnId,
    th,
    startX: clientX,
    startWidth: th.getBoundingClientRect().width,
    minWidth: column?.minWidth ? parsePixels(column.minWidth) : 40,
    rtl: getComputedStyle(table).direction === "rtl",
  };
  const onMove = (event) => {
    const width = Math.max(drag.minWidth, drag.startWidth + (event.clientX - drag.startX) * (drag.rtl ? -1 : 1));
    drag.th.style.width = `${width}px`;
  };
  const onUp = () => {
    rememberWidth(table, drag.columnId, drag.th.style.width);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

export function autosizeHandle(table, handle) {
  const columnId = handle.dataset.resizeColumn;
  if (!columnId) return;
  rememberWidth(table, columnId, `${measure(table, columnId)}px`);
}

export function nudgeColumn(table, th, column, key, shiftKey) {
  const rtl = getComputedStyle(table).direction === "rtl";
  const delta = (shiftKey ? 10 : 1) * ((key === "ArrowRight") === !rtl ? 1 : -1);
  const minWidth = column.minWidth ? parsePixels(column.minWidth) : 40;
  const width = Math.max(minWidth, th.getBoundingClientRect().width + delta);
  rememberWidth(table, column.id, `${width}px`);
}

function measure(table, columnId) {
  const cells = table.renderRoot.querySelectorAll(`[data-column-id="${CSS.escape(columnId)}"]`);
  let max = 100;
  for (const cell of cells) {
    const width = (cell.querySelector(".th-content") || cell).scrollWidth + 32;
    if (width > max) max = width;
  }
  return max;
}

function items(panel) {
  return [...panel.querySelectorAll("[role='menuitem']:not(:disabled)")];
}

function focusItem(panel, index) {
  const available = items(panel);
  if (!available.length) return;
  const next = available[Math.max(0, Math.min(index, available.length - 1))];
  next.focus();
}

function ensureStyle(root) {
  if (root.querySelector("link[data-column-menu]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("./table-columns.css", import.meta.url).href;
  link.dataset.columnMenu = "";
  root.append(link);
}

function place(panel, anchor) {
  const rect = anchor.getBoundingClientRect();
  panel.style.top = `${rect.bottom + 4}px`;
  panel.style.left = `${Math.max(8, rect.left)}px`;
  const box = panel.getBoundingClientRect();
  const overflow = box.right - document.documentElement.clientWidth + 8;
  if (overflow > 0) panel.style.left = `${Math.max(8, rect.left - overflow)}px`;
}

function markTrigger(table, columnId, open) {
  const button = table.renderRoot?.querySelector(
    `button[data-table-action="col-menu"][data-column-id="${CSS.escape(columnId)}"]`,
  );
  button?.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) button?.setAttribute("aria-controls", current?.panel.id ?? "");
}

function close() {
  if (!current) return;
  const { panel, table, columnId, onPointer, onKey } = current;
  document.removeEventListener("pointerdown", onPointer, true);
  document.removeEventListener("keydown", onKey, true);
  removeDismissible(panel);
  panel.hidePopover?.();
  panel.remove();
  current = null;
  queueMicrotask(() => {
    markTrigger(table, columnId, false);
    table.renderRoot
      ?.querySelector(`button[data-table-action="col-menu"][data-column-id="${CSS.escape(columnId)}"]`)
      ?.focus();
  });
}

function applyFilter(table, columnId, value) {
  const allowed = emit(table, "rowan-column-filter", { columnId, value }, { cancelable: true });
  if (!allowed) return;
  const next = table.filters.filter((filter) => filter.id !== columnId);
  if (value.trim()) next.push({ id: columnId, value });
  table.filters = next;
  queueMicrotask(() => markTrigger(table, columnId, true));
}

function menuButton(label, action, disabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.role = "menuitem";
  button.dataset.action = action;
  button.textContent = label;
  button.disabled = disabled;
  button.tabIndex = -1;
  return button;
}

function buildPanel(table, column) {
  const panel = document.createElement("div");
  panel.className = "col-menu-panel";
  panel.id = `rowan-col-menu-${column.id}`;
  panel.setAttribute("popover", "manual");
  panel.setAttribute("role", "menu");
  panel.setAttribute("aria-label", text(table, "columnMenu", { header: column.header || column.id }));
  const sorting = column.sortable !== true;
  const active = sortList(table.sort).some((item) => item.id === column.id);
  panel.append(
    menuButton(text(table, "sortAscending"), "asc", sorting),
    menuButton(text(table, "sortDescending"), "desc", sorting),
    menuButton(text(table, "addToSort"), "add", sorting),
    menuButton(text(table, "clearSort"), "clear", sorting || !active),
    menuButton(text(table, "hideColumn"), "hide", false),
    menuButton(text(table, "pinStart"), "pin-start", column.sticky === "start"),
    menuButton(text(table, "pinEnd"), "pin-end", column.sticky === "end"),
    menuButton(text(table, "unpin"), "unpin", !column.sticky),
    menuButton(text(table, "autosizeColumn"), "autosize", false),
    menuButton(text(table, "resetColumnWidth"), "reset", false),
  );

  if (column.filterable) {
    const label = document.createElement("label");
    label.className = "col-menu-filter";
    const caption = document.createElement("span");
    caption.textContent = text(table, "filterColumn");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = text(table, "filterPlaceholder");
    input.value = table.filters.find((filter) => filter.id === column.id)?.value ?? "";
    input.setAttribute("aria-label", text(table, "filterColumn"));
    input.addEventListener("input", () => applyFilter(table, column.id, input.value));
    input.addEventListener("keydown", (event) => event.stopPropagation());
    label.append(caption, input);
    panel.append(label);
  }

  const hidden = table.columns.filter((item) => item.hidden);
  if (hidden.length) {
    const group = document.createElement("div");
    group.className = "col-menu-hidden";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", text(table, "hiddenColumns"));
    const caption = document.createElement("span");
    caption.textContent = text(table, "hiddenColumns");
    group.append(caption);
    for (const item of hidden) {
      group.append(menuButton(text(table, "showColumn", { header: item.header || item.id }), `show:${item.id}`, false));
    }
    panel.append(group);
  }

  return panel;
}

function perform(table, column, action) {
  if (action === "asc" || action === "desc") {
    commitSort(table, { id: column.id, dir: action === "asc" ? "asc" : "desc" }, { id: column.id, dir: action === "asc" ? "asc" : "desc" });
    return;
  }
  if (action === "add") {
    addSort(table, column.id);
    return;
  }
  if (action === "clear") {
    commitSort(table, sortList(table.sort).filter((item) => item.id !== column.id), null);
    return;
  }
  if (action === "hide") {
    column.hidden = true;
    table.columns = [...table.columns];
    return;
  }
  if (action === "pin-start" || action === "pin-end") {
    moveColumn(table, column.id, action === "pin-start" ? "start" : "end");
    return;
  }
  if (action === "unpin") {
    moveColumn(table, column.id, "none");
    return;
  }
  if (action === "autosize") {
    rememberWidth(table, column.id, `${measure(table, column.id)}px`);
    table.columns = [...table.columns];
    return;
  }
  if (action === "reset") {
    writeWidth(table, column.id, null);
    const width = column.width == null ? "" : String(column.width);
    table.columns = [...table.columns];
    emit(table, "rowan-column-resize", { columnId: column.id, width, columns: table.columns });
    return;
  }
  if (action.startsWith("show:")) {
    const target = columnById(table, action.slice(5));
    if (!target) return;
    target.hidden = false;
    table.columns = [...table.columns];
  }
}

export function openMenu(table, anchor) {
  const columnId = anchor?.dataset?.columnId;
  const column = columnById(table, columnId);
  if (!column || !table.renderRoot) return;
  if (current?.columnId === columnId && current.panel.isConnected) {
    close();
    return;
  }
  close();

  ensureStyle(table.renderRoot);
  const panel = buildPanel(table, column);
  table.renderRoot.append(panel);
  if (typeof panel.showPopover === "function") {
    try {
      panel.showPopover();
    } catch {
      panel.hidden = false;
    }
  }
  place(panel, anchor);

  const onPointer = (event) => {
    const path = event.composedPath();
    if (path.includes(panel) || path.includes(anchor)) return;
    noteDismissibleClose();
    close();
  };
  const onKey = (event) => {
    if (event.key !== "Escape" || !isTopmostOverlay(panel)) return;
    event.preventDefault();
    event.stopPropagation();
    noteDismissibleClose();
    close();
  };
  panel.addEventListener("keydown", (event) => {
    const available = items(panel);
    const index = available.indexOf(event.target);
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    event.stopPropagation();
    const next = event.key === "Home" ? 0 : event.key === "End" ? available.length - 1 : index + (event.key === "ArrowDown" ? 1 : -1);
    focusItem(panel, next);
  });
  panel.addEventListener("click", (event) => {
    const action = event.target?.dataset?.action;
    if (!action) return;
    perform(table, columnById(table, columnId) || column, action);
    close();
  });

  current = { panel, anchor, table, columnId, onPointer, onKey };
  pushDismissible(panel);
  document.addEventListener("pointerdown", onPointer, true);
  document.addEventListener("keydown", onKey, true);
  markTrigger(table, columnId, true);
  focusItem(panel, 0);
}
