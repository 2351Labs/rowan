import "./waterfall-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createWaterfall({
  label = "Lane cash movement",
  description = "Totals are authored. The host does not invent them.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-waterfall-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Start", "Inbound", "Damage", "Hold", "End"];
  chart.series = [
    {
      id: "cash",
      label: "Cash",
      values: [{ value: 40, type: "total" }, 18, -7, null, { value: 51, type: "total" }],
    },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Waterfall Chart",
  component: "rowan-waterfall-chart",
  tags: ["autodocs"],
  args: {
    label: "Lane cash movement",
    description: "Totals are authored. The host does not invent them.",
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
    steps: ["Activate a bar with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createWaterfall(args),
};

export const DeltasOnly = {
  name: "Deltas only",
  parameters: Playground.parameters,
  render: (args) => {
    const chart = createWaterfall(args);
    chart.labels = ["Mon", "Tue", "Wed"];
    chart.series = [{ id: "cash", label: "Cash", values: [12, -4, 6] }];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createWaterfall(args)),
};
