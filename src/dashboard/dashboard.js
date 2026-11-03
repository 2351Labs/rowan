import { applyFilters, isFilterGroup } from "../filter-builder/apply-filters.js";
import { RowanChip } from "../chip/chip.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const OPERATOR_LABELS = {
  contains: "contains",
  equals: "is",
  "not-equals": "is not",
  "starts-with": "starts with",
  "ends-with": "ends with",
  "greater-than": "is greater than",
  "greater-than-or-equal": "is at least",
  "less-than": "is less than",
  "less-than-or-equal": "is at most",
  "is-empty": "is empty",
  "is-not-empty": "is not empty",
};

const VALUELESS = new Set(["is-empty", "is-not-empty"]);

const DEFAULT_MESSAGES = {
  chip: ({ field, operator, value }) =>
    value ? `${field} ${operator} ${value}` : `${field} ${operator}`,
  chipsLabel: "Active filters",
  clear: "Clear filters",
  groupAnd: "All of {count} filters",
  groupOr: "Any of {count} filters",
  remove: "Remove {label}",
};

/**
 * @typedef {object} RowanDashboardFilter
 * @property {string} [id]
 * @property {string} field
 * @property {string} [operator]
 * @property {unknown} [value]
 */

/**
 * @typedef {object} RowanDashboardFilterGroup
 * @property {string} [id]
 * @property {"and" | "or"} join
 * @property {Array<RowanDashboardFilter | RowanDashboardFilterGroup>} filters
 */

/**
 * @typedef {object} RowanDashboardChart
 * @property {HTMLElement} element
 * @property {string} field
 * @property {string | ((detail: Record<string, unknown>) => unknown)} [value]
 */

/**
 * @typedef {object} RowanDashboardControl
 * @property {HTMLElement} element
 * @property {string} field
 * @property {string} [event]
 * @property {(event: Event) => unknown} [read]
 * @property {(value: unknown) => void} [write]
 */

/**
 * @typedef {object} RowanDashboardUrlWindow
 * @property {{ href: string }} location
 * @property {{
 *   pushState: (state: unknown, title: string, url?: string | null) => void,
 *   replaceState: (state: unknown, title: string, url?: string | null) => void,
 * }} history
 * @property {(type: string, listener: EventListener) => void} addEventListener
 * @property {(type: string, listener: EventListener) => void} removeEventListener
 */

/**
 * @typedef {object} RowanDashboardUrlOptions
 * @property {string} [param] Query key. Default `df`.
 * @property {"push" | "replace"} [history] History mode for user changes. Default `push`. Loading uses replace.
 * @property {RowanDashboardUrlWindow} [window]
 */

/**
 * @typedef {object} RowanDashboardMessages
 * @property {string | ((context: { field: string, operator: string, value: string }) => string)} [chip]
 * @property {string} [chipsLabel]
 * @property {string} [clear]
 * @property {string} [groupAnd]
 * @property {string} [groupOr]
 * @property {string} [remove]
 */

/**
 * @typedef {object} RowanDashboardOptions
 * @property {HTMLElement} [root] Receives `rowan-dashboard-change` and `rowan-dashboard-clear`. Chips are prepended here.
 * @property {HTMLElement | Array<RowanDashboardFilter | RowanDashboardFilterGroup>} [filters] A filter builder, or the initial tree. Builders inside `root` are used when this is omitted.
 * @property {RowanDashboardControl[]} [controls] Equals controls. `[data-dashboard-field]` inside `root` is used when this is omitted.
 * @property {boolean | RowanDashboardUrlOptions} [url] Share the tree in the query string. Back and forward restore it.
 * @property {Array<HTMLElement | RowanDashboardChart>} [charts] Point, slice, and bar clicks toggle an equals filter. Charts inside `root` with `data-dashboard-field` are used when this is omitted.
 * @property {HTMLElement | null} [table] Client mode filters `rows`. Server mode writes `filters` and keeps quick `{ id, value }` filters.
 * @property {Array<{ id: string, label?: string, type?: string, options?: Array<string | { value?: string, label?: string }> }>} [fields]
 * @property {Array<Record<string, unknown>>} [rows] Client source rows. Defaults to the table rows at creation.
 * @property {boolean | HTMLElement} [chips] Active-filter chips. Defaults to true when `root` is set.
 * @property {RowanDashboardMessages} [messages]
 */

