import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../badge/badge.js";
import "../button/button.js";
import "../checkbox/checkbox.js";
import "../switch/switch.js";
import "../icon-button/icon-button.js";
import "../avatar/avatar.js";
import "../chip/chip.js";
import "../progress/progress.js";
import "../empty-state/empty-state.js";

const CELL_TYPES = new Set([
  "text",
  "number",
  "date",
  "badge",
  "link",
  "checkbox",
  "switch",
  "button",
  "icon-button",
  "avatar",
  "chip",
  "progress",
  "custom",
]);

const SELECT_COLUMN_ID = "__select";
const SORT_DIRECTIONS = new Set(["asc", "desc"]);

/**
 * @typedef {"text" | "number" | "date" | "badge" | "link" | "checkbox" | "switch" | "button" | "icon-button" | "avatar" | "chip" | "progress" | "custom"} RowanTableCellType
 */

/** @typedef {Record<string, unknown>} RowanTableRow */

/**
 * @typedef {object} RowanTableCellContext
 * @property {unknown} value
 * @property {RowanTableRow} row
 * @property {number} rowIndex
 * @property {RowanTableColumn} column
 * @property {HTMLElement} cellEl
 */

/**
 * @typedef {object} RowanTableCellConfig
 * @property {RowanTableCellType} [type]
 * @property {string | ((value: unknown, row: RowanTableRow) => string)} [href]
 * @property {string} [target]
 * @property {string | ((value: unknown, row: RowanTableRow) => string)} [label]
 * @property {string} [variant]
 * @property {string | ((value: unknown, row: RowanTableRow) => string)} [tone]
 * @property {boolean | ((value: unknown, row: RowanTableRow) => boolean)} [disabled]
 * @property {boolean | ((value: unknown, row: RowanTableRow) => boolean)} [checked]
 * @property {boolean | ((value: unknown, row: RowanTableRow) => boolean)} [indeterminate]
 * @property {string | ((value: unknown, row: RowanTableRow) => string)} [title]
 * @property {string} [icon]
 * @property {string} [slot]
 * @property {(context: RowanTableCellContext) => Node | string | void} [render]
 */

/**
 * @typedef {object} RowanTableColumn
 * @property {string} id
 * @property {string} [header]
 * @property {RowanTableCellType} [type]
 * @property {string} [width]
 * @property {string} [minWidth]
 * @property {"start" | "center" | "end"} [align]
 * @property {boolean} [sortable]
 * @property {"asc" | "desc" | null} [sortDir]
 * @property {"start" | "end"} [sticky]
 * @property {boolean} [hidden]
 * @property {string | ((row: RowanTableRow, rowIndex: number) => unknown)} [accessor]
 * @property {(value: unknown, row: RowanTableRow, rowIndex: number) => string} [format]
 * @property {RowanTableCellConfig} [cell]
 * @property {{ tooltip?: string }} [headerCell]
 */

/** @typedef {{ id: string, dir: "asc" | "desc" }} RowanTableSort */

/** @typedef {{ index: number, size: number, total?: number }} RowanTablePage */

/**
 * @typedef {object} RowanTableConfig
 * @property {RowanTableColumn[]} [columns]
 * @property {RowanTableRow[]} [rows]
 * @property {string | ((row: RowanTableRow, rowIndex: number) => string)} [rowId]
 * @property {"none" | "single" | "multiple"} [selectable]
 * @property {string[]} [selected]
 * @property {RowanTableSort | null} [sort]
 * @property {string} [caption]
 * @property {"sm" | "md" | "lg"} [density]
 * @property {boolean} [stickyHeader]
 * @property {boolean} [loading]
 * @property {RowanTablePage | null} [page]
 */

