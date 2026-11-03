import { expect } from "@esm-bundle/chai";

import "../bar-chart/bar-chart.js";
import "../donut-chart/donut-chart.js";
import "../filter-builder/filter-builder.js";
import "../select/select.js";
import "../table/table.js";
import { createDashboard as createDashboardFromReact } from "../react/dashboard.js";
import { createDashboard } from "./dashboard.js";

const nextMicrotask = () => Promise.resolve();

const ROWS = [
  { id: "w1", week: "Sep 7", channel: "Wholesale", orders: 46 },
  { id: "w2", week: "Sep 7", channel: "Web", orders: 28 },
  { id: "w3", week: "Sep 14", channel: "Wholesale", orders: 42 },
  { id: "w4", week: "Sep 14", channel: "Web", orders: 31 },
];

const FIELDS = [
  { id: "week", label: "Week", type: "select", options: ["Sep 7", "Sep 14"] },
  {
    id: "channel",
    label: "Channel",
    type: "select",
    options: [
      { value: "Wholesale", label: "Wholesale" },
      { value: "Web", label: "Web" },
    ],
  },
  { id: "orders", label: "Orders", type: "number" },
];

function createMemoryWindow(href = "https://harbor.example/orders?keep=1") {
  let current = new URL(href);
  const stack = [{ href: current.href, state: null }];
  let index = 0;
  const listeners = new Set();

  function apply(url, state, mode) {
    current = new URL(url, current);
    if (mode === "push") {
      stack.splice(index + 1);
      stack.push({ href: current.href, state });
      index += 1;
      return;
    }
    stack[index] = { href: current.href, state };
  }

  function go(delta) {
    const next = index + delta;
    if (next < 0 || next >= stack.length) return false;
    index = next;
    current = new URL(stack[index].href);
    const event = new PopStateEvent("popstate", { state: stack[index].state });
    for (const listener of [...listeners]) listener(event);
    return true;
  }

  return {
    location: {
      get href() {
        return current.href;
      },
    },
    history: {
      pushState(state, _title, url) {
        apply(url, state, "push");
      },
      replaceState(state, _title, url) {
        apply(url, state, "replace");
      },
      back() {
        return go(-1);
      },
      forward() {
        return go(1);
      },
      get length() {
        return stack.length;
      },
    },
    addEventListener(type, listener) {
      if (type === "popstate") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      listeners.delete(listener);
    },
  };
}

function columns() {
  return [
    { id: "week", header: "Week" },
    { id: "channel", header: "Channel" },
    { id: "orders", header: "Orders", type: "number" },
  ];
}

function mountTable(rows = ROWS) {
  const table = document.createElement("rowan-table");
  table.config = { columns: columns(), rows };
  return table;
}

async function mountChart(tag, props) {
  const chart = document.createElement(tag);
  chart.label = props.label;
  chart.interactive = true;
  chart.labels = props.labels;
  chart.series = props.series;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

function pointButton(chart) {
  return chart.shadowRoot.querySelector("button[data-point-key]");
}

async function waitFor(check) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > 2000) throw new Error("timed out waiting for dashboard table");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