/**
 * @typedef {object} RowanDashboard
 * @property {(field: string) => unknown} get
 * @property {(field: string, value: unknown) => void} set
 * @property {(field: string, value: unknown) => void} toggle
 * @property {(field?: string) => void} clear
 * @property {(filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup> | null | undefined) => void} replace
 * @property {() => Array<RowanDashboardFilter | RowanDashboardFilterGroup>} snapshot
 * @property {() => string} search
 * @property {(listener: (filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup>) => void) => () => void} subscribe
 * @property {(rows: Array<Record<string, unknown>> | null | undefined) => void} setRows
 * @property {() => void} destroy
 */

/**
 * One filter tree for a dashboard.
 *
 * The tree stays in sync with a filter builder, field controls, chart
 * point/slice/bar clicks, the query string, active-filter chips, and one
 * `rowan-table`. Client tables get filtered rows. `data-mode="server"` sends
 * the tree to `getRows`. Chart series stay on the host.
 *
 * Load it from `@rowan-ui/core/dashboard`. This module does not import chart
 * or table implementations.
 *
 * `rowan-dashboard-change` fires on `root` with `{ filters, source }`.
 * `source` is `api`, `chart`, `control`, `filter`, `chip`, `url`, or `clear`.
 * `rowan-dashboard-clear` fires as well when the tree becomes empty.
 * Clicks toggle: the same point again clears that field. Point buttons stay
 * the chart's keyboard controls.
 *
 * @param {RowanDashboardOptions} [options]
 * @returns {RowanDashboard}
 */
