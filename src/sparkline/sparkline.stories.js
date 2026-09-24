import "./sparkline.js";
import "../kpi-card/kpi-card.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createSparkline({
  label = "Open incidents",
  tone,
  values = [18, 24, null, 12, 15, 9, 11],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
} = {}) {
  const chart = document.createElement("rowan-sparkline");
  chart.label = label;
  if (tone && tone !== "neutral") chart.tone = tone;
  chart.values = values;
  chart.labels = labels;
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

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(InKpiCard.render()),
};
