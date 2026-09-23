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

export default {
  title: "Components/Data Display/Bullet Chart",
  tags: ["autodocs"],
};

export const Playground = {
  render: () => {
    const chart = document.createElement("rowan-bullet-chart");
    chart.label = "Fill rate";
    chart.value = 82;
    chart.target = 90;
    chart.ranges = sampleRanges();
    return chart;
  },
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