function isDevelopmentEnvironment() {
  const nodeEnvironment = globalThis.process?.env?.NODE_ENV;
  if (nodeEnvironment) return nodeEnvironment !== "production";

  const hostname = globalThis.location?.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/**
 * Config-driven data table.
 * @tag rowan-table
 * @attr {"none"|"single"|"multiple"} selectable
 * @attr {"sm"|"md"|"lg"} density
 * @attr {boolean} sticky-header
 * @attr {boolean} loading
 * @attr {string} caption
 * @property {object} config - Replaces the complete table configuration.
 * @property {Array<object>} columns - Updates columns without replacing other configuration.
 * @property {Array<object>} rows - Updates rows without replacing other configuration.
 * @property {Array<string>} selected - Updates selected row IDs without replacing other configuration.
 * @slot toolbar
 * @slot caption
 * @slot empty
 * @slot footer
 * @csspart table
 * @csspart thead
 * @csspart tbody
 * @csspart tr
 * @csspart th
 * @csspart td
 * @csspart caption
 * @csspart toolbar
 * @event rowan-sort - Fired when a sortable header changes direction
 * @event rowan-select - Fired when row selection changes
 * @event rowan-cell-change - Fired when checkbox cell value changes
 * @event rowan-cell-action - Fired when link or button cell activates
 * @event rowan-page-change - Fired when pagination changes
 * @event rowan-row-activate - Fired on row activation by keyboard or double click
 */
export class RowanTable extends BaseElement {
  static styleUrl = new URL("./table.css", import.meta.url).href;
  static observedAttributes = ["selectable", "density", "sticky-header", "loading", "caption"];
  static upgradeProperties = [
    "config",
    "columns",
    "rows",
    "selectable",
    "selected",
    "sort",
    "page",
    "density",
    "stickyHeader",
    "loading",
    "caption",
  ];

  #state = {
    columns: [],
    rows: [],
    rowId: "id",
    selected: [],
    sort: null,
    page: null,
  };

  #root = null;
  #captionSlotEl = null;
  #captionTextEl = null;
  #theadRow = null;
  #tbody = null;
  #paginationEl = null;
  #paginationStatusEl = null;
  #paginationPrevButton = null;
  #paginationNextButton = null;
  #visibleRows = [];
  #renderedBodyRows = new Map();
  #bodyNeedsRender = true;
  #viewNeedsReconciliation = false;
  #selectionNeedsSync = false;
  #lastSelectedIndex = -1;
  #selectionModifiers = new WeakMap();
  #validationWarnings = new Set();

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "selectable" || name === "loading") {
      this.#bodyNeedsRender = true;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** @returns {RowanTableConfig} */
  get config() {
    return {
      columns: this.columns,
      rows: this.rows,
      rowId: this.#state.rowId,
      selectable: this.selectable,
      selected: [...this.#state.selected],
      sort: this.sort,
      page: this.page,
      density: this.density,
      stickyHeader: this.stickyHeader,
      loading: this.loading,
      caption: this.caption,
    };
  }

  /** @param {RowanTableConfig | null | undefined} value */
  set config(value) {
    const next = value && typeof value === "object" && !Array.isArray(value) ? value : {};

    this.#state = {
      columns: Array.isArray(next.columns) ? next.columns : [],
      rows: Array.isArray(next.rows) ? next.rows : [],
      rowId: next.rowId ?? "id",
      selected: Array.isArray(next.selected)
        ? next.selected.map((item) => this.#normalizeText(item))
        : [],
      sort: this.#normalizeSort(next.sort),
      page: this.#normalizePage(next.page),
    };
    this.#bodyNeedsRender = true;
    this.#viewNeedsReconciliation = true;
    this.#selectionNeedsSync = false;
    this.#lastSelectedIndex = -1;
    this.#resetConfigurationWarnings();

    this.caption = next.caption == null ? "" : String(next.caption);
    this.density = next.density;
    this.selectable = next.selectable;
    this.stickyHeader = Boolean(next.stickyHeader);
    this.loading = Boolean(next.loading);

    this.requestRender();
  }

  /** @returns {RowanTableColumn[]} */
  get columns() {
    return this.#state.columns;
  }

  /** @param {RowanTableColumn[]} value */
  set columns(value) {
    this.#state.columns = Array.isArray(value) ? value : [];
    this.#bodyNeedsRender = true;
    this.#resetConfigurationWarnings();
    this.requestRender();
  }

  /** @returns {RowanTableRow[]} */
  get rows() {
    return this.#state.rows;
  }

  /** @param {RowanTableRow[]} value */
  set rows(value) {
    this.#state.rows = Array.isArray(value) ? value : [];
    this.#bodyNeedsRender = true;
    this.#resetConfigurationWarnings();
    this.requestRender();
  }

  get selectable() {
    return this.readString("selectable", "none");
  }

  set selectable(value) {
    const next = value === "single" || value === "multiple" ? value : "none";
    this.reflectString("selectable", next === "none" ? null : next);
  }

  /** @returns {string[]} */
  get selected() {
    return [...this.#state.selected];
  }

  /** @param {string[]} value */
  set selected(value) {
    this.#state.selected = Array.isArray(value)
      ? value.map((item) => this.#normalizeText(item))
      : [];
    this.#selectionNeedsSync = true;
    this.requestRender();
  }

  /** @returns {RowanTableSort | null} */
  get sort() {
    if (!this.#state.sort) return null;
    return { ...this.#state.sort };
  }

  /** @param {RowanTableSort | null} value */
  set sort(value) {
    this.#state.sort = this.#normalizeSort(value);
    this.#viewNeedsReconciliation = true;
    this.requestRender();
  }

  /** @returns {RowanTablePage | null} */
  get page() {
    if (!this.#state.page) return null;
    return { ...this.#state.page };
  }

  /** @param {RowanTablePage | null} value */
  set page(value) {
    this.#state.page = this.#normalizePage(value);
    this.#viewNeedsReconciliation = true;
    this.requestRender();
  }

  get density() {
    return this.readString("density", "md");
  }

  set density(value) {
    const next = value === "sm" || value === "lg" ? value : "md";
    this.reflectString("density", next === "md" ? null : next);
  }

  get stickyHeader() {
    return this.readBoolean("sticky-header");
  }

  set stickyHeader(value) {
    this.reflectBoolean("sticky-header", Boolean(value));
  }

  get loading() {
    return this.readBoolean("loading");
  }

  set loading(value) {
    this.reflectBoolean("loading", Boolean(value));
  }

  get caption() {
    return this.readString("caption", "");
  }

  set caption(value) {
    this.reflectString("caption", value);
  }

  /** @returns {RowanTableRow[]} */
  get selectedRows() {
    const selectedIds = new Set(this.#state.selected);

    return this.rows.filter((row, index) => selectedIds.has(this.#resolveRowId(row, index)));
  }

  selectAll() {
    if (this.selectable !== "multiple") return;

    const selectedIds = new Set(this.#visibleRows.map((entry) => entry.rowId));
    this.#state.selected = this.#orderedSelection(selectedIds);
    this.#selectionNeedsSync = true;
    this.requestRender();
  }

  clearSelection() {
    this.#state.selected = [];
    this.#selectionNeedsSync = true;
    this.#lastSelectedIndex = -1;
    this.requestRender();
  }

  /**
   * @param {string} id
   * @param {"asc" | "desc"} dir
   * @param {{ emitEvent?: boolean }} [options]
   */
  sortBy(id, dir, options = {}) {
    const normalized = this.#normalizeSort({ id, dir });
    this.#state.sort = normalized;
    this.#viewNeedsReconciliation = true;
    this.requestRender();

    if (options.emitEvent && normalized) {
      emit(this, "rowan-sort", { id: normalized.id, dir: normalized.dir });
    }
  }

  render() {
    if (!this.#root) {
      this.renderRoot.innerHTML = `
        <div class="wrapper">
          <div class="toolbar" part="toolbar"><slot name="toolbar"></slot></div>
          <table class="table" part="table" aria-busy="false">
            <caption class="caption" part="caption">
              <slot name="caption"></slot>
              <span class="caption-text"></span>
            </caption>
            <thead class="thead" part="thead">
              <tr part="tr"></tr>
            </thead>
            <tbody class="tbody" part="tbody"></tbody>
          </table>
          <div class="footer" part="footer">
            <slot name="footer"></slot>
            <div class="pagination" part="pagination" hidden>
              <button class="page-button" type="button" data-action="prev-page">Previous</button>
              <span class="page-status"></span>
              <button class="page-button" type="button" data-action="next-page">Next</button>
            </div>
          </div>
        </div>
      `;

      this.#root = this.renderRoot.firstElementChild;
      this.#captionSlotEl = this.renderRoot.querySelector('caption slot[name="caption"]');
      this.#captionTextEl = this.renderRoot.querySelector(".caption-text");
      this.#theadRow = this.renderRoot.querySelector("thead tr");
      this.#tbody = this.renderRoot.querySelector("tbody");
      this.#paginationEl = this.renderRoot.querySelector(".pagination");
      this.#paginationStatusEl = this.renderRoot.querySelector(".page-status");
      this.#paginationPrevButton = this.renderRoot.querySelector('[data-action="prev-page"]');
      this.#paginationNextButton = this.renderRoot.querySelector('[data-action="next-page"]');

      this.listen(this.#paginationPrevButton, "click", () => {
        this.#changePage((this.page?.index ?? 0) - 1);
      });

      this.listen(this.#paginationNextButton, "click", () => {
        this.#changePage((this.page?.index ?? 0) + 1);
      });

      this.listen(this.#theadRow, "click", (event) => {
        this.#handleHeaderClick(event);
      });

      this.listen(this.#theadRow, "rowan-change", (event) => {
        this.#handleHeaderSelectionChange(event);
      });

      this.listen(this.#tbody, "click", (event) => {
        this.#handleBodyClick(event);
      });

      this.listen(this.#tbody, "dblclick", (event) => {
        this.#handleBodyDoubleClick(event);
      });

      this.listen(this.#tbody, "keydown", (event) => {
        this.#handleBodyKeyDown(event);
      });

      this.listen(this.#tbody, "rowan-change", (event) => {
        this.#handleBodyControlChange(event);
      });

      this.listen(this.#tbody, "rowan-click", (event) => {
        this.#handleBodyCellAction(event);
      });
    }

    this.#validateConfiguration();
    const view = this.#buildView();
    this.#pruneSelection(view.entries);
    this.#visibleRows = view.rows;

    this.#renderHeader();
    this.#renderBody(view.rows, view.hasDuplicateRowIds);
    this.#renderPagination(view.pageInfo);

    const table = this.renderRoot.querySelector("table");
    table.setAttribute("aria-busy", this.loading ? "true" : "false");

    this.#renderCaption();
  }

  #renderCaption() {
    const hasCaptionSlot = this.querySelector('[slot="caption"]') !== null;
    this.#captionSlotEl.hidden = !hasCaptionSlot;

    if (hasCaptionSlot) {
      this.#captionTextEl.hidden = true;
      this.#captionTextEl.textContent = "";
      return;
    }

    const caption = this.caption.trim();
    this.#captionTextEl.hidden = caption.length === 0;
    this.#captionTextEl.textContent = caption;
  }

  #renderHeader() {
    this.#theadRow.textContent = "";

    if (this.selectable !== "none") {
      this.#theadRow.append(this.#createSelectionHeaderCell());
    }

    for (const column of this.#renderableColumns()) {
      const th = document.createElement("th");
      th.className = "th";
      th.part = "th";
      th.scope = "col";
      th.dataset.columnId = this.#normalizeText(column.id);

      if (column.sortable) {
        const sortDir = this.#columnSortDirection(column);
        th.setAttribute(
          "aria-sort",
          sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none",
        );

        const button = document.createElement("button");
        button.type = "button";
        button.className = "sort-button";
        button.part = "sort-button";
        button.dataset.tableAction = "sort";
        button.dataset.columnId = this.#normalizeText(column.id);

        const label = document.createElement("span");
        label.textContent = column.header ?? "";

        const indicator = document.createElement("span");
        indicator.className = "sort-indicator";
        indicator.textContent = sortDir === "asc" ? "↑" : sortDir === "desc" ? "↓" : "↕";

        button.append(label, indicator);
        th.append(button);
      } else {
        th.textContent = column.header ?? "";
      }

      if (column.width) th.style.width = column.width;
      if (column.minWidth) th.style.minWidth = column.minWidth;
      if (column.align) th.style.textAlign = this.#alignToCss(column.align);

      if (column.sticky === "start") th.classList.add("sticky-start");
      if (column.sticky === "end") th.classList.add("sticky-end");

      this.#theadRow.append(th);
    }
  }

  #createSelectionHeaderCell() {
    const th = document.createElement("th");
    th.className = "th select-column";
    th.part = "th";
    th.scope = "col";
    th.dataset.columnId = SELECT_COLUMN_ID;

    if (this.selectable !== "multiple") return th;

    const checkbox = document.createElement("rowan-checkbox");
    checkbox.setAttribute("aria-label", "Select all rows");
    checkbox.dataset.tableAction = "select-all";

    const selected = new Set(this.#state.selected);
    const selectedCount = this.#visibleRows.filter((entry) => selected.has(entry.rowId)).length;
    checkbox.checked = this.#visibleRows.length > 0 && selectedCount === this.#visibleRows.length;
    checkbox.indeterminate = selectedCount > 0 && selectedCount < this.#visibleRows.length;

    th.append(checkbox);
    return th;
  }

  #renderBody(viewRows, hasDuplicateRowIds) {
    if (this.loading || !viewRows.length) {
      this.#tbody.replaceChildren();
      this.#renderedBodyRows.clear();

      if (this.loading) {
        this.#renderLoadingRow();
      } else {
        this.#renderEmptyRow();
      }

      this.#bodyNeedsRender = false;
      this.#viewNeedsReconciliation = false;
      this.#selectionNeedsSync = false;
      return;
    }

    if (this.#canSyncSelection(viewRows, hasDuplicateRowIds)) {
      this.#syncSelectionControls();
      this.#selectionNeedsSync = false;
      return;
    }

    const canReconcile = !this.#bodyNeedsRender && !hasDuplicateRowIds;
    const staleRows = canReconcile
      ? new Set([...this.#renderedBodyRows.values()].map((rendered) => rendered.element))
      : new Set();
    const nextRows = new Map();

    if (!canReconcile) {
      this.#tbody.replaceChildren();
    }

    for (const [index, entry] of viewRows.entries()) {
      const rendered = canReconcile ? this.#renderedBodyRows.get(entry.rowId) : null;
      const canReuse =
        rendered && rendered.row === entry.row && rendered.rowIndex === entry.rowIndex;
      const element = canReuse ? rendered.element : this.#createBodyRow(entry);

      staleRows.delete(element);
      const reference = this.#tbody.children[index];
      if (element !== reference) {
        this.#tbody.insertBefore(element, reference ?? null);
      }
      if (!hasDuplicateRowIds) {
        nextRows.set(entry.rowId, {
          element,
          row: entry.row,
          rowIndex: entry.rowIndex,
        });
      }
    }

    for (const staleRow of staleRows) {
      staleRow.remove();
    }

    this.#renderedBodyRows = nextRows;
    this.#bodyNeedsRender = false;
    this.#viewNeedsReconciliation = false;
    this.#selectionNeedsSync = false;
    this.#syncSelectionControls();
  }

  #canSyncSelection(viewRows, hasDuplicateRowIds) {
    if (
      this.#bodyNeedsRender ||
      this.#viewNeedsReconciliation ||
      !this.#selectionNeedsSync ||
      hasDuplicateRowIds ||
      this.#renderedBodyRows.size !== viewRows.length ||
      this.#tbody.children.length !== viewRows.length
    ) {
      return false;
    }

    return viewRows.every((entry) => {
      const rendered = this.#renderedBodyRows.get(entry.rowId);
      return rendered && rendered.row === entry.row && rendered.rowIndex === entry.rowIndex;
    });
  }

  #createBodyRow(entry) {
    const tr = document.createElement("tr");
    tr.part = "tr";
    tr.dataset.rowId = entry.rowId;
    tr.dataset.rowIndex = String(entry.rowIndex);
    tr.tabIndex = 0;

    if (this.selectable !== "none") {
      tr.append(this.#createSelectionBodyCell(entry));
    }

    this.#renderableColumns().forEach((column) => {
      const td = document.createElement("td");
      td.className = "td";
      td.part = "td";
      td.dataset.columnId = column.id;

      if (column.align) {
        td.style.textAlign = this.#alignToCss(column.align);
      }

      if (column.sticky === "start") td.classList.add("sticky-start");
      if (column.sticky === "end") td.classList.add("sticky-end");

      const value = this.#resolveValue(entry.row, entry.rowIndex, column);
      this.#renderCellContent(td, {
        row: entry.row,
        rowIndex: entry.rowIndex,
        rowId: entry.rowId,
        column,
        value,
      });

      tr.append(td);
    });

    return tr;
  }

  #hasDuplicateRowIds(viewRows) {
    const rowIds = new Set();

    return viewRows.some((entry) => {
      if (rowIds.has(entry.rowId)) return true;
      rowIds.add(entry.rowId);
      return false;
    });
  }

  #syncSelectionControls() {
    const selected = new Set(this.#state.selected);

    for (const row of this.#tbody.querySelectorAll("tr[data-row-id]")) {
      const selector = row.querySelector('td[data-column-id="__select"] rowan-checkbox');
      if (selector) {
        selector.checked = selected.has(row.dataset.rowId);
      }
    }
  }

  #createSelectionBodyCell(entry) {
    const td = document.createElement("td");
    td.className = "td select-column";
    td.part = "td";
    td.dataset.columnId = SELECT_COLUMN_ID;

    const selector = document.createElement("rowan-checkbox");
    selector.setAttribute("aria-label", `Select row ${entry.rowId}`);
    selector.dataset.tableAction = "select-row";
    selector.checked = this.#state.selected.includes(entry.rowId);

    td.append(selector);
    return td;
  }

  #handleHeaderClick(event) {
    const button = this.#findActionElement(event, "sort");
    if (!button) return;

    const column = this.#findColumn(button.dataset.columnId);
    if (!column?.sortable) return;

    this.sortBy(column.id, this.#nextSortDirection(column), { emitEvent: true });
  }

  #handleHeaderSelectionChange(event) {
    const checkbox = this.#findActionElement(event, "select-all");
    if (!checkbox || this.selectable !== "multiple") return;

    if (checkbox.checked) {
      this.selectAll();
    } else {
      this.clearSelection();
    }

    emit(this, "rowan-select", {
      selected: [...this.#state.selected],
      row: null,
      selectedRows: this.selectedRows,
    });
  }

  #handleBodyClick(event) {
    const selector = this.#findActionElement(event, "select-row");
    if (selector) {
      this.#selectionModifiers.set(selector, Boolean(event.shiftKey));
      return;
    }

    const link = this.#findActionElement(event, "link");
    if (!link) return;

    event.preventDefault();
    const context = this.#findCellContext(link);
    if (context) {
      this.#emitCellAction(context, "link", event);
    }
  }

  #handleBodyDoubleClick(event) {
    const entry = this.#findEventRow(event);
    if (!entry) return;

    emit(this, "rowan-row-activate", {
      rowId: entry.rowId,
      row: entry.row,
    });
  }

  #handleBodyKeyDown(event) {
    const row = this.#findEventRowElement(event);
    if (!(row instanceof HTMLTableRowElement) || event.target !== row) return;

    const entry = this.#findVisibleRow(row);
    if (!entry) return;

    if (event.key === "Enter") {
      emit(this, "rowan-row-activate", {
        rowId: entry.rowId,
        row: entry.row,
      });
      return;
    }

    if ((event.key === " " || event.key === "Spacebar") && this.selectable !== "none") {
      event.preventDefault();
      const nextChecked = !this.#state.selected.includes(entry.rowId);
      this.#toggleRowSelection(entry, nextChecked, { shiftKey: event.shiftKey });
    }
  }

  #handleBodyControlChange(event) {
    const selector = this.#findActionElement(event, "select-row");
    if (selector) {
      const row = selector.closest("tr[data-row-id]");
      if (!(row instanceof HTMLTableRowElement)) return;

      const entry = this.#findVisibleRow(row);
      if (!entry) return;

      const shiftKey = this.#selectionModifiers.get(selector) ?? false;
      this.#selectionModifiers.delete(selector);
      this.#toggleRowSelection(entry, Boolean(selector.checked), { shiftKey });
      return;
    }

    const control = this.#findActionElement(event, "cell-change");
    if (!control) return;

    const context = this.#findCellContext(control);
    if (context) {
      this.#emitCellChange(context, Boolean(control.checked));
    }
  }

  #handleBodyCellAction(event) {
    const button = this.#findActionElement(event, "button");
    const iconButton = button ? null : this.#findActionElement(event, "icon-button");
    const actionElement = button ?? iconButton;
    if (!actionElement) return;

    const context = this.#findCellContext(actionElement);
    if (context) {
      this.#emitCellAction(context, button ? "button" : "icon-button", event);
    }
  }

  #findActionElement(event, action) {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLElement && node.dataset.tableAction === action) {
        return node;
      }

      if (node === this.#root) break;
    }

    return null;
  }

  #findEventRow(event) {
    const row = this.#findEventRowElement(event);
    return row ? this.#findVisibleRow(row) : null;
  }

  #findEventRowElement(event) {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLTableRowElement && node.dataset.rowId != null) {
        return node;
      }

      if (node === this.#root) break;
    }

    return null;
  }

  #findCellContext(element) {
    const row = element.closest("tr[data-row-id]");
    const cell = element.closest("td[data-column-id]");
    if (!(row instanceof HTMLTableRowElement) || !(cell instanceof HTMLTableCellElement)) {
      return null;
    }

    const entry = this.#findVisibleRow(row);
    const column = this.#findColumn(cell.dataset.columnId);
    if (!entry || !column) return null;

    return {
      row: entry.row,
      rowIndex: entry.rowIndex,
      rowId: entry.rowId,
      column,
      value: this.#resolveValue(entry.row, entry.rowIndex, column),
    };
  }

  #findVisibleRow(row) {
    const rowIndex = Number(row.dataset.rowIndex);
    if (!Number.isInteger(rowIndex)) return null;

    return this.#visibleRows.find((entry) => entry.rowIndex === rowIndex) ?? null;
  }

  #findColumn(columnId) {
    return (
      this.#configuredColumns().find(
        (column) => this.#columnId(column) === this.#normalizeText(columnId),
      ) ?? null
    );
  }

  #configuredColumns() {
    const columnIds = new Set();

    return this.columns.filter((column) => {
      const id = this.#columnId(column);
      if (!id || columnIds.has(id)) return false;

      columnIds.add(id);
      return true;
    });
  }

  #renderableColumns() {
    return this.#configuredColumns().filter((column) => !column.hidden);
  }

  #columnId(column) {
    if (typeof column?.id !== "string" || column.id.trim().length === 0) return "";
    return column.id;
  }

  #validateConfiguration() {
    const columnIds = new Set();

    this.columns.forEach((column, index) => {
      const id = this.#columnId(column);
      if (!id) {
        this.#warn(
          `column-missing-id-${index}`,
          `column at index ${index} is missing a non-empty string id and will be omitted.`,
        );
        return;
      }

      if (columnIds.has(id)) {
        this.#warn(
          `column-duplicate-id-${id}`,
          `column id "${id}" is duplicated and later columns with that id will be omitted.`,
        );
        return;
      }

      columnIds.add(id);
      const cellType = column.cell?.type ?? column.type ?? "text";
      if (!CELL_TYPES.has(cellType)) {
        this.#warn(
          `column-invalid-type-${id}-${this.#normalizeText(cellType)}`,
          `column "${id}" uses unsupported cell type "${this.#normalizeText(cellType)}" and will render as text.`,
        );
      }
    });

    const rowId = this.#state.rowId;
    if (typeof rowId !== "function" && (typeof rowId !== "string" || rowId.trim().length === 0)) {
      this.#warn(
        "row-id-accessor",
        "rowId must be a non-empty string or function; rows use their index until it is corrected.",
      );
    }
  }

  #validateRowIds(entries) {
    const rowIds = new Map();

    for (const entry of entries) {
      const firstIndex = rowIds.get(entry.rowId);
      if (firstIndex !== undefined) {
        this.#warn(
          `row-duplicate-id-${entry.rowId}`,
          `rows at indexes ${firstIndex} and ${entry.rowIndex} share row id "${entry.rowId}"; keyed reconciliation will fall back to a full body render.`,
        );
        continue;
      }

      rowIds.set(entry.rowId, entry.rowIndex);
    }
  }

  #resetConfigurationWarnings() {
    this.#validationWarnings.clear();
  }

  #warn(key, message) {
    if (!isDevelopmentEnvironment() || this.#validationWarnings.has(key)) return;

    this.#validationWarnings.add(key);
    globalThis.console?.warn(`rowan-table: ${message}`);
  }

  #renderLoadingRow() {
    const tr = document.createElement("tr");
    tr.className = "loading-row";
    tr.part = "tr";

    const td = document.createElement("td");
    td.className = "td";
    td.part = "td";
    td.colSpan = this.#visibleColumnCount();
    td.textContent = "Loading...";

    tr.append(td);
    this.#tbody.append(tr);
  }

  #renderEmptyRow() {
    const tr = document.createElement("tr");
    tr.part = "tr";

    const td = document.createElement("td");
    td.className = "td empty";
    td.part = "td";
    td.colSpan = this.#visibleColumnCount();

    const customEmpty = this.querySelector('[slot="empty"]');
    if (customEmpty) {
      const slot = document.createElement("slot");
      slot.name = "empty";
      td.append(slot);
    } else {
      const empty = document.createElement("rowan-empty-state");
      empty.textContent = "No data available.";
      td.append(empty);
    }

    tr.append(td);
    this.#tbody.append(tr);
  }

  #renderCellContent(cell, context) {
    const type = this.#resolveCellType(context.column);

    switch (type) {
      case "number":
        this.#renderNumberCell(cell, context);
        return;
      case "date":
        this.#renderDateCell(cell, context);
        return;
      case "link":
        this.#renderLinkCell(cell, context);
        return;
      case "badge":
        this.#renderBadgeCell(cell, context);
        return;
      case "checkbox":
        this.#renderCheckboxCell(cell, context);
        return;
      case "switch":
        this.#renderSwitchCell(cell, context);
        return;
      case "button":
        this.#renderButtonCell(cell, context);
        return;
      case "icon-button":
        this.#renderIconButtonCell(cell, context);
        return;
      case "avatar":
        this.#renderAvatarCell(cell, context);
        return;
      case "chip":
        this.#renderChipCell(cell, context);
        return;
      case "progress":
        this.#renderProgressCell(cell, context);
        return;
      case "custom":
        this.#renderCustomCell(cell, context);
        return;
      default:
        this.#renderTextCell(cell, context);
    }
  }

  #renderTextCell(cell, context) {
    cell.dataset.cellType = "text";
    const text = this.#formatValue(context.column, context.value, context.row, context.rowIndex);
    cell.textContent = text;
  }

  #renderNumberCell(cell, context) {
    cell.dataset.cellType = "number";
    const raw = context.value;

    if (typeof raw === "number" && Number.isFinite(raw)) {
      cell.textContent = new Intl.NumberFormat().format(raw);
      return;
    }

    this.#renderTextCell(cell, context);
  }

  #renderDateCell(cell, context) {
    cell.dataset.cellType = "date";
    const value = context.value;
    const date = value instanceof Date ? value : new Date(value);

    if (!Number.isNaN(date.getTime())) {
      cell.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
      return;
    }

    this.#renderTextCell(cell, context);
  }

  #renderLinkCell(cell, context) {
    const anchor = document.createElement("a");
    anchor.part = "link";
    anchor.className = "link";
    anchor.dataset.cellType = "link";
    anchor.dataset.tableAction = "link";

    const href = this.#resolveCellOption(context.column, "href", context.value, context.row);
    anchor.href = this.#safeUrl(href);

    const target = this.#resolveCellOption(context.column, "target", context.value, context.row);
    if (typeof target === "string" && target.length > 0) {
      anchor.target = target;
      if (target === "_blank") {
        anchor.rel = "noopener noreferrer";
      }
    }

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    anchor.textContent = this.#normalizeText(label ?? context.value);

    cell.append(anchor);
  }

  #renderBadgeCell(cell, context) {
    const badge = document.createElement("rowan-badge");
    badge.dataset.cellType = "badge";

    const tone = this.#resolveCellOption(context.column, "tone", context.value, context.row);
    if (typeof tone === "string" && tone.length > 0 && tone !== "info") {
      badge.setAttribute("tone", tone);
    }

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    badge.textContent = this.#normalizeText(label ?? context.value);

    cell.append(badge);
  }

  #renderCheckboxCell(cell, context) {
    const checkbox = document.createElement("rowan-checkbox");
    checkbox.dataset.cellType = "checkbox";
    checkbox.dataset.tableAction = "cell-change";
    checkbox.setAttribute("aria-label", context.column.header || context.column.id || "checkbox");

    const checked = this.#resolveCellOption(context.column, "checked", context.value, context.row);
    checkbox.checked = Boolean(checked ?? context.value);

    const disabled = this.#resolveCellOption(
      context.column,
      "disabled",
      context.value,
      context.row,
    );
    checkbox.disabled = Boolean(disabled);

    cell.append(checkbox);
  }

  #renderSwitchCell(cell, context) {
    const switchControl = customElements.get("rowan-switch")
      ? document.createElement("rowan-switch")
      : document.createElement("rowan-checkbox");
    switchControl.dataset.cellType = "switch";
    switchControl.dataset.tableAction = "cell-change";
    switchControl.setAttribute(
      "aria-label",
      context.column.header || context.column.id || "switch",
    );

    const checked = this.#resolveCellOption(context.column, "checked", context.value, context.row);
    switchControl.checked = Boolean(checked ?? context.value);

    const disabled = this.#resolveCellOption(
      context.column,
      "disabled",
      context.value,
      context.row,
    );
    switchControl.disabled = Boolean(disabled);

    cell.append(switchControl);
  }

  #renderButtonCell(cell, context) {
    const button = document.createElement("rowan-button");
    button.dataset.cellType = "button";
    button.dataset.tableAction = "button";

    const variant = this.#resolveCellOption(context.column, "variant", context.value, context.row);
    if (typeof variant === "string" && variant.length > 0 && variant !== "primary") {
      button.setAttribute("variant", variant);
    }

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    button.textContent = this.#normalizeText(label ?? context.value ?? "Action");

    const disabled = this.#resolveCellOption(
      context.column,
      "disabled",
      context.value,
      context.row,
    );
    button.disabled = Boolean(disabled);

    cell.append(button);
  }

  #renderIconButtonCell(cell, context) {
    const hasIconButton = customElements.get("rowan-icon-button");
    const button = hasIconButton
      ? document.createElement("rowan-icon-button")
      : document.createElement("rowan-button");
    button.dataset.cellType = "icon-button";
    button.dataset.tableAction = "icon-button";

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    const icon = this.#resolveCellOption(context.column, "icon", context.value, context.row);
    const text = this.#normalizeText(icon || "•");

    if (hasIconButton) {
      if (label) button.setAttribute("label", this.#normalizeText(label));
      button.textContent = text;
      const disabled = this.#resolveCellOption(
        context.column,
        "disabled",
        context.value,
        context.row,
      );
      button.disabled = Boolean(disabled);
    } else {
      button.variant = "ghost";
      button.textContent = text;
      if (label) button.setAttribute("aria-label", this.#normalizeText(label));
      const disabled = this.#resolveCellOption(
        context.column,
        "disabled",
        context.value,
        context.row,
      );
      button.disabled = Boolean(disabled);
      button.classList.add("icon-button-fallback");
    }

    cell.append(button);
  }

  #renderAvatarCell(cell, context) {
    const avatar = customElements.get("rowan-avatar")
      ? document.createElement("rowan-avatar")
      : document.createElement("span");
    avatar.dataset.cellType = "avatar";

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    const text = this.#normalizeText(label ?? context.value);

    if (avatar.tagName === "SPAN") {
      avatar.className = "avatar-fallback";
      avatar.textContent = text.slice(0, 2).toUpperCase();
      avatar.title = text;
    } else {
      avatar.textContent = text;
    }

    cell.append(avatar);
  }

  #renderChipCell(cell, context) {
    const chip = customElements.get("rowan-chip")
      ? document.createElement("rowan-chip")
      : document.createElement("rowan-badge");
    chip.dataset.cellType = "chip";

    const tone = this.#resolveCellOption(context.column, "tone", context.value, context.row);
    if (typeof tone === "string" && tone.length > 0 && tone !== "info") {
      chip.setAttribute("tone", tone);
    }

    const label = this.#resolveCellOption(context.column, "label", context.value, context.row);
    chip.textContent = this.#normalizeText(label ?? context.value);

    cell.append(chip);
  }

  #renderProgressCell(cell, context) {
    const progress = customElements.get("rowan-progress")
      ? document.createElement("rowan-progress")
      : document.createElement("progress");
    progress.dataset.cellType = "progress";

    const rawValue = Number(context.value);
    const percent = Number.isFinite(rawValue) ? Math.max(0, Math.min(100, rawValue)) : 0;

    if (progress.tagName === "PROGRESS") {
      progress.className = "progress-fallback";
      progress.max = 100;
      progress.value = percent;
      progress.title = `${percent}%`;
    } else {
      progress.value = percent;
    }

    cell.append(progress);
  }

  #renderCustomCell(cell, context) {
    cell.dataset.cellType = "custom";
    const renderer = context.column?.cell?.render;

    if (typeof renderer === "function") {
      const rendered = renderer({
        value: context.value,
        row: context.row,
        rowIndex: context.rowIndex,
        column: context.column,
        cellEl: cell,
      });

      if (rendered instanceof Node) {
        cell.append(rendered);
      } else if (typeof rendered === "string") {
        cell.textContent = rendered;
      }
      return;
    }

    const slotName = context.column?.cell?.slot;
    if (typeof slotName !== "string" || slotName.length === 0) {
      this.#renderTextCell(cell, context);
      return;
    }

    const escapedSlotName =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(slotName)
        : slotName.replaceAll('"', '\\"');
    const template = this.querySelector(`template[slot="${escapedSlotName}"]`);

    if (template instanceof HTMLTemplateElement) {
      const fragment = template.content.cloneNode(true);
      const nodes = fragment.querySelectorAll("*");
      for (const node of nodes) {
        if (node instanceof HTMLElement) {
          node.dataset.rowId = context.rowId;
          node.dataset.columnId = this.#normalizeText(context.column.id);
        }
      }
      cell.append(fragment);
      return;
    }

    const slottedNode = this.querySelector(`[slot="${escapedSlotName}"]`);
    if (slottedNode instanceof HTMLElement) {
      const clone = slottedNode.cloneNode(true);
      if (clone instanceof HTMLElement) {
        clone.removeAttribute("slot");
        clone.dataset.rowId = context.rowId;
        clone.dataset.columnId = this.#normalizeText(context.column.id);
      }
      cell.append(clone);
      return;
    }

    this.#renderTextCell(cell, context);
  }

  #emitCellChange(context, value) {
    emit(this, "rowan-cell-change", {
      rowId: context.rowId,
      columnId: context.column.id,
      value,
      row: context.row,
    });
  }

  #emitCellAction(context, action, nativeEvent) {
    emit(this, "rowan-cell-action", {
      rowId: context.rowId,
      columnId: context.column.id,
      action,
      row: context.row,
      nativeEvent,
    });
  }

  #toggleRowSelection(entry, checked, options = {}) {
    if (this.selectable === "none") return;

    const selected = new Set(this.#state.selected);
    const shiftKey = Boolean(options.shiftKey);
    const currentIndex = entry.visibleIndex;

    if (this.selectable === "single") {
      if (checked) {
        selected.clear();
        selected.add(entry.rowId);
      } else {
        selected.delete(entry.rowId);
      }
    } else if (shiftKey && this.#lastSelectedIndex >= 0) {
      const start = Math.min(this.#lastSelectedIndex, currentIndex);
      const end = Math.max(this.#lastSelectedIndex, currentIndex);
      for (let index = start; index <= end; index += 1) {
        const rangeEntry = this.#visibleRows[index];
        if (!rangeEntry) continue;
        if (checked) {
          selected.add(rangeEntry.rowId);
        } else {
          selected.delete(rangeEntry.rowId);
        }
      }
    } else {
      if (checked) {
        selected.add(entry.rowId);
      } else {
        selected.delete(entry.rowId);
      }
    }

    this.#lastSelectedIndex = currentIndex;
    this.#state.selected = this.#orderedSelection(selected);
    this.#selectionNeedsSync = true;
    this.requestRender();

    emit(this, "rowan-select", {
      selected: [...this.#state.selected],
      row: entry.row,
      selectedRows: this.selectedRows,
    });
  }

  #orderedSelection(selection) {
    return this.rows
      .map((row, index) => this.#resolveRowId(row, index))
      .filter((rowId) => selection.has(rowId));
  }

  #buildView() {
    const entries = this.rows.map((row, rowIndex) => ({
      row,
      rowIndex,
      rowId: this.#resolveRowId(row, rowIndex),
    }));

    const hasDuplicateRowIds = this.#hasDuplicateRowIds(entries);
    this.#validateRowIds(entries);
    const sorted = this.#applySort(entries);
    const pageInfo = this.#resolvePageInfo(sorted.length);
    const paged = pageInfo ? sorted.slice(pageInfo.start, pageInfo.end) : sorted;

    const rows = paged.map((entry, visibleIndex) => ({
      ...entry,
      visibleIndex,
    }));

    return { entries, rows, pageInfo, hasDuplicateRowIds };
  }

  #applySort(entries) {
    const sort = this.#state.sort;
    if (!sort) return entries;

    const column = this.#findColumn(sort.id);
    if (!column) return entries;

    const direction = sort.dir === "desc" ? -1 : 1;
    const sortedEntries = [...entries];

    sortedEntries.sort((left, right) => {
      const leftValue = this.#resolveValue(left.row, left.rowIndex, column);
      const rightValue = this.#resolveValue(right.row, right.rowIndex, column);
      const result = this.#compareValues(leftValue, rightValue, column.type);

      if (result === 0) {
        return left.rowIndex - right.rowIndex;
      }

      return result * direction;
    });

    return sortedEntries;
  }

  #compareValues(left, right, type) {
    if (left == null && right == null) return 0;
    if (left == null) return 1;
    if (right == null) return -1;

    if (type === "number") {
      const leftNumber = Number(left);
      const rightNumber = Number(right);

      if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
        return leftNumber - rightNumber;
      }
    }

    if (type === "date") {
      const leftDate = new Date(left);
      const rightDate = new Date(right);

      if (!Number.isNaN(leftDate.getTime()) && !Number.isNaN(rightDate.getTime())) {
        return leftDate.getTime() - rightDate.getTime();
      }
    }

    if (typeof left === "number" && typeof right === "number") {
      return left - right;
    }

    return this.#normalizeText(left).localeCompare(this.#normalizeText(right), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  #normalizeSort(value) {
    if (!value || typeof value !== "object") return null;
    if (typeof value.id !== "string" || value.id.length === 0) return null;
    if (!SORT_DIRECTIONS.has(value.dir)) return null;

    return {
      id: value.id,
      dir: value.dir,
    };
  }

  #columnSortDirection(column) {
    if (this.#state.sort?.id === column.id) {
      return this.#state.sort.dir;
    }

    return SORT_DIRECTIONS.has(column.sortDir) ? column.sortDir : null;
  }

  #nextSortDirection(column) {
    const current = this.#columnSortDirection(column);
    return current === "asc" ? "desc" : "asc";
  }

  #normalizePage(value) {
    if (!value || typeof value !== "object") return null;

    const size = Math.max(1, Number(value.size) || 1);
    const index = Math.max(0, Number(value.index) || 0);
    const normalized = { index, size };

    if (value.total != null && Number.isFinite(Number(value.total))) {
      normalized.total = Math.max(0, Number(value.total));
    }

    return normalized;
  }

  #resolvePageInfo(totalRows) {
    const page = this.#state.page;
    if (!page) return null;

    const size = Math.max(1, page.size);
    const total = page.total ?? totalRows;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const index = Math.min(Math.max(0, page.index), totalPages - 1);
    const start = Math.min(index * size, totalRows);
    const end = Math.min(start + size, totalRows);

    return {
      index,
      size,
      total,
      totalPages,
      start,
      end,
    };
  }

  #renderPagination(pageInfo) {
    if (!this.#state.page || !pageInfo) {
      this.#paginationEl.hidden = true;
      this.#paginationStatusEl.textContent = "";
      return;
    }

    this.#paginationEl.hidden = false;

    if (pageInfo.total === 0) {
      this.#paginationStatusEl.textContent = "No rows";
    } else {
      const from = pageInfo.start + 1;
      const to = Math.min(pageInfo.start + pageInfo.size, pageInfo.total);
      this.#paginationStatusEl.textContent = `Showing ${from}-${to} of ${pageInfo.total}`;
    }

    this.#paginationPrevButton.disabled = pageInfo.index <= 0;
    this.#paginationNextButton.disabled = pageInfo.index >= pageInfo.totalPages - 1;
  }

  #changePage(nextIndex) {
    if (!this.#state.page) return;

    const size = this.#state.page.size;
    const total = this.#state.page.total ?? this.rows.length;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const index = Math.min(Math.max(0, nextIndex), totalPages - 1);

    if (index === this.#state.page.index) return;

    this.#state.page = {
      ...this.#state.page,
      index,
    };

    this.#viewNeedsReconciliation = true;
    this.requestRender();

    emit(this, "rowan-page-change", {
      index,
      size: this.#state.page.size,
    });
  }

  #pruneSelection(entries) {
    if (!this.#state.selected.length) return;

    const available = new Set(entries.map((entry) => entry.rowId));
    const selected = this.#state.selected.filter((rowId) => available.has(rowId));
    if (selected.length !== this.#state.selected.length) {
      this.#state.selected = selected;
      this.#selectionNeedsSync = true;
    }
  }

  #resolveValue(row, rowIndex, column) {
    if (typeof column.accessor === "function") {
      return column.accessor(row, rowIndex);
    }

    if (typeof column.accessor === "string") {
      return row?.[column.accessor];
    }

    return row?.[column.id];
  }

  #resolveCellType(column) {
    const requested = column?.cell?.type ?? column?.type ?? "text";
    return CELL_TYPES.has(requested) ? requested : "text";
  }

  #resolveCellOption(column, key, value, row) {
    const option = column?.cell?.[key];

    if (typeof option === "function") {
      return option(value, row);
    }

    return option;
  }

  #formatValue(column, value, row, rowIndex) {
    if (typeof column.format === "function") {
      return this.#normalizeText(column.format(value, row, rowIndex));
    }

    return this.#normalizeText(value);
  }

  #normalizeText(value) {
    if (value == null) return "";
    return String(value);
  }

  #resolveRowId(row, rowIndex) {
    const rowId = this.#state.rowId;

    if (typeof rowId === "function") {
      try {
        const dynamicId = rowId(row, rowIndex);
        const normalized = this.#normalizeText(dynamicId);
        if (dynamicId != null && normalized.trim().length > 0) return normalized;
      } catch {
        this.#warn(
          "row-id-function-error",
          "rowId function threw while resolving rows; affected rows use their index.",
        );
        return this.#normalizeText(rowIndex);
      }

      this.#warn(
        "row-id-function-empty",
        "rowId function must return a non-empty value; affected rows use their index.",
      );
      return this.#normalizeText(rowIndex);
    }

    if (typeof rowId === "string" && rowId.trim().length > 0) {
      const value = row?.[rowId];
      const normalized = this.#normalizeText(value);
      if (value != null && normalized.trim().length > 0) return normalized;

      this.#warn(
        `row-id-value-${rowId}`,
        `rowId accessor "${rowId}" did not resolve a value for every row; affected rows use their index.`,
      );
    }

    return this.#normalizeText(rowIndex);
  }

  #safeUrl(value) {
    if (typeof value !== "string") return "#";

    const trimmed = value.trim();
    if (trimmed.length === 0) return "#";

    const lower = trimmed.toLowerCase();
    if (lower.startsWith("javascript:")) return "#";

    try {
      const url = new URL(trimmed, window.location.origin);
      if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
        return url.toString();
      }

      if (!trimmed.includes(":")) {
        return trimmed;
      }
    } catch {
      if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
        return trimmed;
      }
    }

    return "#";
  }

  #alignToCss(align) {
    if (align === "center") return "center";
    if (align === "end") return "right";
    return "left";
  }

  #visibleColumnCount() {
    const count = this.#renderableColumns().length;
    const selectableColumns = this.selectable === "none" ? 0 : 1;
    return Math.max(1, count + selectableColumns);
  }
}

define("rowan-table", RowanTable);