describe("createDashboard", () => {
  /** @type {Array<{ destroy: () => void }>} */
  const sessions = [];

  function open(options) {
    const session = createDashboard(options);
    sessions.push(session);
    return session;
  }

  afterEach(() => {
    for (const session of sessions) session.destroy();
    sessions.length = 0;
    document.body.innerHTML = "";
  });

  it("re-exports the same function from the React entry", () => {
    expect(createDashboardFromReact).to.equal(createDashboard);
  });

  it("filters the client table, toggles chart clicks, and restores rows", async () => {
    const root = document.createElement("div");
    const table = mountTable();
    const bar = await mountChart("rowan-bar-chart", {
      label: "Orders by week",
      labels: ["Sep 7", "Sep 14"],
      series: [{ id: "orders", label: "Orders", values: [74, 73] }],
    });
    bar.setAttribute("data-dashboard-field", "week");
    const donut = await mountChart("rowan-donut-chart", {
      label: "Orders by channel",
      labels: ["Wholesale", "Web"],
      series: [{ id: "channels", label: "Channels", values: [88, 59] }],
    });
    root.append(bar, donut, table);
    document.body.append(root);

    const seen = [];
    const events = [];
    root.addEventListener("rowan-dashboard-change", (event) => {
      events.push(["change", event.detail.source, event.detail.filters.map((item) => item.value)]);
    });
    root.addEventListener("rowan-dashboard-clear", (event) => {
      events.push(["clear", event.detail.source]);
    });

    const dashboard = open({
      root,
      url: false,
      fields: FIELDS,
      charts: [bar, { element: donut, field: "channel", value: "label" }],
      table,
    });
    const stop = dashboard.subscribe((filters) => seen.push(filters.map((item) => item.field)));
    expect(table.rows).to.have.length(4);
    expect(root.querySelector("[data-dashboard-chips]")).to.equal(null);

    const weekButton = pointButton(bar);
    weekButton.focus();
    expect(bar.shadowRoot.activeElement).to.equal(weekButton);
    weekButton.click();
    await nextMicrotask();

    expect(dashboard.get("week")).to.equal("Sep 7");
    expect(table.rows.map((row) => row.id)).to.deep.equal(["w1", "w2"]);
    expect(root.querySelector("[data-dashboard-chips]").textContent).to.include("Week is Sep 7");
    const remove = root.querySelector("[data-dashboard-remove]");
    expect(remove.tagName).to.equal("BUTTON");
    expect(remove.getAttribute("aria-label")).to.equal("Remove Week is Sep 7");

    pointButton(donut).click();
    await nextMicrotask();
    expect(dashboard.get("channel")).to.equal("Wholesale");
    expect(table.rows.map((row) => row.id)).to.deep.equal(["w1"]);

    pointButton(bar).click();
    await nextMicrotask();
    expect(dashboard.get("week")).to.equal(undefined);
    expect(table.rows.map((row) => row.id)).to.deep.equal(["w1", "w3"]);

    root.querySelector("[data-dashboard-clear]").click();
    expect(dashboard.snapshot()).to.deep.equal([]);
    expect(table.rows).to.have.length(4);
    expect(events.some((event) => event[0] === "clear" && event[1] === "clear")).to.equal(true);
    expect(seen[0]).to.deep.equal(["week"]);
    stop();
    dashboard.set("channel", "Web");
    expect(seen).to.have.length(4);
  });

  it("round-trips the query string, groups, and back/forward", () => {
    const view = createMemoryWindow();
    const dashboard = open({
      url: { window: view, param: "df" },
      filters: [{ field: "channel", operator: "equals", value: "Web" }],
    });
    expect(dashboard.get("channel")).to.equal("Web");
    expect(view.location.href).to.include("keep=1");
    expect(view.location.href).to.include("channel~equals~Web");
    expect(view.history.length).to.equal(1);

    dashboard.set("week", "Sep 7");
    expect(view.history.length).to.equal(2);
    expect(dashboard.search()).to.include("week~equals~Sep%207");

    view.history.back();
    expect(dashboard.get("week")).to.equal(undefined);
    expect(dashboard.get("channel")).to.equal("Web");
    expect(view.location.href).to.include("keep=1");

    view.history.forward();
    expect(dashboard.get("week")).to.equal("Sep 7");
    expect(dashboard.snapshot().map((item) => item.field)).to.deep.equal(["channel", "week"]);

    dashboard.set("code", "a~b%");
    const encoded = dashboard.search();
    dashboard.destroy();
    const restored = open({
      url: { window: createMemoryWindow(`https://harbor.example/orders${encoded}&keep=1`) },
    });
    expect(restored.get("code")).to.equal("a~b%");
    expect(restored.get("week")).to.equal("Sep 7");

    restored.replace([
      {
        join: "or",
        filters: [
          { field: "channel", operator: "equals", value: "Web" },
          { field: "channel", operator: "equals", value: "Wholesale" },
        ],
      },
    ]);
    expect(restored.search()).to.include("json%3A");
    const grouped = open({
      url: {
        window: createMemoryWindow(`https://harbor.example/orders${restored.search()}`),
      },
    });
    expect(grouped.snapshot()[0].join).to.equal("or");
    expect(grouped.snapshot()[0].filters).to.have.length(2);

    const blank = open({
      url: {
        window: createMemoryWindow("https://harbor.example/orders?df=%%%&df=week~equals~Sep%207"),
      },
    });
    expect(blank.get("week")).to.equal("Sep 7");

    const broken = open({
      url: { window: createMemoryWindow("https://harbor.example/orders?df=json%3Anot-json") },
    });
    expect(broken.snapshot()).to.deep.equal([]);
  });

  it("uses replace history without adding entries and lets the URL win", () => {
    const view = createMemoryWindow("https://harbor.example/orders?df=week~equals~Sep%207&keep=1");
    const dashboard = open({
      filters: [{ field: "channel", operator: "equals", value: "Web" }],
      url: { window: view, history: "replace" },
    });
    expect(dashboard.get("week")).to.equal("Sep 7");
    expect(dashboard.get("channel")).to.equal(undefined);
    dashboard.set("channel", "Wholesale");
    dashboard.toggle("week", "Sep 14");
    expect(view.history.length).to.equal(1);
    expect(view.location.href).to.include("keep=1");
    expect(dashboard.get("week")).to.equal("Sep 14");
    expect(dashboard.get("channel")).to.equal("Wholesale");
    dashboard.toggle("week", "Sep 14");
    expect(dashboard.get("week")).to.equal(undefined);
  });

  it("follows the real session history", async () => {
    const start = `${location.pathname}${location.search}${location.hash}`;
    const root = document.createElement("div");
    document.body.append(root);
    const dashboard = open({ root, url: { param: "rkdf" }, chips: false });
    try {
      dashboard.set("week", "Sep 7");
      expect(location.search).to.include("rkdf=");
      expect(dashboard.get("week")).to.equal("Sep 7");

      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("back did not pop")), 2000);
        window.addEventListener(
          "popstate",
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
        history.back();
      });
      expect(dashboard.get("week")).to.equal(undefined);

      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("forward did not pop")), 2000);
        window.addEventListener(
          "popstate",
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
        history.forward();
      });
      expect(dashboard.get("week")).to.equal("Sep 7");
    } finally {
      dashboard.destroy();
      history.replaceState(null, "", start);
    }
  });

  it("syncs a filter builder, chips, and a server table", async () => {
    const root = document.createElement("div");
    const builder = document.createElement("rowan-filter-builder");
    builder.fields = FIELDS;
    builder.filters = [{ field: "channel", operator: "equals", value: "Web" }];
    const table = document.createElement("rowan-table");
    table.setAttribute("id", "orders");
    table.dataMode = "server";
    table.config = {
      columns: columns(),
      page: { index: 0, size: 10 },
    };
    const calls = [];
    table.dataSource = {
      debounce: 0,
      getRows(query) {
        calls.push(query.filters.map((filter) => ({ ...filter })));
        const rows = ROWS.filter((row) =>
          query.filters.every((filter) => !filter.field || row[filter.field] === filter.value),
        );
        return Promise.resolve({ rows, total: rows.length });
      },
    };
    builder.setAttribute("for-table", "orders");
    root.append(builder, table);
    document.body.append(root);
    await nextMicrotask();
    await nextMicrotask();

    const events = [];
    root.addEventListener("rowan-dashboard-change", (event) => events.push(event.detail.source));
    const dashboard = open({ root, filters: builder, table, url: false, chips: true });
    expect(dashboard.get("channel")).to.equal("Web");

    table.filters = [{ id: "week", value: "Sep" }, ...table.filters];
    dashboard.set("week", "Sep 7");
    await waitFor(() =>
      calls.some(
        (filters) =>
          filters.some((filter) => filter.id === "week" && filter.value === "Sep") &&
          filters.some((filter) => filter.field === "week" && filter.value === "Sep 7") &&
          filters.some((filter) => filter.field === "channel" && filter.value === "Web"),
      ),
    );

    builder.dispatchEvent(
      new CustomEvent("rowan-filter-change", {
        bubbles: true,
        detail: {
          filters: [{ field: "week", operator: "equals", value: "Sep 14" }],
        },
      }),
    );
    await nextMicrotask();
    expect(dashboard.get("week")).to.equal("Sep 14");
    expect(dashboard.get("channel")).to.equal(undefined);
    expect(events).to.include("filter");

    dashboard.replace([
      { field: "orders", operator: "greater-than", value: 40 },
      { field: "week", operator: "is-empty", value: "" },
    ]);
    expect(builder.filters.map((filter) => filter.operator)).to.deep.equal([
      "greater-than",
      "is-empty",
    ]);
    expect(root.textContent).to.include("Orders is greater than 40");
    expect(root.textContent).to.include("Week is empty");

    dashboard.clear("orders");
    expect(dashboard.snapshot().map((item) => item.operator)).to.deep.equal(["is-empty"]);
    dashboard.clear();
    expect(dashboard.snapshot()).to.deep.equal([]);
    await waitFor(() => calls.length > 0 && calls.at(-1).every((filter) => !filter.field));
  });

  it("keeps client rows correct when the builder also publishes to the table", async () => {
    const root = document.createElement("div");
    const builder = document.createElement("rowan-filter-builder");
    builder.fields = FIELDS;
    builder.setAttribute("for-table", "orders");
    const table = mountTable();
    table.id = "orders";
    const bar = await mountChart("rowan-bar-chart", {
      label: "Orders by week",
      labels: ["Sep 7", "Sep 14"],
      series: [{ id: "orders", label: "Orders", values: [74, 73] }],
    });
    root.append(builder, bar, table);
    document.body.append(root);
    await nextMicrotask();
    await nextMicrotask();

    const dashboard = open({
      root,
      filters: builder,
      charts: [{ element: bar, field: "week" }],
      table,
      url: false,
      chips: false,
    });
    pointButton(bar).click();
    await nextMicrotask();
    await nextMicrotask();
    expect(table.rows.map((row) => row.week)).to.deep.equal(["Sep 7", "Sep 7"]);
    dashboard.clear();
    await nextMicrotask();
    expect(table.rows).to.have.length(4);
    dashboard.destroy();
    expect(table.rows).to.have.length(4);
    dashboard.destroy();
  });

  it("discovers controls and writes chart choices back", async () => {
    const root = document.createElement("div");
    const select = document.createElement("rowan-select");
    select.label = "Channel";
    select.setAttribute("data-dashboard-field", "channel");
    select.options = [
      { value: "", label: "Any" },
      { value: "Wholesale", label: "Wholesale" },
      { value: "Web", label: "Web" },
    ];
    const chart = document.createElement("div");
    chart.setAttribute("data-dashboard-chart", "");
    chart.setAttribute("data-dashboard-field", "channel");
    chart.setAttribute("data-dashboard-value", "seriesLabel");
    const table = mountTable();
    root.append(select, chart, table);
    document.body.append(root);
    await nextMicrotask();
    await nextMicrotask();

    const probe = { value: "pending" };
    const custom = document.createElement("div");
    root.append(custom);
    const dashboard = open({
      root,
      url: false,
      table: null,
      controls: [
        { element: select, field: "channel" },
        {
          element: custom,
          field: "week",
          event: "pick",
          read: () => "Sep 14",
          write(value) {
            probe.value = value;
          },
        },
      ],
    });

    chart.dispatchEvent(
      new CustomEvent("rowan-point-activate", {
        detail: { label: "ignored", seriesLabel: "Web" },
      }),
    );
    expect(dashboard.get("channel")).to.equal("Web");
    expect(select.value).to.equal("Web");

    select.renderRoot.querySelector("select").value = "Wholesale";
    select.renderRoot.querySelector("select").dispatchEvent(new Event("change", { bubbles: true }));
    expect(dashboard.get("channel")).to.equal("Wholesale");

    custom.dispatchEvent(new CustomEvent("pick"));
    expect(dashboard.get("week")).to.equal("Sep 14");
    dashboard.clear("week");
    expect(probe.value).to.equal("");
    expect(table.rows).to.have.length(4);

    chart.dispatchEvent(new CustomEvent("rowan-point-activate", { detail: { seriesLabel: "" } }));
    expect(dashboard.get("channel")).to.equal("Wholesale");

    const slot = document.createElement("div");
    const slotted = open({
      chips: slot,
      messages: { clear: "Reset Harbor", chip: "{field} = {value}", groupOr: "Either {count}" },
      fields: FIELDS,
    });
    slotted.replace([
      {
        join: "or",
        filters: [
          { field: "channel", operator: "equals", value: "Web" },
          { field: "channel", operator: "equals", value: "Wholesale" },
        ],
      },
    ]);
    expect(slot.textContent).to.include("Either 2");
    expect(slot.querySelector("[data-dashboard-clear]").textContent).to.equal("Reset Harbor");
    slot.querySelector("[data-dashboard-remove]").click();
    expect(slotted.snapshot()).to.deep.equal([]);
  });

  it("replaces source rows, ignores blank keys, and skips repeat notifications", () => {
    const table = mountTable();
    document.body.append(table);
    const seen = [];
    const root = document.createElement("div");
    document.body.append(root);
    const dashboard = open({
      table,
      rows: [ROWS[0], ROWS[2]],
      url: false,
      chips: false,
      root,
    });
    dashboard.subscribe((filters) => seen.push(filters.length));
    dashboard.subscribe("nope");
    expect(table.rows).to.have.length(2);

    dashboard.set("week", "Sep 7");
    dashboard.set("week", "Sep 7");
    dashboard.set("  ", "nope");
    dashboard.toggle("week", "");
    dashboard.clear("missing");
    expect(seen).to.deep.equal([1]);
    expect(table.rows).to.have.length(1);

    dashboard.setRows([
      { id: "n1", week: "Sep 7", channel: "Web", orders: 1 },
      { id: "n2", week: "Sep 21", channel: "Web", orders: 2 },
    ]);
    expect(table.rows.map((row) => row.id)).to.deep.equal(["n1"]);
    dashboard.replace(null);
    expect(dashboard.snapshot()).to.deep.equal([]);
    expect(table.rows).to.have.length(2);

    dashboard.replace([{ field: "week", operator: "contains", value: "Sep" }]);
    dashboard.toggle("week", "Sep 21");
    expect(dashboard.snapshot()).to.deep.equal([
      { field: "week", operator: "equals", value: "Sep 21" },
    ]);
    dashboard.replace([
      { join: "and", filters: [{ field: "channel", operator: "equals", value: "Web" }] },
      { field: "week", operator: "equals", value: "Sep 7" },
    ]);
    dashboard.toggle("week", "Sep 14");
    expect(dashboard.snapshot()[0].join).to.equal("and");
    expect(dashboard.get("week")).to.equal("Sep 14");
  });

  it("does not read the page URL unless url is enabled", () => {
    const dashboard = open({
      filters: [{ field: "week", operator: "equals", value: "Sep 7" }],
    });
    expect(dashboard.get("week")).to.equal("Sep 7");
    expect(dashboard.search()).to.include("week~equals~Sep%207");
    expect(location.search).to.not.include("week~equals");
  });
});
