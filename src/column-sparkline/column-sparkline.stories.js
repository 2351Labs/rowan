import "./column-sparkline.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";
import { sparklineValues } from "../../stories/fixtures/chart-data.js";

function createColumnSparkline({
  label = "Open incidents",
  tone,
  values = [18, 24, null, 12, 15, 9, 11],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  target,
  aboveTone,
  belowTone,
} = {}) {
  const chart = document.createElement("rowan-column-sparkline");
  chart.label = label;
  if (tone && tone !== "neutral") chart.tone = tone;
  chart.values = values;
  chart.labels = labels;
  if (target !== undefined) chart.target = target;
  if (aboveTone) chart.aboveTone = aboveTone;
  if (belowTone) chart.belowTone = belowTone;
  return chart;
}

export default {
  title: "Components/Data Display/Column Sparkline",
  component: "rowan-column-sparkline",
  tags: ["autodocs"],
  args: {
    label: "Open incidents",
    tone: "neutral",
  },
  argTypes: {
    locale: { control: "text" },
    label: { control: "text" },
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    target: { control: "number" },
    aboveTone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    belowTone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
  },
};

export const Playground = {
  render: (args) => createColumnSparkline(args),
};

export const InKpiCard = {
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Open incidents";
    card.tone = "warning";
    card.deltaLabel = "vs last week";
    card.value = 11;
    card.delta = -7;

    const chart = document.createElement("rowan-column-sparkline");
    chart.slot = "chart";
    chart.label = "Open incidents this week";
    chart.values = [18, 24, 12, 15, 9, 11];
    card.append(chart);
    return card;
  },
};

export const VersusTarget = {
  name: "Versus target",
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Net energy";
    card.deltaLabel = "vs target";
    card.value = -2.4;

    const chart = document.createElement("rowan-column-sparkline");
    chart.slot = "chart";
    chart.label = "Energy versus target";
    chart.values = [2.1, 4.8, -1.2, 3.4, -3.8, 1.1, -2.4];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.target = 0;
    card.append(chart);
    return card;
  },
};

export const AboveBelow = {
  name: "Above/below target tones",
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Quality score";
    card.deltaLabel = "vs threshold";
    card.value = 7.2;

    const chart = document.createElement("rowan-column-sparkline");
    chart.slot = "chart";
    chart.label = "Quality versus threshold";
    chart.values = [6.5, 7.8, 8.2, 7.1, 6.9, 7.5, 7.2];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.target = 7.0;
    chart.aboveTone = "success";
    chart.belowTone = "danger";
    card.append(chart);
    return card;
  },
};

export const RealisticData = {
  name: "Realistic monthly data",
  render: () => {
    const chart = document.createElement("rowan-column-sparkline");
    chart.label = "Monthly revenue trend";
    chart.values = sparklineValues.revenue;
    chart.labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return chart;
  },
};

export const NegativeValues = {
  name: "Negative values",
  render: () => {
    const chart = document.createElement("rowan-column-sparkline");
    chart.label = "Daily variance";
    chart.values = sparklineValues.negative;
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.target = 0;
    return chart;
  },
};

export const SparseData = {
  name: "Sparse data (null gaps)",
  render: () => {
    const chart = document.createElement("rowan-column-sparkline");
    chart.label = "Incomplete data";
    chart.values = [18, 24, null, 12, null, 9, 11];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return chart;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-column-sparkline");
    chart.label = "No data available";
    chart.values = [];
    return chart;
  },
};

export const Loading = {
  name: "Loading state",
  render: () => {
    const chart = document.createElement("rowan-column-sparkline");
    chart.label = "Loading...";
    chart.loading = true;
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(InKpiCard.render()),
};

const chartFixtures = coverageStories["rowan-column-sparkline"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureNegative = chartFixtures.negative;
export const FixtureSparse = chartFixtures.sparse;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureTones = chartFixtures.tones;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureError = chartFixtures.error;

export const FixtureInteraction = chartFixtures.interaction;