export function createDashboard(options = {}) {
  const settings = options && typeof options === "object" ? options : {};
  const root = isElement(settings.root) ? settings.root : null;
  const urlConfig = normalizeUrl(settings.url);
  const view = urlConfig ? urlConfig.window : null;
  const param = urlConfig?.param ?? "df";
  const historyMode = urlConfig?.history === "replace" ? "replace" : "push";
  const messages = normalizeMessages(settings.messages, DEFAULT_MESSAGES);

  const builders = collectBuilders(settings, root);
  const charts = collectCharts(settings, root);
  const controls = collectControls(settings, root);
  const table = collectTable(settings, root);

  /** @type {Array<RowanDashboardFilter | RowanDashboardFilterGroup>} */
  let state = [];
  /** @type {object[] | null} */
  let sourceRows = captureRows(settings.rows, table);
  let ready = false;
  let destroyed = false;

  /** @type {Set<(filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup>) => void>} */
  const listeners = new Set();
  /** @type {Array<() => void>} */
  const cleanups = [];
  /** @type {HTMLElement | null} */
  let chipsHost = null;
  let chipsOwned = false;

  for (const builder of builders) {
    listen(builder, "rowan-filter-change", (event) => {
      const detail = event.detail;
      const next = Array.isArray(detail?.filters) ? detail.filters : builder.filters;
      commit(next, "filter", builder);
    });
  }

  for (const chart of charts) {
    listen(chart.element, "rowan-point-activate", (event) => {
      const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
      const raw =
        typeof chart.value === "function" ? chart.value(detail) : detail[chart.value || "label"];
      if (isBlank(raw)) return;
      toggleField(chart.field, raw, "chart");
    });
  }

  for (const control of controls) {
    listen(control.element, control.event || "rowan-change", (event) => {
      const raw = readControl(control, event);
      if (isBlank(raw)) clearField(control.field, "control", control.element);
      else setField(control.field, raw, "control", control.element);
    });
  }

  if (view && urlConfig) {
    const onPop = () => {
      if (destroyed) return;
      const read = readHref(view.location.href, param);
      commit(read.present ? read.filters : [], "url");
    };
    view.addEventListener("popstate", onPop);
    cleanups.push(() => view.removeEventListener("popstate", onPop));
  }

  const seeded = seedFilters(settings, builders, view, param);
  commit(seeded.filters, "init", null, seeded.fromUrl ? "skip" : "replace", false);

  function commit(next, source, origin = null, history = historyFor(source), notify = true) {
    if (destroyed && source !== "init") return;
    const normalized = normalizeTree(next);
    const changed = !ready || signature(normalized) !== signature(state);
    ready = true;
    if (!changed) {
      if (history === "push" || history === "replace") writeHistory(history);
      return;
    }

    state = normalized;
    syncBuilders(source, origin);
    syncControls(origin);
    publishTable();
    if (source === "filter") {
      queueMicrotask(() => {
        if (!destroyed) publishTable();
      });
    }
    renderChips();
    if (history === "push" || history === "replace") writeHistory(history);
    if (!notify) return;

    const snapshot = cloneTree(state);
    for (const listener of listeners) listener(snapshot);
    dispatch("rowan-dashboard-change", { filters: snapshot, source });
    if (snapshot.length === 0) dispatch("rowan-dashboard-clear", { filters: snapshot, source });
  }

  function historyFor(source) {
    if (!urlConfig || source === "url" || source === "init") return "skip";
    return historyMode;
  }

  function writeHistory(mode) {
    if (!view?.location?.href || !view.history) return;
    const next = hrefWithFilters(view.location.href, param, state);
    const current = new URL(view.location.href);
    if (
      `${next.pathname}${next.search}${next.hash}` ===
      `${current.pathname}${current.search}${current.hash}`
    ) {
      return;
    }
    const method = mode === "replace" ? "replaceState" : "pushState";
    view.history[method](
      { rowanDashboard: param },
      "",
      `${next.pathname}${next.search}${next.hash}`,
    );
  }

  function syncBuilders(source, origin) {
    for (const builder of builders) {
      if (source === "filter" && builder === origin) continue;
      const current = Array.isArray(builder.filters) ? builder.filters : [];
      if (signature(current) === signature(state)) continue;
      builder.filters = cloneTree(state);
    }
  }

  function syncControls(origin) {
    for (const control of controls) {
      if (control.element === origin) continue;
      writeControl(control, equalsValue(control.field));
    }
  }

  function publishTable() {
    if (!isElement(table)) return;
    if (table.dataMode === "server") {
      const current = Array.isArray(table.filters) ? table.filters : [];
      const next = [...current.filter(isQuickFilter), ...cloneTree(state)];
      if (JSON.stringify(current) === JSON.stringify(next)) return;
      table.filters = next;
      return;
    }
    if (!sourceRows) return;
    const nextRows =
      state.length === 0
        ? sourceRows.map((row) => ({ ...row }))
        : applyFilters(sourceRows, state, currentFields()).map((row) => ({ ...row }));
    if (JSON.stringify(table.rows ?? []) === JSON.stringify(nextRows)) return;
    table.rows = nextRows;
  }

  function currentFields() {
    if (Array.isArray(settings.fields) && settings.fields.length > 0) return settings.fields;
    for (const builder of builders) {
      if (Array.isArray(builder.fields) && builder.fields.length > 0) return builder.fields;
    }
    const columns = Array.isArray(table?.columns) ? table.columns : [];
    return columns
      .filter((column) => column && column.id)
      .map((column) => ({
        id: String(column.id),
        label:
          typeof column.header === "string" && column.header ? column.header : String(column.id),
        type:
          column.type === "number" || column.type === "date" || column.type === "boolean"
            ? column.type
            : "text",
      }));
  }

  function fieldFor(id) {
    return (
      currentFields().find((field) => field && field.id === id) ?? { id, label: id, type: "text" }
    );
  }

  function equalsValue(field) {
    const id = String(field ?? "").trim();
    const leaf = state.find(
      (node) =>
        !isFilterGroup(node) && node.field === id && (node.operator || "equals") === "equals",
    );
    return leaf ? leaf.value : undefined;
  }

  function setField(field, value, source, origin = null) {
    const id = String(field ?? "").trim();
    if (!id || destroyed) return;
    let replaced = false;
    const next = [];
    for (const node of state) {
      if (!isFilterGroup(node) && node.field === id) {
        if (!replaced) {
          next.push({ field: id, operator: "equals", value });
          replaced = true;
        }
        continue;
      }
      const copy = cloneNode(node);
      if (copy) next.push(copy);
    }
    if (!replaced) next.push({ field: id, operator: "equals", value });
    commit(next, source, origin);
  }

  function clearField(field, source, origin = null) {
    const id = String(field ?? "").trim();
    if (!id || destroyed) return;
    commit(
      state.filter((node) => isFilterGroup(node) || node.field !== id),
      source,
      origin,
    );
  }

  function toggleField(field, value, source) {
    const current = equalsValue(field);
    if (current !== undefined && String(current) === String(value)) clearField(field, source);
    else setField(field, value, source);
  }

  function renderChips() {
    if (state.length === 0) {
      if (!chipsHost) return;
      chipsHost.replaceChildren();
      chipsHost.hidden = true;
      return;
    }

    const host = ensureChips();
    if (!host) return;
    const focusIndex = focusedChipIndex(host);
    host.replaceChildren();
    host.hidden = false;
    const list = document.createElement("div");
    list.role = "list";
    list.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "chipsLabel"));
    list.style.display = "flex";
    list.style.flexWrap = "wrap";
    list.style.gap = "var(--rowan-space-2, 0.5rem)";
    list.style.alignItems = "center";

    state.forEach((node, index) => {
      const text = chipText(node);
      const chip = new RowanChip();
      chip.setAttribute("role", "listitem");
      const label = document.createElement("span");
      label.textContent = text;
      const remove = quietButton(document.createElement("button"));
      remove.type = "button";
      remove.slot = "suffix";
      remove.dataset.dashboardRemove = String(index);
      remove.textContent = "×";
      remove.setAttribute(
        "aria-label",
        resolveMessage(messages, DEFAULT_MESSAGES, "remove", { label: text }),
      );
      remove.addEventListener("click", () => {
        const nextFocus = index;
        commit(
          state.filter((_, itemIndex) => itemIndex !== index),
          "chip",
        );
        const refreshed = ensureChips();
        const buttons = refreshed ? [...refreshed.querySelectorAll("[data-dashboard-remove]")] : [];
        const target =
          buttons[nextFocus] ||
          buttons[nextFocus - 1] ||
          refreshed?.querySelector("[data-dashboard-clear]");
        if (target instanceof HTMLElement) target.focus();
      });
      chip.append(label, remove);
      list.append(chip);
    });

    const clear = quietButton(document.createElement("button"));
    clear.type = "button";
    clear.dataset.dashboardClear = "";
    clear.textContent = resolveMessage(messages, DEFAULT_MESSAGES, "clear");
    clear.style.border =
      "var(--rowan-border-width, 1px) solid var(--rowan-color-border, currentColor)";
    clear.style.borderRadius = "999px";
    clear.style.padding = "0.2rem 0.7rem";
    clear.addEventListener("click", () => {
      commit([], "clear");
    });

    host.append(list, clear);
    if (focusIndex >= 0) {
      const buttons = [...host.querySelectorAll("[data-dashboard-remove]")];
      const target = buttons[focusIndex] || buttons[focusIndex - 1] || clear;
      if (target instanceof HTMLElement) target.focus();
    }
  }

  function chipText(node) {
    if (isFilterGroup(node)) {
      const key = node.join === "or" ? "groupOr" : "groupAnd";
      return resolveMessage(messages, DEFAULT_MESSAGES, key, { count: String(countLeaves(node)) });
    }
    const field = fieldFor(node.field);
    const operator = OPERATOR_LABELS[node.operator] || node.operator || "is";
    const value = VALUELESS.has(node.operator) ? "" : optionLabel(field, node.value);
    return resolveMessage(messages, DEFAULT_MESSAGES, "chip", {
      field: field.label || field.id || node.field,
      operator,
      value,
    });
  }

  function ensureChips() {
    if (chipsHost) return chipsHost;
    if (settings.chips === false) return null;
    if (isElement(settings.chips)) {
      chipsHost = settings.chips;
    } else if (root && settings.chips !== false) {
      chipsHost = document.createElement("div");
      chipsOwned = true;
      root.prepend(chipsHost);
    } else {
      return null;
    }

    chipsHost.dataset.dashboardChips = "";
    chipsHost.setAttribute("aria-live", "polite");
    chipsHost.style.alignItems = "center";
    chipsHost.style.display = "flex";
    chipsHost.style.flexWrap = "wrap";
    chipsHost.style.gap = "var(--rowan-space-2, 0.5rem)";
    return chipsHost;
  }

  function dispatch(type, detail) {
    if (!root || typeof CustomEvent !== "function") return;
    root.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }

  function listen(target, type, handler) {
    const wrapped = (event) => {
      if (!destroyed) handler(event);
    };
    target.addEventListener(type, wrapped);
    cleanups.push(() => target.removeEventListener(type, wrapped));
  }

  function restoreTable() {
    if (!isElement(table)) return;
    if (table.dataMode === "server") {
      const current = Array.isArray(table.filters) ? table.filters : [];
      table.filters = current.filter(isQuickFilter);
      return;
    }
    if (sourceRows) table.rows = sourceRows.map((row) => ({ ...row }));
  }

  return {
    get(field) {
      return equalsValue(field);
    },

    set(field, value) {
      if (isBlank(value)) clearField(field, "api");
      else setField(field, value, "api");
    },

    toggle(field, value) {
      if (isBlank(value) || destroyed) return;
      toggleField(field, value, "api");
    },

    clear(field) {
      if (destroyed) return;
      if (field == null || String(field).trim() === "") {
        commit([], "clear");
        return;
      }
      clearField(field, "clear");
    },

    replace(filters) {
      if (destroyed) return;
      commit(Array.isArray(filters) ? filters : [], "api");
    },

    snapshot() {
      return cloneTree(state);
    },

    search() {
      return hrefWithFilters("https://rowan.invalid/dashboard", param, state).search;
    },

    subscribe(listener) {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    setRows(rows) {
      sourceRows = Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
      if (!destroyed && isElement(table) && table.dataMode !== "server") publishTable();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const cleanup of cleanups) cleanup();
      cleanups.length = 0;
      listeners.clear();
      if (chipsOwned) chipsHost?.remove();
      else if (chipsHost) chipsHost.replaceChildren();
      restoreTable();
    },
  };
}

