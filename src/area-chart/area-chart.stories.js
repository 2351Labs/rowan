import "./area-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";
import {
  monthlyRevenue,
  revenueAndCosts,
  userMetrics,
} from "../../stories/fixtures/chart-data.js";

function createAreaChart({
  label = "Throughput",
  description = "Filled series. Nulls break the fill.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-area-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "inbound", label: "Inbound", values: [18, 24, null, 12, 20] },
    { id: "outbound", label: "Outbound", values: [10, 14, 16, 9, 11] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Area Chart",
  component: "rowan-area-chart",
  tags: ["autodocs"],
  args: {
    label: "Throughput",
    description: "Filled series. Nulls break the fill.",
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
    steps: ["Activate a point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createAreaChart(args),
};

export const ReferenceLines = {
  render: (args) => {
    const chart = createAreaChart({
      ...args,
      description: "Dashed overlay is the throughput target.",
    });
    chart.referenceLines = [{ value: 16, label: "Target", tone: "danger" }];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createAreaChart(args)),
};

export const MonthlyRevenue = {
  name: "Monthly Revenue (realistic data)",
  render: () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Monthly Revenue";
    chart.description = "Revenue and target over 12 months";
    chart.labels = monthlyRevenue.map((d) => d.month);
    chart.series = [
      {
        id: "revenue",
        label: "Revenue",
        values: monthlyRevenue.map((d) => d.revenue),
      },
      {
        id: "target",
        label: "Target",
        values: monthlyRevenue.map((d) => d.target),
      },
    ];
    return chart;
  },
};

export const MultiSeries = {
  name: "Multi-series (24 months)",
  render: () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Revenue & Costs";
    chart.description = "Two-year trend with multiple series";
    chart.labels = revenueAndCosts.map((d) => d.month);
    chart.series = [
      {
        id: "revenue",
        label: "Revenue",
        values: revenueAndCosts.map((d) => d.revenue),
      },
      {
        id: "costs",
        label: "Costs",
        values: revenueAndCosts.map((d) => d.costs),
      },
      {
        id: "profit",
        label: "Profit",
        values: revenueAndCosts.map((d) => d.profit),
      },
    ];
    return chart;
  },
};

export const SparseData = {
  name: "Sparse data (null gaps)",
  render: () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "User Metrics";
    chart.description = "Data with missing values (null)";
    chart.labels = userMetrics.map((d) => d.date);
    chart.series = [
      {
        id: "users",
        label: "Users",
        values: userMetrics.map((d) => d.users),
      },
      {
        id: "active",
        label: "Active Users",
        values: userMetrics.map((d) => d.activeUsers),
      },
      {
        id: "sessions",
        label: "Sessions",
        values: userMetrics.map((d) => d.sessions),
      },
    ];
    return chart;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "No data available";
    chart.description = "Chart with empty data";
    chart.labels = [];
    chart.series = [];
    chart.messages = { noData: "No data", noMetricData: "No metric data" };
    return chart;
  },
};

const chartFixtures = coverageStories["rowan-area-chart"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureSparse = chartFixtures.sparse;
export const FixtureNegative = chartFixtures.negative;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureError = chartFixtures.error;
export const FixtureSlots = chartFixtures.slots;
