import "./box-plot-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { performanceStats } from "../../stories/fixtures/chart-data.js";

function createBoxPlot({
  label = "Lane dwell",
  description = "Five-number summaries are authored. The host does not compute quartiles.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-box-plot-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["North", "South", "West"];
  chart.series = [
    {
      id: "dwell",
      label: "Dwell",
      values: [
        { min: 4, q1: 8, median: 12, q3: 16, max: 22, outliers: [30] },
        { min: 6, q1: 9, median: 11, q3: 15, max: 19 },
        { min: 3, q1: 7, median: 10, q3: 14, max: 18, outliers: [1, 26] },
      ],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Box Plot Chart",
  component: "rowan-box-plot-chart",
  tags: ["autodocs"],
  args: {
    label: "Lane dwell",
    description: "Five-number summaries are authored. The host does not compute quartiles.",
    interactive: true,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a box with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createBoxPlot(args),
};

export const PerformanceMetrics = {
  name: "Performance metrics (realistic data)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-box-plot-chart");
    chart.label = "System Performance";
    chart.description = "Response time distribution (ms) by component";
    chart.labels = performanceStats.map((d) => d.category);
    chart.series = [
      {
        id: "latency",
        label: "Response Time (ms)",
        values: performanceStats.map((d) => ({
          min: d.min,
          q1: d.q1,
          median: d.median,
          q3: d.q3,
          max: d.max,
        })),
      },
    ];
    return chart;
  },
};

export const Grouped = {
  name: "Grouped series",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = createBoxPlot(args);
    chart.series = [
      {
        id: "inbound",
        label: "Inbound",
        values: [
          { min: 4, q1: 8, median: 12, q3: 16, max: 22 },
          { min: 6, q1: 9, median: 11, q3: 15, max: 19 },
          { min: 3, q1: 7, median: 10, q3: 14, max: 18 },
        ],
      },
      {
        id: "outbound",
        label: "Outbound",
        values: [
          { min: 2, q1: 5, median: 8, q3: 12, max: 16, outliers: [24] },
          { min: 3, q1: 6, median: 9, q3: 13, max: 17 },
          { min: 1, q1: 4, median: 7, q3: 11, max: 15 },
        ],
      },
    ];
    return chart;
  },
};

export const WithOutliers = {
  name: "With outliers",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-box-plot-chart");
    chart.label = "Request Latency";
    chart.description = "Shows outliers beyond whiskers";
    chart.labels = ["API", "Database", "Cache", "External"];
    chart.series = [
      {
        id: "latency",
        label: "Latency (ms)",
        values: [
          { min: 50, q1: 120, median: 180, q3: 280, max: 450, outliers: [620, 780, 920] },
          { min: 20, q1: 45, median: 85, q3: 140, max: 320, outliers: [450, 580] },
          { min: 5, q1: 12, median: 25, q3: 45, max: 85, outliers: [150] },
          { min: 100, q1: 250, median: 400, q3: 620, max: 980, outliers: [1200, 1450, 1680, 2100] },
        ],
      },
    ];
    return chart;
  },
};

export const SparseData = {
  name: "Sparse data (null gaps)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-box-plot-chart");
    chart.label = "Service Availability";
    chart.description = "Some services have missing data";
    chart.labels = ["Service A", "Service B", "Service C", "Service D"];
    chart.series = [
      {
        id: "uptime",
        label: "Uptime %",
        values: [
          { min: 95, q1: 97, median: 98, q3: 99, max: 100 },
          null,
          { min: 92, q1: 95, median: 97, q3: 98, max: 99, outliers: [88] },
          null,
        ],
      },
    ];
    return chart;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-box-plot-chart");
    chart.label = "No data available";
    chart.description = "Chart with empty data";
    chart.labels = [];
    chart.series = [];
    return chart;
  },
};

export const Loading = {
  name: "Loading state",
  render: () => {
    const chart = document.createElement("rowan-box-plot-chart");
    chart.label = "Loading...";
    chart.loading = true;
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createBoxPlot(args)),
};
