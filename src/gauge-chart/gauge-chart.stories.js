import "./gauge-chart.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function sampleRanges() {
  return [
    { from: 0, to: 50, label: "Low", tone: "danger" },
    { from: 50, to: 80, label: "Fair", tone: "warning" },
    { from: 80, to: 100, label: "Good", tone: "success" },
  ];
}

function makeGauge({ label, min = 0, max = 100, value, target, ranges }) {
  const chart = document.createElement("rowan-gauge-chart");
  chart.label = label;
  chart.min = min;
  chart.max = max;
  chart.value = value;
  chart.target = target;
  chart.ranges = ranges;
  return chart;
}

export default {
  title: "Components/Data Display/Gauge Chart",
  component: "rowan-gauge-chart",
  tags: ["autodocs"],
  args: {
    label: "Utilization",
    min: 0,
    max: 100,
    value: 72,
    target: 80,
  },
  argTypes: {
    label: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    value: { control: "number" },
    target: { control: "number" },
  },
};

export const Playground = {
  render: (args) => makeGauge({ ...args, ranges: sampleRanges() }),
};

export const InKpiCard = {
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Utilization";
    card.tone = "warning";
    card.deltaLabel = "vs target";
    card.value = 72;
    card.delta = -8;

    const chart = document.createElement("rowan-gauge-chart");
    chart.slot = "chart";
    chart.label = "Utilization versus target";
    chart.min = 0;
    chart.max = 100;
    chart.value = 72;
    chart.target = 80;
    chart.ranges = sampleRanges();
    card.append(chart);
    return card;
  },
};

export const CustomScale = {
  name: "Custom min and max",
  render: () =>
    makeGauge({
      label: "Operating temperature",
      min: 60,
      max: 90,
      value: 81,
      target: 76,
      ranges: [
        { from: 60, to: 70, label: "Low", tone: "info" },
        { from: 70, to: 78, label: "Fair", tone: "success" },
        { from: 78, to: 84, label: "High", tone: "warning" },
        { from: 84, to: 90, label: "Critical", tone: "danger" },
      ],
    }),
};

export const Dashboard = {
  render: () => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(10rem, 1fr))";
    row.style.gap = "1.5rem";
    row.append(
      makeGauge({
        label: "Fill rate",
        value: 82,
        target: 90,
        ranges: [
          { from: 0, to: 60, label: "Poor", tone: "danger" },
          { from: 60, to: 80, label: "Fair", tone: "warning" },
          { from: 80, to: 100, label: "Good", tone: "success" },
        ],
      }),
      makeGauge({
        label: "Utilization",
        value: 72,
        target: 80,
        ranges: sampleRanges(),
      }),
      makeGauge({
        label: "SLA",
        value: 96,
        target: 95,
        ranges: [
          { from: 0, to: 90, label: "Breach", tone: "danger" },
          { from: 90, to: 95, label: "Watch", tone: "warning" },
          { from: 95, to: 100, label: "Met", tone: "success" },
        ],
      }),
    );
    return row;
  },
};

export const NoData = {
  render: () =>
    makeGauge({
      label: "Utilization",
      value: null,
      target: null,
      ranges: sampleRanges(),
    }),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(Dashboard.render()),
};
