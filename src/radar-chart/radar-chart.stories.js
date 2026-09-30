import "./radar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createRadar({
  label = "Yard profile",
  description = "Axes around the ring. Null is no-data.",
  interactive = true,
  geometry = "line",
} = {}) {
  const chart = document.createElement("rowan-radar-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  if (geometry !== "line") chart.geometry = geometry;
  chart.labels = ["Fill", "Dwell", "Damage", "OTD", "Turns"];
  chart.series = [
    { id: "north", label: "North", values: [82, 44, 18, 76, 61] },
    { id: "south", label: "South", values: [64, 58, 12, 88, 40] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Radar Chart",
  component: "rowan-radar-chart",
  tags: ["autodocs"],
  args: {
    label: "Yard profile",
    description: "Axes around the ring. Null is no-data.",
    interactive: true,
    geometry: "line",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    geometry: { control: "inline-radio", options: ["line", "area"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a vertex with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createRadar(args),
};

export const Area = {
  name: "Area",
  parameters: Playground.parameters,
  render: (args) => createRadar({ ...args, geometry: "area" }),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createRadar(args)),
};
