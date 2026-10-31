import "./trend-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";
import { coverageStories } from "../../stories/chart-galleries.js";

const ON_CALL_SERIES = [
  {
    id: "incoming",
    label: "Incoming incidents",
    values: [18, 24, 17, 12, 15, 9],
  },
  {
    id: "resolved",
    label: "Resolved incidents",
    values: [13, 19, 20, 15, 16, 12],
  },
];

const DAILY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function createChart({
  series = ON_CALL_SERIES,
  labels = DAILY_LABELS,
  interactive = true,
  label = "On-call workload",
  description = "Incoming and resolved incidents by day.",
  locale = "en-US",
} = {}) {
  const chart = document.createElement("rowan-trend-chart");
  chart.label = label;
  chart.description = description;
  chart.locale = locale;
  chart.series = series;
  chart.labels = labels;
  chart.interactive = interactive;
  chart.valueFormatter = (value, context) => (context.tick ? String(value) : `${value} incidents`);
  return chart;
}

export default {
  title: "Components/Data Display/Trend Chart",
  tags: ["autodocs"],
  component: "rowan-trend-chart",
  argTypes: {
    locale: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
  },
  args: {
    label: "On-call workload",
    description: "Incoming and resolved incidents by day.",
    locale: "en-US",
    interactive: true,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Focus a point, move with Arrow keys, then activate it with Enter or Space."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createChart(args),
};

export const ServiceHealthComparison = {
  parameters: createEventScriptParameters({
    steps: ["Compare daily incident flow, then open the data table for the same values."],
    events: ["rowan-point-activate"],
  }),
  render: () => createChart(),
};

export const MissingData = {
  parameters: createEventScriptParameters({
    steps: ["Inspect the broken line and No data table cell, then focus an available point."],
    events: ["rowan-point-activate"],
  }),
  render: () =>
    createChart({
      labels: DAILY_LABELS,
      series: [
        {
          id: "incoming",
          label: "Incoming incidents",
          values: [18, 24, null, 12, 15, 9],
        },
        {
          id: "resolved",
          label: "Resolved incidents",
          values: [13, 19, 20, 15, 16, 12],
        },
      ],
    }),
};

export const NonInteractiveSnapshot = {
  render: () => {
    const chart = createChart({ interactive: false });
    chart.label = "Weekly incident snapshot";
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(Playground.render(args)),
};

const chartFixtures = coverageStories["rowan-trend-chart"];
export const FixtureCatalog = chartFixtures.catalog;
export const FixtureSparse = chartFixtures.sparse;
export const FixtureNegative = chartFixtures.negative;
export const FixtureLargeNumbers = chartFixtures.largeNumbers;
export const FixtureEmpty = chartFixtures.empty;
export const FixtureError = chartFixtures.error;
export const FixtureSlots = chartFixtures.slots;

export const FixtureInteraction = chartFixtures.interaction;
