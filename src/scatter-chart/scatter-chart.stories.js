import "./scatter-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createScatter({
  label = "Dwell vs fill",
  description = "Bubble size is pallet count. Null x or y is no-data.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-scatter-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.series = [
    {
      id: "north",
      label: "North",
      points: [
        { x: 12, y: 64, size: 8, label: "Dock 1" },
        { x: 18, y: 72, size: 14, label: "Dock 2" },
        { x: 9, y: 58, size: 6, label: "Dock 3" },
      ],
    },
    {
      id: "south",
      label: "South",
      points: [
        { x: 22, y: 81, size: 11, label: "Dock 4" },
        { x: 15, y: 70, size: null, label: "Dock 5" },
        { x: null, y: 90, size: 4, label: "Skipped" },
      ],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Scatter Chart",
  component: "rowan-scatter-chart",
  tags: ["autodocs"],
  args: {
    label: "Dwell vs fill",
    description: "Bubble size is pallet count. Null x or y is no-data.",
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
    steps: ["Activate a point with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createScatter(args),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createScatter(args)),
};
