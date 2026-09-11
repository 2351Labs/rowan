import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import {
  isRowanTable,
  observeTableSelection,
  readTableSelection,
  resolveRowanTable,
} from "../lib/table-selection.js";

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

/**
 * Table operations surface that tracks selection from a Rowan data table.
 * @tag rowan-table-toolbar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
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
 * @cssprop --rowan-table-toolbar-bg
 * @cssprop --rowan-table-toolbar-border
 * @cssprop --rowan-table-toolbar-selection-bg
 */
export class RowanTableToolbar extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./table-toolbar.css", import.meta.url).href;
  static observedAttributes = ["for-table", "label", "selection-label"];
  static upgradeProperties = ["table", "forTable", "label", "selectionLabel"];

  #tableOverride = null;
  #boundTable = null;
  #tableCleanup = null;
  #selected = [];
  #selectedRows = [];
  #toolbar = null;
  #selection = null;
  #selectionText = null;

  connectedCallback() {
    super.connectedCallback();
    this.#syncTable();
  }

  disconnectedCallback() {
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
        <section class="toolbar" part="toolbar">
          <div class="start" part="start"><slot name="start"></slot></div>
          <div class="selection" part="selection" aria-live="polite" hidden>
            <slot name="selection"></slot>
            <span class="selection-text" part="selection-text"></span>
          </div>
          <div class="content" part="content"><slot></slot></div>
          <div class="end" part="end"><slot name="end"></slot></div>
        </section>
      `;

      this.#toolbar = this.renderRoot.querySelector(".toolbar");
      this.#selection = this.renderRoot.querySelector(".selection");
      this.#selectionText = this.renderRoot.querySelector(".selection-text");
    }

    this.#syncTable();

    const count = this.selectedCount;
    this.#selection.hidden = count === 0;
    this.#selectionText.textContent = `${count} ${this.selectionLabel}`;
    this.#applyDefaultA11y();
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) {
      this.#readTableSelection();
      return;
    }

    this.#unbindTable();
    this.#boundTable = nextTable;

    if (!nextTable) {
      this.#setSelection([], []);
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
    this.#boundTable = null;
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
