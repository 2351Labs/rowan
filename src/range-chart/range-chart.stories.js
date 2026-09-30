import "./range-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createRange({
  label = "Dwell window",
  description = "Low and high per category. Null low or high is no-data.",
  interactive = true,
  variant = "bar",
} = {}) {
  const chart = document.createElement("rowan-range-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  if (variant !== "bar") chart.variant = variant;
  chart.labels = ["Mon", "Tue", "Wed", "Thu"];
  chart.series = [
    {
      id: "actual",
      label: "Actual",
      values: [
        { low: 8, high: 18 },
        { low: 10, high: 22 },
        { low: null, high: 16 },
        { low: 9, high: 15 },
      ],
    },
    {
      id: "sla",
      label: "SLA",
      values: [
        { low: 6, high: 20 },
        { low: 6, high: 20 },
        { low: 6, high: 20 },
        { low: 6, high: 20 },
      ],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Range Chart",
  component: "rowan-range-chart",
  tags: ["autodocs"],
  args: {
    label: "Dwell window",
    description: "Low and high per category. Null low or high is no-data.",
    interactive: true,
    variant: "bar",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    variant: { control: "select", options: ["bar", "area"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a range with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createRange(args),
};

export const Area = {
  name: "Area",
  parameters: Playground.parameters,
  render: (args) => createRange({ ...args, variant: "area" }),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createRange(args)),
};