/**
 * @param {unknown} value
 * @returns {value is HTMLElement}
 */
function isElement(value) {
  return Boolean(value) && typeof value === "object" && value.nodeType === 1;
}

function isChartElement(element) {
  const name = element.localName || "";
  return name.endsWith("-chart") || element.hasAttribute("data-dashboard-chart");
}

function isBuilder(element) {
  return isElement(element) && element.localName === "rowan-filter-builder";
}

function isQuickFilter(item) {
  return Boolean(
    item &&
    typeof item === "object" &&
    item.id &&
    item.field == null &&
    item.join == null &&
    !item.filters,
  );
}

function isBlank(value) {
  return value == null || (typeof value === "string" && value.trim() === "");
}

/**
 * @param {RowanDashboardOptions} settings
 * @param {HTMLElement | null} root
 */
function collectBuilders(settings, root) {
  if (isBuilder(settings.filters)) return [settings.filters];
  if (isFilterTree(settings.filters) || settings.filters === undefined) {
    return root ? [...root.querySelectorAll("rowan-filter-builder")] : [];
  }
  return [];
}

/**
 * @param {RowanDashboardOptions} settings
 * @param {HTMLElement | null} root
 */
function collectCharts(settings, root) {
  const source = Array.isArray(settings.charts)
    ? settings.charts
    : root
      ? [...root.querySelectorAll("[data-dashboard-field]")].filter(isChartElement)
      : [];
  const charts = [];
  for (const entry of source) {
    const chart = normalizeChart(entry);
    if (chart) charts.push(chart);
  }
  return charts;
}

