import "./bullet-chart.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { kpiValues } from "../../stories/fixtures/chart-data.js";

function sampleRanges() {
  return [
    { from: 0, to: 60, label: "Poor", tone: "danger" },
    { from: 60, to: 80, label: "Fair", tone: "warning" },
    { from: 80, to: 100, label: "Good", tone: "success" },
  ];
}

function createBullet({
  label = "Fill rate",
  value = 82,
  target = 90,
  scale = true,
  intent = "higher",
  encoding = "ink",
  ranges = sampleRanges(),
} = {}) {
  const chart = document.createElement("rowan-bullet-chart");
  chart.label = label;
  chart.value = value;
  chart.target = target;
  chart.scale = scale;
  chart.intent = intent;
  chart.encoding = encoding;
  chart.ranges = ranges;
  return chart;
}

export default {
  title: "Components/Data Display/Bullet Chart",
  component: "rowan-bullet-chart",
  tags: ["autodocs"],
  args: {
    label: "Fill rate",
    value: 82,
    target: 90,
    scale: true,
    intent: "higher",
    encoding: "ink",
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "number" },
    target: { control: "number" },
    scale: { control: "boolean" },
    intent: {
      control: "select",
      options: ["higher", "lower"],
    },
    encoding: {
      control: "select",
      options: ["ink", "accent", "status", "tone"],
    },
  },
};

export const Playground = {
  render: (args) => createBullet(args),
};

export const IntentLower = {
  name: "Intent: lower is better",
  render: () =>
    createBullet({
      label: "Error rate",
      value: 2.5,
      target: 1.0,
      intent: "lower",
      ranges: [
        { from: 0, to: 1.5, label: "Excellent", tone: "success" },
        { from: 1.5, to: 3, label: "Acceptable", tone: "warning" },
        { from: 3, to: 5, label: "Poor", tone: "danger" },
      ],
    }),
};

export const EncodingAccent = {
  name: "Encoding: accent",
  render: () => createBullet({ encoding: "accent" }),
};

export const EncodingStatus = {
  name: "Encoding: status",
  render: () => createBullet({ encoding: "status" }),
};

export const EncodingTone = {
  name: "Encoding: tone",
  render: () => createBullet({ encoding: "tone" }),
};

export const NoScale = {
  name: "Without scale labels",
  render: () => createBullet({ scale: false }),
};

export const ServerUptime = {
  name: "Server uptime (realistic data)",
  render: () =>
    createBullet({
      label: "Server Uptime",
      value: kpiValues.serverUptime,
      target: 99.9,
      intent: "higher",
      ranges: [
        { from: 0, to: 95, label: "Unacceptable", tone: "danger" },
        { from: 95, to: 99, label: "Needs improvement", tone: "warning" },
        { from: 99, to: 99.9, label: "Good", tone: "info" },
        { from: 99.9, to: 100, label: "Excellent", tone: "success" },
      ],
    }),
};

export const CustomerSat = {
  name: "Customer satisfaction",
  render: () =>
    createBullet({
      label: "Customer Satisfaction",
      value: kpiValues.customerSat,
      target: 90,
      intent: "higher",
      ranges: [
        { from: 0, to: 60, label: "Poor", tone: "danger" },
        { from: 60, to: 75, label: "Fair", tone: "warning" },
        { from: 75, to: 85, label: "Good", tone: "info" },
        { from: 85, to: 100, label: "Excellent", tone: "success" },
      ],
    }),
};

export const ResponseTime = {
  name: "Response time (lower is better)",
  render: () =>
    createBullet({
      label: "Avg Response Time",
      value: kpiValues.responseTime,
      target: 200,
      intent: "lower",
      ranges: [
        { from: 0, to: 200, label: "Excellent", tone: "success" },
        { from: 200, to: 400, label: "Good", tone: "info" },
        { from: 400, to: 600, label: "Slow", tone: "warning" },
        { from: 600, to: 1000, label: "Very slow", tone: "danger" },
      ],
    }),
};

export const ExceedsTarget = {
  name: "Value exceeds target",
  render: () =>
    createBullet({
      label: "Sales Performance",
      value: 125,
      target: 100,
      intent: "higher",
      ranges: sampleRanges(),
    }),
};

export const InKpiCard = {
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Fill rate";
    card.tone = "success";
    card.deltaLabel = "vs target";
    card.value = 82;
    card.delta = -8;

    const chart = document.createElement("rowan-bullet-chart");
    chart.slot = "chart";
    chart.label = "Fill rate versus target";
    chart.value = 82;
    chart.target = 90;
    chart.ranges = sampleRanges();
    card.append(chart);
    return card;
  },
};

export const Empty = {
  name: "Empty state",
  render: () => {
    const chart = document.createElement("rowan-bullet-chart");
    chart.label = "No data available";
    chart.value = 0;
    chart.target = 100;
    chart.ranges = [];
    return chart;
  },
};

export const Loading = {
  name: "Loading state",
  render: () => {
    const chart = document.createElement("rowan-bullet-chart");
    chart.label = "Loading...";
    chart.loading = true;
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(InKpiCard.render()),
};
