import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import {
  isRowanTable,
  observeTableSelection,
  readTableSelection,
  resolveRowanTable,
} from "../lib/table-selection.js";

import "../button/button.js";

const BUTTON_VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function normalizeActions(value) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.reduce((actions, item, index) => {
    const config = item && typeof item === "object" ? item : {};
    const label = String(config.label ?? "").trim();
    if (!label) return actions;

    const baseId = String(config.id ?? `action-${index + 1}`).trim() || `action-${index + 1}`;
    let id = baseId;
    let suffix = 2;

    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    ids.add(id);
    actions.push({
      id,
      label,
      variant: BUTTON_VARIANTS.has(config.variant) ? config.variant : "secondary",
      disabled: Boolean(config.disabled),
    });
    return actions;
  }, []);
}

/**
 * Contextual bulk actions for selected rows in a Rowan data table.
 * @tag rowan-bulk-actions-bar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
 * @attr {string} clear-label
 * @attr {boolean} disabled
 * @slot label - Content before the selected-row status
 * @slot - Additional bulk action controls with data-bulk-action
 * @slot end - Trailing controls after the default clear action
 * @csspart bar
 * @csspart summary
 * @csspart selection-text
 * @csspart actions
 * @csspart configured-actions
 * @csspart end
 * @csspart clear-button
 * @cssprop --rowan-bulk-actions-bar-bg
 * @cssprop --rowan-bulk-actions-bar-border
 * @cssprop --rowan-bulk-actions-bar-selection-bg
 * @event rowan-bulk-action - Fired when a configured or marked bulk action activates
 * @event rowan-clear-selection - Fired when a user clears the current selection
 */
export class RowanBulkActionsBar extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./bulk-actions-bar.css", import.meta.url).href;
  static observedAttributes = ["for-table", "label", "selection-label", "clear-label", "disabled"];
  static upgradeProperties = [
    "table",
    "forTable",
    "label",
    "selectionLabel",
    "clearLabel",
    "disabled",
    "actions",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableCleanup = null;
  #selected = [];
  #selectedRows = [];
  #actions = [];
  #bar = null;
  #selectionText = null;
  #actionsContainer = null;
  #clearButton = null;

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
    return this.readString("label", "Bulk actions");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next && next !== "Bulk actions" ? next : null);
  }

  get selectionLabel() {
    return this.readString("selection-label", "selected");
  }

  set selectionLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("selection-label", next && next !== "selected" ? next : null);
  }

  get clearLabel() {
    return this.readString("clear-label", "Clear selection");
  }

  set clearLabel(value) {
    const next = String(value ?? "").trim();
    this.reflectString("clear-label", next && next !== "Clear selection" ? next : null);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get actions() {
    return this.#actions.map((action) => ({ ...action }));
  }

  set actions(value) {
    this.#actions = normalizeActions(value);
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
    if (!this.#bar) {
      this.renderRoot.innerHTML = `
        <section class="bar" part="bar" hidden>
          <div class="summary" part="summary" aria-live="polite">
            <slot name="label"></slot>
            <span class="selection-text" part="selection-text"></span>
          </div>
          <div class="actions" part="actions">
            <slot></slot>
            <div class="configured-actions" part="configured-actions"></div>
          </div>
          <div class="end" part="end">
            <rowan-button class="clear-button" part="clear-button" variant="ghost" data-action="clear"></rowan-button>
            <slot name="end"></slot>
          </div>
        </section>
      `;

      this.#bar = this.renderRoot.querySelector(".bar");
      this.#selectionText = this.renderRoot.querySelector(".selection-text");
      this.#actionsContainer = this.renderRoot.querySelector(".configured-actions");
      this.#clearButton = this.renderRoot.querySelector('[data-action="clear"]');

      this.listen(this.#bar, "rowan-click", (event) => {
        const control = event
          .composedPath()
          .find(
            (node) =>
              node instanceof HTMLElement &&
              (node.hasAttribute("data-bulk-action") ||
                node.getAttribute("data-action") === "clear"),
          );

        if (!control || this.disabled || this.selectedCount === 0) return;

        event.stopPropagation();

        if (control.getAttribute("data-action") === "clear") {
          this.#clearSelection();
          return;
        }

        const action = control.getAttribute("data-bulk-action") || "";
        if (!action) return;

        emit(this, "rowan-bulk-action", {
          action,
          selected: this.selected,
          selectedRows: this.selectedRows,
        });
      });
    }

    this.#syncTable();

    const count = this.selectedCount;
    this.#bar.hidden = count === 0;
    this.#selectionText.textContent = `${count} ${this.selectionLabel}`;
    this.#clearButton.textContent = this.clearLabel;
    this.#clearButton.disabled = this.disabled || count === 0;
    this.#renderConfiguredActions();
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

  #renderConfiguredActions() {
    this.#actionsContainer.textContent = "";

    this.#actions.forEach((action) => {
      const button = document.createElement("rowan-button");
      button.setAttribute("data-bulk-action", action.id);
      button.variant = action.variant;
      button.disabled = this.disabled || action.disabled;
      button.textContent = action.label;
      this.#actionsContainer.append(button);
    });
  }

  #clearSelection() {
    const selected = this.selected;
    const selectedRows = this.selectedRows;
    const table = this.#boundTable;

    if (typeof table?.clearSelection === "function") {
      table.clearSelection();
    } else if (table) {
      table.selected = [];
    }

    this.#readTableSelection();
    this.requestRender();

    emit(this, "rowan-clear-selection", {
      selected,
      selectedRows,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "toolbar";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label;
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-bulk-actions-bar", RowanBulkActionsBar);
