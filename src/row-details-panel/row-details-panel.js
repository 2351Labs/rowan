import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "../lib/enum.js";
import { emit } from "../lib/events.js";
import { collectFocusableElements } from "../lib/focus.js";
import { pushOverlay, removeOverlay } from "../lib/overlay-stack.js";
import {
  isRowanTable,
  observeTableAvailability,
  resolveRowanTable,
} from "../lib/table-selection.js";

import "../icon-button/icon-button.js";

let rowDetailsPanelId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeRowId(value) {
  return String(value ?? "");
}

function hasRowId(value) {
  return value != null && normalizeRowId(value).trim().length > 0;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const PANEL_SIZES = new Set(["sm", "md", "lg"]);

function normalizeFields(value) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.reduce((fields, item) => {
    if (!item || typeof item !== "object") return fields;

    const id = normalizeText(item.id ?? item.field);
    if (!id || ids.has(id)) return fields;

    const accessor =
      typeof item.accessor === "function" ? item.accessor : normalizeText(item.accessor) || null;
    const format = typeof item.format === "function" ? item.format : null;

    ids.add(id);
    fields.push({
      id,
      label: normalizeText(item.label) || id,
      accessor,
      format,
      hidden: Boolean(item.hidden),
    });
    return fields;
  }, []);
}

function cloneField(field) {
  return { ...field };
}

function isDetailColumn(column) {
  if (!column || typeof column !== "object" || column.hidden || !normalizeText(column.id)) {
    return false;
  }

  return !["button", "icon-button", "custom", "sparkline"].includes(column.type);
}

