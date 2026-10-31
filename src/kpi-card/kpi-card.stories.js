import "./kpi-card.js";
import "../sparkline/sparkline.js";
import "../column-sparkline/column-sparkline.js";
import "../bullet-chart/bullet-chart.js";
import "../gauge-chart/gauge-chart.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";

function sampleRanges() {
  return [
    { from: 0, to: 60, label: "Poor", tone: "danger" },
    { from: 60, to: 80, label: "Fair", tone: "warning" },
    { from: 80, to: 100, label: "Good", tone: "success" },
  ];
}

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

function appendSparkline(card, { values, label, target } = {}) {
  const chart = document.createElement("rowan-sparkline");
  chart.slot = "chart";
  chart.label = label ?? "Open incidents this week";
  chart.values = values ?? [18, 24, 12, 15, 9, 11];
  if (target !== undefined) chart.target = target;
  card.append(chart);
  return card;
}

function appendColumnSparkline(card, { values, label } = {}) {
  const chart = document.createElement("rowan-column-sparkline");
  chart.slot = "chart";
  chart.label = label ?? "Tickets opened this week";
  chart.values = values ?? [42, 38, 51, 47, 55, 49];
  card.append(chart);
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
    locale: { control: "text" },
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
    row.style.gap = "var(--rowan-space-4)";
    row.style.display = "grid";
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
    return appendSparkline(card);
  },
};

export const WidthDensities = {
  name: "Width densities",
  render: () => {
    const row = document.createElement("div");
    row.style.alignItems = "start";
    row.style.display = "grid";
    row.style.gap = "var(--rowan-space-4)";
    row.style.gridTemplateColumns = "8rem 12rem 16rem 24rem";

    for (const width of ["8rem", "12rem", "16rem", "24rem"]) {
      const cell = document.createElement("div");
      cell.style.display = "grid";
      cell.style.gap = "var(--rowan-space-2)";
      const caption = document.createElement("p");
      caption.style.color = "var(--rowan-color-muted)";
      caption.style.fontSize = "var(--rowan-font-size-sm)";
      caption.style.margin = "0";
      caption.textContent = width;
      const card = createCard({
        label: "Open incidents",
        value: 19,
        delta: -4,
        deltaLabel: "vs last week",
        tone: "warning",
        description: "Unacknowledged incidents in the current window.",
      });
      appendSparkline(card);
      cell.append(caption, card);
      row.append(cell);
    }

    return row;
  },
};

export const CompactCharts = {
  name: "Compact charts",
  render: () => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gap = "var(--rowan-space-4)";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(14rem, 22rem))";

    const spark = createCard({
      label: "Open incidents",
      value: 11,
      delta: -7,
      deltaLabel: "vs last week",
      tone: "warning",
    });
    appendSparkline(spark);

    const columns = createCard({
      label: "Tickets opened",
      value: 49,
      delta: -6,
      deltaLabel: "vs last week",
      tone: "info",
    });
    appendColumnSparkline(columns);

    const versus = createCard({
      label: "Net energy",
      value: -2.4,
      delta: 1.1,
      deltaLabel: "vs target",
    });
    appendSparkline(versus, {
      label: "Energy versus target",
      values: [2.1, 4.8, -1.2, 3.4, -3.8, 1.1, -2.4],
      target: 0,
    });

    const fill = createCard({
      label: "Fill rate",
      value: 82,
      delta: -8,
      deltaLabel: "vs target",
      tone: "success",
    });
    const bullet = document.createElement("rowan-bullet-chart");
    bullet.slot = "chart";
    bullet.label = "Fill rate versus target";
    bullet.value = 82;
    bullet.target = 90;
    bullet.ranges = sampleRanges();
    fill.append(bullet);

    const util = createCard({
      label: "Utilization",
      value: 72,
      delta: -8,
      deltaLabel: "vs target",
      tone: "warning",
    });
    const gauge = document.createElement("rowan-gauge-chart");
    gauge.slot = "chart";
    gauge.label = "Utilization versus target";
    gauge.min = 0;
    gauge.max = 100;
    gauge.value = 72;
    gauge.target = 80;
    gauge.ranges = sampleRanges();
    util.append(gauge);

    row.append(spark, columns, versus, fill, util);
    return row;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  render: () => withVibrantChartPalette(Tones.render()),
};

const chartFixtures = coverageStories["rowan-kpi-card"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureTones = chartFixtures.tones;
export const FixtureNegative = chartFixtures.negative;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureLoading = chartFixtures.loading;
export const FixtureError = chartFixtures.error;
