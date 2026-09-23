import { createDashboardFilters } from "./dashboard-filters.js";
import { applyFilters } from "../filter-builder/apply-filters.js";
import "../kpi-card/kpi-card.js";
import "../source-meta/source-meta.js";
import "../bar-chart/bar-chart.js";
import "../table/table.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "mon-north", day: "Mon", yard: "North", fill: 82 },
  { id: "mon-south", day: "Mon", yard: "South", fill: 74 },
  { id: "tue-north", day: "Tue", yard: "North", fill: 88 },
  { id: "tue-south", day: "Tue", yard: "South", fill: 71 },
  { id: "wed-north", day: "Wed", yard: "North", fill: 79 },
  { id: "wed-south", day: "Wed", yard: "South", fill: 76 },
];

const FIELDS = [
  { id: "day", type: "text" },
  { id: "yard", type: "text" },
];

function createMeta() {
  const meta = document.createElement("rowan-source-meta");
  meta.source = "Warehouse events";
  meta.asOf = "2026-09-23 14:02 UTC";
  return meta;
}

export default {
  title: "Workflows/Dashboard filters",
};

export const Session = {
  parameters: createEventScriptParameters({
    steps: [
      "Activate a bar. The host sets session key `day` from rowan-point-activate; the table rows update.",
      "Select a table row. The host sets session key `yard` from rowan-select.",
      "Clear filters. snapshot() is the deep-link payload; the story does not write the URL.",
    ],
    events: ["rowan-point-activate", "rowan-select"],
  }),
  render: () => {
    const session = createDashboardFilters();
    const root = document.createElement("div");
    root.style.display = "grid";
    root.style.gap = "var(--rowan-space-4)";

    const kpi = document.createElement("rowan-kpi-card");
    kpi.label = "Fill samples";
    kpi.value = ROWS.length;
    kpi.append(createMeta());

    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Fill by day";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue", "Wed"];
    chart.series = [{ id: "fill", label: "Fill", values: [78, 79.5, 77.5] }];
    const chartMeta = createMeta();
    chartMeta.slot = "description";
    chart.append(chartMeta);

    const table = document.createElement("rowan-table");
    table.config = {
      selectable: "single",
      rowId: "id",
      columns: [
        { id: "day", header: "Day" },
        { id: "yard", header: "Yard" },
        { id: "fill", header: "Fill %" },
      ],
      rows: ROWS,
    };
    const tableMeta = createMeta();
    tableMeta.slot = "caption";
    table.append(tableMeta);

    const tools = document.createElement("div");
    tools.style.alignItems = "center";
    tools.style.display = "flex";
    tools.style.gap = "var(--rowan-space-3)";
    const clear = document.createElement("rowan-button");
    clear.variant = "secondary";
    clear.size = "sm";
    clear.textContent = "Clear filters";
    const snapshot = document.createElement("pre");
    snapshot.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    snapshot.style.fontSize = "0.8125rem";
    snapshot.style.margin = "0";
    tools.append(clear, snapshot);

    function renderSession() {
      const current = session.snapshot();
      snapshot.textContent = JSON.stringify(current);
      const filters = [];
      if (current.day) filters.push({ field: "day", operator: "equals", value: current.day });
      if (current.yard) filters.push({ field: "yard", operator: "equals", value: current.yard });
      table.rows = applyFilters(ROWS, filters, FIELDS);
      kpi.value = table.rows.length;
    }

    session.subscribe(renderSession);
    renderSession();

    chart.addEventListener("rowan-point-activate", (event) => {
      session.set("day", event.detail.label);
    });
    table.addEventListener("rowan-select", (event) => {
      const row = event.detail.selectedRows?.[0];
      if (row?.yard) session.set("yard", row.yard);
      else session.clear("yard");
    });
    clear.addEventListener("rowan-click", () => session.clear());

    root.append(kpi, chart, table, tools);
    return root;
  },
};
