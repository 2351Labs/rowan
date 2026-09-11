import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { isRowanTable, resolveRowanTable } from "../lib/table-selection.js";

import "../icon-button/icon-button.js";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "rowan-button:not([disabled])",
  "rowan-icon-button:not([disabled])",
  "rowan-link",
].join(",");

let rowDetailsPanelId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

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

  return !["button", "icon-button", "custom"].includes(column.type);
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
 * @attr {string} for-table
 * @attr {string} row-id
 * @attr {string} label
 * @attr {string} close-label
 * @slot title - Custom panel title
 * @slot empty - Content shown when no row is available
 * @slot - Supplemental detail content
 * @slot actions - Panel actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart header
 * @csspart title
 * @csspart close
 * @csspart body
 * @csspart fields
 * @csspart field
 * @csspart empty
 * @csspart actions
 * @cssprop --rowan-row-details-panel-bg
 * @cssprop --rowan-row-details-panel-border
 * @event rowan-close - Fired when the user dismisses the panel
 */
export class RowanRowDetailsPanel extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./row-details-panel.css", import.meta.url).href;
  static observedAttributes = ["open", "side", "for-table", "row-id", "label", "close-label"];
  static upgradeProperties = [
    "table",
    "forTable",
    "row",
    "rowId",
    "fields",
    "open",
    "side",
    "label",
    "closeLabel",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableController = null;
  #tableObserver = null;
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
  #removeDocumentFocusListener = null;
  #isOpen = false;
  #titleId = "";
  #handleDocumentFocusIn = (event) => {
    if (!this.open || this.#isNodeInPanel(event.target)) return;
    this.#focusFirstElement();
  };

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
    const next = normalizeText(value);
    this.reflectString("row-id", next || null);
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
        <div class="overlay" part="overlay" hidden>
          <div class="backdrop" part="backdrop"></div>
          <aside class="panel" part="panel" tabindex="-1">
            <header class="header" part="header">
              <div class="heading">
                <h2 class="title" part="title"><slot name="title"><span class="title-text"></span></slot></h2>
              </div>
              <rowan-icon-button class="close" part="close" variant="ghost">x</rowan-icon-button>
            </header>
            <div class="body" part="body">
              <dl class="fields" part="fields"></dl>
              <div class="empty" part="empty" hidden><slot name="empty">No row selected.</slot></div>
              <slot></slot>
            </div>
            <footer class="actions" part="actions"><slot name="actions"></slot></footer>
          </aside>
        </div>
      `;

      this.#overlay = this.renderRoot.querySelector(".overlay");
      this.#panel = this.renderRoot.querySelector(".panel");
      this.#title = this.renderRoot.querySelector(".title");
      this.#titleText = this.renderRoot.querySelector(".title-text");
      this.#closeButton = this.renderRoot.querySelector("rowan-icon-button");
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
        if (event.target === this.#overlay || event.target === this.#overlay.firstElementChild) {
          this.#requestUserClose("backdrop");
        }
      },
      { signal },
    );

    this.#panel.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          this.#requestUserClose("escape");
          return;
        }

        if (event.key === "Tab") this.#trapTabFocus(event);
      },
      { signal },
    );
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) return;

    this.#unbindTable();
    this.#boundTable = nextTable;
    this.#syncRowFromTable();
    if (!nextTable) return;

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
        if (!this.#hasExplicitFields) this.requestRender();
      });
      this.#tableObserver.observe(nextTable.shadowRoot, { childList: true, subtree: true });
    }
  }

  #unbindTable() {
    this.#tableController?.abort();
    this.#tableController = null;
    this.#tableObserver?.disconnect();
    this.#tableObserver = null;
    this.#boundTable = null;
  }

  #handleTableActivation(event) {
    const detail = event.detail;
    if (!detail || !isRecord(detail.row)) return;

    this.rowId = detail.rowId;
    this.#row = detail.row;
    this.#rowIsExplicit = false;
    this.open = true;
    this.requestRender();
  }

  #syncRowFromTable() {
    if (this.#rowIsExplicit || !this.rowId || !this.#boundTable) return;

    const rows = Array.isArray(this.#boundTable.rows) ? this.#boundTable.rows : [];
    const rowId = this.rowId;
    const configuredRowId = this.#boundTable.config?.rowId;
    this.#row =
      rows.find(
        (row, rowIndex) => this.#resolveTableRowId(row, rowIndex, configuredRowId) === rowId,
      ) ?? null;
  }

  #resolveTableRowId(row, rowIndex, configuredRowId) {
    if (typeof configuredRowId === "function") {
      return normalizeText(configuredRowId(row, rowIndex) || rowIndex);
    }

    if (typeof configuredRowId === "string" && row?.[configuredRowId] != null) {
      return normalizeText(row[configuredRowId]);
    }

    return normalizeText(rowIndex);
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
    if (this.open === this.#isOpen) return;

    this.#isOpen = this.open;
    if (this.open) {
      this.#lastFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.#overlay.hidden = false;
      this.#removeDocumentFocusListener = this.listen(
        document,
        "focusin",
        this.#handleDocumentFocusIn,
        true,
      );
      queueMicrotask(() => this.#focusFirstElement());
      return;
    }

    this.#overlay.hidden = true;
    this.#removeDocumentFocusListener?.();
    this.#removeDocumentFocusListener = null;
    if (this.#lastFocused?.isConnected) this.#lastFocused.focus();
    this.#lastFocused = null;
  }

  #trapTabFocus(event) {
    const focusable = this.#collectFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.#panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.shadowRoot.activeElement || document.activeElement;

    if (event.shiftKey && (active === first || active === this.#panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  #collectFocusableElements() {
    const elements = new Set([this.#closeButton]);
    this.#panel.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => elements.add(element));
    this.#panel.querySelectorAll("slot").forEach((slot) => {
      slot.assignedElements({ flatten: true }).forEach((element) => {
        if (element.matches?.(FOCUSABLE_SELECTOR)) elements.add(element);
        element.querySelectorAll?.(FOCUSABLE_SELECTOR).forEach((nested) => elements.add(nested));
      });
    });
    return [...elements].filter((element) => element instanceof HTMLElement);
  }

  #focusFirstElement() {
    const [first] = this.#collectFocusableElements();
    (first ?? this.#panel).focus();
  }

  #isNodeInPanel(node) {
    return (
      node instanceof Node &&
      (this.contains(node) || Boolean(this.shadowRoot && this.shadowRoot.contains(node)))
    );
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "dialog";
    }

    if (!this.hasAttribute("aria-modal") && "ariaModal" in this.internals) {
      this.internals.ariaModal = "true";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label;
    }
  }
}

define("rowan-row-details-panel", RowanRowDetailsPanel);
