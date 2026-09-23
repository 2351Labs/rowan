import "./stacked-bar-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

export default {
  title: "Components/Data Display/Stacked Bar Chart",
  tags: ["autodocs"],
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a segment with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: () => {
    const chart = document.createElement("rowan-stacked-bar-chart");
    chart.label = "Incidents by day";
    chart.description = "Series stack from zero. Null is no-data.";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    chart.series = [
      { id: "p1", label: "P1", values: [2, 1, 0, 3, 1] },
      { id: "p2", label: "P2", values: [4, 5, 2, 1, 3] },
      { id: "p3", label: "P3", values: [6, 4, null, 5, 4] },
    ];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: () => withVibrantChartPalette(Playground.render()),
};
