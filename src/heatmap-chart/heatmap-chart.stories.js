import "./heatmap-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createHeatmap({
  label = "Lane dwell by hour",
  description = "Single-hue intensity. Null is no-data.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-heatmap-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.rows = ["North", "East", "South"];
  chart.columns = ["06:00", "09:00", "12:00", "15:00"];
  chart.values = [
    [12, 28, 18, null],
    [9, 22, 31, 14],
    [4, 11, 16, 8],
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Heatmap Chart",
  component: "rowan-heatmap-chart",
  tags: ["autodocs"],
  args: {
    label: "Lane dwell by hour",
    description: "Single-hue intensity. Null is no-data.",
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
    steps: ["Activate a cell with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createHeatmap(args),
};

export const FromPoints = {
  name: "From points",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = createHeatmap(args);
    chart.points = [
      { x: "Dock 1", y: "Mon", value: 4 },
      { x: "Dock 2", y: "Mon", value: 9 },
      { x: "Dock 1", y: "Tue", value: null },
      { x: "Dock 2", y: "Tue", value: 6 },
    ];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createHeatmap(args)),
};
