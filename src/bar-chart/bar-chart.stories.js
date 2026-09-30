import "./bar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createBarChart({
  label = "Incidents by day",
  description = "Incoming versus resolved.",
  interactive = true,
  orientation = "vertical",
} = {}) {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.orientation = orientation;
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "incoming", label: "Incoming", values: [18, 24, null, 12, 15] },
    { id: "resolved", label: "Resolved", values: [13, 19, 20, 15, 16] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Bar Chart",
  component: "rowan-bar-chart",
  tags: ["autodocs"],
  args: {
    label: "Incidents by day",
    description: "Incoming versus resolved.",
    interactive: true,
    orientation: "vertical",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a bar with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createBarChart(args),
};

export const Horizontal = {
  args: { orientation: "horizontal" },
  parameters: Playground.parameters,
  render: (args) => createBarChart(args),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createBarChart(args)),
};
