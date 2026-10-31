import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  isRowanTable,
  observeTableAvailability,
  observeTableSelection,
  readTableSelection,
  resolveRowanTable,
} from "../lib/table-selection.js";

import "../dropdown/dropdown.js";

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function isPanelFilterBuilder(node) {
  if (!node || node.localName !== "rowan-filter-builder") return false;

  const appearance =
    typeof node.appearance === "string" && node.appearance
      ? node.appearance
      : (node.getAttribute("appearance") ?? "panel");
  return appearance !== "toolbar";
}

const DEFAULT_MESSAGES = Object.freeze({
  columnPickerLabel: "Columns",
  selectionStatus: "{count} {selectionLabel}",
  visibleColumnsLabel: "Visible columns",
});

/**
 * @typedef {object} RowanTableToolbarMessages
 * @property {string} [columnPickerLabel]
 * @property {string | ((context: { count: number, selectionLabel: string }) => string)} [selectionStatus]
 * @property {string} [visibleColumnsLabel]
 */

/**
 * Table operations surface for filters and density. Selection count hides when a bulk-actions-bar is on the same table. A nested `panel` filter-builder wraps to a full second row; `appearance="toolbar"` chips stay on the first row. `column-picker` is a `rowan-dropdown`.
 * @tag rowan-table-toolbar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
 * @attr {boolean} column-picker
 * @property {RowanTableToolbarMessages} messages - Property-only built-in message overrides.
 * @slot start - Leading filters or navigation controls
 * @slot selection - Additional content beside the selected-row status
 * @slot - Primary table controls
 * @slot end - Trailing table controls
 * @csspart toolbar
 * @csspart start
 * @csspart selection
 * @csspart selection-text
 * @csspart content
 * @csspart end
 * @csspart column-picker
 * @csspart column-picker-menu
 * @cssprop --rowan-table-toolbar-bg
 * @cssprop --rowan-table-toolbar-border
 * @cssprop --rowan-table-toolbar-border-width
 * @cssprop --rowan-table-toolbar-selection-bg
 */
