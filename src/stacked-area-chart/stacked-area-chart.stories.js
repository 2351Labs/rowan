import "./stacked-area-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createStackedAreaChart({
  label = "Incidents by day",
  description = "Series stack from zero. Null is no-data.",
  interactive = true,
  stackMode = "absolute",
} = {}) {
  const chart = document.createElement("rowan-stacked-area-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.stackMode = stackMode;
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "p1", label: "P1", values: [2, 1, 0, 3, 1] },
    { id: "p2", label: "P2", values: [4, 5, 2, 1, 3] },
    { id: "p3", label: "P3", values: [6, 4, null, 5, 4] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Stacked Area Chart",
  component: "rowan-stacked-area-chart",
  tags: ["autodocs"],
  args: {
    label: "Incidents by day",
    description: "Series stack from zero. Null is no-data.",
    interactive: true,
    stackMode: "absolute",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    stackMode: { control: "inline-radio", options: ["absolute", "normalized"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createStackedAreaChart(args),
};

export const Normalized = {
  args: {
    stackMode: "normalized",
    description: "Each day fills to 100%. The table still shows raw counts.",
  },
  parameters: Playground.parameters,
  render: (args) => createStackedAreaChart(args),
};

export const ReferenceLines = {
  render: (args) => {
    const chart = createStackedAreaChart({
      ...args,
      description: "Dashed overlay is the daily capacity target.",
    });
    chart.referenceLines = [{ value: 10, label: "Capacity", tone: "warning" }];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createStackedAreaChart(args)),
};
