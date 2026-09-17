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

export function observeTableAvailability(host, tableId, onAvailable) {
  const root = host?.ownerDocument?.documentElement;

  if (!root || typeof MutationObserver === "undefined" || typeof onAvailable !== "function") {
    return () => {};
  }

  const resolveTableId =
    typeof tableId === "function" ? tableId : () => String(tableId ?? "").trim();

  const observer = new MutationObserver(() => {
    const id = String(resolveTableId() ?? "").trim();
    if (!resolveRowanTable(host, null, id)) return;

    observer.disconnect();
    onAvailable();
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["id"],
  });

  return () => observer.disconnect();
}

export function readTableSelection(table) {
  return {
    selected: Array.isArray(table?.selected) ? table.selected.map((item) => String(item)) : [],
    selectedRows: Array.isArray(table?.selectedRows) ? [...table.selectedRows] : [],
  };
}

const SELECTION_OBSERVERS = Symbol.for("rowan.tableSelectionObservers");

export function observeTableSelection(table, onChange) {
  if (!isRowanTable(table) || typeof onChange !== "function") {
    return () => {};
  }

  const controller = new AbortController();
  table.addEventListener("rowan-select", onChange, { signal: controller.signal });

  let observers = table[SELECTION_OBSERVERS];
  if (!observers) {
    observers = new Set();
    table[SELECTION_OBSERVERS] = observers;

    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(table), "selected");
    if (descriptor?.get && descriptor.set) {
      Object.defineProperty(table, "selected", {
        configurable: true,
        enumerable: true,
        get() {
          return descriptor.get.call(this);
        },
        set(value) {
          descriptor.set.call(this, value);
          for (const listener of observers) listener();
        },
      });
    }
  }

  observers.add(onChange);

  return () => {
    controller.abort();
    observers.delete(onChange);
    if (observers.size === 0) {
      delete table.selected;
      delete table[SELECTION_OBSERVERS];
    }
  };
}
