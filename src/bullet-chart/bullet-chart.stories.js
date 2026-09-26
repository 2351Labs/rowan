import "./bullet-chart.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

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

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(InKpiCard.render()),
};