export class RowanTableToolbar extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./table-toolbar.css", import.meta.url).href;
  static observedAttributes = ["for-table", "label", "selection-label", "column-picker"];
  static upgradeProperties = [
    "table",
    "forTable",
    "label",
    "selectionLabel",
    "columnPicker",
    "messages",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableCleanup = null;
  #tableAvailabilityCleanup = null;
  #selected = [];
  #selectedRows = [];
  #toolbar = null;
  #content = null;
  #contentSlotEl = null;
  #selection = null;
  #selectionText = null;
  #columnPicker = null;
  #columnPickerMenu = null;
  #messages = {};
  #filterBuilderAppearanceObserver = null;

  connectedCallback() {
    super.connectedCallback();
    this.#syncTable();
  }

  disconnectedCallback() {
    this.#filterBuilderAppearanceObserver?.disconnect();
    this.#filterBuilderAppearanceObserver = null;
    this.#unbindTable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "for-table" && oldValue !== newValue) {
      this.#syncTable();
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
    const next = String(value ?? "").trim();
    this.reflectString("for-table", next || null);
  }

  get label() {
    return this.readString("label", "Table controls");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next && next !== "Table controls" ? next : null);
  }

  get selectionLabel() {
    return this.readString("selection-label", "selected");
  }

  set selectionLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("selection-label", next && next !== "selected" ? next : null);
  }

  get columnPicker() {
    return this.readBoolean("column-picker");
  }

  set columnPicker(value) {
    this.reflectBoolean("column-picker", Boolean(value));
  }

  /** @returns {RowanTableToolbarMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanTableToolbarMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  get selected() {
    return [...this.#selected];
  }

  get selectedRows() {
    return [...this.#selectedRows];
  }

  get selectedCount() {
    return this.#selected.length;
  }

  refresh() {
    this.#syncTable();
    this.#readTableSelection();
    this.requestRender();
  }

  render() {
    if (!this.#toolbar) {
      this.renderRoot.innerHTML = `
        <section class="toolbar" part="toolbar" role="toolbar" aria-label="${this.label}">
          <div class="start" part="start"><slot name="start"></slot></div>
          <div class="selection" part="selection" aria-live="polite" hidden>
            <slot name="selection"></slot>
            <span class="selection-text" part="selection-text"></span>
          </div>
          <div class="content" part="content"><slot></slot></div>
          <div class="end" part="end">
            <rowan-dropdown class="column-picker" part="column-picker" hidden>
              <div class="column-picker-menu" part="column-picker-menu" role="group"></div>
            </rowan-dropdown>
            <slot name="end"></slot>
          </div>
        </section>
      `;

      this.#toolbar = this.renderRoot.querySelector(".toolbar");
      this.#content = this.renderRoot.querySelector(".content");
      this.#contentSlotEl = this.#content.querySelector("slot");
      this.#selection = this.renderRoot.querySelector(".selection");
      this.#selectionText = this.renderRoot.querySelector(".selection-text");
      this.#columnPicker = this.renderRoot.querySelector(".column-picker");
      this.#columnPickerMenu = this.renderRoot.querySelector(".column-picker-menu");
      this.listen(this.#contentSlotEl, "slotchange", () => this.#syncFilterBuilderSlot());
    }

    this.#syncTable();

    const count = this.selectedCount;
    const bulkOwnsSelection = Boolean(this.#boundTable?.querySelector("rowan-bulk-actions-bar"));
    this.#selection.hidden = count === 0 || bulkOwnsSelection;
    this.#selectionText.textContent = resolveMessage(
      this.#messages,
      DEFAULT_MESSAGES,
      "selectionStatus",
      { count, selectionLabel: this.selectionLabel },
    );
    this.#toolbar.setAttribute("aria-label", this.label);
    this.#syncColumnPicker();
    this.#syncFilterBuilderSlot();
    this.#applyDefaultA11y();
  }

  #syncFilterBuilderSlot() {
    if (!this.#contentSlotEl) return;

    const assigned = this.#contentSlotEl.assignedElements();
    const hasPanelFilterBuilder = assigned.some((node) => isPanelFilterBuilder(node));
    this.toggleAttribute("data-has-filter-builder", hasPanelFilterBuilder);
    this.#observeFilterBuilderAppearance(assigned);
  }

  #observeFilterBuilderAppearance(assigned) {
    this.#filterBuilderAppearanceObserver?.disconnect();
    const builders = assigned.filter((node) => node.localName === "rowan-filter-builder");
    if (builders.length === 0 || typeof MutationObserver === "undefined") {
      this.#filterBuilderAppearanceObserver = null;
      return;
    }

    this.#filterBuilderAppearanceObserver = new MutationObserver(() => {
      this.#syncFilterBuilderSlot();
    });
    for (const builder of builders) {
      this.#filterBuilderAppearanceObserver.observe(builder, {
        attributes: true,
        attributeFilter: ["appearance"],
      });
    }
  }

  #syncColumnPicker() {
    if (!this.#columnPicker || !this.#columnPickerMenu) return;

    this.#columnPicker.label = resolveMessage(
      this.#messages,
      DEFAULT_MESSAGES,
      "columnPickerLabel",
    );
    this.#columnPickerMenu.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "visibleColumnsLabel"),
    );

    const table = this.#boundTable;
    const columns = Array.isArray(table?.columns)
      ? table.columns.filter((column) => column?.id)
      : [];
    const enabled = this.columnPicker && columns.length > 0;
    this.#columnPicker.hidden = !enabled;
    if (!enabled) {
      this.#columnPicker.open = false;
      return;
    }

    const visibleCount = columns.filter((column) => !column.hidden).length;
    const existing = new Map();
    for (const input of this.#columnPickerMenu.querySelectorAll("input[data-column-id]")) {
      const row = input.closest("label");
      if (row && input.dataset.columnId) existing.set(input.dataset.columnId, row);
    }

    this.#columnPickerMenu.replaceChildren(
      ...columns.map((column) => {
        let row = existing.get(column.id);
        let input;
        let text;
        if (row) {
          input = row.querySelector("input");
          text = row.querySelector("span");
        }
        if (!row || !input || !text) {
          row = document.createElement("label");
          row.className = "column-picker-option";
          input = document.createElement("input");
          input.type = "checkbox";
          input.dataset.columnId = column.id;
          text = document.createElement("span");
          row.append(input, text);
        }
        input.checked = !column.hidden;
        input.disabled = input.checked && visibleCount <= 1;
        text.textContent = column.header || column.id;
        return row;
      }),
    );

    if (!this.#columnPickerMenu.dataset.bound) {
      this.#columnPickerMenu.dataset.bound = "true";
      this.listen(this.#columnPickerMenu, "change", (event) => this.#onColumnPickerChange(event));
    }
  }

  #onColumnPickerChange(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "checkbox") return;
    const columnId = input.dataset.columnId;
    const table = this.#boundTable;
    if (!columnId || !table) return;

    const columns = Array.isArray(table.columns) ? table.columns : [];
    const visibleCount = columns.filter((column) => column?.id && !column.hidden).length;
    const hiding = !input.checked;
    if (hiding && visibleCount <= 1) {
      input.checked = true;
      return;
    }

    table.columns = columns.map((column) =>
      column?.id === columnId ? { ...column, hidden: hiding } : column,
    );
    this.requestRender();
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) {
      if (nextTable) {
        this.#readTableSelection();
      } else {
        this.#observeTableAvailability();
      }
      return;
    }

    this.#unbindTable();
    this.#boundTable = nextTable;

    if (!nextTable) {
      this.#setSelection([], []);
      this.#observeTableAvailability();
      return;
    }

    this.#tableCleanup = observeTableSelection(nextTable, () => {
      if (this.#readTableSelection()) {
        this.requestRender();
      }
    });

    this.#readTableSelection();
  }

  #unbindTable() {
    this.#tableCleanup?.();
    this.#tableCleanup = null;
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

  #readTableSelection() {
    const { selected, selectedRows } = readTableSelection(this.#boundTable);

    if (arraysEqual(selected, this.#selected) && arraysEqual(selectedRows, this.#selectedRows)) {
      return false;
    }

    this.#setSelection(selected, selectedRows);
    return true;
  }

  #setSelection(selected, selectedRows) {
    this.#selected = [...selected];
    this.#selectedRows = [...selectedRows];
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "toolbar";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label;
    }
  }
}

define("rowan-table-toolbar", RowanTableToolbar);
