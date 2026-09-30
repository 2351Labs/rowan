import "./donut-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createDonutChart({
  label = "Incident sources",
  interactive = true,
  variant = "donut",
} = {}) {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = label;
  chart.interactive = Boolean(interactive);
  chart.variant = variant;
  chart.labels = ["App", "Email", "Phone"];
  chart.series = [{ id: "sources", label: "Sources", values: [12, -3, 8] }];
  return chart;
}

export default {
  title: "Components/Data Display/Donut Chart",
  component: "rowan-donut-chart",
  tags: ["autodocs"],
  args: {
    label: "Incident sources",
    interactive: true,
    variant: "donut",
  },
  argTypes: {
    label: { control: "text" },
    interactive: { control: "boolean" },
    variant: { control: "inline-radio", options: ["donut", "pie"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a slice control, then open the data table."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createDonutChart(args),
};

export const Pie = {
  args: { variant: "pie" },
  parameters: Playground.parameters,
  render: (args) => createDonutChart(args),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createDonutChart(args)),
};
