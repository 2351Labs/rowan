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
 * Config-driven data table.
 * @tag rowan-table
 * @attr {"none"|"single"|"multiple"} selectable
 * @attr {"sm"|"md"|"lg"} density
 * @attr {boolean} sticky-header
 * @attr {boolean} loading
 * @attr {string} caption
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
  #lastSelectedIndex = -1;

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

  set config(value) {
    const next = value ?? {};

    this.#state.columns = Array.isArray(next.columns) ? next.columns : this.#state.columns;
    this.#state.rows = Array.isArray(next.rows) ? next.rows : this.#state.rows;
    this.#state.rowId = next.rowId ?? this.#state.rowId;

    if (next.caption != null) this.caption = String(next.caption);
    if (next.density != null) this.density = next.density;
    if (next.selectable != null) this.selectable = next.selectable;
    if (next.selected != null) this.selected = next.selected;
    if (next.sort !== undefined) this.sort = next.sort;
    if (next.page !== undefined) this.page = next.page;
    if (next.stickyHeader != null) this.stickyHeader = Boolean(next.stickyHeader);
    if (next.loading != null) this.loading = Boolean(next.loading);

    this.requestRender();
  }

  get columns() {
    return this.#state.columns;
  }

  set columns(value) {
    this.#state.columns = Array.isArray(value) ? value : [];
    this.requestRender();
  }

  get rows() {
    return this.#state.rows;
  }

  set rows(value) {
    this.#state.rows = Array.isArray(value) ? value : [];
    this.requestRender();
  }

  get selectable() {
    return this.readString("selectable", "none");
  }

  set selectable(value) {
    const next = value === "single" || value === "multiple" ? value : "none";
    this.reflectString("selectable", next === "none" ? null : next);
  }

  get selected() {
    return [...this.#state.selected];
  }

  set selected(value) {
    this.#state.selected = Array.isArray(value)
      ? value.map((item) => this.#normalizeText(item))
      : [];
    this.requestRender();
  }

  get sort() {
    if (!this.#state.sort) return null;
    return { ...this.#state.sort };
  }

  set sort(value) {
    this.#state.sort = this.#normalizeSort(value);
    this.requestRender();
  }

  get page() {
    if (!this.#state.page) return null;
    return { ...this.#state.page };
  }

  set page(value) {
    this.#state.page = this.#normalizePage(value);
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

  get selectedRows() {
    const selectedIds = new Set(this.#state.selected);

    return this.rows.filter((row, index) => selectedIds.has(this.#resolveRowId(row, index)));
  }

  selectAll() {
    if (this.selectable !== "multiple") return;

    const selectedIds = new Set(this.#visibleRows.map((entry) => entry.rowId));
    this.#state.selected = this.#orderedSelection(selectedIds);
    this.requestRender();
  }

  clearSelection() {
    this.#state.selected = [];
    this.#lastSelectedIndex = -1;
    this.requestRender();
  }

  sortBy(id, dir, options = {}) {
    const normalized = this.#normalizeSort({ id, dir });
    this.#state.sort = normalized;
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
    }

    this.#pruneSelection();
    const view = this.#buildView();
    this.#visibleRows = view.rows;

    this.#renderHeader();
    this.#renderBody(view.rows);
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

    for (const column of this.columns) {
      if (!column || column.hidden) continue;

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

        const label = document.createElement("span");
        label.textContent = column.header ?? "";

        const indicator = document.createElement("span");
        indicator.className = "sort-indicator";
        indicator.textContent = sortDir === "asc" ? "↑" : sortDir === "desc" ? "↓" : "↕";

        button.append(label, indicator);
        button.addEventListener("click", () => {
          const nextDir = this.#nextSortDirection(column);
          this.sortBy(column.id, nextDir, { emitEvent: true });
        });

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

    const selected = new Set(this.#state.selected);
    const selectedCount = this.#visibleRows.filter((entry) => selected.has(entry.rowId)).length;
    checkbox.checked = this.#visibleRows.length > 0 && selectedCount === this.#visibleRows.length;
    checkbox.indeterminate = selectedCount > 0 && selectedCount < this.#visibleRows.length;

    checkbox.addEventListener("rowan-change", () => {
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
    });

    th.append(checkbox);
    return th;
  }

  #renderBody(viewRows) {
    this.#tbody.textContent = "";

    if (this.loading) {
      this.#renderLoadingRow();
      return;
    }

    if (!viewRows.length) {
      this.#renderEmptyRow();
      return;
    }

    for (const entry of viewRows) {
      const tr = document.createElement("tr");
      tr.part = "tr";
      tr.dataset.rowId = entry.rowId;
      tr.tabIndex = 0;

      tr.addEventListener("dblclick", () => {
        emit(this, "rowan-row-activate", {
          rowId: entry.rowId,
          row: entry.row,
        });
      });

      tr.addEventListener("keydown", (event) => {
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
      });

      if (this.selectable !== "none") {
        tr.append(this.#createSelectionBodyCell(entry));
      }

      this.columns.forEach((column) => {
        if (!column || column.hidden) return;

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

      this.#tbody.append(tr);
    }
  }

  #createSelectionBodyCell(entry) {
    const td = document.createElement("td");
    td.className = "td select-column";
    td.part = "td";
    td.dataset.columnId = SELECT_COLUMN_ID;

    const selector = document.createElement("rowan-checkbox");
    selector.setAttribute("aria-label", `Select row ${entry.rowId}`);
    selector.checked = this.#state.selected.includes(entry.rowId);

    let shiftHeld = false;
    selector.addEventListener("click", (event) => {
      shiftHeld = event.shiftKey;
    });

    selector.addEventListener("rowan-change", () => {
      this.#toggleRowSelection(entry, selector.checked, { shiftKey: shiftHeld });
      shiftHeld = false;
    });

    td.append(selector);
    return td;
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

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      this.#emitCellAction(context, "link", event);
    });

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

    checkbox.addEventListener("rowan-change", () => {
      this.#emitCellChange(context, checkbox.checked);
    });

    cell.append(checkbox);
  }

  #renderSwitchCell(cell, context) {
    const switchControl = customElements.get("rowan-switch")
      ? document.createElement("rowan-switch")
      : document.createElement("rowan-checkbox");
    switchControl.dataset.cellType = "switch";
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

    let emitted = false;
    const emitChange = () => {
      if (emitted) return;
      emitted = true;
      queueMicrotask(() => {
        emitted = false;
      });
      this.#emitCellChange(context, Boolean(switchControl.checked));
    };

    switchControl.addEventListener("rowan-change", emitChange);
    switchControl.addEventListener("change", emitChange);

    cell.append(switchControl);
  }

  #renderButtonCell(cell, context) {
    const button = document.createElement("rowan-button");
    button.dataset.cellType = "button";

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

    button.addEventListener("rowan-click", (event) => {
      this.#emitCellAction(context, "button", event);
    });

    cell.append(button);
  }

  #renderIconButtonCell(cell, context) {
    const hasIconButton = customElements.get("rowan-icon-button");
    const button = hasIconButton
      ? document.createElement("rowan-icon-button")
      : document.createElement("rowan-button");
    button.dataset.cellType = "icon-button";

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
      button.addEventListener("rowan-click", (event) => {
        this.#emitCellAction(context, "icon-button", event);
      });
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
      button.addEventListener("rowan-click", (event) => {
        this.#emitCellAction(context, "icon-button", event);
      });
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

    const sorted = this.#applySort(entries);
    const pageInfo = this.#resolvePageInfo(sorted.length);
    const paged = pageInfo ? sorted.slice(pageInfo.start, pageInfo.end) : sorted;

    const rows = paged.map((entry, visibleIndex) => ({
      ...entry,
      visibleIndex,
    }));

    return { rows, pageInfo };
  }

  #applySort(entries) {
    const sort = this.#state.sort;
    if (!sort) return entries;

    const column = this.columns.find((item) => item && item.id === sort.id);
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

    this.requestRender();

    emit(this, "rowan-page-change", {
      index,
      size: this.#state.page.size,
    });
  }

  #pruneSelection() {
    if (!this.#state.selected.length) return;

    const available = new Set(this.rows.map((row, index) => this.#resolveRowId(row, index)));
    this.#state.selected = this.#state.selected.filter((rowId) => available.has(rowId));
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
      const dynamicId = rowId(row, rowIndex);
      return this.#normalizeText(dynamicId || rowIndex);
    }

    if (typeof rowId === "string" && row && row[rowId] != null) {
      return this.#normalizeText(row[rowId]);
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
    const count = this.columns.filter((column) => column && !column.hidden).length;
    const selectableColumns = this.selectable === "none" ? 0 : 1;
    return Math.max(1, count + selectableColumns);
  }
}

define("rowan-table", RowanTable);
