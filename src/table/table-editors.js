import { resolveMessage } from "../lib/messages.js";

const DEFAULT_MESSAGES = Object.freeze({
  editCell: "Edit cell",
});

export async function createEditor(type, value, column, context, messages) {
  if (type === "select") {
    await import("../select/select.js");
    const select = document.createElement("rowan-select");
    select.value = value ?? "";
    select.className = "cell-editor";
    select.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    
    const options = column.editor?.options || [];
    options.forEach(({ value: optValue, label }) => {
      const option = document.createElement("option");
      option.value = optValue;
      option.textContent = label;
      select.appendChild(option);
    });

    return select;
  }

  if (type === "date") {
    await import("../date-picker/date-picker.js");
    const datePicker = document.createElement("rowan-date-picker");
    datePicker.value = value ?? "";
    datePicker.className = "cell-editor";
    datePicker.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    return datePicker;
  }

  if (type === "checkbox") {
    await import("../checkbox/checkbox.js");
    const checkbox = document.createElement("rowan-checkbox");
    checkbox.checked = Boolean(value);
    checkbox.className = "cell-editor";
    checkbox.setAttribute("aria-label", resolveMessage(messages, DEFAULT_MESSAGES, "editCell"));
    return checkbox;
  }

  if (type === "custom" && typeof column.editor?.render === "function") {
    const customEditor = column.editor.render(context);
    if (customEditor && customEditor instanceof HTMLElement) {
      customEditor.className = "cell-editor";
      return customEditor;
    }
  }

  return null;
}
