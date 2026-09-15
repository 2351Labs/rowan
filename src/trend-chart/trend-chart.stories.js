import "./trend-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

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

function createChart({ series = ON_CALL_SERIES, labels = DAILY_LABELS, interactive = true } = {}) {
  const chart = document.createElement("rowan-trend-chart");
  chart.label = "On-call workload";
  chart.description = "Incoming and resolved incidents by day.";
  chart.series = series;
  chart.labels = labels;
  chart.interactive = interactive;
  chart.valueFormatter = (value, context) => (context.tick ? String(value) : `${value} incidents`);
  return chart;
}

export default {
  title: "Components/Data Display/Trend Chart",
  tags: ["autodocs"],
  argTypes: {
    interactive: { control: "boolean" },
  },
  args: {
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
