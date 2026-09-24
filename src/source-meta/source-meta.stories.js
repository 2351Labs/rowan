import "./source-meta.js";
import "../kpi-card/kpi-card.js";
import "../bar-chart/bar-chart.js";
import "../table/table.js";

function createMeta({ source, asOf } = {}) {
  const el = document.createElement("rowan-source-meta");
  el.source = source ?? "Warehouse events";
  el.asOf = asOf ?? "2026-09-23 14:02 UTC";
  return el;
}

export default {
  title: "Components/Data Display/Source Meta",
  component: "rowan-source-meta",
  tags: ["autodocs"],
  args: {
    source: "Warehouse events",
    asOf: "2026-09-23 14:02 UTC",
  },
  argTypes: {
    source: { control: "text" },
    asOf: { control: "text" },
  },
};

export const Playground = {
  render: (args) => createMeta(args),
};

export const InKpi = {
  name: "In KPI description",
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Fill rate";
    card.value = 82;
    card.delta = -3;
    card.deltaLabel = "vs last week";
    card.tone = "warning";
    card.append(createMeta());
    return card;
  },
};

export const InChart = {
  name: "In chart description",
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Fill rate by day";
    chart.labels = ["Mon", "Tue", "Wed"];
    chart.series = [{ id: "fill", label: "Fill", values: [80, 82, 79] }];
    const meta = createMeta();
    meta.slot = "description";
    chart.append(meta);
    return chart;
  },
};

export const InTable = {
  name: "In table caption",
  render: () => {
    const table = document.createElement("rowan-table");
    table.config = {
      columns: [
        { id: "yard", header: "Yard" },
        { id: "fill", header: "Fill %" },
      ],
      rows: [
        { id: "north", yard: "North", fill: 82 },
        { id: "south", yard: "South", fill: 74 },
      ],
    };
    const meta = createMeta();
    meta.slot = "caption";
    table.append(meta);
    return table;
  },
};
