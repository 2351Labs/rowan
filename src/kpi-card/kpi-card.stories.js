import "./kpi-card.js";
import "../sparkline/sparkline.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createCard({ label, value, delta, deltaLabel, tone, loading, description } = {}) {
  const card = document.createElement("rowan-kpi-card");
  card.label = label ?? "Open incidents";
  if (value !== undefined) card.value = value;
  if (delta !== undefined) card.delta = delta;
  if (deltaLabel !== undefined) card.deltaLabel = deltaLabel;
  if (tone !== undefined) card.tone = tone;
  if (loading !== undefined) card.loading = loading;
  if (description) {
    const copy = document.createElement("span");
    copy.textContent = description;
    card.append(copy);
  }
  return card;
}

export default {
  title: "Components/Data Display/KPI Card",
  component: "rowan-kpi-card",
  tags: ["autodocs"],
  args: {
    label: "Open incidents",
    value: 128,
    delta: -4,
    deltaLabel: "vs last week",
    tone: "warning",
    loading: false,
    description: "Unacknowledged incidents in the current window.",
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "number" },
    delta: { control: "number" },
    deltaLabel: { control: "text" },
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    loading: { control: "boolean" },
    description: { control: "text" },
  },
};

export const Playground = {
  render: (args) => createCard(args),
};

export const Tones = {
  render: () => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gap = "var(--rowan-space-4)";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(12rem, 1fr))";
    row.append(
      createCard({ label: "Neutral", value: 12, delta: 0, deltaLabel: "vs last week" }),
      createCard({
        label: "Resolved",
        value: 86,
        delta: 12,
        deltaLabel: "vs last week",
        tone: "success",
      }),
      createCard({
        label: "Open",
        value: 19,
        delta: -4,
        deltaLabel: "vs last week",
        tone: "danger",
      }),
    );
    return row;
  },
};

export const EmptyAndLoading = {
  render: () => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gap = "var(--rowan-space-4)";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(12rem, 1fr))";
    row.append(
      createCard({ label: "No data yet", value: null }),
      createCard({ label: "Refreshing", value: 128, loading: true }),
    );
    return row;
  },
};

export const WithChartSlot = {
  render: () => {
    const card = createCard({
      label: "Open incidents",
      value: 19,
      delta: -4,
      deltaLabel: "vs last week",
      tone: "warning",
    });
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
  render: () => withVibrantChartPalette(Tones.render()),
};
