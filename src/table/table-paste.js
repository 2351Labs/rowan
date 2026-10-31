import { commitExternalCell, paintCellError } from "./table-editors.js";
import { emit } from "../lib/events.js";
import { resolveMessage } from "../lib/messages.js";

const PASTE_MESSAGES = Object.freeze({
  invalidValue: "Invalid value",
  pastedCells: "Pasted {count}.",
  pasteRejected: "{count} not pasted.",
  pastePartial: "{applied} pasted, {rejected} not.",
  pasteFailed: "Paste failed.",
  nothingToPaste: "Nothing to paste.",
});

function textMessage(host, key, params) {
  return resolveMessage(host.messages, PASTE_MESSAGES, key, params);
}

function announce(host, text) {
  const status = host.root?.querySelector(".data-status");
  if (status && text) status.textContent = text;
}

function readValue(row, index, column) {
  if (typeof column.accessor === "function") return column.accessor(row, index);
  if (typeof column.accessor === "string") return row?.[column.accessor];
  return row?.[column.id];
}

function isEditable(column, row, index) {
  if (!column.editable) return false;
  return typeof column.editable !== "function" || column.editable(row, index);
}

/**
 * @param {string} text
 * @returns {string[][]}
 */
export function parseTsv(text) {
  const normalized = String(text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n$/, "");
  if (!normalized) return [];
  return normalized.split("\n").map((line) => line.split("\t"));
}

function optionValue(option) {
  return typeof option === "string" ? option : option?.value;
}

function optionLabel(option) {
  if (typeof option === "string") return option;
  return option?.label == null ? optionValue(option) : option.label;
}

function matchOption(options, text) {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  let loose = null;
  for (const option of options) {
    const value = optionValue(option);
    const label = optionLabel(option);
    if (String(value) === trimmed || String(label) === trimmed) return value;
    if (loose == null && (String(value).toLowerCase() === lower || String(label).toLowerCase() === lower)) {
      loose = value;
    }
  }
  return loose;
}

/**
 * @param {object} column
 * @param {string} text
 * @param {Record<string, unknown>} messages
 */
export function parsePasteValue(column, text, messages) {
  const type = column.editor?.type || column.type || "text";
  const invalid = () => ({
    ok: false,
    value: text,
    message: resolveMessage(messages, PASTE_MESSAGES, "invalidValue"),
  });

  if (type === "number") {
    const trimmed = text.trim().replace(/[$,]/g, "");
    if (trimmed === "") return { ok: true, value: null, message: "" };
    const value = Number(trimmed);
    if (!Number.isFinite(value)) return invalid();
    return { ok: true, value, message: "" };
  }

  if (type === "checkbox" || type === "switch") {
    const normalized = text.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(normalized)) return { ok: true, value: true, message: "" };
    if (["false", "no", "n", "0", ""].includes(normalized)) return { ok: true, value: false, message: "" };
    return invalid();
  }

  if (type === "date") {
    const trimmed = text.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return { ok: true, value: trimmed, message: "" };
    const parsed = new Date(trimmed);
    if (!trimmed || Number.isNaN(parsed.getTime())) return invalid();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return { ok: true, value: `${parsed.getFullYear()}-${month}-${day}`, message: "" };
  }

  if (type === "select") {
    const matched = matchOption(column.editor?.options || [], text);
    if (matched == null) return invalid();
    return { ok: true, value: matched, message: "" };
  }

  return { ok: true, value: text, message: "" };
}

function planTargets(host, matrix) {
  const focus = host.focus;
  const rows = host.rows.filter((entry) => entry?.row);
  const columns = host.columns;
  const rowStart = rows.findIndex((entry) => entry.rowId === focus?.rowId);
  const columnStart = columns.findIndex((column) => column.id === focus?.columnId);
  if (!focus || rowStart < 0 || columnStart < 0) return { targets: [], ignored: 0 };
  if (!isEditable(columns[columnStart], rows[rowStart].row, rows[rowStart].rowIndex)) {
    return { targets: [], ignored: 0 };
  }

  const single = matrix.length === 1 && matrix[0].length === 1;
  const selected = new Set(host.selected);
  const selectedRows = single && selected.size > 1 && selected.has(focus.rowId)
    ? rows.filter((entry) => selected.has(entry.rowId))
    : null;
  const targetRows = selectedRows || rows.slice(rowStart);
  const targets = [];
  let ignored = 0;

  if (selectedRows) {
    for (const entry of selectedRows) {
      const column = columns[columnStart];
      if (!isEditable(column, entry.row, entry.rowIndex)) continue;
      targets.push(targetFor(host, entry, column, matrix[0][0]));
    }
    return { targets, ignored };
  }

  for (let rowOffset = 0; rowOffset < matrix.length; rowOffset += 1) {
    const entry = targetRows[rowOffset];
    if (!entry) {
      ignored += matrix.length - rowOffset;
      break;
    }
    let placed = 0;
    for (let index = columnStart; index < columns.length && placed < matrix[rowOffset].length; index += 1) {
      const column = columns[index];
      if (!isEditable(column, entry.row, entry.rowIndex)) continue;
      targets.push(targetFor(host, entry, column, matrix[rowOffset][placed]));
      placed += 1;
    }
    ignored += Math.max(0, matrix[rowOffset].length - placed);
  }
  return { targets, ignored };
}

