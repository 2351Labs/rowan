import "./stacked-bar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createStackedBarChart({
  label = "Incidents by day",
  description = "Series stack from zero. Null is no-data.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-stacked-bar-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "p1", label: "P1", values: [2, 1, 0, 3, 1] },
    { id: "p2", label: "P2", values: [4, 5, 2, 1, 3] },
    { id: "p3", label: "P3", values: [6, 4, null, 5, 4] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Stacked Bar Chart",
  component: "rowan-stacked-bar-chart",
  tags: ["autodocs"],
  args: {
    label: "Incidents by day",
    description: "Series stack from zero. Null is no-data.",
    interactive: true,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a segment with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createStackedBarChart(args),
};

export const ReferenceLines = {
  render: (args) => {
    const chart = createStackedBarChart({
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
  render: (args) => withVibrantChartPalette(createStackedBarChart(args)),
};
