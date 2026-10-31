import { resolveMessage } from "../lib/messages.js";

const DEFAULT_MESSAGES = Object.freeze({
  editCell: "Edit cell",
});

export async function createEditor(type, value, column, context, messages) {
  if (type === "select") {
    await import("../select/select.js");
    const select = document.createElement("rowan-select");
    select.value = value ?? "";
    select.classList.add("cell-editor");
    select.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    select.options = column.editor?.options || [];
    return select;
  }

  if (type === "date") {
    await import("../date-picker/date-picker.js");
    const datePicker = document.createElement("rowan-date-picker");
    datePicker.value = value ?? "";
    datePicker.classList.add("cell-editor");
    datePicker.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    return datePicker;
  }

  if (type === "checkbox") {
    await import("../checkbox/checkbox.js");
    const checkbox = document.createElement("rowan-checkbox");
    checkbox.checked = Boolean(value);
    checkbox.classList.add("cell-editor");
    checkbox.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    return checkbox;
  }

  if (type === "custom" && typeof column.editor?.render === "function") {
    const customEditor = column.editor.render(context);
    if (customEditor && customEditor instanceof HTMLElement) {
      customEditor.classList.add("cell-editor");
      return customEditor;
    }
  }

  return null;
}

export async function startRowEditing(table, rowId, getRowFromElement, columns, isColumnEditable, resolveValue, createEditorFn, _messages) {
  const tr = table.renderRoot.querySelector(`tr[data-row-id="${rowId}"]`);
  if (!tr) return null;

  const result = getRowFromElement(tr);
  if (!result) return null;

  const { row, rowIndex } = result;
  const editableCells = [];

  for (const column of columns) {
    if (isColumnEditable(column, row, rowIndex)) {
      const td = tr.querySelector(`td[data-column-id="${column.id}"]`);
      if (td) {
        editableCells.push({ column, td });
      }
    }
  }

  if (editableCells.length === 0) return null;

  const cellEditors = [];
  const originalValues = {};

  for (const { column, td } of editableCells) {
    const currentValue = resolveValue(row, rowIndex, column);
    const editorType = column.editor?.type || (column.type === "number" ? "number" : "text");
    const editor = await createEditorFn(editorType, currentValue, column, { row, rowIndex });
    
    if (editor) {
      originalValues[column.id] = currentValue;
      cellEditors.push({ column, td, editor, originalContent: td.innerHTML });
      
      td.innerHTML = "";
      td.classList.add("editing");
      td.append(editor);
    }
  }

  return {
    rowId,
    row,
    rowIndex,
    cellEditors,
    originalValues,
  };
}

export function commitRowEditing(rowEditState) {
  if (!rowEditState) return null;

  const { cellEditors, originalValues } = rowEditState;
  const newValues = {};
  const oldValues = {};

  for (const { column, editor } of cellEditors) {
    const editorType = column.editor?.type || (column.type === "number" ? "number" : "text");
    
    let newValue;
    if (editorType === "checkbox") {
      newValue = editor.checked;
    } else if (editorType === "number") {
      newValue = editor.value === "" ? null : Number(editor.value);
    } else {
      newValue = editor.value;
    }

    newValues[column.id] = newValue;
    oldValues[column.id] = originalValues[column.id];
  }

  return { newValues, oldValues };
}

export function stopRowEditing(rowEditState) {
  if (!rowEditState) return;

  const { cellEditors } = rowEditState;
  for (const { td, originalContent } of cellEditors) {
    td.classList.remove("editing");
    td.innerHTML = originalContent;
  }
}
