import "./sparkline.js";
import "../kpi-card/kpi-card.js";

export default {
  title: "Components/Data Display/Sparkline",
  tags: ["autodocs"],
};

export const Playground = {
  render: () => {
    const chart = document.createElement("rowan-sparkline");
    chart.label = "Open incidents";
    chart.values = [18, 24, null, 12, 15, 9, 11];
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return chart;
  },
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
