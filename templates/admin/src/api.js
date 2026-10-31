import { createModel } from "./fixtures.js";

const LATENCY_MS = 320;
const FILTER_SEPARATOR = "\u001f";

export function createStore() {
  const model = createModel();
  return {
    customers: model.customers,
    orders: model.orders,
    notifications: model.notifications.map((item) => ({ ...item })),
    locations: model.locations,
    layers: model.layers.map((layer) => ({ ...layer })),
  };
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function compare(left, right) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), "en", { numeric: true, sensitivity: "base" });
}

function matchOperator(cell, operator, value, numeric) {
  const text = cell == null ? "" : String(cell);
  const needle = String(value ?? "").trim();
  const lower = text.toLowerCase();
  const query = needle.toLowerCase();

  if (operator === "is-empty") return text.trim() === "";
  if (operator === "is-not-empty") return text.trim() !== "";
  if (!needle) return true;
  if (operator === "contains") return lower.includes(query);
  if (operator === "starts-with") return lower.startsWith(query);
  if (operator === "ends-with") return lower.endsWith(query);

  if (numeric || operator.includes("greater") || operator.includes("less")) {
    const left = Number(cell);
    const right = Number(needle);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
    if (operator === "equals") return left === right;
    if (operator === "not-equals") return left !== right;
    if (operator === "greater-than") return left > right;
    if (operator === "greater-than-or-equal") return left >= right;
    if (operator === "less-than") return left < right;
    if (operator === "less-than-or-equal") return left <= right;
  }

  if (operator === "equals") return lower === query;
  if (operator === "not-equals") return lower !== query;
  if (operator === "greater-than") return text > needle;
  if (operator === "greater-than-or-equal") return text >= needle;
  if (operator === "less-than") return text < needle;
  if (operator === "less-than-or-equal") return text <= needle;
  return lower.includes(query);
}

export function applyRowFilters(rows, filters, { searchKeys }) {
  return rows.filter((row) =>
    filters.every((filter) => {
      const raw = String(filter?.value ?? "");
      if (filter?.id === "q") {
        const needle = raw.trim().toLowerCase();
        if (!needle) return true;
        return searchKeys.some((key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(needle),
        );
      }

      if (!raw.includes(FILTER_SEPARATOR)) {
        if (!raw || raw === "all") return true;
        return String(row[filter.id] ?? "") === raw;
      }

      const splitAt = raw.indexOf(FILTER_SEPARATOR);
      const operator = raw.slice(0, splitAt);
      const value = raw.slice(splitAt + FILTER_SEPARATOR.length);
      const numeric = typeof row[filter.id] === "number";
      return matchOperator(row[filter.id], operator, value, numeric);
    }),
  );
}

export async function queryCollection(rows, request, { searchKeys, fail = false } = {}) {
  const { page = 0, pageSize = 8, sort = null, filters = [], signal } = request;
  await wait(LATENCY_MS, signal);

  if (fail) {
    throw new Error("The sample service did not respond. Retry the request.");
  }

  let result = applyRowFilters(rows, filters, { searchKeys });

  if (sort?.id) {
    const direction = sort.dir === "desc" ? -1 : 1;
    result = result
      .slice()
      .sort((left, right) => compare(left[sort.id], right[sort.id]) * direction);
  }

  const start = Math.max(0, page) * pageSize;
  return {
    rows: result.slice(start, start + pageSize),
    total: result.length,
    all: result,
  };
}

export function queryOrders(store, request, options = {}) {
  return queryCollection(store.orders, request, {
    searchKeys: ["number", "customer", "city", "assignee", "note", "channel"],
    ...options,
  });
}

export function queryCustomers(store, request, options = {}) {
  return queryCollection(store.customers, request, {
    searchKeys: ["name", "contact", "email", "city", "region", "plan"],
    ...options,
  });
}

export function findOrder(store, id) {
  return store.orders.find((order) => order.id === id) || null;
}

export function findCustomer(store, id) {
  return store.customers.find((customer) => customer.id === id) || null;
}

export function customerOrders(store, customerId) {
  return store.orders.filter((order) => order.customerId === customerId);
}

export function addOrder(store, draft) {
  const number = store.orders.reduce((max, order) => Math.max(max, order.number), 4800) + 1;
  const customer = findCustomer(store, draft.customerId);
  const price = Math.max(0, Number(draft.total) || 0);
  const order = {
    id: `ord-${number}`,
    number,
    customerId: customer?.id || draft.customerId,
    customer: customer?.name || "Unknown account",
    contact: customer?.contact || "",
    email: customer?.email || "",
    placed: "2026-10-31",
    channel: draft.channel || "Web",
    status: "paid",
    items: 1,
    total: price,
    assignee: "Maya Chen",
    note: draft.note || "",
    city: customer?.city || "",
    region: customer?.region || "",
    priority: price >= 1800 ? "rush" : "standard",
    lines: [
      {
        id: `manual-${number}`,
        sku: "LN-MANUAL",
        name: "Manual order line",
        category: "Furniture",
        price,
        qty: 1,
      },
    ],
    shipping: {
      recipient: customer?.contact || "",
      line1: "",
      city: customer?.city || "",
      region: customer?.region || "",
      postal: customer?.postal || "",
      phone: customer?.phone || "",
      speed: "ground",
      signature: false,
    },
    comments: draft.note
      ? [{ id: `note-${number}`, author: "Maya Chen", at: "2026-10-31", body: draft.note }]
      : [],
  };

  store.orders.unshift(order);
  if (customer) {
    customer.orders += 1;
    customer.lifetime += price;
  }
  return order;
}

export function refreshCustomerStats(store, customerId) {
  const customer = findCustomer(store, customerId);
  if (!customer) return;
  const mine = customerOrders(store, customerId);
  customer.orders = mine.length;
  customer.lifetime = mine
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);
}

export function holdCount(store) {
  return store.orders.filter((order) => order.status === "hold").length;
}

export { FILTER_SEPARATOR };
