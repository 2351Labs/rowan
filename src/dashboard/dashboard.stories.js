import { createDashboard } from "./dashboard.js";
import { applyFilters } from "../filter-builder/apply-filters.js";
import "../filter-builder/filter-builder.js";
import "../bar-chart/bar-chart.js";
import "../donut-chart/donut-chart.js";
import "../select/select.js";
import "../table/table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "sep7-wholesale", week: "Sep 7", channel: "Wholesale", orders: 46, revenue: 42000 },
  { id: "sep7-web", week: "Sep 7", channel: "Web", orders: 28, revenue: 18200 },
  { id: "sep7-showroom", week: "Sep 7", channel: "Showroom", orders: 8, revenue: 6400 },
  { id: "sep14-wholesale", week: "Sep 14", channel: "Wholesale", orders: 42, revenue: 38600 },
  { id: "sep14-web", week: "Sep 14", channel: "Web", orders: 31, revenue: 19600 },
  { id: "sep14-showroom", week: "Sep 14", channel: "Showroom", orders: 9, revenue: 7200 },
  { id: "sep21-wholesale", week: "Sep 21", channel: "Wholesale", orders: 51, revenue: 45200 },
  { id: "sep21-web", week: "Sep 21", channel: "Web", orders: 26, revenue: 17400 },
  { id: "sep21-showroom", week: "Sep 21", channel: "Showroom", orders: 7, revenue: 5800 },
];

const WEEKS = ["Sep 7", "Sep 14", "Sep 21"];
const CHANNELS = ["Wholesale", "Web", "Showroom"];

const FIELDS = [
  { id: "week", label: "Week", type: "select", options: WEEKS },
  { id: "channel", label: "Channel", type: "select", options: CHANNELS },
  { id: "orders", label: "Orders", type: "number" },
];

function stack(root) {
  root.style.display = "grid";
  root.style.gap = "var(--rowan-space-4, 1rem)";
  return root;
}

function log(title) {
  const list = document.createElement("ol");
  list.style.font = "var(--rowan-font-size-sm, 0.875rem) ui-sans-serif, system-ui, sans-serif";
  list.style.margin = "0";
  list.style.paddingInlineStart = "1.25rem";
  const heading = document.createElement("p");
  heading.textContent = title;
  heading.style.margin = "0";
  return {
    heading,
    list,
    push(text) {
      const item = document.createElement("li");
      item.textContent = text;
      list.prepend(item);
      while (list.children.length > 6) list.lastElementChild.remove();
    },
  };
}

function tableOf(rows, extra = {}) {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Harbor orders",
    columns: [
      { id: "week", header: "Week" },
      { id: "channel", header: "Channel" },
      { id: "orders", header: "Orders", type: "number", align: "end" },
      {
        id: "revenue",
        header: "Revenue",
        type: "number",
        align: "end",
        format: (value) => `$${Number(value).toLocaleString("en-US")}`,
      },
    ],
    rows,
    ...extra,
  };
  return table;
}

function barChart() {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = "Orders by week";
  chart.interactive = true;
  chart.labels = WEEKS;
  chart.series = [
    {
      id: "orders",
      label: "Orders",
      values: WEEKS.map((week) =>
        ROWS.filter((row) => row.week === week).reduce((total, row) => total + row.orders, 0),
      ),
    },
  ];
  chart.setAttribute("data-dashboard-field", "week");
  return chart;
}

function donutChart() {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = "Orders by channel";
  chart.interactive = true;
  chart.labels = CHANNELS;
  chart.series = [
    {
      id: "channels",
      label: "Channels",
      values: CHANNELS.map((channel) =>
        ROWS.filter((row) => row.channel === channel).reduce((total, row) => total + row.orders, 0),
      ),
    },
  ];
  chart.setAttribute("data-dashboard-field", "channel");
  return chart;
}

function builder() {
  const filters = document.createElement("rowan-filter-builder");
  filters.label = "Harbor filters";
  filters.fields = FIELDS;
  return filters;
}

