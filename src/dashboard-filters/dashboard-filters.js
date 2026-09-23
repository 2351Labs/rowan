/**
 * @typedef {Record<string, unknown>} RowanDashboardFilterSnapshot
 */

/**
 * @typedef {object} RowanDashboardFilters
 * @property {(key: string) => unknown} get
 * @property {(key: string, value: unknown) => void} set
 * @property {(key?: string) => void} clear
 * @property {(snapshot: RowanDashboardFilterSnapshot) => void} replace
 * @property {(listener: (snapshot: RowanDashboardFilterSnapshot) => void) => () => void} subscribe
 * @property {() => RowanDashboardFilterSnapshot} snapshot
 */

function normalizeKey(key) {
  return String(key ?? "").trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assignEntries(store, record) {
  if (!isPlainObject(record)) return;
  for (const [key, value] of Object.entries(record)) {
    const id = normalizeKey(key);
    if (!id) continue;
    store.set(id, value);
  }
}

/**
 * In-memory dashboard filter session. Apps subscribe and apply values to
 * tables and charts. Hosts do not auto-subscribe. `snapshot()` is a shallow
 * copy for deep links; writing the URL stays the app's concern.
 *
 * @param {RowanDashboardFilterSnapshot} [initial]
 * @returns {RowanDashboardFilters}
 */
export function createDashboardFilters(initial = {}) {
  /** @type {Map<string, unknown>} */
  const values = new Map();
  /** @type {Set<(snapshot: RowanDashboardFilterSnapshot) => void>} */
  const listeners = new Set();

  assignEntries(values, initial);

  function snapshot() {
    return Object.fromEntries(values);
  }

  function notify() {
    const current = snapshot();
    for (const listener of listeners) listener(current);
  }

  return {
    get(key) {
      return values.get(normalizeKey(key));
    },

    set(key, value) {
      const id = normalizeKey(key);
      if (!id) return;
      values.set(id, value);
      notify();
    },

    clear(key) {
      if (key == null || key === "") {
        if (values.size === 0) return;
        values.clear();
        notify();
        return;
      }

      const id = normalizeKey(key);
      if (!values.has(id)) return;
      values.delete(id);
      notify();
    },

    replace(record) {
      values.clear();
      assignEntries(values, record);
      notify();
    },

    subscribe(listener) {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    snapshot,
  };
}
