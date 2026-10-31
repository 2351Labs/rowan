import "./combo-chart.js";
import { createParetoData } from "./pareto.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";
import { monthlyRevenue, salesAndMargin } from "../../stories/fixtures/chart-data.js";

function createCombo({
  label = "Throughput mix",
  description = "Bars on the left scale, line on the right.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-combo-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    {
      id: "volume",
      label: "Volume",
      geometry: "bar",
      values: [18, 24, 12, 20, 16],
    },
    {
      id: "fill",
      label: "Fill %",
      geometry: "line",
      axis: "secondary",
      values: [72, 80, 64, 88, 76],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Combo Chart",
  component: "rowan-combo-chart",
  tags: ["autodocs"],
  args: {
    label: "Throughput mix",
    description: "Bars on the left scale, line on the right.",
    interactive: true,
  },
  argTypes: {
    locale: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a bar or line point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createCombo(args),
};

export const RevenueAndMargin = {
  name: "Revenue and margin (realistic data)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = "Sales Performance";
    chart.description = "Revenue (bars) and margin percentage (line)";
    chart.labels = monthlyRevenue.map((d) => d.month);
    chart.series = [
      {
        id: "revenue",
        label: "Revenue",
        geometry: "bar",
        values: salesAndMargin.map((d) => d.revenue),
      },
      {
        id: "margin",
        label: "Margin %",
        geometry: "line",
        axis: "secondary",
        values: salesAndMargin.map((d) => d.margin),
      },
    ];
    return chart;
  },
};

export const AreaColumn = {
  name: "Area + Column",
  args: {
    description: "Area behind bars on one category axis.",
  },
  parameters: Playground.parameters,
  render: (args) => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = args.label || "Volume mix";
    chart.description = args.description;
    chart.interactive = Boolean(args.interactive);
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    chart.series = [
      {
        id: "trend",
        label: "Trend",
        geometry: "area",
        values: [14, 18, 11, 16, 13],
      },
      {
        id: "volume",
        label: "Volume",
        geometry: "bar",
        values: [18, 24, 12, 20, 16],
      },
    ];
    return chart;
  },
};

export const MultipleLines = {
  name: "Multiple lines with bars",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = "Sales vs Targets";
    chart.description = "Actual (bars) with current and stretch targets (lines)";
    chart.labels = monthlyRevenue.map((d) => d.month);
    chart.series = [
      {
        id: "revenue",
        label: "Revenue",
        geometry: "bar",
        values: monthlyRevenue.map((d) => d.revenue),
      },
      {
        id: "target",
        label: "Target",
        geometry: "line",
        values: monthlyRevenue.map((d) => d.target),
      },
      {
        id: "stretch",
        label: "Stretch",
        geometry: "line",
        values: monthlyRevenue.map((d) => d.target * 1.15),
      },
    ];
    return chart;
  },
};

export const DualAxis = {
  name: "Dual axis scales",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = "Revenue and Growth";
    chart.description = "Revenue in dollars (left) and growth rate (right)";
    chart.labels = salesAndMargin.map((d) => d.month);
    chart.series = [
      {
        id: "revenue",
        label: "Revenue",
        geometry: "bar",
        values: salesAndMargin.map((d) => d.revenue),
      },
      {
        id: "growth",
        label: "Growth %",
        geometry: "line",
        axis: "secondary",
        values: salesAndMargin.map((d) => d.growth),
      },
    ];
    return chart;
  },
};

export const SparseData = {
  name: "Sparse data (null gaps)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = "Incomplete Metrics";
    chart.description = "Data with missing values (null)";
    chart.labels = ["Q1", "Q2", "Q3", "Q4"];
    chart.series = [
      {
        id: "volume",
        label: "Volume",
        geometry: "bar",
        values: [180, null, 220, 240],
      },
      {
        id: "efficiency",
        label: "Efficiency %",
        geometry: "line",
        axis: "secondary",
        values: [85, 88, null, 92],
      },
    ];
    return chart;
  },
};

export const Pareto = {
  name: "Pareto chart",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = args.label || "Defect Pareto";
    chart.description = "Counts sorted descending with cumulative percent.";
    chart.interactive = Boolean(args.interactive);
    const data = createParetoData({
      labels: ["Seal", "Hinge", "Wiring", "Finish", "Other"],
      values: [42, 28, 16, 9, 5],
    });
    chart.labels = data.labels;
    chart.series = data.series;
    chart.referenceLines = [
      { value: 80, label: "80%", tone: "warning", axis: "secondary" },
    ];
    return chart;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-combo-chart");
    chart.label = "No data available";
    chart.description = "Chart with empty data";
    chart.labels = [];
    chart.series = [];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createCombo(args)),
};

const chartFixtures = coverageStories["rowan-combo-chart"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureSparse = chartFixtures.sparse;
export const FixtureNegative = chartFixtures.negative;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureError = chartFixtures.error;
export const FixtureSlots = chartFixtures.slots;
