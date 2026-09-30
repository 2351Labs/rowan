import "./funnel-chart.js";
import { createEventScriptParameters } from "../storybook/event-script.js";
import { withVibrantChartPalette } from "../storybook/chart-palette.js";

function createFunnel({
  label = "Inbound conversion",
  description = "Stages stay in input order. Null and negatives are no-data.",
  interactive = true,
  variant = "funnel",
} = {}) {
  const chart = document.createElement("rowan-funnel-chart");
  chart.label = label;
  chart.description = description;
  chart.interactive = Boolean(interactive);
  chart.variant = variant;
  chart.labels = ["Leads", "Qualified", "Quoted", "Won"];
  chart.series = [{ id: "flow", label: "Flow", values: [120, 64, null, 18] }];
  return chart;
}

export default {
  title: "Components/Data Display/Funnel Chart",
  component: "rowan-funnel-chart",
  tags: ["autodocs"],
  args: {
    label: "Inbound conversion",
    description: "Stages stay in input order. Null and negatives are no-data.",
    interactive: true,
    variant: "funnel",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    interactive: { control: "boolean" },
    variant: { control: "inline-radio", options: ["funnel", "cone", "pyramid"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate a stage with the pointer or keyboard."],
    events: ["rowan-point-activate"],
  }),
  render: (args) => createFunnel(args),
};

export const Cone = {
  args: { variant: "cone" },
  parameters: Playground.parameters,
  render: (args) => createFunnel(args),
};

export const Pyramid = {
  args: { variant: "pyramid" },
  parameters: Playground.parameters,
  render: (args) => createFunnel(args),
};

export const VibrantPalette = {
  name: "Vibrant palette",
  parameters: Playground.parameters,
  render: (args) => withVibrantChartPalette(createFunnel(args)),
};