/**
 * @param {HTMLElement | RowanDashboardChart} entry
 */
function normalizeChart(entry) {
  if (isElement(entry)) {
    const field = entry.getAttribute("data-dashboard-field")?.trim() || "";
    if (!field) return null;
    return { element: entry, field, value: entry.getAttribute("data-dashboard-value") || "label" };
  }
  if (!entry || !isElement(entry.element)) return null;
  const field = String(entry.field ?? "").trim();
  if (!field) return null;
  return { element: entry.element, field, value: entry.value || "label" };
}

/**
 * @param {RowanDashboardOptions} settings
 * @param {HTMLElement | null} root
 */
function collectControls(settings, root) {
  if (Array.isArray(settings.controls)) {
    return settings.controls
      .filter(
        (control) => control && isElement(control.element) && String(control.field ?? "").trim(),
      )
      .map((control) => ({
        element: control.element,
        field: String(control.field).trim(),
        event: control.event,
        read: control.read,
        write: control.write,
      }));
  }
  if (!root || settings.controls != null) return [];
  return [...root.querySelectorAll("[data-dashboard-field]")]
    .filter(
      (element) =>
        !isChartElement(element) && !isBuilder(element) && element.localName !== "rowan-table",
    )
    .map((element) => ({
      element,
      field: element.getAttribute("data-dashboard-field").trim(),
      event: element.getAttribute("data-dashboard-event") || "rowan-change",
    }))
    .filter((control) => control.field);
}

