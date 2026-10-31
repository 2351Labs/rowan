import { emit } from "../lib/events.js";
import { resolveMessage } from "../lib/messages.js";

const DEFAULT_MESSAGES = Object.freeze({
  editCell: "Edit cell",
});

function editorLabel(messages) {
  return resolveMessage(messages, DEFAULT_MESSAGES, "editCell");
}

function readEditorValue(column, editor) {
  const editorType = column.editor?.type || (column.type === "number" ? "number" : "text");
  if (editorType === "checkbox") return editor.checked;
  if (editorType === "number") return editor.value === "" ? null : Number(editor.value);
  return editor.value;
}

function createTextEditor(type, value, column, messages) {
  const input = document.createElement("input");
  input.type = type === "number" ? "number" : "text";
  input.value = value ?? "";
  input.classList.add("cell-editor");
  input.setAttribute("aria-label", editorLabel(messages));
  if (type === "number") {
    if (column.editor?.min !== undefined) input.min = column.editor.min;
    if (column.editor?.max !== undefined) input.max = column.editor.max;
    if (column.editor?.step !== undefined) input.step = column.editor.step;
  }
  return input;
}

function createCustomEditor(column, context) {
  if (typeof column.editor?.render !== "function") return null;
  const customEditor = column.editor.render(context);
  if (!(customEditor instanceof HTMLElement)) return null;
  customEditor.classList.add("cell-editor");
  return customEditor;
}

export async function createEditor(type, value, column, context, messages) {
  let editor = null;

  if (type === "text" || type === "number" || !type) {
    editor = createTextEditor(type, value, column, messages);
  } else if (type === "custom") {
    editor = createCustomEditor(column, context);
  } else if (type === "select") {
    await import("../select/select.js");
    const select = document.createElement("rowan-select");
    select.classList.add("cell-editor");
    select.setAttribute("aria-label", editorLabel(messages));
    select.options = column.editor?.options || [];
    select.value = value == null ? "" : String(value);
    editor = select;
  } else if (type === "date") {
    await import("../date-picker/date-picker.js");
    const datePicker = document.createElement("rowan-date-picker");
    datePicker.value = value ?? "";
    datePicker.classList.add("cell-editor");
    datePicker.setAttribute("aria-label", editorLabel(messages));
    editor = datePicker;
  } else if (type === "checkbox") {
    const checkbox = document.createElement("rowan-checkbox");
    checkbox.checked = Boolean(value);
    checkbox.classList.add("cell-editor");
    checkbox.setAttribute("aria-label", editorLabel(messages));
    editor = checkbox;
  }

  return editor;
}

function createImmediateEditor(type, value, column, context, messages) {
  if (type === "select" || type === "date" || type === "checkbox") return undefined;
  if (type === "custom") return createCustomEditor(column, context);
  return createTextEditor(type === "number" ? "number" : "text", value, column, messages);
}

function restoreEditor(entry) {
  entry.td.classList.remove("editing");
  entry.td.innerHTML = entry.originalContent;
}

function stopCellEdit(ctx, editing, committed) {
  if (!editing) return;
  if (!committed) {
    emit(ctx.table, "rowan-edit-cancel", {
      rowId: editing.rowId,
      columnId: editing.columnId,
      row: editing.row,
      rowIndex: editing.rowIndex,
      column: editing.column,
    });
  }
  restoreEditor(editing);
}

function stopRowEdit(ctx, rowEditing, committed) {
  if (!rowEditing) return;
  if (!committed) {
    emit(ctx.table, "rowan-row-edit-cancel", { rowId: rowEditing.rowId });
  }
  for (const entry of rowEditing.cellEditors) restoreEditor(entry);
  ctx.requestRender();
}

function commitCellEdit(ctx, editing) {
  if (!editing) return false;
  const newValue = readEditorValue(editing.column, editing.editor);
  const allowed = emit(ctx.table, "rowan-edit-commit", {
    rowId: editing.rowId,
    columnId: editing.columnId,
    value: newValue,
    oldValue: editing.originalValue,
    row: editing.row,
    rowIndex: editing.rowIndex,
    column: editing.column,
  }, { cancelable: true });

  if (!allowed) {
    stopCellEdit(ctx, editing, false);
    ctx.sync(null, null);
    return false;
  }

  editing.row[editing.column.id] = newValue;
  stopCellEdit(ctx, editing, true);
  ctx.sync(null, null);
  ctx.requestRender();
  return true;
}

function commitRowEdit(ctx, rowEditing) {
  if (!rowEditing) return false;
  const values = {};
  const oldValues = {};
  for (const entry of rowEditing.cellEditors) {
    values[entry.column.id] = readEditorValue(entry.column, entry.editor);
    oldValues[entry.column.id] = rowEditing.originalValues[entry.column.id];
  }

  const allowed = emit(ctx.table, "rowan-row-edit-commit", {
    rowId: rowEditing.rowId,
    values,
    oldValues,
    row: rowEditing.row,
    rowIndex: rowEditing.rowIndex,
  }, { cancelable: true });

  if (!allowed) {
    stopRowEdit(ctx, rowEditing, false);
    ctx.sync(null, null);
    return false;
  }

  for (const [columnId, value] of Object.entries(values)) {
    rowEditing.row[columnId] = value;
  }
  stopRowEdit(ctx, rowEditing, true);
  ctx.sync(null, null);
  return true;
}

function focusEditor(editor) {
  if (editor?.focus) editor.focus();
  if (editor?.select) editor.select();
}

function bindCellKeys(ctx, editing) {
  editing.editor.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      commitCellEdit(ctx, editing);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      stopCellEdit(ctx, editing, false);
      ctx.sync(null, null);
    } else if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
      commitCellEdit(ctx, editing);
    }
  });
}