function formatDisplayValue(value) {
  if (value == null || value === "") return "Not set";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "Not set" : value.toLocaleString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatDisplayValue(item)).join(", ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

/**
 * Side-panel detail view for a selected Rowan data-table row.
 * @tag rowan-row-details-panel
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} for-table
 * @attr {string} row-id
 * @attr {string} label
 * @attr {string} close-label
 * @property {string[]} rowIds - Queue of row ids for previous/next. Arrays are property-only.
 * @slot title - Custom panel title
 * @slot empty - Content shown when no row is available
 * @slot pager - Replaces the default previous/next controls
 * @slot - Supplemental detail content
 * @slot actions - Panel actions
 * @csspart overlay
 * @csspart panel
 * @csspart header
 * @csspart title
 * @csspart close
 * @csspart pager
 * @csspart body
 * @csspart fields
 * @csspart field
 * @csspart empty
 * @csspart actions
 * @cssprop --rowan-row-details-panel-bg
 * @cssprop --rowan-row-details-panel-border
 * @cssprop --rowan-row-details-panel-width
 * @event rowan-close - Fired when the user dismisses the panel
 * @event rowan-navigate - Fired when the user moves to another queued row
 */
export class RowanRowDetailsPanel extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./row-details-panel.css", import.meta.url).href;
  static observedAttributes = [
    "open",
    "side",
    "size",
    "for-table",
    "row-id",
    "label",
    "close-label",
  ];
  static upgradeProperties = [
    "table",
    "forTable",
    "row",
    "rowId",
    "rowIds",
    "fields",
    "open",
    "side",
    "size",
    "label",
    "closeLabel",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableController = null;
  #tableObserver = null;
  #tableAvailabilityCleanup = null;
  #row = null;
  #rowIsExplicit = false;
  #fields = [];
  #hasExplicitFields = false;
  #overlay = null;
  #panel = null;
  #title = null;
  #titleText = null;
  #closeButton = null;
  #fieldsContainer = null;
  #emptyState = null;
  #controlsController = null;
  #lastFocused = null;
  #isOpen = false;
  #titleId = "";
  #queue = [];
  #queueIndex = 0;
  #pager = null;
  #pagerStatus = null;
  #prevButton = null;
  #nextButton = null;
  #pagerSlot = null;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#titleId) {
      rowDetailsPanelId += 1;
      this.#titleId = `rowan-row-details-panel-${rowDetailsPanelId}__title`;
    }

    this.#bindControls();
    this.#syncTable();
  }

  disconnectedCallback() {
    this.#controlsController?.abort();
    this.#controlsController = null;

    if (this.#isOpen) {
      removeOverlay(this);
      this.#isOpen = false;
    }

    // A modal removed while open would stay in the top layer and block the page.
    if (this.#overlay?.open) {
      this.#overlay.close();
    }

    this.#unbindTable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "for-table" && oldValue !== newValue) {
      this.#syncTable();
    }

    if (name === "row-id" && oldValue !== newValue) {
      this.#syncRowFromTable();
    }

    if (name === "size" && rewriteEnumAttribute(this, name, newValue, PANEL_SIZES, "md")) {
      return;
    }
  }

  get table() {
    return this.#boundTable;
  }

  set table(value) {
    this.#tableOverride = isRowanTable(value) ? value : null;
    this.#syncTable();
    this.requestRender();
  }

  get forTable() {
    return this.readString("for-table", "").trim();
  }

  set forTable(value) {
    const next = normalizeText(value);
    this.reflectString("for-table", next || null);
  }

  get row() {
    return this.#row;
  }

  set row(value) {
    this.#row = isRecord(value) ? value : null;
    this.#rowIsExplicit = isRecord(value);
    this.#syncRowFromTable();
    this.requestRender();
  }

  get rowId() {
    return this.readString("row-id", "");
  }

  set rowId(value) {
    const next = normalizeRowId(value);
    this.reflectString("row-id", next.trim().length > 0 ? next : null);
  }

  /** @returns {string[]} */
  get rowIds() {
    return [...this.#queue];
  }

  /** @param {string[]} value */
  set rowIds(value) {
    this.#setQueue(value, this.rowId);
    this.requestRender();
  }

  /** @returns {"sm" | "md" | "lg"} */
  get size() {
    return normalizeEnum(this.readString("size", "md"), PANEL_SIZES, "md");
  }

  /** @param {"sm" | "md" | "lg"} value */
  set size(value) {
    reflectEnum(this, "size", value, PANEL_SIZES, "md");
  }

  get fields() {
    return this.#fields.map(cloneField);
  }

  set fields(value) {
    this.#hasExplicitFields = Array.isArray(value);
    this.#fields = normalizeFields(value);
    this.requestRender();
  }

  get open() {
    return this.readBoolean("open");
  }

  set open(value) {
    this.reflectBoolean("open", Boolean(value));
  }

  get side() {
    return this.readString("side", "end") === "start" ? "start" : "end";
  }

  set side(value) {
    this.reflectString("side", value === "start" ? "start" : null);
  }

  get label() {
    return this.readString("label", "Row details");
  }

  set label(value) {
    const next = normalizeText(value);
    this.reflectString("label", next && next !== "Row details" ? next : null);
  }

  get closeLabel() {
    return this.readString("close-label", "Close details");
  }

  set closeLabel(value) {
    const next = normalizeText(value);
    this.reflectString("close-label", next && next !== "Close details" ? next : null);
  }

  show(row = this.row, rowId = this.rowId) {
    if (isRecord(row)) this.row = row;
    if (rowId != null) this.rowId = rowId;
    if (this.#queue.length === 0 && hasRowId(this.rowId)) {
      this.#setQueue([this.rowId], this.rowId);
    } else if (hasRowId(this.rowId)) {
      this.#queueIndex = Math.max(0, this.#queue.indexOf(normalizeRowId(this.rowId)));
    }
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  refresh() {
    this.#syncTable();
    this.requestRender();
  }

  render() {
    if (!this.#panel) {
      this.renderRoot.innerHTML = `
        <dialog class="overlay" part="overlay">
          <aside class="panel" part="panel" tabindex="-1">
            <header class="header" part="header">
              <div class="heading">
                <h2 class="title" part="title"><slot name="title"><span class="title-text"></span></slot></h2>
              </div>
              <div class="header-actions">
                <div class="pager" part="pager" hidden>
                  <rowan-icon-button class="prev" variant="ghost">‹</rowan-icon-button>
                  <span class="pager-status"></span>
                  <rowan-icon-button class="next" variant="ghost">›</rowan-icon-button>
                </div>
                <slot name="pager"></slot>
                <rowan-icon-button class="close" part="close" variant="ghost">x</rowan-icon-button>
              </div>
            </header>
            <div class="body" part="body">
              <dl class="fields" part="fields"></dl>
              <div class="empty" part="empty" hidden><slot name="empty">No row selected.</slot></div>
              <slot></slot>
            </div>
            <footer class="actions" part="actions"><slot name="actions"></slot></footer>
          </aside>
        </dialog>
      `;

      this.#overlay = this.renderRoot.querySelector("dialog");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#title = this.renderRoot.querySelector(".title");
      this.#titleText = this.renderRoot.querySelector(".title-text");
      this.#closeButton = this.renderRoot.querySelector(".close");
      this.#pager = this.renderRoot.querySelector(".pager");
      this.#pagerStatus = this.renderRoot.querySelector(".pager-status");
      this.#prevButton = this.renderRoot.querySelector(".prev");
      this.#nextButton = this.renderRoot.querySelector(".next");
      this.#pagerSlot = this.renderRoot.querySelector('slot[name="pager"]');
      this.#fieldsContainer = this.renderRoot.querySelector(".fields");
      this.#emptyState = this.renderRoot.querySelector(".empty");
    }

    this.#bindControls();
    this.#syncTable();
    this.#syncRowFromTable();
    this.#title.id = this.#titleId;
    this.#panel.setAttribute("aria-labelledby", this.#titleId);
    this.#titleText.textContent = this.label;
    this.#closeButton.label = this.closeLabel;
    this.#prevButton.label = "Previous row";
    this.#nextButton.label = "Next row";
    this.#renderPager();
    this.#renderDetails();
    this.#applyDefaultA11y();
    this.#syncOpenState();
  }

  #bindControls() {
    if (!this.#panel || this.#controlsController) return;

    this.#controlsController = new AbortController();
    const { signal } = this.#controlsController;

    this.#closeButton.addEventListener(
      "rowan-click",
      (event) => {
        event.stopPropagation();
        this.#requestUserClose("close-button");
      },
      { signal },
    );

    this.#overlay.addEventListener(
      "click",
      (event) => {
        if (event.target === this.#overlay) {
          this.#requestUserClose("backdrop");
        }
      },
      { signal },
    );

    this.#prevButton.addEventListener(
      "rowan-click",
      (event) => {
        event.stopPropagation();
        this.#moveQueue(-1);
      },
      { signal },
    );

    this.#nextButton.addEventListener(
      "rowan-click",
      (event) => {
        event.stopPropagation();
        this.#moveQueue(1);
      },
      { signal },
    );

    this.#pagerSlot.addEventListener("slotchange", () => this.requestRender(), { signal });

    this.#overlay.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        this.#requestUserClose("escape");
      },
      { signal },
    );
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) {
      if (!nextTable) this.#observeTableAvailability();
      return;
    }

    this.#unbindTable();
    this.#boundTable = nextTable;
    this.#syncRowFromTable();
    if (!nextTable) {
      this.#observeTableAvailability();
      return;
    }

    this.#tableController = new AbortController();
    nextTable.addEventListener(
      "rowan-row-activate",
      (event) => {
        this.#handleTableActivation(event);
      },
      { signal: this.#tableController.signal },
    );

    if (nextTable.shadowRoot && typeof MutationObserver !== "undefined") {
      this.#tableObserver = new MutationObserver(() => {
        if (!this.#rowIsExplicit) this.requestRender();
      });
      this.#tableObserver.observe(nextTable.shadowRoot, { childList: true, subtree: true });
    }
  }

  #unbindTable() {
    this.#tableController?.abort();
    this.#tableController = null;
    this.#tableObserver?.disconnect();
    this.#tableObserver = null;
    this.#tableAvailabilityCleanup?.();
    this.#tableAvailabilityCleanup = null;
    this.#boundTable = null;
  }

  #observeTableAvailability() {
    if (!this.forTable) {
      this.#tableAvailabilityCleanup?.();
      this.#tableAvailabilityCleanup = null;
      return;
    }

    if (!this.isConnected || this.#tableAvailabilityCleanup || this.#tableOverride) {
      return;
    }

    this.#tableAvailabilityCleanup = observeTableAvailability(
      this,
      () => this.forTable,
      () => {
        this.#tableAvailabilityCleanup = null;
        this.#syncTable();
        this.requestRender();
      },
    );
  }

  #handleTableActivation(event) {
    const detail = event.detail;
    if (!detail || !isRecord(detail.row)) return;

    const activated = normalizeRowId(detail.rowId);
    const selected = Array.isArray(this.#boundTable?.selected)
      ? this.#boundTable.selected.map((id) => normalizeRowId(id)).filter((id) => hasRowId(id))
      : [];
    const queue =
      selected.length > 1 && selected.includes(activated) ? selected : [activated].filter(hasRowId);

    this.#rowIsExplicit = false;
    this.#setQueue(queue, activated);
    this.#row = detail.row;
    this.rowId = activated;
    this.open = true;
    this.requestRender();
  }

  #setQueue(value, currentId) {
    const ids = [];
    const seen = new Set();
    for (const item of Array.isArray(value) ? value : []) {
      const id = normalizeRowId(item);
      if (!hasRowId(id) || seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
    }

    this.#queue = ids;
    const current = normalizeRowId(currentId);
    const index = ids.indexOf(current);
    this.#queueIndex = index >= 0 ? index : 0;
  }

  #moveQueue(delta) {
    if (this.#queue.length < 2) return;

    const next = this.#queueIndex + delta;
    if (next < 0 || next >= this.#queue.length) return;

    this.#queueIndex = next;
    const rowId = this.#queue[next];
    this.#rowIsExplicit = false;
    this.rowId = rowId;
    this.#syncRowFromTable();
    this.requestRender();
    emit(this, "rowan-navigate", {
      reason: delta > 0 ? "next" : "previous",
      rowId,
      index: next,
      rowIds: [...this.#queue],
      row: this.#row,
    });
  }

  #renderPager() {
    const hasCustomPager = this.#pagerSlot.assignedNodes().some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return true;
    });
    const showPager = this.#queue.length > 1 && !hasCustomPager;
    this.#pager.hidden = !showPager;
    this.#pager.inert = !showPager;
    if (!showPager) return;

    this.#pagerStatus.textContent = `${this.#queueIndex + 1} of ${this.#queue.length}`;
    this.#prevButton.disabled = this.#queueIndex <= 0;
    this.#nextButton.disabled = this.#queueIndex >= this.#queue.length - 1;
  }

  #syncRowFromTable() {
    if (this.#rowIsExplicit) return;

    const rowId = this.rowId;
    if (!hasRowId(rowId) || !this.#boundTable) {
      this.#row = null;
      return;
    }

    const rows = Array.isArray(this.#boundTable.rows) ? this.#boundTable.rows : [];
    const configuredRowId = this.#boundTable.config?.rowId;
    this.#row =
      rows.find(
        (row, rowIndex) => this.#resolveTableRowId(row, rowIndex, configuredRowId) === rowId,
      ) ?? null;
  }

  #resolveTableRowId(row, rowIndex, configuredRowId) {
    if (typeof configuredRowId === "function") {
      try {
        const value = configuredRowId(row, rowIndex);
        const normalized = normalizeRowId(value);
        if (hasRowId(value)) return normalized;
      } catch {
        return normalizeRowId(rowIndex);
      }

      return normalizeRowId(rowIndex);
    }

    if (typeof configuredRowId === "string" && configuredRowId.trim().length > 0) {
      const value = row?.[configuredRowId];
      const normalized = normalizeRowId(value);
      if (hasRowId(value)) return normalized;
    }

    return normalizeRowId(rowIndex);
  }

  #renderDetails() {
    const row = this.#row;
    this.#fieldsContainer.textContent = "";
    this.#fieldsContainer.hidden = !row;
    this.#emptyState.hidden = Boolean(row);
    if (!row) return;

    this.#resolvedFields(row)
      .filter((field) => !field.hidden)
      .forEach((field) => {
        const group = document.createElement("div");
        group.className = "field";
        group.part = "field";

        const term = document.createElement("dt");
        term.className = "term";
        term.textContent = field.label;

        const description = document.createElement("dd");
        description.className = "description";
        description.textContent = formatDisplayValue(this.#resolveFieldValue(field, row));

        group.append(term, description);
        this.#fieldsContainer.append(group);
      });
  }

  #resolvedFields(row) {
    if (this.#hasExplicitFields) return this.#fields;

    const columns = Array.isArray(this.#boundTable?.columns)
      ? this.#boundTable.columns.filter(isDetailColumn)
      : [];

    if (columns.length > 0) {
      return normalizeFields(
        columns.map((column) => ({
          id: column.id,
          label: normalizeText(column.header) || column.id,
          accessor: column.accessor,
          format: column.format,
        })),
      );
    }

    return normalizeFields(Object.keys(row).map((id) => ({ id, label: id })));
  }

  #resolveFieldValue(field, row) {
    try {
      const value =
        typeof field.accessor === "function"
          ? field.accessor(row)
          : typeof field.accessor === "string"
            ? row[field.accessor]
            : row[field.id];

      return typeof field.format === "function" ? field.format(value, row) : value;
    } catch {
      return "Not set";
    }
  }

  #requestUserClose(reason) {
    if (!this.open) return;

    this.open = false;
    emit(this, "rowan-close", {
      reason,
      rowId: this.rowId,
      row: this.row,
    });
  }

  #syncOpenState() {
    this.inert = !this.open;

    // showModal() moves focus, so capture the restore target before reconciling.
    if (this.open && !this.#isOpen) {
      this.#lastFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    this.#reconcileNativeOpen();

    if (this.open === this.#isOpen) return;

    this.#isOpen = this.open;
    if (this.open) {
      pushOverlay(this);
      return;
    }

    removeOverlay(this);
    if (this.#lastFocused?.isConnected) this.#lastFocused.focus();
    this.#lastFocused = null;
  }

  /** Keeps the native dialog in sync even when `open` did not change, e.g. after reconnecting. */
  #reconcileNativeOpen() {
    if (!this.#overlay) return;

    if (this.open && this.isConnected && !this.#overlay.open) {
      this.#overlay.showModal();
      queueMicrotask(() => {
        if (this.open) this.#focusFirstElement();
      });
      return;
    }

    if (!this.open && this.#overlay.open) {
      this.#overlay.close();
    }
  }

  #focusFirstElement() {
    const [first] = this.#collectFocusableElements();
    (first ?? this.#panel).focus();
  }

  #collectFocusableElements() {
    return collectFocusableElements(this.#panel);
  }

  #applyDefaultA11y() {
    if (this.open) {
      this.#overlay.setAttribute("aria-label", this.label);
    } else {
      this.#overlay.removeAttribute("aria-label");
    }

    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = null;
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = null;
    }

    if (!this.hasAttribute("aria-hidden") && "ariaHidden" in this.internals) {
      this.internals.ariaHidden = this.open ? "false" : "true";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = null;
    }
  }
}

define("rowan-row-details-panel", RowanRowDetailsPanel);
