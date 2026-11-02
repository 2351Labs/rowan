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
const COLUMN_LISTENERS = Symbol.for("rowan.tableColumnListeners");
const COLUMNS_PATCHED = Symbol.for("rowan.tableColumnsPatched");
const COLUMN_TRAP = Symbol.for("rowan.tableColumnTrap");

function notifyColumnListeners(table) {
  const listeners = table?.[COLUMN_LISTENERS];
  if (!listeners) return;
  for (const listener of listeners) listener();
}

function patchTableColumns(proto) {
  if (!proto || proto[COLUMNS_PATCHED]) return Boolean(proto?.[COLUMNS_PATCHED]);

  const descriptor = Object.getOwnPropertyDescriptor(proto, "columns");
  if (typeof descriptor?.get !== "function" || typeof descriptor?.set !== "function") return false;

  const originalSet = descriptor.set;
  Object.defineProperty(proto, "columns", {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      originalSet.call(this, value);
      notifyColumnListeners(this);
    },
  });
  proto[COLUMNS_PATCHED] = true;
  return true;
}

function installColumnPatch() {
  const ctor = customElements.get("rowan-table");
  return ctor ? patchTableColumns(ctor.prototype) : false;
}

function installColumnTrap(table) {
  const current = Object.getOwnPropertyDescriptor(table, "columns");
  if (current?.set?.[COLUMN_TRAP]) return;

  let stored = current && "value" in current ? current.value : undefined;
  const set = (value) => {
    stored = value;
    notifyColumnListeners(table);
  };
  set[COLUMN_TRAP] = true;
  Object.defineProperty(table, "columns", {
    configurable: true,
    enumerable: true,
    get() {
      return stored;
    },
    set,
  });
}

function releaseColumnTrap(table) {
  const current = Object.getOwnPropertyDescriptor(table, "columns");
  if (!current?.set?.[COLUMN_TRAP]) return;

  const value = table.columns;
  delete table.columns;
  if (value !== undefined) table.columns = value;
}

/**
 * Notifies when `columns` is assigned or replaced.
 * Before `rowan-table` is defined, assignments are trapped.
 * After upgrade, the prototype setter reports later replacements,
 * including column-menu hide and show.
 */
export function observeTableColumns(table, onChange) {
  if (!isRowanTable(table) || typeof onChange !== "function") {
    return () => {};
  }

  let listeners = table[COLUMN_LISTENERS];
  if (!listeners) {
    listeners = new Set();
    table[COLUMN_LISTENERS] = listeners;
  }
  listeners.add(onChange);

  if (!installColumnPatch()) {
    installColumnTrap(table);
    customElements.whenDefined("rowan-table").then(() => {
      if (!table[COLUMN_LISTENERS]?.has(onChange)) return;
      installColumnPatch();
      notifyColumnListeners(table);
    });
  }

  return () => {
    const current = table[COLUMN_LISTENERS];
    current?.delete(onChange);
    if (current && current.size === 0) {
      delete table[COLUMN_LISTENERS];
      releaseColumnTrap(table);
    }
  };
}

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