/**
 * @param {RowanDashboardOptions} settings
 * @param {HTMLElement | null} root
 */
function collectTable(settings, root) {
  if (settings.table === null) return null;
  if (isElement(settings.table)) return settings.table;
  if (!root || settings.table != null) return null;
  return root.querySelector("rowan-table");
}

/**
 * @param {unknown} rows
 * @param {HTMLElement | null} table
 */
function captureRows(rows, table) {
  if (Array.isArray(rows)) return rows.map((row) => ({ ...row }));
  if (isElement(table) && table.dataMode !== "server" && Array.isArray(table.rows)) {
    return table.rows.map((row) => ({ ...row }));
  }
  return null;
}

/**
 * @param {RowanDashboardOptions} settings
 * @param {HTMLElement[]} builders
 * @param {RowanDashboardUrlWindow | null} view
 * @param {string} param
 */
function seedFilters(settings, builders, view, param) {
  if (view?.location?.href) {
    const read = readHref(view.location.href, param);
    if (read.present) return { filters: read.filters, fromUrl: true };
  }
  if (isFilterTree(settings.filters)) return { filters: settings.filters, fromUrl: false };
  for (const builder of builders) {
    if (Array.isArray(builder.filters) && builder.filters.length > 0) {
      return { filters: builder.filters, fromUrl: false };
    }
  }
  return { filters: [], fromUrl: false };
}

/**
 * @param {unknown} value
 * @returns {value is Array<RowanDashboardFilter | RowanDashboardFilterGroup>}
 */
function isFilterTree(value) {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      !item.nodeType &&
      (item.field || item.join || item.filters),
  );
}

/**
 * @param {boolean | RowanDashboardUrlOptions | undefined} url
 * @returns {{ param: string, history: "push" | "replace", window: RowanDashboardUrlWindow | null } | null}
 */
function normalizeUrl(url) {
  if (!url) return null;
  const options = url === true ? {} : url;
  if (!options || typeof options !== "object") return null;
  const param = String(options.param ?? "df").trim() || "df";
  const history = options.history === "replace" ? "replace" : "push";
  const windowLike = options.window || (typeof window !== "undefined" ? window : null);
  return { param, history, window: windowLike };
}

function normalizeTree(value) {
  const source = Array.isArray(value) ? value : [];
  return source.map(cloneNode).filter(Boolean);
}

function cloneTree(nodes) {
  return nodes.map(cloneNode).filter(Boolean);
}

function cloneNode(value) {
  if (!value || typeof value !== "object") return null;
  if (isFilterGroup(value)) {
    const clone = {
      join: value.join === "or" ? "or" : "and",
      filters: value.filters.map(cloneNode).filter(Boolean),
    };
    if (value.id) clone.id = String(value.id);
    return clone;
  }
  const field = String(value.field ?? "").trim();
  if (!field) return null;
  const clone = {
    field,
    operator: String(value.operator ?? "equals").trim() || "equals",
    value: value.value == null ? "" : value.value,
  };
  if (value.id) clone.id = String(value.id);
  return clone;
}

function signature(nodes) {
  return JSON.stringify(normalizeTree(nodes).map(signatureNode));
}

function signatureNode(node) {
  if (isFilterGroup(node)) {
    return { join: node.join, filters: node.filters.map(signatureNode) };
  }
  return { field: node.field, operator: node.operator || "equals", value: node.value ?? "" };
}

function countLeaves(node) {
  if (isFilterGroup(node))
    return node.filters.reduce((total, child) => total + countLeaves(child), 0);
  return 1;
}

function optionLabel(field, value) {
  const options = Array.isArray(field?.options) ? field.options : [];
  const match = options.find((option) => {
    if (option && typeof option === "object") return String(option.value) === String(value);
    return String(option) === String(value);
  });
  if (!match) return value == null ? "" : String(value);
  if (typeof match === "object") return match.label || String(value ?? "");
  return String(match);
}

