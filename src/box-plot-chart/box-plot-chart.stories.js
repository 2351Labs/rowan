import "./box-plot-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createBoxPlot({
  label = "Lane dwell",
  description = "Five-number summaries are authored. The host does not compute quartiles.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-box-plot-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["North", "South", "West"];
  chart.series = [
    {
      id: "dwell",
      label: "Dwell",
      values: [
        { min: 4, q1: 8, median: 12, q3: 16, max: 22, outliers: [30] },
        { min: 6, q1: 9, median: 11, q3: 15, max: 19 },
        { min: 3, q1: 7, median: 10, q3: 14, max: 18, outliers: [1, 26] },
      ],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Box Plot Chart",
  component: "rowan-box-plot-chart",
  tags: ["autodocs"],
  args: {
    label: "Lane dwell",
    description: "Five-number summaries are authored. The host does not compute quartiles.",
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
    steps: ["Activate a box with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createBoxPlot(args),
};

export const Grouped = {
  name: "Grouped series",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = createBoxPlot(args);
    chart.series = [
      {
        id: "inbound",
        label: "Inbound",
        values: [
          { min: 4, q1: 8, median: 12, q3: 16, max: 22 },
          { min: 6, q1: 9, median: 11, q3: 15, max: 19 },
          { min: 3, q1: 7, median: 10, q3: 14, max: 18 },
        ],
      },
      {
        id: "outbound",
        label: "Outbound",
        values: [
          { min: 2, q1: 5, median: 8, q3: 12, max: 16, outliers: [24] },
          { min: 3, q1: 6, median: 9, q3: 13, max: 17 },
          { min: 1, q1: 4, median: 7, q3: 11, max: 15 },
        ],
      },
    ];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createBoxPlot(args)),
};
