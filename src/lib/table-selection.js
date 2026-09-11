export function isRowanTable(value) {
  return value instanceof HTMLElement && value.localName === "rowan-table";
}

export function resolveRowanTable(host, table, tableId) {
  if (isRowanTable(table)) return table;

  if (tableId) {
    const referenced = host.ownerDocument?.getElementById(tableId);
    return isRowanTable(referenced) ? referenced : null;
  }

  const ancestor = host.closest("rowan-table");
  return isRowanTable(ancestor) ? ancestor : null;
}

export function readTableSelection(table) {
  return {
    selected: Array.isArray(table?.selected) ? table.selected.map((item) => String(item)) : [],
    selectedRows: Array.isArray(table?.selectedRows) ? [...table.selectedRows] : [],
  };
}

export function observeTableSelection(table, onChange) {
  if (!isRowanTable(table) || typeof onChange !== "function") {
    return () => {};
  }

  const controller = new AbortController();
  table.addEventListener("rowan-select", onChange, { signal: controller.signal });

  const observer =
    table.shadowRoot && typeof MutationObserver !== "undefined"
      ? new MutationObserver(onChange)
      : null;

  observer?.observe(table.shadowRoot, { childList: true, subtree: true });

  return () => {
    controller.abort();
    observer?.disconnect();
  };
}