function releaseLater(root, dashboard) {
  const observer = new MutationObserver(() => {
    if (!root.isConnected) {
      dashboard.destroy();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function memoryWindow(href = "https://harbor.example/orders") {
  let current = new URL(href);
  const stack = [{ href: current.href }];
  let index = 0;
  const listeners = new Set();
  const view = {
    location: {
      get href() {
        return current.href;
      },
    },
    history: {
      pushState(_state, _title, url) {
        current = new URL(url, current);
        stack.splice(index + 1);
        stack.push({ href: current.href });
        index += 1;
      },
      replaceState(_state, _title, url) {
        current = new URL(url, current);
        stack[index] = { href: current.href };
      },
      back() {
        if (index === 0) return;
        index -= 1;
        current = new URL(stack[index].href);
        for (const listener of [...listeners]) listener(new PopStateEvent("popstate"));
      },
      forward() {
        if (index >= stack.length - 1) return;
        index += 1;
        current = new URL(stack[index].href);
        for (const listener of [...listeners]) listener(new PopStateEvent("popstate"));
      },
      get length() {
        return stack.length;
      },
      get index() {
        return index;
      },
    },
    addEventListener(type, listener) {
      if (type === "popstate") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      listeners.delete(listener);
    },
  };
  return view;
}

export default {
  title: "Workflows/Dashboard",
};

export const CrossFilter = {
  name: "Cross-filter",
  parameters: createEventScriptParameters({
    steps: [
      "Activate a week bar. The table keeps that week, a chip appears, and rowan-dashboard-change reports source chart.",
      "Activate a channel slice. Both filters apply. Activate the same slice again to clear just that field.",
      "Remove a chip or choose Clear filters. The last removal also fires rowan-dashboard-clear.",
      "Add a filter in the builder. source is filter. Chart series stay on the full Harbor weeks.",
    ],
    events: [
      "rowan-point-activate",
      "rowan-filter-change",
      "rowan-dashboard-change",
      "rowan-dashboard-clear",
    ],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const filters = builder();
    const weeks = barChart();
    const channels = donutChart();
    const table = tableOf(ROWS);
    const trace = log("Events");
    root.append(filters, weeks, channels, table, trace.heading, trace.list);
    const dashboard = createDashboard({ root, filters, fields: FIELDS, url: false });
    root.addEventListener("rowan-dashboard-change", (event) => {
      trace.push(`change ${event.detail.source} ${dashboard.search() || "(empty)"}`);
    });
    root.addEventListener("rowan-dashboard-clear", (event) => {
      trace.push(`clear ${event.detail.source}`);
    });
    releaseLater(root, dashboard);
    return root;
  },
};

export const UrlHistory = {
  name: "URL history",
  parameters: createEventScriptParameters({
    steps: [
      "Activate a bar. The readout is the shareable query, and history length grows.",
      "Back restores the previous tree. Forward applies it again. source is url.",
      "keep=1 stays in the query. This story uses an in-memory window so Storybook's address does not change.",
    ],
    events: ["rowan-dashboard-change"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const view = memoryWindow("https://harbor.example/orders?keep=1");
    const weeks = barChart();
    const table = tableOf(ROWS);
    const status = document.createElement("p");
    status.setAttribute("aria-live", "polite");
    const back = document.createElement("button");
    back.type = "button";
    back.textContent = "Back";
    const forward = document.createElement("button");
    forward.type = "button";
    forward.textContent = "Forward";
    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "0.5rem";
    actions.append(back, forward);
    root.append(status, actions, weeks, table);
    const dashboard = createDashboard({
      root,
      charts: [{ element: weeks, field: "week", value: "label" }],
      table,
      fields: FIELDS,
      url: { window: view, param: "df", history: "push" },
    });
    const paint = () => {
      status.textContent = `${view.location.href} · entry ${view.history.index + 1} of ${view.history.length}`;
    };
    back.addEventListener("click", () => view.history.back());
    forward.addEventListener("click", () => view.history.forward());
    root.addEventListener("rowan-dashboard-change", paint);
    paint();
    releaseLater(root, dashboard);
    return root;
  },
};

export const ReplaceHistory = {
  name: "Replace history",
  parameters: createEventScriptParameters({
    steps: [
      "Activate bars and slices. history is replace, so the in-memory stack stays one entry.",
      "The query still updates. Back does not walk the filter changes.",
    ],
    events: ["rowan-dashboard-change"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const view = memoryWindow();
    const weeks = barChart();
    const channels = donutChart();
    const status = document.createElement("p");
    root.append(status, weeks, channels);
    const dashboard = createDashboard({
      root,
      url: { window: view, history: "replace" },
      chips: false,
    });
    const paint = () => {
      status.textContent = `${dashboard.search() || "(empty)"} · stack ${view.history.length}`;
    };
    root.addEventListener("rowan-dashboard-change", paint);
    paint();
    releaseLater(root, dashboard);
    return root;
  },
};

export const ServerMode = {
  name: "Server mode",
  parameters: createEventScriptParameters({
    steps: [
      "The table is data-mode=server. A chart click writes filters and getRows receives the tree.",
      "A quick { id, value } filter stays beside the dashboard tree.",
      "Clear removes the dashboard filters and leaves the quick filter.",
    ],
    events: ["rowan-dashboard-change", "rowan-data-load"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const weeks = barChart();
    const table = document.createElement("rowan-table");
    table.dataMode = "server";
    table.config = {
      caption: "Harbor orders",
      columns: [
        { id: "week", header: "Week" },
        { id: "channel", header: "Channel" },
        { id: "orders", header: "Orders", type: "number", align: "end" },
      ],
      page: { index: 0, size: 10 },
    };
    table.filters = [{ id: "channel", value: "Wholesale" }];
    const status = document.createElement("p");
    status.setAttribute("aria-live", "polite");
    table.dataSource = {
      debounce: 0,
      getRows({ filters }) {
        const quick = filters.find((filter) => filter.id === "channel");
        const rows = applyFilters(
          ROWS.filter((row) => !quick?.value || row.channel === quick.value),
          filters.filter((filter) => filter.field),
          FIELDS,
        );
        status.textContent = `getRows ${JSON.stringify(filters)} · ${rows.length} rows`;
        return Promise.resolve({ rows, total: rows.length });
      },
    };
    root.append(status, weeks, table);
    const dashboard = createDashboard({
      root,
      charts: [weeks],
      table,
      fields: FIELDS,
      url: false,
    });
    releaseLater(root, dashboard);
    return root;
  },
};

export const FieldControl = {
  name: "Field control",
  parameters: createEventScriptParameters({
    steps: [
      "Choose a channel. The select is discovered from data-dashboard-field and filters the table.",
      "Activate a week bar. The select stays, and the table matches both.",
      "Choose Any. That control clears its field.",
    ],
    events: ["rowan-change", "rowan-dashboard-change"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const select = document.createElement("rowan-select");
    select.label = "Channel";
    select.setAttribute("data-dashboard-field", "channel");
    select.options = [
      { value: "", label: "Any" },
      ...CHANNELS.map((channel) => ({ value: channel, label: channel })),
    ];
    const weeks = barChart();
    const table = tableOf(ROWS);
    root.append(select, weeks, table);
    const dashboard = createDashboard({ root, fields: FIELDS, url: false, rows: ROWS });
    releaseLater(root, dashboard);
    return root;
  },
};

export const GroupAndMessages = {
  name: "Group and messages",
  parameters: createEventScriptParameters({
    steps: [
      "The tree starts as an OR group. One chip uses the groupOr message.",
      "Clear filters uses the clear message and fires rowan-dashboard-clear.",
      "Chips render in the element passed as chips, not a new node on root.",
    ],
    events: ["rowan-dashboard-change", "rowan-dashboard-clear"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const chips = document.createElement("div");
    const table = tableOf(ROWS);
    const trace = log("Events");
    root.append(chips, table, trace.heading, trace.list);
    const dashboard = createDashboard({
      root,
      chips,
      table,
      fields: FIELDS,
      url: false,
      filters: [
        {
          join: "or",
          filters: [
            { field: "channel", operator: "equals", value: "Web" },
            { field: "channel", operator: "equals", value: "Showroom" },
          ],
        },
      ],
      messages: {
        clear: "Reset Harbor",
        groupOr: "Either {count} channels",
        chip: "{field} = {value}",
      },
    });
    root.addEventListener("rowan-dashboard-change", (event) =>
      trace.push(`change ${event.detail.source}`),
    );
    root.addEventListener("rowan-dashboard-clear", (event) =>
      trace.push(`clear ${event.detail.source}`),
    );
    releaseLater(root, dashboard);
    return root;
  },
};

export const SeriesValue = {
  name: "Series value",
  parameters: createEventScriptParameters({
    steps: [
      "The donut uses value seriesLabel, so a slice filters by the series name when that name is the dimension.",
      "This story points value at label, the same dimension as the slice name, and shows the chosen detail key in the status.",
    ],
    events: ["rowan-point-activate", "rowan-dashboard-change"],
  }),
  render: () => {
    const root = stack(document.createElement("div"));
    const channels = donutChart();
    const status = document.createElement("p");
    status.textContent = "No slice selected.";
    const table = tableOf(ROWS);
    root.append(status, channels, table);
    const dashboard = createDashboard({
      root,
      charts: [{ element: channels, field: "channel", value: (detail) => detail.label }],
      table,
      fields: FIELDS,
      url: false,
      chips: true,
    });
    channels.addEventListener("rowan-point-activate", (event) => {
      status.textContent = `label ${event.detail.label} · series ${event.detail.seriesLabel} · filter ${dashboard.get("channel") || "cleared"}`;
    });
    releaseLater(root, dashboard);
    return root;
  },
};
