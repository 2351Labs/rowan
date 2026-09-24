import "./area-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createAreaChart({
  label = "Throughput",
  description = "Filled series. Nulls break the fill.",
  interactive = true,
} = {}) {
  const chart = document.createElement("rowan-area-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  chart.series = [
    { id: "inbound", label: "Inbound", values: [18, 24, null, 12, 20] },
    { id: "outbound", label: "Outbound", values: [10, 14, 16, 9, 11] },
  ];
  return chart;
}

export default {
  title: "Components/Data Display/Area Chart",
  component: "rowan-area-chart",
  tags: ["autodocs"],
  args: {
    label: "Throughput",
    description: "Filled series. Nulls break the fill.",
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
  render: (args) => createAreaChart(args),
};

export const ReferenceLines = {
  render: (args) => {
    const chart = createAreaChart({
      ...args,
      description: "Dashed overlay is the throughput target.",
    });
    chart.referenceLines = [{ value: 16, label: "Target", tone: "danger" }];
    return chart;
  },
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createAreaChart(args)),
};