function targetFor(host, entry, column, text) {
  const parsed = parsePasteValue(column, text, host.messages);
  return {
    rowId: entry.rowId,
    columnId: column.id,
    rowIndex: entry.rowIndex,
    row: entry.row,
    column,
    text,
    value: parsed.value,
    invalid: !parsed.ok,
    message: parsed.message,
  };
}

function summarize(host, applied, rejected) {
  if (applied.length && rejected.length) {
    announce(host, textMessage(host, "pastePartial", { applied: applied.length, rejected: rejected.length }));
    return;
  }
  if (applied.length) {
    announce(host, textMessage(host, "pastedCells", { count: applied.length }));
    return;
  }
  if (rejected.length) {
    announce(host, textMessage(host, "pasteRejected", { count: rejected.length }));
    return;
  }
  announce(host, textMessage(host, "nothingToPaste"));
}

/**
 * @param {object} host
 * @param {string} text
 */
export async function pasteTable(host, text) {
  const matrix = parseTsv(text);
  if (!matrix.length) {
    announce(host, textMessage(host, "nothingToPaste"));
    return { pasted: false, applied: [], rejected: [], ignored: 0 };
  }

  const plan = planTargets(host, matrix);
  const detail = {
    rowId: host.focus?.rowId ?? null,
    columnId: host.focus?.columnId ?? null,
    matrix,
    targets: plan.targets,
    ignored: plan.ignored,
  };
  if (!plan.targets.length) {
    announce(host, textMessage(host, "nothingToPaste"));
    return { pasted: false, applied: [], rejected: [], ignored: plan.ignored, ...detail };
  }
  if (!emit(host.table, "rowan-paste", detail, { cancelable: true })) {
    return { pasted: false, prevented: true, applied: [], rejected: [], ...detail };
  }

  const applied = [];
  const rejected = [];
  const ctx = {
    table: host.table,
    messages: host.messages,
    resolveValue: readValue,
  };
  for (const target of detail.targets) {
    if (target.invalid) {
      rejected.push({
        rowId: target.rowId,
        columnId: target.columnId,
        value: target.value,
        message: target.message || resolveMessage(host.messages, PASTE_MESSAGES, "invalidValue"),
      });
      continue;
    }
    const result = commitExternalCell(ctx, target);
    const record = { rowId: target.rowId, columnId: target.columnId, value: target.value };
    if (result.ok) applied.push(record);
    else rejected.push({ ...record, message: result.message, cancelled: Boolean(result.cancelled) });
  }

  const resultDetail = {
    rowId: detail.rowId,
    columnId: detail.columnId,
    applied,
    rejected,
    ignored: detail.ignored,
  };
  const paint = () => {
    for (const item of rejected) {
      if (!item.message) continue;
      paintCellError(host.root.querySelector(`tr[data-row-id="${item.rowId}"] td[data-column-id="${item.columnId}"]`), item.message);
    }
  };
  if (applied.length) {
    // Reassigning messages marks the body dirty and renders, so pasted text replaces the cells.
    const nextMessages = host.table.messages;
    host.table.messages = nextMessages;
    await new Promise((resolve) => queueMicrotask(resolve));
  }
  paint();

  emit(host.table, "rowan-paste-result", resultDetail);
  summarize(host, applied, rejected);
  return { pasted: applied.length > 0, ...resultDetail };
}

/**
 * @param {object} host
 */
export async function pasteFromClipboard(host) {
  try {
    const text = await navigator.clipboard.readText();
    return pasteTable(host, text);
  } catch (error) {
    announce(host, textMessage(host, "pasteFailed"));
    return { pasted: false, error, applied: [], rejected: [] };
  }
}
