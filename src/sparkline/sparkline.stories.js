import "./sparkline.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createSparkline({
  label = "Open incidents",
  tone,
  values = [18, 24, null, 12, 15, 9, 11],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  target,
  aboveTone,
  belowTone,
  variant,
} = {}) {
  const chart = document.createElement("rowan-sparkline");
  chart.label = label;
  if (tone && tone !== "neutral") chart.tone = tone;
  chart.values = values;
  chart.labels = labels;
  if (target !== undefined) chart.target = target;
  if (aboveTone) chart.aboveTone = aboveTone;
  if (belowTone) chart.belowTone = belowTone;
  if (variant) chart.variant = variant;
  return chart;
}

export default {
  title: "Components/Data Display/Sparkline",
  component: "rowan-sparkline",
  tags: ["autodocs"],
  args: {
    label: "Open incidents",
    tone: "neutral",
  },
  argTypes: {
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
    variant: {
      control: "select",
      options: ["line", "area"],
    },
  },
};

export const Playground = {
  render: (args) => createSparkline(args),
};

export const InKpiCard = {
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Open incidents";
    card.tone = "warning";
    card.deltaLabel = "vs last week";
    card.value = 11;
    card.delta = -7;

    const chart = document.createElement("rowan-sparkline");
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

    const chart = document.createElement("rowan-sparkline");
    chart.slot = "chart";
    chart.label = "Energy versus target";
    chart.values = [2.1, 4.8, -1.2, 3.4, -3.8, 1.1, -2.4];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.target = 0;
    card.append(chart);
    return card;
  },
};

export const AreaFill = {
  name: "Area fill",
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Open incidents";
    card.tone = "warning";
    card.deltaLabel = "vs last week";
    card.value = 11;
    card.delta = -7;

    const chart = document.createElement("rowan-sparkline");
    chart.slot = "chart";
    chart.label = "Open incidents this week";
    chart.values = [18, 24, 12, 15, 9, 11];
    chart.variant = "area";
    card.append(chart);
    return card;
  },
};

export const AreaVersusTarget = {
  name: "Area versus target",
  render: () => {
    const card = document.createElement("rowan-kpi-card");
    card.label = "Net energy";
    card.deltaLabel = "vs target";
    card.value = -2.4;

    const chart = document.createElement("rowan-sparkline");
    chart.slot = "chart";
    chart.label = "Energy versus target";
    chart.values = [2.1, 4.8, -1.2, 3.4, -3.8, 1.1, -2.4];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chart.target = 0;
    chart.variant = "area";
    card.append(chart);
    return card;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(InKpiCard.render()),
};
