import "./charts-vibrant.css";
import "../button/button.js";
import "../kpi-card/kpi-card.js";
import "../gauge-chart/gauge-chart.js";
import "../bullet-chart/bullet-chart.js";
import "../sparkline/sparkline.js";

function sampleRanges() {
  return [
    { from: 0, to: 50, label: "Low", tone: "danger" },
    { from: 50, to: 80, label: "Fair", tone: "warning" },
    { from: 80, to: 100, label: "Good", tone: "success" },
  ];
}

function createDashboard() {
  const row = document.createElement("div");
  row.style.display = "grid";
  row.style.gap = "var(--rowan-space-4)";
  row.style.gridTemplateColumns = "repeat(auto-fit, minmax(12rem, 1fr))";

  const utilization = document.createElement("rowan-kpi-card");
  utilization.label = "Utilization";
  utilization.tone = "warning";
  utilization.deltaLabel = "vs target";
  utilization.value = 72;
  utilization.delta = -8;
  const gauge = document.createElement("rowan-gauge-chart");
  gauge.slot = "chart";
  gauge.label = "Utilization versus target";
  gauge.value = 72;
  gauge.target = 80;
  gauge.ranges = sampleRanges();
  utilization.append(gauge);

  const fill = document.createElement("rowan-kpi-card");
  fill.label = "Fill rate";
  fill.tone = "success";
  fill.deltaLabel = "vs target";
  fill.value = 82;
  fill.delta = -8;
  const bullet = document.createElement("rowan-bullet-chart");
  bullet.slot = "chart";
  bullet.label = "Fill rate versus target";
  bullet.value = 82;
  bullet.target = 90;
  bullet.ranges = [
    { from: 0, to: 60, label: "Poor", tone: "danger" },
    { from: 60, to: 80, label: "Fair", tone: "warning" },
    { from: 80, to: 100, label: "Good", tone: "success" },
  ];
  fill.append(bullet);

  const incidents = document.createElement("rowan-kpi-card");
  incidents.label = "Open incidents";
  incidents.tone = "danger";
  incidents.deltaLabel = "vs last week";
  incidents.value = 19;
  incidents.delta = -4;
  const spark = document.createElement("rowan-sparkline");
  spark.slot = "chart";
  spark.label = "Open incidents this week";
  spark.tone = "danger";
  spark.values = [18, 24, 12, 15, 9, 11];
  incidents.append(spark);

  row.append(utilization, fill, incidents);
  return row;
}

function createPanel({ title, vibrant }) {
  const panel = document.createElement("div");
  if (vibrant) panel.dataset.rowanCharts = "vibrant";
  panel.style.background = "var(--rowan-color-bg)";
  panel.style.border = "1px solid var(--rowan-color-border)";
  panel.style.borderRadius = "var(--rowan-radius-lg)";
  panel.style.color = "var(--rowan-color-fg)";
  panel.style.display = "grid";
  panel.style.gap = "var(--rowan-space-4)";
  panel.style.padding = "var(--rowan-space-4)";

  const heading = document.createElement("div");
  heading.style.display = "flex";
  heading.style.justifyContent = "space-between";
  heading.style.alignItems = "center";
  heading.style.gap = "var(--rowan-space-3)";

  const label = document.createElement("strong");
  label.textContent = title;

  const button = document.createElement("rowan-button");
  button.textContent = "Save";
  heading.append(label, button);

  panel.append(heading, createDashboard());
  return panel;
}

export default {
  title: "Foundations/Chart palette",
};

export const RowanAndVibrant = {
  name: "Rowan and vibrant",
  parameters: {
    docs: {
      description: {
        story:
          'Same `data-rowan-charts="vibrant"` attribute used on the KPI and chart component stories.',
      },
    },
  },
  render: () => {
    const stack = document.createElement("div");
    stack.style.display = "grid";
    stack.style.gap = "var(--rowan-space-5)";
    stack.append(
      createPanel({ title: "Rowan (default)", vibrant: false }),
      createPanel({ title: "Vibrant charts", vibrant: true }),
    );
    return stack;
  },
};