function bindRowKeys(ctx, rowEditing) {
  const editors = rowEditing.cellEditors;
  for (const entry of editors) {
    entry.editor.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        commitRowEdit(ctx, rowEditing);
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        stopRowEdit(ctx, rowEditing, false);
        ctx.sync(null, null);
      } else if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        const currentIndex = editors.findIndex((item) => item.editor === entry.editor);
        const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < editors.length) focusEditor(editors[nextIndex].editor);
      }
    });
  }
}

function clearActiveEdit(ctx, editing, rowEditing) {
  if (editing) stopCellEdit(ctx, editing, false);
  if (rowEditing) stopRowEdit(ctx, rowEditing, false);
  if (editing || rowEditing) ctx.sync(null, null);
}

function mountCellSession(ctx, session) {
  bindCellKeys(ctx, session);
  session.td.innerHTML = "";
  session.td.classList.add("editing");
  session.td.append(session.editor);
  ctx.sync(session, null);
  focusEditor(session.editor);
}

export function beginCellEdit(ctx, editing, rowEditing, rowId, columnId, initialValue) {
  clearActiveEdit(ctx, editing, rowEditing);

  const tr = ctx.root.querySelector(`tr[data-row-id="${rowId}"]`);
  if (!tr) return;

  const located = ctx.getRowFromElement(tr);
  if (!located) return;

  const { row, rowIndex } = located;
  const column = ctx.findColumn(columnId);
  if (!column || !ctx.isColumnEditable(column, row, rowIndex)) return;

  const td = ctx.root.querySelector(`tr[data-row-id="${rowId}"] td[data-column-id="${columnId}"]`);
  if (!td) return;

  const currentValue = initialValue !== undefined ? initialValue : ctx.resolveValue(row, rowIndex, column);
  const allowed = emit(ctx.table, "rowan-edit-start", {
    rowId,
    columnId,
    value: currentValue,
    row,
    rowIndex,
    column,
  }, { cancelable: true });
  if (!allowed) return;

  const editorType = column.editor?.type || (column.type === "number" ? "number" : "text");
  let session = null;
  const editContext = {
    value: currentValue,
    row,
    rowIndex,
    column,
    cellEl: td,
    commit: () => {
      if (session) commitCellEdit(ctx, session);
    },
    cancel: () => {
      if (!session) return;
      stopCellEdit(ctx, session, false);
      ctx.sync(null, null);
    },
  };
  const mount = (editor) => {
    if (!editor) return;
    session = {
      rowId,
      columnId,
      row,
      rowIndex,
      column,
      td,
      editor,
      originalValue: currentValue,
      originalContent: td.innerHTML,
    };
    mountCellSession(ctx, session);
  };

  const immediate = createImmediateEditor(editorType, currentValue, column, editContext, ctx.messages);
  if (immediate !== undefined) {
    mount(immediate);
    return;
  }

  return createEditor(editorType, currentValue, column, editContext, ctx.messages).then(mount);
}

export function beginRowEdit(ctx, editing, rowEditing, rowId) {
  clearActiveEdit(ctx, editing, rowEditing);

  const tr = ctx.root.querySelector(`tr[data-row-id="${rowId}"]`);
  if (!tr) return;

  const located = ctx.getRowFromElement(tr);
  if (!located) return;

  const { row, rowIndex } = located;
  const editableCells = [];
  for (const column of ctx.columns) {
    if (!ctx.isColumnEditable(column, row, rowIndex)) continue;
    const td = tr.querySelector(`td[data-column-id="${column.id}"]`);
    if (td) editableCells.push({ column, td });
  }
  if (editableCells.length === 0) return;

  const cellEditors = [];
  const pendingEditors = [];
  const originalValues = {};
  let session = null;
  for (const { column, td } of editableCells) {
    const currentValue = ctx.resolveValue(row, rowIndex, column);
    const editorType = column.editor?.type || (column.type === "number" ? "number" : "text");
    const editContext = {
      value: currentValue,
      row,
      rowIndex,
      column,
      cellEl: td,
      commit: () => {
        if (session) commitRowEdit(ctx, session);
      },
      cancel: () => {
        if (!session) return;
        stopRowEdit(ctx, session, false);
        ctx.sync(null, null);
      },
    };
    const immediate = createImmediateEditor(editorType, currentValue, column, editContext, ctx.messages);
    const editor = immediate === undefined ? null : immediate;
    if (immediate === undefined) {
      pendingEditors.push({ column, td, currentValue, editorType, editContext });
      continue;
    }
    if (!editor) continue;
    originalValues[column.id] = currentValue;
    cellEditors.push({ column, td, editor, originalContent: td.innerHTML });
    td.innerHTML = "";
    td.classList.add("editing");
    td.append(editor);
  }
  const finish = (entries) => {
    if (entries.length === 0) return;
    session = { rowId, row, rowIndex, cellEditors: entries, originalValues };
    bindRowKeys(ctx, session);
    ctx.sync(null, session);
    focusEditor(entries[0].editor);
  };

  if (pendingEditors.length === 0) {
    finish(cellEditors);
    return;
  }

  return (async () => {
    const entries = [...cellEditors];
    for (const entry of pendingEditors) {
      const editor = await createEditor(
        entry.editorType,
        entry.currentValue,
        entry.column,
        entry.editContext,
        ctx.messages,
      );
      if (!editor) continue;
      originalValues[entry.column.id] = entry.currentValue;
      const originalContent = entry.td.innerHTML;
      entry.td.innerHTML = "";
      entry.td.classList.add("editing");
      entry.td.append(editor);
      entries.push({
        column: entry.column,
        td: entry.td,
        editor,
        originalContent,
      });
    }
    finish(entries);
  })();
}
