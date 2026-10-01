import "../../src/text-field/text-field.js";

function asText(value) {
  return value == null ? "" : String(value);
}

function asIdentifier(value) {
  const identifier = asText(value);
  return identifier.length > 0 ? identifier : "";
}

function errorText(value, fallback) {
  if (value instanceof Error && value.message) return value.message;
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

/**
 * Dev-only controlled draft editor for evaluating rowan-table custom-cell composition.
 * It is deliberately not a shipped component or part of the rowan-table API.
 */
export class ControlledTableDraftEditor extends EventTarget {
  #table;
  #validate;
  #onCommit;
  #drafts = new Map();
  #active = null;
  #observer = null;
  #reconcileQueued = false;
  #disposed = false;

  constructor(table, { validate, onCommit } = {}) {
    super();

    if (!(table instanceof HTMLElement) || table.localName !== "rowan-table") {
      throw new TypeError("ControlledTableDraftEditor requires a rowan-table host.");
    }

    this.#table = table;
    this.#validate = typeof validate === "function" ? validate : null;
    this.#onCommit = typeof onCommit === "function" ? onCommit : null;

    if (typeof MutationObserver !== "undefined" && table.shadowRoot) {
      this.#observer = new MutationObserver(() => this.#queueReconcile());
      this.#observer.observe(table.shadowRoot, { childList: true, subtree: true });
    }
  }

  get table() {
    return this.#table;
  }

  get activeDraft() {
    if (!this.#active) return null;

    return {
      rowId: this.#active.rowId,
      columnId: this.#active.columnId,
      value: this.#readDraft(this.#active),
      previousValue: this.#active.previousValue,
      row: this.#active.row,
      error: this.#active.error,
    };
  }

  /**
   * Returns a custom-cell renderer for a column configured with `type: "custom"`.
   * Set `cell.interactive: true` so table row activation remains separate.
   */
  renderCell(context) {
    return this.#createTrigger(context.cellEl, context.value, context.column);
  }

  start({ rowId, columnId }) {
    const normalizedRowId = asIdentifier(rowId);
    const normalizedColumnId = asIdentifier(columnId);
    if (!normalizedRowId || !normalizedColumnId || this.#disposed) return false;

    const entry = this.#findRow(normalizedRowId);
    const column = this.#findColumn(normalizedColumnId);
    const cell = this.#findCell(normalizedRowId, normalizedColumnId);
    if (!entry || !column || !cell) return false;

    this.#begin({
      rowId: normalizedRowId,
      columnId: normalizedColumnId,
      row: entry.row,
      rowIndex: entry.rowIndex,
      column,
      cell,
    });
    return true;
  }

  cancel(reason = "cancel") {
    const active = this.#active;
    if (!active) return false;

    this.#drafts.delete(active.key);
    this.#active = null;
    this.#restoreCell(active);
    this.dispatchEvent(
      new CustomEvent("rowan-table-draft-cancel", {
        detail: this.#detailFor(active, { reason }),
      }),
    );
    return true;
  }

  dispose() {
    if (this.#disposed) return;

    this.cancel("dispose");
    this.#observer?.disconnect();
    this.#disposed = true;
  }

  #startFromCell(cell) {
    const row = cell?.closest("tr[data-row-id]");
    if (!(row instanceof HTMLTableRowElement)) return;

    this.start({
      rowId: row.dataset.rowId,
      columnId: cell.dataset.columnId,
    });
  }

  #begin({ rowId, columnId, row, rowIndex, column, cell }) {
    if (this.#active && (this.#active.rowId !== rowId || this.#active.columnId !== columnId)) {
      this.cancel("superseded");
    }

    const key = this.#draftKey(rowId, columnId);
    const previousValue = this.#valueFor(row, rowIndex, column);
    this.#active = {
      key,
      rowId,
      columnId,
      row,
      rowIndex,
      column,
      previousValue,
      sourceValue: previousValue,
      draft: this.#drafts.get(key) ?? asText(previousValue),
      error: "",
      saving: false,
      stale: false,
      cell,
      field: null,
      errorElement: null,
    };
    this.#drafts.set(key, this.#active.draft);
    this.#mountEditor({ focus: true });
  }

  #createTrigger(cell, value, column) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "rowan-table-draft-trigger";
    trigger.dataset.rowanTableDraftTrigger = "";
    trigger.textContent = asText(value);
    trigger.setAttribute("aria-label", `Edit ${column?.header || column?.id || "cell"}`);

    const start = () => this.#startFromCell(cell);
    trigger.addEventListener("click", start);
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      event.stopPropagation();
      start();
    });
    return trigger;
  }

  #mountEditor({ focus = false } = {}) {
    const active = this.#active;
    if (!active) return;

    const cell = this.#findCell(active.rowId, active.columnId);
    if (!cell) {
      active.cell = null;
      active.field = null;
      active.errorElement = null;
      return;
    }

    if (active.cell === cell && active.field?.isConnected) {
      this.#syncEditorState(active);
      return;
    }

    const editor = document.createElement("div");
    editor.className = "rowan-table-draft-editor";
    editor.dataset.rowanTableDraftEditor = "";

    const field = document.createElement("rowan-text-field");
    field.label = active.column.header || active.columnId;
    field.value = active.draft;
    field.setAttribute("data-rowan-table-draft-input", "");

    const error = document.createElement("span");
    error.dataset.rowanTableDraftError = "";
    error.setAttribute("role", "alert");

    field.addEventListener("input", () => {
      if (this.#active !== active) return;

      active.draft = this.#readFieldValue(field);
      this.#drafts.set(active.key, active.draft);
      active.error = "";
      this.#syncEditorState(active);
    });
    field.addEventListener("rowan-change", () => {
      if (this.#active !== active) return;

      active.draft = this.#readFieldValue(field);
      this.#drafts.set(active.key, active.draft);
    });
    field.addEventListener("keydown", (event) => this.#handleEditorKeyDown(event, active));

    editor.append(field, error);
    cell.replaceChildren(editor);
    active.cell = cell;
    active.field = field;
    active.errorElement = error;
    this.#syncEditorState(active);

    if (focus) {
      queueMicrotask(() => {
        if (this.#active === active && field.isConnected) field.focus();
      });
    }
  }

  #syncEditorState(active) {
    if (active.field) {
      const nextValue = active.draft;
      if (this.#readFieldValue(active.field) !== nextValue) active.field.value = nextValue;
      active.field.invalid = Boolean(active.error);
      active.field.disabled = active.saving;
    }

    if (active.errorElement) {
      active.errorElement.hidden = !active.error;
      active.errorElement.textContent = active.error;
    }
  }

  #handleEditorKeyDown(event, active) {
    if (active !== this.#active) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.cancel("escape");
      return;
    }

    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      this.#requestCommit(active);
    }
  }

  async #requestCommit(active) {
    this.#markStaleIfSourceChanged(active);
    const value = this.#readDraft(active);
    const detail = this.#detailFor(active, { value });

    if (active.stale) {
      this.#setError(
        active,
        "The source row changed while this draft was open. Cancel and restart editing.",
      );
      return;
    }

    let validationResult;
    try {
      validationResult = await this.#validate?.(detail);
    } catch (error) {
      this.#setError(active, errorText(error, "The value could not be validated."));
      return;
    }

    if (this.#active !== active) return;

    if (typeof validationResult === "string" && validationResult.trim()) {
      this.#setError(active, validationResult.trim());
      return;
    }

    if (validationResult === false) {
      this.#setError(active, "The value is invalid.");
      return;
    }

    active.saving = true;
    this.#syncEditorState(active);

    const request = new CustomEvent("rowan-table-draft-commit", {
      cancelable: true,
      detail,
    });
    if (!this.dispatchEvent(request)) {
      this.#setError(active, "The save request was rejected.");
      return;
    }

    try {
      const result = this.#onCommit?.(detail);
      if (result === false) throw new Error("The save request was rejected.");
      await result;
    } catch (error) {
      this.#setError(active, errorText(error, "The value could not be saved."));
      this.dispatchEvent(
        new CustomEvent("rowan-table-draft-error", {
          detail: this.#detailFor(active, { error: active.error }),
        }),
      );
      return;
    }

    if (this.#active !== active) return;

    this.#drafts.delete(active.key);
    this.#active = null;
    this.#restoreCell(active);
  }

  #setError(active, message) {
    if (this.#active !== active) return;

    active.saving = false;
    active.error = message;
    this.#syncEditorState(active);
  }

  #readDraft(active) {
    if (active.field?.isConnected) {
      active.draft = this.#readFieldValue(active.field);
      this.#drafts.set(active.key, active.draft);
    }

    return active.draft;
  }

  #readFieldValue(field) {
    const input = field.shadowRoot?.querySelector("input");
    return input instanceof HTMLInputElement ? input.value : asText(field.value);
  }

  #restoreCell(active) {
    const cell = this.#findCell(active.rowId, active.columnId);
    if (!cell || cell !== active.cell) return;

    const current = this.#findRow(active.rowId);
    const value = current
      ? this.#valueFor(current.row, current.rowIndex, active.column)
      : active.previousValue;
    cell.replaceChildren(this.#createTrigger(cell, value, active.column));
  }

  #queueReconcile() {
    if (this.#reconcileQueued || this.#disposed) return;

    this.#reconcileQueued = true;
    queueMicrotask(() => {
      this.#reconcileQueued = false;
      this.#reconcileActiveDraft();
    });
  }

  #reconcileActiveDraft() {
    const active = this.#active;
    if (!active) return;

    if (!this.#findRow(active.rowId)) {
      active.cell = null;
      active.field = null;
      active.errorElement = null;
      return;
    }

    if (!active.saving) this.#markStaleIfSourceChanged(active);

    this.#mountEditor();
  }

  #markStaleIfSourceChanged(active) {
    if (active.stale) return true;

    const current = this.#findRow(active.rowId);
    const currentValue = current
      ? this.#valueFor(current.row, current.rowIndex, active.column)
      : undefined;
    if (!current || current.row !== active.row || !Object.is(currentValue, active.sourceValue)) {
      active.stale = true;
      active.error =
        "The source row changed while this draft was open. Cancel and restart editing.";
    }

    return active.stale;
  }

  #detailFor(active, additional = {}) {
    return {
      rowId: active.rowId,
      columnId: active.columnId,
      value: active.draft,
      previousValue: active.previousValue,
      row: active.row,
      ...additional,
    };
  }

  #findRow(rowId) {
    const { rowId: accessor = "id", rows = [] } = this.#table.config;

    for (const [rowIndex, row] of rows.entries()) {
      let candidate;
      try {
        candidate = typeof accessor === "function" ? accessor(row, rowIndex) : row?.[accessor];
      } catch {
        continue;
      }

      if (candidate == null || candidate === "") candidate = rowIndex;
      if (asText(candidate) === rowId) return { row, rowIndex };
    }

    return null;
  }

  #findColumn(columnId) {
    return this.#table.columns.find((column) => column?.id === columnId) ?? null;
  }

  #findCell(rowId, columnId) {
    const root = this.#table.shadowRoot;
    if (!root) return null;

    const row = [...root.querySelectorAll("tbody tr[data-row-id]")].find(
      (element) => element.dataset.rowId === rowId,
    );
    if (!(row instanceof HTMLTableRowElement)) return null;

    return (
      [...row.querySelectorAll("td[data-column-id]")].find(
        (element) => element.dataset.columnId === columnId,
      ) ?? null
    );
  }

  #valueFor(row, rowIndex, column) {
    try {
      if (typeof column.accessor === "function") return column.accessor(row, rowIndex);
      if (typeof column.accessor === "string") return row?.[column.accessor];
      return row?.[column.id];
    } catch {
      return undefined;
    }
  }

  #draftKey(rowId, columnId) {
    return `${rowId}\u0000${columnId}`;
  }
}