function readControl(control, event) {
  if (typeof control.read === "function") return control.read(event);
  if (event?.detail && typeof event.detail === "object" && "value" in event.detail)
    return event.detail.value;
  if (control.element && "value" in control.element) return control.element.value;
  return "";
}

function writeControl(control, value) {
  const next = value == null ? "" : String(value);
  if (typeof control.write === "function") {
    control.write(value == null ? "" : value);
    return;
  }
  if (control.element && "value" in control.element && control.element.value !== next) {
    control.element.value = next;
  }
}

function quietButton(button) {
  button.style.background = "transparent";
  button.style.border = "0";
  button.style.borderRadius = "var(--rowan-radius-sm, 4px)";
  button.style.color = "inherit";
  button.style.cursor = "pointer";
  button.style.font = "inherit";
  button.style.padding = "0.1rem 0.25rem";
  return button;
}

function focusedChipIndex(host) {
  const active = host.ownerDocument?.activeElement;
  const button = active?.closest?.("[data-dashboard-remove]");
  if (!button || !host.contains(button)) return -1;
  return Number(button.dataset.dashboardRemove);
}

function needsJson(filters) {
  return filters.some((node) => {
    if (isFilterGroup(node)) return true;
    if (node.value != null && typeof node.value === "object") return true;
    return String(node.field).startsWith("json:");
  });
}

function encodeLeaf(filter) {
  return [filter.field, filter.operator || "equals", filter.value ?? ""]
    .map((part) => encodeURIComponent(String(part)))
    .join("~");
}

function decodeLeaf(raw) {
  const parts = String(raw).split("~");
  if (parts.length < 3) return null;
  try {
    const field = decodeURIComponent(parts[0]).trim();
    const operator = decodeURIComponent(parts[1]).trim();
    const value = decodeURIComponent(parts.slice(2).join("~"));
    if (!field || !operator) return null;
    return { field, operator, value };
  } catch {
    return null;
  }
}

function readHref(href, param) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return { present: false, filters: [] };
  }
  const query = url.search.startsWith("?") ? url.search.slice(1) : url.search;
  const tokens = [];
  let present = false;
  for (const pair of query.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const rawKey = eq < 0 ? pair : pair.slice(0, eq);
    const rawValue = eq < 0 ? "" : pair.slice(eq + 1);
    let key = rawKey;
    try {
      key = decodeURIComponent(rawKey.replaceAll("+", " "));
    } catch {
      continue;
    }
    if (key !== param) continue;
    present = true;
    tokens.push(rawValue);
  }
  if (!present) return { present: false, filters: [] };
  if (tokens.length === 1 && (tokens[0].startsWith("json%3A") || tokens[0].startsWith("json:"))) {
    try {
      const text = decodeURIComponent(tokens[0].replaceAll("+", " "));
      const json = text.startsWith("json:") ? text.slice(5) : text;
      const parsed = JSON.parse(json);
      return { present: true, filters: Array.isArray(parsed) ? parsed : [] };
    } catch {
      return { present: true, filters: [] };
    }
  }
  return { present: true, filters: tokens.map(decodeLeaf).filter(Boolean) };
}

function hrefWithFilters(href, param, filters) {
  const url = new URL(href);
  const query = url.search.startsWith("?") ? url.search.slice(1) : url.search;
  const kept = [];
  for (const pair of query.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const rawKey = eq < 0 ? pair : pair.slice(0, eq);
    let key = rawKey;
    try {
      key = decodeURIComponent(rawKey.replaceAll("+", " "));
    } catch {
      kept.push(pair);
      continue;
    }
    if (key === param) continue;
    kept.push(pair);
  }
  if (filters.length > 0) {
    if (needsJson(filters)) {
      kept.push(
        `${encodeURIComponent(param)}=${encodeURIComponent(`json:${JSON.stringify(cloneTree(filters))}`)}`,
      );
    } else {
      for (const filter of filters) {
        if (isFilterGroup(filter)) continue;
        kept.push(`${encodeURIComponent(param)}=${encodeLeaf(filter)}`);
      }
    }
  }
  url.search = kept.length ? `?${kept.join("&")}` : "";
  return url;
}
