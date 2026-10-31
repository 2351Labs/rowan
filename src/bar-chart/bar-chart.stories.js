import "./bar-chart.js";
import { createHistogramData } from "../histogram/histogram.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";
import {
  productSales,
  regionalSales,
  profitLossData,
  responseTimeDistribution,
} from "../../stories/fixtures/chart-data.js";

function createBarChart({
  label = "Incidents by day",
  description = "Incoming versus resolved.",
  interactive = true,
  orientation = "vertical",
} = {}) {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.orientation = orientation;
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "incoming", label: "Incoming", values: [18, 24, null, 12, 15] },
    { id: "resolved", label: "Resolved", values: [13, 19, 20, 15, 16] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Bar Chart",
  component: "rowan-bar-chart",
  tags: ["autodocs"],
  args: {
    label: "Incidents by day",
    description: "Incoming versus resolved.",
    interactive: true,
    orientation: "vertical",
  },
  argTypes: {
    locale: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a bar with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createBarChart(args),
};

export const Horizontal = {
  args: { orientation: "horizontal" },
  parameters: Playground.parameters,
  render: (args) => createBarChart(args),
};

export const ProductSales = {
  name: "Product sales (realistic data)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Product Sales";
    chart.description = "Revenue by product line";
    chart.labels = productSales.map((d) => d.product);
    chart.series = [
      {
        id: "sales",
        label: "Sales ($)",
        values: productSales.map((d) => d.sales),
      },
    ];
    return chart;
  },
};

export const MultiSeries = {
  name: "Multi-series grouped",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Regional Sales by Quarter";
    chart.description = "Sales across four regions";
    chart.labels = regionalSales.map((d) => d.quarter);
    chart.series = [
      {
        id: "north",
        label: "North",
        values: regionalSales.map((d) => d.north),
      },
      {
        id: "south",
        label: "South",
        values: regionalSales.map((d) => d.south),
      },
      {
        id: "east",
        label: "East",
        values: regionalSales.map((d) => d.east),
      },
      {
        id: "west",
        label: "West",
        values: regionalSales.map((d) => d.west),
      },
    ];
    return chart;
  },
};

export const NegativeValues = {
  name: "Negative values",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Monthly Profit/Loss";
    chart.description = "Shows positive and negative values";
    chart.labels = profitLossData.map((d) => d.period);
    chart.series = [
      {
        id: "profit",
        label: "Profit",
        values: profitLossData.map((d) => d.profit),
      },
    ];
    return chart;
  },
};

export const ResponseDistribution = {
  name: "Response time distribution",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "API Response Times";
    chart.description = "Distribution by latency bucket";
    chart.orientation = "horizontal";
    chart.labels = responseTimeDistribution.map((d) => d.range);
    chart.series = [
      {
        id: "count",
        label: "Requests",
        values: responseTimeDistribution.map((d) => d.count),
      },
    ];
    return chart;
  },
};

export const SparseData = {
  name: "Sparse data (null gaps)",
  parameters: Playground.parameters,
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Incidents by Day";
    chart.description = "Data with missing values (null)";
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.series = [
      {
        id: "incoming",
        label: "Incoming",
        values: [18, 24, null, 12, null, 9, 11],
      },
      {
        id: "resolved",
        label: "Resolved",
        values: [13, null, 20, 15, 16, null, 10],
      },
    ];
    return chart;
  },
};

export const Histogram = {
  name: "Histogram bins",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = createBarChart(args);
    chart.label = args.label || "Fill samples";
    chart.description =
      args.description || "createHistogramData bins for the bar chart.";
    const data = createHistogramData({
      values: [1, 2, 2, 3, 8, 9, 9, 10, null],
      bins: 4,
    });
    chart.labels = data.labels;
    chart.series = data.series;
    return chart;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-bar-chart");
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
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Loading...";
    chart.loading = true;
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createBarChart(args)),
};

const chartFixtures = coverageStories["rowan-bar-chart"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureHorizontal = chartFixtures.horizontal;
export const FixtureSparse = chartFixtures.sparse;
export const FixtureNegative = chartFixtures.negative;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureError = chartFixtures.error;
export const FixtureSlots = chartFixtures.slots;
